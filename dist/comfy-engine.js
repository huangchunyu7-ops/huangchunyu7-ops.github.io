/* Workflow inspection only: no code execution, model loading, external asset
 * fetching or queue submission. UI graphs and API prompts remain distinct. */
(function(root){
 'use strict';
 const LIMIT={bytes:5*1024*1024,nodes:2000,links:8000,graphs:80};
 const text=(v,max=500)=>String(v??'').slice(0,max);
 const type=v=>Array.isArray(v)?'COMBO':typeof v==='string'?text(v,100):'未知';
 function port(p,i){return {name:text(p?.name??p?.label??('端口 '+i),120),type:type(p?.type),slot:i};}
 function normalize(raw){
  if(typeof raw==='string'){if(raw.length>LIMIT.bytes||(typeof TextEncoder!=='undefined'&&new TextEncoder().encode(raw).byteLength>LIMIT.bytes))throw Error('工作流过大，请导出较小的 JSON（最多 5 MiB）。');try{raw=JSON.parse(raw);}catch{throw Error('JSON 格式不完整。请导出工作流 JSON，不要粘贴网页 HTML 或 Python 代码。');}}
  if(!raw||typeof raw!=='object'||Array.isArray(raw))throw Error('需要 ComfyUI 工作流 JSON 对象。');
  if(raw.workflow?.nodes)raw=raw.workflow;
  const isUI=Array.isArray(raw.nodes),api=raw.prompt&&typeof raw.prompt==='object'?raw.prompt:raw;
  const definitions=isUI&&Array.isArray(raw.definitions?.subgraphs)?raw.definitions.subgraphs:[];
  if(definitions.length>LIMIT.graphs)throw Error('子图数量超过解析范围。');
  const scopes=isUI?[{...raw,id:'main',name:'主工作流'},...definitions]:[{id:'main',name:'API 执行图',api}];
  let total=0,totalLinks=0;
  const graphs=scopes.map((scope,gi)=>{
   const nodes=[],edges=[],warnings=[],seen=new Set();
   const rows=isUI?scope.nodes:Object.entries(api).filter(([,n])=>n&&typeof n==='object'&&typeof n.class_type==='string').map(([id,n])=>({...n,id}));
   if(!Array.isArray(rows)||!rows.length){if(gi===0)throw Error('没有找到 nodes 或 class_type。请检查文件是否为工作流或 API 格式。');return null;}
   total+=rows.length;if(total>LIMIT.nodes)throw Error('节点总数超过 2000，请拆分工作流后导入。');
   for(const n of rows){
    if(n.id===null||n.id===undefined)throw Error('存在没有 ID 的节点，无法可靠关联连线。');
    const id=text(n.id,160);if(seen.has(id))throw Error('同一图内有重复节点 ID：'+id);seen.add(id);
    nodes.push({id,type:text(n.type??n.class_type,200),title:text(n.title??n._meta?.title??n.type??n.class_type,300),inputs:isUI?(n.inputs||[]).map(port):[],outputs:isUI?(n.outputs||[]).map(port):[],widgets:isUI?n.widgets_values:n.inputs,mode:n.mode??0,annotation:/^(MarkdownNote|Note)$/.test(n.type),boundary:false});
   }
   // A subgraph's virtual boundary uses these actual IDs in ComfyUI's schema.
   if(gi>0){for(const [id,title,inputs,outputs] of [['-10','子图输入',[],scope.inputs||[]],['-20','子图输出',scope.outputs||[],[]]]){if(seen.has(id))continue;seen.add(id);nodes.push({id,type:'SubgraphBoundary',title,inputs:inputs.map(port),outputs:outputs.map(port),widgets:null,mode:0,boundary:true,annotation:false});}}
   const byId=new Map(nodes.map(n=>[n.id,n]));
   function add(e){if(++totalLinks>LIMIT.links)throw Error('连线总数超过 8000，请拆分后导入。');edges.push(e);}
   if(isUI){if(!Array.isArray(scope.links))throw Error('工作流 links 应为数组。');for(const [i,l] of scope.links.entries()){
    if(!l||typeof l!=='object'){warnings.push('忽略了一条格式损坏的连线。');continue;}
    const tuple=Array.isArray(l),source=tuple?l[1]:l.origin_id,target=tuple?l[3]:l.target_id,sourceSlot=tuple?l[2]:l.origin_slot,targetSlot=tuple?l[4]:l.target_slot;
    if(source===undefined||target===undefined||!Number.isInteger(sourceSlot)||!Number.isInteger(targetSlot)||sourceSlot<0||targetSlot<0){warnings.push('一条连线缺少有效的端点或槽位：'+i);continue;}
    add({id:text(tuple?l[0]:l.id??i,160),source:text(source,160),sourceSlot,target:text(target,160),targetSlot,type:type(tuple?l[5]:l.type),virtual:false});
   }}else{
    for(const n of nodes){for(const [name,value] of Object.entries(n.widgets||{})){
     const ref=Array.isArray(value)&&value.length===2&&(typeof value[0]==='string'||typeof value[0]==='number')&&Number.isInteger(value[1])&&value[1]>=0;
     const slot=n.inputs.length;n.inputs.push({name:text(name,120),type:'未知',slot,widget:!ref});
     if(ref)add({id:n.id+':'+name,source:text(value[0],160),sourceSlot:value[1],target:n.id,targetSlot:slot,type:'未知',virtual:false});
    }}
   }
   for(const e of edges){const a=byId.get(e.source),b=byId.get(e.target);if(!a||!b){warnings.push('悬空连线 '+e.id+'：找不到源节点或目标节点。');e.dangling=true;continue;}
    const output=a.outputs[e.sourceSlot],input=b.inputs[e.targetSlot];
    if(isUI&&(!output||!input))warnings.push('连线 '+e.id+' 的槽位未在节点端口列表中声明。');
    e.sourceName=output?.name??'输出槽 '+e.sourceSlot;e.targetName=input?.name??'输入槽 '+e.targetSlot;
    if(e.type==='未知')e.type=output?.type??'未知';
    if(output&&input&&!compatible(output.type,input.type))warnings.push('类型需核对：'+a.title+'.'+output.name+' ('+output.type+') → '+b.title+'.'+input.name+' ('+input.type+')');
   }
   const degree=new Map(nodes.map(n=>[n.id,0])),adj=new Map(nodes.map(n=>[n.id,[]]));
   for(const e of edges.filter(e=>!e.dangling)){degree.set(e.target,degree.get(e.target)+1);adj.get(e.source).push(e.target);}
   const queue=nodes.filter(n=>degree.get(n.id)===0).map(n=>n.id),order=[];
   for(let i=0;i<queue.length;i++){const id=queue[i];order.push(id);for(const next of adj.get(id)){degree.set(next,degree.get(next)-1);if(degree.get(next)===0)queue.push(next);}}
   if(order.length<nodes.length)warnings.push(nodes.some(n=>definitions.some(d=>String(d.id)===n.type))?'此层存在子图级回接。子图的不同输出可有不同依赖，主图看似回环不等于内部执行必然成环；请展开子图逐端口核对。':'存在依赖环或需插件处理的特殊连接，无法给出完整拓扑顺序。');
   if(nodes.some(n=>n.type==='SetNode'||n.type==='GetNode'))warnings.push('本图含 Set / Get 隐式中转。实体连线不会展示这些隐藏关系，需对照同名变量和节点包实现。');
   if(nodes.some(n=>[2,4].includes(n.mode)))warnings.push('本图有禁用或绕过节点；静态连线图不代表它们本次一定执行。');
   return {id:text(scope.id,160),name:text(scope.name||'子图 '+gi,200),nodes,edges,warnings:[...new Set(warnings)],order};
  }).filter(Boolean);
  const ids=new Set(graphs.slice(1).map(g=>g.id));
  for(const g of graphs)for(const n of g.nodes)if(ids.has(n.type)){n.subgraph=n.type;const sub=graphs.find(x=>x.id===n.type);n.title=n.title===n.type?sub.name:n.title;}
  return {format:isUI?'界面工作流':'API 执行图',graphs,totalNodes:graphs.reduce((s,g)=>s+g.nodes.filter(n=>!n.boundary).length,0),totalLinks};
 }
 function compatible(a,b){return a==='未知'||b==='未知'||a==='*'||b==='*'||String(a).split(',').some(t=>String(b).split(',').map(x=>x.trim()).includes(t.trim()));}
 function trace(graph,id,direction='upstream'){
  const result=[],seen=new Set([String(id)]),queue=[String(id)];
  for(let i=0;i<queue.length;i++)for(const e of graph.edges){if(e.dangling)continue;const match=direction==='upstream'?e.target===queue[i]:e.source===queue[i],next=direction==='upstream'?e.source:e.target;if(match&&!seen.has(next)){seen.add(next);queue.push(next);result.push(next);}}
  return result;
 }
 function framePlan(frames,fps,grid='none'){
  if(!Number.isFinite(frames)||frames<1||frames>100000||!Number.isFinite(fps)||fps<=0||fps>240)throw Error('请输入有效帧数（1–100000）与帧率（大于 0，最多 240）。');
  const requested=Math.ceil(frames),step=grid==='h3'?17:grid==='wan'?4:1,offset=grid==='h3'?5:grid==='wan'?1:0;
  const aligned=grid==='none'?requested:Math.max(offset,Math.ceil((requested-offset)/step)*step+offset);
  return {requested,aligned,fps,duration:aligned/fps};
 }
 const api={normalize,trace,compatible,framePlan,LIMIT};root.ComfyLab=api;if(typeof module!=='undefined'&&module.exports)module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);

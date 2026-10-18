/* Bounded teaching interpreter; no shell, network or database access. */
const evidenceOrders=[{id:41,order_no:'LAB-41',status:'PENDING',amount:'12.00'},{id:42,order_no:'LAB-42',status:'PAID',amount:'29.50'},{id:43,order_no:'LAB-43',status:'CANCELLED',amount:'8.00'}];
const evidenceColumns=['id','order_no','status','amount'];
function evidenceResult(signature,out){return {signature:JSON.stringify(signature),out};}
function evidenceSQL(raw){
 const sql=raw.trim().replace(/;\s*$/,'');
 if(!/^(SELECT|SHOW)\b/i.test(sql))throw Error('本课只支持列出的只读 SELECT 与 SHOW；不执行修改、删除或多条 SQL。');
 if(/[;`]|--|\/\*/.test(sql))throw Error('请一次输入一条只读查询；本课不支持多语句、注释或反引号。');
 const identity=sql.match(/^SELECT\s+(.+)$/is);
 if(identity&&!/\bFROM\b/i.test(sql)){
  const cols=identity[1].split(',').map(s=>s.replace(/\s/g,'').toLowerCase()),fields={'database()':'order_lab','current_user()':'reader@%','@@hostname':'db-lab','@@port':'3306'};
  if(!cols.length||cols.some(c=>!Object.hasOwn(fields,c))||new Set(cols).size!==cols.length)throw Error('连接信息只支持 DATABASE()、CURRENT_USER()、@@hostname、@@port，注意括号与逗号。');
  return evidenceResult(['mysql','identity',[...cols].sort()],cols.join('\t')+'\n'+cols.map(c=>fields[c]).join('\t'));
 }
 if(/^SHOW\s+TABLES\s+FROM\s+order_lab$/i.test(sql))return evidenceResult(['mysql','tables','order_lab'],'Tables_in_order_lab\norders\norder_items');
 if(/^SHOW\s+COLUMNS\s+FROM\s+order_lab\.orders$/i.test(sql))return evidenceResult(['mysql','columns','order_lab.orders'],'Field\tType\tNull\tKey\nid\tbigint\tNO\tPRI\norder_no\tvarchar(32)\tNO\tUNI\nstatus\tvarchar(16)\tNO\namount\tdecimal(10,2)\tNO');
 const m=sql.match(/^SELECT\s+([\w\s,*]+)\s+FROM\s+order_lab\.orders(?:\s+WHERE\s+(\w+)\s*=\s*('(?:[^']|'')*'|\d+))?\s*$/i);
 if(!m)throw Error('本课支持 SELECT 列名 FROM order_lab.orders，可选 WHERE 列名 = 整数或单引号文本。请核对库名、表名、字段与引号；不支持 JOIN、函数、UPDATE。');
 const cols=m[1].trim()==='*'?[...evidenceColumns]:m[1].split(',').map(s=>s.trim().toLowerCase());
 if(cols.some(c=>!evidenceColumns.includes(c))||new Set(cols).size!==cols.length)throw Error('可读取列为 id、order_no、status、amount；请核对拼写，且不要重复投影列。');
 const field=m[2]?.toLowerCase();if(field&&!evidenceColumns.includes(field))throw Error('WHERE 列不存在：'+field+'。本课字段是 id、order_no、status、amount。');
 let value=m[3];if(value?.startsWith("'"))value=value.slice(1,-1).replace(/''/g,"'");
 if(field==='id'){if(!/^\d+$/.test(value))throw Error('本课 id 条件使用非负整数。');value=String(Number(value));}
 const rows=evidenceOrders.filter(r=>!field||String(r[field])===value),out=cols.join('\t')+'\n'+(rows.length?rows.map(r=>cols.map(c=>r[c]).join('\t')).join('\n'):'(0 rows)');
 return evidenceResult(['mysql','select',[...cols].sort(),field||null,value??null],out);
}
function evidenceArgs(tokens,definitions){
 const flags={},args=[];
 for(let i=0;i<tokens.length;i++){
  const token=tokens[i];if(!token.startsWith('-')){args.push(token);continue;}
  const eq=token.indexOf('='),name=eq<0?token:token.slice(0,eq),def=definitions[name];
  if(!def)throw Error('本课尚未支持选项 '+name+'；请核对当前任务，不要追加其他操作。');
  const [key,takesValue]=def;if(Object.hasOwn(flags,key))throw Error('选项重复：'+name+'。请只指定一次，避免条件冲突。');
  if(takesValue){const v=eq<0?tokens[++i]:token.slice(eq+1);if(!v||v.startsWith('-'))throw Error(name+' 后缺少值。');flags[key]=v;}
  else{if(eq>=0)throw Error(name+' 是无值开关，本课不接受等号赋值。');flags[key]=true;}
 }
 return {flags,args};
}
function evidenceDocker(tokens){
 const ts=tokens.slice(1),containerSyntax=ts[0]==='container';if(containerSyntax)ts.shift();let action=ts.shift();if(containerSyntax&&['ls','list'].includes(action))action='ps';
 const {flags,args}=evidenceArgs(ts,action==='ps'?{'-a':['all',false],'--all':['all',false]}:action==='logs'?{'--tail':['tail',true]}:{});
 if(action==='ps'){
  if(args.length)throw Error('ps 后不接容器名；它列出容器，-a 或 --all 包含已停止对象。');
  return evidenceResult(['docker','ps',!!flags.all],'NAMES\tIMAGE\tSTATUS\nweb-lab\tweb:lab\tUp 10 minutes'+(flags.all?'\norder-lab\torder-app:lab\tExited (1) 2 minutes ago':''));
 }
 if(!['logs','inspect','port'].includes(action))throw Error('本课支持 docker ps、logs、inspect、port；不执行 restart、rm、run 等变更。');
 if(args.length!==1)throw Error(action+' 后需要且只需要一个容器名。');const name=args[0];
 if(!['order-lab','web-lab'].includes(name))throw Error('教学容器不存在：'+name+'。请核对任务对象 order-lab 或 web-lab。');
 if(action==='logs'){
  if(flags.tail!==undefined&&!/^\d+$/.test(flags.tail))throw Error('--tail 后需要非负整数行数。');
  const n=flags.tail===undefined?null:Number(flags.tail),lines=name==='order-lab'?['INFO starting order application','ERROR config file /app/config/app.yml not found','ERROR startup aborted']:['INFO listening on 0.0.0.0:80'];
  return evidenceResult(['docker','logs',name,n],(n===null?lines:n===0?[]:lines.slice(-n)).join('\n')||'(no log lines)');
 }
 if(action==='port')return evidenceResult(['docker','port',name],name==='web-lab'?'80/tcp -> 127.0.0.1:8080':'(no published ports)');
 const data=name==='order-lab'?{Name:'order-lab',State:{Status:'exited',ExitCode:1},Mounts:[{Type:'bind',Source:'/srv/order/config',Destination:'/etc/order',RW:false}]}:{Name:'web-lab',State:{Status:'running',ExitCode:0},NetworkSettings:{Ports:{'80/tcp':[{HostIp:'127.0.0.1',HostPort:'8080'}]}}};
 return evidenceResult(['docker','inspect',name],JSON.stringify(data,null,2));
}
function evidenceKubectl(tokens){
 const defs={'-n':['namespace',true],'--namespace':['namespace',true],'-o':['output',true],'--output':['output',true],'-l':['selector',true],'--selector':['selector',true],'--show-labels':['labels',false]},parsed=evidenceArgs(tokens.slice(1),defs),{flags,args}=parsed,namespace=flags.namespace||'default';
 if(args.join(' ')==='config current-context'){if(Object.keys(flags).length)throw Error('本课 current-context 不附加查询资源选项。');return evidenceResult(['kubectl','context'],'lab-cluster');}
 const action=args.shift(),aliases={po:'pods',pod:'pods',pods:'pods',svc:'service',services:'service',service:'service',endpointslice:'endpointslices',endpointslices:'endpointslices'},resource=aliases[args.shift()],name=args.shift();
 if(args.length||!['get','describe'].includes(action)||!resource)throw Error('本课支持 get pods/service/endpointslices、describe pod，以及 config current-context。请一次输入一个只读查询。');
 if(flags.output&&flags.output!=='yaml')throw Error('本课仅支持 -o yaml，不支持其他结构化格式。');
 if(flags.selector&&!/^[\w./-]+=[\w.-]+$/.test(flags.selector))throw Error('本课标签选择器只支持一个 key=value 条件。');
 if(action==='describe'){
  if(resource!=='pods'||Object.keys(flags).some(k=>k!=='namespace'))throw Error('本课 describe 仅支持 Pod 名和命名空间。');
  if(name!=='order-abc'||namespace!=='order-lab')throw Error('该范围没有本课的目标 Pod；核对命名空间 order-lab 与对象 order-abc。');
  return evidenceResult(['kubectl','describe','pods',namespace,name],'Name: order-abc\nNamespace: order-lab\nStatus: Pending\nContainer state: Waiting / ImagePullBackOff\nEvents:\n  Failed to pull image "order-app:missing": manifest unknown');
 }
 if(resource==='pods'){
  if(flags.output)throw Error('本课 Pod 列表支持默认格式与 --show-labels，不支持 -o。');
  const all=namespace==='order-lab'?[{name:'order-abc',ready:'0/1',status:'ImagePullBackOff',label:'app=order'}]:namespace==='shop-lab'?[{name:'order-web',ready:'1/1',status:'Running',label:'app=shop'}]:[];
  const rows=all.filter(r=>(!name||r.name===name)&&(!flags.selector||r.label===flags.selector));
  return evidenceResult(['kubectl','get','pods',namespace,name||null,!!flags.labels,flags.selector||null],rows.length?'NAME\tREADY\tSTATUS'+(flags.labels?'\tLABELS':'')+'\n'+rows.map(r=>r.name+'\t'+r.ready+'\t'+r.status+(flags.labels?'\t'+r.label:'')).join('\n'):'No resources found in '+namespace+' namespace.');
 }
 if(resource==='service'){
  if(flags.labels||flags.selector)throw Error('本课 Service 查询不支持标签输出或筛选，请按对象名取证。');
  if(name!=='order'||namespace!=='shop-lab')throw Error('目标 Service 不在该范围；请核对 order / shop-lab。');
  return evidenceResult(['kubectl','get','service',namespace,name,flags.output||null],flags.output==='yaml'?'apiVersion: v1\nkind: Service\nmetadata:\n  name: order\n  namespace: shop-lab\nspec:\n  selector:\n    app: order\n  ports:\n    - port: 80\n      targetPort: 8080':'NAME\tTYPE\tCLUSTER-IP\tPORT(S)\norder\tClusterIP\t10.96.0.20\t80/TCP');
 }
 if(name||flags.output||flags.labels)throw Error('本课 EndpointSlice 查询按命名空间和单个标签条件列出，不指定名称或输出格式。');
 return evidenceResult(['kubectl','get','endpointslices',namespace,flags.selector||null],'No resources found in '+namespace+' namespace.');
}
function parseEvidence(raw){
 if(typeof raw!=='string'||!raw.trim()||raw.length>2000)throw Error('请输入一条不超过 2000 字的命令。');
 if(/^(SELECT|SHOW|UPDATE|DELETE|DROP|INSERT|ALTER|CREATE)\b/i.test(raw.trim()))return evidenceSQL(raw);
 if(/[;&|`<>]|\$\(|[\r\n]/.test(raw))throw Error('本课一次执行一条只读命令，不支持管道、重定向、命令串联或替换。');
 const tokens=coachTokens(raw);if(tokens[0]==='docker')return evidenceDocker(tokens);if(tokens[0]==='kubectl')return evidenceKubectl(tokens);
 throw Error('本证据练习仅支持当前课程列出的 MySQL、Docker 或 kubectl 只读查询。');
}
const evidencePriorExecute=JobEngine.prototype.execute;
JobEngine.prototype.execute=function(raw){if(!this.evidenceMode)return evidencePriorExecute.call(this,raw);try{const r=parseEvidence(raw);this.history.push(raw);return {ok:true,out:'[教学快照 / 固定数据，不连接真实主机]\n'+r.out};}catch(e){return {ok:false,out:e.message};}};
const evidencePriorEvaluate=evaluateHubTask;
evaluateHubTask=function(task,value,job){if(!task.evidence)return evidencePriorEvaluate(task,value,job);job.evidenceMode=true;const r=job.execute(value);if(!r.ok)return r;let same=false;try{same=parseEvidence(value).signature===parseEvidence(task.command).signature;}catch{}return {ok:same&&(!task.expected||r.out.includes(task.expected)),out:r.out+(same?'\n读结果：'+task.explanation:'\n这条查询可以读取教学数据，但范围、对象、字段或参数与当前任务不同。先检查目标，再决定是否改命令。')};};
const evidencePriorOpen=openHubLesson;
openHubLesson=function(track,i){const r=evidencePriorOpen(track,i);if(hubEngine)hubEngine.evidenceMode=hubTrack==='opswork'&&!!activeHubLesson()?.evidenceLab;return r;};
if(hubEngine)hubEngine.evidenceMode=hubTrack==='opswork'&&!!activeHubLesson()?.evidenceLab;
Object.assign(commandInfo.docker[1],{'-a':'包含已停止的容器；等价长选项是 --all','--all':'包含全部状态的容器'});
Object.assign(commandInfo.kubectl[1],{'--namespace':'后面给命名空间；等价于 -n','-o':'后面指定输出格式，例如 yaml','--output':'后面指定输出格式；等价于 -o','--show-labels':'在列表中显示对象标签','-l':'后面给标签选择器，如 app=order','--selector':'后面给标签选择器；等价于 -l'});
commandInfo.SHOW=['SQL 读取对象元信息；本课支持列出表和列',{}];
const evidencePriorDescribe=describeToken;
describeToken=function(token,cmd,index){const known=evidencePriorDescribe(token,cmd,index);if(known)return known;const notes={ps:'列容器，默认主要显示运行对象。',logs:'读取对象可用的日志。',inspect:'读取容器状态与配置详情，真实输出可能含敏感信息。',port:'查看容器到宿主机的端口映射。',get:'读取资源列表或指定对象。',describe:'汇总指定资源状态与事件。',config:'读取客户端配置；本课只看当前上下文。','current-context':'显示当前 kubeconfig 上下文名称。',pods:beginnerTerms.Pod,pod:beginnerTerms.Pod,po:beginnerTerms.Pod,service:beginnerTerms.Service,svc:beginnerTerms.Service,endpointslices:beginnerTerms.EndpointSlice,yaml:'YAML 格式，用缩进表达字段层级。',TABLES:'列出指定数据库中的表。',COLUMNS:'列出指定表的字段信息。',FROM:'指定读取的数据库对象。',WHERE:'给查询限定条件。','order_lab.orders':'order_lab 数据库中的 orders 表，不是文件路径。',order_lab:'本课 MySQL 数据库名。',order_no:'订单号字段，本课值如 LAB-42。',status:'状态字段，本课值如 PAID 或 PENDING。',id:'本课整数主键，用来唯一定位记录。','=':'等值比较；SQL 中不是给变量赋值。','DATABASE()':'读取当前默认数据库。','CURRENT_USER()':'读取用于权限判断的账户。','@@hostname':'数据库实例的主机名线索。','@@port':'数据库实例端口线索。'};const clean=token.replace(/[,;]$/,'');if(notes[clean])return notes[clean];if(/^(--tail|--namespace|--output|--selector)=/.test(token))return '等号前为选项，等号后为值：'+token+'。';if(/^(order|shop)-lab$/.test(token))return cmd==='kubectl'?'教学命名空间或对象名，结合前一片段核对用途。':'教学容器名或数据库名，结合命令核对对象。';if(['order-abc','order-web','web-lab'].includes(token))return '本课的具体对象名称：'+token+'。';if(token==='kubernetes.io/service-name=order')return '标签条件：筛选与名为 order 的 Service 关联的 EndpointSlice。';return null;};
function evidenceHintsHTML(task){const n=hubAttempt.evidenceHints?.[hubAttempt.step]||0;return `<section class="command-coach evidence-coach"><h3>先想一步，需要时再看提示</h3><p>先看任务要读哪个对象、哪个范围。不用一次记住全部参数。</p><ol>${(task.hints||[]).slice(0,n).map(s=>`<li>${esc(s)}</li>`).join('')}</ol>${n<3&&!hubAttempt.verified?`<button class="secondary" type="button" data-evidence-hint>${n===0?'提示 1：选择工具':n===1?'提示 2：核对参数':'提示 3：查看参考命令'}</button>`:''}${n>=3||hubAttempt.verified?`<details ${hubAttempt.verified?'':'open'}><summary>参考命令与逐段解释</summary><pre class="annotated-command">${annotatedCommand(task.command)}</pre><ul>${coachTokens(task.command).map((t,i)=>`<li><code>${esc(t)}</code>：${esc(describeToken(t,coachTokens(task.command)[0],i)||'结合本课字段和前一片段理解。')}</li>`).join('')}</ul>${!hubAttempt.verified?'<button class="secondary" data-hub="fill-task" type="button">填入参考命令</button>':''}</details>`:''}<div class="completion-row"><button type="button" data-coach="complete">补全当前片段 · Tab</button><button type="button" data-coach="selection">解释选中的片段</button></div><div class="coach-suggestions" aria-label="可用补全"></div><p class="small-note">这是固定教学数据；接受已支持的等价写法，错误的对象、范围与条件不能通关。</p></section>`;}
const evidencePriorCourseHTML=hubCourseHTML;
hubCourseHTML=function(){let html=evidencePriorCourseHTML();if(hubTrack!=='opswork'||!activeHubLesson()?.evidenceLab||hubPhase!=='practice')return html;const t=activeHubLesson().tasks[hubAttempt.step];if(!t?.evidence)return html;html=html.replace(`<pre>${esc(t.command)}</pre><button class="secondary" data-hub="fill-task">填入标准命令</button>`,'').replace('输入命令或 DM8 SQL','输入只读命令或本课 MySQL 查询').replace('先回想本课示例的对象与输出，选择后验证。验证通过仍需手动确认。','先输入只读查询，观察输出，再手动确认。需要帮助时逐级展开提示。');return html.replace(coachPanel(t.command),evidenceHintsHTML(t));};
const evidencePriorCompletion=completionItems;
completionItems=function(input){
 const task=view==='hub-course'&&hubTrack==='opswork'?activeHubLesson()?.tasks[hubAttempt.step]:null;
 if(!task?.evidence)return evidencePriorCompletion(input);
 const before=input.value.slice(0,input.selectionStart),prefix=before.match(/[^\s]*$/)?.[0]||'',start=before.length-prefix.length,target=coachTokens(task.command),cmd=target[0],first=!before.trim()||!before.trim().includes(' ')&&!/\s$/.test(before);
 const flags=cmd==='docker'?['-a','--all','--tail']:cmd==='kubectl'?['-n','--namespace','-o','--output','--show-labels','-l','--selector']:[];
 const pool=first?[cmd]:prefix.startsWith('-')?flags:target.slice(1).filter(s=>!s.startsWith('-'));
 return [...new Set(pool)].filter(s=>s.startsWith(prefix)&&s!==prefix).slice(0,6).map(value=>({value,start,end:input.selectionStart+(input.value.slice(input.selectionStart).match(/^[^\s]*/)?.[0].length||0)}));
};
document.addEventListener('click',e=>{if(!e.target.closest('[data-evidence-hint]')||hubTrack!=='opswork'||!activeHubLesson()?.evidenceLab||hubPhase!=='practice'||hubAttempt.verified)return;hubAttempt.evidenceHints??={};hubAttempt.evidenceHints[hubAttempt.step]=Math.min(3,(hubAttempt.evidenceHints[hubAttempt.step]||0)+1);hubSave();render();});
document.addEventListener('click',e=>{if(!e.target.closest('[data-ops-evidence]'))return;opsRouteStage='all';opsRouteQuery='实练';opsSaveRoute();render();document.querySelector('.ops-path-courses')?.scrollIntoView({block:'start'});});
render();

const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),vm=require('node:vm');
const E=require('../dist/comfy-engine.js'),{harness}=require('./hub.cjs');
const dir=path.join(__dirname,'../dist');
const samples={};for(const file of fs.readdirSync(path.join(dir,'data/comfy/workflows'))){const raw=JSON.parse(fs.readFileSync(path.join(dir,'data/comfy/workflows',file),'utf8'));samples[file]=raw;const d=E.normalize(raw);assert(d.graphs.length);for(const g of d.graphs){assert(!g.edges.some(e=>e.dangling),file+' '+g.name);assert(!g.warnings.some(w=>w.includes('类型需核对')),file+' '+g.name);}}
// Public examples are structure-only: never publish widget values, prompts or asset references.
for(const [file,raw] of Object.entries(samples)){
 const graphs=[raw,...(raw.definitions?.subgraphs||[])];
 for(const [i,graph] of graphs.entries()){
  const allowed=i?['id','name','nodes','links','version','inputs','outputs']:['nodes','links','version','definitions'];
  assert(Object.keys(graph).every(k=>allowed.includes(k)),file+' graph metadata');
  for(const n of graph.nodes){assert(Object.keys(n).every(k=>['id','type','mode','inputs','outputs'].includes(k)),file+' node metadata');assert(!['Note','MarkdownNote'].includes(n.type));for(const port of [...(n.inputs||[]),...(n.outputs||[])])assert(Object.keys(port).every(k=>['name','type'].includes(k)),file+' port metadata');}
 }
 assert(!/widgets_values|safetensors|:\/\/|base64|filename|nsfw|uncensored|heretic/i.test(JSON.stringify(raw)),file+' embedded data');
}
assert.equal(E.normalize(samples['h3-clipstream.json']).graphs[0].nodes.length,36);
assert.equal(E.normalize(samples['h3-clipstream.json']).graphs.length,4);
assert.equal(E.normalize(samples['h3-i2v.json']).graphs.length,2);
assert.equal(E.normalize(samples['h3-i2v.json']).totalNodes,27);
const api={prompt:{'1':{class_type:'UNETLoader',inputs:{unet_name:'model.safetensors'}},'2':{class_type:'NewUnknownSampler',inputs:{model:['1',0],steps:8},_meta:{title:'<img src=x onerror=alert(1)>'}}}};
const parsed=E.normalize(api),g=parsed.graphs[0];assert.equal(parsed.format,'API 执行图');assert.equal(g.edges.length,1);assert.equal(g.edges[0].source,'1');assert.deepEqual(E.trace(g,'2'),['1']);assert.deepEqual(E.trace(g,'1','downstream'),['2']);assert.equal(g.edges[0].type,'未知');
assert(E.compatible('FLOAT','FLOAT,INT,BOOLEAN'));assert(!E.compatible('IMAGE','LATENT'));assert(E.compatible('*','AUDIO'));
assert.deepEqual(E.framePlan(240,24,'h3'),{requested:240,aligned:243,fps:24,duration:10.125});assert.equal(E.framePlan(80,16,'wan').aligned,81);assert.equal(E.framePlan(81,16).duration,5.0625);assert.throws(()=>E.framePlan(0,24));assert.throws(()=>E.framePlan(81,0));assert.throws(()=>E.normalize('{bad'));assert.throws(()=>E.normalize({nodes:[],links:[]}));assert.throws(()=>E.normalize({nodes:[{id:1,type:'A'},{id:1,type:'B'}],links:[]}));assert.throws(()=>E.normalize('汉'.repeat(1800000)),/过大/);
const cycle=E.normalize({nodes:[{id:1,type:'A',inputs:[{name:'x',type:'IMAGE'}],outputs:[{name:'y',type:'IMAGE'}]},{id:2,type:'B',inputs:[{name:'x',type:'IMAGE'}],outputs:[{name:'y',type:'IMAGE'}]}],links:[[1,1,0,2,0,'IMAGE'],[2,2,0,1,0,'IMAGE']]});assert(cycle.graphs[0].warnings.some(w=>w.includes('依赖环')));assert.deepEqual(E.trace(cycle.graphs[0],1),['2']);
const dangling=E.normalize({nodes:[{id:1,type:'X'}],links:[[1,1,0,999,0,'IMAGE']]});assert(dangling.graphs[0].edges[0].dangling);
(async()=>{
 const h=harness(),{q,hub,change,document}=h;
 vm.runInContext('function learningRouteSnapshot(){return {view};} async function restoreLearningRoute(r){view=r.view;render();}',h.ctx);
 vm.runInContext(fs.readFileSync(path.join(dir,'comfy-ui.js'),'utf8'),h.ctx,{filename:'comfy-ui.js'});
 assert.equal(q('hubCurriculum.comfy.length'),43);await change({id:'cf-sample',value:'music-teaching'});assert.equal(q('cfSampleId'),'music-teaching');assert(q('hubCurriculum.comfy.every(c=>Array.isArray(c.source)&&(c.comfySample===null||cfSamples.some(s=>s.id===c.comfySample)))'));assert.equal(Object.keys(samples).length,5);assert.equal(q('new Set(hubCurriculum.comfy.map(c=>c.id)).size'),43);
 q('cfOpen()');assert(document.querySelector('h1').textContent.includes('ComfyUI'));assert(document.querySelector('[data-cf-pane="inspect"]'));assert(q("cfModeHTML({mode:4}).includes('绕过')"));assert(q("cfModeHTML({mode:2}).includes('不执行')"));
 await q("cfOpen('inspect','music-teaching')");await q("cfLoadSample('music-teaching')");assert(document.querySelector('main').textContent.includes('音乐'));assert(q("cfSampleNoticeHTML(cfSamples.find(s=>s.id==='music-teaching')).includes('本站原创')"));assert(!q("cfSampleNoticeHTML(cfSamples.find(s=>s.id==='music-teaching')).includes('undefined')"));
 await q("cfOpen('inspect','h3-clipstream')");await q("cfLoadSample('h3-clipstream')");
 assert.equal(q('cfDocument.graphs.length'),4);assert(document.querySelector('.cf-node-detail'));assert(document.querySelector('.cf-wire-row'));assert(document.querySelector('#cf-node-list').textContent.includes('MotionContext'));
 q("cfGraphId=cfDocument.graphs[1].id;cfNodeId=cfGraph().nodes[0].id;render()");assert(document.querySelector('#cf-graph').innerHTML.includes('运算'));
 h.ctx.apiImport=api;q("cfAccept(apiImport,'local');render()");assert(!document.querySelector('#cf-node-detail img'));assert(document.querySelector('#cf-node-list').innerHTML.includes('&lt;img'));
 q("cfNodeId='2';render()");assert(document.querySelector('.cf-node-detail').textContent.includes('尚未收录核实'));assert(document.querySelector('.cf-node-detail').textContent.includes('LATENT')||document.querySelector('.cf-node-detail').textContent.includes('未知'));
 q("cfPane='sources';render()");assert.equal(q('cfStudyTopics().length'),43);assert(document.querySelector('main').textContent.includes('移除全部提示词'));assert(document.querySelector('main').textContent.includes('字幕尚未取得'));
 q("cfPane='practice';render()");assert(document.querySelector('#cf-wire-target'));assert(document.querySelector('#cf-frames'));
 let checked=0;
 for(let i=0;i<q('hubCurriculum.comfy.length');i++){
  q(`openHubLesson('comfy',${i})`);assert.equal(q('readingSet.length'),4);await hub('phase',{id:'quiz'});assert.equal(q('hubPhase'),'learn');await hub('read');
  const wrong=q('(activeHubLesson().tasks[0].answer+1)%3');q(`hubAttempt.draft='${wrong}';verifyHubTask()`);assert(!q('hubAttempt.verified'));assert.equal(q('hubAttempt.step'),0);
  q('hubAttempt.draft=String(activeHubLesson().tasks[0].answer);verifyHubTask()');assert(q('hubAttempt.verified'));assert.equal(q('hubAttempt.step'),0);await hub('confirm-task');assert.equal(q('hubAttempt.step'),1);await hub('phase',{id:'quiz'});
  const bad=q('(activeHubLesson().quiz.answer+1)%3');await change({name:'hub-quiz',value:String(bad)});await hub('grade-quiz');assert(!q('hubPassed()'));await hub('next');assert.equal(q('hubLesson'),i);
  await change({name:'hub-quiz',value:String(q('activeHubLesson().quiz.answer'))});await hub('grade-quiz');assert(q('hubPassed()'));assert.equal(q('hubLesson'),i);checked++;
 }
 const restored=harness([...h.storage]);assert.equal(restored.q('hubState.completed.comfy.length'),43);
 console.log(JSON.stringify({lessons:checked,samples:Object.keys(samples).length,checks:'UI/API/object links, subgraphs, union types, honest unknowns, missing endpoints, cycles, size limits, escaping, frame arithmetic, all course gates, explicit confirmation, no wrong-answer advance and saved progress',rendering:'DOM/state; browser QA separate'}));
})().catch(e=>{console.error(e);process.exitCode=1;});

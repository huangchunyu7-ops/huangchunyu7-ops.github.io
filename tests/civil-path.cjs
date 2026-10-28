const assert=require('node:assert/strict'),fs=require('fs'),path=require('path');
const {setup}=require('./civil.cjs');
(async()=>{
 const h=setup(true),{q}=h;await Promise.resolve();q('civilReady=true');assert.equal(q('civilMethods.length'),59);assert.equal(q('civilBank.size'),289);assert.equal(q('new Set(civilSeed.map(q=>q.id)).size'),289);
 for(const item of q('civilSeed')){assert.equal(new Set(item.options.map(o=>o.text)).size,item.options.length,item.id);assert(item.answer.every(key=>item.options.some(o=>o.key===key)),item.id);assert(item.explanation,item.id);}
 for(const m of q('civilMethods')){assert(m.mnemonic&&m.provenance&&m.risk,m.id);for(const level of [1,2,3])assert(q(`civilMethodQuestions('${m.id}',${level}).length`)>0,m.id+':'+level);}
 // Six routes have real exercises at every original-training stage.
 for(const category of q('Civil.categories')){
  h.ctx.category=category;q('civilRouteCategory=category;civilGo("route")');assert(q('civilStageUnlocked(category,0)'));assert(!q('civilStageUnlocked(category,1)'));
  for(let stage=0;stage<4;stage++){
   h.ctx.stage=stage;assert(q('civilRouteQueue(category,stage).length')>=3,category+':'+stage);
   if(stage===0){q('civilLaunchRoute(category,stage)');assert(q('civilSession().learning'));const sId=q('civilSession().id');q('for(const id of civilSession().questions){const item=civilBank.get(id);civilSession().answers[id]=[item.options.find(o=>!item.answer.includes(o.key)).key];}civilFinish();');assert(!q('civilStagePassed(category,0)'));assert(!q('civilStageUnlocked(category,1)'));assert.equal(q('civilSession().id'),sId);}
   q('civilGo("route");civilLaunchRoute(category,stage)');assert.equal(q('civilSession().learning.stage'),stage);assert.equal(q('civilSession().mode'),stage>=2?'exam':'practice');
   q('for(const id of civilSession().questions){civilSession().answers[id]=[...civilBank.get(id).answer];}civilFinish();');assert(q('civilStagePassed(category,stage)'),category+':'+stage);assert(q('civilStageUnlocked(category,stage+1)'));assert.equal(q('civilPane'),'report');
   // A passing grade unlocks but never automatically starts another attempt.
   assert.equal(q('civilSession().learning.stage'),stage);
  }
 }
 // No fake past-paper route is generated from original exercises.
 q('civilRouteCategory="资料分析";civilGo("route");civilLaunchRoute("资料分析",4)');assert.equal(q('civilPane'),'papers');assert.equal(q('civilPendingPast'),'资料分析');
 q('for(let i=0;i<6;i++){const source=civilSeed.find(q=>q.category==="资料分析");civilBank.set("past-test-"+i,{...source,id:"past-test-"+i,source:"ERRRC/xingcezhenti",qid:String(i),method:undefined,subtype:"基期",stem:"基期是多少？"});}civilGo("route");civilLaunchRoute("资料分析",4)');assert(q('civilSession().questions.every(id=>civilBank.get(id).source==="ERRRC/xingcezhenti")'));q('for(const id of civilSession().questions)civilSession().answers[id]=civilBank.get(id).answer;civilFinish()');assert(q('civilStagePassed("资料分析",4)'));
 // Heuristics never masquerade as solved/verified questions.
 assert.equal(q('civilRecommendations({id:"raw1",category:"数量关系",subtype:"工程问题",stem:"甲乙单独完成"}).kind'),'题型建议 · 未逐题核验');assert.equal(q('civilRecommendations({id:"raw2",category:"数量关系",subtype:"数学运算",stem:"复杂条件题"}).kind'),'待标注');assert.equal(q('civilRecommendations(civilSeed[0]).kind'),'原创配套');
 q('civilStudy.annotations.raw2={methods:["equation"],text:"我的核对记录"}');assert.equal(q('civilRecommendations({id:"raw2",stem:"x"}).kind'),'手动标注');
 // Method checks only mark proficiency after a finished full attempt.
 q('civilPendingLaunch={kind:"method",method:"base",questionIds:civilMethodQuestions("base").map(q=>q.id)};civilStart(civilMethodQuestions("base"),"exam",20,"方法测试",true)');assert(!q('civilStudy.methods.base?.passed'));q('for(const id of civilSession().questions)civilSession().answers[id]=civilBank.get(id).answer;civilFinish()');assert(q('civilStudy.methods.base.passed'));
 const sorted=q('civilSortByDifficulty([civilSeed.find(q=>q.level===3),civilSeed.find(q=>q.level===1),civilSeed.find(q=>q.level===2)])');assert.deepEqual(Array.from(sorted,x=>x.level),[1,2,3]);
 assert(q('civilSortByDifficulty([...civilSeed.filter(q=>q.materialId==="zx-material-0")]).length')===3);
 q('civilGo("cues")');assert(h.document.getElementById('app').textContent.includes('答案字母'));q('civilMethodId="combination";civilGo("methods")');assert(h.document.getElementById('app').textContent.includes('多人分成多组'));assert(h.document.querySelector('[data-study="method-check"]'));
 assert.equal(q('civilRecommendations({id:"annual-test",category:"资料分析",subtype:"年平均增长率",stem:"年平均增长率是多少？"}).ids[0]'),'annual');
 assert.equal(q('civilRecommendations({id:"share-test",category:"资料分析",subtype:"基期比重",stem:"基期比重是多少？"}).ids[0]'),'share');
 q('civilState.notes["past-test-0"]={doubt:true}');assert(!q('civilRouteQueue("资料分析",4).some(q=>q.id==="past-test-0")'));
 q('civilState.study={version:1,routes:{"资料分析":{0:{passed:true,accuracy:"<img src=x>",total:4,answered:4}}},methods:{},annotations:{raw:{methods:["base","fake-method"],text:"<script>note</script>"}}};civilGo("route")');
 assert(!q('civilStagePassed("资料分析",0)'));assert.equal(q('civilStudy.annotations.raw.methods.join(",")'),'base');
 q('civilGo("route")');assert(h.document.querySelector('.civil-switcher'));assert(h.document.querySelector('h1').textContent.includes('进阶路线'));
 // Backup replacement must refresh the study pointer rather than silently
 // continuing with an earlier in-memory learning object.
 q('civilState.study={version:1,routes:{},methods:{},annotations:{}};civilGo("route")');assert.equal(q('Object.keys(civilStudy.routes).length'),0);
 const html=fs.readFileSync(path.join(__dirname,'..','dist','index.html'),'utf8');assert(html.indexOf('civil-enrichment.js')<html.indexOf('civil-ui.js'));assert(html.indexOf('civil-teachers.js')<html.indexOf('civil-path.js'));
 console.log('59 methods / 289 original items: every method has three learning levels; all six staged routes, failure gates, manual continuation, timed modes, real-source requirement, method proficiency, transparent recommendations, annotation priority, difficulty/material ordering and backup refresh passed.');
})().catch(error=>{console.error(error);process.exitCode=1;});

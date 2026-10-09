const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');
const root=require('node:path').join(__dirname,'..','dist')+'/';
function harness(seed){
 const nodes=new Map(),listeners={},registered=new Map(),storage=new Map(seed||[]);
 const el=id=>{if(!nodes.has(id))nodes.set(id,{id,innerHTML:'',textContent:'',style:{},value:'',addEventListener(){},focus(){},scrollIntoView(){},scrollTop:0,scrollHeight:200});return nodes.get(id);};
 const document={getElementById:el,addEventListener:(n,f)=>listeners[n]=f,modelContext:{registerTool:t=>registered.set(t.name,t)}};
 const ctx={document,window:{scrollTo(){},addEventListener(){}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},console,structuredClone,AbortController,setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){}};ctx.globalThis=ctx;vm.createContext(ctx);
 for(const f of ['engine.js','courses.js','network-courses.js','command-guides.js','demos.js','network-visuals.js','lesson-context.js','app.js'])vm.runInContext(fs.readFileSync(root+f,'utf8'),ctx,{filename:f});
 const q=code=>vm.runInContext(code,ctx),act=(action,data={})=>listeners.click({target:{closest:()=>({dataset:{action,...data}})}}),choose=n=>listeners.change({target:{id:'answer-'+n,name:'answer',value:String(n)}});
 return {ctx,q,act,choose,el,storage,registered,listeners,html:()=>el('app').innerHTML};
}
let h=harness();const {q,act,choose}=h;
assert.equal(q('learningTab'),'learn');assert(!q('session.read'));assert(!q('courseUnlocked(1)'));
act('learning-tab',{tab:'practice'});assert.equal(q('learningTab'),'learn');act('learning-tab',{tab:'quiz'});assert.equal(q('learningTab'),'learn');act('lesson',{id:'50'});assert.equal(q('state.current'),0);
assert(h.html().includes('data-id="1" disabled'));assert(h.html().includes('data-tab="quiz"'));
assert.equal(q("run('whoami').blocked"),true);act('advance-step');assert.equal(q('session.step'),0);
act('read-done');assert.equal(q('learningTab'),'practice');
let r=q("run('pwd')");assert(r.ok&&!r.verified);assert.equal(q('session.step'),0);assert.equal(q('learningTab'),'practice');
r=q("run('not-a-command')");assert(!r.ok&&!r.verified);act('advance-step');assert.equal(q('session.step'),0);assert.equal(q('learningTab'),'practice');
// Matching text in an unsuccessful result still cannot pass the exercise.
q("const originalExecute=engine.execute;engine.execute=()=>({ok:false,out:'student'});");r=q("run('whoami')");assert(!r.verified);q('engine.execute=originalExecute');
r=q("run('whoami')");assert(r.verified);assert.equal(r.step,0);assert.equal(q('learningTab'),'practice');const history=q('engine.history.length');assert(q("run('whoami').blocked"));assert.equal(q('engine.history.length'),history);
// A reload retains the explicit awaiting-confirmation state and selected tab.
let resumed=harness(h.storage);assert.equal(resumed.q('session.step'),0);assert(resumed.q('!!session.verified'));assert.equal(resumed.q('learningTab'),'practice');resumed.act('advance-step');assert.equal(resumed.q('session.step'),1);assert(!resumed.q('session.verified'));
act('advance-step');assert.equal(q('session.step'),1);act('learning-tab',{tab:'learn'});q("run('pwd')");assert.equal(q('learningTab'),'learn');assert.equal(q('session.step'),1);act('read-done');
for(const step of h.ctx.courses[0].steps.slice(1)){r=q(`run(${JSON.stringify(step.cmd)})`);assert(r.verified);const before=q('session.step');assert.equal(r.step,before);act('advance-step');assert.equal(q('session.step'),before+1);}
assert.equal(q('learningTab'),'practice');assert(!q('session.quiz'));assert(!q('courseUnlocked(1)'));act('learning-tab',{tab:'quiz'});
choose(1);act('quiz');assert(!q('session.quiz'));assert(h.html().includes('这次没答对'));assert(h.html().includes('data-action="next" disabled'));act('next');assert.equal(q('state.current'),0);assert.equal(q('learningTab'),'quiz');
choose(0);assert(!q('session.quiz'));assert(!h.html().includes('✓ 回答正确'));assert(h.html().includes('data-action="next" disabled'));act('quiz');assert(q('session.quiz'));assert(q('courseUnlocked(1)'));assert.equal(q('state.current'),0);
// Regression for the screenshot: change away from a correct answer, remove every stale success state.
choose(2);assert(!q('session.quiz'));assert(!q('courseUnlocked(1)'));assert(!h.html().includes('本关通过'));assert(!h.html().includes('gate-result passed'));assert(h.html().includes('data-action="next" disabled'));
const labels=h.html().match(/<label for="answer-\d" class="is-selected">/g)||[];assert.equal(labels.length,1);assert(h.html().includes('<label for="answer-2" class="is-selected">'));
act('quiz');act('next');assert.equal(q('state.current'),0);choose(0);act('quiz');resumed=harness(h.storage);assert(resumed.q('session.quiz'));assert.equal(resumed.q('learningTab'),'quiz');
act('next');assert.equal(q('state.current'),1);assert.equal(q('learningTab'),'learn');
let operations=3;
for(const c of h.ctx.courses.slice(1)){
 assert.equal(q('state.current'),c.id);assert(!q(`courseUnlocked(${c.id+1})`));assert(h.html().includes('把知识连起来'));assert(q(`!!lessonConnections[courses[${c.id}].title]`),c.title);
 act('read-done');for(const step of c.steps){const before=q('session.step');r=q(`run(${JSON.stringify(step.cmd)})`);assert(r.ok&&r.verified,`${c.title}: ${r.output}`);assert.equal(r.step,before);assert.equal(q('learningTab'),'practice');act('advance-step');assert.equal(q('session.step'),before+1);operations++;}
 assert.equal(q('learningTab'),'practice');act('learning-tab',{tab:'quiz'});const wrong=(c.answer+1)%c.options.length;choose(wrong);act('quiz');assert(!q('session.quiz'));act('next');assert.equal(q('state.current'),c.id);choose(c.answer);assert(h.html().includes('data-action="next" disabled'));act('quiz');assert(q('session.quiz'));assert(q(`state.completed.includes(${c.id})`));act('next');
}
assert.equal(q('state.completed.length'),51);assert.equal(operations,158);assert.equal(q('view'),'roadmap');assert(h.html().includes('level-path'));assert(!h.html().includes('undefined'));
for(let i=0;i<3;i++){act('lab',{id:String(i)});assert.equal(q('learningTab'),'learn');act('read-done');const steps=q('current().steps');for(const s of steps){r=q(`run(${JSON.stringify(s.cmd)})`);assert(r.ok&&r.verified,r.output);act('advance-step');}act('learning-tab',{tab:'quiz'});choose(q('current().answer'));act('quiz');assert(q('session.quiz'));act('next');assert.equal(q('view'),'labs');}
// All reference examples and all original conceptual diagrams remain available.
for(const c of h.ctx.courses)for(let i=0;i<c.steps.length;i++){assert(q(`!!guideFor(${JSON.stringify(c.steps[i].cmd)})`));assert(q(`referenceResult(courses[${c.id}],${i}).ok`));}
for(const type of ['sql','permissions','index','balance','scheduler','net-layers','net-subnet','net-dns','net-tcp','net-http']){act('open-demo',{demo:type});for(let i=0;i<=q('demoMax()');i++){q(`demoState.step=${i};render();`);assert(!h.html().includes('NaN'));assert(!h.html().includes('undefined'));}}
// Existing valid progress stays put; stale successful-answer state is rejected.
const v3={catalogVersion:3,current:1,completed:[0,1],sessions:{0:{step:3,quiz:true,selected:0},1:{step:3,quiz:true,selected:0}}};
resumed=harness([['ops-learning-v1',JSON.stringify(v3)]]);assert.equal(resumed.q('state.completed.length'),1);assert.equal(resumed.q('state.current'),1);assert(!resumed.q('session.quiz'));assert(!resumed.q('courseUnlocked(2)'));
// Preserve v2 lesson identities while requiring the newly inserted prerequisites.
const oldTitle=h.ctx.legacyCourseTitles[23],legacy={current:23,completed:[0],sessions:{0:{step:3,quiz:true,selected:0},23:{step:1,quiz:false}}};resumed=harness([['ops-learning-v1',JSON.stringify(legacy)]]);assert.equal(resumed.q('state.current'),1);assert.equal(resumed.q(`state.sessions[courses.findIndex(c=>c.title===${JSON.stringify(oldTitle)})].step`),1);
act('lesson',{id:'0'});act('reset');assert.equal(q('session.step'),0);assert.equal(q('learningTab'),'learn');assert(!q('courseUnlocked(1)'));assert(!q('labUnlocked(labs[0])'));act('lesson',{id:'50'});assert.equal(q('state.current'),0);act('lab',{id:'0'});assert(!q('lab'));
assert(fs.existsSync(root+'assets/learning-journey.webp'));assert(fs.readFileSync(root+'index.html','utf8').match(/lesson-context\.js\?v=[^\" ]+/));
console.log(JSON.stringify({courses:51,operations:158,labs:3,demos:10,checks:'wrong/mismatched commands, explicit step confirmation, refresh continuity, wrong answers, answer changes clearing stale unlocks, locked navigation, old-progress migration, references and all lesson completions passed',browserRendering:'not exercised; managed preview is unavailable for this static Site'}));

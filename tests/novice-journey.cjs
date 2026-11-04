/* DOM and learning-state regressions; actual browser QA is recorded separately. */
const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const {harness}=require('./hub.cjs');
const load=(h,file)=>vm.runInContext(fs.readFileSync(require('node:path').join(__dirname,'../dist',file),'utf8'),h.ctx,{filename:file});
function setup(seed=[]){const h=harness(seed);load(h,'novice-journey.js');return h;}
(async()=>{
 const h=setup(),{q,hub,change,document}=h;
 assert.equal(q('noviceCommandLessons.length'),13);
 assert.equal(q('new Set(noviceCommandLessons.map(c=>c.question)).size'),13);
 for(let i=0;i<13;i++){
  q(`hubState.completed.opswork=hubCurriculum.opswork.slice(0,${i}).map(c=>c.id);openHubLesson('opswork',${i})`);
  assert.equal(q('readingSet.length'),4);
  assert(document.querySelector('.novice-class-guide').textContent.includes(q('activeHubLesson().novice.goal')));
  q('readingPages[readingKey]=2;paintReading()');
  assert(document.querySelector('.novice-io').textContent.includes('不要再当命令输入'));
  const expected=q('activeHubLesson().novicePages[2].output');
  assert.equal(expected,q('new JobEngine().execute(activeHubLesson().tasks[0].command).out'));
  await hub('read');
  assert(document.querySelector('.novice-command-help'));
  q("hubAttempt.draft='this-is-wrong';verifyHubTask()");
  assert(!q('hubAttempt.verified'));assert.equal(q('hubAttempt.step'),0);
  assert(document.querySelector('.novice-remedy'));
  q('hubAttempt.draft=activeHubLesson().tasks[0].command;verifyHubTask()');
  assert(q('hubAttempt.verified'));await hub('confirm-task');assert(document.querySelector('.novice-class-guide'),'last confirmation must render the complete classroom');assert(!document.getElementById('notice').textContent.includes('null'));await hub('phase',{id:'quiz'});
  const wrong=q('(activeHubLesson().quiz.answer+1)%3');
  await change({name:'hub-quiz',value:String(wrong)});await hub('grade-quiz');
  assert(!q('hubPassed()'));assert(document.querySelector('.novice-remedy'));
  const before=q('JSON.stringify({step:hubAttempt.step,draft:hubAttempt.draft,answer:hubAttempt.answer})');
  q('noviceReview()');assert.equal(q('hubPhase'),'learn');
  assert.equal(q('JSON.stringify({step:hubAttempt.step,draft:hubAttempt.draft,answer:hubAttempt.answer})'),before);
  await hub('phase',{id:'quiz'});await change({name:'hub-quiz',value:String(q('activeHubLesson().quiz.answer'))});await hub('grade-quiz');
  assert(q('hubPassed()'));assert.equal(q('hubAttempt.quizRevision'),q('noviceQuizRevision'));
  await change({name:'hub-quiz',value:String(wrong)});assert(!q('hubPassed()'));
 }
 q("openHubLesson('opswork',12);hubPhase='learn';readingPages['hub:opswork:cmd-start-first-pipe']=3;render()");
 const beforePipe=q('JSON.stringify(hubAttempt)');
 for(const pattern of ['ERROR','INFO','WARN']){
  q(`novicePipeStep=2;novicePipePattern=${JSON.stringify(pattern)};paintReading()`);
  const expected=pattern==='WARN'?'0':'2';
  assert.equal(document.querySelector('.novice-pipeline [role=status]').textContent,expected);
 }
 assert.equal(q('JSON.stringify(hubAttempt)'),beforePipe,'demo must not grade/advance');
 assert(q("noviceDiagnosis({command:'ls -l'},'ls -1').includes('数字一')"));
 assert(q("noviceDiagnosis({command:'pwd'},'student@lab:~$ pwd').includes('提示符')"));
 assert(q("noviceDiagnosis({command:'grep X f | wc -l'},'grep X f ｜ wc -l').includes('全角')"));
 assert(q("noviceDiagnosis({command:'grep X f | wc -l'},'grep X f | wc -l f').includes('重新读取')"));
 for(const id of ['browser','app-log','dm-select']){const c=q(`hubCurriculum.opswork.find(c=>c.id===${JSON.stringify(id)})`);assert.equal(c.novicePages.length,4);assert.equal(c.novicePages[2].output,q(`new JobEngine().execute(hubCurriculum.opswork.find(c=>c.id===${JSON.stringify(id)}).tasks[0].command).out`));}
 assert(q("noviceDiagnosis({command:'whoami',expected:'student'},'student').includes('返回值')"));
 const old={attempts:{'opswork:cmd-start-identity':{read:true,step:1,verified:false,phase:'quiz',answer:0,passed:true,draft:'',feedback:'old'},'beginner:start-terminal':{read:true,step:2,passed:true,answer:q('hubCurriculum.beginner[1].quiz.answer')}},completed:{opswork:['cmd-start-identity'],beginner:['start-terminal']}};
 const restored=setup([['learning-hub-v1',JSON.stringify(old)]]);
 assert(!restored.q("hubState.completed.opswork.includes('cmd-start-identity')"));
 assert(restored.q("hubState.completed.beginner.includes('start-terminal')"));
 restored.q("openHubLesson('opswork',0)");assert.equal(restored.q('hubAttempt.step'),1);assert(restored.q('hubAttempt.read'));assert.equal(restored.q('hubAttempt.answer'),null);assert(restored.q('hubAttempt.quizUpdated'));assert(!restored.q('hubPassed()'));
 // Stage ordering and numbering use a single source of truth, even though the
 // physical curriculum array retains historical IDs/order for saved progress.
 load(h,'ops-path-lessons.js');load(h,'ops-path.js');
 const ordered=q('opsOrderedCourses().map(c=>c.id)');assert.equal(new Set(ordered).size,q('hubCurriculum.opswork.length'));
 for(let i=0;i<ordered.length;i++){
  const physical=q(`hubCurriculum.opswork.findIndex(c=>c.id===${JSON.stringify(ordered[i])})`);
  assert.equal(q(`hubPosition('opswork',${physical})`),i+1);
  const next=q(`hubFollowingIndex('opswork',${physical})`);
  assert.equal(next===null?null:q(`hubCurriculum.opswork[${next}].id`),ordered[i+1]||null);
 }
 // A fresh choice task doesn't display its answer before verification.
 const fresh=setup();fresh.q("openHubLesson('beginner',0)");await fresh.hub('read');
 assert(fresh.document.querySelector('#hub-form').parentElement.querySelector('h2 + p').hidden);
 assert(fresh.document.querySelector('#hub-form button[type=submit]').disabled);
 console.log('13 specific assessments, 4-page examples, actual simulator outputs, wrong-answer gates, retained progress on review, revision migration, no demo completion, diagnostics and consistent route ordering passed (DOM/state tests).');
})().catch(e=>{console.error(e);process.exitCode=1;});

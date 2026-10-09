/* DOM-only regression (not a browser rendering test). Install linkedom in a
 * temporary test prefix and provide LEARNING_TEST_DEPS to run this suite. */
const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('node:assert/strict');
const deps=process.env.LEARNING_TEST_DEPS||'/workspace/scratch/dc7fe4e0cdd0/test-deps/node_modules';
const {parseHTML,DOMParser}=require(path.join(deps,'linkedom'));
const JSZip=require('../dist/vendor/jszip.min.js');
const root=path.join(__dirname,'..','dist');
function harness(seed=[]){
 const {document}=parseHTML('<html><body><div id="app"></div><div id="notice"></div></body></html>'),listeners={},storage=new Map(seed);document.addEventListener=(name,fn)=>(listeners[name]??=[]).push(fn);
 const window={scrollTo(){},addEventListener(){},innerWidth:1440};
 class TestParser {parseFromString(s,type){const d=new DOMParser().parseFromString(s,type);if(!d.getElementsByTagNameNS)d.getElementsByTagNameNS=(_,name)=>[...d.querySelectorAll('*')].filter(e=>e.localName.split(':').at(-1)===name);return d;}}
 const ctx={document,window,DOMParser:TestParser,console,structuredClone,AbortController,URL,Blob,JSZip,localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},setTimeout:()=>1,clearTimeout(){},setInterval:()=>1,clearInterval(){},fetch:async url=>({ok:true,json:async()=>JSON.parse(fs.readFileSync(path.join(root,url),'utf8')),arrayBuffer:async()=>{const b=fs.readFileSync(path.join(root,url));return b.buffer.slice(b.byteOffset,b.byteOffset+b.byteLength);}})};ctx.globalThis=ctx;vm.createContext(ctx);
 for(const f of ['engine.js','courses.js','network-courses.js','command-guides.js','demos.js','network-visuals.js','lesson-context.js','app.js','hub-curriculum.js','ops-work.js','japanese-lessons.js','reader.js','beginner-lessons.js','command-foundation.js','ops-extension.js','python-lessons.js','teaching-depth.js','subject-glossary.js','subject-scaffolding.js','linux-operations.js','course-depth.js','hub.js','incident-lab.js','learning-guide.js','python-classroom.js','beginner-ui.js','command-coach.js','operations-coach.js','paged-classroom.js','local-progress.js'])vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
 const q=s=>vm.runInContext(s,ctx),hub=async(action,data={})=>{const el={dataset:{hub:action,...data},disabled:false};for(const fn of listeners.click||[])await fn({target:{closest:selector=>selector==='[data-hub]'?el:null}});},change=async(target)=>{for(const fn of listeners.change||[])await fn({target:{id:'',...target}});};return {q,hub,change,document,storage,ctx};
}
if(require.main===module)(async()=>{
 const h=harness(),{q,hub,change}=h;assert.equal(q('view'),'hub');assert(h.document.getElementById('app').innerHTML.includes('DM8'));assert(!q("hubUnlocked('opswork',1)"));
 let count=0,operations=0;
 for(const track of q('Object.keys(hubCurriculum)')){
  const length=q(`hubCurriculum.${track}.length`);assert(length>0);
  for(let i=0;i<length;i++){
   q(`openHubLesson('${track}',${i})`);assert.equal(q('hubLesson'),i);await hub('phase',{id:'quiz'});assert.equal(q('hubPhase'),'learn');await hub('confirm-task');assert.equal(q('hubAttempt.step'),0);await hub('read');
   const total=q('activeHubLesson().tasks.length');
   for(let n=0;n<total;n++){
    q("hubAttempt.draft='a deliberately incorrect answer';verifyHubTask()");assert(!q('hubAttempt.verified'));assert.equal(q('hubAttempt.step'),n);
    q("(()=>{const t=activeHubLesson().tasks[hubAttempt.step];hubAttempt.draft=t.command??(t.type==='choice'?String(t.answer):t.answers[0]);verifyHubTask();})()");assert(q('hubAttempt.verified'),track+' / '+q('activeHubLesson().title')+' / '+q('hubOutput'));assert.equal(q('hubAttempt.step'),n);
    await hub('confirm-task');assert.equal(q('hubAttempt.step'),n+1);operations++;
   }
   await hub('phase',{id:'quiz'});assert.equal(q('hubPhase'),'quiz');const wrong=q('(activeHubLesson().quiz.answer+1)%activeHubLesson().quiz.options.length');await change({name:'hub-quiz',value:String(wrong)});await hub('grade-quiz');assert(!q('hubPassed()'));await hub('next');assert.equal(q('hubLesson'),i);
   await change({name:'hub-quiz',value:String(q('activeHubLesson().quiz.answer'))});await hub('grade-quiz');assert(q('hubPassed()'));assert.equal(q('hubLesson'),i);
   // Changing a correct answer invalidates both banner and navigation.
   await change({name:'hub-quiz',value:String(wrong)});assert(!q('hubPassed()'));assert(!q(`hubState.completed.${track}.includes(activeHubLesson().id)`));if(i+1<length)assert(!q(`hubUnlocked('${track}',${i+1})`));
   await change({name:'hub-quiz',value:String(q('activeHubLesson().quiz.answer'))});await hub('grade-quiz');count++;
  }
 }
 const resumed=harness([...h.storage]);assert.equal(resumed.q('hubState.completed.opswork.length'),q('hubCurriculum.opswork.length'));resumed.q("openHubLesson('opswork',0)");assert(resumed.q('hubPassed()'));
 const e=q('new JobEngine()');assert.equal(e.execute("cat /opt/order/logs/app.log|grep -F ERROR|wc -l").out,'2');assert(e.execute("echo 'a|b'").ok);assert(!e.execute('cat /opt/order/logs/app.log |').ok);assert(!e.execute("SELECT ID, ORDER_NO, STATUS FROM APP.ORDERS WHERE ORDER_NO = 'od20261008001';").ok);assert(e.execute("select ID,ORDER_NO,STATUS from APP.ORDERS where ORDER_NO='OD20261008001';").ok);
 // Incident drills remain independent of the locked course progression.
 const fresh=harness();assert(!fresh.q("hubUnlocked('opswork',1)"));
 for(const c of fresh.q('incidentCases')){
  fresh.q(`incidentOpen(${JSON.stringify(c.id)})`);assert.equal(fresh.q('view'),'incident');
  assert(fresh.document.getElementById('incident-form'));
  fresh.q('incidentGrade()');assert(!fresh.q('incidentComplete(incidentCurrent(),incidentAttempt())'));
  fresh.q("incidentDraft='rm /opt/order/logs/app.log';incidentRun()");assert.equal(fresh.q('incidentEvidence(incidentCurrent(),incidentAttempt()).filter(Boolean).length'),0);
  for(const step of c.steps){fresh.q(`incidentDraft=${JSON.stringify(step[1])};incidentRun()`);}
  assert.equal(fresh.q('incidentEvidence(incidentCurrent(),incidentAttempt()).filter(Boolean).length'),c.steps.length);
  fresh.q('incidentAttempt().diagnosis=(incidentCurrent().answer+1)%3;incidentAttempt().recovery=incidentCurrent().recoveryAnswer;incidentGrade()');assert(!fresh.q('incidentComplete(incidentCurrent(),incidentAttempt())'));
  fresh.q('incidentAttempt().diagnosis=incidentCurrent().answer;incidentAttempt().recovery=(incidentCurrent().recoveryAnswer+1)%3;incidentGrade()');assert(!fresh.q('incidentComplete(incidentCurrent(),incidentAttempt())'));
  fresh.q('incidentAttempt().recovery=incidentCurrent().recoveryAnswer;incidentGrade()');assert(fresh.q('incidentComplete(incidentCurrent(),incidentAttempt())'));
  assert(fresh.document.getElementById('incident-report').textContent.includes(c.conclusion));
 }
 const restored=harness([...fresh.storage]);for(const c of restored.q('incidentCases')){restored.q(`incidentOpen(${JSON.stringify(c.id)})`);assert(restored.q('incidentComplete(incidentCurrent(),incidentAttempt())'));}
 restored.q("incidentAttempt().commands[0]='rm /opt/order/logs/app.log';render()");assert(!restored.q('incidentComplete(incidentCurrent(),incidentAttempt())'));assert(restored.document.getElementById('incident-report').textContent.includes('尚未确认结论'));
 const empty=q('new JobEngine()');assert.equal(empty.execute("cat /opt/order/logs/app.log | grep -F NO_MATCH | sort | uniq -c | wc -l").out,'0');
 await hub('jp-library');assert.equal(q('jpRows.length'),674);assert(h.document.querySelector('#jp-results ruby'));assert.equal(q("rubyJP('<script>{会|あ}</script>')"),'&lt;script&gt;<ruby>会<rt>あ</rt></ruby>&lt;/script&gt;');await hub('anime');await hub('anime-answer',{index:'0',value:'昨日'});assert(h.document.getElementById('anime-feedback-0').textContent.includes('再试'));await hub('load-video',{index:'0'});assert(h.document.querySelector('iframe').getAttribute('src').startsWith('https://www.youtube-nocookie.com/'));
 // Parse every built-in EPUB and check that the reading order is nonempty.
 for(const b of q('bookCatalog.filter(b=>b.file)')){const bytes=fs.readFileSync(path.join(root,'books',b.file));h.ctx.epubBytes=bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength);h.ctx.epubMeta=b;await q('loadEPUB(epubBytes,epubMeta)');assert(q('readerBook.chapters.length')>0);assert(h.document.getElementById('reader-content'));assert(q('readerBook.html.length')>40,b.id+' HTML: '+q('readerBook.html'));}
 // Hostile EPUB markup must never retain active or remote content.
 const zip=new JSZip();zip.file('c.xhtml','<html><body><h1 onclick="alert(1)">Safe</h1><script>alert(1)</script><iframe src="https://evil.test"></iframe><img src="https://evil.test/a.png"><a href="javascript:alert(1)">Text</a><p style="background:url(https://evil.test)">Visible <ruby>日<rt>ひ</rt></ruby></p></body></html>');h.ctx.badBook={zip,chapters:[{path:'c.xhtml'}],text:async p=>zip.file(p).async('string')};const safe=await q('sanitizedChapter(badBook,0)');assert(!/onclick|alert|iframe|evil\.test|javascript|style=/.test(safe));assert(safe.includes('<ruby>'));assert(safe.includes('Visible'));
 assert.equal(q("resolveEpubPath('OEBPS/Text/','../Images/a.png')"),'OEBPS/Images/a.png');
 console.log(JSON.stringify({tracks:q('Object.fromEntries(Object.entries(hubCurriculum).map(([k,v])=>[k,v.length]))'),lessons:count,operations,checks:'all lesson gates, incorrect commands/answers, explicit confirmation, changed answers, persisted progress, real pipeline output, SQL literals, Japanese data and ruby, official embeds, all bundled EPUB packages and hostile XHTML sanitization passed',rendering:'DOM-only; no actual phone/desktop browser rendering tested'}));
})().catch(e=>{console.error(e);process.exitCode=1;});

module.exports={harness};

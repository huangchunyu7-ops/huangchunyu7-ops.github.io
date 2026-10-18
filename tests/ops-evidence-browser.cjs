const {chromium}=require(process.env.LEARNING_BROWSER_MODULE||'playwright');
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));await page.goto(process.env.LEARNING_TEST_URL||'http://127.0.0.1:8766/');
 await page.evaluate(()=>{hubSubject='ops';view='subject';render()});await page.locator('[data-ops-evidence]').click();assert.equal(await page.locator('.path-card').count(),5);
 const parser=await page.evaluate(()=>{
  const failures=[],eq=(a,b)=>parseEvidence(a).signature===parseEvidence(b).signature;
  for(const [a,b] of [
   ['docker container ls --all','docker ps -a'],['docker logs order-lab --tail=20','docker logs --tail 20 order-lab'],
   ['kubectl --namespace=order-lab get po','kubectl get pods -n order-lab'],
   ['kubectl --namespace shop-lab get svc order --output=yaml','kubectl get service order -n shop-lab -o yaml'],
   ['kubectl get endpointslice --selector=kubernetes.io/service-name=order --namespace=shop-lab','kubectl get endpointslices -n shop-lab -l kubernetes.io/service-name=order'],
   ['select status, order_no from ORDER_LAB.ORDERS where ID=42;', 'SELECT order_no, status FROM order_lab.orders WHERE id = 42;']
  ])if(!eq(a,b))failures.push('equivalent: '+a);
  for(const [a,b] of [
   ['docker ps','docker ps -a'],['docker logs --tail 2 order-lab','docker logs --tail 20 order-lab'],
   ['docker inspect web-lab','docker inspect order-lab'],['kubectl get pods -n default','kubectl get pods -n order-lab'],
   ['SELECT order_no,status FROM order_lab.orders WHERE id=41','SELECT order_no,status FROM order_lab.orders WHERE id=42'],
   ["SELECT order_no FROM order_lab.orders WHERE status='paid'","SELECT order_no FROM order_lab.orders WHERE status='PAID'"]
  ])if(eq(a,b))failures.push('wrong target accepted: '+a);
  for(const s of ['docker ls --all','docker list -a','docker rm order-lab','docker logs --tail nope order-lab','docker inspect other','docker ps -a -a','docker ps -a; docker rm order-lab','docker logs --tail 20 order-lab | cat','kubectl delete pod order-abc -n order-lab','kubectl get pods -n order-lab -n shop-lab','kubectl get pods --namespace','SELECT * FROM order_lab.orders; DROP TABLE order_lab.orders','UPDATE order_lab.orders SET status=1','SELECT unknown FROM order_lab.orders']){
   try{parseEvidence(s);failures.push('unsupported accepted: '+s);}catch{}
  }
  if(!parseEvidence('SELECT order_no FROM order_lab.orders WHERE id=41').out.includes('LAB-41'))failures.push('dynamic id');
  if(!parseEvidence("SELECT order_no FROM order_lab.orders WHERE status='paid'").out.includes('(0 rows)'))failures.push('literal case');
  if(!parseEvidence('docker logs --tail 1 order-lab').out.includes('startup aborted'))failures.push('tail result');
  if(parseEvidence('docker ps').out.includes('order-lab'))failures.push('running-only filter');
  const lab=hubCurriculum.opswork.filter(c=>c.evidenceLab);
  for(const c of lab)for(const t of c.tasks.filter(t=>t.evidence)){
   const job=new JobEngine(),r=evaluateHubTask(t,t.command,job);if(!r.ok)failures.push(c.id+': '+r.out);
  }
  return {failures,labs:lab.map(c=>c.id),commands:lab.flatMap(c=>c.tasks).filter(t=>t.evidence).length};
 });assert.deepEqual(parser.failures,[]);assert.equal(parser.labs.length,5);
 for(const id of parser.labs){
  await page.evaluate(id=>openHubLesson('opswork',hubCurriculum.opswork.findIndex(c=>c.id===id)),id);
  assert(await page.locator('[data-hub="phase"][data-id="practice"]').isDisabled());
  while(!await page.locator('[data-reading="next"]').isDisabled())await page.locator('[data-reading="next"]').click();await page.locator('[data-hub="read"]').click();
  const count=await page.evaluate(()=>activeHubLesson().tasks.length);
  for(let i=0;i<count;i++){
   const task=await page.evaluate(()=>activeHubLesson().tasks[hubAttempt.step]);
   if(task.evidence){
    assert.equal(await page.locator('[data-hub="fill-task"]').count(),0,'reference hidden initially');
    if(id===parser.labs[0]&&i===0){
     await page.locator('[data-evidence-hint]').click();await page.locator('[data-evidence-hint]').click();assert.equal(await page.locator('[data-hub="fill-task"]').count(),0);
     await page.reload();await page.evaluate(id=>openHubLesson('opswork',hubCurriculum.opswork.findIndex(c=>c.id===id)),id);assert.equal(await page.evaluate(()=>hubAttempt.evidenceHints[0]),2);
     await page.locator('[data-evidence-hint]').click();assert(await page.locator('[data-hub="fill-task"]').isVisible());
     await page.locator('#hub-draft').fill('SELECT order_no, status FROM order_lab.orders WHERE id = 41;');await page.locator('#hub-form button[type=submit]').click();assert(await page.locator('[data-hub="confirm-task"]').isDisabled());
     await page.locator('#hub-draft').fill('SEL');await page.locator('#hub-draft').press('Tab');assert.equal(await page.locator('#hub-draft').inputValue(),'SELECT');
    }
    await page.locator('#hub-draft').fill(task.command);await page.locator('#hub-form button[type=submit]').click();assert(await page.evaluate(()=>hubAttempt.verified));assert((await page.locator('.hub-terminal').innerText()).includes('教学快照'));
   }else{
    await page.locator(`input[name=hub-task][value="${(task.answer+1)%task.options.length}"]`).check();await page.locator('#hub-form button[type=submit]').click();assert(await page.locator('[data-hub="confirm-task"]').isDisabled());
    await page.locator(`input[name=hub-task][value="${task.answer}"]`).check();await page.locator('#hub-form button[type=submit]').click();
   }
   assert.equal(await page.evaluate(()=>hubAttempt.step),i);await page.locator('[data-hub="confirm-task"]').click();
  }
  await page.locator('[data-hub="phase"][data-id="quiz"]').first().click();const q=await page.evaluate(()=>activeHubLesson().quiz);
  await page.locator(`input[name=hub-quiz][value="${(q.answer+1)%q.options.length}"]`).check();await page.locator('[data-hub="grade-quiz"]').click();assert(await page.locator('[data-hub="next"]').isDisabled());
  await page.locator(`input[name=hub-quiz][value="${q.answer}"]`).check();await page.locator('[data-hub="grade-quiz"]').click();assert(await page.evaluate(()=>hubPassed()));
 }
 await page.evaluate(()=>{const c=hubCurriculum.opswork.find(c=>!c.opsStage);window.oldId=c.id;hubState.attempts['opswork:'+c.id]={read:true,step:c.tasks.length,answer:c.quiz.answer,passed:true,phase:'quiz'};hubState.completed.opswork.push(c.id);hubSave();});
 const oldId=await page.evaluate(()=>window.oldId);await page.reload();assert(await page.evaluate(id=>hubState.completed.opswork.includes(id),oldId));assert.equal(await page.evaluate(()=>hubState.completed.opswork.filter(id=>id.startsWith('ops-evidence-')).length),5);
 const audit=await page.evaluate(()=>{const failures=[];let pages=0;for(const c of hubCurriculum.opswork.filter(c=>c.evidenceLab)){openHubLesson('opswork',hubCurriculum.opswork.indexOf(c));hubPhase='learn';render();for(let n=0;n<readingSet.length;n++){readingPages[readingKey]=n;paintReading();pages++;if(document.documentElement.scrollWidth>innerWidth)failures.push(c.id+':'+n);}}return {pages,failures};});assert.deepEqual(audit.failures,[]);
 for(const theme of ['light','dark'])for(const width of [360,390,430,768,1440]){
  await page.setViewportSize({width,height:844});await page.evaluate(t=>efSetTheme(t),theme);for(const id of parser.labs){await page.evaluate(id=>{openHubLesson('opswork',hubCurriculum.opswork.findIndex(c=>c.id===id));hubAttempt.step=0;hubAttempt.verified=false;hubPhase='practice';render()},id);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),theme+' '+width+' '+id);}
 }
 const shots=process.env.LEARNING_SCREENSHOT_DIR||path.resolve(__dirname,'../../ops-evidence-qa');fs.mkdirSync(shots,{recursive:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:path.join(shots,'practice-mobile-dark.png'),fullPage:true});assert.deepEqual(errors,[]);await browser.close();console.log(JSON.stringify({labs:5,commands:parser.commands,readingPages:audit.pages,checks:'bounded parser; equivalents; wrong scopes; changed SQL results; write/chaining rejection; progressive hints; completion; all five full flows; old/new progress; mobile/desktop light/dark'}));
})().catch(e=>{console.error(e);process.exit(1)});

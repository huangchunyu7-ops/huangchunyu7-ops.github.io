/* Browser acceptance for route order, preserved IDs, scenario gates and layout.
 * Serve dist first; see LEARNING_TEST_URL and LEARNING_BROWSER_MODULE. */
const {chromium}=require(process.env.LEARNING_BROWSER_MODULE||'playwright');
const assert=require('node:assert/strict'),path=require('node:path'),fs=require('node:fs');
(async()=>{
 const browser=await chromium.launch(),page=await browser.newPage({viewport:{width:390,height:844}}),errors=[];
 page.on('pageerror',e=>errors.push(e.message));
 await page.goto(process.env.LEARNING_TEST_URL||'http://127.0.0.1:8766/');
 await page.evaluate(()=>{hubSubject='ops';view='subject';render()});
 const content=await page.evaluate(()=>{
  const list=hubCurriculum.opswork,cases=list.filter(c=>c.opsStage),failures=[];
  for(const c of cases){if(!c.quiz||c.tasks.length!==2||c.teachingPages.length<6)failures.push(c.id+': structure');
   for(const p of c.teachingPages)for(const t of p.terms||[])if(!beginnerTerms[t])failures.push(c.id+': undefined term '+t);
   if(!c.source?.[1])failures.push(c.id+': source');
   const r=opsVideoReferences.find(r=>r.id===c.videoReference.video);
   for(const part of c.videoReference.parts)if(!opsVideoPartTitles[r.bv]?.[part])failures.push(c.id+': invalid video part');
  }
  return {count:list.length,cases:cases.length,unique:new Set(list.map(c=>c.id)).size,stages:opsStages.length,failures,
   next:opsNextCourse().id,commandOrder:opsStageCourses('commands').map(c=>c.title),ordered:opsOrderedCourses().map(c=>c.id)};
 });
 assert.equal(content.count,160);assert.equal(content.cases,25);assert.equal(content.unique,content.count);assert.equal(content.ordered.length,content.count);assert.equal(new Set(content.ordered).size,content.count);assert.deepEqual(content.failures,[]);assert.equal(content.stages,11);assert.equal(content.next,'ops-path-lab');assert(content.commandOrder[0].startsWith('whoami'));assert(content.commandOrder.findIndex(t=>t.includes('管道'))>10);
 await page.selectOption('#ops-stage','database');assert((await page.locator('.ops-stage-heading').innerText()).includes('数据库'));
 assert.equal(await page.locator('.path-card:not([hidden])').count(),2);
 const first=await page.locator('.path-card:not([hidden]) h2').first().innerText();await page.locator('[data-route-page="1"]').first().click();assert.notEqual(await page.locator('.path-card:not([hidden]) h2').first().innerText(),first);
 await page.reload();await page.evaluate(()=>{hubSubject='ops';view='subject';render()});assert.equal(await page.locator('#ops-stage').inputValue(),'database');
 await page.selectOption('#ops-stage','all');await page.locator('#ops-search').fill('docker logs');await page.locator('#ops-search-form button').click();assert(await page.locator('.path-card').count()>0);
 await page.locator('#ops-search').fill('<img src=x onerror=alert(1)>');await page.locator('#ops-search-form button').click();assert.equal(await page.locator('.ops-path-main img').count(),0);assert.equal(await page.locator('.path-card').count(),0);assert(await page.getByRole('status').filter({hasText:'当前阶段没有匹配课程'}).isVisible());await page.locator('[data-ops-clear]').click();
 await page.evaluate(()=>openHubLesson('opswork',hubCurriculum.opswork.findIndex(c=>c.id==='ops-path-lab')));
 assert(await page.locator('[data-hub="phase"][data-id="practice"]').isDisabled());
 while(!await page.locator('[data-reading="next"]').isDisabled())await page.locator('[data-reading="next"]').click();
 assert((await page.locator('.course-endnotes').innerHTML()).includes('BV1sHwLz3ED1/?p=4'));
 await page.locator('[data-hub="read"]').click();assert.equal(await page.locator('#hub-form').count(),1);
 const answer=await page.evaluate(()=>activeHubLesson().tasks[0].answer);
 await page.locator(`input[name="hub-task"][value="${(answer+1)%3}"]`).check();await page.locator('#hub-form button[type=submit]').click();assert(await page.locator('[data-hub="confirm-task"]').isDisabled());
 for(let i=0;i<2;i++){
  const a=await page.evaluate(()=>activeHubLesson().tasks[hubAttempt.step].answer);
  await page.locator(`input[name="hub-task"][value="${a}"]`).check();await page.locator('#hub-form button[type=submit]').click();assert.equal(await page.evaluate(()=>hubAttempt.step),i);
  await page.locator('[data-hub="confirm-task"]').click();
 }
 await page.locator('[data-hub="phase"][data-id="quiz"]').first().click();const q=await page.evaluate(()=>activeHubLesson().quiz.answer);
 await page.locator(`input[name="hub-quiz"][value="${(q+1)%3}"]`).check();await page.locator('[data-hub="grade-quiz"]').click();assert(await page.locator('[data-hub="next"]').isDisabled());
 await page.locator(`input[name="hub-quiz"][value="${q}"]`).check();await page.locator('[data-hub="grade-quiz"]').click();assert(await page.evaluate(()=>hubState.completed.opswork.includes('ops-path-lab')));
 await page.locator(`input[name="hub-quiz"][value="${(q+1)%3}"]`).check();assert(await page.locator('[data-hub="next"]').isDisabled());
 await page.locator(`input[name="hub-quiz"][value="${q}"]`).check();await page.locator('[data-hub="grade-quiz"]').click();await page.locator('[data-hub="next"]').click();assert.equal(await page.evaluate(()=>activeHubLesson().id),'ops-path-versions');
 await page.reload();assert(await page.evaluate(()=>hubState.completed.opswork.includes('ops-path-lab')));
 const audit=await page.evaluate(()=>{let pages=0;const failures=[];for(const c of hubCurriculum.opswork.filter(c=>c.opsStage)){
  openHubLesson('opswork',hubCurriculum.opswork.indexOf(c));hubPhase='learn';render();for(let i=0;i<readingSet.length;i++){readingPages[readingKey]=i;paintReading();pages++;if(document.documentElement.scrollWidth>innerWidth)failures.push(c.id+':page '+i);}
 }return {pages,failures};});assert.deepEqual(audit.failures,[]);
 for(const theme of ['light','dark'])for(const width of [360,390,430,768,1440]){
  await page.setViewportSize({width,height:844});await page.evaluate(t=>efSetTheme(t),theme);
  for(const stage of await page.evaluate(()=>opsStages.map(s=>s.id).concat('all'))){await page.evaluate(s=>{hubSubject='ops';view='subject';opsRouteStage=s;opsRouteQuery='';render()},stage);assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),'overflow '+theme+' '+width+' '+stage);}
 }
 const shots=process.env.LEARNING_SCREENSHOT_DIR||path.resolve(__dirname,'../../ops-path-qa');fs.mkdirSync(shots,{recursive:true});
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{efSetTheme('light');opsRouteStage='container';view='subject';render()});await page.screenshot({path:path.join(shots,'container-mobile.png'),fullPage:true});
 await page.setViewportSize({width:1440,height:1000});await page.evaluate(()=>{opsRouteStage='environment';render()});await page.screenshot({path:path.join(shots,'route-desktop.png'),fullPage:true});
 assert.deepEqual(errors,[]);await browser.close();console.log(JSON.stringify({courses:content.count,newCases:content.cases,stages:11,newPages:audit.pages,checks:'stage order; search; paging; route resume; video references; wrong-answer and explicit-confirm gates; next-by-stage; completion persistence; 5 widths and 2 themes'}));
})().catch(e=>{console.error(e);process.exit(1)});

/* Real-browser full course flow. Expected commands/answers are supplied from
 * course metadata to test interaction gates, not pedagogical correctness. */
const {chromium}=require(process.env.LEARNING_BROWSER_MODULE||'playwright');const assert=require('node:assert/strict'),fs=require('node:fs');
const out=(process.env.LEARNING_AUDIT_DIR||require('node:path').resolve(__dirname,'../../user-journey-audit'));fs.mkdirSync(out,{recursive:true});
(async()=>{const browser=await chromium.launch();for(const track of (process.env.AUDIT_TRACK||'beginner,opswork,network,agent,writing').split(',')){
 const context=await browser.newContext({viewport:{width:390,height:844}}),p=await context.newPage(),report={track,courses:[],errors:[]};p.setDefaultTimeout(6500);p.on('pageerror',e=>report.errors.push(e.message));
 try{await p.goto(process.env.LEARNING_TEST_URL||'http://127.0.0.1:8766/');if(track==='beginner')await p.locator('.ef-home-start').click();else{await p.locator(`.subject-card[data-id="${track==='opswork'?'ops':track}"]`).click();await p.locator(track==='opswork'?'.ops-path-start [data-hub="lesson"][data-track="opswork"]':'.path-card:not([hidden]) [data-hub="lesson"]').first().click();}
 const total=await p.evaluate(()=>hubCurriculum[hubTrack].length);
 for(let n=0;n<total;n++){
  const c=await p.evaluate(()=>activeHubLesson()),row={id:c.id,title:c.title,pages:0,tasks:0};report.current=c.id;
  assert.equal(await p.evaluate(()=>hubPhase),'learn');assert(await p.locator('[data-hub="phase"][data-id="practice"]').isDisabled());
  while(!await p.locator('[data-reading="next"]').isDisabled()){await p.locator('[data-reading="next"]').click();row.pages++;}row.pages++;
  await p.locator('[data-hub="read"]').click();
  for(let j=0;j<c.tasks.length;j++){
   const task=c.tasks[j];assert.equal(await p.evaluate(()=>hubAttempt.step),j);
   if(task.type==='choice'){
    await p.locator(`input[name=hub-task][value="${(task.answer+1)%task.options.length}"]`).check();await p.locator('#hub-form button[type=submit]').click();assert(await p.locator('[data-hub="confirm-task"]').isDisabled());
    await p.locator(`input[name=hub-task][value="${task.answer}"]`).check();
   }else{await p.locator('#hub-draft').fill('this-is-not-the-answer');await p.locator('#hub-form button[type=submit]').click();assert(await p.locator('[data-hub="confirm-task"]').isDisabled());await p.locator('#hub-draft').fill(task.type==='command'?task.command:task.answers[0]);}
   await p.locator('#hub-form button[type=submit]').click();assert.equal(await p.evaluate(()=>hubAttempt.verified),true,'verify '+c.id+':'+j+' '+await p.locator('.hub-terminal').innerText());assert.equal(await p.evaluate(()=>hubAttempt.step),j);
   await p.locator('[data-hub="confirm-task"]').click();row.tasks++;
  }
  await p.locator('[data-hub="phase"][data-id="quiz"]').first().click();await p.locator(`input[name=hub-quiz][value="${(c.quiz.answer+1)%c.quiz.options.length}"]`).check();await p.locator('[data-hub="grade-quiz"]').click();assert(await p.locator('[data-hub="next"]').isDisabled());
  await p.locator(`input[name=hub-quiz][value="${c.quiz.answer}"]`).check();await p.locator('[data-hub="grade-quiz"]').click();assert(await p.evaluate(()=>hubPassed()));await p.locator(`input[name=hub-quiz][value="${(c.quiz.answer+1)%c.quiz.options.length}"]`).check();assert(await p.locator('[data-hub="next"]').isDisabled());
  await p.locator(`input[name=hub-quiz][value="${c.quiz.answer}"]`).check();await p.locator('[data-hub="grade-quiz"]').click();await p.locator('[data-hub="next"]').click();report.courses.push(row);if(n%10===0)console.log(JSON.stringify({track,completed:n+1,total,current:c.id}));
 }
 report.passed=true;report.completed=await p.evaluate(track=>hubState.completed[track].length,track);assert.equal(report.completed,total);await context.storageState({path:out+'/state-'+track+'.json'});
 }catch(e){process.exitCode=1;report.passed=false;report.failure=String(e);await p.screenshot({path:out+'/failure-'+track+'.png',fullPage:true});console.log(JSON.stringify({track,failure:report.failure,current:report.current}));}
 fs.writeFileSync(out+'/flow-'+track+'.json',JSON.stringify(report,null,2));console.log(JSON.stringify({track,passed:report.passed,courses:report.courses.length,errors:report.errors}));await context.close();
}await browser.close();})().catch(e=>{console.error(e);process.exit(1)});

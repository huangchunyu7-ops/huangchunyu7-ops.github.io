const {chromium}=require(process.env.LEARNING_BROWSER_MODULE||'playwright');
const assert=require('node:assert/strict');
(async()=>{
 const b=await chromium.launch(),p=await b.newPage({viewport:{width:390,height:844}}),errors=[];
 p.on('pageerror',e=>errors.push(e.message));await p.goto(process.env.LEARNING_TEST_URL||'http://127.0.0.1:8766/');
 assert.equal(await p.locator('.learning-resume-panel').count(),0);
 assert.equal(await p.locator('.subject-card [data-tip]').count(),0);
 await p.locator('.subject-card[data-id=python]').click();await p.locator('[data-python=lesson]').first().click();
 assert.equal(await p.locator('#selection-explanation').count(),0);
 await p.locator('[data-reading=next]').click();assert.equal(await p.evaluate(()=>readingPages[readingKey]),1);
 await p.locator('.reading-sheet [data-tip]').first().click();assert(await p.locator('#selection-explanation').isVisible());
 await p.keyboard.press('Escape');assert.equal(await p.locator('#selection-explanation').count(),0);
 await p.locator('[data-reading=next]').click();const position=await p.evaluate(()=>readingPages[readingKey]);
 await p.locator('.hub-header .brand').click();assert(await p.locator('[data-learning-resume]').isVisible());
 await p.locator('[data-learning-resume]').click();assert.equal(await p.evaluate(()=>readingPages[readingKey]),position);
 await p.reload();assert(await p.locator('[data-learning-resume]').isVisible());await p.locator('[data-learning-resume]').click();assert.equal(await p.evaluate(()=>readingPages[readingKey]),position);
 await p.goBack();await p.waitForFunction(()=>view==='hub');await p.goForward();await p.waitForFunction(()=>view==='python-course');
 await p.locator('.mobile-tabs [data-hub=books]').click();await p.waitForFunction(()=>view==='books');
 await p.locator('[data-hub=open-book]').first().click();await p.waitForFunction(()=>view==='reader'&&readerBook?.html&&!readerBook.html.includes('正在读取'));
 await p.goBack();await p.waitForFunction(()=>view==='books');await p.goForward();await p.waitForFunction(()=>view==='reader');assert(await p.locator('#reader-content').isVisible());
 await p.locator('.hub-header .brand').click();await p.locator('.subject-card[data-id=japanese]').click();await p.locator('.mobile-tabs [data-pane=lessons]').click();await p.locator('.jp-course-row').first().click();
 const jpId=await p.evaluate(()=>jpLessonId);await p.locator('[data-jp=lesson-page][data-delta="1"]').click();
 await p.goBack();await p.waitForFunction(()=>view==='japanese'&&jpPane==='lessons');await p.goForward();await p.waitForFunction(()=>jpPane==='lesson');assert.equal(await p.evaluate(()=>jpLessonProgress(jpLessonId).page),1);
 await p.reload();assert(await p.locator('[data-learning-resume]').isVisible());await p.locator('[data-learning-resume]').click();assert.equal(await p.evaluate(()=>jpLessonId),jpId);assert.equal(await p.evaluate(()=>jpLessonProgress(jpLessonId).page),1);
 for(const theme of ['light','dark'])for(const width of [360,390,430,768,1440]){await p.setViewportSize({width,height:844});await p.locator('.hub-header .brand').click();await p.evaluate(t=>efSetTheme(t),theme);assert(await p.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));assert(await p.locator('[data-learning-resume]').isVisible());}
 // Seed completed-course fixtures only to cover the home handoff branches.
 await p.evaluate(()=>{hubState.completed.beginner=hubCurriculum.beginner.map(c=>c.id);view='hub';render();});assert.equal(await p.locator('.ef-home-start').getAttribute('data-action'),'lesson');await p.locator('.ef-home-start').click();assert.equal(await p.evaluate(()=>view),'classroom');
 await p.evaluate(()=>{state.completed=courses.map(c=>c.id);view='hub';render();});assert.equal(await p.locator('.ef-home-start').getAttribute('data-track'),'opswork');
 await p.evaluate(()=>{hubState.completed.opswork=hubCurriculum.opswork.map(c=>c.id);render();});assert.equal(await p.locator('.ef-home-start').getAttribute('data-hub'),'subject');
 assert.deepEqual(errors,[]);await b.close();console.log('Homepage resume, saved reading position, Japanese resume, beginner-to-Linux-to-operations handoff, no stale term dialog, and browser Back/Forward across courses and reader passed.');
})().catch(e=>{console.error(e);process.exit(1)});

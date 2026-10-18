/* Restore the latest design's resume entry and browser Back/Forward semantics.
 * History contains public route IDs only, never notes, credentials or answers. */
function clearLearningPopovers(){document.getElementById('selection-explanation')?.remove();document.getElementById('coach-hover-tip')?.remove();}
const navigationPriorPaint=paintReading;
paintReading=function(){clearLearningPopovers();return navigationPriorPaint();};
const navigationPriorResume=resumeLesson;
resumeLesson=function(){
 if(lastLearning?.kind==='japanese-lesson'){const c=hubCurriculum.japanese.find(c=>c.id===lastLearning.id);return c?{...lastLearning,title:c.title}:null;}
 if(lastLearning?.kind==='japanese-session')return jpSessionActive()?{kind:'japanese-session',title:'继续日语词书中未完成的一轮'}:null;
 return navigationPriorResume();
};
function rememberJapaneseLearning(){
 let bookmark;
 if(view==='japanese'&&jpPane==='lesson')bookmark={kind:'japanese-lesson',id:jpLesson().id};
 if(view==='japanese'&&jpPane==='session'&&jpSessionActive())bookmark={kind:'japanese-session'};
 if(!bookmark)return;
 lastLearning=bookmark;try{localStorage.setItem('learning-resume-v1',JSON.stringify(bookmark));localProgressOK=true;}catch{localProgressOK=false;}
}
function navigationResumeStatus(b){
 if(b.kind==='hub'){const c=hubCurriculum[b.track][b.index],a=hubState.attempts[b.track+':'+b.id];return hubState.completed[b.track].includes(b.id)?'上次课程已通过，可以复习或继续下一课。':`已确认 ${a?.step||0} / ${c.tasks.length} 步；讲解页码和草稿已保存。`;}
 if(b.kind==='base'){const c=courses[b.index],a=state.sessions[b.index];return `已确认 ${a?.step||0} / ${c.steps.length} 步；返回原来的阅读或操作阶段。`;}
 if(b.kind==='python')return '返回原来的讲解、代码草稿或小测；再次运行代码时需准备 Python 环境。';
 return '返回原来的日语学习位置；个人导入文件仍仅保存在本浏览器。';
}
const navigationPriorHome=hubHome;
hubHome=function(){let html=navigationPriorHome();const b=resumeLesson();
 if(hubCurriculum.beginner.every(c=>hubState.completed.beginner.includes(c.id))){
  const baseNext=courses.find(c=>!state.completed.includes(c.id)),opsNext=opsOrderedCourses().find(c=>!hubState.completed.opswork.includes(c.id));
  const title=baseNext?.title||opsNext?.title||'回顾运维学习路线',summary=baseNext?.summary||opsNext?.summary||'核心路线已完成；可复习课程或选择排障演练。';
  const button=baseNext?`data-action="lesson" data-id="${baseNext.id}"`:opsNext?`data-hub="lesson" data-track="opswork" data-index="${hubCurriculum.opswork.indexOf(opsNext)}"`:'data-hub="subject" data-id="ops"';
  html=html.replace(/<div class="ef-current-lesson">[\s\S]*?<\/div><\/section>/,`<div class="ef-current-lesson"><div class="ef-current-heading"><span>// NEXT LESSON</span><span>${baseNext?'Linux 与常用命令':'运维工作路线'}</span></div><h2>${esc(title)}</h2><p>${esc(summary)}</p><p class="small-note">零基础准备已完成，接下来把认识变成操作。</p><button class="primary ef-home-start" ${button}>${baseNext||opsNext?'进入下一阶段':'回顾学习路线'}<span aria-hidden="true">↗</span></button></div></section>`);
 }
 if(!b)return html;return html.replace(/<main\b[^>]*>/,m=>m+`<section class="learning-resume-panel"><div><span class="ef-eyebrow">// CONTINUE LEARNING</span><h2>继续上次学习</h2><h3>${esc(b.title)}</h3><p>${esc(navigationResumeStatus(b))}</p></div><button class="primary" data-learning-resume>回到上次的位置</button></section>`);
};
learningGuideHTML=function(){return `<main class="hub-main"><div class="page-head"><div><span class="ef-eyebrow">// START HERE</span><h1>先完成一课，再走下一步。</h1><p>先认识工具，再动手；知道每一步在验证什么。</p></div><button class="primary" data-hub="lesson" data-track="beginner" data-index="${hubNextIndex('beginner')}">进入零基础准备</button></div>
 <section class="section"><h2>第一次来，按这条路走</h2><ol class="guide-steps"><li><b>先认电脑、终端、用户与目录。</b>首页的零基础准备不要求你会命令，术语可以点开解释。</li><li><b>再学单条 Linux 命令和参数。</b>先分清命令名、选项和对象，再把命令用管道连接起来。</li><li><b>按运维阶段继续。</b>系统、网络、服务、数据库、Docker、Kubernetes、自动化、监控和综合排障逐步推进。可按问题选课。</li></ol><button class="secondary" data-hub="subject" data-id="ops">查看运维阶段</button><button class="text-button" data-beginner="glossary">遇到生词，查看图解词典</button></section>
 <section class="section"><h2>一节课怎样从头做到尾？</h2><ol><li><b>逐页阅读。</b>最后一页点击“讲解读完了”，才进入练习。</li><li><b>按任务作答。</b>命令课输入命令，场景课选择判断；Python 先准备运行环境，再运行代码。日语使用独立的词书与课程流程。</li><li><b>卡住时先看提示。</b>命令实练有工具、参数和参考命令三层提示；补全不会替你执行。</li><li><b>验证后读结果，再确认。</b>完成全部步骤才进入小测；错了留在当前步骤。</li><li><b>检查小测，再手动继续。</b>改了答案需要重新检查；通过一课不等于已经掌握真实生产环境。</li></ol></section>
 <section class="section"><h2>中途退出，怎样接着学？</h2><p>同一浏览器会保存讲解页码、草稿和已确认步骤。回到首页点击“继续上次学习”；浏览器的返回、前进也可以切换已经打开的页面。</p><p>未登录时，记录留在本机。登录同一个个人账户后，可同步课程进度、代码草稿与笔记；多设备冲突时先选择保留方式，避免覆盖。</p><p>自己导入的词书、音频和 EPUB 文件仍只在当前浏览器。换设备需要重新导入；请保留原文件。Python 再次运行需要准备浏览器运行环境。</p></section>
 <section class="section"><h2>几种课堂有什么不同？</h2><ul><li><b>基础命令与运维课：</b>使用有限的教学模拟或固定快照，不连接公司服务器。基础课按顺序解锁，工作阶段可以选课。</li><li><b>命令实练：</b>从现象出发查证据，支持已实现的等价写法；错误对象和条件不能通关。</li><li><b>排障演练：</b>三个案例独立保存证据，查证后再选择原因、处理与验收方式。</li><li><b>Python：</b>在浏览器实际运行 Python；样本文件每次运行重置，代码草稿单独保存。</li><li><b>日语：</b>先学五十音，再用词书、例句、分级课程与复习计划巩固。</li></ul><button class="secondary" data-hub="books">去书房阅读</button></section></main>`;};
document.addEventListener('click',e=>{if(!e.target.closest('[data-learning-resume]'))return;const b=resumeLesson();if(!b)return;if(b.kind==='hub')openHubLesson(b.track,b.index);else if(b.kind==='base')startLesson(b.index);else if(b.kind==='python')pythonOpen(b.index);else if(b.kind==='japanese-lesson')jpOpenLesson(b.id);else jpOpen('session');});
function learningRouteSnapshot(){
 const r={view};
 if(view==='subject'){r.subject=hubSubject;r.stage=opsRouteStage;r.query=opsRouteQuery;r.level=hubLevel;}
 if(view==='hub-course'){r.track=hubTrack;r.id=activeHubLesson().id;}
 if(view==='classroom'){r.id=state.current;if(lab)r.lab=labs.indexOf(lab);}
 if(view==='python-course')r.id=pythonCurrent().id;
 if(view==='japanese'){r.pane=jpPane;if(jpPane==='lesson')r.id=jpLesson().id;if(jpPane==='book')r.book=jpBookLevel;if(jpPane==='word')r.word=jpWordId;}
 if(view==='reader'&&readerBook){r.book=readerBook.id;}
 if(view==='incident')r.id=incidentId;
 if(view==='demos')r.demo=demoState.type;
 return r;
}
let navigationRestoring=false,navigationLastKey='';
function recordLearningRoute(){
 if(navigationRestoring)return;
 const r=learningRouteSnapshot(),key=JSON.stringify(r);if(key===navigationLastKey)return;
 try{if(navigationLastKey)history.pushState({learningRoute:r},'',location.href);else history.replaceState({learningRoute:r},'',location.href);navigationLastKey=key;}catch{}
}
async function restoreLearningRoute(r){
 if(!r||typeof r.view!=='string')return;
 navigationRestoring=true;clearLearningPopovers();
 try{
  if(r.view==='hub-course'){const i=hubCurriculum[r.track]?.findIndex(c=>c.id===r.id);if(i>=0&&hubUnlocked(r.track,i))openHubLesson(r.track,i);else{view='hub';render();}}
  else if(r.view==='classroom'){if(Number.isInteger(r.lab)&&labs[r.lab])startLab(r.lab);else if(Number.isInteger(r.id)&&courseUnlocked(r.id))startLesson(r.id);else{view='hub';render();}}
  else if(r.view==='python-course'){const i=pythonLessons.findIndex(c=>c.id===r.id);if(i>=0&&pythonUnlocked(i))pythonOpen(i);else{view='hub';render();}}
  else if(r.view==='japanese'){if(r.pane==='lesson')jpOpenLesson(r.id);else{if(r.book)jpBookLevel=r.book;if(r.word)jpWordId=r.word;jpOpen(r.pane==='session'&&!jpSessionActive()?'today':r.pane);}}
  else if(r.view==='reader'){if(readerBook?.id===r.book){view='reader';render();}else await openLibraryBook(r.book);}
  else if(r.view==='incident'&&incidentCases.some(c=>c.id===r.id))incidentOpen(r.id);
  else if(r.view==='subject'&&hubSubjects[r.subject]){hubSubject=r.subject;hubLevel=r.level||'全部';if(opsStages.some(s=>s.id===r.stage)||r.stage==='all')opsRouteStage=r.stage;opsRouteQuery=typeof r.query==='string'?r.query.slice(0,100):'';view='subject';render();}
  else if(['hub','books','account','guide','glossary','demos','manual','labs','roadmap','anime','python-roadmap'].includes(r.view)){if(r.demo&&demoTitles[r.demo])demoState.type=r.demo;view=r.view;render();}
  else{view='hub';render();}
  window.scrollTo({top:0,behavior:'instant'});
 }finally{navigationRestoring=false;navigationLastKey=JSON.stringify(learningRouteSnapshot());history.replaceState({learningRoute:learningRouteSnapshot()},'',location.href);}
}
window.addEventListener('popstate',e=>{if(e.state?.learningRoute)restoreLearningRoute(e.state.learningRoute);});
const navigationPriorRender=render;
render=function(){clearLearningPopovers();rememberJapaneseLearning();navigationPriorRender();recordLearningRoute();};
render();

/* Taste Skill v2.1.5 / editorial-greeting / seed 20261103.
 * 1100px = 12 equal columns + 11 x 16px gutters. The home spans 3/3/3/3,
 * 9/3, then 6/6. Existing course IDs, event handlers and saved evidence own
 * all navigation and assessment; this file changes presentation only. */
function tasteMetrics(){
 const completed=state.completed.length+Object.values(hubState.completed).reduce((n,ids)=>n+ids.length,0)+pythonLessons.filter((_,i)=>pythonPassed(i)).length;
 return {courses:courses.length+pythonLessons.length+Object.values(hubCurriculum).reduce((n,items)=>n+items.length,0),completed,books:bookCatalog.filter(b=>b.file).length,wrong:Object.values(civilState.records).filter(r=>r.latest==='wrong').length};
}
function tasteNextLesson(){
 const bookmark=resumeLesson();
 if(bookmark)return {title:bookmark.title,label:'继续上次学习',action:'data-learning-resume',detail:navigationResumeStatus(bookmark),bookmark};
 const beginner=hubNextIndex('beginner'),ready=hubCurriculum.beginner.every(c=>hubState.completed.beginner.includes(c.id));
 const track=ready?'opswork':'beginner',index=ready?hubNextIndex('opswork'):beginner,c=hubCurriculum[track][index];
 return {title:c.title,label:ready?'继续运维课程':'开始这节课',action:`data-hub="lesson" data-track="${track}" data-index="${index}"`,detail:ready?'把服务、日志与数据库的证据连起来。':'先认电脑、终端和目录，再亲手输入第一条命令。',bookmark:null};
}
function tasteHome(){
 const next=tasteNextLesson(),m=tasteMetrics(),date=new Intl.DateTimeFormat('zh-CN',{timeZone:'Asia/Shanghai',month:'long',day:'numeric',weekday:'long'}).format(new Date());
 const domains=Object.entries(hubSubjects).map(([id,s])=>{const count=id==='ops'?hubCurriculum.opswork.length:id==='python'?pythonLessons.length:id==='civil'?civilMethods.length:hubCurriculum[id].length;return `<button class="taste-domain" data-hub="subject" data-id="${id}"><span><b>${esc(s.name)}</b><small>${esc(s.description)}</small></span><span class="taste-domain-count">${count}<small>${id==='civil'?'类方法':'节课程'}</small></span><span aria-hidden="true">↗</span></button>`;}).join('');
 return `<main class="hub-main taste-home"><div class="taste-home-title"><div><h1>今天，继续把知识用起来。</h1><p>${date} · 知行学习室</p></div><button class="secondary" data-guide="open">学习指南</button></div>
 <div class="taste-metrics" aria-label="本设备学习概览"><div><span>可学课程</span><b>${m.courses}<small>节</small></b></div><div><span>已通过课程</span><b>${m.completed}<small>节</small></b></div><div><span>书房原文</span><b>${m.books}<small>本</small></b></div><div><span>行测待复盘</span><b>${m.wrong}<small>题</small></b></div></div>
 <div class="taste-home-grid"><section class="taste-continue"><div class="taste-panel-heading"><h2>接着学这一课</h2><span>学习位置自动保存</span></div><h3>${esc(next.title)}</h3><p>${esc(next.detail)}</p><ol class="taste-lesson-flow"><li><b>理解</b><span>读讲解与示例</span></li><li><b>动手</b><span>验证每一步</span></li><li><b>检验</b><span>独立完成小测</span></li></ol><button class="primary" ${next.action}>${next.label}<span aria-hidden="true"> →</span></button></section>
 <section class="taste-practice"><h2>把排障练成习惯</h2><p>从一个页面报错开始，沿请求找证据。</p><div class="taste-evidence-chain"><span>页面请求</span><span>Nginx / 应用日志</span><span>DM8 数据与业务表</span></div><button class="secondary" data-incident="open" data-id="schema-500">进入排障演练</button></section></div>
 <section class="taste-work-route"><div class="taste-panel-heading"><div><h2>运维工作路线</h2><p>围绕工作中最常遇到的三个问题。</p></div><button class="text-button" data-hub="subject" data-id="ops">全部运维课程 →</button></div><div class="taste-route-links"><button data-taste-stage="commands"><b>命令与管道</b><span>筛选、组合输出，写清每个参数</span></button><button data-taste-stage="service"><b>日志与服务</b><span>从网页报错定位到具体服务</span></button><button data-taste-stage="database"><b>SQL 与 DM8</b><span>找到业务表，验证连接和数据</span></button></div></section>
 <section class="taste-classrooms"><div class="taste-panel-heading"><h2>学习领域</h2><span>按需选课，逐步验证</span></div><div class="taste-domain-grid">${domains}</div></section>
 <footer class="taste-home-footer"><span>学过的，留得下来。</span><p>本设备保留学习位置与草稿；个人账户可同步已支持的课程记录。考公记录可在模块内导出备份。</p><button class="text-button" data-account="open">个人账户与笔记 →</button></footer></main>`;
}
hubHome=tasteHome;
function tasteDecorate(){
 document.body.classList.add('taste-learning');
 document.body.dataset.tasteView=view;
 const brand=document.querySelector('.hub-header .brand-icon');
 if(brand){brand.innerHTML='<svg viewBox="0 0 36 36" fill="none" aria-hidden="true"><path d="M5 8h11c4 0 6 2 6 6v16c0-4-2-6-6-6H5V8Z" stroke="currentColor" stroke-width="2"/><path d="M22 14c0-4 2-6 6-6h3v16h-3c-4 0-6 2-6 6M11 13h5M11 18h5" stroke="currentColor" stroke-width="2"/></svg>';}
 // Visual metadata is moved into the established page title and scope. The
 // underlying labels and reading/answer controls keep their accessible names.
 document.querySelectorAll('.ef-page-label,.ef-tab-label').forEach(el=>el.remove());
 const active=document.querySelector('.hub-header nav [data-civil="pane"]');
 if(active)active.setAttribute('aria-current',view==='civil'?'page':'false');
 const ops=document.querySelector('.ops-path-main');
 if(ops){
  ops.querySelector('h1').textContent='运维工作路线';
  const intro=ops.querySelector('.ops-path-intro'),map=ops.querySelector('.ops-path-map');
  if(intro&&map&&!ops.querySelector('.taste-route-help')){const help=document.createElement('details'),summary=document.createElement('summary');help.className='taste-route-help';summary.textContent='课程路线与新手指引';intro.before(help);help.append(summary,intro,map);}
  const stage=ops.querySelector('.ops-stage-heading');
  if(stage&&!stage.querySelector('.taste-stage-goal')){const paragraphs=[...stage.querySelectorAll(':scope > p')];if(paragraphs.length>2){const goal=document.createElement('details'),summary=document.createElement('summary');goal.className='taste-stage-goal';summary.textContent='本阶段目标与验收';goal.append(summary,...paragraphs);stage.querySelector('h2').after(goal);}}
 }
}
const tasteBaseRender=render;
render=function(){tasteBaseRender();tasteDecorate();};
document.addEventListener('click',e=>{const button=e.target.closest('[data-taste-stage]');if(!button)return;const stage=button.dataset.tasteStage;if(!opsStages.some(s=>s.id===stage))return;hubSubject='ops';opsRouteStage=stage;opsRouteQuery='';view='subject';render();window.scrollTo({top:0,behavior:'instant'});});
tasteDecorate();render();

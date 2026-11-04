/* Novice guidance is presentation plus explicit user actions. It never grades,
 * advances tasks, edits answers or marks a reading page complete by itself. */
const novicePriorPages=hubTeachingPages;
hubTeachingPages=function(c){return c.novicePages||novicePriorPages(c);};
let novicePipeStep=0,novicePipePattern='ERROR';
function novicePipeHTML(){
 const engine=new JobEngine(),path='/opt/order/logs/app.log';
 const commands=['cat '+path,'grep -F '+novicePipePattern+' '+path,'grep -F '+novicePipePattern+' '+path+' | wc -l'];
 const result=engine.execute(commands[novicePipeStep]);
 const meanings=['原文有 4 行。先看输入范围，再选需要的内容。','只输出包含指定文字的整行。没有匹配时结果为空，不代表系统没有其他问题。','右侧 wc -l 从管道接收内容，数的是匹配行。它不去重新读取原文件。'];
 return `<section class="novice-pipeline" aria-label="管道分步演示"><h3>点一步，看文本怎样流动</h3><label for="novice-pattern">查找文字 <select id="novice-pattern">${['ERROR','INFO','WARN'].map(p=>`<option ${p===novicePipePattern?'selected':''}>${p}</option>`).join('')}</select></label><div class="novice-pipe-steps">${['1 · 读原文','2 · 筛选整行','3 · 统计匹配行'].map((s,i)=>`<button type="button" data-novice-pipe="${i}" aria-pressed="${novicePipeStep===i}">${s}</button>`).join('')}</div><p>${esc(meanings[novicePipeStep])}</p><div class="novice-io"><div><h3>这一段命令</h3><pre>${esc(commands[novicePipeStep])}</pre></div><div><h3>模拟器返回</h3><pre role="status">${esc(result.out||'（没有匹配行，输出为空）')}</pre></div></div><p class="small-note">用的是同一份固定教学日志。这是观察演示，不会替你完成后面的练习。| 按标准输出 → 标准输入传递文本，不会改写原文件。</p></section>`;
}
const novicePriorPageContent=pageContentHTML;
pageContentHTML=function(p){
 let html=novicePriorPageContent(p);
 if(p.kind==='novice-request-card')html+='<dl class="novice-parts"><div><dt>时间</dt><dd>复现时记录，包含时区；当前样本未提供</dd></div><div><dt>方法 / 路径</dt><dd>GET /api/orders</dd></div><div><dt>状态码</dt><dd>500</dd></div><div><dt>请求标识</dt><dd>r-101</dd></div></dl><p class="small-note">路径、状态和编号来自教学日志；这份简化日志未包含时间，需另行记录。不是你当前浏览器的真实抓包。</p>';
 if(p.kind==='novice-roles')html+='<div class="novice-roles"><div><b>你的设备</b><span>操作系统管理设备和应用</span><strong>浏览器：发出请求、展示结果</strong></div><span aria-hidden="true">⇄</span><div><b>提供网站服务的一端</b><span>操作系统管理服务器资源</span><strong>网站服务：处理请求、返回内容</strong></div></div><p>图只说明角色与请求 / 响应，网络怎样连接会在后面逐步学习。</p>';
 if(p.kind==='novice-syntax')html+=`<pre class="novice-standard">${annotatedCommand(p.command)}</pre><dl class="novice-parts">${p.parts.map(([part,meaning])=>`<div><dt><code>${esc(part)}</code></dt><dd>${esc(meaning)}</dd></div>`).join('')}</dl>`;
 if(p.kind==='novice-example')html+=`<div class="novice-io"><div><h3>你输入 · 只输入这一行</h3><pre>${esc(p.command)}</pre></div><div><h3>系统返回 · 不要再当命令输入</h3><pre>${esc(p.output||'（成功时没有文字输出）')}</pre></div></div>${p.after?`<p>再输入 <code>pwd</code> 验证位置，返回：</p><pre>${esc(p.after)}</pre>`:''}<p>如果示例显示 <code>student@lab:~$</code>，它是提示符，不属于要输入的命令。本课不会操作你的真实文件。</p>`;
 if(p.kind==='novice-pipe')html+=novicePipeHTML();
 return html;
};
function noviceFirstCourseButton(){return `data-hub="lesson" data-track="beginner" data-index="${hubNextIndex('beginner')}"`;}
function noviceStartHTML(){return `<section class="novice-start"><div><h2>第一次来？从这里开始。</h2><p>不用先装 Linux，也不用先背命令。先认电脑、终端与目录，再在网页里亲手练习。</p><ol><li>看一个例子，分清每个角色。</li><li>自己作答，读结果，手动确认。</li><li>小测通过，再走下一关。</li></ol></div><div class="novice-start-action"><button class="primary" ${noviceFirstCourseButton()}>${hubState.completed.beginner.length?'继续零基础准备':'从第 1 课开始'}</button><button class="text-button" data-guide="open">先看怎么学 →</button><small>手机点按钮即可；电脑和手机使用相同课程流程。</small></div></section>`;}
const novicePriorHome=hubHome;
hubHome=function(){let html=novicePriorHome();if(!hubCurriculum.beginner.every(c=>hubState.completed.beginner.includes(c.id))){html=html.replace('<div class="taste-metrics"',noviceStartHTML()+'<div class="taste-metrics"');if(!resumeLesson())html=html.replace('今天，继续把知识用起来。','从第一步，学会解决问题。');}return html;};
learningGuideHTML=function(){return `<main class="hub-main novice-guide"><div class="page-head"><div><h1>不会，也能从这里开始。</h1><p>先完成一小步，再把它用到下一个问题。</p></div><button class="primary" ${noviceFirstCourseButton()}>开始 / 继续零基础准备</button></div>
 <section class="section"><h2>先选适合自己的起点</h2><div class="novice-route-choice"><div><h3>我连终端、路径都不认识</h3><p>先学零基础准备。用图和场景分清电脑、账号、目录与网络，不要求先写命令。</p><button class="secondary" ${noviceFirstCourseButton()}>从概念开始</button></div><div><h3>我认识概念，但写命令容易忘</h3><p>从 whoami、pwd、ls 开始，一课一条命令，再学筛选、计数与管道。</p><button class="secondary" data-hub="lesson" data-track="opswork" data-index="${hubCurriculum.opswork.findIndex(c=>c.id==='cmd-start-identity')}">从第一条命令开始</button></div></div></section>
 <section class="section"><h2>第一节课，照这 5 步走</h2><ol class="novice-how"><li><b>先看目标。</b>知道学完要能解释什么、完成什么。</li><li><b>用下方“下一页”读讲解。</b>输入与系统返回分开展示。带下划线的术语可以点击查词。</li><li><b>最后一页点“讲解读完了”。</b>选择题先点选项，再点“检查本步答案”；命令题在输入框里输入命令，再点“执行命令并验证”。</li><li><b>核对结果，再确认。</b>答错留在原处，按提示修改；答对也不会自动跳。点击“确认结果”完成这一步。</li><li><b>完成操作后，独立答小测。</b>点击“检查答案”，通过后再手动进入下一关。改选答案需要重新检查。</li></ol><p>卡住时用“回到相关讲解”。不会清除已确认步骤；不要用“重练本关”代替回看，重练会重新开始本关。</p></section>
 <section class="section"><h2>哪些文字要输入？</h2><div class="novice-io"><div><h3>输入命令</h3><pre>pwd</pre></div><div><h3>返回结果</h3><pre>/home/student</pre></div></div><p>只输入 pwd；/home/student 是系统告诉你的当前位置。示例中的 $、student@lab:~$ 是提示符，不要复制。选项、引号、大小写和空格要按含义核对。</p><p>练习框里按 Enter 可以换行；点“执行命令并验证”才会运行。手机不需要实体键盘的 Tab，卡住时可以点“补全当前片段”。</p></section>
 <section class="section"><h2>运维按什么顺序学？</h2><ol class="novice-how"><li><b>认识概念：</b>电脑 → 终端 → 账号与权限 → 目录与路径 → 网络设备与地址。</li><li><b>学会单条命令：</b>身份 → 位置 → 列表 → 读取 → 取开头 / 末尾 → 筛选 → 计数 → 管道。</li><li><b>走工作路线：</b>准备环境 → 命令与文件 → 系统 → 网络 → 服务日志 → 数据库与 DM8 → Docker → Kubernetes → 自动化 → 监控 → 发布与综合排障。</li><li><b>把证据串起来：</b>页面错误的时间 / 请求标识 → 入口日志 → 服务日志 → 数据源与 SQL → 表和字段 → 处理后的验证。</li></ol><p>工作阶段可按需选课；“下一关”和关卡编号按同一推荐顺序前进。某条命令能运行，不等于结果已经符合任务目标。</p><button class="secondary" data-hub="subject" data-id="ops">查看运维工作路线</button></section>
 <section class="section"><h2>退出后怎样继续？</h2><p>同一浏览器保留阅读页码、练习草稿与已确认步骤。首页点击“继续上次学习”。浏览器返回 / 前进可切换已访问页面。</p><p>手机和电脑都可以学。未登录记录存在当前设备；跨设备同步需登录同一个个人账户，并使用账户中支持的同步范围。自行导入的 EPUB、词书和音频仍需在另一台设备重新导入。</p><p>运维命令使用有限教学模拟或固定快照，不连接公司服务器。真实环境的路径、账号、版本和权限需要重新核对。Python 使用单独的浏览器运行环境。</p></section>
 ${noviceReferenceHTML()}</main>`;};
function noviceReferenceHTML(){return `<details class="course-endnotes novice-references"><summary>教学设计与技术参考</summary><p>本站示例、中文讲解与题目为原创。参考公开资料组织知识顺序与验证方式，不代表已获下列机构审核。</p><p><a href="https://swcarpentry.github.io/shell-novice/" target="_blank" rel="noopener noreferrer">Software Carpentry · The Unix Shell</a>：参考学前问题、明确目标、示例与练习相接的组织方式。</p><p><a href="https://www.itheima.com/special/linuxzly/" target="_blank" rel="noopener noreferrer">黑马程序员 · Linux 公开课程大纲</a>：参考系统基础、网络服务、数据库、自动化与容器等主题范围；没有复制其付费讲义。</p><p><a href="https://www.gnu.org/software/bash/manual/" target="_blank" rel="noopener noreferrer">GNU Bash 手册</a> · <a href="https://www.gnu.org/software/coreutils/manual/" target="_blank" rel="noopener noreferrer">GNU Coreutils 手册</a> · <a href="https://www.gnu.org/software/grep/manual/" target="_blank" rel="noopener noreferrer">GNU grep 手册</a>：核对命令、参数与输出含义。</p></details>`;}
function noviceReviewPage(c){if(c.novicePages)return Math.min(c.novice?.review??0,c.novicePages.length-1);return 0;}
function noviceReview(){if(view!=='hub-course')return;const c=activeHubLesson();readingPages['hub:'+hubTrack+':'+c.id]=noviceReviewPage(c);saveReadingPages();hubPhase=hubAttempt.phase='learn';hubSave();render();document.querySelector('.reading-page-top')?.scrollIntoView?.({block:'start',behavior:'instant'});}
function noviceDiagnosis(task,draft){
 const input=String(draft||'').trim();
 if(task.expected&&input===task.expected&&input!==task.command)return '你输入的是示例返回值或结果里的文字。这里需要输入产生结果的命令；返回结果由系统显示，不用再抄回输入框。';
 if(!input)return '输入框还是空的。先写要执行的命令，再点击验证；下方返回区用来读结果。';
 if(/^(?:student|root)@[^$#\n]*[$#]\s/.test(input)||/^[$#]\s/.test(input))return '你可能把提示符一起复制了。删去 student@lab:~$ 或开头的 $，只保留它后面的命令。';
 if(/[｜－—“”‘’]/.test(input))return '检查全角符号：中文输入法的 ｜、－、弯引号与命令里的 |、-、直引号不同。切换英文符号后再试。';
 if(/\b(?:ls|wc)\s+-1\b/.test(input)&&/\b-l\b| -l/.test(task.command))return '这里要用小写字母 L：-l。你输入的是数字一：-1；即使命令可以运行，它的含义也不同。';
 if(task.command.includes('|')&&/\|\s*wc\s+-l\s+\S/.test(input))return '管道右侧 wc -l 后面又写了文件名。那会重新读取文件，无法统计左侧筛选出的文本。先说清右侧的输入来自哪里。';
 if(!input.includes(' ')&&task.command.includes(' '))return '先分清动作与对象。只写文件名、路径或结果值不会完成这个任务；命令名与参数之间还需要空格。';
 return '对照任务逐项查：命令名是否正确？选项大小写是否正确？操作对象和输入范围是否正确？再读返回区的具体错误；支持的等价写法不要求逐字照抄。';
}
function noviceContext(c){
 if(c.novice)return c.novice;
 const stage=typeof opsStageOf==='function'&&hubTrack==='opswork'?opsStages.find(s=>s.id===opsStageOf(c)):null;
 if(stage)return {goal:stage.check,before:'本阶段：'+stage.name+'。'+stage.goal};
 return {goal:'能解释本课概念，并独立完成“'+c.quiz.prompt+'”这一判断。',before:'先看本课示例；遇到生词可点击解释，或回到图解词典查阅。'};
}
function noviceDecorate(){
 if(view!=='hub-course')return;
 const main=document.querySelector('main'),c=activeHubLesson(),a=hubAttempt,t=c.tasks[a.step],context=noviceContext(c);
 if(!main||main.querySelector('.novice-class-guide'))return;
 const guide=document.createElement('section');guide.className='novice-class-guide';guide.setAttribute('aria-label','本课学习指引');
 const cues={learn:'先读目标与示例。用讲解下方的“下一页”阅读，最后一页进入练习。',practice:t?.type==='command'?'先输入命令，再点验证。看返回结果，通过后手动确认。':t?'先选择一个选项，再点验证。答错时停在这一步，按解释重新判断。':'操作已完成。进入小测，用另一道题检验理解。',quiz:'先独立选答案，再点“检查答案”。答错可以回看讲解，改选后需要重新检查。'};
 guide.innerHTML=`<p><b>学完能做到：</b>${esc(context.goal)}</p><details><summary>学前准备与通关条件</summary><p>${esc(context.before)}</p><ol><li>读完讲解并主动进入练习${a.read?' ✓':''}</li><li>验证并确认 ${a.step} / ${c.tasks.length} 个操作步骤</li><li>独立完成本课小测${hubPassed()?' ✓':''}</li></ol><button class="text-button" data-guide="open">不清楚按钮怎么用？查看新手指南</button></details><p class="novice-next-cue">${esc(cues[hubPhase])}</p>${a.quizUpdated?'<p role="status">本课小测已改为具体场景题。已学讲解与已确认操作保留，请重新答小测检验理解。</p>':''}`;
 main.querySelector('h1').after(guide);
 // The existing flow cue repeats an often unhelpful summary, such as “you are
 // viewing a website”. Replace it with the actionable classroom guide above.
 main.querySelector('.flow-cue')?.remove();
 if(hubPhase==='learn'){
  const sheet=main.querySelector('.reading-sheet');if(sheet&&!sheet.querySelector('.novice-page-help')){const help=document.createElement('p');help.className='novice-page-help small-note';help.textContent='用下方“上一页 / 下一页”按自己的速度阅读；这里的例子不会替你提交练习。';sheet.append(help);}
  return;
 }
 if(hubPhase==='practice'&&t){
  const form=main.querySelector('#hub-form'),output=main.querySelector('.hub-terminal');
  // A choice task's explanation can contain its correct answer. Show it after
  // verification, rather than printing that answer above an unattempted task.
  if(t.type==='choice'){const paragraph=form?.parentElement.querySelector('h2 + p');if(paragraph)paragraph.hidden=true;const submit=form?.querySelector('button[type="submit"]');if(submit){submit.textContent='检查本步答案';submit.disabled=a.verified||a.draft==='';}if(hubOutput&&!a.verified){const explanation=document.createElement('section');explanation.className=a.verified?'novice-task-explanation':'novice-remedy';explanation.setAttribute('role','status');explanation.innerHTML=`<h3>${a.verified?'为什么这样判断':'再看选项与原因'}</h3><p>你选了：${esc(t.options[Number(a.draft)]||'尚未选择')}</p><p>${esc(t.explanation)}</p>${a.verified?'':'<button class="secondary" data-novice="review">回到相关讲解，保留操作进度</button>'}`;output?.after(explanation);}}
  if(t.type==='command'&&form){
   const section=form.parentElement,coach=section.querySelector('.command-coach');
   const standard=section.querySelector(':scope > pre'),fill=section.querySelector('[data-hub="fill-task"]');
   const details=document.createElement('details');details.className='novice-command-help';details.innerHTML='<summary>卡住了？查看标准用法与逐段解释</summary>';
   form.before(details);if(standard)details.append(standard);if(fill)details.append(fill);if(coach)details.append(coach);
   const label=form.querySelector('label[for="hub-draft"]');if(label)label.textContent=/^\s*(SELECT|SHOW|WITH)\b/i.test(t.command)?'在这里输入 SQL，再点击验证':'在这里输入命令，再点击验证';
   const hint=document.createElement('p');hint.className='novice-input-help';hint.id='novice-input-help';hint.textContent='只输入命令，不输入 $ 提示符或示例结果。Enter 用于换行；点击下面的按钮才执行。';form.querySelector('textarea')?.before(hint);form.querySelector('textarea')?.setAttribute('aria-describedby',hint.id);
   if(hubOutput&&!a.verified){const diagnosis=document.createElement('section');diagnosis.className='novice-remedy';diagnosis.setAttribute('role','status');diagnosis.innerHTML=`<h3>先定位这一步</h3><p>${esc(noviceDiagnosis(t,a.draft))}</p><button class="secondary" data-novice="review">回到相关讲解，保留操作进度</button>`;output?.after(diagnosis);}
  }
  if(output){const title=document.createElement('h3');title.className='novice-output-label';title.textContent='返回结果 · 在这里核对，不要抄回输入框';output.before(title);}
 }
 if(hubPhase==='quiz'&&a.feedback){const feedback=main.querySelector('.quiz-feedback');if(feedback&&!hubPassed()){
  feedback.textContent='这次还没通过，仍在本关。';const remedy=document.createElement('section');remedy.className='novice-remedy';remedy.setAttribute('role','status');remedy.innerHTML=`<h3>从选项回到原因</h3><p>你选了：${esc(c.quiz.options[a.answer]||'尚未选择')}</p><p>${esc(c.quiz.explanation)}</p><p>回看后先用自己的话解释，再回来改选并检查。已确认的操作会保留。</p><button class="secondary" data-novice="review">回到相关讲解，保留操作进度</button>`;feedback.after(remedy);
 }}
 if(hubPhase==='quiz'&&hubPassed()){
  const i=hubFollowingIndex(hubTrack,hubLesson),following=i===null?null:hubCurriculum[hubTrack][i];if(following){const next=document.createElement('p');next.className='novice-next-lesson';next.textContent='下一课：'+following.title+'　点击“进入下一关”后才会切换。';main.querySelector('.gate-result')?.after(next);}
 }
 if(hubPhase!=='learn'&&!main.querySelector('[data-novice="review"]')){const review=document.createElement('button');review.type='button';review.className='text-button novice-review';review.dataset.novice='review';review.textContent='回看本课讲解（保留操作进度）';main.append(review);}
}
const novicePriorPaint=paintReading;
paintReading=function(){novicePriorPaint();if(view==='hub-course'){const c=activeHubLesson();if(c.novicePages&&readingTarget&&!readingTarget.querySelector('.novice-reading-outline')){const outline=document.createElement('p');outline.className='novice-reading-outline';const n=readingPages[readingKey]||0;outline.textContent=c.novicePages.map((p,i)=>(i===n?'● ':'')+p.title).join('  /  ');readingTarget.prepend(outline);}}};
const novicePriorRender=render;
render=function(){novicePriorRender();noviceDecorate();};
document.addEventListener('click',e=>{const button=e.target.closest('[data-novice]');if(button?.dataset.novice==='review')noviceReview();const pipe=e.target.closest('[data-novice-pipe]');if(pipe&&['0','1','2'].includes(pipe.dataset.novicePipe)){novicePipeStep=Number(pipe.dataset.novicePipe);paintReading();}});
document.addEventListener('change',e=>{if(e.target.id==='novice-pattern'&&['ERROR','INFO','WARN'].includes(e.target.value)){novicePipePattern=e.target.value;paintReading();}});
render();

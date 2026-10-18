/* A recommended order, not a new lock on previously saved lesson IDs. */
const opsStages=[
 {id:'environment',name:'准备练习环境',goal:'分清系统、虚拟机、账号与连接；先学会重来。',check:'能说清在哪台机器、用哪个账号、如何恢复。'},
 {id:'commands',name:'常用命令与文件',goal:'从单条命令、路径、参数开始，再进入筛选与管道。',check:'能解释命令名、选项、对象和输出。'},
 {id:'system',name:'系统、权限与磁盘',goal:'先观察身份、进程、存储与资源，再决定处理方式。',check:'能把现象对应到进程、权限或存储证据。'},
 {id:'network',name:'网络与防火墙',goal:'地址、DNS、端口、TLS、路由追踪和规则逐层核验。',check:'能区分不通发生在哪一层，不随意清空规则。'},
 {id:'service',name:'服务、日志与 Web',goal:'认识服务管理、共享目录和页面到服务的日志链。',check:'能把请求关联到具体服务和日志位置。'},
 {id:'database',name:'数据库与业务表',goal:'先认实例、表和字段，再学事务、优化、备份与 DM8。',check:'能确认连接身份、对象范围与恢复证据。'},
 {id:'container',name:'Docker 应用部署',goal:'先认镜像和容器，再学状态、挂载、网络与 Compose。',check:'能解释入口端口、数据位置和退出原因。'},
 {id:'cluster',name:'Kubernetes 集群',goal:'先懂对象关系，再观察上下文、Pod、Deployment 和 Service。',check:'能沿事件、标签、就绪状态找到故障环节。'},
 {id:'automation',name:'Shell 与自动化',goal:'用变量、条件、循环和 Ansible 把重复工作做稳。',check:'能限定目标、处理失败并验证重复执行。'},
 {id:'monitor',name:'监控与访问管理',goal:'串起采集、告警、通知和访问授权。',check:'能解释通知故障与最小访问权限。'},
 {id:'incident',name:'发布与综合排障',goal:'把入口、服务、容器、数据库、监控和回退连成一条链。',check:'能写出证据、判断、处理、验证和回退记录。'}
];
function opsStageOf(c){
 if(c.opsStage)return c.opsStage;
 const t=c.section+' '+c.title+' '+c.id;
 if(/Kubernetes|kubectl|Pod|Deployment|K8s|k8s/.test(t))return 'cluster';
 if(/Docker|docker|Compose|容器/.test(t))return 'container';
 if(/DM8|MySQL|SQL|mysql|数据库|业务数据|事务|备份恢复/.test(t))return 'database';
 if(/Ansible|Shell|shell|自动化|脚本|crontab|定时|环境变量/.test(t))return 'automation';
 if(/监控|告警|堡垒|JumpServer/.test(t))return 'monitor';
 if(/网络|防火墙|追踪|DNS|TLS|curl|dig|tcpdump|ss：|ip：|mtr|nc：|ping/.test(t))return 'network';
 if(/页面到服务|Nginx|nginx|服务|journal|systemctl|dmesg|日志|NFS/.test(t))return 'service';
 if(/磁盘|权限|性能|内存|进程|CPU|管理动作|包与环境|系统与帮助/.test(t))return 'system';
 if(/高效命令|单命令|命令|管道/.test(t))return 'commands';
 return 'incident';
}
const opsPreferred={
 environment:['lab','versions'],
 database:['mysql-objects','mysql-types','mysql-change','mysql-performance','mysql-recovery'],
 container:['docker-model','docker-observe','docker-storage','docker-network','docker-compose'],
 cluster:['k8s-model','k8s-versions','k8s-scope','k8s-deployment','k8s-service'],
 automation:['shell-status','shell-loop','ansible-scope','ansible-state'],
 service:['nfs'],monitor:['zabbix','jumpserver'],incident:['release']
};
function opsStageCourses(stage){const rows=hubCurriculum.opswork.filter(c=>opsStageOf(c)===stage),preferred=(opsPreferred[stage]||[]).map(id=>'ops-path-'+id);return rows.sort((a,b)=>{const rank=c=>{const n=preferred.indexOf(c.id);return n<0?999:n};return rank(a)-rank(b);});}
function opsOrderedCourses(){return opsStages.flatMap(s=>opsStageCourses(s.id));}
function opsNextCourse(){return opsOrderedCourses().find(c=>!hubState.completed.opswork.includes(c.id))||opsOrderedCourses().at(-1);}
let opsRouteStage='environment',opsRouteQuery='';
try{const s=JSON.parse(localStorage.getItem('learning-ops-route-v1'));if(opsStages.some(x=>x.id===s?.stage)||s?.stage==='all')opsRouteStage=s.stage;}catch{}
function opsSaveRoute(){try{localStorage.setItem('learning-ops-route-v1',JSON.stringify({stage:opsRouteStage}));}catch{}}
const opsPriorUnlocked=hubUnlocked;
hubUnlocked=function(track,i){return track==='opswork'?Number.isInteger(i)&&i>=0&&i<hubCurriculum.opswork.length:opsPriorUnlocked(track,i);};
const opsPriorNextIndex=hubNextIndex;
hubNextIndex=function(track){return track==='opswork'?hubCurriculum.opswork.indexOf(opsNextCourse()):opsPriorNextIndex(track);};
const opsPriorSubjectHTML=subjectHTML;
subjectHTML=function(){
 if(hubSubject!=='ops')return opsPriorSubjectHTML();
 const stage=opsStages.find(x=>x.id===opsRouteStage),done=hubState.completed.opswork;
 const query=opsRouteQuery.trim().toLowerCase(),rows=(stage?opsStageCourses(stage.id):opsOrderedCourses()).filter(c=>(c.title+' '+c.summary+' '+JSON.stringify(c.examples)).toLowerCase().includes(query));
 const next=opsNextCourse(),index=hubCurriculum.opswork.indexOf(next);
 return `<main class="hub-main ops-path-main"><div class="page-head"><div><p class="ef-eyebrow ef-page-label">// OPERATIONS PATH</p><h1>从一条命令，到整条业务链。</h1><p>先准备练习环境，再学常用命令。按阶段学习，也可按工作问题查课。</p></div><span class="chip">${done.length} / ${hubCurriculum.opswork.length} 课已通过</span></div>
 <details class="ops-path-intro" ${opsRouteStage==='environment'?'open':''}><summary>继续学习与新手指引</summary><section class="ops-path-start"><div><span class="ef-eyebrow">// NEXT LESSON</span><h2>${esc(next.title)}</h2><p>${esc(next.summary)}</p><button class="primary" data-hub="lesson" data-track="opswork" data-index="${index}">继续建议课程</button></div><div><h2>第一次接触运维？</h2><p>还不认识终端、root、目录和参数，先完成零基础准备。这里的命令操作使用教学数据，场景课使用证据判断；都不会连接公司服务器。</p><button class="secondary" data-hub="lesson" data-track="beginner" data-index="${hubNextIndex('beginner')}">先学零基础准备</button><button class="text-button" data-action="view" data-view="roadmap">常用命令基础课</button></div></section></details>
 <details class="ops-path-map"><summary>查看由浅入深的 11 个阶段</summary><ol>${opsStages.map((s,i)=>{const cs=opsStageCourses(s.id),n=cs.filter(c=>done.includes(c.id)).length;return `<li><button data-ops-stage="${s.id}" ${opsRouteStage===s.id?'aria-current="step"':''}><span>${String(i+1).padStart(2,'0')}</span><b>${s.name}</b><small>${n} / ${cs.length}</small></button><p>${s.goal}</p></li>`;}).join('')}</ol></details>
 <section class="ops-path-courses" aria-label="运维课程"><div class="ops-path-controls"><label>当前阶段<select id="ops-stage">${opsStages.map((s,i)=>`<option value="${s.id}" ${opsRouteStage===s.id?'selected':''}>${i+1}. ${s.name}</option>`).join('')}<option value="all" ${opsRouteStage==='all'?'selected':''}>全部课程</option></select></label><form id="ops-search-form"><label for="ops-search">找命令或问题</label><div><input id="ops-search" maxlength="100" type="search" placeholder="例如：防火墙、MySQL、docker" value="${esc(opsRouteQuery)}"><button class="secondary" type="submit">查找</button></div></form></div>
 <div class="ops-stage-heading"><span class="ef-eyebrow">// ${stage?String(opsStages.indexOf(stage)+1).padStart(2,'0'):'ALL'}</span><h2>${stage?stage.name:'全部运维课程'}</h2><p>${stage?stage.goal:'按推荐阶段排序，搜索覆盖课程标题、说明和命令示例。'}</p>${stage?`<p class="small-note">本阶段学会：${stage.check}</p>`:''}<p class="small-note">共 ${rows.length} 课。可以选课；每课仍需读讲解、完成练习并通过小测。${opsRouteQuery?'<button class="text-button" data-ops-clear>清除搜索</button>':''}</p></div>
 <div class="path-list">${rows.map((c,i)=>`<article class="path-card"><span class="path-number">${String(i+1).padStart(2,'0')}</span><div><small>${opsStages.find(s=>s.id===opsStageOf(c)).name} · ${c.tasks.every(t=>t.type==='choice')?'场景判断':'教学模拟'}</small><h2>${esc(c.title)}</h2><p>${esc(c.summary)}</p><details><summary>学前看目标</summary><p>${esc(c.related)}</p></details></div><button class="${done.includes(c.id)?'secondary':'primary'}" data-hub="lesson" data-track="opswork" data-index="${hubCurriculum.opswork.indexOf(c)}">${done.includes(c.id)?'复习这课':'学习这课'}</button></article>`).join('')||'<p role="status">当前阶段没有匹配课程。可以清除搜索，或切到“全部课程”再找。</p>'}</div></section>
 <details class="course-endnotes ops-path-references"><summary>参考视频、资料与版本说明</summary><p>参考你提供的四个 B 站合集的公开分集目录，已核对 197 个分集。没有逐段观看，也未复制讲义、字幕或视频文件。相关课程末尾提供对应分集入口。</p>${opsVideoReferences.map(r=>`<p><a href="https://www.bilibili.com/video/${r.bv}/" target="_blank" rel="noopener noreferrer">${r.name} · ${r.parts} 分集</a> / Linux运维工程师-小程</p>`).join('')}<p>旧教程中的 CentOS 7.9、MySQL 5.7、Kubernetes 1.23/1.28 用于认识历史环境。新练习先确认官方支持、软件版本和网络条件；安装片段不能直接照搬到生产。</p><p>索引、恢复、Compose 与综合验收是本站扩展的原创教学，不代表这些合集已逐项提供完整内容。</p></details></main>`;
};
const opsPriorRouteKey=routeKey;
routeKey=function(){return view==='subject'&&hubSubject==='ops'?'ops-path:'+opsRouteStage+':'+opsRouteQuery:opsPriorRouteKey();};
const opsPriorSourceNotes=sourceNotes;
sourceNotes=function(c){let html=opsPriorSourceNotes(c);if(c.videoReference){const r=opsVideoReferences.find(x=>x.id===c.videoReference.video);if(r)html=html.replace('</details>',`<p>目录参考：Linux运维工程师-小程 / ${r.name}。本站讲解、示例与练习为原创；这里只核对了公开分集目录，未复制配套课件。以下分集是关联基础；本站的进阶补充不代表视频已完整讲述。</p>${c.videoReference.parts.map(p=>`<p><a href="https://www.bilibili.com/video/${r.bv}/?p=${p}" target="_blank" rel="noopener noreferrer">P${p} · ${esc(opsVideoPartTitles[r.bv]?.[p]||'查看关联基础视频')}</a></p>`).join('')}</details>`);}return html;};
const opsPriorCourseHTML=hubCourseHTML;
hubCourseHTML=function(){let html=opsPriorCourseHTML();if(hubTrack!=='opswork')return html;const c=activeHubLesson(),stage=opsStages.find(s=>s.id===opsStageOf(c));html=html.replace(`关卡 ${hubLesson+1}/${hubCurriculum.opswork.length} · ${c.section}`,`${esc(stage.name)} · ${c.tasks.every(t=>t.type==='choice')?'场景判断':'教学模拟'}`);if(c.opsStage&&hubPhase==='practice'){const t=c.tasks[hubAttempt.step];if(t)html=html.replace(`<p>${esc(t.explanation)}</p>`,`<p>先回想本课示例的对象与输出，选择后验证。验证通过仍需手动确认。</p>`);html=html.replace('执行 / 验证本步','检查本步判断');}return html;};
const opsPriorOpenLesson=openHubLesson;
openHubLesson=function(track,i){if(track==='opswork'&&hubCurriculum.opswork[i]){opsRouteStage=opsStageOf(hubCurriculum.opswork[i]);opsRouteQuery='';opsSaveRoute();}return opsPriorOpenLesson(track,i);};
// Capture only the final Next action so the physical array can retain old IDs/order.
document.addEventListener('click',e=>{const next=e.target.closest('[data-hub="next"]');if(next&&!next.disabled&&hubTrack==='opswork'){e.preventDefault();e.stopImmediatePropagation();if(!hubPassed())return;const ordered=opsOrderedCourses(),i=ordered.indexOf(activeHubLesson());if(i+1<ordered.length)openHubLesson('opswork',hubCurriculum.opswork.indexOf(ordered[i+1]));else{view='subject';render();}return;}const b=e.target.closest('[data-ops-stage]');if(b){opsRouteStage=b.dataset.opsStage;opsRouteQuery='';opsSaveRoute();render();document.querySelector('.ops-path-courses')?.scrollIntoView({block:'start'});}if(e.target.closest('[data-ops-clear]')){opsRouteQuery='';render();}},true);
document.addEventListener('change',e=>{if(e.target.id==='ops-stage'){opsRouteStage=e.target.value;opsRouteQuery='';opsSaveRoute();render();}});
document.addEventListener('submit',e=>{if(e.target.id==='ops-search-form'){e.preventDefault();opsRouteQuery=document.getElementById('ops-search').value.slice(0,100);render();}});
hubSubjects.ops.description='练习环境 → 常用命令 → 系统与网络 → 数据库 → Docker → Kubernetes → 自动化、监控与发布验收。';
render();

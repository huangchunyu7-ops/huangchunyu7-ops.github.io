/* Independent incident drills. Only listed read-only fixture commands execute. */
const incidentCases = [
 {
  id:'schema-500',title:'页面 500：沿请求追到 DM8',summary:'用 request_id 找服务、找 SQL，再验证 schema 和对象。',
  scene:'测试环境订单列表报错。2026-10-08 14:02（UTC+8），GET /api/orders 返回 500，响应头 X-Request-ID: r-101。只读调查，不修改数据。',
  steps:[
   ['入口日志', 'grep -F r-101 /var/log/nginx/access.log','500','确认编号、路径与上游，避免把另一条 502 请求混进来。'],
   ['应用异常','grep -F -C 1 r-101 /opt/order/logs/app.log','schema=REPORT','看同一请求的 SQL 和数据源，而不是只看 ERROR。'],
   ['实际 SQL','cat /opt/order/mapper/OrderMapper.xml','FROM ORDERS','这里没有显式写 APP.ORDERS，默认 schema 会参与对象解析。'],
   ['业务会话','SELECT SF_GET_SCHEMA_NAME_BY_ID(CURRENT_SCHID());','REPORT','本演练使用故障应用的同一个教学账号与 schema。'],
   ['可访问对象',"SELECT OWNER, TABLE_NAME FROM ALL_TABLES WHERE OWNER = 'APP';",'APP ORDERS','证明当前账号可见 APP.ORDERS；不要把查不到某个默认对象等同于数据丢失。'],
   ['精确查证',"SELECT ID, ORDER_NO, STATUS FROM APP.ORDERS WHERE ORDER_NO = 'OD20261008001';",'PAID','限定 schema、列与业务编号，验证目标数据可以读取。']
  ],
  sql:{'SELECT SF_GET_SCHEMA_NAME_BY_ID(CURRENT_SCHID())':'CURRENT_SCHEMA\nREPORT'},
  diagnosis:['未限定表名的 SQL 在 REPORT 下解析，但目标对象是可访问的 APP.ORDERS','数据库已经丢失所有订单','Nginx 转发端口配置错误'],answer:0,
  recovery:['删除订单表后重建','核对预期 schema，修正 SQL 或数据源配置，在测试环境验证后按变更流程发布','给所有账号授予 DBA'],recoveryAnswer:1,
  conclusion:'请求 r-101 的 500 来自数据访问层；SQL 使用 ORDERS，应用默认 schema 为 REPORT，而 APP.ORDERS 可见且目标记录可读。',
  acceptance:'用原接口重放该业务查询，核对返回的订单编号与状态，并观察同一请求的应用日志和错误率。保留旧配置与回退步骤。'
 },
 {
  id:'upstream-502',title:'页面 502：端口通了为什么还失败？',summary:'对照 Nginx upstream、监听端口与直接请求，判断转发对象。',
  scene:'测试主机 2026-10-08 14:02（UTC+8），GET /api/orders 返回 502，X-Request-ID: r-202。本例 Nginx 与应用在同一主机网络命名空间，应用应监听 8080。',
  files:{
   '/var/log/nginx/access.log':'2026-10-08T14:02:01+08:00 GET /api/orders 502 rid=r-202 upstream=127.0.0.1:8081\n',
   '/var/log/nginx/error.log':'2026/10/08 14:02:01 connect() failed (111: Connection refused) while connecting to upstream: http://127.0.0.1:8081/api/orders\n',
   '/etc/nginx/conf.d/order.conf':'server {\n  listen 80;\n  location /api/ { proxy_pass http://127.0.0.1:8081; }\n}\n'
  },
  probes:{
   'ss -lntp':'LISTEN 0 128 127.0.0.1:8080 users:(("java",pid=2048,fd=22))',
   'curl -i http://127.0.0.1:8080/api/orders':'HTTP/1.1 200 OK\nContent-Type: application/json\n\n{"orders":[{"orderNo":"OD20261008001","status":"PAID"}]}',
   'nginx -t':'nginx: configuration file /etc/nginx/nginx.conf syntax is ok\nnginx: configuration file /etc/nginx/nginx.conf test is successful'
  },
  steps:[
   ['失败请求','grep -F r-202 /var/log/nginx/access.log','8081','从当前请求确认代理使用的地址，不凭默认端口猜测。'],
   ['失败类型','cat /var/log/nginx/error.log','Connection refused','连接被拒绝与等待超时不同，不能一律增大 timeout。'],
   ['转发配置','cat /etc/nginx/conf.d/order.conf','8081','检查 proxy_pass 的实际目标。'],
   ['实际监听','ss -lntp | grep -F 8080','java','8080 有应用监听；对照转发到的 8081。'],
   ['上游业务','curl -i http://127.0.0.1:8080/api/orders','200 OK','直接请求预期应用端口，确认业务接口有响应。'],
   ['语法检查','nginx -t','successful','错误端口也能通过语法检查；此命令不能替代业务验收。']
  ],
  diagnosis:['数据库 schema 配置错了','Nginx 指向 8081，应用实际在 8080 提供服务','只要 nginx -t 成功，页面就一定正常'],answer:1,
  recovery:['把超时延长到十分钟','重启数据库并删除日志','核对环境台账，将 upstream 修正为预期端口，校验后平滑重载并复测入口'],recoveryAnswer:2,
  conclusion:'r-202 的代理目标为 8081，连接被拒绝；同一网络命名空间的应用监听 8080，直接业务请求返回 200。转发端口与预期不一致。',
  acceptance:'变更后从原页面入口复测 /api/orders，核对状态与业务响应，再查看 access/error 日志；直接访问 8080 成功不能代替入口验收。'
 },
 {
  id:'page-to-table',title:'页面“订单编号”：到底在哪张表？',summary:'从接口字段与 Mapper 追到表、列、注释和一条真实样本。',
  scene:'测试页面展示“订单编号 OD20261008001”。Network 中对应 GET /api/orders/1，返回字段 orderNo。请确认数据来源，不把中文标签直接当作数据库列名。',
  files:{'/opt/order/mapper/OrderMapper.xml':'<select id="getOrder">\n  SELECT ID, ORDER_NO AS orderNo, STATUS\n  FROM APP.ORDERS WHERE ID = #{id}\n</select>\n'},
  steps:[
   ['接口映射','cat /opt/order/mapper/OrderMapper.xml','ORDER_NO AS orderNo','教学路由已确认使用 getOrder；别名连接接口字段与物理列。'],
   ['当前 schema','SELECT SF_GET_SCHEMA_NAME_BY_ID(CURRENT_SCHID());','APP','本例为 APP 教学只读会话，与故障 500 案例不同。'],
   ['表注释',"SELECT TABLE_NAME, COMMENTS FROM USER_TAB_COMMENTS WHERE COMMENTS LIKE '%订单%';",'订单主表','注释给候选，不能独自证明接口使用哪个表。'],
   ['列元数据',"SELECT TABLE_NAME, COLUMN_NAME, DATA_TYPE FROM USER_TAB_COLUMNS WHERE COLUMN_NAME = 'ORDER_NO';",'VARCHAR','确认物理列与类型；USER 视图范围是当前用户的对象。'],
   ['记录核对',"SELECT ID, ORDER_NO, STATUS FROM APP.ORDERS WHERE ORDER_NO = 'OD20261008001';",'PAID','按精确业务编号读回，核对 ID、编号、状态。']
  ],
  diagnosis:['中文标签就是物理列名“订单编号”','所有包含订单注释的表都是页面来源','Mapper、列元数据与记录共同支持来源为 APP.ORDERS.ORDER_NO'],answer:2,
  recovery:['保留接口字段、Mapper、schema、表列与记录证据；若页面不同步，再查筛选、缓存和数据源','先 UPDATE 一个同名字段看看页面变化','把所有表全量导出后搜索'],recoveryAnswer:0,
  conclusion:'接口 orderNo 来自 Mapper 中 ORDER_NO AS orderNo；数据来源为 APP.ORDERS，目标行 ID=1、编号 OD20261008001、状态 PAID。',
  acceptance:'核对接口响应与数据库读回结果。如不一致，继续查实际连接的实例、查询条件、缓存及字段转换，不直接修改数据。'
 }
];
function incidentCommandKey(raw){return /^SELECT\b/i.test(raw.trim())?normalizeDMSQL(raw):splitPipeline(raw).map(normalizeJobCommand).join(' | ');}
class IncidentEngine extends JobEngine {
 constructor(c){super();this.case=c;Object.assign(this.fs,c.files||{});}
 execute(raw){try{const key=incidentCommandKey(raw);if(!this.case.steps.some(s=>incidentCommandKey(s[1])===key))return {ok:false,out:'本案例只模拟下方证据卡中的只读命令。请先选取一个调查目标，再输入对应命令。'};const sql=Object.entries(this.case.sql||{}).find(([k])=>normalizeDMSQL(k)===key);return sql?{ok:true,out:sql[1]}:super.execute(raw);}catch(e){return {ok:false,out:e.message};}}
 jobRun(raw,input){const key=normalizeJobCommand(raw);if(Object.hasOwn(this.case.probes||{},key))return this.case.probes[key];return super.jobRun(raw,input);}
}
let incidentId=incidentCases[0].id,incidentDraft='',incidentOutput='',incidentFeedback='',incidentState={};
try{const saved=JSON.parse(localStorage.getItem('ops-incidents-v1'));if(saved&&typeof saved==='object'&&!Array.isArray(saved))incidentState=saved;}catch(e){}
function incidentCurrent(){return incidentCases.find(c=>c.id===incidentId);}
function incidentAttempt(){const c=incidentCurrent();let a=incidentState[c.id];if(!a||typeof a!=='object'||Array.isArray(a))a=incidentState[c.id]={};if(!a.commands||typeof a.commands!=='object'||Array.isArray(a.commands))a.commands={};return a;}
function incidentEvidence(c,a){const engine=new IncidentEngine(c);return c.steps.map((s,i)=>{const raw=a.commands[i];if(typeof raw!=='string'||raw.length>2000)return null;try{if(incidentCommandKey(raw)!==incidentCommandKey(s[1]))return null;const r=engine.execute(raw);return r.ok&&r.out.includes(s[2])?{command:raw,out:r.out}:null;}catch(e){return null;}});}
function incidentComplete(c,a){return incidentEvidence(c,a).every(Boolean)&&a.diagnosis===c.answer&&a.recovery===c.recoveryAnswer&&a.checked===true;}
function incidentSave(){try{localStorage.setItem('ops-incidents-v1',JSON.stringify(incidentState));}catch(e){toast('本设备无法保存演练进度，请保留证据记录。');}}
function incidentOpen(id){if(!incidentCases.some(c=>c.id===id))return;incidentId=id;incidentDraft='';incidentOutput='';incidentFeedback='';view='incident';hubSubject='ops';render();window.scrollTo({top:0,behavior:'instant'});}
function incidentRun(){const c=incidentCurrent(),a=incidentAttempt(),r=new IncidentEngine(c).execute(incidentDraft);incidentOutput='$ '+incidentDraft+'\n'+r.out;incidentFeedback=r.ok?'命令已执行，请阅读输出中的线索。':'未获得新证据。';if(r.ok){const key=incidentCommandKey(incidentDraft);c.steps.forEach((s,i)=>{if(incidentCommandKey(s[1])===key&&r.out.includes(s[2]))a.commands[i]=incidentDraft;});incidentSave();}render();}
function incidentGrade(){const c=incidentCurrent(),a=incidentAttempt();a.checked=false;if(!incidentEvidence(c,a).every(Boolean))incidentFeedback='证据还不完整，请先完成下方未查证的调查目标。';else if(a.diagnosis!==c.answer)incidentFeedback='原因判断与证据不一致。重新对照请求、配置与查询结果。';else if(a.recovery!==c.recoveryAnswer)incidentFeedback='原因判断正确，但下一步处理仍需要调整。根据证据选择有验证与回退安排的动作。';else{a.checked=true;incidentFeedback='演练通过。请继续阅读验收与交接记录。';}incidentSave();render();}
function incidentReport(c,a){const evidence=incidentEvidence(c,a);return `排障交接记录（虚构测试环境）\n场景：${c.scene}\n\n证据：\n${evidence.map((r,i)=>`${i+1}. ${c.steps[i][0]}\n${r?'$ '+r.command+'\n'+r.out:'待查证'}`).join('\n\n')}\n\n结论：${incidentComplete(c,a)?c.conclusion:'待完成证据与判断，尚未确认结论。'}\n下一步：${incidentComplete(c,a)?c.recovery[c.recoveryAnswer]:'待确认'}\n验收：${incidentComplete(c,a)?c.acceptance:'待确认'}\n负责人、实际环境、变更时间与回退记录：由工作工单补充。`;}
function incidentCards(){return `<section class="incident-entry"><div><div class="eyebrow">从工作中的问题开始</div><h2>选一个现象，练完整排障链路</h2><p>不需要先通完课程。每个案例独立保存证据与进度。</p></div><div class="incident-choices">${incidentCases.map(c=>`<button class="secondary" data-incident="open" data-id="${c.id}">${esc(c.title)}</button>`).join('')}</div></section>`;}
function incidentHTML(){const c=incidentCurrent(),a=incidentAttempt(),evidence=incidentEvidence(c,a),done=incidentComplete(c,a);return `<main class="hub-main incident-main"><div class="page-head"><div><div class="eyebrow">独立排障演练 / 测试环境</div><h1>从现象到有证据的结论</h1><p>命令在网页内模拟，不连接工作服务器。可按自己的调查顺序查证。</p></div><button class="secondary" data-incident="reset">重练当前案例</button></div><div class="filter-tabs" aria-label="选择案例">${incidentCases.map(x=>`<button data-incident="open" data-id="${x.id}" class="${x.id===c.id?'active':''}" aria-pressed="${x.id===c.id}">${esc(x.title)}</button>`).join('')}</div><section class="section"><h2>${esc(c.title)}</h2><p>${esc(c.scene)}</p>${simpleDiagram(c.id==='page-to-table'?'database':'trace')}<p><b>${evidence.filter(Boolean).length}/${c.steps.length} 项已查证${done?' · 演练已通过':''}</b></p></section><div class="incident-grid"><section class="section"><h2>调查目标与证据</h2><p class="small-note">可先自己尝试；展开提示查看本案例支持的命令。</p>${c.steps.map((s,i)=>`<article class="incident-evidence"><h3>${i+1} · ${esc(s[0])}<span class="chip">${evidence[i]?'已查证':'待查证'}</span></h3><details><summary>查看调查提示</summary><p>${esc(s[3])}</p><pre>${esc(s[1])}</pre><button class="text-button" data-incident="fill" data-index="${i}">填入终端</button></details>${evidence[i]?`<pre>${esc(evidence[i].out)}</pre>`:''}</article>`).join('')}</section><section class="section incident-console"><h2>只读调查终端</h2><form id="incident-form"><label for="incident-command">输入命令或 SQL</label><textarea id="incident-command" rows="4" spellcheck="false" autocomplete="off" maxlength="2000">${esc(incidentDraft)}</textarea><button class="primary" type="submit">执行并记录证据</button></form><pre class="hub-terminal" aria-live="polite">${esc(incidentOutput||'尚未执行。先选择一个调查目标。')}</pre><p class="incident-feedback" role="status">${esc(incidentFeedback)}</p><h2>判断与下一步</h2><fieldset><legend>哪些结论得到证据支持？</legend>${c.diagnosis.map((t,i)=>`<label><input type="radio" name="incident-diagnosis" value="${i}" ${a.diagnosis===i?'checked':''}> ${esc(t)}</label>`).join('')}</fieldset><fieldset><legend>下一步如何处理？</legend>${c.recovery.map((t,i)=>`<label><input type="radio" name="incident-recovery" value="${i}" ${a.recovery===i?'checked':''}> ${esc(t)}</label>`).join('')}</fieldset><button class="primary" data-incident="grade">核对证据与判断</button>${done?`<div class="incident-success"><h3>证据支持的结论</h3><p>${esc(c.conclusion)}</p><h3>恢复后怎样验收</h3><p>${esc(c.acceptance)}</p></div>`:''}</section></div><section class="section"><h2>交接记录</h2><p>可复制到自己的学习笔记。未通过前保持“待确认”，避免把猜测写成根因。</p><label for="incident-report">本案例证据与结论</label><textarea id="incident-report" rows="10" readonly>${esc(incidentReport(c,a))}</textarea><button class="secondary" data-incident="select-report">选中交接记录</button></section></main>`;}
const incidentBaseRender=render,incidentBaseNav=hubNav,incidentBaseHome=hubHome,incidentBaseSubject=subjectHTML;
hubNav=function(){return incidentBaseNav().replace('</nav>','<button data-incident="open" data-id="'+incidentId+'" '+(view==='incident'?'aria-current="page"':'')+'>排障演练</button></nav>');};
hubHome=function(){return incidentBaseHome().replace('<main class="hub-main">','<main class="hub-main">'+incidentCards());};
subjectHTML=function(){const html=incidentBaseSubject();return hubSubject==='ops'?html.replace('<div class="filter-tabs">',incidentCards()+'<div class="filter-tabs">'):html;};
render=function(){if(view!=='incident')return incidentBaseRender();$('app').innerHTML=hubNav()+incidentHTML();$('incident-form').addEventListener('submit',e=>{e.preventDefault();incidentDraft=$('incident-command').value;incidentRun();});};
document.addEventListener('click',e=>{const b=e.target.closest('[data-incident]');if(!b||b.disabled)return;const d=b.dataset;try{if(d.incident==='open')incidentOpen(d.id);if(d.incident==='fill'){incidentDraft=incidentCurrent().steps[Number(d.index)][1];$('incident-command').value=incidentDraft;$('incident-command').focus();}if(d.incident==='grade')incidentGrade();if(d.incident==='reset'){incidentState[incidentId]={commands:{}};incidentDraft='';incidentOutput='';incidentFeedback='';incidentSave();render();}if(d.incident==='select-report'){$('incident-report').focus();$('incident-report').select();}}catch(err){toast(err.message||'请重新打开当前案例。');}});
document.addEventListener('input',e=>{if(e.target.id==='incident-command')incidentDraft=e.target.value;});
document.addEventListener('change',e=>{if(!['incident-diagnosis','incident-recovery'].includes(e.target.name))return;const a=incidentAttempt();a[e.target.name==='incident-diagnosis'?'diagnosis':'recovery']=Number(e.target.value);a.checked=false;incidentFeedback='判断已更新，请重新核对。';incidentSave();render();});
render();

/* Original novice lessons. Load before hub.js so saved quiz evidence is checked
 * against the current assessment revision. Stable course IDs are unchanged. */
const noviceQuizRevision='command-foundations-20261104';
const noviceCommandLessons=[
 {id:'identity',goal:'能用 whoami 读出当前有效用户名，并区分用户名与主机名。',before:'只需知道：账号表示你以谁的身份操作。',syntax:[['whoami','命令名：查看当前有效用户名。']],question:'whoami 返回 analyst。这能说明什么？',right:'当前有效用户名是 analyst',wrong:['服务器的主机名一定是 analyst','当前账号一定有 root 权限'],why:'whoami 回答“我以谁的身份操作”。用户名不等于主机名，也不能单靠这个结果推断管理员权限。',pitfall:'用户名不是主机名；查看身份也不会切换身份。',predict:'如果输出换成 operator，变化的是当前有效用户名。',review:3},
 {id:'location',goal:'能读懂 pwd 的结果，知道自己当前位于哪个目录。',before:'先认识目录像文件夹；路径描述它的位置。',syntax:[['pwd','命令名：输出当前工作目录，不改变位置。']],question:'pwd 输出 /etc。下一步该怎样理解？',right:'当前工作目录是 /etc',wrong:['要把 /etc 当成命令再执行一次','当前用户的家目录一定变成 /etc'],why:'pwd 的输出是当前位置。进入 /etc 不会改变账号预先配置的家目录；输出路径也不是一条新命令。',pitfall:'当前位置可以变化，家目录通常不会随每次 cd 改变。',predict:'pwd 不会替你进入目录；改变位置使用 cd。',review:2},
 {id:'list',goal:'能用 ls 查看当前目录里的名字，知道列表不等于文件内容。',before:'先用 pwd 确认“这里”是哪个目录。',syntax:[['ls','命令名：列出目录内容；默认通常不列出点号开头的隐藏名字。']],question:'ls 的结果中出现 notes.txt。可以得出什么结论？',right:'当前目录的列表中有 notes.txt 这个名字',wrong:['已经读到了 notes.txt 的全文','已经把 notes.txt 删除了'],why:'ls 用来列名字。读取小文本可以用 cat；仅凭列表还不能判断文件全文。ls 本身不会删除文件。',pitfall:'看见文件名，不等于已经看过内容；本样例不含隐藏文件。',predict:'想看小文本内容，要把读取动作和文件路径写在一起。',review:3},
 {id:'options',goal:'能拆出命令名、选项，认出 -l 是小写字母 L。',before:'已经知道 ls 可以列出名字。',syntax:[['ls','命令名：列出目录内容。'],['空格','分隔命令名与后续参数。'],['-l','选项：使用详细列表格式；小写字母 L。']],question:'你需要查看列表中的权限和属主，应该用哪个命令？',right:'ls -l',wrong:['ls -1','pwd'],why:'ls -l 的 -l 是小写 L，表示详细格式。ls -1 的 -1 是数字一，表示每行一个条目；它不是详细格式。pwd 只显示当前位置。',pitfall:'-l 与 -1 都可能是合法选项，但含义不同。不能只看“命令是否执行成功”。',predict:'列表中可能看到权限、属主、大小与时间；这些是结果字段，不是需要输入的参数。',review:3},
 {id:'read',goal:'能写出 cat 加文件路径，读取一个很短的文本。',before:'在本课初始目录 /home/student 中有 notes.txt。',syntax:[['cat','命令名：把文件内容写到输出。'],['notes.txt','对象：相对于当前目录的文件路径。']],question:'你想读取当前目录中的 memo.txt。应该怎样写？',right:'cat memo.txt',wrong:['cat -memo.txt','pwd memo.txt'],why:'cat 后接要读的文件路径。普通文件名 memo.txt 不需要加短横线；加上 - 会被当作选项。pwd 不负责读取文件。',pitfall:'cat 适合这个短样例；大日志先限制范围，再用 head、tail 或分页工具。',predict:'命令中的文件名要换成实际存在的路径，不是所有示例文件都能在公司服务器找到。',review:1},
 {id:'absolute',goal:'能解释绝对路径与相对路径何时指向同一个文件。',before:'知道 / 是根目录；pwd 显示当前位置。',syntax:[['cat','命令名：读取文本。'],['/home/student/notes.txt','绝对路径：从根目录 / 开始定位文件。']],question:'从 /home/student 换到 /etc 后，哪条命令仍指向原来的笔记？',right:'cat /home/student/notes.txt',wrong:['cat notes.txt','cat /etc/notes.txt'],why:'绝对路径从 / 开始，不依赖当前位置。相对路径 notes.txt 会随当前位置变化；/etc/notes.txt 指向另一个位置，不能假设文件存在。',pitfall:'/home/student/notes.txt 和 notes.txt 只有在合适的当前目录下才指向同一文件。',predict:'从 /etc 出发，notes.txt 表示 /etc/notes.txt，而不是原来的笔记。',review:3},
 {id:'directory',goal:'能用 cd 改变目录，再用 pwd 验证；不把空输出当成失败。',before:'已经知道 pwd 负责观察位置。',syntax:[['cd','Shell 内建命令：改变当前工作目录。'],['/etc','对象：要进入的目录的绝对路径。']],question:'cd /etc 成功后没有文字输出，怎样验证当前位置？',right:'再执行 pwd，检查是否返回 /etc',wrong:['没有输出就立即断定 cd 失败','再执行 cat /etc 来查看当前位置'],why:'cd 成功时通常不打印结果。用 pwd 读回当前位置；cat 用来读取文件，不能代替位置检查。',pitfall:'不输出文字与执行失败是两件事。真实环境还要结合退出状态和错误信息。',predict:'每一课的练习环境独立初始化；上一课 cd 的位置不会自动带入下一课。',review:2},
 {id:'head',goal:'能用 -n 限制开头行数，区分选项与选项的数值。',before:'知道日志是按行记录事件的文本；示例文件有 4 行。',syntax:[['head','命令名：读取文件开头。'],['-n','选项：接下来指定需要的行数。'],['2','-n 的数值：两行。'],['/opt/order/logs/app.log','对象：本课的固定教学日志。']],question:'想读取 service.log 开头的 5 行，应该怎样写？',right:'head -n 5 service.log',wrong:['tail -n 5 service.log','head -n service.log 5'],why:'head 取开头，tail 取末尾。-n 后面紧跟行数，文件路径放在后面；把文件名放在 -n 后会被误当成行数。',pitfall:'“2”是 -n 的数值，不是文件名，也不是所有命令都通用的参数。',predict:'把 -n 2 改成 -n 1，会取开头一行；不代表发现了根因。',review:1},
 {id:'tail',goal:'能取文件末尾的有限行数，区分快照与持续跟踪。',before:'已经学过 head 取开头；本课练习用固定日志快照。',syntax:[['tail','命令名：读取文件末尾。'],['-n 2','选项和值：最后两行。'],['/opt/order/logs/app.log','对象：日志文件路径。']],question:'tail -n 2 service.log 表示什么？',right:'读取文件末尾两行，然后结束',wrong:['一直等待新日志出现','读取文件开头两行'],why:'-n 2 限定末尾两行。真实 tail -f 才涉及持续跟踪；本网站这节课读取固定快照。开头两行使用 head。',pitfall:'最近出现的 ERROR 是线索，不一定是根因；还要结合时间、请求标识和上下文。',predict:'真实环境持续跟踪时通常用 Ctrl+C 结束；手机网页的本课无需等待新行。',review:3},
 {id:'filter',goal:'能从文件筛出包含 ERROR 的整行，理解默认区分大小写。',before:'先能独立读取日志；ERROR 是本课要查找的文字。',syntax:[['grep','命令名：输出匹配模式的行。'],['ERROR','搜索模式：本例不含正则特殊字符。'],['/opt/order/logs/app.log','搜索对象：日志文件。']],question:'一行只有小写 error，另一行包含大写 ERROR。grep ERROR 默认匹配哪种？',right:'包含大写 ERROR 的行',wrong:['两种都匹配，因为默认不区分大小写','只匹配小写 error 的行'],why:'grep 默认区分大小写。ERROR 与 error 不同；需要忽略大小写时再了解 -i，不能把默认行为记反。',pitfall:'匹配的是整行，不是只打印 ERROR 这个单词；匹配行数也不等于故障数。',predict:'同一行出现两个 ERROR，grep 仍只输出该行一次。',review:3},
 {id:'literal',goal:'能使用 -F 按字面匹配，区分固定文本与正则模式。',before:'已经知道 grep 的模式与文件路径分别放在哪里。',syntax:[['grep','命令名：筛出匹配的行。'],['-F','选项：把模式当固定字符串，不解释正则。'],['ERROR','要找的原样文字。'],['/opt/order/logs/app.log','要查的文件。']],question:'要按原样查找 req.101，哪种写法避免把点号当作正则特殊字符？',right:'grep -F req.101 service.log',wrong:['grep req.101 service.log','grep -i req.101 service.log'],why:'-F 按固定字符串搜索。默认正则模式中的 . 可匹配任意单个字符；-i 只改变大小写匹配，不会关闭正则解释。',pitfall:'-F 是大写 F；忽略大小写是 -i，两者解决不同问题。',predict:'在真实环境搜索含空格的固定文本时，要正确加引号，例如 grep -F "table not found" service.log。',review:3},
 {id:'count',goal:'能用 wc -l 数换行符，并说清统计的输入范围。',before:'教学日志每一行均有末尾换行，共 4 行。',syntax:[['wc','命令名：统计文本。'],['-l','选项：数换行符，小写字母 L。'],['/opt/order/logs/app.log','输入文件：统计整个文件。']],question:'wc -l service.log 的数值表示什么？',right:'整个输入文件的换行符数，不区分日志级别',wrong:['只统计其中的 ERROR 行','统计其中 ERROR 单词的出现次数'],why:'wc -l 本身不筛选 ERROR。常见有末尾换行的日志中可以用它计行；没有末尾换行的最后一段文本不会额外增加换行符数。',pitfall:'要数 ERROR 匹配行，先筛选；不要把行数说成独立故障次数或错误单词次数。',predict:'同一行重复两个 ERROR，wc -l 也不会把这一行算成两行。',review:3},
 {id:'first-pipe',goal:'能把“筛选”和“计行”组合，并指出右侧究竟在统计什么。',before:'已经分别运行 grep -F 与 wc -l；此处只多学一个连接符 |。',syntax:[['grep -F ERROR /opt/order/logs/app.log','左侧：从文件筛出包含 ERROR 的行。'],['|','把左侧标准输出接到右侧标准输入。'],['wc -l','右侧：统计收到的文本，不再写输入文件名。']],question:'grep -F ERROR app.log | wc -l app.log 有什么问题？',right:'右侧显式读取 app.log，统计的不是管道送来的筛选结果',wrong:['它一定只统计 ERROR 匹配行','管道会自动删除 app.log 中不匹配的行'],why:'wc -l app.log 明确指定了文件，会读取该文件。想数左侧筛选出的行，应使用 | wc -l，不再写文件名。管道传递文本，不会自动修改源文件。',pitfall:'| 默认连接标准输出，不会自动连接标准错误。图中按数据流解释，不表示两个程序必须先后串行启动。',predict:'默认 ERROR 样例得到 2，表示匹配行数；切换查找文字，结果可能变化。行数不能直接当成独立故障数。',review:3}
];
for(const [index,lesson] of noviceCommandLessons.entries()){
 const c=hubCurriculum.opswork.find(c=>c.id==='cmd-start-'+lesson.id);
 if(!c)continue;
 c.novice=lesson;
 c.quiz={...choiceTask(lesson.question,lesson.right,lesson.wrong,lesson.why,index),revision:noviceQuizRevision};
 const engine=new JobEngine(),cmd=c.tasks[0].command,result=engine.execute(cmd);
 const after=lesson.id==='directory'?engine.execute('pwd').out:'';
 c.novicePages=[
  {...P('这一课，学会做什么？',[lesson.goal,lesson.before,c.summary]),kind:'novice-goal'},
  {...P('标准用法：每一部分做什么？',[c.tasks[0].explanation]),kind:'novice-syntax',parts:lesson.syntax,command:cmd},
  {...P('你输入什么，系统返回什么？',['下面从本课教学模拟器读取结果。每课初始位置都是 /home/student，示例路径不代表你公司的实际配置。']),kind:'novice-example',command:cmd,output:result.out,after},
  {...P('先避开一个常见错误',[lesson.pitfall,lesson.predict,'接下来独立完成操作和小测。答错留在本关；验证通过后，仍需手动确认。']),kind:lesson.id==='first-pipe'?'novice-pipe':'novice-pitfall'}
 ];
}
const noviceBeginnerGoals={
 'start-computer':['能分清浏览器、操作系统和提供网站服务的服务器。','不用安装软件；先认识你正在使用的网站。'],
 'start-terminal':['能指出提示符、输入命令、返回结果分别在哪里。','先知道电脑可以用窗口或文字指令操作。'],
 'start-users':['能分清普通用户与 root，知道权限需核对。','先理解“用哪个账号操作”。'],
 'start-groups':['能说清用户组如何帮助共同访问文件。','先认识用户与文件属主。'],
 'start-tree':['能从根目录 / 沿目录树找到一个文件。','目录像文件夹，文件保存内容。'],
 'start-path-types':['能按当前位置解释绝对路径与相对路径。','先认识根目录、家目录与当前目录。'],
 'start-file-types':['能区分目录、普通文件与符号链接。','知道文件名与文件内容不同。'],
 'start-path':['能理解 . 与 ..，指出进入上级后的路径。','先能沿目录树定位。'],
 'start-device':['能区分网络设备与命令行终端两个语境。','手机、电脑都可以是网络里的终端。'],
 'start-mac':['能认出常见 MAC 地址，区分 MAC 与 IP。','先认识设备上的网络接口。'],
 'start-switch':['能解释交换机如何根据 MAC 与物理端口转发。','先认识 MAC，物理端口是插网线的接口。'],
 'start-ip':['能结合 IP 与 /24 前缀判断本课两个地址是否同网段。','先认识本地网络；这个规则不能套用所有前缀。'],
 'start-gateway':['能说清去其他网络时默认网关的作用。','先理解同网段与不同网段。'],
 'start-dns':['能分清查询名字与成功打开网页。','先知道 IP 用于网络寻址。'],
 'start-request':['能沿网页请求分步查证，不把 500 直接当作数据库坏了。','先认识接入、地址、DNS 与服务各自的职责。']
};
const firstComputer=hubCurriculum.beginner.find(c=>c.id==='start-computer');
firstComputer.quiz={...choiceTask('手机用 Chrome 打开订单网页，哪种分工正确？','Chrome 展示页面，操作系统管理设备，网站服务处理请求',['Chrome 就是手机的操作系统','所有订单数据一定保存在手机浏览器里'],'浏览器是运行在操作系统上的应用；网站服务处理请求并返回内容。仅凭打开网页，不能断定订单数据保存在哪里。',1),revision:'novice-computer-20261104'};
firstComputer.novicePages=[
 P('第一次来，先完成一个小目标',['这一课只要求分清三个角色：你面前的浏览器、管理设备的操作系统、给浏览器返回内容的服务。无需安装软件，也不用记命令。','本站运维练习在浏览器内使用教学数据。现在不需要连接公司服务器。']),
 {...P('从正在看的网页认识三个角色',['浏览器：你用来打开这个网站的应用，例如 Chrome。','操作系统：管理设备、文件和应用。手机可能用 Android 或 iOS，电脑可能用 Windows、macOS 或 Linux。','服务器：在网络另一端提供服务的电脑或程序。浏览器发请求，服务处理后返回结果。'],''),kind:'novice-roles'},
 P('换个例子，再自己判断',['手机打开购物网页时，手机不是因为打开网页就变成网站服务器。手机上的浏览器负责展示；远端服务负责处理商品查询。','“服务器”描述提供服务的角色，不靠机箱外形判断。普通电脑也能运行服务，同一设备还可以承担多个角色。']),
 P('现在怎样完成本课？',['最后一页点击“讲解读完了，开始练习”。练习里点一个选项，再点击“检查本步答案”。','答错会留在原处。答对后先读解释，再点“确认结果”。完成两道操作题后进入小测，检查通过，再手动进入下一关。','不认识的术语可以点击带下划线的文字查看解释。讲解可随时回看，已确认步骤会保留。'])
];
/* These are learning objectives, separate from question answers. Other tracks
 * keep their existing complete pages and use the same visible classroom guide. */
for(const c of hubCurriculum.beginner){const goals=noviceBeginnerGoals[c.id];if(goals)c.novice={goal:goals[0],before:goals[1],review:c.id==='start-computer'?1:0};}
hubCurriculum.beginner.find(c=>c.id==='start-terminal').novicePages=[
 P('从点按钮，到输入一行文字',['终端提供一个输入文字、查看结果的窗口；Shell 是读取并解释命令的程序。窗口与解释命令的程序不是同一层。','这一课只学会分清“提示符、命令、返回结果”。账号权限和复杂参数会在后面的课逐个讲。']),
 {...P('看一遍完整对话',['真实终端可能显示 student@lab:~$，它提示你当前可以输入命令。只输入 pwd，再执行；本课在网页内演示返回结果。']),kind:'novice-example',command:'pwd',output:new JobEngine().execute('pwd').out},
 P('命令、提示符、结果，各做什么？',['提示符：student@lab:~$ 由环境显示，样式因配置而异，不用一起输入。','命令：pwd 是你要求查看当前位置。Shell 读取它，再执行相应动作。','结果：/home/student 是当前目录的位置，不是网站地址，也不是下一条命令。命令执行成功也可能没有文字输出，后面的 cd 课会演示。']),
 P('准备进入本课判断题',['先回答谁负责解释命令，再判断 pwd 返回的 /home/student 是什么。它们是在检验角色和结果的区别。','本课不要求安装终端。在后面的常用命令课，你会在网页输入框真正输入、运行与验证。','手机和电脑的网页练习都通过按钮执行；不要把这里的 Enter 换行和真实交互式终端的 Enter 执行混为一谈。'])
];

/* Bridge the user's daily work: each new concept reuses evidence introduced in
 * the preceding lesson. Values below come from the existing teaching fixtures. */
function noviceWorkExample(c){const command=c.tasks[0].command,result=new JobEngine().execute(command);return {...P('标准操作与返回结果',['这是固定教学数据。真实路径需查服务配置，不能把本站路径当作所有机器的默认值。']),kind:'novice-example',command,output:result.out};}
const noviceBrowser=hubCurriculum.opswork.find(c=>c.id==='browser');
noviceBrowser.novice={goal:'能从一次失败请求记录时间、路径、状态和请求标识，再查对应入口日志。',before:'先会用 grep 按文字查文件；这里会介绍浏览器 Network 面板。',review:1};
noviceBrowser.novicePages=[
 P('页面红字不是完整的故障证据',['同一个页面可能同时请求很多接口。先找“哪一个请求失败”，而不是看到红字就重启服务。','本课目标：留下足够让日志定位到同一次请求的信息，再用已学的 grep 查询。']),
 {...P('浏览器里，先记录这一张请求卡',['电脑浏览器：按 F12 或从菜单打开开发者工具 → Network / 网络 → 保持面板打开并复现一次。选中失败请求，查看 Headers / 标头与 Response / 响应。','记录带时区的发生时间、请求路径与方法、状态码、响应内容，以及响应头中已有的 X-Request-ID。没有这个头时，不能自己随便编一个当真实证据。','手机可以学习这套判断并在本站练样例；排查真实站点时，可请同事协助提供请求记录，或在电脑开发者工具中复现。']),kind:'novice-request-card'},
 noviceWorkExample(noviceBrowser),
 P('看见 500 后，下一步为什么是服务日志？',['入口日志能关联同一请求的时间、路径、状态与上游地址。500 表示这次请求收到了服务器错误响应；可能由应用或代理产生，不能单靠状态码确定具体根因。','本例用 r-101 关联入口与应用日志。下一课继续使用同一个标识查看应用异常，不把另一条请求的错误混进来。','关联知识：Nginx 负责入口代理；应用处理业务；数据库保存数据。它们的日志位置和请求标识传播需要配置与核对。'])
];
const noviceAppLog=hubCurriculum.opswork.find(c=>c.id==='app-log');
noviceAppLog.novice={goal:'能把同一请求的异常、实际 SQL 与数据源信息连起来，提出下一步核对项。',before:'先完成“页面报错：先拿到请求证据”，知道本例请求标识是 r-101。',review:2};
noviceAppLog.novicePages=[
 P('这次继续查同一个 r-101',['先从 Nginx 配置确认上游服务，再查该服务配置或容器挂载确认日志位置。本例已经确认教学应用日志在 /opt/order/logs/app.log。','在应用日志中继续找 r-101。不要因为某个目录看起来像日志目录，就认定当前业务服务写在那里。']),
 {...P('为什么要带上下文？',['grep -F 按原样找请求标识；-C 1 同时显示命中位置前后各一行。相邻行可能提供数据源或错误背景，但相邻不一定代表同一请求，要继续核对编号。']),kind:'novice-syntax',command:noviceAppLog.tasks[0].command,parts:[['grep -F','按固定字符串搜索。'],['-C 1','保留前后各一行上下文。'],['r-101','本次失败请求的标识。'],['/opt/order/logs/app.log','已经确认的教学应用日志。']]},
 noviceWorkExample(noviceAppLog),
 P('把“日志里看到的”与“推断”分开',['观察：r-101 出现 table=ORDERS does not exist；上下文给出 datasource=dm-order、schema=REPORT，SQL 使用未限定 schema 的 ORDERS。','假设：可能查错了 schema，也可能涉及对象或权限；此时还不能断定业务表被删除。','下一步：核对应用连接账号、数据源、当前 schema、对象归属与实际 SQL，再查受权限允许的元数据。不要先给所有账号加权限或修改所有配置。'])
];
const noviceDMSelect=hubCurriculum.opswork.find(c=>c.id==='dm-select');
noviceDMSelect.novice={goal:'能写清要查的列、schema 与表、精确业务条件，并读懂一条订单结果。',before:'先认识表、行、列，并通过元数据或实际 SQL 确认业务表；本例已确认 APP.ORDERS。',review:1};
noviceDMSelect.novicePages=[
 P('页面字段，为什么不能直接猜表名？',['“订单编号”是页面给人看的名称，可能映射到 ORDER_NO，也可能来自接口计算或多表关联。先沿请求、接口 SQL / Mapper、数据源与元数据确认对象。','本课已确认：对象是 APP.ORDERS，页面订单编号是 OD20261008001。现在只核对它的状态，不修改数据。']),
 {...P('SQL 标准写法：按三个问题拆开',['我要哪些信息？SELECT 后写列名。去哪里找？FROM 后写对象。只看哪条记录？WHERE 后写条件。','APP 是 schema，ORDERS 是表。ORDER_NO 是列名；单引号里的 OD20261008001 是字符串值，不能把单引号误记成列名引号。']),kind:'novice-syntax',command:noviceDMSelect.tasks[0].command,parts:[['SELECT ID, ORDER_NO, STATUS','只返回核对需要的三列。'],['FROM APP.ORDERS','明确 schema 与表，减少默认 schema 的歧义。'],["WHERE ORDER_NO = 'OD20261008001'",'只匹配这个业务编号；是否唯一仍需看业务约束。'],[';','常见 SQL 客户端中用于结束语句；与 Shell 命令分开理解。']]},
 noviceWorkExample(noviceDMSelect),
 P('把返回结果翻译成业务结论',['教学结果返回 ID=1、ORDER_NO=OD20261008001、STATUS=PAID。可以说：这条教学查询匹配到了该编号，状态字段为 PAID。PAID 在这个教学业务中表示已支付。','不能说：所有订单都已支付、页面缓存已经刷新，或系统整体健康。下一步还要与接口响应和业务状态定义核对。','如果换成其他编号，应更换 WHERE 中的值，再核对返回行数。真实数据库还要核对访问权限、查询范围、索引与耗时；本课结果是固定快照。'])
];

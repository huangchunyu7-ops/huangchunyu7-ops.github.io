const commandGuides={};
function guide(key,syntax,meaning,parameters,mistake,other){commandGuides[key]={syntax,meaning,parameters,mistake,other};}
guide('whoami','whoami','显示当前有效用户的用户名。',{},'它显示用户，不显示你连接的是哪台主机。','whoami');
guide('pwd','pwd','显示当前工作目录的绝对路径。',{},'pwd 只查看位置；改变目录需要 cd。','pwd');
guide('uname','uname [选项]','读取内核与系统信息。',{'-a':'输出可用的系统信息，包括内核和架构。'},'uname 不等同于发行版版本；发行版信息可读 /etc/os-release。','uname -a');
guide('ls','ls [选项] [目录或文件]','列出目录内容，或查看指定文件信息。',{'-l':'长格式：权限、属主、大小等。','-a':'包含以 . 开头的隐藏项。','-la':'组合 -l 和 -a。','-lh':'长格式，并以易读单位显示大小。'},'不写路径时，目标是当前目录。长格式的目录大小不代表目录内所有文件总占用。','ls -l /etc');
guide('cd','cd [目录路径]','改变 Shell 的当前工作目录。',{'..':'上一级目录。','~':'当前用户家目录。','/etc':'从根目录 / 开始的绝对路径。'},'cd 需要目录；不能进入普通文件。相对路径从当前目录计算。','cd /etc');
guide('mkdir','mkdir [选项] 目录路径','创建目录。',{'-p':'真实环境可递归创建父目录；模拟器仅支持单级 mkdir。'},'mkdir lab 与 touch lab 不同：前者创建目录，后者创建文件。','mkdir lab');
guide('touch','touch 文件路径','文件不存在时创建空文件；存在时更新访问/修改时间。',{},'touch 不会清空已有内容；创建新文件需要父目录存在。','touch lab/check.txt');
guide('cat','cat [选项] 文件...','按顺序输出文件内容。',{},'大日志不宜一次完整输出，可先用 tail。文件名不要省略成参数。','cat notes.txt');
guide('tail','tail [选项] 文件','查看文件末尾部分。',{'-n':'后面跟要显示的行数。','-f':'真实环境持续跟随追加内容；本模拟器不支持持续刷新。'},'-n 后需要一个数字，文件路径写在后面。','tail -n 2 app.log');
guide('head','head [选项] 文件','查看文件开头部分。',{'-n':'后面跟要显示的行数。'},'head 看开头；tail 看结尾。','head -n 1 app.log');
guide('cp','cp [选项] 源路径 目标路径','复制文件，保留源文件。',{},'顺序是先源后目标；目标已有文件时，真实 cp 可能覆盖它。','cp notes.txt notes.bak');
guide('mv','mv [选项] 源路径 目标路径','移动文件，或在同目录内重命名。',{},'源路径通常不再存在；操作前核对两个路径。','mv notes.bak notes-backup.txt');
guide('rm','rm [选项] 文件路径','删除文件。',{},'真实 rm 通常不进入回收站；本模拟器只允许删除单个文件。','rm result.txt');
guide('id','id [用户]','查看用户编号、主要组和附加组。',{},'id 不能独立说明一个文件是否可写，还要结合文件和路径权限。','id');
guide('chmod','chmod 权限模式 文件路径','修改文件权限。',{'755':'属主 7=rwx；用户组与其他用户 5=r-x。','+x':'增加执行权限；真实行为也受 umask 影响。','u+x':'仅给属主增加执行权限。'},'不要用 777 代替权限分析；真实目录的 x 含义与普通文件不同。','chmod 755 health.sh');
guide('grep','grep [选项] 模式 [文件...]','输出匹配模式的行。',{'-n':'在输出前显示原文件行号。'},'真实 grep 默认支持基础正则；按固定文本可用 -F。当前模拟先练文本包含匹配。','grep -n ERROR app.log');
guide('df','df [选项] [路径]','显示文件系统的容量、已用和可用空间。',{'-h':'使用 KiB、MiB、GiB 等易读量级。'},'df 看文件系统容量，不用于单独统计一个目录。','df -h');
guide('du','du [选项] 路径','估算文件或目录占用。',{'-s':'只显示汇总。','-h':'使用易读单位。','-sh':'把汇总和易读单位组合起来。'},'路径是你想统计的对象；df 和 du 的结果可能因打开的已删除文件等原因不同。','du -sh /var/log');
guide('free','free [选项]','显示内存与交换空间情况。',{'-h':'使用易读单位。'},'free 列不是全部可用内存；判断压力还要看 available 和趋势。','free -h');
guide('ps','ps [选项]','查看进程快照。',{'aux':'BSD 风格选项组合，列出较全面的进程和资源信息。'},'aux 前没有短横线；ps 是快照，不会自动刷新。','ps aux');
guide('top','top [选项]','实时观察进程与系统负载；本教学提供固定快照。',{},'真实 top 按 q 退出；短时高 CPU 不一定是故障。','top');
guide('kill','kill [信号选项] PID','向进程发送信号。',{'-0':'不发送实际终止信号，检查进程存在性及信号权限。'},'kill -0 不终止进程；其他信号可能改变业务状态。','kill -0 240');
guide('ip','ip [选项] 对象 [子命令]','管理和查询接口、地址、路由等网络对象。',{'addr':'查看接口地址。','route':'查看路由。','get':'查询到指定目标的路由决策。'},'ip route get 只是查询路由决策，不保证端到端连通。','ip route get 10.0.0.20');
guide('ping','ping [选项] 目标IP或域名','用 ICMP Echo 探测网络可达性。',{'-c':'后面跟发送次数。'},'ping 成功不能证明某个 TCP 端口或业务正常；不通也可能因 ICMP 被禁用。','ping -c 3 10.0.0.1');
guide('ss','ss [选项]','查看套接字和连接信息。',{'-l':'只显示监听套接字。','-n':'以数字显示地址和端口，减少名称解析。','-t':'只看 TCP。','-lnt':'组合监听、数字显示、TCP 三个选项。','-nt':'数字显示 TCP 连接。'},'LISTEN 与 ESTAB 是不同状态；命令观察的是执行它的当前主机。','ss -lnt');
guide('curl','curl [选项] URL','请求 URL，观察连接与应用响应。',{'-I':'通常发送 HEAD，仅获取响应头。','-v':'输出详细连接和协议交互信息。','--connect-timeout':'后面跟连接阶段超时秒数；不等同于全程超时。'},'-I 是大写 i。localhost 指当前机器，不是另一台服务器。','curl --connect-timeout 3 -I http://localhost');
guide('dig','dig [服务器选项] 域名 [记录类型] [查询选项]','查询 DNS 记录。',{'A':'查询 IPv4 地址记录。','AAAA':'查询 IPv6 地址记录。','+short':'只显示简短答案。'},'获得 IP 只验证解析结果，不验证 Web 业务；dig 可能需要安装 DNS 工具包。','dig web.lab.test A +short');
guide('getent','getent 数据库名 查询键','按系统名称服务配置查询。',{'hosts':'查询主机名称/地址数据库。'},'结果可来自 hosts 文件、DNS 或其他配置来源，不能一概称为纯 DNS 查询。','getent hosts web.lab.test');
guide('ssh','ssh [选项] 用户@主机','加密连接远程主机。',{},'首次连接核对服务器指纹；本教学不会建立真实网络会话。','ssh student@10.0.0.20');
guide('systemctl','systemctl [选项] 操作 服务单元','读取和管理 systemd 服务。',{'status':'读服务状态。','is-active':'读简短活动状态。','start':'启动服务，会改变状态。','restart':'重启服务，可能中断已有请求。'},'active 只描述服务活动状态，还需要请求与业务验证；修改操作需要适当权限。','systemctl status nginx');
guide('journalctl','journalctl [选项]','读取 systemd 日志。',{'-u':'后面跟服务单元。','-n':'后面跟末尾日志行数。','--no-pager':'直接输出，不启用分页器。'},'空日志不一定说明没有故障，还可能是权限、时间范围或服务单元选择问题。','journalctl -u nginx -n 20 --no-pager');
guide('nginx','nginx [选项]','执行 Nginx 自身的管理或检查操作。',{'-t':'检查配置语法，并尝试打开引用文件。'},'-t 不会自动完成业务验收；真实检查可能需要管理员权限。','nginx -t');
guide('echo','echo 文本 [> 文件 | >> 文件]','输出文本，也可重定向写入文件。',{'>':'把标准输出写到文件，覆盖已有内容。','>>':'追加到文件末尾。'},'写入前核对文件路径；包含空格的文本需要正确引用。','echo checked > result.txt');
guide('export','export 变量名=值','设置并导出环境变量，供子进程读取。',{},'等号两边不能有空格；导出不等于永久写入系统配置。','export ENV=lab');
guide('printenv','printenv [变量名]','查看环境变量。',{},'真实输出可能包含敏感信息，不要直接分享全部变量。','printenv ENV');
guide('bash','bash 脚本路径 或 ./脚本名','通过 Bash 解释脚本，或直接执行脚本。',{},'bash 文件名不要求脚本自身有执行位；./脚本名通常需要执行位与正确解释器。','bash health.sh');
guide('pipeline','命令1 | 命令2 [| 命令3]','把前一个命令的标准输出交给后一个命令。',{'|':'连接标准输出与下一个命令的标准输入。','-l':'在 wc 中表示统计换行数。'},'管道通常不直接传递标准错误；本模拟器要求管道两侧有空格。','cat app.log | grep ERROR | wc -l');
guide('crontab','crontab -l 或 crontab 任务文件','查看或装载当前用户的 cron 任务。',{'-l':'列出现有任务。'},'crontab 文件在真实环境会替换列表，先备份旧任务并合并新任务。','crontab -l');
guide('tar','tar -czf 归档名.tar.gz 文件 或 tar -tzf 归档名.tar.gz','创建或查看 gzip 压缩归档。',{'-czf':'c 创建、z gzip、f 后面指定归档文件。','-tzf':'t 列出、z gzip、f 后面指定归档文件。'},'-f 后面的第一个路径是归档，不是待备份源文件。','tar -czf backup.tar.gz notes.txt');
guide('docker','docker 子命令 [选项] [对象]','管理容器和镜像。',{'ps':'列出运行容器。','-a':'在 ps 中包含停止的容器。','logs':'查看容器标准输出/错误日志。','inspect':'读取对象详细信息。','restart':'重启指定容器。'},'容器名与镜像名不同；端口映射要区分宿主机端口和容器端口。','docker logs web');
guide('kubectl','kubectl 子命令 资源 [对象名] [选项]','向 Kubernetes API 查询或声明资源。',{'get':'看概要。','describe':'看详情与事件。','logs':'看容器日志。','apply':'从文件声明资源。','-f':'后面跟清单文件。','-n':'后面跟命名空间。','--show-labels':'在列表中显示标签。','pods':'Pod 资源类型。','deployments':'Deployment 资源类型。','services':'Service 资源类型。','learning':'本课程的学习命名空间。','--replicas=3':'期望副本数为 3。'},'先确认 context 和 namespace；真实 Pod 名需要先 get，不能照抄教学固定名称。','kubectl get pods -n learning');
guide('apt-cache','apt-cache policy 软件包名','查看 APT 软件包候选版本和来源。',{'policy':'显示当前安装与候选包版本/来源。'},'不同发行版用不同包管理器，候选版本取决于配置的软件源。','apt-cache policy nginx');
guide('apt-install','sudo apt install 软件包名','用管理员权限安装 APT 软件包。',{'sudo':'以获授权的身份运行命令。','apt':'Debian/Ubuntu 常用包管理工具。','install':'安装指定软件包。'},'真实安装会改变系统；本网站只模拟。先确认来源、版本和变更权限。','sudo apt install nginx');
guide('mysql-version','mysql --version','查看 MySQL 客户端版本。',{'--version':'显示版本后退出。'},'客户端存在不代表数据库服务已经部署或认证可用。','mysql --version');
guide('mysqladmin','mysqladmin [连接选项] ping','检查数据库服务是否响应。',{'ping':'请求服务器响应存活探测。'},'真实 ping 响应不等同于业务账号能完成查询；还需检查认证与权限。','mysqladmin ping');
guide('mysqldump','mysqldump [选项] 数据库 > 备份文件.sql','逻辑导出数据库。',{'--single-transaction':'使用事务获取一致性视图，通常用于 InnoDB；有 DDL 等限制。','>':'将标准输出写入文件，覆盖已有同名文件。'},'必须检查退出状态，验证完整性并演练恢复；文件存在并不保证备份成功。','mysqldump --single-transaction learning > learning.sql');
guide('mysql-restore','mysql [连接选项] 目标数据库 < 备份文件.sql','把 SQL 文件作为输入执行，用于逻辑恢复。',{'<':'从文件读取标准输入。'},'先在隔离测试库演练；真实导出可能含 USE 或建库语句，应核对目标与内容。','mysql restore_lab < learning.sql');
guide('SELECT','SELECT 列列表 FROM 表 [WHERE 条件] [GROUP BY 分组列] [ORDER BY 排序列 ASC|DESC] [LIMIT 条数];','读取数据；各子句有明确作用和顺序。',{'SELECT':'选择哪些列或聚合表达式。','*':'全部列；大表临时检查也应限制返回量。','FROM':'从哪张表读取。','WHERE':'按条件筛选行。','COUNT(*)':'统计行数。','GROUP BY':'按列分组。','ORDER BY':'按列排序。','DESC':'降序。','ASC':'升序。','LIMIT':'最多返回多少行。','IS NULL':'检查缺失值。','IS':'配合 NULL 检查是否为缺失值。','NULL':'缺失或未知值，不等同于空字符串。','NOT':'在 IS NOT NULL 中表示不是缺失值。'},'字符串用单引号；= NULL 通常不能按预期检查空值。先读数据，再写修改语句。',"SELECT id, name FROM users WHERE status = 'active' ORDER BY id DESC LIMIT 2;");
guide('INSERT','INSERT INTO 表 (列1, 列2, ...) VALUES (值1, 值2, ...);','插入一条新记录。',{'INTO':'目标表。','VALUES':'按列列表顺序提供值。'},'列和值要一一对应；主键重复会失败。',"INSERT INTO users (id, name, status) VALUES (4, 'Dave', 'active');");
guide('UPDATE','UPDATE 表 SET 列 = 新值 WHERE 条件;','修改符合条件的已有行。',{'SET':'指定要修改的列与新值。','WHERE':'限定受影响行。'},'先用相同 WHERE 做 SELECT；遗漏 WHERE 可能修改全表，模拟器会阻止。',"UPDATE users SET status = 'active' WHERE id = 2;");
guide('DELETE','DELETE FROM 表 WHERE 条件;','删除符合条件的记录。',{'FROM':'目标表。','WHERE':'限定删除范围。'},'DELETE 与 DROP TABLE 不同；先核对范围和事务边界。','DELETE FROM users WHERE id = 3;');
guide('START','START TRANSACTION;','开始显式事务。',{},'真实 MySQL 中并不是每种语句都能事务回滚，DDL 常有隐式提交。','START TRANSACTION;');
guide('ROLLBACK','ROLLBACK;','撤销当前未提交的事务修改。',{},'不能用它撤销已经提交的普通事务。','ROLLBACK;');
guide('COMMIT','COMMIT;','提交当前事务。',{},'提交前读回验证；提交之后不能再靠普通 ROLLBACK 撤销。','COMMIT;');
guide('SHOW','SHOW STATUS LIKE \'名称\'; 或 SHOW VARIABLES LIKE \'名称\'; 或 SHOW PROCESSLIST;','只读观察 MySQL 状态、设置和当前会话。',{'STATUS':'状态计数等运行信息。','VARIABLES':'服务器设置。','LIKE':'按名称模式筛选。','PROCESSLIST':'查看会话和正在执行的工作。'},'固定样本指标不代表真实基线；输出也取决于账号权限。',"SHOW STATUS LIKE 'Threads_connected';");
guide('EXPLAIN','EXPLAIN SELECT ...;','查看查询执行计划。',{'EXPLAIN':'让数据库说明该查询的访问计划。'},'这里为固定教学计划，不是真实优化器。访问方式 ALL 在小表中未必有问题。','EXPLAIN SELECT * FROM users WHERE id = 1;');
guide('SELECT_VERSION','SELECT VERSION();','读取当前数据库服务返回的版本信息。',{'VERSION();':'调用 VERSION() 函数，分号结束语句。'},'函数查询可以不写 FROM；版本信息不替代权限和业务检查。','SELECT VERSION();');
function guideFor(cmd){if(/^SELECT VERSION\(\);?$/i.test(cmd.trim()))return commandGuides.SELECT_VERSION;const first=cmd.trim().split(/\s/)[0].replace(/;$/,''),upper=first.toUpperCase();let key=cmd.includes(' | ')?'pipeline':cmd.startsWith('sudo apt install')?'apt-install':cmd.startsWith('./')?'bash':cmd.startsWith('mysql restore')?'mysql-restore':cmd.startsWith('mysql --')?'mysql-version':commandGuides[upper]?upper:first;return commandGuides[key]||null;}
function commandParts(cmd,g){const tokens=cmd.match(/"[^"\n]*"|'[^'\n]*'|\S+/g)||[];return tokens.map((token,i)=>{let label=g.parameters[token]||g.parameters[token.replace(/[,;]$/,'')];if(!label){if(i===0)label=g.meaning;else if(token==='|'||token==='>'||token==='>>'||token==='<')label={'|':'把输出传给下一个命令。','>':'覆盖写入到文件。','>>':'追加写入到文件。','<':'从文件读取输入。'}[token];else if(['-n','-c','--connect-timeout'].includes(tokens[i-1]))label='前一个选项对应的取值；这里是 '+token+'。';else if(firstIsSQL(cmd))label=token.startsWith("'")?'字符串字面值，单引号包住内容。':/^[0-9]+[,;]?$/.test(token)?'数字字面值。':token==='='?'比较或赋值符号，含义由所在子句决定。':'列名、表名或表达式的一部分，需结合标准格式阅读。';else if(token==='$ENV')label='读取环境变量 ENV 的值。';else if(token==='ENV=lab')label='变量名 ENV，值为 lab；等号两边不加空格。';else if(cmd.startsWith('kill ')&&i===2)label='目标进程编号 PID。';else if(token.startsWith('-'))label='选项，影响命令行为；不是文件路径。';else if(tokens[i-1]==='-f')label='输入的清单/归档文件名。';else if(cmd.startsWith('cp ')||cmd.startsWith('mv '))label=i===1?'源路径：操作从这里开始。':'目标路径：复制或移动到这里。';else if(cmd.startsWith('kubectl '))label='资源、子命令或对象名称；与当前操作对应。';else if(cmd.startsWith('chmod ')&&i===1)label='权限模式。';else label='操作对象或参数值：'+token+'。';}return {token,label};});}
function firstIsSQL(cmd){return /^(SELECT|INSERT|UPDATE|DELETE|START|BEGIN|ROLLBACK|COMMIT|SHOW|EXPLAIN)\b/i.test(cmd);}
const referenceCache=new Map();
function referenceResult(c,i){const k=c.title+'|'+i;if(referenceCache.has(k))return referenceCache.get(k);const e=new OpsEngine(c.key||'normal');let result;for(let n=0;n<=i;n++)result=e.execute(c.steps[n].cmd);referenceCache.set(k,result);return result;}
function referenceHTML(c,i,open=false){const step=c.steps[i],g=guideFor(step.cmd);if(!g)return '';const result=referenceResult(c,i),parts=commandParts(step.cmd,g);return `<details class="command-reference" ${open?'open':''}><summary><span>${esc(step.task)}</span><code>${esc(step.cmd)}</code></summary><div class="reference-content"><p class="reference-purpose">${esc(g.meaning)}</p><h4>标准格式</h4><pre class="reference-syntax">${esc(g.syntax)}</pre><p class="small-note">[方括号] 表示可选部分；“文件、路径、表、条件”等是需要替换的说明，不要原样输入。SQL 语句通常用分号结束。</p><h4>把这个示例拆开看</h4><div class="token-explanations">${parts.map((p,j)=>`<div><code class="token-${j===0?'command':p.token.startsWith('-')?'option':'argument'}">${esc(p.token)}</code><span>${esc(p.label)}</span></div>`).join('')}</div><h4>可直接照着写的本课示例</h4><div class="reference-example"><pre>${esc(step.cmd)}</pre><button class="secondary" data-action="fill-example" data-example="${i}">填入示例</button></div><h4>预期看到什么</h4><pre class="reference-output">${esc(result?.out||'(命令成功，没有输出)')}</pre><p class="small-note">以上结果来自依次执行本课示例的重置教学环境。你实际修改过文件或数据后，返回内容可能不同。</p><div class="reference-mistake"><strong>常见误区</strong><p>${esc(g.mistake)}</p></div><details class="more-usage"><summary>再看一个常见标准写法</summary><pre class="reference-syntax">${esc(g.other)}</pre><p class="small-note">此处用于理解真实语法，不保证模拟器覆盖所有选项。是否可练，以本课步骤为准。</p></details></div></details>`;}

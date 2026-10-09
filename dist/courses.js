const stages=[
 {name:'Linux 起步',tag:'先认识，再操作',weeks:'第 1–2 周',color:'#33bba4',goal:'独立完成目录定位、文件管理、文本查看与权限检查。'},
 {name:'Linux 排查',tag:'用证据定位问题',weeks:'第 3–4 周',color:'#62a8ef',goal:'从日志、资源、进程和网络获取证据，形成排查顺序。'},
 {name:'Shell 脚本',tag:'把重复操作自动化',weeks:'第 5–6 周',color:'#a78bfa',goal:'理解变量、管道、条件与循环，编写并验证第一个巡检脚本。'},
 {name:'服务与交付',tag:'管理与恢复服务',weeks:'第 7–8 周',color:'#efb45d',goal:'连接服务器、检查服务、验证配置、安排任务与验证备份。'},
 {name:'Docker',tag:'从进程到容器',weeks:'第 9 周',color:'#60b9de',goal:'读懂镜像、容器、端口映射，查看状态与日志并验证恢复。'},
 {name:'Kubernetes',tag:'从单机到编排',weeks:'第 10–12 周',color:'#8595ff',goal:'理解集群对象，使用 kubectl，编写 Deployment 并练习扩容与排查。'}
];
const sources={linux:['GNU Coreutils 官方手册','https://www.gnu.org/software/coreutils/manual/coreutils.html'],shell:['GNU Bash 官方手册','https://www.gnu.org/software/bash/manual/bash.html'],system:['systemd 官方手册','https://www.freedesktop.org/software/systemd/man/latest/systemctl.html'],docker:['Docker 官方文档','https://docs.docker.com/reference/cli/docker/'],k8s:['Kubernetes 官方教程','https://kubernetes.io/docs/tutorials/kubernetes-basics/']};
const courses=[];
function lesson(stage,title,summary,concept,scene,steps,question,options,answer,note,source='linux',extra=''){courses.push({id:courses.length,stage,title,summary,concept,scene,steps:steps.map(s=>({task:s[0],cmd:s[1],explain:s[2],output:s[3]||null})),question,options,answer,note,source,extra});}
lesson(0,'认识终端与 Linux','找到“我是谁”和“我在哪里”。','Linux 是操作系统；终端是输入文字命令的界面；Shell 是解释命令的程序。命令常由「命令名 参数 路径」组成。空格分隔参数，大小写通常有区别。','接手一台陌生服务器，先确认身份和系统，不急着修改配置。',[
 ['查看当前用户','whoami','whoami 返回当前有效用户名。','student'],['确认当前目录','pwd','pwd 显示绝对路径；/ 表示根目录。','/home/student'],['查看系统信息','uname -a','-a 请求可用的系统信息，包括内核与架构。','Linux']],
 'pwd 用来做什么？',['显示当前工作目录','更改密码','查看内存'],0,'本课不需要管理员权限。每天建议 30–45 分钟：理解 10 分钟，练习 20 分钟，复盘 5 分钟。');
lesson(0,'目录定位与路径','分清绝对路径和相对路径。','以 / 开头的是绝对路径；其他路径通常相对当前目录。~ 代表用户家目录，. 是当前目录，.. 是上一级。cd 改变当前位置，ls 查看目录内容。','配置文件在 /etc，日志常在 /var/log；先找对目录再操作。',[
 ['查看家目录中的文件','ls -l','-l 显示类型、权限、属主和大小等信息。','notes.txt'],['进入配置目录','cd /etc','这里用绝对路径，当前位置改变为 /etc。'],['验证位置','pwd','操作后读回状态，确认自己确实在 /etc。','/etc']],
 '路径 ../logs 是哪种路径？',['绝对路径','相对路径','网络地址'],1,'不要把 Linux 的 / 与 Windows 的反斜杠混用。');
lesson(0,'创建目录与文件','创建一个自己的工作区。','mkdir 创建目录，touch 创建空文件；目标父目录必须存在。命令没有输出也可能成功，应使用 ls 或 cat 验证。','整理巡检文件，为脚本和记录建立独立目录。',[
 ['创建 lab 目录','mkdir lab','目标是当前家目录下的 lab。'],['创建记录文件','touch lab/check.txt','touch 不会清空已经存在的文件。'],['验证目录内容','ls -l lab','确认 check.txt 出现在工作区中。','check.txt']],
 'mkdir lab 成功后没有输出，应该怎么办？',['认为失败重复执行','用 ls 检查结果','直接删掉目录'],1,'真实终端里 mkdir -p 能创建多级目录；本模拟器先练单级目录。');
lesson(0,'读取文件与日志','读完整文件，或只看最后几行。','cat 适合短文件；head 看开头，tail 看结尾。大日志不要全部输出；tail -n 20 指定最后 20 行，真实环境中 tail -f 会持续跟随追加内容。','服务报错时，先查看近期日志，再缩小范围。',[
 ['读取学习笔记','cat notes.txt','cat 输出文件内容。','Linux'],['只看日志末尾两行','tail -n 2 app.log','-n 2 限制行数，本课日志是固定教学样本。','ERROR upstream'],['查看日志第一行','head -n 1 app.log','先读开始记录，了解启动情况。','INFO service']],
 '只查看日志最后 20 行用什么？',['cat -20','tail -n 20','pwd -20'],1,'日志可能含密钥、账号或业务数据，分享前检查内容。');
lesson(0,'复制、移动与删除','先复制再修改，操作后验证。','cp 复制文件，mv 移动或重命名，rm 删除文件。它们是不同操作：复制保留源文件，移动通常不保留原路径。','修改配置前保留副本，避免错误覆盖。',[
 ['复制笔记作为备份','cp notes.txt notes.bak','此时源文件仍然存在。'],['重命名备份','mv notes.bak notes-backup.txt','同一目录内移动可用于重命名。'],['读回备份验证','cat notes-backup.txt','确认备份不是空文件。','Linux']],
 '哪条命令通常保留源文件？',['mv','rm','cp'],2,'rm 通常不会进回收站；真实操作先确认路径。本模拟器只允许删除单个文件。');
lesson(0,'用户与权限','理解 rwx，给脚本增加执行权限。','权限分为属主、属组、其他用户三组，每组有 r 读、w 写、x 执行。数字 r=4、w=2、x=1；755 表示属主 rwx，组和其他用户 r-x。目录的 x 表示可进入和访问。','脚本提示 Permission denied，先检查权限和身份，而不是直接设为 777。',[
 ['查看用户身份与组','id','组信息用于判断当前用户可能拥有的权限。','uid=1000'],['赋予脚本 755 权限','chmod 755 health.sh','属主可修改和运行，其他人可以读和运行。'],['检查新的权限','ls -l health.sh','应看到 -rwxr-xr-x。','-rwxr-xr-x']],
 '权限 755 中，属主拥有什么权限？',['只读','读、写、执行','读、写，不可执行'],1,'本课简化了属主与组；真实环境需要结合 ls -l、id 与 ACL 判断。');
lesson(1,'日志搜索与筛选','从很多行里找到错误。','grep 用模式筛选行；本课程先使用固定文本关键字。-n 显示行号，便于定位。真实 grep 默认支持基础正则，-F 可按固定字符串匹配。','从应用日志中找出 ERROR，再记录具体时间和上下文。',[
 ['查看日志末尾','tail -n 4 app.log','先获得上下文，不只看单个错误。','timeout'],['筛出错误行','grep ERROR app.log','仅输出包含 ERROR 的行。','ERROR database'],['显示错误行号','grep -n ERROR app.log','行号帮助回到原始日志找上下文。','2:ERROR']],
 'grep -n 的主要作用是什么？',['删除匹配行','显示行号','自动修复错误'],1,'没有匹配通常不代表命令故障；真实 grep 退出码 1 代表没有匹配，2 通常表示错误。');
lesson(1,'磁盘与内存巡检','看容量，也看实际可用内存。','df 查看文件系统整体容量；du 估算文件或目录占用；free 展示内存。-h 使用更易读的单位。Linux 会利用空闲内存缓存，判断压力时重点结合 available、交换空间与业务指标。','磁盘告警或应用变慢时，先判断资源瓶颈，避免随意删除。',[
 ['查看文件系统容量','df -h','Use% 是已用比例，Mounted on 是挂载位置。','42%'],['估算日志目录占用','du -sh /var/log','-s 汇总目录，-h 使用人类可读单位。','/var/log'],['查看可用内存','free -h','available 比单独的 free 更适合初步判断可用容量。','available']],
 'df 与 du 的区别是什么？',['df 看文件系统，du 看文件/目录占用','两者完全一样','du 只看 CPU'],0,'df 与 du 不一致可能与已删除但仍打开的文件有关，应继续检查进程。');
lesson(1,'进程与 CPU','把 PID 和服务关联起来。','进程是正在运行的程序；PID 是进程编号。ps aux 是一份快照，top 在真实系统里持续刷新。高 CPU 只是一条证据，需要结合持续时间、日志和业务负载。','应用变慢时，确认谁消耗资源，再评估是否需要处理。',[
 ['查看进程快照','ps aux','USER、PID、%CPU 和 COMMAND 帮助辨认进程。','240'],['查看 CPU 排序样本','top','教学终端提供固定快照；真实 top 可按 q 退出。','85.0'],['无终止地检查 PID 240','kill -0 240','信号 0 只检查进程存在性和发送信号的权限。','PID 240']],
 'kill -0 240 会直接终止进程吗？',['会强制结束','不会，它用于检查','会重启服务'],1,'不要一上来 kill -9；先定位、评估影响，再考虑正常停止。');
lesson(1,'网络地址与路由','分清本机地址和默认出口。','IP 地址用于标识网络接口；路由决定数据往哪里走。ip addr 看接口，ip route 看路由，ping 验证 ICMP 可达性。','服务不可达时，从本机地址、网关、端口到应用逐层排查。',[
 ['查看接口地址','ip addr','确认 eth0 为 UP，并观察 10.0.0.10/24。','10.0.0.10'],['查看默认路由','ip route','default via 指向默认网关。','10.0.0.1'],['向网关发送 3 次探测','ping -c 3 10.0.0.1','-c 限定次数，避免一直运行。','0% packet loss']],
 'ping 成功能证明网站一定正常吗？',['能','不能，只证明相关 ICMP 路径可达','能证明数据库正常'],1,'部分环境禁用 ICMP；ping 不通也不能单独断言服务故障。');
lesson(1,'端口与 HTTP 验证','把网络连通和应用响应分开。','监听端口表示程序在等待连接。ss -lnt 查看监听 TCP 套接字；curl -I 获取 HTTP 响应头。HTTP 200 是本次请求成功的证据，不代表所有业务功能都正常。','网站访问失败，先检查是否监听端口，再检查 HTTP 响应。',[
 ['查看 TCP 监听端口','ss -lnt','-l 监听，-n 数字显示，-t TCP。',':80'],['请求本机网站响应头','curl -I http://localhost','本教学场景返回 HTTP 200。','200 OK'],['请求健康接口','curl http://localhost/health','检查应用返回的健康信息。','"status":"ok"']],
 'ss -lnt 查看什么？',['所有磁盘','监听中的 TCP 端口','所有历史日志'],1,'localhost 只代表本机；真实排查还需从客户端路径验证 DNS、防火墙和负载均衡。');
lesson(2,'变量与输出','写脚本之前，先掌握数据传递。','Shell 变量用于保存数据。赋值等号两侧不能有空格；$ENV 读取变量。export 把变量导出到子进程环境。引用真实变量时通常使用双引号，避免拆词和通配展开。','在测试和生产之间区分运行环境，避免把脚本指向错误系统。',[
 ['设置环境变量','export ENV=lab','把 ENV 设置为 lab 并导出。'],['读取变量','printenv ENV','验证环境变量确实已设置。','lab'],['输出变量的值','echo $ENV','使用 $ 引用变量。','lab']],
 'Shell 变量赋值哪种正确？',['ENV = lab','ENV=lab','ENV:lab'],1,'不要在脚本或命令历史里写明文密码。此模拟器只演示 ENV 变量。','shell');
lesson(2,'管道与文本组合','把小命令组合成一个处理流程。','管道 | 将前一个命令的标准输出交给后一个命令的标准输入。重定向 > 写文件且覆盖，>> 追加。两者作用不同，覆盖之前要确认目标。','统计日志中的错误行数，减少重复手工检查。',[
 ['用管道筛选错误','cat app.log | grep ERROR','cat 输出文本，grep 接收它并筛选。','ERROR'],['统计错误行数','cat app.log | grep ERROR | wc -l','wc -l 在真实环境中计算换行数，本课样本每行都有换行。','2'],['写入本次巡检记录','echo checked > result.txt','> 创建或覆盖 result.txt；ls 或 cat 可读回。']],
 '>> 和 > 的区别是什么？',['>> 追加，> 覆盖','>> 删除，> 追加','没有区别'],0,'本教学终端只支持课程中的管道与重定向组合。','shell');
lesson(2,'第一个 Shell 脚本','从命令文件到可运行的脚本。','脚本是按顺序执行的一组命令。#!/bin/bash 是解释器声明；bash 文件名可以显式用 Bash 运行。./文件名表示执行当前目录里的程序，通常需要执行权限。','把巡检动作保存为文件，重复运行而不用每次重新输入。',[
 ['阅读内置脚本','cat health.sh','先读懂脚本，不直接执行未知文件。','#!/bin/bash'],['用 Bash 运行脚本','bash health.sh','显式选择 Bash，此方式不要求脚本自身有执行位。','healthy'],['授予脚本执行权限','chmod 755 health.sh','完成后可尝试 ./health.sh。']],
 'bash health.sh 与 ./health.sh 的区别是什么？',['前者显式指定 Bash，后者通常依赖执行权限和解释器声明','完全相同且不需要权限','前者只读取不运行'],0,'练习编辑器可修改 health.sh；当前模拟器只运行内置的简单输出脚本。','shell','#!/bin/bash\necho healthy');
lesson(2,'条件判断与退出码','根据检查结果决定下一步。','命令退出码 0 通常表示成功，非 0 表示其他结果。if 按命令退出状态选择分支；[ -f "$file" ] 判断普通文件是否存在。$? 读取上一条命令的退出码，必须及时保存。','巡检脚本先检查文件是否存在，再读取；失败时给出明确说明。',[
 ['确认脚本文件存在','ls -l health.sh','这是条件判断之前的人工观察。','health.sh'],['读取条件判断示例','cat condition.sh','观察 if、then、else、fi 配对结构。','if'],['运行条件脚本教学样例','bash condition.sh','此课仅模拟内置样例，不是通用 Bash 解释器。','script exists']],
 'if 通常如何判断命令成功？',['输出必须不为空','退出状态为 0','执行时间少于 1 秒'],1,'真实 Bash 中注意空格与引用：[ -f "$file" ] 的括号内需有空格。','shell','#!/bin/bash\nfile="health.sh"\nif [ -f "$file" ]; then\n  echo "script exists"\nelse\n  echo "script missing"\n  exit 1\nfi');
lesson(2,'循环与巡检清单','逐项检查，而不是反复复制命令。','for 遍历一组项目，do 与 done 包住循环体。真实脚本应给变量加双引号，并检查每次命令的退出状态。循环很适合检查固定服务列表。','每天检查多个服务，统一输出名称和运行状态。',[
 ['读取服务循环样例','cat services.sh','先从 nginx 一个服务开始，再逐渐增加。','for'],['运行内置循环样例','bash services.sh','模拟样例返回当前 nginx 状态。','nginx: active'],['单独验证服务状态','systemctl is-active nginx','对脚本中的结论再做一次读回检查。','active']],
 'for 循环用来做什么？',['遍历一组项目','自动修复一切故障','给目录授权'],0,'生产巡检应记录时间、对象、结果与错误；别把自动检查直接变成自动重启。','shell','#!/bin/bash\nfor service in nginx; do\n  state=$(systemctl is-active "$service")\n  printf "%s: %s\\n" "$service" "$state"\ndone');
lesson(3,'SSH 与远程连接','先确认连接目标和身份。','SSH 提供加密的远程连接，基本格式为 ssh 用户@主机。首次连接时需要核对服务器指纹；密钥认证可减少密码使用，私钥需要妥善保管。','连接测试服务器执行巡检，先核对主机再运行命令。',[
 ['模拟连接测试主机','ssh student@10.0.0.20','此处只模拟连接，不会访问该 IP。','模拟连接'],['确认连接后的身份','whoami','真实环境还应检查 hostname 和业务标识。','student'],['确认工作目录','pwd','从已知目录开始操作。','/home/student']],
 '首次 SSH 连接时应核对什么？',['服务器指纹与目标身份','网站配色','磁盘文件数量'],0,'不要通过关闭主机密钥校验来“解决”指纹异常；先确认服务器是否变化。','system');
lesson(3,'systemd 服务管理','先看状态，再看日志。','systemd 用单元管理服务。systemctl status 查看状态，journalctl -u 按服务查询日志，is-active 返回运行状态。start 和 restart 会改变服务，应在获得操作授权并了解影响后使用。','网站不可用时，区分服务未启动与应用内部故障。',[
 ['查看 nginx 状态','systemctl status nginx','注意 Active 和 Main PID。','Active: active'],['读取最近服务日志','journalctl -u nginx -n 20 --no-pager','-u 指定单元，-n 指定末尾行数，--no-pager 直接输出。','upstream'],['检查服务是否活动','systemctl is-active nginx','适合脚本中的简短状态检查。','active']],
 '服务异常时，合理的首步是什么？',['立即反复重启','先看状态与日志','删除日志'],1,'active 不等于业务一定健康，还需结合端口和 HTTP 请求验证。','system');
lesson(3,'配置检查与变更验证','给每次修改留出回退路径。','变更前保存原配置；使用服务自己的校验工具检查语法。nginx -t 检查配置语法并尝试打开引用文件，不等于全量业务验证。变更后需要检查状态、日志和请求。','准备修改 Nginx 配置，先备份和检测，避免误操作造成服务中断。',[
 ['备份 nginx 配置','cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak','教学环境允许写 /etc；真实系统通常需要相应权限。'],['检查配置','nginx -t','真实系统可能需要管理员权限才能访问相关文件。','successful'],['验证现有 HTTP 响应','curl -I http://localhost','完整流程还需在实际变更后重复验证。','200 OK']],
 'nginx -t 成功说明什么？',['所有业务必然正常','配置校验通过，还需验证服务与业务','已经部署新镜像'],1,'本课不直接修改生产配置。配置变更后是否 reload 或 restart，要按服务要求决定。','system');
lesson(3,'备份与恢复意识','有备份，也要验证能读。','tar -czf 创建 gzip 压缩归档，-tzf 列出归档内容。备份流程应包含备份对象、时间、保存位置、校验、保留期限和恢复演练。备份保存在同一磁盘上不足以覆盖磁盘损坏。','修改脚本或配置前，保存可验证的副本。',[
 ['创建笔记压缩备份','tar -czf backup.tar.gz notes.txt','-c 创建，-z gzip，-f 指定归档文件。'],['列出归档内容','tar -tzf backup.tar.gz','确认归档包含 notes.txt。','notes.txt'],['确认归档文件存在','ls -l backup.tar.gz','文件存在只是一个检查项，并不等于恢复成功。','backup.tar.gz']],
 '备份后最关键的后续是什么？',['只记住文件名','验证备份并做恢复演练','删除源文件'],1,'本课归档是模拟的；迁移到真实环境后要在临时目录执行解包和内容校验。');
lesson(3,'定时任务与执行环境','理解 cron 的五个时间字段。','crontab 的时间字段依次是分、时、日、月、星期。0 2 * * * 表示每天 02:00，通常按服务器时区执行。定时任务环境往往比交互终端精简，要使用绝对路径并处理日志和退出码。','每天执行巡检并保存结果，避免任务“运行了”却没有可观察结果。',[
 ['创建教学任务文件','echo "0 2 * * * /home/student/health.sh" > schedule.txt','本例每天 02:00 运行脚本；真实环境先确认执行权限。'],['装载教学定时任务','crontab schedule.txt','真实 crontab 文件会替换当前用户任务列表，先备份原列表。'],['读回任务列表','crontab -l','确认时间和路径没有写错。','0 2 * * *']],
 '0 2 * * * 表示什么？',['每 2 分钟','每天 02:00','每周二'],1,'本网站不在后台执行定时任务。真实操作应先备份 crontab -l，再合并新任务。','shell');
lesson(4,'镜像、容器与端口','理解容器是镜像的运行实例。','镜像提供文件系统和运行配置；容器是镜像的运行实例。容器有独立运行环境，但通常共享宿主机内核。8080->80 表示宿主机 8080 映射到容器 80。','应用容器部署后，确认实际运行对象和访问入口。',[
 ['查看运行中的容器','docker ps','默认只显示运行容器。','web'],['查看包括停止的容器','docker ps -a','-a 包含停止的容器；本场景只有运行中的 web。','nginx:stable'],['检查容器配置与状态','docker inspect web','读取 State 和端口映射，避免只凭名称判断。','8080']],
 '宿主机 8080->容器 80 表示什么？',['外部使用宿主机 8080 访问容器的 80','容器无法联网','镜像版本是 8080'],0,'真实 Docker 权限接近宿主机管理权限，应限制账号；本网站不会访问真实 Docker。','docker');
lesson(4,'容器日志与恢复','先留下证据，再执行恢复动作。','docker logs 读取容器标准输出与错误流日志；日志内容由应用决定。docker restart 会重启容器；它不能修复错误配置，也不能替代根因分析。','容器服务异常时，关联状态、日志与配置，再验证恢复。',[
 ['读取 web 容器日志','docker logs web','先确认应用最近记录了什么。','200'],['在练习环境中重启容器','docker restart web','这是状态修改操作，仅在模拟场景执行。','web'],['再次检查容器状态','docker inspect web','验证 Running 字段。','"Running": true']],
 '重启容器后是否就能认定故障彻底解决？',['可以，不用再看日志','不可以，还需验证业务并分析原因','只要名字还在就可以'],1,'真实环境可用 --tail 与 --since 限定日志；不要无限输出大量日志。','docker');
lesson(5,'K8s 对象与上下文','先弄清集群、命名空间和工作负载。','Kubernetes 协调多个节点上的工作负载。Pod 是最小调度单元；Deployment 管理副本和更新；Service 给一组 Pod 提供相对稳定的访问入口。namespace 隔离对象范围；context 决定操作哪个集群和身份。','第一次接手集群，先确认上下文和命名空间，防止操作错误环境。',[
 ['确认当前上下文','kubectl config current-context','教学集群固定为 learning-cluster。','learning-cluster'],['查看命名空间','kubectl get namespaces','区分系统空间和学习空间。','learning'],['查看学习空间的 Pod','kubectl get pods -n learning','明确 -n，不依赖隐含的默认命名空间。','web']],
 'Deployment 主要负责什么？',['管理应用副本与更新','替代 Linux 内核','只保存用户密码'],0,'本网站使用模拟集群，没有真实 kubeconfig、API Server 或节点。','k8s');
lesson(5,'kubectl 观察与诊断','把列表、详情和日志连起来。','kubectl get 查看对象概要，describe 查看详情和事件，logs 读取容器日志。多容器 Pod 要指定 -c 容器名。不同输出解决不同问题：状态概览、调度事件、应用日志。','Pod 状态异常时，不把所有问题都归结为“重启一下”。',[
 ['查看 Deployment','kubectl get deployments -n learning','READY 对比就绪与期望副本数。','web'],['查看 Pod 详情与事件','kubectl describe pod web-7d9f -n learning','事件帮助识别调度或镜像拉取问题。','Events'],['查看 Pod 日志','kubectl logs web-7d9f -n learning','应用输出是排查证据的一部分。','ready']],
 'Pod 一直 Pending 时，优先看什么？',['describe 中的事件和调度信息','直接删集群','只查域名'],0,'教学对象名固定；真实 Pod 名会变化，应先 get 再使用返回的名称。','k8s');
lesson(5,'编写 Deployment YAML','用声明式配置描述期望状态。','Deployment 清单包含 apiVersion、kind、metadata、spec。replicas 是期望副本数；selector.matchLabels 必须匹配 Pod 模板的 labels。YAML 用空格缩进，不用 Tab。','用文件保存部署配置，便于审查、版本管理和重复执行。',[
 ['阅读练习清单','cat deployment.yaml','右侧「文件编辑器」可编辑清单；练习版仅支持提供的结构。','apps/v1'],['应用学习空间清单','kubectl apply -f deployment.yaml -n learning','apply 根据声明更新对象；本教学场景模拟一个 Deployment。','web'],['验证 Deployment 状态','kubectl get deployments -n learning','确认期望副本与模拟就绪数。','web']],
 'replicas: 2 表示什么？',['容器监听 2 号端口','期望运行 2 个副本','第 2 个命名空间'],1,'本模拟器只检查固定模板关键字段，不能代替真实 API 的校验、调度和准入策略。','k8s');
lesson(5,'Service 与集群访问','理解 Pod 地址会变化。','Service 使用标签选择器关联 Pod，并提供稳定访问入口。ClusterIP 通常只在集群内可用。port 是 Service 端口，targetPort 是后端容器的目标端口；Service 不会自动保证应用健康。','多个副本提供同一服务，用 Service 访问而不是硬编码某个 Pod IP。',[
 ['查看学习空间服务','kubectl get services -n learning','观察 ClusterIP 和服务端口。','80/TCP'],['查看 Service 详情','kubectl describe service web -n learning','关注 Selector、TargetPort 与 Endpoints。','app=web'],['查看后端 Pod 标签','kubectl get pods -n learning --show-labels','核对 Service 的选择器能匹配 Pod。','app=web']],
 'Service selector 的作用是什么？',['按标签匹配后端 Pod','设置主机密码','分配 SSH 密钥'],0,'从集群外访问还需要适当的入口配置；ClusterIP 不是公网地址。','k8s');
lesson(5,'扩容与滚动更新检查','修改后验证期望状态是否达成。','kubectl scale 修改副本数。rollout status 观察部署更新是否完成，rollout history 查看修订记录。手动 scale 可能被后续 apply 或 HPA 改写，应让配置文件与期望状态一致。','流量增长时增加副本，随后确认就绪情况，而不是只看到命令返回成功。',[
 ['将 web 扩为 3 个副本','kubectl scale deployment web --replicas=3 -n learning','模拟环境立即就绪，真实集群可能需要等待资源与探针。'],['查看副本数','kubectl get deployments -n learning','应看到 3/3 READY。','3/3'],['检查部署完成状态','kubectl rollout status deployment/web -n learning','真实 rollout status 会等待更新完成，可配置超时。','successfully']],
 'scale 返回成功能证明所有副本已就绪吗？',['能','不能，需要查询就绪状态','能证明公网可访问'],1,'本课演示扩容与更新检查，不模拟镜像升级和真实回滚；练熟后在测试集群做发布演练。','k8s');
lesson(5,'Pod 故障排查与复盘','把工具串成有顺序的排查方法。','先确认上下文与对象，再查状态、事件和日志，最后验证业务。Pending 常与调度有关；ImagePullBackOff 关注镜像地址、认证与网络；CrashLoopBackOff 关注进程退出原因、配置和探针。','制定自己的排查清单，把“猜测”转为可验证证据。',[
 ['查看 Pod 状态','kubectl get pods -n learning','先识别异常发生在哪个对象；本课基础样例为 Running。','Running'],['检查事件','kubectl describe pod web-7d9f -n learning','真实故障先保留错误事件与发生时间。','Events'],['检查应用日志','kubectl logs web-7d9f -n learning','完成后去综合实战练习 ImagePullBackOff 故障。','ready']],
 '遇到 ImagePullBackOff 首先应检查什么？',['镜像地址、凭据与拉取事件','先删所有节点','只看磁盘总容量'],0,'课程完成代表掌握基础操作路径；熟练运维还需要在真实测试环境反复演练发布、监控、回滚和恢复。','k8s');
globalThis.courses=courses;globalThis.stages=stages;globalThis.sources=sources;
// Database and end-to-end operations extend the same course sequence.
stages.splice(4,0,{name:'SQL 基础',tag:'读懂数据，再修改',weeks:'第 9–10 周',color:'#ec9170',goal:'掌握 SELECT、筛选、聚合、INSERT、UPDATE、DELETE 与事务。'},{name:'数据库运维',tag:'部署、巡检与恢复',weeks:'第 11–12 周',color:'#dcaf54',goal:'理解 MySQL 部署流程，检查连接、容量与慢查询，演练备份恢复。'});
stages[6].weeks='第 13 周';stages[7].weeks='第 14–15 周';
stages.push({name:'全流程实战',tag:'把知识连成业务流程',weeks:'第 16 周',color:'#39c5ac',goal:'走完环境准备、发布检查、数据库验证、业务验收与故障复盘。'});
for(const c of courses)if(c.stage>=4)c.stage+=2;
sources.sql=['MySQL 8.4 官方手册','https://dev.mysql.com/doc/refman/8.4/en/'];
lesson(4,'表、字段与第一条 SELECT','用只读查询认识业务数据。','数据库存放数据；表由行和列组成。SQL 用于查询和修改结构化数据。SELECT 指定要读取的列，FROM 指定表。学习样本 users 有 id、name、status 三列；SQL 面板和终端共享同一份模拟数据。','接手业务数据库，先从少量只读查询开始，理解字段含义。',[
 ['查询学习用户表','SELECT * FROM users;','* 代表所有列，仅适用于小样本和临时观察。','Alice'],['只查看编号与姓名','SELECT id, name FROM users;','明确列名比长期依赖 * 更清晰。','name'],['限制返回条数','SELECT * FROM users LIMIT 2;','大表查询应限制返回量并关注执行计划。','Bob']],
 'FROM users 表示什么？',['查询的数据表','要删除的账号','数据库端口'],0,'这是有限 SQL 教学模拟器，不连接真实数据库，不存放真实业务数据。','sql');
lesson(4,'WHERE、排序与 NULL','把业务条件准确转成查询条件。','WHERE 过滤行，ORDER BY 排序，LIMIT 控制返回数量。字符串通常用单引号。NULL 表示缺失或未知，通常用 IS NULL / IS NOT NULL 检查，不能简单用 = NULL。','只找启用的用户，避免拿到全量数据后再人工筛选。',[
 ['筛选启用用户','SELECT * FROM users WHERE status = \'active\';','WHERE 指定条件；本课支持等值过滤。','Alice'],['按编号降序显示','SELECT id, name FROM users ORDER BY id DESC;','DESC 降序，ASC 升序。','Carol'],['检查缺失状态','SELECT * FROM users WHERE status IS NULL;','本样本没有缺失值，返回 0 行也是有意义的结果。','0 行']],
 '检查空值应使用什么？',['= NULL','IS NULL','= "NULL"'],1,'真实查询需区分 NULL、空字符串和数字 0。','sql');
lesson(4,'聚合与分组','用数据回答巡检问题。','COUNT(*) 统计行数，GROUP BY 按指定列分组。WHERE 在分组前过滤；HAVING 在分组后过滤。真实业务还会使用 SUM、AVG、JOIN，本课先把单表统计练熟。','统计账号总数和各状态数量，检查业务规模和异常比例。',[
 ['统计全部用户','SELECT COUNT(*) FROM users;','COUNT(*) 包含整行，不受某一列是否 NULL 影响。','3'],['统计启用用户','SELECT COUNT(*) FROM users WHERE status = \'active\';','先筛选，再聚合。','2'],['按状态统计','SELECT status, COUNT(*) FROM users GROUP BY status;','每种状态得到一行汇总结果。','inactive']],
 'GROUP BY 的用途是什么？',['按字段分组聚合','切换数据库用户','创建网络路由'],0,'学习重点先放在正确性；数据量大后还需观察索引与执行计划。','sql');
lesson(4,'INSERT 与数据验证','插入之后，再查询确认。','INSERT INTO 表名 (列名) VALUES (值) 插入记录。明确列名，避免字段顺序变化造成误写。真实业务需关注主键、唯一约束、类型和默认值。','在测试库添加一条记录，验证保存结果。',[
 ['检查目标编号是否已有记录','SELECT * FROM users WHERE id = 4;','先检查样本，真实系统仍需唯一约束保证并发安全。','0 行'],['插入测试记录','INSERT INTO users (id, name, status) VALUES (4, \'Dave\', \'active\');','这是写操作，本课只修改当前模拟数据。','1 行'],['验证新记录','SELECT * FROM users WHERE id = 4;','按主键精确读回。','Dave']],
 '写 INSERT 时为何建议明确列名？',['方便对齐列和值','让数据自动加密','让数据库自动备份'],0,'练习数据随重置恢复；真实写入需遵守变更授权和审计流程。','sql');
lesson(4,'UPDATE 与精准修改','先用相同条件 SELECT，再 UPDATE。','UPDATE 修改已有行，WHERE 限定范围。遗漏 WHERE 可能更新整张表。正确流程是检查范围、开启适当事务、执行修改、核对受影响行数、验证结果。','停用一个测试账号，避免误改所有用户。',[
 ['确认要修改的用户','SELECT * FROM users WHERE id = 2;','本样本 Bob 当前为 inactive。','Bob'],['把编号 2 改为 active','UPDATE users SET status = \'active\' WHERE id = 2;','教学模拟器强制要求 WHERE。','1 行'],['验证修改','SELECT * FROM users WHERE id = 2;','确认姓名没变且状态为 active。','active']],
 'UPDATE 之前最该确认什么？',['WHERE 匹配的记录范围','网页颜色','CPU 型号'],0,'真实数据库批量更新还需关注锁等待、事务大小和回滚成本。','sql');
lesson(4,'DELETE 与事务回滚','学会撤销未提交的数据修改。','DELETE 删除行；事务把多条操作组成一个单元。START TRANSACTION 开始，COMMIT 提交，ROLLBACK 撤销未提交修改。MySQL 中并非所有语句都能靠 ROLLBACK 撤销，DDL 常涉及隐式提交。','测试删除后恢复记录，理解事务边界。',[
 ['开启事务','START TRANSACTION;','此时保存模拟数据快照。','started'],['删除编号 3 的测试记录','DELETE FROM users WHERE id = 3;','只删除精确匹配行，可先 SELECT 查看。','1 行'],['回滚未提交修改','ROLLBACK;','恢复 Carol；可以再 SELECT * FROM users 验证。','rolled back']],
 'ROLLBACK 能撤销已经 COMMIT 的修改吗？',['通常不能','任何时候都能','只要重启就能'],0,'真实数据库还需确认存储引擎、autocommit 与事务隔离级别；备份不能被事务替代。','sql');
lesson(5,'MySQL 部署流程与预检查','从需求到可维护的数据库服务。','数据库部署顺序：确认版本和资源 → 准备磁盘与用户 → 使用官方安装方式 → 初始化 → 启动 → 配置最小权限和网络 → 验证 → 设置备份与监控。发行版、软件源和 MySQL/MariaDB 包名存在差异，不应盲目复制安装命令。','为新业务准备 MySQL：明确环境、存储位置、恢复目标和访问范围。',[
 ['确认 Linux 环境','cat /etc/os-release','先判断发行版，再选官方对应安装步骤。','Ubuntu'],['检查数据盘空间','df -h','数据库需要预留数据、索引、日志和临时空间。','42%'],['查看 MySQL 客户端版本','mysql --version','本课使用模拟 MySQL 8.4 示例；客户端存在不等于服务已部署。','8.4']],
 '安装数据库之前先做什么？',['确认环境、版本、资源和恢复要求','直接放开所有公网访问','先关闭日志'],0,'这里演练部署检查流程，不实际安装软件。官方资料中提供不同平台的安装说明。','sql');
lesson(5,'数据库服务与连接巡检','进程活动、连接可用和业务可用分别验证。','systemctl 检查服务进程，mysqladmin ping 检查服务响应，SQL 查询验证当前会话。真实 mysqladmin ping 的含义要结合退出状态和错误信息分析；验证认证还应执行实际查询。','业务连不上数据库时，从服务、端口、身份和权限逐层检查。',[
 ['查看数据库服务','systemctl status mysql','本课以 mysql.service 为教学名称，不同发行版可能不同。','active'],['检查数据库响应','mysqladmin ping','教学场景返回 mysqld is alive。','alive'],['查询数据库版本','SELECT VERSION();','实际会话查询成功，才是本次连接可用的证据。','8.4']],
 '数据库服务 active 能证明业务查询一定正常吗？',['能','不能，还要验证认证、权限和查询','能证明备份成功'],1,'真实环境使用受保护的凭据配置；不要把密码写在命令行参数里。','sql');
lesson(5,'容量、连接与慢查询','把数据库巡检变成可记录指标。','巡检关注容量、连接数、错误、慢查询、锁等待、复制延迟和备份结果。Threads_connected 是当前连接数；慢查询记录帮助发现问题查询，但启用方式与权限需评估。指标应有基线和趋势。','数据库响应变慢时，先看当前会话和关键状态，避免直接重启。',[
 ['查看当前连接计数','SHOW STATUS LIKE \'Threads_connected\';','教学样本为 5；应结合 max_connections 和历史趋势。','5'],['查看进程列表','SHOW PROCESSLIST;','观察连接状态和耗时；真实输出取决于权限。','Sleep'],['检查慢查询日志开关','SHOW VARIABLES LIKE \'slow_query_log\';','这里只读检查，不自动修改配置。','ON']],
 '慢查询出现后合理做法是什么？',['结合执行计划、索引、数据量和锁等待分析','直接清空业务表','关闭所有日志'],0,'本课样本不代表真实压力；不要用固定数字替代业务基线。','sql');
lesson(5,'执行计划与索引意识','先分析，再优化。','EXPLAIN 展示查询执行计划。关注访问方式、可能的索引、实际选择的索引和估算行数。索引可能改善读取，但也占空间并增加写入成本，不能“每列都加”。','某个按编号查询变慢，先确认是否能使用主键。',[
 ['查看精确查询结果','SELECT * FROM users WHERE id = 1;','先确认查询意图和数据正确性。','Alice'],['查看教学执行计划','EXPLAIN SELECT * FROM users WHERE id = 1;','本样本使用 PRIMARY，type 为 const。','PRIMARY'],['观察全表查询计划','EXPLAIN SELECT * FROM users;','示例 type 为 ALL；小表全扫未必有问题。','ALL']],
 'EXPLAIN 主要用于什么？',['观察查询执行计划','自动备份','删除重复用户'],0,'示例计划为固定教学数据，不是 MySQL 优化器真实结果。','sql');
lesson(5,'数据库备份与恢复演练','恢复验证才让备份有价值。','MySQL 备份可使用逻辑导出或物理备份，方案取决于规模、引擎和恢复要求。mysqldump --single-transaction 常用于 InnoDB 一致性逻辑备份，但不解决全部 DDL 和非事务表风险。恢复应先在隔离测试库演练。','发布前对学习库做备份，模拟误操作，并从备份恢复验证。',[
 ['生成学习库逻辑备份','mysqldump --single-transaction learning > learning.sql','本网站生成的是教学备份文本，不是真实 MySQL 导出。'],['检查备份文件','cat learning.sql','确认内容存在；真实备份还应检查命令退出状态和完整性。','INSERT'],['恢复到隔离演练数据','mysql restore_lab < learning.sql','只恢复当前模拟的隔离表，不覆盖当前学习表。','3 rows']],
 '生产库恢复应首先在哪里演练？',['隔离测试环境','直接覆盖生产库','任何公网数据库'],0,'生产恢复需明确 RPO/RTO、停机窗口、备份验证、增量日志和回退方案；不能只靠文件存在。','sql');
lesson(8,'部署前检查清单','把环境、应用、数据库和回退方案一起确认。','一次发布至少确认版本来源、环境身份、磁盘、配置、依赖、权限、数据库兼容性、备份、监控与回退路径。发布应有可复现步骤和明确验收标准。','一个连接数据库的 Web 服务准备上线，你负责上线前检查。',[
 ['确认系统与环境','uname -a','记录目标环境，避免操作错主机。','Linux'],['检查资源余量','df -h','预留应用、数据、日志和回退版本空间。','42%'],['确认数据库查询可用','SELECT COUNT(*) FROM users;','本例检查小样本；真实环境要采用经过批准的只读健康查询。','3']],
 '发布前为什么要准备回退方案？',['失败时能按已验证路径恢复','为了避免测试','方便删数据库'],0,'数据库结构变更需单独评估前后版本兼容性，应用回退不等于数据回退。','sql');
lesson(8,'发布验收与日常巡检','从“进程在”到“业务能用”。','验收按层次进行：服务进程 → 端口 → HTTP → 数据依赖 → 核心业务路径。日常巡检记录时间、结果、证据与处理，不只勾选“已检查”。','发布完成后验证服务，并形成每日可重复的巡检步骤。',[
 ['确认 Web 服务运行','systemctl is-active nginx','进程层的基础检查。','active'],['验证 HTTP 请求','curl -I http://localhost','确认本次请求返回 200。','200 OK'],['验证业务数据读取','SELECT * FROM users WHERE id = 1;','真实验收应包含批准的核心业务链路与错误率观察。','Alice']],
 '一个服务验收应该包含什么？',['只看进程名','服务、请求、依赖和业务路径','只看安装日志'],1,'本课程用模拟证据练流程；真实验收还要监控指标和持续观察窗口。','system');
lesson(8,'故障恢复、回滚与复盘','先恢复业务，再把原因与预防写清楚。','故障流程：确认影响 → 留存证据 → 定位范围 → 选择已验证恢复动作 → 验证 → 复盘。恢复与根因修复可能不是同一步；回滚前确认应用版本、数据和配置兼容。','完成学习后，用综合实战练习服务不可用、SQL 误改和 K8s 镜像故障。',[
 ['查看服务日志作为证据','journalctl -u nginx -n 20 --no-pager','记录时间、报错和上下文。','upstream'],['检查业务健康接口','curl http://localhost/health','把恢复判断建立在可见请求结果上。','"status":"ok"'],['写下本次演练结果','echo verified > incident.txt','真实复盘写清影响、时间线、根因、恢复和后续措施。']],
 '故障恢复后下一步应是什么？',['不再记录','验证并复盘，跟进防复发措施','立刻删除日志'],1,'建议完成后在个人测试虚拟机或测试集群复做同样步骤，再逐步承担真实业务。','system');
courses.sort((a,b)=>a.stage-b.stage);courses.forEach((c,i)=>c.id=i);

lesson(3,'部署一个 Web 服务','从软件来源到服务响应。','本课以 Debian/Ubuntu 的 apt 为例。先检查软件来源和候选版本，再在经过授权的测试环境安装，随后检查服务和请求。其他发行版需要使用相应包管理器，生产安装必须遵循团队变更流程。','准备一个测试 Nginx 服务，练习来源检查、安装和验证顺序。',[
 ['检查 nginx 软件来源','apt-cache policy nginx','候选版本和来源需要符合你的环境要求。','Candidate'],['模拟安装 nginx','sudo apt install nginx','此模拟命令不会安装真实软件；真实命令需要管理员权限。','模拟安装完成'],['确认服务状态','systemctl status nginx','真实安装后还需检查服务是否自动启动，不要假设行为一致。','active'],['验证 Web 响应','curl -I http://localhost','进程检查之外，再做 HTTP 检查。','200 OK']],
 '安装软件之前为什么要检查软件源？',['确认来源和候选版本','让服务器自动备份','设置数据库用户'],0,'真实部署还需配置、防火墙与访问入口、证书、日志轮转、监控和回退版本。本课先练最小部署链路。','system');
lesson(5,'安装与启动 MySQL 测试服务','练习安装之前、之后分别检查。','本课模拟已配置 MySQL 对应官方软件源的 Ubuntu/Debian 测试环境，不代表系统默认源会提供相同版本。真实部署需要按官方版本和平台说明准备磁盘、初始化、账户安全、访问限制和备份。','建立用于学习 SQL 的测试数据库服务，先确保安装来源和启动状态。',[
 ['检查 MySQL 候选包','apt-cache policy mysql-server','候选版本取决于配置的软件源；教学样本为 8.4。','8.4'],['模拟安装数据库服务','sudo apt install mysql-server','只改变教学状态，不下载或安装软件。','模拟安装完成'],['模拟启动服务','systemctl start mysql','真实环境服务名可能是 mysql 或 mysqld，并需相应权限。','已启动'],['确认数据库响应','mysqladmin ping','随后应执行实际会话查询，再配置最小权限业务账户。','alive']],
 '安装 MySQL 完成后，还需要做什么？',['不再验证','启动检查、认证与权限、网络限制、备份监控','把 root 密码发给所有人'],1,'此课不自动创建生产账户或开放端口；版本、存储引擎、时区、字符集、连接限额和恢复目标都需按业务确定。','sql');
const backupLesson=courses.find(c=>c.title==='数据库备份与恢复演练');backupLesson.steps.push({task:'读取隔离恢复后的数据',cmd:'SELECT * FROM restore_lab.users;',explain:'检查恢复后的记录内容，而不只相信恢复命令提示。',output:'Alice'});
courses.sort((a,b)=>a.stage-b.stage);courses.forEach((c,i)=>c.id=i);

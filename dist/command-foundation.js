/* Original scaffolding lessons; task IDs remain independent of the old work route. */
const commandBasics=[
 ['identity','whoami：我用哪个账号？','whoami','student','没有参数时只输入命令名。whoami 输出当前有效用户名；不是主机名。','接手环境，先确认账号，避免误以为自己有管理员权限。'],
 ['location','pwd：我现在在哪里？','pwd','/home/student','pwd 显示当前目录的绝对路径。输出以 / 开头，它是结果，不是下一条命令。','先找到当前位置，再决定用相对路径还是绝对路径。'],
 ['list','ls：这里有什么文件？','ls','notes.txt','ls 列出当前位置的文件和目录名称。此处无参数，不显示详细权限信息。','先列出名字，不急着打开、移动或删除文件。'],
 ['options','ls -l：短横线后是什么？','ls -l','student','空格分开命令和选项。-l 是短选项：小写字母 l，要求详细列表；它不是数字 1。选项通常改变行为；后面的文件或目录是操作对象。不是所有命令都有相同参数。','读到 -rw-r--r-- 等权限信息时先知道这是列表结果，权限将在后面的基础课解释。'],
 ['read','cat：先读一个小文件','cat notes.txt','Linux','cat 后的 notes.txt 是文件路径，不是选项。这里文件很短，可以直接读；大日志更适合 head、tail 或分页查看。','先掌握读取，不从多条管道开始。'],
 ['absolute','同一个文件，两种路径','cat /home/student/notes.txt','Linux','/home/student/notes.txt 是绝对路径，从 / 根目录开始。当前在 /home/student 时，它与 notes.txt 指向同一文件。换目录后相对路径的含义会变。','验证允许指向同一文件的等价路径，不要求逐字照抄。'],
 ['directory','cd：进入目录后再确认','cd /etc','','cd 的对象是目录。cd /etc 改变当前位置，成功时通常没有输出；再用 pwd 才能读回位置。没有输出不等于失败。','只改变教学环境当前位置，不操作你的电脑。'],
 ['head','head -n 2：先看开头两行','head -n 2 /opt/order/logs/app.log','r-100','head 取文件开头。-n 是选项，紧跟的 2 是这个选项的数值，最后是文件路径。命令参数不是全部都以 - 开头。','只取两行让结果保持可读，先认识日志每行的组成。'],
 ['tail','tail -n 2：再看最近两行','tail -n 2 /opt/order/logs/app.log','r-103','tail 取文件末尾。-n 2 表示最后两行。本网站读取固定快照；真实 tail -f 会持续跟踪，不能混为一谈。','实际排障要结合时间窗口，最后一行不一定就是根因。'],
 ['filter','grep：只找 ERROR','grep ERROR /opt/order/logs/app.log','r-101','grep 后的 ERROR 是搜索模式，最后是文件。默认区分大小写：ERROR 与 error 不同。这里模式不含特殊字符；正则表达式将在后续解释。','先单独筛选，不增加统计。'],
 ['literal','grep -F：明确按字面搜索','grep -F ERROR /opt/order/logs/app.log','r-103','-F 是大写 F：把模式按原样文本理解，不解释为正则。大小写不同的选项可能完全不同；-i 才表示忽略模式大小写。','固定请求标识常适合字面匹配。'],
 ['count','wc -l：单独数行','wc -l /opt/order/logs/app.log','4','wc 用于计数。-l 是小写 L，表示行数；-5 不表示五行，-1 也不是 -l。真正 wc -l 计的是换行符数；教学日志每行都以换行结束。','先统计整个文件，下一课才统计筛选结果。'],
 ['first-pipe','第一次管道：只连接两步','grep -F ERROR /opt/order/logs/app.log | wc -l','2','| 把左边的文本输出交给右边。左边先找 ERROR，右边数筛选结果的行数。wc 这里不写文件名，因为它从管道接收内容。','你已分别掌握筛选和计数，现在才把它们组合。']
];
const existingWork=hubCurriculum.opswork.slice();hubCurriculum.opswork=[];
commandBasics.forEach(([id,title,cmd,expected,explain,scene],i)=>{addWork('cmd-start-'+id,'常用命令起步',title,scene,[[cmd,explain,'在教学环境练习：'+cmd.split(' ')[0],expected]],i===3?'ls -l 中的 -l 是什么？':'执行前应该先明确什么？',i===3?'要求详细列表的选项':'命令做什么、参数含义与操作对象',i===3?['数字 1','目录名称']:['只看命令长不长','只看是否有短横线'],explain,'shell');hubCurriculum.opswork.at(-1).diagram='';});
hubCurriculum.opswork.push(...existingWork);
hubSubjects.ops.description='先认识常用命令和参数，再用日志、管道、SQL、部署与排障连接工作全流程。';

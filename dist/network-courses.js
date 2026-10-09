globalThis.legacyCourseTitles=courses.map(c=>c.title);
const firstNetwork=courses.findIndex(c=>c.title==='网络地址与路由'),originalLength=courses.length;
sources.network=['IETF：TCP、DNS 与 HTTP 标准','https://www.rfc-editor.org/rfc/rfc9293.html'];
function networkLesson(demo,...args){lesson(...args);courses.at(-1).networkDemo=demo;}
networkLesson('net-layers',1,'计网入门：地址、端口与分层','把 MAC、IP、端口放在各自的位置。','网络分层把问题拆开：链路层在同一条链路上传递帧，IPv4 常通过 ARP 找到下一跳的 MAC；网络层用 IP 和路由跨网络传输；传输层的 TCP/UDP 用端口区分通信端点；应用层定义 HTTP、DNS 等消息规则。IP 主要解决去哪台主机，端口帮助操作系统找到对应通信端点。','网站连不上时，分清地址错、路由错、端口没监听还是应用返回错误。',[
 ['查看本机 IP 与 MAC','ip addr','inet 后是 IPv4，link/ether 后是链路地址。','link/ether'],['查看跨网段出口','ip route','default via 代表默认下一跳，不代表所有流量都一定走它。','default via'],['查看本机 TCP 监听端点','ss -lnt','监听地址加端口构成服务入口；0.0.0.0 通常表示所有本机 IPv4 地址。',':80']],
 'IP 地址和端口主要分别解决什么问题？',['主机寻址与通信端点区分','两者都只是文件名','IP 代表用户名，端口代表密码'],0,'这是 TCP/IP 的简化四层学习模型，不是严格的 OSI 七层一一映射。','network');
networkLesson('net-subnet',1,'IPv4、子网掩码与网关','看懂 10.0.0.10/24。','IPv4 地址是 32 位，常写成四段十进制数。/24 表示前 24 位是网络前缀，对应 255.255.255.0。主机按掩码比较本机与目标的网络部分；同一子网通常直接寻找目标的链路地址，不同子网通常交给合适路由的下一跳。真实决策以路由表最长前缀匹配为准。','判断请求是否需要经过网关，不把“能 ping 本机”当成“网络都正常”。',[
 ['读出本机地址前缀','ip addr','样本为 10.0.0.10/24，属于 10.0.0.0/24。','10.0.0.10/24'],['读出本机路由','ip route','同时看直连网段和默认出口。','10.0.0.0/24'],['有限次数探测网关','ping -c 3 10.0.0.1','ICMP 探测只是一种网络证据，不验证应用端口。','0% packet loss']],
 '/24 对应什么 IPv4 子网掩码？',['255.255.255.0','255.0.0.0','255.255.0.0'],0,'可视化只演示 /8–/30 的普通 IPv4 子网；/31 和 /32 有不同使用场景。','network');
networkLesson('net-dns',1,'DNS：域名怎样变成 IP','域名、解析器、缓存和 A 记录。','DNS 是分布式域名系统。A 记录对应 IPv4，AAAA 对应 IPv6。客户端通常请求递归解析器；缓存未命中时，解析器可能依次查询根、顶级域和权威服务器。缓存减少重复查询，但过期前可能仍得到旧结果。getent 使用系统名称服务配置，结果不一定仅来自 DNS。','IP 能访问而域名不能访问时，先检查解析结果和使用的解析器。',[
 ['查看教学解析器配置','cat /etc/resolv.conf','样本配置中的 nameserver 是 DNS 解析器地址。','10.0.0.53'],['获取 A 记录的简短结果','dig web.lab.test A +short','域名为保留测试域中的模拟对象，不会进行真实查询。','10.0.0.20'],['验证系统名称服务结果','getent hosts web.lab.test','与应用使用的系统解析路径更接近，但仍需核对应用自身行为。','10.0.0.20']],
 'dig 返回正确 IP，能证明网站业务一定正常吗？',['能','不能，还需检查连接与应用响应','能证明数据库备份成功'],1,'真实 resolv.conf 可能指向本机 stub，或由系统自动管理；不要直接覆盖配置。','network');
networkLesson('net-tcp',1,'TCP、UDP 与三次握手','分清连通、监听和已建立连接。','TCP 提供可靠有序的字节流，建立连接时通常交换 SYN、SYN+ACK、ACK。UDP 传递数据报，不提供 TCP 这种连接握手和可靠传输机制，应用可自行实现额外机制。端口是否监听与连接是否建立是两个问题；拒绝连接、超时也代表不同证据。','curl 无法连接时，先看是否监听、是否建连，再判断网络策略或服务。',[
 ['查看监听 TCP 端口','ss -lnt','LISTEN 表示等待连接，不代表当前一定有客户端会话。','LISTEN'],['查看教学已建立连接','ss -nt','-n 使用数字地址，-t 只查看 TCP。','ESTAB'],['请求一次 HTTP 响应','curl -I http://localhost','TCP 之上的应用请求；-I 通常发送 HEAD，只获取响应头。','200 OK']],
 '三次握手的常见报文顺序是什么？',['SYN → SYN+ACK → ACK','HTTP → DNS → SSH','ACK → FIN → UDP'],0,'图示忽略重传、窗口协商和同时打开；UDP 不握手不等于所有 UDP 应用都没有连接语义。','network');
networkLesson('net-http',1,'HTTP、HTTPS 与请求链路','解析、连接、加密和应用响应是不同步骤。','常见 HTTPS over TCP 链路：域名解析 → TCP 建连 → TLS 握手和证书校验 → HTTP 请求/响应。HTTP 200 表示本次响应成功；404 是目标资源未找到；500 表示服务端错误。HTTPS 为传输提供安全保护，但不会自动修复业务错误。HTTP/3 使用 QUIC，链路与本图不同。','收到 404 时不要直接怀疑网关：已经得到 HTTP 响应，下一步应检查 URL、路由和应用。',[
 ['只请求响应头','curl -I http://localhost','-I 通常发送 HEAD。检查状态码和响应头，不读取完整响应体。','200 OK'],['观察请求连接过程','curl -v http://localhost','-v 输出详细交互信息，真实输出可能包含敏感头部。','Connected'],['给连接阶段设置超时','curl --connect-timeout 3 -I http://localhost','3 表示连接阶段最多允许的秒数，不是所有传输的总超时。','200 OK']],
 '已经收到 HTTP 404，说明什么？',['从未建立任何网络通信','得到了应用层响应，应继续检查资源和业务路由','DNS 必然故障'],1,'真实 HTTPS 要校验域名和证书，不要把 -k 关闭校验作为默认排障方案。','network');
networkLesson('net-layers',1,'网络排查：按层收集证据','把计网知识和命令连起来。','一个可复用顺序是：本机接口 → 目标路由 → 名称解析 → 监听与连接 → 应用请求。按现象调整顺序，并同时关注访问路径上的防火墙、代理和负载均衡。每一步只证明它检查到的范围，不把单个成功结果当成全链路正常。','域名网站不可访问，从地址、路由和 DNS 开始，逐层缩小故障范围。',[
 ['确认接口已启动且地址正确','ip addr','先排除本机接口和地址问题。','10.0.0.10'],['检查到目标的路由决策','ip route get 10.0.0.20','只读查看内核为该目标选择的路由，不会发起业务请求。','dev eth0'],['查看域名解析结果','dig web.lab.test A +short','确认请求指向期望主机。','10.0.0.20'],['检查服务端口是否监听','ss -lnt','这检查当前模拟主机，不等于远端服务器端口已开放。',':80'],['验证应用响应','curl -I http://localhost','本机应用检查成功后，真实排查还应从实际客户端验证远端路径。','200 OK']],
 '为什么需要按层检查，而不能只运行 ping？',['ping 不能验证 DNS、端口和业务全部环节','ping 能替代所有业务验收','分层只是为了增加命令数量'],0,'此课在同一模拟环境拼接排查证据；真实操作应标明命令在哪台机器执行。','network');
const newNetworkCourses=courses.splice(originalLength);courses.splice(firstNetwork,0,...newNetworkCourses);courses.forEach((c,i)=>c.id=i);
stages[1].name='Linux 与计网基础';stages[1].goal='读懂地址、子网、DNS、TCP 与 HTTP，结合日志、资源和网络证据逐层排查。';
const weeks=['第 1–2 周','第 3–5 周','第 6–7 周','第 8–9 周','第 10–11 周','第 12–13 周','第 14 周','第 15–16 周','第 17 周'];stages.forEach((s,i)=>s.weeks=weeks[i]);

for(const c of courses){if(c.title==='网络地址与路由')c.networkDemo='net-subnet';if(c.title==='端口与 HTTP 验证')c.networkDemo='net-http';}

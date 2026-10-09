# 知行学习室

从零认识终端、账户、目录与参数，再学习常用 Linux 命令、网络追踪、防火墙、服务、数据库、Docker、Kubernetes、发布验收与排障。并提供 Python、日语、Agent 与文书课堂。

- 51 节基础闯关，135 节运维工作课程（含新增 81 节 Linux 查询、排障与管理课）。
- 新手 15 节、网络 27 节、日语 78 节、Agent 24 节、文书 12 节、Python 16 节。
- 讲解翻页、已收录术语与命令片段解释、输入补全、分步操作、小测、作答前提醒与答对后的迁移示例。
- 命令课程是限定范围的网页模拟；基础文件与管道在模拟器中计算，基础设施查询使用明确标注的虚构快照。管理动作课通过场景判断，不执行真实系统改动。
- Python 在浏览器 Worker 的 Pyodide 隔离环境真实运行，任务检查输入、结果与代码行为。
- 同一浏览器保存进度和阅读页码；Supabase 配置后使用 GitHub 登录、版本检查的云端进度与私有笔记。

## 开始使用

网站：https://huangchunyu7-ops.github.io/

新手先从“零基础入门”认识终端、账号、组、路径和设备，再进入 Linux 基础与工作课程。课程列表按领域筛选并翻页；讲解最后一页进入练习，完成每一步后手动确认，小测通过后再进下一课。

新增加的 Linux 课包括系统身份与帮助、文件与权限、磁盘与 inode、进程与 CPU/内存/I/O、地址与选路、DNS、TCP/TLS、traceroute/tracepath/mtr/tcpdump、防火墙、systemd/日志/定时任务、包管理、传输与备份、编辑器与变更回退。不宣称穷尽每个 Linux 发行版的全部工具或版本；继续按实际业务需求扩展。

## 本地预览

这是静态网站，发布目录是 dist。使用能正确提供 .mjs / .wasm MIME 类型的 HTTP 服务打开 dist，不能通过 file:// 验证 Python Worker。

## 发布与账户配置

见 [逐步配置教程](deployment/SETUP.md)。[数据库与隔离策略](deployment/supabase.sql) 需在自己的 Supabase 项目运行一次。

前端只包含 Project URL 和 Publishable key；GitHub OAuth Client Secret 仅存在 Supabase 后台。不要把任何管理密钥、用户数据或 OAuth 令牌提交到仓库。课程和代码公开，个人学习进度与笔记由 Supabase 身份和 RLS 隔离。

## 资料与许可证

讲解、场景、题目与教学快照为项目原创或按来源改写。课程末尾标注参考项目与文档。项目代码采用 MIT；第三方内容按各自许可使用，不由 MIT 覆盖。

- tldr-pages：CC BY 4.0，署名与许可在 dist/data/tldr。
- 日语参考数据与 EPUB：各自出处及许可在对应目录，保留原有 NOTICE。
- Pyodide：dist/vendor/pyodide/LICENSE 与 NOTICE.md。
- Supabase JS 2.117.3：dist/vendor/supabase-NOTICE.txt、SUPABASE-LICENSE 与 supabase-legal。
- 教学主题参考 GNU、systemd、firewalld、Netfilter、Docker、Kubernetes、Python 官方文档，以及 DevOps Exercises 等项目；引用不表示这些项目为本网站背书。

## 验证

DOM 回归覆盖全部课程门槛、错误输入、显式确认、改答案后的失效、本机保存，以及管道/SQL/EPUB 处理。Playwright 验证桌面与手机翻页、阅读恢复、题目反馈和 Python 运行。账号模拟集成验证版本冲突、失败保留与笔记转义；真实 OAuth 和跨账户隔离应按配置教程完成验收。


手机布局参考：Ionic Framework（https://github.com/ionic-team/ionic-framework）和 Konsta UI（https://github.com/konstaui/konsta）的底部导航、紧凑工具栏及安全区处理模式。本项目 mobile-ui.js / mobile-ui.css 为原创实现，未复制第三方组件代码。

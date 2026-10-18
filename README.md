# 知行学习室

从零认识终端、账户、目录与参数，再学习常用 Linux 命令、网络追踪、防火墙、服务、数据库、Docker、Kubernetes、发布验收与排障。并提供 Python、日语、Agent 与文书课堂。

- 51 节基础闯关，160 节运维工作课程（含 81 节 Linux 查询、排障与管理课，以及 25 节新增场景课）。
- 新手 15 节、网络 27 节、日语 78 节、Agent 24 节、文书 12 节、Python 16 节。
- 讲解翻页、已收录术语与命令片段解释、输入补全、分步操作、小测、作答前提醒与答对后的迁移示例。
- 命令课程是限定范围的网页模拟；基础文件与管道在模拟器中计算，基础设施查询使用明确标注的虚构快照。管理动作课通过场景判断，不执行真实系统改动。
- Python 在浏览器 Worker 的 Pyodide 隔离环境真实运行，任务检查输入、结果与代码行为。
- 同一浏览器保存进度和阅读页码；Supabase 配置后使用 GitHub 登录、版本检查的云端进度与私有笔记。

## 开始使用

### 运维学习路线

按 11 个阶段组织：练习环境 → 常用命令 → 系统与存储 → 网络与防火墙 → 服务与日志 → 数据库 → Docker → Kubernetes → Shell/Ansible → 监控与访问管理 → 发布验收。

先从环境与单条命令入门，再学组合管道。课程列表按阶段筛选并分页，可搜索命令与问题。选课开放，每课的阅读、练习确认和小测仍保留门槛；“下一课”按推荐阶段顺序推进。原课程 ID 和已有学习记录保留。当前阶段以 `learning-ops-route-v1` 保存，并随已配置的账户快照同步。

新增 25 节原创场景课，包含 169 页讲解、术语拆解、两步证据判断与独立迁移小测。参考用户提供的四个 B 站合集的公开分集目录，在对应课程末尾标注关联分集、作者和官方文档。没有逐段观看视频，也没有复制其字幕、课件或媒体文件。目录所用旧版本与新练习环境明确区分，详见 [运维参考与验证记录](OPERATIONS-REFERENCES.md)。

### 独立日语学习区

从日语入口进入七个模块：词书、分级阅读、五十音与书写、分级测试、情景会话、系统课程、学习工作台。课程采用独立的分页、练习与进度，不再套用运维命令闯关流程。

- 84 个原创中文释义的精选词，覆盖 N5–N1 教学分级；78 节课程、740 页讲解；5 篇原创短文、4 个原创会话场景。不是完整 JLPT 词表，也不是官方考试题库。
- 翻面后反馈记忆情况，支持暂停、继续、到期复习、收藏、个人词条笔记、错题回顾。基础术语在相关课程中补充解释。
- 46 个基本假名；12 个来自 KanjiVG 的笔顺图，附手写练习板。录音跟读可本机回放、下载，不自动评判发音。
- 44 段公开授权真人录音，逐文件保留作者、来源、许可及转码说明；未覆盖的内容明确使用设备合成语音，取决于浏览器是否安装日语语音。
- 工作台支持个人 CSV、JSON、带音频 ZIP 的导入和模板下载。导入词书与音频只保存在本浏览器 IndexedDB，按当前账户隔离，不公开、不随进度上传；换设备需重新导入文件。
- `learning-japanese-v1` 保存学习状态；配置 Supabase 后随已有学习快照同步。个人录音与导入文件仍只留在本机。清理浏览器数据会移除本机文件，请保留原始备份。

功能组织参考 MOJi 的公开产品介绍，没有复制其付费词条、课程或录音。已有 OpenJLPT 数据用于扩展检索；KanjiVG 笔顺和 Wikimedia Commons / Lingua Libre 录音直接融合进学习页面，许可与致谢见 [日语资源说明](JAPANESE-SOURCES.md)。

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


2026-10-10 手机阅读改版：统一 SVG 图标、贴底导航、安全区、手机字体与点击区域；书架每页显示 6 本。内置可直接阅读的 EPUB 增至 18 本，其中新增中文文学 5 本、英文幻想 4 本、青空文库日文幻想/短篇 3 本。出处见 dist/books/NOTICE.md；外部代码许可不替代正文许可。

B站项目线索： https://www.bilibili.com/video/BV1b4421A7ns/ （对应 https://github.com/ShqWW/bilinovel-download ）；轻阅读 https://github.com/toiilf/qingread ，其项目说明链接 B站教程。审查发现它们提供下载/书源/阅读器能力，未确认其现代轻小说正文可公开转载，本项目未调用未获授权的小说抓取接口。


2026-10-18 界面更新：按 [hhikr/endfield-ui-skill](https://github.com/hhikr/endfield-ui-skill) 改造首页、课程、书房、账户、排障与可视化页面。采用浅纸底、墨色文字、单一亮黄、切角操作按钮与编号列表；新增可记忆的深浅色切换。保留课程 ID、完成条件、本机进度及账户同步逻辑。Saira 与 Noto Sans SC 的子集字体随站点托管，OFL 许可见 `dist/vendor/fonts/`。设计适配说明见 `deployment/ENDfield-DESIGN.md`，上游来源见 `dist/vendor/endfield/NOTICE.md`。

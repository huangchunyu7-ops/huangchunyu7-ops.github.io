# 运维课程参考与验证

## 用户提供的视频

作者均为 **Linux运维工程师-小程**。通过 B 站公开接口 `https://api.bilibili.com/x/web-interface/view?bvid=...` 获取视频标题、作者与分集目录，共 197 个分集。仅核对公开元数据，没有逐段观看，没有登录获取配套课件；不将标题中的宣传范围等同于已验证教学内容。

| 合集 | 分集数 | 用于课堂的主题 |
| --- | ---: | --- |
| [Linux 基础](https://www.bilibili.com/video/BV1sHwLz3ED1/) | 100 | 环境、命令、权限、服务、网络、Shell、Ansible、NFS、监控与堡垒机 |
| [MySQL](https://www.bilibili.com/video/BV1wHpt6GEE2/) | 31 | 对象、安装背景、账号、类型与表结构 |
| [Docker](https://www.bilibili.com/video/BV1fopg6WEVj/) | 35 | 镜像与容器、状态、日志、存储、网络 |
| [Kubernetes](https://www.bilibili.com/video/BV1pmp96JEQ3/) | 31 | 架构、搭建流程、运行时、Pod、Deployment、Service |

课堂正文、示例快照与练习为本站原创。索引分析、恢复演练、Compose 就绪检查与综合发布验收是本站补充内容，不声称已由相应分集完整讲述。课程末尾链接带 `?p=` 的具体基础分集，显示核对过的分集标题。

## 技术核对来源

- [CentOS Linux 生命周期](https://www.centos.org/centos-linux/)：CentOS Linux 7 已于 2024-06-30 结束生命周期，旧教程用于认识历史环境。
- [Kubernetes 版本兼容政策](https://kubernetes.io/releases/version-skew-policy/)：新练习先核对支持与组件兼容，不照搬 1.23/1.28 的版本组合。
- [MySQL 隐式提交](https://dev.mysql.com/doc/refman/8.4/en/implicit-commit.html)、[EXPLAIN](https://dev.mysql.com/doc/refman/8.4/en/explain.html)：区分事务边界、估算计划和实际执行。
- [Docker 数据卷](https://docs.docker.com/engine/storage/volumes/)、[Compose 就绪与启动顺序](https://docs.docker.com/compose/how-tos/startup-order/)：区分持久化、挂载视图、运行与就绪。
- [Kubernetes Service](https://kubernetes.io/docs/concepts/services-networking/service/)：区分选择器、入口端口、目标端口与后端状态。
- 其余课程末尾提供 Linux、Ansible、Zabbix、JumpServer 等对应官方手册。

## 交互与验证范围

`tests/ops-path-browser.cjs` 验证 160 节运维课的阶段分组唯一性、新增 25 节结构与术语、分集引用、搜索与空状态、分页、阶段恢复、错误答案、手动确认、小测变更后的失效、按阶段进入下一课、学习记录恢复，以及五种宽度的浅深色布局。

新场景课用虚构快照训练证据判断，不运行真实 MySQL、Docker 或 Kubernetes。原有命令模拟器仍保留原范围；浏览器测试不能当成真实基础设施的部署验收。账户阶段同步使用现有版本检查快照，并进行模拟集成验证；真实登录与云端权限验收需要真实用户会话。

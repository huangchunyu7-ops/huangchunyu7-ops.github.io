# 日语学习资源与实现说明

## 已融合进课堂

- [KanjiVG](https://github.com/KanjiVG/kanjivg)：12 个笔顺 SVG，用于五十音与书写模块。作者 Ulrich Apel，CC BY-SA 3.0；原始文件和许可说明在 `dist/data/japanese/strokes/`。
- [Wikimedia Commons](https://commons.wikimedia.org/) / [Lingua Libre](https://lingualibre.org/)：44 段读音录音，MP3 转码保留原内容。每段的作者、来源与 CC 许可或公有领域声明，见 `dist/audio/japanese/NOTICE.json`；词条页也显示对应致谢。
- 原有 OpenJLPT 分级数据继续用于扩展词库检索，保留原有数据说明；新增起步词书的中文释义、例句说明、分级短文和会话由本站编写。
- [Noto Sans JP](https://github.com/notofonts/noto-cjk)：本地字体子集，SIL Open Font License 1.1，许可随字体附带。

## 学习参考

- [MOJi](https://www.mojidict.com/)：参考公开的词书、假名、阅读、会话和课堂分类及学习流程；没有导入其专有数据或音频。
- [Irodori 生活日语](https://www.irodori.jpf.go.jp/)：工作台提供官方资源入口。
- [JLPT 官方网站](https://www.jlpt.jp/)：提供官方考试说明和样题入口。本站题目是教学练习，不冒充真题。

个人购买或导出的词书可从工作台导入供本机学习。网站不包含读取 MOJi 账户、绕过付费或批量抓取其内容的功能。CSV / JSON / ZIP 文件只在浏览器解析，音频保存在本机，不执行所谓书源脚本。

## 验证范围

`tests/japanese-browser.cjs` 使用真实浏览器验证翻卡门槛、复习间隔、跨词书暂停恢复、个人 ZIP 音频播放、账户本机数据隔离、无效导入保留旧数据、课程练习、错题、假名书写、麦克风录制，以及手机/电脑的浅深色排版。云端快照另有模拟集成验证；真实用户 OAuth 和服务端权限仍需登录后的验收。

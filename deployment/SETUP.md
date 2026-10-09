# GitHub Pages + Supabase：配置与验收

本项目由公开网页和私有个人数据组成。GitHub 保存网站源码，Supabase 负责身份、学习进度与笔记。网页登录跳转到 GitHub 官方页面，本站不收集 GitHub 密码。

## 1. 网站发布

仓库：huangchunyu7-ops/huangchunyu7-ops.github.io。

在仓库 Settings → Pages → Build and deployment，将 Source 改为 GitHub Actions。首次运行 Publish learning website 成功后访问 https://huangchunyu7-ops.github.io/ 。工作流只发布 dist，不发布测试、SQL 文件或内部托管配置。

如果工作流因权限无法使用，可以把 dist 内文件放到公开仓库根目录，选择 Deploy from a branch / main / root。不要只上传外层 dist 文件夹。Python 的 wasm 与 mjs 文件也要一起保留。

## 2. Supabase 数据库

在 SQL Editor 新建查询，运行 supabase.sql 全文。成功结果是 Success. No rows returned。learning_snapshots 保存每个用户的一份进度，study_notes 保存个人笔记。

两个表启用 RLS，用户只能读取自己的数据。进度通过带版本比较的函数更新；若另一台设备已经更新，旧版本不能直接覆盖，页面要求选择。匿名用户不能读写个人表。不要关闭 RLS 来排除登录问题。

## 3. GitHub 登录

在 https://github.com/settings/developers 创建 OAuth App。

- Application name：知行学习室
- Homepage URL：https://huangchunyu7-ops.github.io/
- Authorization callback URL：https://bvflsjssbumndmyfyncj.supabase.co/auth/v1/callback
- Device flow 和通配符保持关闭。

把该 OAuth App 的 Client ID 与 Client Secret 填到 Supabase Authentication → Sign In / Providers → GitHub，启用并保存。Client ID 不是 Supabase 项目名称；Client Secret 不是 Publishable key。

在 Authentication → URL Configuration 设置：

- Site URL：https://huangchunyu7-ops.github.io/
- Redirect URLs：https://huangchunyu7-ops.github.io/

需要本地测试时，可以额外加入 http://127.0.0.1:8765/；验收后按需移除。若还要在原 Sites 地址使用登录，应额外加入完整原网站地址，保留原平台访问限制。

## 4. 前端公开配置

dist/account-config.js 只填写 Project URL 与 Publishable key。这两项允许出现在公开网页。不得放入 service_role、sb_secret_、GitHub Client Secret、访问令牌或密码。

SDK 固定为 @supabase/supabase-js 2.117.3，使用 PKCE；dist/vendor/supabase.js 已本地打包。源码与许可证见 vendor/supabase-NOTICE.txt 和 supabase-legal/。

## 5. 两台设备验收

1. 电脑打开网站，先确认未登录也能学习并记录本机进度。
2. 点击个人账户 / 笔记，使用 GitHub 登录并授权。第一次登录时原本机进度保留为备份，点击“导入登录前的本机进度”可转入账户。
3. 阅读一页或完成一步，等待显示“已同步至个人账户”。
4. 手机使用同一 GitHub 账户登录；首页点击继续上次学习，核对课程、页码与草稿。
5. 写一条笔记，在另一设备核对标题与正文。
6. 两设备同时修改同一进度时，旧版本会提示冲突。先决定载入云端，或保留本机更新云端；操作前自动保存本机备份。
7. 另一账户不应看到前一个账户的笔记或进度。退出时恢复游客进度；未同步记录会提示先解决。
8. 分别用手机流量和家庭宽带测试网页、GitHub 登录、Supabase 同步；免费海外服务不能保证中国大陆所有网络稳定。

学习进度同步不包含自行导入的 EPUB 文件和 Python 临时运行文件。笔记存入私有账户，不会发布到公开 GitHub 仓库。

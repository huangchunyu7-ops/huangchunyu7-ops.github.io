# ComfyUI 学习区示例与资料来源

核对日期：2026-11-04。中文课程、节点职责解释、解析器和交互界面为本站独立编写；不代表上游项目或 UP 主审核。

## 工作流文件

前三份工作流来自 [Comfy-Org/workflow_templates](https://github.com/Comfy-Org/workflow_templates)，MIT License，Copyright (c) 2023-present Comfy Org。完整许可见 [LICENSE-ComfyOrg.txt](LICENSE-ComfyOrg.txt)。

| 本站文件 | 上游路径 | 上游 Git blob |
| --- | --- | --- |
| workflows/sdxl.json | templates/image_sdxl_simple.json | 81a56c815219946840d99c8a67401dba5d9fea37 |
| workflows/wan22.json | templates/video_wan2_2_5B_ti2v.json | a8902e6e28b9777c6b324861cc336eed491687b5 |
| workflows/h3-i2v.json | templates/video_minimax_h3_i2v.json | bcc680e74537bffa89bff3eb6eb11a7c220e38e9 |

`workflows/h3-clipstream.json` 来自 [AraneaQwQ/ComfyUI-H3-ClipStream](https://github.com/AraneaQwQ/ComfyUI-H3-ClipStream)，路径 `examples/H3_Ref2VA_Contextual_LongVideo_ClipStream.json`，上游 blob `a29e801fcafb7a2c2147859041089e64c4e7a2b6`。保留 GPL-3.0 许可，全文见 [LICENSE-ClipStream.txt](LICENSE-ClipStream.txt)。上游多级归属：Clip Bin 来自 knoic/ComfyUI-MiniMaxH3-PrefixStream；Motion Context 来自 NikoDemon80/ComfyUI-H3-Motion-Context；Dual Clip 配对为 ClipStream 项目新增。详见原项目 README 与 ATTRIBUTION.md。

公开 JSON 为 **教学结构版**，不是可运行的完整工作流。本站进行了以下修改：仅保留节点 ID、class_type、模式、输入输出端口名称与类型、实体连线，以及子图边界；删除全部控件值、提示词、模型文件名、素材引用、便签、布局和附加元数据。上游 blob 标识原始版本，不能作为本站结构版文件的校验值。获取完整运行参数请访问上游来源，并在自己的环境中核对。

| 结构版 | 主图节点 | 内部节点 | 子图数 |
| --- | ---: | ---: | ---: |
| SDXL | 7 | 0 | 0 |
| Wan 2.2 5B | 12 | 0 | 0 |
| H3 I2V | 6 | 21 | 1 |
| H3 ClipStream | 36 | 22 | 3 |

统计排除虚拟输入输出边界。Set / Get 的变量名称也已移除，公开版本只能说明中转机制，完整绑定应在本地原文件中查看。GPL-3.0 结构版的可编辑 JSON 源码随站点与仓库提供，继续适用随附许可。

## 教学技术资料

- [ComfyUI 节点与端口](https://docs.comfy.org/basic-concepts/nodes)
- [官方 Wan 2.2 示例](https://docs.comfy.org/tutorials/video/wan/wan2_2)
- [ComfyUI H3 节点定义](https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_extras/nodes_minimax_h3.py)
- [ComfyUI 视频节点定义](https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_extras/nodes_video.py)
- [H3 ClipStream README 与迁移文档](https://github.com/AraneaQwQ/ComfyUI-H3-ClipStream)
- [H3 Long Video Manager](https://github.com/AraneaQwQ/H3-Long-Video-Manager)
- [VideoHelperSuite README](https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite)
- [WanVideoWrapper README](https://github.com/kijai/ComfyUI-WanVideoWrapper)

端口列表直接读取每个 JSON 的声明。未收录的自定义节点保留原始类型、端口与连线，职责明确标为尚未核实；API 图缺少签名时不补造类型。子图级回接不直接等同实际执行环；Set / Get 的同名节点只是待核对的隐式中转候选。

## UP 主资料与完成边界

保留用户提供的两个公开合集入口；本轮核对到 6 条公开视频简介，页面保留原视频链接。两个 b23 短链返回访问错误，未取得最新完整分集目录或字幕，未把状态标为完成。学习主题列表来自本站独立编写的 25 节课程，不是视频目录、逐字稿或私有历史记录。

用户网盘私存工作流尚未读取；当前 ClipStream 教学结构来自公开源仓库。本站不发布私有工作流、用户素材或私有提取文档。

本网站提供教学与静态分析，不连接用户 ComfyUI、不运行 GPU 任务。用户导入的完整 JSON 仅保留在当前页面内存，不写入公共仓库或上传到服务器；刷新后需重新导入。课程阅读与作答进度通过既有机制另行保存。

## 本站原创音乐结构图

`workflows/music-teaching.json` 为本站独立编写的 9 节点 / 10 连接教学结构，参考公开 Core 接口 `nodes_minimax_music.py`、`nodes_audio.py` 和普通采样接口。没有复制网盘原始 JSON、提示词、控件值、素材引用或账号字段；它不包含运行参数，不能直接生成歌曲。

新增实战课程对照 ClipStream、H3 Long Video Manager、T8 与 Core 公开说明独立编写，不发布私有资料的目录、网盘 FID、提示词模板或完整工作流。来源链接随课与节点说明展示。

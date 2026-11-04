/* Public study topics are derived from the original course dataset. No private extraction document is published. */
function cfStudyTopics(){return cfLessonRows.map(r=>[r[2],r[3],r[0]]);}
const cfResourceProjects=[
{"name": "MiniMax Music 3 官方教程", "url": "https://docs.comfy.org/tutorials/audio/minimax/minimax-music-3", "use": "音乐描述、歌词、条件时长、音频 latent 与解码交付。", "read": "已核对官方教程与 Core 的音乐节点定义；本站音乐图为原创教学结构。"},
{"name": "MiniMax H3 Audio T8", "url": "https://github.com/T8mars/comfyui-minimax-h3-audio-T8", "use": "二采条件协调、原音与生成音轨、兼容性与实验路线边界。", "read": "已读取 README、二阶段生成与导演台双采说明；不将作者实测等同本站或你的电脑实测。"},
{"name": "FeiHou 视频封装", "url": "https://github.com/FX-FeiHou/ComfyUI-FeiHou-Toolbox", "use": "理解 VideoCombineV2 的帧 / 音轨输入与 VHS_FILENAMES 输出。", "read": "已核对公开节点定义；没有安装或调用外部生成接口。"},
 {name:'ComfyUI 官方模板',url:'https://github.com/Comfy-Org/workflow_templates',use:'先找最小、配套的生图或视频模板。本站内置 SDXL、Wan 2.2 5B、H3 三份官方示例。',read:'已读取示例 JSON 与 MIT 许可；没有下载模型或执行生成。'},
 {name:'H3 ClipStream',url:'https://github.com/AraneaQwQ/ComfyUI-H3-ClipStream',use:'学习历史镜头 AV latent 归档、选择、Motion Context 接续、Trim 与长片组织。',read:'已读取 README、迁移说明、GPL-3.0 许可与公开 38 节点示例。'},
 {name:'H3 Long Video Manager',url:'https://github.com/AraneaQwQ/H3-Long-Video-Manager',use:'理解参考视频切段、素材选择和 Guide 时间轴；与生成、最终剪辑分开。',read:'已读取 README；未把历史槽位和参数当成当前版本默认值。'},
 {name:'VideoHelperSuite',url:'https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite',use:'视频读取、选帧、IMAGE 批次与音轨封装。',read:'已读取 README。Video Combine 输出文件信息，不等同原生 VIDEO 端口。'},
 {name:'WanVideoWrapper',url:'https://github.com/kijai/ComfyUI-WanVideoWrapper',use:'补充原生尚未覆盖的模型与功能；先理解官方原生路线，再按需要研究。',read:'已读取 readme。项目作者明确将它作为持续变化的实验封装，不建议为已有原生能力一律改用 wrapper。'},
 {name:'ComfyUI-KJNodes',url:'https://github.com/kijai/ComfyUI-KJNodes',use:'认识 Set / Get 中转、尺寸工具与预览等辅助节点。',read:'通过真实示例的节点类型与端口建立结构解释；具体插件版本仍需核对。'},
 {name:'rgthree-comfy',url:'https://github.com/rgthree/rgthree-comfy',use:'认识多 LoRA、seed 与工作流工具，不把工具节点当成生成模型。',read:'真实示例中可见对应节点；功能与开关以安装版本为准。'}
];
const cfPublicVideos=[
 {title:'动作迁移 v1.5：可视化接续与自动裁切',url:'https://www.bilibili.com/video/BV13Wan6FEYF/',status:'公开简介已核对；本次未取得完整字幕',lesson:'context'},
 {title:'先音频后视频：音频驱动长视频',url:'https://www.bilibili.com/video/BV1i8he6zEYz/',status:'公开简介已核对；将音源、音频驱动与最终封装分开学习',lesson:'audio'},
 {title:'角色九宫格参考',url:'https://www.bilibili.com/video/BV1G9e76fEoA/',status:'公开简介已核对；人物资产参考与首帧约束不是同一功能',lesson:'control'},
 {title:'角色参考图换装',url:'https://www.bilibili.com/video/BV1AGet6BETR/',status:'公开简介已核对；本次未取得完整字幕',lesson:'img2img'},

 {title:'万物皆可接续 V3：可视化与自动接续',url:'https://www.bilibili.com/video/BV1ZpYY6GEKQ/',status:'公开简介已核对；本次未取得完整字幕',lesson:'context'},
 {title:'动作迁移 / 人物替换长视频效果演示',url:'https://www.bilibili.com/video/BV1twhn6nEVR/',status:'公开简介已核对；属于效果演示，不充当完整操作课',lesson:'control'}
];

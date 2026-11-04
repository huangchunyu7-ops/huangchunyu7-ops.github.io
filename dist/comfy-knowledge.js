/* Independently written Chinese explanations; port declarations are read from
 * the bundled upstream JSON, not inferred from translated display names. */
const cfTypes={
 MODEL:['生成模型','预测去噪方向的模型对象，可能已应用 LoRA 或采样补丁；不是图片。'],
 CLIP:['文本 / 多模态编码器','将提示词或参考素材编码成条件。接口名叫 CLIP 不代表所有模型都使用同一个 CLIP 架构。'],
 VAE:['编码解码器','在像素或音频与模型潜空间之间转换。图像、视频、音频 VAE 必须匹配各自模型。'],
 CONDITIONING:['生成条件','编码后的提示、参考或引导信息。它影响生成，不是可直接观看的成品。'],
 LATENT:['潜空间数据','模型处理的表示，通常含 samples 等结构。图像 latent 与 H3 音画联合 latent 虽可能同名，内容并不通用。'],
 IMAGE:['像素图像 / 帧批次','可供预览或保存的图像张量；视频的一组帧也常以 IMAGE 批次传递，不一定只有一张图。'],
 AUDIO:['音频数据','通常包含波形与采样率。音频有自己的时间长度，不能只按视频帧数随便裁剪。'],
 VIDEO:['视频对象','封装帧、帧率和可选音轨等内容；保存节点负责导出。它与 IMAGE 帧批次不同。'],
 MASK:['遮罩','每个位置的权重，用于限定处理范围；黑白含义应以接收节点说明为准。'],
 INT:['整数','帧数、尺寸、seed 等整数值；同为 INT 也可能单位不同。'],FLOAT:['小数','强度、fps 等数值；类型相同不等于单位与意义相同。'],STRING:['文本','提示词、路径或项目名；文本不是自动执行的代码。'],COMBO:['下拉选项','节点声明的一组选项，不是模型本身。'],NOISE:['噪声来源','供高级采样器取噪声的对象。'],GUIDER:['引导器','把模型与条件按特定引导策略组合给采样器。'],SAMPLER:['采样算法','如何逐步更新样本的算法对象。'],SIGMAS:['噪声调度','采样过程采用的一串噪声水平。'],MINIMAX_H3_CONTEXT:['H3 封装上下文','Easy 节点维护的模型相关生成上下文；需用该节点包配套接口拆解。'],MINIMAX_H3_BUNDLE:['H3 模型组合','将编码器与音视频 VAE 等组合在一起，交给 Easy 系列节点。'],MINIMAX_H3_MEDIA_BUNDLE:['H3 素材组合','参考图片、视频、音频的封装，不等同于一个 IMAGE。']
};
// type → [plain name, responsibility, why this connection matters, common trap, source]
const cfNodeRows=[
 ['PrimitiveFloat','小数常量','提供一个小数值，常用于时长、强度等参数。','沿目标端口判断单位；同样是 FLOAT，秒数与强度仍不是一回事。','不要把 5.0 自动当作 5 帧，要看它接到哪里。','core'],
 ['PrimitiveInt','整数常量','提供一个整数值，供帧数、步数或其他整数参数使用。','使用下游参数名判断其真实意义。','同为 INT 不代表 seed、步数和帧数可以互换。','core'],
 ['INTConstant','整数工具常量','提供一个整数值给工作流使用。','在示例中可能集中管理 steps 等参数，需要沿连线确认。','控件上的 8 不会自动代表 8 秒。','core'],
 ['PrimitiveBoolean','开关常量','提供 true / false 布尔值。','它可能控制 LoRA 或模型分支，应继续追下游选择节点。','看到一个分支接了线，不代表开关已经选中它。','core'],
 ['ComfySwitchNode','条件选择分支','根据条件选择相应输入交给后续。','用它把模型或参数方案切换到同一条后续链。','静态连线不能证明两条分支都在本次执行；核对条件与实际运行。','core'],
 ['ComfyMathExpression','数值表达式','按表达式把输入数值转换为需要的输出值。','例如把规划的秒数转换为模型要求的帧数；应同时核对 fps 和网格。','计算出的合法帧数不等于视频已经生成或质量通过。','core'],
 ['PlaySound|pysssss','完成提示音','在相应执行位置播放提示音，帮助知道流程已到达这里。','它属于辅助反馈，不属于模型音轨生成。','提示音响了，不代表最终 MP4 中有音轨或质量已经验收。','core'],

 ['CheckpointLoaderSimple','加载整套检查点','加载兼容的检查点并分别交出 MODEL、CLIP、VAE。','模型给采样器，编码器给文本编码，VAE 给解码。三条线分工不同。','不能把 MODEL 线接到 SaveImage，也不能认为所有视频模型都用整套 checkpoint。','core'],
 ['UNETLoader','单独加载生成模型','加载 diffusion_models 下的生成模型；历史名字 UNETLoader 也用于一些 Transformer 模型。','交出的 MODEL 还需要配套编码器、VAE 和正确模型分支。','只加载主模型并不等于工作流已经能出图或出视频。','core'],
 ['CLIPLoader','加载编码器','加载当前模型支持的文本 / 多模态编码器。','编码器输出供提示词或多模态条件节点使用。','编码器架构与模型不匹配，可能是维度错误而不是显存不足。','core'],
 ['VAELoader','加载 VAE','加载相应图像、视频或音频编码解码器。','编码与解码端需要适配同一模型潜空间。','H3 的视频 VAE 与音频 VAE 不能因为都叫 VAE 就互换。','core'],
 ['CLIPTextEncode','把提示词变成条件','接收 CLIP 与文本，交出 CONDITIONING。','采样器使用的是编码条件，不是直接读取屏幕上的字符串。','它不生成像素。正负条件是否都使用，要看具体模型与引导方案。','core'],
 ['EmptyLatentImage','建立图像 latent 尺寸','建立图像潜空间的初始结构，指定宽、高、批次。','采样器依据这个结构决定生成尺寸和样本数量。','batch_size 通常是独立图片数量，不是视频的帧数。','core'],
 ['VAEEncode','把像素编码到 latent','用匹配的 VAE 将 IMAGE 转换为 LATENT。','普通图生图可把输入图编码后交给采样器。','VAE 编码不是文本编码，也不会直接理解你的动作描述。','core'],
 ['VAEDecode','把 latent 变回可见帧','接收采样结果与 VAE，解码为 IMAGE。','SaveImage 或 CreateVideo 需要像素，不能直接观看 LATENT。','解码器匹配错误可能造成异常颜色或形状错误，不能只增加 steps。','core'],
 ['VAEDecodeAudio','把音频 latent 解码','用音频 VAE 从相应潜空间表示中恢复波形。','H3 联合生成后需要分别解出视频帧和音频。','视频解码出画面，不代表音轨也已解出。','h3'],
 ['KSampler','执行一段采样','组合模型、条件、latent 与采样参数，输出更新后的 LATENT。','采样后仍需 VAE 解码，才会得到可见图像或视频帧。','seed 不是画质分数；steps、CFG 和 denoise 也不是越大越好。','core'],
 ['SamplerCustomAdvanced','高级采样汇合点','接收 NOISE、GUIDER、SAMPLER、SIGMAS 和 LATENT。','把基础 KSampler 封装的多个职责显式拆开，便于不同模型定制。','看到它有两个输出，要根据下游需要区分 output 与 denoised_output。','core'],
 ['RandomNoise','设定随机噪声来源','根据 seed 创建噪声对象，交给高级采样器。','固定 seed 有助于单变量对比，但还要固定模型、输入与环境。','相同 seed 不保证不同模型、版本或设备逐像素相同。','core'],
 ['BasicGuider','组合模型与条件','构建基础引导对象供高级采样器使用。','这里把 MODEL 与 CONDITIONING 接成 GUIDER。','不能把所有模型的负面提示和 CFG 经验直接照搬到 BasicGuider。','core'],
 ['BasicScheduler','生成噪声调度','按模型、调度器、steps 与 denoise 生成 SIGMAS。','采样算法与噪声调度是两项不同设置。','调度器不是另一个主模型，也不决定最终封装帧率。','core'],
 ['KSamplerSelect','选采样算法','把采样器下拉选择转换成 SAMPLER 对象。','连接高级采样器的 sampler 端口。','它只选择算法，不单独运行完整生成。','core'],
 ['LoadImage','读取输入图像','从 ComfyUI 输入目录读取图像，并可输出遮罩。','图片可以交给图生图编码器，或视频模型的首帧 / 参考图入口。','同一张图接到首帧与身份参考入口，约束的语义不同。','core'],
 ['SaveImage','保存图像','将 IMAGE 保存到输出目录，并写入相应元数据。','这是生图链的交付节点。','接上一组视频帧可能得到一组图片，不会自动成为 MP4。','core'],
 ['PreviewImage','只查看图像','提供 IMAGE 的预览，便于观察中间结果。','可在解码后检查画面，再决定是否输出成品。','看到了预览，不代表想要的成品已经正确导出。','core'],
 ['LoraLoaderModelOnly','只给生成模型加 LoRA','对 MODEL 应用兼容的 LoRA，输出修改后的 MODEL。','放在模型链上，再把修改后的 MODEL 交给采样与调度。','加速 LoRA、风格 LoRA、动作 LoRA 目的不同，不能随意替换。','core'],
 ['LoraLoader','给模型与编码器加 LoRA','根据 LoRA 内容修改 MODEL 与 CLIP。','需要分别使用它返回的对象，才能把修改带到后续。','只接回原始 loader 的输出，可能绕过了刚加的 LoRA。','core'],
 ['Wan22ImageToVideoLatent','Wan 2.2 5B 的视频起点','使用视频 VAE 与可选起始图像，准备指定尺寸与帧数的视频 latent。','它处理的是视频时间维，不能用普通 EmptyLatentImage 完全替代。','此节点对应 5B TI2V 路线，不等于 14B 高低噪专家两阶段路线。','wan'],
 ['ModelSamplingSD3','适配模型采样设置','按模型的采样设置调整 MODEL，实际适用性取决于模板。','示例里它处在加载模型与 KSampler 之间。','节点名不能单独证明工作流使用了 SD3 主模型；要看真实模型文件。','core'],
 ['CreateVideo','把帧组织成视频','接收 IMAGE 帧批次、fps 与可选 AUDIO，输出 VIDEO。','它负责组织时间和音轨，不是重新生成动作或补出新帧。','固定 81 帧改 fps，会改变播放时长；不是凭空增加动作细节。','video'],
 ['SaveVideo','导出视频','把 VIDEO 导出到 ComfyUI 输出目录，可返回原视频对象。','上游先准备帧、帧率、音轨，下游才谈容器与编码。','节点执行结束仍要检查导出的分辨率、帧率、时长与音轨。','video'],
 ['GetVideoComponents','拆开视频对象','从 VIDEO 中取出图像帧、音频、fps 等组件。','便于预览或把组件交给需要 IMAGE / AUDIO 的处理节点。','它不是生成模型，也不会自动增加分辨率。','video'],
 ['VHS_LoadVideo','视频拆帧','VideoHelperSuite 读取视频并输出帧及音频等信息。','选帧、跳帧和重采样先决定真实输入范围，再交给控制或参考节点。','force_rate、frame_load_cap 与 select_every_nth 不应当成同一功能。','vhs'],
 ['VHS_LoadVideoPath','按路径读取视频','从指定路径读取视频，遵循 VideoHelperSuite 的加载设置。','本地路径必须属于正在运行 ComfyUI 的机器。','你手机里看得见的文件路径，服务器未必读得到。','vhs'],
 ['VHS_VideoCombine','VHS 合成与保存视频','将 IMAGE 序列与可选 AUDIO 编码成输出文件。','这是 VHS 的交付路径，其输出 VHS_FILENAMES 不能当作 IMAGE。','不要把它的文件列表输出直接插到要求 IMAGE 或 VIDEO 的接口。','vhs'],
 ['MiniMaxH3ImageToVideo','H3 首帧 / 首尾帧入口','接收编码器、VAE、提示词与可选首尾帧，输出 positive 条件与联合 AV latent。','它准备条件与目标结构；真正采样、音画解码和保存仍在后面。','首帧、尾帧和 ReferenceToVideo 的参考素材不是同一种约束。','h3'],
 ['MiniMaxH3ReferenceToVideo','H3 多模态参考入口','接收文字及参考图、视频、音频，准备 CONDITIONING 与 AV LATENT。','提示中的素材编号和真实输入顺序应一致。','参考图提供身份等条件，不应自动被理解为固定首帧或尾帧。','h3'],
 ['EmptyMiniMaxH3LatentAV','建立 H3 音画 latent','准备 H3 联合视频与音频的 latent 结构。','H3 的 AV latent 不等于单张图像 latent；帧数按模型网格处理。','LATENT 端口同名，不证明来自 SDXL 的 latent 能直接换用。','h3'],
 ['MiniMaxH3SigmaShift','H3 音画采样偏移','修改 MODEL 的视频和音频 flow shift 设置。','接在模型链中，供后面的调度与采样协同使用。','不能把 shift_audio 数值当作音量或音频秒数。','h3'],
 ['MiniMaxH3AddGuide','在时间点加入引导','把图像、短片或音频作为某个 frame_idx 处的引导条件。','输出的是更新后的 positive，不是最终画面。','frame_idx 是帧位置，音频采样率不是视频 fps；需核对各自单位。','h3'],
 ['MiniMaxH3Easy','H3 Easy 任务封装','把模型组合与素材组合整理为 MODEL 和 H3_CONTEXT。','后面配套 EasyOutput 再取出条件、latent 和 VAE，减少主图接线数量。','少几根线不等于没有这些步骤；展开子图和配套节点继续追。','h3'],
 ['MiniMaxH3EasyMediaLoader','组织 H3 参考素材','加载并组织图片、视频、音频等素材为专用 bundle。','输出 MINIMAX_H3_MEDIA_BUNDLE，交给匹配的 Easy 入口。','素材 bundle 不是单张 IMAGE，不能插到任意图像节点。','h3'],
 ['MiniMaxH3EasyModelAdapter','组织 H3 模型组合','把相应编码器和音画 VAE 等整理成 Easy 系列需要的 bundle。','对应示例的模型加载子图，参数仍要与模型版本匹配。','图里一个模型组合方块可能包着多个 loader。','h3'],
 ['MiniMaxH3EasyOutput','拆开 H3 封装上下文','取出条件、目标 latent、视频与音频 VAE 等后续接口。','把 Easy 的封装还原成高级采样和解码需要的数据。','别把 H3_CONTEXT 当作可直接送入 SaveVideo 的视频。','h3'],
 ['MiniMaxClipBinPicker','选择历史镜头','从项目卡片中读回以前的联合 AV latent 及首尾帧等信息。','latent 交给 Motion Context；首尾图像是不同端口，不要凭“看起来一样”混用。','Auto 空库可走首段；Strict 模式需要已有素材。行为以当前插件版本为准。','clipstream'],
 ['MiniMaxClipBinSaver','归档镜头','归档完整 sampler AV latent，同时保存预览素材与镜头信息。','接续需要完整 latent；交付图像和音频应使用 Trim 后的结果。','当前 README 要求归档交付媒体经过 Trim。本示例的媒体入口来自运算子图，需展开逐端口追查；不能只凭主图方块位置认定已经裁剪。','clipstream'],
 ['MiniMaxH3MotionContextClipStream','把上段上下文带入本段','结合原生条件、目标 latent、VAE 与历史上下文，更新生成条件并交出 trim_frames。','context_latent 应来自匹配链路的历史完整采样 latent，trim_frames 继续传到 Trim。','首段没有历史上下文时应按节点模式处理，不是随便加载一个不存在的 latent 文件。','clipstream'],
 ['MiniMaxH3MotionContextTrimClipStream','裁掉固定的重叠头部','采样并解码后，用 trim_frames 同步裁剪图片帧与音频。','先得到像素 / 波形，再裁剪交付媒体；归档 latent 与交付媒体各有职责。','不能只裁图片而忽略音轨，也不能把裁剪节点放到需要 latent 的位置。','clipstream'],
 ['MiniMaxH3ContextLatentTaperNoise','上下文渐变加噪','在匹配的历史 latent 上按参数调整噪声，用于接续实验。','它位于 Picker 的 latent 与 Motion Context 的 context_latent 之间。','它不是通用磨皮或模糊滤镜；参数不能脱离对应模型与版本一键照搬。','noise'],
 ['MiniMaxH3LatentUpscaleWithModel','H3 潜空间放大','使用 latent upscale model 调整视频 latent 的空间尺寸，音频按该实现透传。','放大后仍需正确二采或解码路径；不能当成普通像素 Resize。','更大 latent 往往增加后续计算和内存开销。','h3'],
 ['ModelPreviewOverrideKJ','设置采样预览','为相应模型指定预览解码路径，方便查看采样进度。','预览与最后使用完整 VAE 解码是不同职责。','TAE / TAeH3 预览解码器不是主 DiT 模型，不能按旧笔记放错模型用途。','kj'],
 ['SetNode','给数据起中转名','KJNodes 的命名中转用于减少长连线。','要查看同名 GetNode 才知道数据在何处被取用；作用域还需对照插件。','没有可见长线，不代表没有依赖。本解析器只列同名候选，不伪造实体连线。','kj'],
 ['GetNode','按中转名取数据','取同名 SetNode 中转的数据，实际语义取决于节点包和作用域。','沿同名变量继续追查模型、seed 或调度器。','同名节点只是静态候选，不能自动证明运行时绑定正确。','kj'],
 ['Power Lora Loader (rgthree)','多 LoRA 工具','管理多项 LoRA 及其开关和强度，返回后续使用的模型 / 编码器。','需要使用它实际输出的对象，检查每项是否启用且适配模型。','节点存在不等于每个 LoRA 都已开启。','rgthree'],
 ['Seed (rgthree)','随机种子工具','集中提供 seed 或相应随机策略。','可以把同一数值传给不同需要 seed 的位置，便于对照。','随机策略与固定整数需区分；看到 -1 不应当作通用固定种子。','rgthree'],
 ['ReservedVRAMSetter','显存预留设置','调整对应运行策略中的显存预留；不改变 GPU 物理容量。','减少同驻压力可能换来搬运开销，需要观察实际峰值与耗时。','不能承诺改一个数值就让任何模型在任意显卡运行。','reserved'],
 ['VRAMCleanup','显存清理工具','在相应执行位置触发节点包提供的清理逻辑。','关注它是否真的处于依赖链及当前实现保留的活动张量。','清理节点不是万能修复；还在使用的数据不能凭空释放。','rgthree'],
 ['RAMCleanup','内存清理工具','触发节点包的内存清理逻辑。','系统内存、显存和磁盘空间要分别观察。','加 RAM 清理不会等同于扩大 VRAM。','rgthree'],
 ['MiniMaxH3MemoryEfficientSageAttentionPatch','H3 注意力实现补丁','更换对应模型的注意力计算实现，影响执行兼容性与资源使用。','输出仍是 MODEL，应继续使用这条模型链。','缺少匹配内核、版本或设备支持时，不应只改模型文件名。','kj'],
 ['ModelAttentionBackend','选择注意力后端','指定或调整模型使用的注意力后端，具体支持取决于节点实现。','应与前面已应用的补丁一并核对。','叠加两个后端设置不一定叠加收益，实际覆盖顺序要看实现。','core'],
 ['ImageScaleToTotalPixels','按面积缩放图像','把输入图像调整到目标像素面积附近，同时遵守相应插值与对齐规则。','提前统一参考图与目标结构，减少尺寸歧义。','放大像素尺寸不会自动补出原图中不存在的真实细节。','core'],
 ['ResolutionSelector','选择目标尺寸','把比例和像素面积等设置转换为具体宽高。','下游真正使用的是输出宽高，不只是界面上的 16:9 文字。','1MP 是像素面积量级，不是“宽 100 万像素”。','h3'],
 ['GetImageSize','读取实际图像尺寸','从 IMAGE 获得宽、高及当前实现提供的其他尺寸信息。','用实际数值检查参考图是否被裁切、缩放。','它不负责生成，也不会替你调整画幅。','core'],
 ['SubgraphBoundary','子图边界','表示外部传入的输入或子图返回的输出。','把子图当一个具有契约的函数，沿边界继续追查。','子图 ID 看起来像 UUID，不应直接判定为缺失插件。','core']
];
const cfSources={
 core:['ComfyUI 核心与节点说明','https://docs.comfy.org/basic-concepts/nodes'],h3:['ComfyUI H3 节点源码','https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_extras/nodes_minimax_h3.py'],video:['ComfyUI 视频节点源码','https://github.com/Comfy-Org/ComfyUI/blob/master/comfy_extras/nodes_video.py'],wan:['Wan 2.2 官方工作流','https://docs.comfy.org/tutorials/video/wan/wan2_2'],clipstream:['H3 ClipStream 项目','https://github.com/AraneaQwQ/ComfyUI-H3-ClipStream'],noise:['H3 Context Noise','https://github.com/beijinren/ComfyUI-H3-Context-Noise'],kj:['ComfyUI-KJNodes','https://github.com/kijai/ComfyUI-KJNodes'],rgthree:['rgthree-comfy','https://github.com/rgthree/rgthree-comfy'],reserved:['ReservedVRAM','https://github.com/Windecay/ComfyUI-ReservedVRAM'],vhs:['VideoHelperSuite','https://github.com/Kosinkadink/ComfyUI-VideoHelperSuite']
};
const cfNodeInfo=Object.fromEntries(cfNodeRows.map(([type,name,does,why,trap,source])=>[type,{name,does,why,trap,source}]));
const cfSamples=[
 {id:'sdxl',title:'SDXL：最小生图结构',file:'sdxl.json',repo:'Comfy-Org/workflow_templates',path:'templates/image_sdxl_simple.json',sha:'81a56c815219946840d99c8a67401dba5d9fea37',license:'MIT',focus:'12',note:'教学结构版：7 个主图节点。移除便签、提示词、参数值与素材引用，仅保留节点、端口和连线。'},
 {id:'wan22',title:'Wan 2.2 5B：视频结构',file:'wan22.json',repo:'Comfy-Org/workflow_templates',path:'templates/video_wan2_2_5B_ti2v.json',sha:'a8902e6e28b9777c6b324861cc336eed491687b5',license:'MIT',focus:'55',note:'5B TI2V 教学结构版，12 个主图节点。参数与素材引用已移除；不能当作可运行原工作流。'},
 {id:'h3-i2v',title:'H3：首帧音画结构',file:'h3-i2v.json',repo:'Comfy-Org/workflow_templates',path:'templates/video_minimax_h3_i2v.json',sha:'bcc680e74537bffa89bff3eb6eb11a7c220e38e9',license:'MIT',focus:'105',note:'教学结构版：6 个主图节点与 21 个内部节点。参数、提示词和素材引用已移除，展开子图继续追数据。'},
 {id:'h3-clipstream',title:'ClipStream：长片接续结构',file:'h3-clipstream.json',repo:'AraneaQwQ/ComfyUI-H3-ClipStream',path:'examples/H3_Ref2VA_Contextual_LongVideo_ClipStream.json',sha:'a29e801fcafb7a2c2147859041089e64c4e7a2b6',license:'GPL-3.0',focus:'461',note:'从原 38 节点公开示例提取的教学结构版：36 个主图节点、3 个子图。移除全部参数与素材，仅保留端口和连接；Set / Get 名称需导入本地原文件查看。'}
];
const cfTroubles=[
 ['红色缺失节点','先看是普通节点类型、UUID 子图引用，还是插件启动失败。','记录完整 class_type、节点包与启动日志；对照源仓库要求。不要只按翻译名称安装同名插件。'],
 ['连不上 / 类型错误','对照两端声明的类型和数据语义。','IMAGE 是像素或帧批次；LATENT 是潜空间；VIDEO 是视频对象。类型相同仍需匹配模型、尺寸与音画布局。'],
 ['找不到模型','核对 loader 期待的类型、相对目录与实际文件名。','主模型、编码器、VAE、LoRA、预览解码器分别记录。模型文件不是工作流 JSON 的一部分。'],
 ['CUDA out of memory','先区分采样、编码还是 VAE 解码阶段峰值。','缩小分辨率 / 帧数 / 批次做单变量验证，再核对卸载、分块与精度。显存与系统内存不能混算。'],
 ['shape / dtype / matmul 错误','通常需要先查组件和精度兼容性。','保存首条完整异常、模型分支与节点版本；不要把所有错误都当作显存不足。'],
 ['接续重复一小段','先看输出有没有经过配套 Trim。','历史接续用完整 sampler latent，交付媒体用裁剪后的帧与音轨；不要只裁画面。'],
 ['画面有了但没有声音','沿音频生成、音频 VAE 解码、AUDIO 连接、最终封装逐步查。','有 VIDEO 或 MP4 扩展名并不能证明存在音轨；核对播放器与导出媒体信息。'],
 ['改了提示词却没变化','检查是否在当前实际使用的条件链上，是否被旁路或缓存。','从输出节点逆向追，检查 seed 策略、开关、Set / Get、分支与本次执行路径。'],
 ['黑帧 / 异常颜色','先检查匹配的 VAE、解码分支、精度与原始帧。','先看 CreateVideo 前的帧预览，再对照最终编码；不要直接把问题归到编码器或增加步数。']
];

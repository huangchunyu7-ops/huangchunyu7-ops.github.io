/* Unmodified screenshots from Comfy-Org/docs, GPL-3.0; see assets/comfy-screenshots/NOTICE.md.
 * Descriptions and HTML markers are independently written. No private ComfyUI capture is claimed. */
const cfPictures=[
 {
  "id": "ksampler",
  "title": "KSampler：采样器",
  "file": "ksampler.png",
  "types": [
   "KSampler"
  ],
  "notes": [
   "左侧 model、positive、negative、latent_image 是数据输入。",
   "中部 seed、steps、cfg、sampler_name、scheduler、denoise 是参数。图中数值是截图示例，不是所有模型的推荐值。",
   "右侧 LATENT 是采样结果，仍须匹配 VAE 解码才能得到像素。"
  ],
  "width": 974,
  "height": 1076,
  "sourcePath": "images/comfy_core/sampling/k_sampler.png",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/comfy_core/sampling/k_sampler.png"
 },
 {
  "id": "checkpoint",
  "title": "Load Checkpoint：模型加载",
  "file": "checkpoint.jpg",
  "types": [
   "CheckpointLoaderSimple"
  ],
  "notes": [
   "ckpt_name 选择检查点文件，不是填写提示词。",
   "右侧分成 MODEL、CLIP、VAE 三个输出，分别接生成模型、文本编码、编解码链。",
   "截图是旧版基础模型示例；不要把其中的文件名当作 H3 模型选择。"
  ],
  "width": 807,
  "height": 384,
  "sourcePath": "images/comfy_core/loaders/load_checkpoint.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/comfy_core/loaders/load_checkpoint.jpg"
 },
 {
  "id": "clip",
  "title": "CLIP Text Encode：提示词编码",
  "file": "clip-text.jpg",
  "types": [
   "CLIPTextEncode"
  ],
  "notes": [
   "左侧 clip 接编码器对象。",
   "中间 text 填写描述；它是控件，不是最终图像。",
   "右侧 CONDITIONING 输出编码条件，接采样器对应的正面或负面条件。"
  ],
  "width": 778,
  "height": 477,
  "sourcePath": "images/comfy_core/conditioning/clip_text_encode.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/comfy_core/conditioning/clip_text_encode.jpg"
 },
 {
  "id": "vae",
  "title": "VAE Decode：潜空间变图像",
  "file": "vae-decode.jpg",
  "types": [
   "VAEDecode"
  ],
  "notes": [
   "samples 接采样器产生的 LATENT。",
   "vae 接与模型和媒体类型匹配的 VAE；这个节点不会替你自动选择权重。",
   "右侧 IMAGE 是像素或帧批次，可继续预览、保存或封装视频。"
  ],
  "width": 854,
  "height": 370,
  "sourcePath": "images/comfy_core/latent/vae_decode.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/comfy_core/latent/vae_decode.jpg"
 },
 {
  "id": "empty",
  "title": "Empty Latent：生成画布",
  "file": "empty-latent.jpg",
  "types": [
   "EmptyLatentImage"
  ],
  "notes": [
   "width、height 定义这类图像 latent 的尺寸，batch_size 定义批次。",
   "右侧 LATENT 是采样起点，不是一张已经生成的图片。",
   "这是基础图像节点截图，不代表 H3 视频的帧数或音画 latent 结构。"
  ],
  "width": 855,
  "height": 420,
  "sourcePath": "images/comfy_core/latent/empty_latent_image.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/comfy_core/latent/empty_latent_image.jpg"
 },
 {
  "id": "lora",
  "title": "Load LoRA：模型与编码器补丁",
  "file": "lora.jpg",
  "types": [
   "LoraLoader"
  ],
  "notes": [
   "左侧 model 与 clip 接原始模型和编码器。",
   "lora_name 选择兼容的 LoRA，两个 strength 分别控制对应分支。截图 undefined 不是可用模型名。",
   "右侧仍输出 MODEL 与 CLIP。这张图不是只输出 MODEL 的 LoraLoaderModelOnly。"
  ],
  "width": 807,
  "height": 443,
  "sourcePath": "images/comfy_core/loaders/load_lora.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/comfy_core/loaders/load_lora.jpg"
 },
 {
  "id": "states",
  "title": "正常、运行、报错、缺失",
  "file": "states.jpg",
  "types": [],
  "notes": [
   "从左到右为正常、正在运行、输入错误和缺失节点的官方示例。",
   "红色输入提示应结合完整异常定位；缺失节点还要核对 Core 或自定义节点安装版本。",
   "截图里的色彩与外观会随主题和版本变化，不作为唯一诊断依据。"
  ],
  "width": 3167,
  "height": 900,
  "sourcePath": "images/concepts/node/status.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/concepts/node/status.jpg"
 },
 {
  "id": "types",
  "title": "端口颜色与数据类型",
  "file": "node-types.jpg",
  "types": [],
  "notes": [
   "这张图是官方文档的端口颜色图例，用来辅助识别 MODEL、CLIP、VAE、CONDITIONING、LATENT、IMAGE 等。",
   "优先读端口声明的类型与单位；主题可以改颜色，同色不代表完整语义兼容。",
   "LATENT、IMAGE、VIDEO、音频和文件列表不能因为都与媒体有关就互相替代。"
  ],
  "width": 685,
  "height": 356,
  "sourcePath": "images/concepts/node/data_type.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/concepts/node/data_type.jpg"
 },
 {
  "id": "workflow",
  "title": "局部重绘工作流全图",
  "file": "workflow.jpg",
  "types": [],
  "notes": [
   "这是真实的基础局部重绘示例：模型加载、正负条件、原图与遮罩编码、采样、解码和保存。",
   "从右侧 Save Image 往前追：IMAGE 来自 VAE Decode，LATENT 来自 KSampler；再检查条件和原图入口。",
   "图中是旧版 SD1.5 示例，不能拿它的模型、提示词或参数直接当作 H3 工作流。"
  ],
  "width": 2000,
  "height": 1108,
  "sourcePath": "images/concepts/node/inpaint.jpg",
  "source": "https://github.com/Comfy-Org/docs/blob/main/images/concepts/node/inpaint.jpg"
 }
];
let cfPictureId='ksampler',cfPicturePart='inputs';
const cfPictureParts={inputs:{label:'输入端',text:'左侧圆点接上游数据。先看输入名与类型，再找提供这个输入的节点。',box:[19,21,30,19]},parameters:{label:'参数区',text:'中间控件决定这次如何采样。截图参数只是示例，不能当成所有模型的默认答案。',box:[22,40,56,40]},outputs:{label:'输出端',text:'右侧 LATENT 是潜空间结果，不是已经解码的图像。',box:[62,21,21,7]}};
const cfLessonPictures={map:'workflow',ports:'types',models:'checkpoint',dependency:'workflow',txt2img:'ksampler',conditioning:'clip','latent-vae':'vae',img2img:'workflow',parameters:'ksampler',seed:'ksampler',lora:'lora',import:'workflow',debug:'states','active-branch':'states','prompt-contract-case':'ksampler','version-case':'states'};
function cfPicture(id){return cfPictures.find(p=>p.id===id);}
function cfPictureForNode(type){return cfPictures.find(p=>p.types.includes(type));}
function cfPictureFigure(pic,compact=false,part=null){return `<figure class="cf-shot-figure ${compact?'cf-shot-compact':''}"><button type="button" class="cf-shot-open" data-cf-picture-open="${pic.id}" aria-label="放大截图：${esc(pic.title)}" style="max-width:${Math.round((compact?280:480)*pic.width/pic.height)}px"><span class="cf-shot-frame"><img src="assets/comfy-screenshots/${pic.file}" width="${pic.width}" height="${pic.height}" alt="${esc(pic.title)}，Comfy-Org 官方文档截图" loading="lazy">${part?`<span class="cf-shot-mark" aria-hidden="true" style="left:${part.box[0]}%;top:${part.box[1]}%;width:${part.box[2]}%;height:${part.box[3]}%"></span>`:''}</span></button><figcaption>官方文档截图 · <a href="${pic.source}" target="_blank" rel="noopener noreferrer">Comfy-Org/docs 原图</a> · <a href="assets/comfy-screenshots/NOTICE.md" target="_blank">来源与许可</a>。界面版本可能与本机不同，点图可放大。</figcaption></figure>`;}
function cfNodePictureHTML(node){const pic=cfPictureForNode(node.type);return pic?`<details class="cf-node-photo" open><summary>对照真实节点截图</summary>${cfPictureFigure(pic,true)}<p class="cf-note">先认外观，再以下方本文件的真实端口为准；截图不代表本机节点版本。</p></details>`:`<p class="cf-note">暂无该类型 / 版本的真实截图。下面是本文件声明的端口；<button class="text-button" data-cf-pane="pictures">先看基础节点截图</button>。</p>`;}
function cfPictureLessonHTML(page){if(!page.comfySample||view!=='hub-course'||hubTrack!=='comfy')return '';const id=activeHubLesson().id.replace(/^comfy-/,''),pic=cfPicture(cfLessonPictures[id]);return pic?`<section class="cf-lesson-photo"><h3>对照截图认节点</h3>${cfPictureFigure(pic,true)}<p>${esc(pic.notes[0])}</p></section>`:'';}
function cfPictureHTML(){const pic=cfPicture(cfPictureId)||cfPictures[0],part=cfPictureParts[cfPicturePart];return `<section class="cf-picture-intro"><h2>先认外观，再追输入输出</h2><p>这里是官方文档的真实截图，不是工作流解析器生成的节点卡片。当前收录 ${cfPictures.length} 张基础图；H3 社区自定义节点缺少对应版本截图时，会明确标注。</p></section><label class="cf-picture-mobile" for="cf-picture-select">选择截图<select id="cf-picture-select">${cfPictures.map(p=>`<option value="${p.id}" ${p.id===pic.id?'selected':''}>${esc(p.title)}</option>`).join('')}</select></label><div class="cf-picture-layout"><nav class="cf-picture-list" aria-label="节点截图选择">${cfPictures.map(p=>`<button type="button" data-cf-picture="${p.id}" ${p.id===pic.id?'aria-current="true"':''}>${esc(p.title)}</button>`).join('')}</nav><section class="cf-picture-detail"><h2>${esc(pic.title)}</h2><div class="cf-picture-body"><div>${pic.id==='ksampler'?`<div class="cf-shot-anatomy" data-ui>${cfPictureFigure(pic,false,part)}</div>`:cfPictureFigure(pic)}<button class="secondary" data-cf-picture-open="${pic.id}">放大查看细节</button></div><div class="cf-picture-notes">${pic.id==='ksampler'?`<h3>对照三个位置</h3><div class="cf-picture-parts">${Object.entries(cfPictureParts).map(([id,p])=>`<button type="button" data-cf-picture-part="${id}" aria-pressed="${id===cfPicturePart}">${p.label}</button>`).join('')}</div><p class="cf-picture-part-note" role="status">${esc(part.text)}</p>`:''}<h3>看图时先问</h3><ol>${pic.notes.map(n=>`<li>${esc(n)}</li>`).join('')}</ol><p class="cf-note">图上的模型名、seed、步数等属于当时的示例，不能自动套用到你的生成任务。页面上的中文讲解与位置框为本站新增，原图文件未修改。</p></div></div></section></div>`;}
function cfPictureZoom(percent){const input=document.getElementById('cf-picture-zoom'),img=document.getElementById('cf-picture-large'),label=document.getElementById('cf-picture-scale');if(!img)return;const value=Math.max(25,Math.min(300,Number(percent)||100));img.style.width=value+'%';if(input)input.value=String(value);if(label)label.textContent=value+'%';}
function cfFitPicture(){const img=document.getElementById('cf-picture-large'),viewport=document.getElementById('cf-picture-viewport'),pic=cfPicture(img?.dataset.picture);if(!pic||!viewport)return;const width=viewport.clientWidth||600,height=viewport.clientHeight||480;cfPictureZoom(Math.max(25,Math.min(100,Math.floor(100*Math.min(1,height/(pic.height*width/pic.width))/5)*5)));}
function cfOpenPicture(id){const pic=cfPicture(id);if(!pic)return;let dialog=document.getElementById('cf-picture-dialog');if(!dialog){dialog=document.createElement('dialog');dialog.id='cf-picture-dialog';dialog.className='cf-picture-dialog';document.body.appendChild(dialog);}dialog.setAttribute('aria-labelledby','cf-picture-dialog-title');dialog.innerHTML=`<header><h2 id="cf-picture-dialog-title">${esc(pic.title)}</h2><button class="secondary" data-cf-picture-close>关闭截图</button></header><p>官方文档截图。放大后可滚动查看；手机也可在原图页双指缩放。</p><div class="cf-picture-zoom-controls"><label for="cf-picture-zoom">相对窗口宽度 <output id="cf-picture-scale">100%</output><input id="cf-picture-zoom" type="range" min="25" max="300" step="5" value="100"></label><button class="secondary" data-cf-picture-fit>适应窗口</button><a href="assets/comfy-screenshots/${pic.file}" target="_blank" rel="noopener noreferrer">打开原图</a></div><div class="cf-picture-viewport" id="cf-picture-viewport"><img id="cf-picture-large" data-picture="${pic.id}" src="assets/comfy-screenshots/${pic.file}" alt="${esc(pic.title)}，官方文档原图" width="${pic.width}" height="${pic.height}"></div><p class="cf-note"><a href="${pic.source}" target="_blank" rel="noopener noreferrer">原始出处：Comfy-Org/docs</a> · <a href="assets/comfy-screenshots/NOTICE.md" target="_blank">GPL-3.0 与来源说明</a>。这不是你的本机运行截图。</p>`;if(typeof dialog.showModal==='function'){if(!dialog.open)dialog.showModal();}else dialog.setAttribute('open','');cfFitPicture();}
function cfClosePicture(){const dialog=document.getElementById('cf-picture-dialog');if(dialog){if(typeof dialog.close==='function')dialog.close();else dialog.removeAttribute('open');}}

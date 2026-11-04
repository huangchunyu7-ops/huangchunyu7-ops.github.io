/* Original learning material. Source links explain product semantics; no model,
 * third-party prompt collection, private workflow or userscript is embedded. */
Object.assign(cfSources,{
 naiBasics:['NovelAI 官方：提示词基础','https://docs.novelai.net/en/image/basics/'],
 naiStyle:['NovelAI 官方：媒介与画风','https://docs.novelai.net/en/image/tutorial-artstyles/'],
 naiWeight:['NovelAI 官方：加强与减弱','https://docs.novelai.net/en/image/strengthening-weakening/'],
 naiUC:['NovelAI 官方：不希望出现的内容','https://docs.novelai.net/en/image/undesiredcontent/'],
 naiMulti:['NovelAI 官方：多角色提示','https://docs.novelai.net/en/image/multiplecharacters/'],
 naiVibe:['NovelAI 官方：Vibe Transfer','https://docs.novelai.net/en/image/vibetransfer/'],
 naiSeed:['NovelAI 官方：Seed 与复现','https://docs.novelai.net/en/image/seed/']
});
const cfNovelRows=[
 ['nai-start','NovelAI 提示词','先分清服务、模型和提示词方法','能解释为什么学到的构图方法可以迁移，语法和 seed 却不能照搬。','会区分提示词与生成模型。',
 'NovelAI 是提供图像生成功能的服务，ComfyUI 是组织节点与模型的工具。一个标签管理开源项目不等于公开了 NovelAI 的模型权重。先选清楚实际使用的模型，再核对语法。本站把故事设计和产品用法分开：场景、动作、光线可以作为创作思路；权重写法、参考功能和采样参数按目标实现核对。',
 '创作目标：雨后车站，一位成年旅人停下整理旧地图\nNovelAI：按当前模型的提示、角色框与 UC 填写\nComfyUI：选择合法可用的模型与配套编码器，再按该实现改写文本\n同提示、同 seed，跨平台也不保证同图',
 ['看到“NovelAI 标签管理器开源”，可以推出什么？','可以学习它如何组织标签，不能据此认为模型权重开放',['下载管理器就获得相同模型','改一下 seed 就能跨平台逐像素复现'],'工具源码、模型权重与生成服务是不同对象。'],
 ['从 NovelAI 迁移到 ComfyUI 时先核对什么？','目标模型、编码器与提示语法',['直接把所有花括号和参数照搬','把所有提示词重复十次'],'先确认谁解释这段文本，再比较图像。'],null,'naiBasics'],
 ['nai-story','NovelAI 提示词','故事感：把抽象情绪变成可见事件','能用人物、动作、环境线索写出一个能被画出来的瞬间。','先能写清画面主体。',
 '下面是本站的创作练习框架，不是 NovelAI 的效果公式：谁在何处，正在做什么，什么道具或痕迹暗示了前后经过。把“很孤独”改成独自等车、握着未寄出的信、空椅和远去的车灯。每个细节都要能在画面里检查。一个镜头优先保留一个主要动作，避免把整段小说和多个时间点塞进单张图。',
 '空泛：beautiful, emotional, cinematic\n可观察：an adult traveler waiting alone at a quiet station, holding an unopened letter, empty benches, a departing train in the distance\n验收：人物在等候吗？信能看见吗？远处列车是否可辨？\n这是原创待验证示例，不是运行成品',
 ['哪个描述更适合检验“等候的故事感”？','握着信坐在空站台，望向远处轨道',['故事感拉满，氛围无敌','把 best quality 重复六次'],'具体动作与环境线索才有可检查的落点。'],
 ['单张图想表现“来站、告别、上车、抵达”，先怎样处理？','选一个关键瞬间，其他时刻拆成分镜',['同时写四个动作，模型必然按序表现','只增加分辨率'],'单张画面与时间序列的表达能力不同。'],null,'naiBasics'],
 ['nai-light','NovelAI 提示词','氛围感：让光线、天气和镜头服务同一情境','能把情绪目标拆成可比较的光线与构图选择。','先写清一个主要事件。',
 '本站练习先保留同一事件，再分别尝试柔和晨光、傍晚逆光、雨夜店窗。中景便于读人物动作与环境，特写强调局部，远景展示人与空间的关系；这些是构图意图，不是模型必然遵守的保证。媒介词会影响整体观感，例如 watercolor (medium)。别把清晨、正午、夜晚全塞进同一地点；也别一边要求完整场景一边无意排除背景。',
 '主体与事件固定：旅人在站台读地图\nA 光线意图：soft morning light\nB 光线意图：warm window light, rainy night\n本轮只比较光线组；镜头、模型、尺寸与 seed 保持一致\n逐项看：主体可读、光源方向、背景线索、冷暖关系',
 ['想知道氛围变化是否来自光线，怎样比较？','固定其他条件，只改光线组',['连人物、镜头和 seed 一起换','只看哪张尺寸更大'],'一次改变一组创作变量，更容易理解效果。'],
 ['要表现人物与空站台的关系，哪个起点更合适？','先尝试能同时容纳人物和环境的中远景',['只写面部极近特写，保证环境完整','同时要求所有景别'],'景别要服务当前要交代的信息。'],null,'naiStyle'],
 ['nai-weight','NovelAI 提示词','权重语法：先看模型版本，再加强一小段','能区分普通标签、括号权重和数值强调。','已能写出简单无权重的描述。',
 'NovelAI 的花括号用于加强，方括号用于减弱，一层约为乘以或除以 1.05。数值强调使用“数值::内容::”，官方说明适用于 V4 及以上；负数强调适用于 V4.5 及以上。权重不等于出现概率，也不是越大越好。先验证未加权版本，再对一个需要强调的概念做小范围试验。目标平台不同时，重新核对解析器。',
 '普通：rain, station\n加强：{rain}, station\n减弱：[rain], station\n数值写法（V4+）：1.2::rain::, station\n结束的 :: 关闭本段数值强调，不要把后续所有词意外带进去',
 ['1.2::rain:: 能解读为“下雨概率 120%”吗？','不能，它是提示强调权重',['能，百分比就是概率','等于 1.2 秒下雨'],'权重影响模型解释，不能当概率或时间。'],
 ['把 NovelAI 的 {rain} 放进另一个工具前，应先做什么？','查目标工具怎样解释括号与权重',['默认任何工具都采用同一规则','只把花括号换成中文标点'],'写法相似也不证明解析语义相同。'],null,'naiWeight'],
 ['nai-uc','NovelAI 提示词','负面词与质量预设：先定位，再做删改','能发现负面词正在排除自己想要的画面。','已理解正面提示与权重。',
 'Undesired Content（UC）用于表达希望避开的内容；预设也会影响画面。先记录当前预设，针对已经观察到的问题加词。想要柔和雾气或远景景深时，不要未经比较就堆一整页排除词；想要留白时也要检查预设中是否排除了负空间。正面与负面相互冲突时，增加步数通常不能解释冲突。不要把网上所有“质量词”当成各版本通用必填项。',
 '目标：雨夜窗外有薄雾\n检查：正面描述、UC、自定义模板、当前质量预设\n实验 A：现有设置\n实验 B：只移除可能压制薄雾的那一项\n记录雾气、主体清晰度和副作用，再决定保留什么',
 ['想要留白却一直挤满画面，值得核对哪项？','UC 与预设是否排除了负空间等目标元素',['只把 seed 逐个加一','直接断言模型不支持留白'],'预设也是条件的一部分，应与目标一起检查。'],
 ['抄来很长的负面词表，最合理的做法是什么？','先理解与当前问题的关系，再分组对照验证',['任何词都保留，越多越好','与正面描述冲突也没关系'],'负面内容也会改变创作方向。'],null,'naiUC'],
 ['nai-multi','NovelAI 提示词','双人叙事：场景共用，角色描述分开','能区分基础提示与角色提示，减少属性串到别人身上。','会写一个人物和一个场景。',
 '官方 V4 及以上的多角色方式，把场景、风格等放到基础提示，把个人外观、服装与动作放到各自的角色提示。位置和自然语言关系可一起辅助构图；它们仍需要检查，不保证每次严格遵从。本站先练两位成年旅人递还地图，不在基础框混写一大串相互冲突的个人属性。角色颜色串位时先检查框归属、顺序、位置与描述。',
 '基础意图：two adult travelers at a station, one returning a map to the other\n角色 A 意图：adult traveler, blue coat, holding a folded map\n角色 B 意图：adult traveler, brown coat, reaching out\n这些是三个输入框的写作示例，不是合成一个长串后自动分角色',
 ['两个人的外套颜色常串位，先检查什么？','属性是否分进对应角色框，以及位置与顺序',['只把颜色词全放基础框再重复','只增加图像锐化'],'角色归属需要结构清楚。'],
 ['基础提示优先承担什么？','共同场景、风格与关系',['替每个人混写全部外观','只放下载文件名'],'共同内容与个人内容分开更方便修改与诊断。'],null,'naiMulti'],
 ['nai-vibe','NovelAI 提示词','氛围参考：Vibe Transfer 迁移了什么','能区分视觉参考与身份、动作精确复制。','先会不带参考图的文本实验。',
 'Vibe Transfer 把输入图作为视觉灵感，可以迁移色彩、风格等线索，但也可能把不想要的背景带进来。Reference Strength 与 Information Extracted 控制的不是同一件事；前者偏向参考影响强弱，后者影响提取的信息。官方对 V4+ 的说明指出，降低提取信息时，高频纹理会先减少。先看默认值，再一次改一个设置；不能把氛围参考当作身份锁定或精确姿势保证。',
 '参考：自己有权使用的一张冷色雨夜街景\n目标：相似冷暖关系，但保留当前站台与旅人\n观察：颜色 / 笔触 / 背景是否被带走 / 人物是否变样\n只改参考强度，再比较；下一轮才讨论提取信息',
 ['参考图的白背景也出现在成品，应该怎样判断？','参考可能同时带入背景等线索',['Vibe 只传颜色，所以不可能','这是 seed 一定无效'],'要逐项检查参考实际迁移了什么。'],
 ['降低 Information Extracted 等于“人物相似度百分比降低”吗？','不等于，它不定义身份相似度百分比',['等于，所有参考参数都代表相似度','等于减少输出图片数量'],'名称、功能与验收指标不能混用。'],null,'naiVibe'],
 ['nai-ab','NovelAI 提示词','从好看一张，到能复查的提示实验','能用固定记录、单变量和多 seed 复查总结自己的规律。','已经练过动作、光线、权重和 UC。',
 '先写验收目标，再记录实际模型版本、完整提示、角色框、UC、质量预设、尺寸、seed、采样设置与参考图。A/B 初查固定这些条件，只改变一组词；找到候选后换多个已记录 seed 复查，避免只挑偶然好图。本站文本拼装器只输出写作草稿，不调用 NovelAI、不消耗额度，也不能预言生成质量。跨版本、平台和执行环境，不承诺相同 seed 得到逐像素相同结果。',
 '目标：看得出“雨后等候”，脸和信封可辨\nA：基础提示 + 柔和晨光；B：同基础 + 雨夜窗光\n固定：同一模型、尺寸、seed、UC 与参考条件\n记录：主体 / 动作 / 环境证据 / 光线一致性 / 副作用\n复查：再选 3 个记录过的 seed，比对失败率而不只晒最好一张',
 ['同一张好图能证明某个词在所有场景都有效吗？','不能，需要跨记录 seed 和相关场景复查',['能，截图已经是证明','只要画面很锐就能证明'],'经验应保留适用条件和失败案例。'],
 ['网站拼装出一段提示词后，已经完成了什么？','完成文本草稿，尚未生成或验证效果',['已经在云端跑完 NovelAI','已经复现 UP 主的作品'],'文本工具和生成服务有清楚的边界。'],null,'naiSeed']
];
const cfNovelProjects=[
 {name:'Danbooru / NovelAI 标签超市',url:'https://github.com/wfjsw/danbooru-diffusion-prompt-builder',license:'AGPL-3.0',use:'学习标签分类、中文释义、检索与组合界面。',limit:'仓库还含其他扩散工具的高级语法；不能把所有格式当作 NovelAI 当前语法。'},
 {name:'SD WebUI Tag Autocomplete',url:'https://github.com/DominikDoom/a1111-sd-webui-tagcomplete',license:'MIT',use:'学习输入时补全、标签翻译与别名检索。',limit:'这是 AUTOMATIC1111 WebUI 扩展，不是 ComfyUI 节点，也不是 NovelAI 官方插件。'},
 {name:'Ekphrasis',url:'https://github.com/LemburLab/ekphrasis',license:'MIT',use:'参考提示片段、模板占位与构图组合的组织方法。',limit:'社区用户脚本；本次只核对 README。未安装或审计运行代码；批量队列和费用估算不作为本站功能或官方规则。'}
];
const cfNovelGroups={
 scene:{label:'地点与痕迹',options:[['station','安静车站 · 空椅','at a quiet railway station, empty benches','用空椅和轨道交代空间，观察背景是否可辨。'],['cafe','打烊咖啡馆 · 叠起的椅子','outside a closing cafe, stacked chairs','叠起的椅子暗示营业结束，检查这一痕迹是否真的出现。'],['harbor','港口 · 远处船灯','at a quiet harbor, distant boat lights','用远处灯光建立前后景，避免只剩人物大头。']]},
 action:{label:'人物正在做什么',options:[['letter','握着未拆的信','holding an unopened letter, looking into the distance','信和视线是要检查的叙事证据，情绪解读仍由观看者决定。'],['map','停下读地图','reading a folded map','手、地图与视线要能支持“阅读”，不要只看画面锐度。'],['umbrella','收起湿伞','closing a wet umbrella','动作可能不稳定；检查伞的状态、手部与水滴。']]},
 light:{label:'本轮光线方案',options:[['morning','柔和晨光','soft morning light','检查光源方向与脸部可读性，不同时加入雨夜描述。'],['sunset','傍晚逆光','sunset, backlighting','检查轮廓光和暗部，不把逆光理解为人脸一定全黑。'],['rain','雨夜窗光','rainy night, warm window light, wet ground','暖光与湿地反射是目标，注意是否出现多余窗户或光源。']]},
 shot:{label:'镜头距离',options:[['medium','中景 · 人与道具','medium shot','先读清主要动作，环境仍需要留一点可见线索。'],['wide','远景 · 人与环境','wide shot','比较人物在空间中的比例；远景不保证面部细节可辨。'],['close','特写 · 局部情绪','close-up','适合观察表情或道具；要接受环境信息可能减少。']]}
};
let cfNovelState={scene:'station',action:'letter',light:'morning',shot:'medium'};
function cfNovelSelected(state=cfNovelState){return Object.entries(cfNovelGroups).map(([id,g])=>({id,label:g.label,row:g.options.find(o=>o[0]===state[id])||g.options[0]}));}
function cfNovelPrompt(state=cfNovelState){const s=cfNovelSelected(state);return ['an adult traveler',...s.map(x=>x.row[2])].join(', ');}
function cfNovelOutputHTML(){return `<h3>这是一份待验证的写作草稿</h3><label for="cf-nai-prompt">正面描述 · 可选中复制<textarea id="cf-nai-prompt" readonly rows="5">${esc(cfNovelPrompt())}</textarea></label><div class="cf-nai-breakdown">${cfNovelSelected().map(x=>`<article><h4>${esc(x.label)}：${esc(x.row[1])}</h4><code>${esc(x.row[2])}</code><p>${esc(x.row[3])}</p></article>`).join('')}</div><p class="cf-note" role="status">这里只组合文本，不生成图片。以上词组混合自然语言和标签式描述；请在实际模型中核对提示并对照生成。未在 NovelAI 运行，不能当成效果证明。</p>`;}
function cfNovelHTML(){const lessons=hubCurriculum.comfy.filter(c=>c.section==='NovelAI 提示词');return `<section class="cf-nai-intro"><h2>把“有故事”写成看得见的瞬间</h2><p>先确定人物在做什么，再用环境痕迹、光线和镜头把这一刻说清楚。下面是本站原创学习框架，结合官方用法编写；没有保证出图效果的万能词表。</p><p>NovelAI 服务与本地 ComfyUI 分开理解：可以迁移创作思路，模型、权重语法、参考方式与 seed 不能直接等同。</p><button class="primary" data-hub="lesson" data-track="comfy" data-index="${hubCurriculum.comfy.indexOf(lessons[0])}">从提示词第 1 课开始</button></section><section class="cf-panel"><h2>先拼一个瞬间，再读每组词的职责</h2><p>四项分别改动。对比时只动一项，并在实际生成端固定其他设置。</p><div class="cf-nai-builder"><div class="cf-nai-controls">${Object.entries(cfNovelGroups).map(([id,g])=>`<label for="cf-nai-${id}">${g.label}<select id="cf-nai-${id}" data-cf-nai="${id}">${g.options.map(o=>`<option value="${o[0]}" ${cfNovelState[id]===o[0]?'selected':''}>${o[1]}</option>`).join('')}</select></label>`).join('')}</div><div id="cf-nai-output">${cfNovelOutputHTML()}</div></div></section><section class="cf-course-list"><h2>按顺序学习：基础 → 叙事 → 控制 → 验证</h2>${lessons.map((c,i)=>`<article class="cf-course-row"><div><h3>${i+1}. ${esc(c.title)}</h3><p>${esc(c.summary)}</p></div><button class="text-button" data-hub="lesson" data-track="comfy" data-index="${hubCurriculum.comfy.indexOf(c)}">学这一课 →</button></article>`).join('')}</section><section class="cf-panel"><h2>公开资料与开源项目怎么用</h2><p>核对日期：2026-11-05。以下项目仅作为学习方向链接，未复制代码、整库标签或示例作品，也没有安装到你的设备。</p>${cfNovelProjects.map(p=>`<article class="cf-resource-row"><h3><a href="${p.url}" target="_blank" rel="noopener noreferrer">${esc(p.name)}</a> <small>${p.license}</small></h3><p>${esc(p.use)}</p><small>${esc(p.limit)}</small></article>`).join('')}<details><summary>官方用法：按当前模型版本复查</summary><ul>${Object.entries(cfSources).filter(([k])=>k.startsWith('nai')).map(([,s])=>`<li><a href="${s[1]}" target="_blank" rel="noopener noreferrer">${s[0]}</a></li>`).join('')}</ul></details><details><summary>你提供的 Miorning 网站：正文尚未取得</summary><p>本次公开抓取返回 HTTP 412，尚未读到正文或取得视频字幕。这里没有声称提取了该作者的提示词或教程；当前课程依据上面的官方资料与本站原创示例。</p><a href="https://www.bilibili.com/toy/miorning/index.html?spm_id_from=333.40216.45060695783424.0" target="_blank" rel="noopener noreferrer">打开你提供的参考地址</a></details></section>`;}
document.addEventListener('change',e=>{const key=e.target.dataset?.cfNai,g=Object.hasOwn(cfNovelGroups,key)?cfNovelGroups[key]:null;if(g&&g.options.some(o=>o[0]===e.target.value)){cfNovelState[key]=e.target.value;const output=document.getElementById('cf-nai-output');if(output)output.innerHTML=cfNovelOutputHTML();}});

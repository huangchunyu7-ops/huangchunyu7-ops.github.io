const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path'),crypto=require('node:crypto'),vm=require('node:vm');
const {harness}=require('./hub.cjs'),root=path.join(__dirname,'../dist');
const source=JSON.parse(fs.readFileSync(path.join(root,'assets/comfy-screenshots/sources.json'),'utf8'));
for(const row of source){const bytes=fs.readFileSync(path.join(root,'assets/comfy-screenshots',row.file));assert.equal(bytes.length,row.bytes);assert.equal(crypto.createHash('sha256').update(bytes).digest('hex'),row.sha256,'official screenshot must remain unmodified');}
(async()=>{
 const h=harness(),{q,document,change}=h;
 vm.runInContext('function learningRouteSnapshot(){return {view};}async function restoreLearningRoute(r){view=r.view;render();}',h.ctx);
 vm.runInContext(fs.readFileSync(path.join(root,'comfy-ui.js'),'utf8'),h.ctx);
 q("cfOpen('pictures')");assert.equal(q('cfPictures.length'),9);assert.equal(document.querySelectorAll('[data-cf-picture]').length,9);assert(document.querySelector('img').getAttribute('src').includes('ksampler.png'));
 await change({id:'cf-picture-select',value:'vae'});assert.equal(q('cfPictureId'),'vae');assert(document.querySelector('main').textContent.includes('VAE Decode'));
 assert.equal(q("cfPictureForNode('LoraLoader').id"),'lora');assert.equal(q("cfPictureForNode('LoraLoaderModelOnly')"),undefined);assert(q("cfNodePictureHTML({type:'MiniMaxH3MotionContextClipStream'}).includes('暂无')"));
 q("cfOpenPicture('states')");let dialog=document.getElementById('cf-picture-dialog');assert(dialog.hasAttribute('open'));assert(dialog.textContent.includes('不是你的本机运行截图'));assert(dialog.querySelector('img').getAttribute('src').includes('states.jpg'));
 q('cfPictureZoom(250)');assert.equal(document.getElementById('cf-picture-large').style.width,'250%');q('cfPictureZoom(999)');assert.equal(document.getElementById('cf-picture-large').style.width,'300%');q('cfClosePicture()');assert(!dialog.hasAttribute('open'));
 q("openHubLesson('comfy',0)");assert(q("cfPictureLessonHTML({comfySample:'sdxl'}).includes('workflow.jpg')"));assert.equal(q('cfPictureLessonHTML({})'),'');
 q("cfOpen('pictures');cfPictureId='lora'");assert.equal(q('learningRouteSnapshot().cfPictureId'),'lora');
 console.log('9 unmodified source assets, exact node matches, honest missing screenshots, lesson links, selection, modal zoom/close and route snapshots passed (DOM/state).');
})().catch(e=>{console.error(e);process.exitCode=1;});

/* Device-local bookmark; course engines own draft and completion evidence. */
let lastLearning=null,localProgressOK=true;
try{lastLearning=JSON.parse(localStorage.getItem('learning-resume-v1'));}catch{lastLearning=null;}
function resumeLesson(){
 if(!lastLearning)return null;
 const b=lastLearning;
 if(b.kind==='hub'){const index=hubCurriculum[b.track]?.findIndex(c=>c.id===b.id);if(index>=0&&hubUnlocked(b.track,index))return {...b,index,title:hubCurriculum[b.track][index].title};}
 if(b.kind==='base'){const index=courses.findIndex(c=>c.id===b.id);if(index>=0&&courseUnlocked(index))return {...b,index,title:courses[index].title};}
 if(b.kind==='python'){const index=pythonLessons.findIndex(c=>c.id===b.id);if(index>=0&&pythonUnlocked(index))return {...b,index,title:pythonLessons[index].title};}
 return null;
}
function rememberLearning(){
 let bookmark;
 if(view==='hub-course')bookmark={kind:'hub',track:hubTrack,id:activeHubLesson().id};
 if(view==='classroom'&&!lab)bookmark={kind:'base',id:current().id};
 if(view==='python-course')bookmark={kind:'python',id:pythonCurrent().id};
 if(!bookmark)return;
 lastLearning=bookmark;
 try{localStorage.setItem('learning-resume-v1',JSON.stringify(bookmark));localProgressOK=true;}catch{localProgressOK=false;}
}
const progressBaseHome=hubHome;
hubHome=function(){const b=resumeLesson();return progressBaseHome().replace('<main class="hub-main">','<main class="hub-main">'+(b?`<section class="section local-resume"><h2>继续上次学习</h2><p>${esc(b.title)}</p><p>课程进度、练习草稿和阅读页码保存在当前浏览器。</p><button class="primary" data-local-resume>回到上次学习的位置</button></section>`:''));};
const progressBaseRender=render;
render=function(){rememberLearning();progressBaseRender();if(['hub-course','classroom','python-course'].includes(view)){const note=document.createElement('p');note.className='small-note';note.setAttribute('role','status');note.textContent=localProgressOK?'学习进度自动保存在本机 · 同一浏览器重新打开后，可从首页继续上次学习。':'当前浏览器无法保存进度，请检查是否禁止了网站存储。';document.querySelector('main')?.append(note);}};
document.addEventListener('click',e=>{if(!e.target.closest('[data-local-resume]'))return;const b=resumeLesson();if(!b)return;if(b.kind==='hub')openHubLesson(b.track,b.index);else if(b.kind==='python')pythonOpen(b.index);else{restore(b.index);render();window.scrollTo({top:0,behavior:'instant'});}});
render();

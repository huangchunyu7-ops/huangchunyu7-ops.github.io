/* Keep the exam module inside the existing GitHub theme and history layer.
 * Question banks and exam progress remain browser-local and exportable. */
efPageNames.civil='EXAM PRACTICE';
const civilGithubSnapshot=learningRouteSnapshot;
learningRouteSnapshot=function(){const route=civilGithubSnapshot();if(view==='civil'){route.pane=civilPane;route.method=civilMethodId;route.category=civilRouteCategory;}return route;};
const civilGithubRestore=restoreLearningRoute;
restoreLearningRoute=async function(route){
 if(route?.view!=='civil')return civilGithubRestore(route);
 navigationRestoring=true;clearLearningPopovers();
 try{
  if(Civil.categories.includes(route.category))civilRouteCategory=route.category;
  civilMethodId=civilMethods.some(m=>m.id===route.method)?route.method:'';
  const panes=['home','papers','route','cues','methods','notebook','stats','teachers','resources','question','report'];
  civilGo(panes.includes(route.pane)?route.pane:'home');window.scrollTo({top:0,behavior:'instant'});
 }finally{navigationRestoring=false;navigationLastKey=JSON.stringify(learningRouteSnapshot());history.replaceState({learningRoute:learningRouteSnapshot()},'',location.href);}
};
const civilGithubRender=render;
render=function(){civilGithubRender();const card=document.querySelector('.subject-card[data-id="civil"] .card-link');if(card)card.textContent=civilMethods.length+' 张方法课 · 分层训练 ↗';};
render();

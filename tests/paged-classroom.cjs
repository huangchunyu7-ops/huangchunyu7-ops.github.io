const assert=require('node:assert/strict');const {harness}=require('./hub.cjs');const h=harness(),q=h.q;
q("openHubLesson('beginner',0)");assert(h.document.querySelector('.reading-sheet'));assert(!h.document.querySelector('[data-hub="read"]'));
q('readingPages[readingKey]=1;paintReading();saveReadingPages()');const savedKey=q('readingKey');assert.equal(q('readingPages[readingKey]'),1);
const restored=harness([...h.storage]);assert.equal(restored.q(`readingPages[${JSON.stringify(savedKey)}]`),1);
q('readingPages[readingKey]=readingSet.length-1;paintReading()');assert(h.document.querySelector('[data-hub="read"]'));assert(!q('hubAttempt.read'));
const terminal=q('terminalPages.map(p=>p.paragraphs.join(" ")).join(" ")');for(const term of ['root','UID','sudo','用户组','/home/student','家目录','根目录'])assert(terminal.includes(term),term);
for(const subject of ['network','japanese','agent','writing']){q(`openHubLesson('${subject}',0)`);assert(q('readingSet.length')>=3);assert(!h.document.querySelector('[data-hub="read"]'));}
q("hubState.completed.opswork=hubCurriculum.opswork.slice(0,2).map(c=>c.id);openHubLesson('opswork',2)");assert(q("readingSet.some(p=>p.title.includes('开源用法'))"));q('readingPages[readingKey]=readingSet.length-1;paintReading()');assert(h.document.querySelector('.course-endnotes').innerHTML.includes('https://github.com/tldr-pages/tldr'));assert(!h.document.querySelector('[data-resources]'));
q("restore(0);session.read=true;session.step=current().steps.length;session.selected=current().answer;session.quiz=true;learningTab='quiz';render()");assert(h.document.querySelector('.before-answer'));assert(h.document.querySelector('.after-answer'));assert(h.document.querySelector('.course-endnotes').innerHTML.includes('https://www.gnu.org/software/coreutils/manual/'));
q('session.quiz=false;render()');assert(!h.document.querySelector('.after-answer'));
q("hubSubject='python';view='subject';render()");assert.equal(h.document.querySelectorAll('.path-card:not([hidden])').length,4);assert(h.document.querySelector('.route-pager'));
q("view='roadmap';render()");assert.equal(h.document.querySelectorAll('.level-path li:not([hidden])').length,6);assert(h.document.querySelector('.route-pager'));
console.log('paged reading, persisted position, last-page entry, all-subject scaffolds, embedded open-source examples, valid endnotes, answer feedback and route pagination passed');

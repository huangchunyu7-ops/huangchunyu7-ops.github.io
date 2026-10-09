const assert=require('node:assert/strict');const {harness}=require('./hub.cjs');
let h=harness();h.q("openHubLesson('beginner',1)"); // Locked lessons cannot be bookmarked.
assert.equal(h.q('lastLearning'),null);
h.q("openHubLesson('beginner',0);readingPages[readingKey]=1;saveReadingPages();hubAttempt.draft='my saved draft';hubSave();view='hub';render()");
assert(h.document.querySelector('[data-local-resume]'));
h=harness([...h.storage]);assert.equal(h.q('view'),'hub');assert.equal(h.q('resumeLesson().id'),h.q('hubCurriculum.beginner[0].id'));
h.q("openHubLesson(resumeLesson().track,resumeLesson().index)");assert.equal(h.q('readingPages[readingKey]'),1);assert.equal(h.q('hubAttempt.draft'),'my saved draft');
assert.equal(h.q("explainSelection('')"),null);assert.equal(h.q("explainSelection('unrecognizedword')"),null);
h.q("showExplanation(explainSelection('pwd'))");assert(h.document.querySelector('#selection-explanation'));
h.q("showExplanation(explainSelection('没有解释的片段'))");assert(!h.document.querySelector('#selection-explanation'));
h.q("pythonOpen(0);view='hub';render()");assert.equal(h.q('resumeLesson().kind'),'python');
h.q("restore(0);render();view='hub';render()");assert.equal(h.q('resumeLesson().kind'),'base');
console.log('Local resume keeps stable course IDs, reading position and drafts; unknown fragments produce no popup.');

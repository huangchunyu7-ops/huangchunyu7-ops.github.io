const assert=require('node:assert/strict');const h=require('./hub.cjs').harness(),q=h.q;
assert.equal(q('operationsCatalog.length'),69);assert.equal(q('managementLessons.length'),12);
for(const c of q('hubCurriculum.opswork.filter(c=>c.id.startsWith("linux-"))')){
 assert(c.teachingPages.length>=6,c.id);assert(c.tasks.length>=2,c.id);
 if(c.tasks[0].type==='command')assert(q(`evaluateHubTask(hubCurriculum.opswork.find(c=>c.id===${JSON.stringify(c.id)}).tasks[0],${JSON.stringify(c.tasks[0].command)},new JobEngine()).ok`),c.id);
}
for(const [a,b] of [['ss -l -n -t -p','ss -lntp'],['firewall-cmd --list-all --zone=public','firewall-cmd --zone=public --list-all'],['tcpdump -n -i eth0 -c 3 port 8080','tcpdump -ni eth0 -c 3 port 8080']])assert(q(`commandEquivalent(${JSON.stringify(a)},${JSON.stringify(b)},new JobEngine())`),a);
for(const a of ['firewall-cmd --zone=home --list-all','tcpdump -ni eth1 -c 3 port 8080'])assert(!q(`evaluateHubTask({type:'command',command:${JSON.stringify(a.includes('firewall')?'firewall-cmd --zone=public --list-all':'tcpdump -ni eth0 -c 3 port 8080')},expected:''},${JSON.stringify(a)},new JobEngine()).ok`));
for(const track of q('Object.keys(hubCurriculum)'))for(const c of q(`hubCurriculum.${track}`))assert(c.teachingPages?.length||c.depthPages?.length,track+':'+c.id);
assert.equal(q('hubCurriculum.agent.flatMap(c=>c.tasks).filter(t=>t.type==="input").length'),0);
assert(q("hubCurriculum.network.find(c=>c.id==='diagnosis').depthPages.some(p=>p.paragraphs.join('').includes('星号'))"));
assert(q("hubCurriculum.japanese.find(c=>c.id==='N2-g5').depthPages.some(p=>p.paragraphs.join('').includes('婉拒'))"));
console.log('81 added Linux lessons; all subjects enriched; contextual cases and equivalent read-only syntax passed.');

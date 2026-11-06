const PROGRAMS={
 ul:{name:'Upper/Lower',days:[
  {id:'upper-a',name:'Upper A',kind:'upper',focus:'Strength',ex:[['Bench Press',4,'6-8'],['Barbell Row',4,'6-8'],['Overhead Press',3,'8-10'],['Lat Pulldown',3,'10-12'],['Lateral Raise',3,'12-15'],['Triceps Pushdown',3,'10-12'],['Barbell Curl',3,'10-12']]},
  {id:'lower-a',name:'Lower A',kind:'lower',focus:'Strength',ex:[['Back Squat',4,'5-8'],['Romanian Deadlift',3,'8-10'],['Leg Press',3,'10-12'],['Lying Leg Curl',3,'10-12'],['Standing Calf Raise',4,'10-15']]},
  {id:'upper-b',name:'Upper B',kind:'upper',focus:'Volume',ex:[['Incline Dumbbell Press',4,'8-10'],['Pull-Up',4,'6-10'],['Seated Dumbbell Press',3,'10-12'],['Seated Cable Row',3,'10-12'],['Face Pull',3,'15-20'],['Hammer Curl',3,'10-12'],['Overhead Triceps Extension',3,'10-12']]},
  {id:'lower-b',name:'Lower B',kind:'lower',focus:'Volume',ex:[['Deadlift',3,'3-5'],['Bulgarian Split Squat',3,'8-10'],['Hip Thrust',3,'8-12'],['Leg Extension',3,'12-15'],['Seated Calf Raise',3,'12-15']]}
 ]},
 ppl:{name:'PPL',days:[
  {id:'ppl-push',name:'Push',kind:'upper',focus:'Chest, shoulders, triceps',ex:[['Bench Press',4,'6-8'],['Overhead Press',3,'8-10'],['Incline Dumbbell Press',3,'8-10'],['Lateral Raise',3,'12-15'],['Triceps Pushdown',3,'10-12'],['Overhead Triceps Extension',3,'10-12']]},
  {id:'ppl-pull',name:'Pull',kind:'upper',focus:'Back, rear delts, biceps',ex:[['Barbell Row',4,'6-8'],['Pull-Up',3,'6-10'],['Lat Pulldown',3,'10-12'],['Seated Cable Row',3,'10-12'],['Face Pull',3,'15-20'],['Barbell Curl',3,'10-12'],['Hammer Curl',3,'10-12']]},
  {id:'ppl-legs',name:'Legs',kind:'lower',focus:'Quads, hamstrings, calves',ex:[['Back Squat',4,'5-8'],['Romanian Deadlift',3,'8-10'],['Leg Press',3,'10-12'],['Lying Leg Curl',3,'10-12'],['Leg Extension',3,'12-15'],['Standing Calf Raise',4,'10-15']]}
 ]},
 w531:{name:'5/3/1',days:[
  {id:'531-ohp',name:'Press',kind:'upper',focus:'5/3/1 · Overhead Press',main:'ohp',ex:[['Overhead Press',3,'531'],['Pull-Up',5,'5-10'],['Lateral Raise',3,'12-15']]},
  {id:'531-dl',name:'Deadlift',kind:'lower',focus:'5/3/1 · Deadlift',main:'dl',ex:[['Deadlift',3,'531'],['Bulgarian Split Squat',3,'8-10'],['Lying Leg Curl',3,'10-12']]},
  {id:'531-bench',name:'Bench',kind:'upper',focus:'5/3/1 · Bench Press',main:'bench',ex:[['Bench Press',3,'531'],['Barbell Row',5,'8-10'],['Triceps Pushdown',3,'10-12']]},
  {id:'531-squat',name:'Squat',kind:'lower',focus:'5/3/1 · Back Squat',main:'squat',ex:[['Back Squat',3,'531'],['Romanian Deadlift',3,'8-10'],['Standing Calf Raise',4,'10-15']]}
 ]}
};
const ALL_DAYS=Object.values(PROGRAMS).flatMap(p=>p.days);
let PROGRAM=PROGRAMS.ul.days;
const MAIN={ohp:'Overhead Press',dl:'Deadlift',bench:'Bench Press',squat:'Back Squat'};
const TM_STEP={ohp:5,bench:5,dl:10,squat:10};
const WEEKS={1:{label:'Week 1 · 5s',sets:[[.65,'5'],[.75,'5'],[.85,'5+']]},2:{label:'Week 2 · 3s',sets:[[.70,'3'],[.80,'3'],[.90,'3+']]},3:{label:'Week 3 · 5/3/1',sets:[[.75,'5'],[.85,'3'],[.95,'1+']]},4:{label:'Week 4 · Deload',sets:[[.40,'5'],[.50,'5'],[.60,'5']]}};
const SET_KEY='ironlog-settings-v1';
const r5=n=>Math.round(n/5)*5;
/* program names → exercise library names (exercises-dataset, MIT) */
const ALIAS={'Bench Press':'barbell bench press','Barbell Row':'barbell bent over row','Overhead Press':'barbell standing close grip military press','Lat Pulldown':'cable lat pulldown full range of motion',
  'Lateral Raise':'dumbbell lateral raise','Triceps Pushdown':'cable pushdown','Barbell Curl':'barbell curl','Back Squat':'barbell full squat','Romanian Deadlift':'barbell romanian deadlift',
  'Leg Press':'sled 45° leg press (side pov)','Lying Leg Curl':'lever lying leg curl','Standing Calf Raise':'lever standing calf raise','Incline Dumbbell Press':'dumbbell incline bench press',
  'Pull-Up':'pull-up','Seated Dumbbell Press':'dumbbell seated shoulder press','Seated Cable Row':'cable low seated row','Face Pull':'cable standing rear delt row (with rope)',
  'Hammer Curl':'dumbbell hammer curl','Overhead Triceps Extension':'dumbbell seated triceps extension','Deadlift':'barbell deadlift','Bulgarian Split Squat':'dumbbell single leg split squat',
  'Hip Thrust':'barbell glute bridge','Leg Extension':'lever leg extension','Seated Calf Raise':'lever seated calf raise'};
let LIB=null,libLoading=null;
const cap=s=>s.replace(/(^|[\s(\-])([a-z])/g,(m,a,b)=>a+b.toUpperCase());
function loadLib(){if(LIB||libLoading)return libLoading;libLoading=fetch('exercises.json').then(r=>r.json()).then(j=>{LIB=j.map(x=>({name:x[0],part:x[1],target:x[2],equip:x[3],sec:x[4],steps:x[5],gif:x[6]}));return LIB}).catch(()=>{LIB=[];return LIB});return libLoading}
function libFor(name){if(!LIB)return null;const k=(ALIAS[name]||name).toLowerCase();return LIB.find(x=>x.name===k)||null}
function searchLib(q){q=q.toLowerCase().trim();if(!LIB||q.length<2)return[];const words=q.split(/\s+/);
  return LIB.filter(x=>{const h=(x.name+' '+x.target+' '+x.equip+' '+x.part);return words.every(w=>h.includes(w))})
    .sort((a,b)=>(a.name.startsWith(q)?0:1)-(b.name.startsWith(q)?0:1)||a.name.length-b.name.length).slice(0,8)}
const DRAFT_KEY='ironlog-draft-v1';
const S={swap:null,settings:{program:'ul',tm:{},week:1},info:new Set(),tab:'log',workouts:[],body:[],db:null,canWrite:true,ready:{w:false,b:false},draft:null,discardArm:false,confirmDel:null,progEx:null,saving:false};

/* ---------- helpers ---------- */
const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const pad=n=>String(n).padStart(2,'0');
const today=()=>{const d=new Date();return d.getFullYear()+'-'+pad(d.getMonth()+1)+'-'+pad(d.getDate())};
const parseD=s=>{const [y,m,d]=s.split('-').map(Number);return new Date(y,m-1,d)};
const fmtD=(s,opt={weekday:'short',month:'short',day:'numeric'})=>parseD(s).toLocaleDateString('en-US',opt);
const short=s=>fmtD(s,{month:'short',day:'numeric'});
const e1rm=(w,r)=>r<=1?w:w*(1+r/30);
const fmtN=n=>Number.isInteger(n)?String(n):n.toFixed(1);
const dayById=id=>ALL_DAYS.find(d=>d.id===id);
const sortedW=()=>[...S.workouts].sort((a,b)=>(b.date+(b.savedAt||'')).localeCompare(a.date+(a.savedAt||'')));
const sortedB=()=>[...S.body].sort((a,b)=>a.date.localeCompare(b.date));
function store(k,v){try{v===null?localStorage.removeItem(k):localStorage.setItem(k,JSON.stringify(v))}catch(e){}}
function load(k){try{const v=localStorage.getItem(k);return v?JSON.parse(v):null}catch(e){return null}}
function setStatus(t,bad){const el=$('#status');el.textContent=t;el.classList.toggle('bad',!!bad)}

function lastFor(name){
  for(const w of sortedW()){const ex=(w.exercises||[]).find(e=>e.name===name);if(ex&&ex.sets&&ex.sets.length)return{date:w.date,sets:ex.sets}}
  return null;
}
function nextDayId(){
  const w=sortedW().find(x=>PROGRAM.some(d=>d.id===x.dayId));if(!w)return PROGRAM[0].id;
  const i=PROGRAM.findIndex(d=>d.id===w.dayId);return PROGRAM[(i+1)%PROGRAM.length].id;
}
function volume(w){return (w.exercises||[]).reduce((t,e)=>t+e.sets.reduce((u,s)=>u+s.w*s.r,0),0)}
function setCount(w){return (w.exercises||[]).reduce((t,e)=>t+e.sets.length,0)}

/* ---------- draft ---------- */
function makeExercise(name,sets,reps){
  const last=lastFor(name);const w=last?String(Math.max(...last.sets.map(s=>s.w))):'';
  return{name,target:sets?sets+' × '+reps.replace('-','–'):'',reps:reps||'',sets:Array.from({length:sets||3},()=>({w,r:'',done:false}))};
}
function mainExercise(name,key){
  const wk=S.settings.week||1,W=WEEKS[wk],tm=S.settings.tm[key];
  return{name,main:key,week:wk,tm:tm||null,reps:'',target:W.sets.map(x=>x[1]).join(' / '),
    sets:W.sets.map(([pct,rep])=>({w:tm?String(r5(tm*pct)):'',r:'',goal:rep,done:false}))};
}
function startDraft(id){
  const d=dayById(id);
  S.draft={dayId:d.id,dayName:d.name,date:today(),notes:'',exercises:d.ex.map(([n,s,r])=>r==='531'?mainExercise(n,d.main):makeExercise(n,s,r))};
  saveDraft();render();window.scrollTo(0,0);
}
function saveDraft(){store(DRAFT_KEY,S.draft)}
function applySettings(){PROGRAM=(PROGRAMS[S.settings.program]||PROGRAMS.ul).days}
async function saveSettings(){store(SET_KEY,S.settings);applySettings();
  if(S.db&&S.canWrite){try{await S.db.doc('settings/main').set({...S.settings,savedAt:new Date().toISOString()})}catch(e){setStatus('Settings saved on this device only',true)}}}
function bestE1(name){let b=0;S.workouts.forEach(w=>(w.exercises||[]).forEach(e=>{if(e.name===name)e.sets.forEach(x=>{b=Math.max(b,e1rm(x.w,x.r))})}));return b}

/* ---------- rest timer ---------- */
let restEnd=0,restIv=null;
function startRest(sec=120){restEnd=Date.now()+sec*1000;$('#rest').hidden=false;tickRest();clearInterval(restIv);restIv=setInterval(tickRest,250)}
function tickRest(){const left=Math.round((restEnd-Date.now())/1000);const a=Math.abs(left);
  $('#rest-t').textContent=(left<0?'+':'')+Math.floor(a/60)+':'+pad(a%60);$('#rest').classList.toggle('over',left<0)}
function stopRest(){clearInterval(restIv);$('#rest').hidden=true}

/* ---------- charts ---------- */
function lineChart(pts,{unit='',red=false,label}={}){
  if(pts.length<2)return '<p class="muted small">Log at least two entries to see a trend.</p>';
  const W=600,H=220,L=48,R=16,T=14,B=30;
  const xs=pts.map(p=>parseD(p.x).getTime()),ys=pts.map(p=>p.y);
  let lo=Math.min(...ys),hi=Math.max(...ys);if(lo===hi){lo-=1;hi+=1}
  const span=hi-lo,step=niceStep(span/4);lo=Math.floor(lo/step)*step;hi=Math.ceil(hi/step)*step;
  const x0=Math.min(...xs),x1=Math.max(...xs);
  const sx=t=>L+(x1===x0?0.5:(t-x0)/(x1-x0))*(W-L-R),sy=v=>T+(1-(v-lo)/(hi-lo))*(H-T-B);
  let g='';for(let v=lo;v<=hi+1e-9;v+=step){const y=sy(v);g+=`<line class="grid" x1="${L}" x2="${W-R}" y1="${y}" y2="${y}"/><text x="${L-8}" y="${y+4}" text-anchor="end">${fmtN(+v.toFixed(2))}</text>`}
  const d=pts.map((p,i)=>(i?'L':'M')+sx(xs[i]).toFixed(1)+' '+sy(p.y).toFixed(1)).join(' ');
  const area=d+` L${sx(xs[xs.length-1]).toFixed(1)} ${H-B} L${sx(xs[0]).toFixed(1)} ${H-B} Z`;
  const dots=pts.length<=40?pts.slice(0,-1).map((p,i)=>`<circle class="pt" cx="${sx(xs[i]).toFixed(1)}" cy="${sy(p.y).toFixed(1)}" r="3.5"/>`).join(''):'';
  const lp=pts[pts.length-1],ex=sx(xs[xs.length-1]),ey=sy(lp.y);
  return `<svg class="chart${red?' red':''}" viewBox="0 0 ${W} ${H}" role="img" aria-label="${esc(label||'Trend')}">${g}
  <path class="area" d="${area}"/><path class="ln" d="${d}"/>${dots}<circle class="end" cx="${ex}" cy="${ey}" r="5.5"/>
  <text x="${L}" y="${H-8}">${short(pts[0].x)}</text><text x="${W-R}" y="${H-8}" text-anchor="end">${short(lp.x)}</text></svg>`;
}
function niceStep(raw){const p=Math.pow(10,Math.floor(Math.log10(raw||1)));const f=raw/p;return (f<=1?1:f<=2?2:f<=2.5?2.5:f<=5?5:10)*p}

/* ---------- stick-figure demos (original drawings) ---------- */
const BENCH='<line class="prop" x1="18" y1="66" x2="70" y2="66"/><line class="prop" x1="24" y1="66" x2="24" y2="92"/><line class="prop" x1="64" y1="66" x2="64" y2="92"/>';
const SEAT=(x1,x2,y)=>`<line class="prop" x1="${x1}" y1="${y}" x2="${x2}" y2="${y}"/><line class="prop" x1="${(x1+x2)/2}" y1="${y}" x2="${(x1+x2)/2}" y2="92"/>`;
const STAND={f:[50,92],k:[51,74],p:[50,56],s:[50,30]};
const POSES={
  bench:{props:BENCH,plate:'w',a:{s:[34,61],p:[60,62],k:[74,60],f:[80,90],e:[26,70],w:[34,50]},b:{s:[34,61],p:[60,62],k:[74,60],f:[80,90],e:[34,44],w:[34,26]}},
  incline:{props:'<line class="prop" x1="30" y1="52" x2="64" y2="72"/><line class="prop" x1="58" y1="70" x2="58" y2="92"/>',db:true,a:{s:[40,54],p:[60,68],k:[74,64],f:[78,92],e:[32,62],w:[42,46]},b:{s:[40,54],p:[60,68],k:[74,64],f:[78,92],e:[44,38],w:[46,22]}},
  ohp:{plate:'w',a:{...STAND,e:[56,40],w:[56,28]},b:{...STAND,e:[54,18],w:[52,6]}},
  seatpress:{props:SEAT(38,62,64),db:true,a:{s:[50,36],p:[50,62],k:[66,62],f:[66,90],e:[58,46],w:[57,34]},b:{s:[50,36],p:[50,62],k:[66,62],f:[66,90],e:[56,24],w:[53,12]}},
  row:{plate:'w',a:{f:[50,92],k:[56,76],p:[42,60],s:[70,48],e:[70,60],w:[70,74]},b:{f:[50,92],k:[56,76],p:[42,60],s:[70,48],e:[56,48],w:[64,62]}},
  cablerow:{props:SEAT(28,52,74),cable:[94,52],a:{s:[42,46],p:[40,72],k:[60,64],f:[76,76],e:[58,50],w:[72,52]},b:{s:[40,46],p:[40,72],k:[60,64],f:[76,76],e:[28,52],w:[46,52]}},
  facepull:{cable:[94,24],a:{...STAND,e:[64,32],w:[78,30]},b:{...STAND,e:[40,26],w:[56,22]}},
  pulldown:{props:SEAT(38,62,72),cable:[50,0],bar:true,a:{s:[50,46],p:[50,72],k:[68,70],f:[68,92],e:[50,30],w:[50,14]},b:{s:[50,46],p:[50,72],k:[68,70],f:[68,92],e:[38,52],w:[50,38]}},
  pullup:{props:'<line class="prop" x1="22" y1="10" x2="78" y2="10"/>',a:{w:[50,10],e:[50,20],s:[50,30],p:[50,56],k:[52,72],f:[50,88]},b:{w:[50,10],e:[38,18],s:[50,22],p:[50,48],k:[52,64],f:[50,80]}},
  squat:{plate:'s',a:{...STAND,e:[40,36],w:[46,30]},b:{f:[50,92],k:[68,74],p:[38,72],s:[54,46],e:[44,52],w:[50,46]}},
  rdl:{plate:'w',a:{...STAND,e:[51,46],w:[52,60]},b:{f:[50,92],k:[54,75],p:[40,58],s:[68,46],e:[68,58],w:[68,72]}},
  deadlift:{plate:'w',a:{...STAND,e:[51,46],w:[52,60]},b:{f:[50,92],k:[62,74],p:[38,68],s:[62,50],e:[62,64],w:[62,80]}},
  legpress:{props:'<line class="prop" x1="8" y1="58" x2="36" y2="78"/>',sled:true,a:{s:[14,54],p:[32,74],k:[46,48],f:[60,60],e:[20,66],w:[28,72]},b:{s:[14,54],p:[32,74],k:[54,56],f:[76,42],e:[20,66],w:[28,72]}},
  legcurl:{props:'<line class="prop" x1="12" y1="64" x2="78" y2="64"/><line class="prop" x1="20" y1="64" x2="20" y2="92"/><line class="prop" x1="70" y1="64" x2="70" y2="92"/>',a:{s:[22,60],p:[52,60],k:[72,60],f:[92,60],e:[18,70],w:[30,70]},b:{s:[22,60],p:[52,60],k:[72,60],f:[78,38],e:[18,70],w:[30,70]}},
  legext:{props:SEAT(28,62,66),a:{s:[36,38],p:[40,64],k:[62,64],f:[64,88],e:[38,52],w:[46,64]},b:{s:[36,38],p:[40,64],k:[62,64],f:[84,60],e:[38,52],w:[46,64]}},
  raise:{db:true,a:{f:[44,92],k:[46,74],f2:[56,92],k2:[54,74],p:[50,56],s:[50,30],e:[44,44],w:[42,58],e2:[56,44],w2:[58,58]},b:{f:[44,92],k:[46,74],f2:[56,92],k2:[54,74],p:[50,56],s:[50,30],e:[36,30],w:[24,30],e2:[64,30],w2:[76,30]}},
  curl:{plate:'w',a:{...STAND,e:[51,44],w:[53,60]},b:{...STAND,e:[51,44],w:[60,32]}},
  pushdown:{cable:[66,2],a:{...STAND,e:[53,46],w:[64,36]},b:{...STAND,e:[53,46],w:[58,62]}},
  ohtri:{props:SEAT(38,62,64),db:true,a:{s:[50,36],p:[50,62],k:[66,62],f:[66,90],e:[52,18],w:[38,26]},b:{s:[50,36],p:[50,62],k:[66,62],f:[66,90],e:[52,18],w:[54,4]}},
  calf:{props:'<line class="prop" x1="40" y1="93" x2="64" y2="93"/>',lift:6,a:{...STAND,e:[48,44],w:[50,58]},b:{...STAND,e:[48,44],w:[50,58]}},
  bss:{props:'<line class="prop" x1="10" y1="68" x2="30" y2="68"/><line class="prop" x1="20" y1="68" x2="20" y2="92"/>',db:true,a:{f:[64,92],k:[62,74],p:[48,58],s:[50,32],k2:[36,78],f2:[22,66],e:[50,46],w:[50,60]},b:{f:[64,92],k:[68,74],p:[46,70],s:[50,44],k2:[38,88],f2:[22,66],e:[50,58],w:[50,72]}},
  hipthrust:{props:'<line class="prop" x1="8" y1="64" x2="26" y2="64"/><line class="prop" x1="17" y1="64" x2="17" y2="92"/>',plate:'p',a:{s:[24,62],p:[44,82],k:[64,64],f:[68,92],e:[34,70],w:[44,78]},b:{s:[24,62],p:[46,62],k:[66,62],f:[68,92],e:[36,58],w:[46,58]}}
};
const PATTERN={'Bench Press':'bench','Barbell Row':'row','Overhead Press':'ohp','Lat Pulldown':'pulldown','Lateral Raise':'raise','Triceps Pushdown':'pushdown','Barbell Curl':'curl',
  'Back Squat':'squat','Romanian Deadlift':'rdl','Leg Press':'legpress','Lying Leg Curl':'legcurl','Standing Calf Raise':'calf','Incline Dumbbell Press':'incline','Pull-Up':'pullup',
  'Seated Dumbbell Press':'seatpress','Seated Cable Row':'cablerow','Face Pull':'facepull','Hammer Curl':'curl','Overhead Triceps Extension':'ohtri','Deadlift':'deadlift',
  'Bulgarian Split Squat':'bss','Hip Thrust':'hipthrust','Leg Extension':'legext','Seated Calf Raise':'calf'};
function patternFor(name){
  if(PATTERN[name])return PATTERN[name];const n=name.toLowerCase();
  const rules=[[/pull-?up|chin/,'pullup'],[/pulldown/,'pulldown'],[/leg press/,'legpress'],[/leg curl|hamstring curl/,'legcurl'],[/leg extension/,'legext'],[/calf/,'calf'],
    [/romanian|stiff|good morning/,'rdl'],[/deadlift/,'deadlift'],[/split squat|lunge/,'bss'],[/squat/,'squat'],[/hip thrust|glute bridge/,'hipthrust'],
    [/face pull|rear delt/,'facepull'],[/seated.*row|cable.*row/,'cablerow'],[/row/,'row'],[/pushdown/,'pushdown'],[/triceps? extension|skull/,'ohtri'],
    [/curl/,'curl'],[/raise|fly/,'raise'],[/incline/,'incline'],[/bench|chest press|push-?up|dip/,'bench'],[/military|overhead press|shoulder press/,'ohp']];
  for(const [re,p] of rules)if(re.test(n))return p;return null;
}
function stickSvg(name){const p=patternFor(name);if(!p)return '';
  return `<svg class="stick" viewBox="0 0 100 100" data-pat="${p}" role="img" aria-label="${esc(name)} demo">${POSES[p].props||''}<g class="fig"></g></svg>`}
const lerp=(a,b,t)=>[a[0]+(b[0]-a[0])*t,a[1]+(b[1]-a[1])*t];
function figMarkup(P,t){
  const q={};for(const k in P.a)q[k]=lerp(P.a[k],P.b[k]||P.a[k],t);
  if(P.lift){const dy=P.lift*t;for(const k in q)if(k!=='f')q[k]=[q[k][0],q[k][1]-dy]}
  const L=(...pts)=>`<polyline class="lim" points="${pts.map(p=>p[0].toFixed(1)+','+p[1].toFixed(1)).join(' ')}"/>`;
  const dx=q.s[0]-q.p[0],dy=q.s[1]-q.p[1],len=Math.hypot(dx,dy)||1,hx=q.s[0]+dx/len*9,hy=q.s[1]+dy/len*9;
  let o='';
  if(P.cable)o+=`<line class="prop" x1="${P.cable[0]}" y1="${P.cable[1]}" x2="${q.w[0].toFixed(1)}" y2="${q.w[1].toFixed(1)}"/>`;
  if(P.sled)o+=`<line class="prop" x1="${(q.f[0]-6).toFixed(1)}" y1="${(q.f[1]-9).toFixed(1)}" x2="${(q.f[0]+6).toFixed(1)}" y2="${(q.f[1]+9).toFixed(1)}"/>`;
  o+=L(q.p,q.k,q.f);if(q.k2)o+=L(q.p,q.k2,q.f2);
  if(P.lift)o+=L(q.f,[q.f[0]+6,q.f[1]-P.lift*t*0.6]);
  o+=L(q.s,q.p)+L(q.s,q.e,q.w);if(q.e2)o+=L(q.s,q.e2,q.w2);
  o+=`<circle class="head" cx="${hx.toFixed(1)}" cy="${hy.toFixed(1)}" r="6"/>`;
  if(P.bar)o+=`<line class="prop" x1="${(q.w[0]-16).toFixed(1)}" y1="${q.w[1].toFixed(1)}" x2="${(q.w[0]+16).toFixed(1)}" y2="${q.w[1].toFixed(1)}"/>`;
  if(P.plate){const c=q[P.plate];o+=`<circle class="plate" cx="${c[0].toFixed(1)}" cy="${c[1].toFixed(1)}" r="7"/>`}
  if(P.db)[q.w,q.w2].filter(Boolean).forEach(w=>{o+=`<rect class="db" x="${(w[0]-5).toFixed(1)}" y="${(w[1]-2.5).toFixed(1)}" width="10" height="5" rx="2"/>`});
  return o;
}
const RM=matchMedia('(prefers-reduced-motion: reduce)');
let animOn=false;
function animTick(now){
  const svgs=document.querySelectorAll('svg.stick');
  if(!svgs.length){animOn=false;return}
  const t=RM.matches?0.5:(1-Math.cos(now/2200*2*Math.PI))/2;
  svgs.forEach(s=>{const g=s.querySelector('.fig');if(g)g.innerHTML=figMarkup(POSES[s.dataset.pat],t)});
  requestAnimationFrame(animTick);
}
function startAnim(){if(animOn)return;animOn=true;requestAnimationFrame(animTick)}

/* ---------- views ---------- */
const emptyLoading=()=>`<div class="card empty"><b>Loading your log</b>Pulling saved workouts and weigh-ins.</div>`;

function programPicker(){
  return `<section class="stack"><div class="eyebrow">Program</div><div class="seg" role="group" aria-label="Program">${Object.entries(PROGRAMS).map(([k,p])=>
    `<button data-act="prog" data-id="${k}" aria-pressed="${S.settings.program===k}">${esc(p.name)}</button>`).join('')}</div></section>`;
}
function setup531(){
  if(S.settings.program!=='w531')return '';
  const tm=S.settings.tm,missing=Object.keys(MAIN).some(k=>!tm[k]);
  return `<section class="card stack"><div class="row" style="justify-content:space-between"><h2>5/3/1 setup</h2>
    <select id="w531-week" style="width:auto">${Object.entries(WEEKS).map(([k,w])=>`<option value="${k}" ${+k===+S.settings.week?'selected':''}>${w.label}</option>`).join('')}</select></div>
    <p class="muted small" style="margin:0">Training max is 90% of your true 1RM. Weights for the main lift come from it. After Squat day the week moves forward, and after the deload the training max goes up 5 lb (press, bench) or 10 lb (squat, deadlift).</p>
    <div class="form-grid tm-grid">${Object.entries(MAIN).map(([k,n])=>`<label>${esc(n)} TM<input id="tm-${k}" inputmode="decimal" value="${tm[k]||''}" placeholder="lb"></label>`).join('')}</div>
    <div class="row"><button class="btn primary" data-act="tm-save">Save training maxes</button><button class="btn" data-act="tm-fill">Fill from history</button></div>
    ${missing?'<p class="small" style="margin:0;color:var(--warn)">Add all four training maxes to get prescribed weights.</p>':''}
    <p class="muted small" id="tm-msg" hidden></p></section>`;
}
function viewLog(){
  if(S.draft)return viewSession();
  const nid=nextDayId(),nd=dayById(nid),last=sortedW()[0];
  return `${programPicker()}${setup531()}<section class="card next">
    <div class="eyebrow">Next in rotation${S.settings.program==='w531'?' · '+WEEKS[S.settings.week].label:''}</div>
    <div class="row" style="justify-content:space-between;align-items:flex-end">
      <div><div class="code">${esc(nd.name)}</div><div class="chip"><span class="dot ${nd.kind}"></span>${nd.focus} · ${nd.ex.length} exercises</div></div>
    </div>
    <p class="muted small" style="margin:0">${nd.ex.map(e=>esc(e[0])).join(' · ')}</p>
    <button class="btn primary block" data-act="start" data-id="${nid}" ${S.canWrite?'':'disabled'}>Start ${esc(nd.name)}</button>
    ${last?`<p class="muted small" style="margin:0">Last session: ${esc(last.dayName)} on ${fmtD(last.date)}</p>`:''}
  </section>
  <section class="stack">
    <h2>Pick a day</h2>
    <div class="days" style="grid-template-columns:repeat(${PROGRAM.length===3?3:2},minmax(0,1fr))">${PROGRAM.map(d=>`<button class="day${d.id===nid?' suggested':''}" data-act="start" data-id="${d.id}" ${S.canWrite?'':'disabled'}>
      <b>${esc(d.name)}</b><span class="tag"><span class="dot ${d.kind}"></span>${d.focus}</span></button>`).join('')}</div>
  </section>`;
}

function stepFor(name){const day=ALL_DAYS.find(d=>d.ex.some(x=>x[0]===name));const L=libFor(name);
  if(L&&/dumbbell|cable|band|kettlebell/.test(L.equip))return 5;return day&&day.kind==='lower'?10:5}
function exampleBlock(e,L){
  const n=e.sets.length,[lo,hi]=(e.reps||'').split('-');
  const ex=e.main?(e.tm?`${WEEKS[e.week].label}: ${WEEKS[e.week].sets.map(x=>Math.round(x[0]*100)+'%').join(', ')} of your ${e.tm} lb training max.${e.week<4?' On the last set, do as many clean reps as you can.':' Light week, no max-rep set.'}`
      :`Set a training max for ${e.name} on the Log tab and the weights fill in for you.`)
    :e.reps?`${n} sets of ${lo}${hi?'–'+hi:''} reps at one weight. When every set reaches ${hi||lo}, add ${stepFor(e.name)} lb next session.`
    :`${n} sets at one weight. Keep the reps steady, then add weight once they get easy.`;
  const demo=L&&L.gif?`<a class="demo" href="https://github.com/hasaneyldrm/exercises-dataset/blob/main/${encodeURI(L.gif)}" target="_blank" rel="noopener">Watch demo ↗</a>`:'';
  const chips=L?`<div class="chips"><span class="pill">${esc(cap(L.target))}</span><span class="pill soft">${esc(cap(L.equip))}</span></div>`:'';
  return `<div class="example"><div class="ex-top">${chips}${demo}</div><p><b>Example:</b> ${esc(ex)}</p></div>`;
}
const GOOD_EQ=['barbell','dumbbell','cable','leverage machine','body weight','smith machine','ez barbell','sled machine','kettlebell'];
function alternatives(e){
  const cur=libFor(e.name);if(!LIB||!cur)return null;
  const inDraft=new Set(S.draft.exercises.map(x=>x.name.toLowerCase()));
  return LIB.filter(x=>x.target===cur.target&&x.name!==cur.name&&GOOD_EQ.includes(x.equip)&&!/stretch|\(|v\. ?\d|female|male|pov/.test(x.name)&&!inDraft.has(cap(x.name).toLowerCase()))
    .map(x=>({x,score:(patternFor(cap(x.name))?0:2)+(lastFor(cap(x.name))?-3:0)+(x.equip===cur.equip?1:0)+x.name.length/40}))
    .sort((a,b)=>a.score-b.score).slice(0,6).map(o=>o.x);
}
function swapList(e,ei){
  const alts=alternatives(e);
  if(alts===null)return `<div class="swap muted small">${LIB?'No library match for this exercise, so there are no suggestions.':'Loading exercise library…'}</div>`;
  const cur=libFor(e.name);
  return `<div class="swap"><div class="eyebrow">Same target: ${esc(cur.target)}</div>${alts.length?alts.map(x=>`<button class="swap-opt" data-act="swapto" data-ei="${ei}" data-name="${esc(x.name)}">
    ${stickSvg(cap(x.name)).replace('class="stick"','class="stick sm"')}<span><b>${esc(cap(x.name))}</b><span class="muted small">${esc(cap(x.equip))}${x.sec.length?' · also '+esc(x.sec.slice(0,2).join(', ')):''}</span></span></button>`).join(''):'<p class="muted small" style="margin:0">No alternatives found.</p>'}</div>`;
}
function viewSession(){
  const D=S.draft,d=dayById(D.dayId);
  const exs=D.exercises.map((e,ei)=>{
    const last=lastFor(e.name);
    const lastTxt=last?`Last · ${short(last.date)}: `+last.sets.map(s=>`${fmtN(s.w)}×${s.r}`).join(' · '):'First time logging this';
    const rows=e.sets.map((s,si)=>`<div class="set${s.done?' done':''}">
      <span class="n num">${si+1}</span>
      <label class="field"><input id="w-${ei}-${si}" inputmode="decimal" type="text" aria-label="${esc(e.name)} set ${si+1} weight" data-ei="${ei}" data-si="${si}" data-k="w" value="${esc(s.w)}" placeholder="0"><span>lb</span></label>
      <label class="field"><input id="r-${ei}-${si}" inputmode="numeric" type="text" aria-label="${esc(e.name)} set ${si+1} reps" data-ei="${ei}" data-si="${si}" data-k="r" value="${esc(s.r)}" placeholder="${esc(s.goal||e.reps.split('-').pop()||'')}"><span>reps</span></label>
      <button class="check" data-act="done" data-ei="${ei}" data-si="${si}" aria-label="Mark set ${si+1} done" aria-pressed="${s.done}"><svg viewBox="0 0 24 24" fill="none" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7"/></svg></button>
    </div>`).join('');
    const L=libFor(e.name),open=S.info.has(e.name);
    const info=open?(L?`<div class="info"><div class="chips"><span class="pill">${esc(cap(L.target))}</span>${L.sec.slice(0,3).map(m=>`<span class="pill soft">${esc(cap(m))}</span>`).join('')}<span class="pill soft">${esc(cap(L.equip))}</span></div>
      <ol>${L.steps.map(s=>`<li>${esc(s)}</li>`).join('')}</ol></div>`:`<div class="info muted small">${LIB?'No library entry for this exercise.':'Loading exercise library…'}</div>`):'';
    return `<section class="ex"><div class="ex-head"><h3>${esc(e.name)}</h3>${stickSvg(e.name)}<span class="target">${esc(e.target)}</span></div>
      ${exampleBlock(e,L)}${info}<p class="last">${esc(lastTxt)}</p><div class="sets">${rows}</div>
      <div class="ex-actions"><button class="btn" data-act="addset" data-ei="${ei}">Add set</button>
      <button class="btn ghost" data-act="info" data-name="${esc(e.name)}" aria-expanded="${open}">${open?'Hide how-to':'How to'}</button>
      ${e.sets.length>1?`<button class="btn ghost" data-act="rmset" data-ei="${ei}">Remove set</button>`:''}
      <button class="btn ghost" data-act="swap" data-ei="${ei}" aria-expanded="${S.swap===ei}">${S.swap===ei?'Close':'Alternative'}</button>
      <button class="btn ghost" style="margin-left:auto" data-act="rmex" data-ei="${ei}">Drop</button></div>${S.swap===ei?swapList(e,ei):''}</section>`;
  }).join('');
  const done=D.exercises.reduce((t,e)=>t+e.sets.filter(s=>s.done).length,0),tot=D.exercises.reduce((t,e)=>t+e.sets.length,0);
  return `<div class="session-head"><div><div class="eyebrow"><span class="dot ${d?d.kind:''}" style="display:inline-block;vertical-align:middle;margin-right:6px"></span>${done} of ${tot} sets done</div><h2 style="font-size:34px">${esc(D.dayName)}</h2></div>
    <input type="date" id="sess-date" aria-label="Workout date" value="${esc(D.date)}"></div>
  ${exs}
  <section class="card stack"><label class="eyebrow" for="add-ex">Add an exercise</label>
    <div class="row"><input class="text-in" id="add-ex" autocomplete="off" placeholder="Search 1,300+ lifts: cable fly, chest dumbbell…" style="flex:1;min-width:0"><button class="btn" data-act="addex">Add</button></div>
    <div id="ex-results" class="results"></div>
    <label class="eyebrow" for="notes">Notes</label><textarea id="notes" placeholder="How it felt, pain, sleep…">${esc(D.notes)}</textarea>
  </section>
  <div class="stack"><button class="btn primary block" data-act="save" ${S.saving||!S.db?'disabled':''}>${S.saving?'Saving…':'Finish and save workout'}</button>
    <button class="btn danger block" data-act="discard">${S.discardArm?'Tap again to discard this session':'Discard session'}</button>
    ${!S.db?'<p class="muted small">Storage isn\'t connected, so this session can\'t be saved yet. Your inputs stay on this device.</p>':''}
    <p class="muted small" id="save-err" hidden></p></div>`;
}

function viewHistory(){
  if(!S.ready.w)return emptyLoading();
  const ws=sortedW();
  if(!ws.length)return `<div class="card empty"><b>No workouts yet</b>Finish a session on the Log tab and it shows up here.</div>`;
  const wk=ws.filter(w=>(Date.now()-parseD(w.date).getTime())<7*864e5).length;
  return `<div class="stats"><div class="stat"><div class="v num">${ws.length}</div><div class="d">Workouts logged</div></div>
    <div class="stat"><div class="v num">${wk}</div><div class="d">Last 7 days</div></div>
    <div class="stat"><div class="v num">${Math.round(ws.reduce((t,w)=>t+setCount(w),0)/ws.length)}</div><div class="d">Sets per session</div></div></div>
  <div class="hist">${ws.map(w=>{const d=dayById(w.dayId);return `<details><summary>
    <span><span class="when">${fmtD(w.date)}</span><br><span class="chip"><span class="dot ${d?d.kind:''}"></span>${esc(w.dayName||'Workout')} · ${setCount(w)} sets</span></span>
    <span class="vol num">${Math.round(volume(w)).toLocaleString()}<br><span class="muted small" style="font-family:var(--body);font-weight:500">lb volume</span></span></summary>
    <div class="body">${(w.exercises||[]).map(e=>`<div class="line"><span>${esc(e.name)}</span><span class="num">${e.sets.map(s=>fmtN(s.w)+'×'+s.r).join(', ')}</span></div>`).join('')}
    ${w.notes?`<p class="muted small" style="margin:4px 0 0">${esc(w.notes)}</p>`:''}
    ${S.canWrite?`<button class="btn danger" data-act="delw" data-id="${esc(w.id)}">${S.confirmDel===w.id?'Tap again to delete':'Delete workout'}</button>`:''}</div></details>`}).join('')}</div>`;
}

function viewBody(){
  const bs=sortedB(),latest=bs[bs.length-1];
  const prior=latest&&[...bs].reverse().find(b=>(parseD(latest.date)-parseD(b.date))>=28*864e5);
  const delta=(k)=>latest&&prior&&latest[k]!=null&&prior[k]!=null?(latest[k]-prior[k]):null;
  const dw=delta('weight'),df=delta('bf');
  const lean=latest&&latest.weight!=null&&latest.bf!=null?latest.weight*(1-latest.bf/100):null;
  const sign=v=>(v>0?'+':'')+fmtN(+v.toFixed(1));
  const wPts=bs.filter(b=>b.weight!=null).map(b=>({x:b.date,y:b.weight})),fPts=bs.filter(b=>b.bf!=null).map(b=>({x:b.date,y:b.bf}));
  return `<section class="card stack"><h2>Log a weigh-in</h2>
    <div class="form-grid"><label>Date<input type="date" id="b-date" value="${today()}"></label>
    <label>Weight (lb)<input id="b-w" inputmode="decimal" placeholder="185.4"></label>
    <label>Body fat %<input id="b-f" inputmode="decimal" placeholder="18.5"></label></div>
    <button class="btn primary" data-act="saveb" ${S.db&&S.canWrite?'':'disabled'}>Save weigh-in</button>
    <p class="muted small" id="b-msg" hidden></p></section>
  ${!S.ready.b?emptyLoading():!bs.length?`<div class="card empty"><b>No weigh-ins yet</b>Add today's weight and body fat above. One entry per day; saving the same date again replaces it.</div>`:`
  <div class="stats">
    <div class="stat"><div class="v num">${latest.weight!=null?fmtN(latest.weight):'–'}<small> lb</small></div><div class="d">${dw!=null?sign(dw)+' lb vs 4+ wks ago':'Latest weight'}</div></div>
    <div class="stat"><div class="v num">${latest.bf!=null?fmtN(latest.bf):'–'}<small> %</small></div><div class="d">${df!=null?sign(df)+' pts vs 4+ wks ago':'Latest body fat'}</div></div>
    <div class="stat"><div class="v num">${lean!=null?fmtN(+lean.toFixed(1)):'–'}<small> lb</small></div><div class="d">Lean mass (est.)</div></div></div>
  <section class="card stack"><div class="eyebrow">Bodyweight, lb</div>${lineChart(wPts,{label:'Bodyweight over time'})}</section>
  <section class="card stack"><div class="eyebrow">Body fat, %</div>${lineChart(fPts,{red:true,label:'Body fat over time'})}</section>
  <section class="card"><div class="tbl-wrap"><table><thead><tr><th>Date</th><th class="r">Weight</th><th class="r">Body fat</th><th></th></tr></thead><tbody>
    ${[...bs].reverse().map(b=>`<tr><td>${fmtD(b.date)}</td><td class="r">${b.weight!=null?fmtN(b.weight)+' lb':'–'}</td><td class="r">${b.bf!=null?fmtN(b.bf)+'%':'–'}</td>
    <td class="r">${S.canWrite?`<button class="x" data-act="delb" data-id="${esc(b.id)}">${S.confirmDel===b.id?'Confirm':'Delete'}</button>`:''}</td></tr>`).join('')}</tbody></table></div></section>`}`;
}

function viewProgress(){
  if(!S.ready.w)return emptyLoading();
  const names=[...new Set(sortedW().flatMap(w=>(w.exercises||[]).map(e=>e.name)))];
  if(!names.length)return `<div class="card empty"><b>Nothing to chart yet</b>Each lift gets an estimated one-rep max trend after you log it.</div>`;
  if(!S.progEx||!names.includes(S.progEx))S.progEx=names[0];
  const sessions=sortedW().slice().reverse().map(w=>{const e=(w.exercises||[]).find(x=>x.name===S.progEx);if(!e||!e.sets.length)return null;
    const best=e.sets.reduce((b,s)=>e1rm(s.w,s.r)>e1rm(b.w,b.r)?s:b);return{date:w.date,best,e1:e1rm(best.w,best.r),top:Math.max(...e.sets.map(s=>s.w)),vol:e.sets.reduce((t,s)=>t+s.w*s.r,0)}}).filter(Boolean);
  let run=0;sessions.forEach(s=>{s.pr=s.e1>run;if(s.pr)run=s.e1});
  const bestE=Math.max(...sessions.map(s=>s.e1)),heavy=Math.max(...sessions.map(s=>s.top));
  return `<label class="eyebrow" for="prog-ex">Exercise</label>
  <select id="prog-ex">${names.map(n=>`<option ${n===S.progEx?'selected':''}>${esc(n)}</option>`).join('')}</select>
  <div class="stats"><div class="stat"><div class="v num">${Math.round(bestE)}<small> lb</small></div><div class="d">Best est. 1RM</div></div>
    <div class="stat"><div class="v num">${fmtN(heavy)}<small> lb</small></div><div class="d">Heaviest set</div></div>
    <div class="stat"><div class="v num">${sessions.length}</div><div class="d">Sessions</div></div></div>
  <section class="card stack"><div class="eyebrow">Estimated 1RM per session, lb (Epley)</div>${lineChart(sessions.map(s=>({x:s.date,y:Math.round(s.e1)})),{label:'Estimated one-rep max over time'})}</section>
  <section class="card"><div class="tbl-wrap"><table><thead><tr><th>Date</th><th>Best set</th><th class="r">Est. 1RM</th><th class="r">Volume</th></tr></thead><tbody>
  ${sessions.slice().reverse().map(s=>`<tr><td>${short(s.date)}</td><td>${fmtN(s.best.w)} × ${s.best.r} ${s.pr?'<span class="pr">PR</span>':''}</td><td class="r">${Math.round(s.e1)}</td><td class="r">${Math.round(s.vol).toLocaleString()}</td></tr>`).join('')}
  </tbody></table></div></section>`;
}

function render(){
  const v=$('#view');
  v.innerHTML=S.tab==='log'?viewLog():S.tab==='history'?viewHistory()+backupCard():S.tab==='body'?viewBody():viewProgress();
  document.querySelectorAll('nav.tabs button').forEach(b=>b.setAttribute('aria-current',b.dataset.tab===S.tab?'page':'false'));
  startAnim();
}

/* ---------- events ---------- */
document.querySelector('nav.tabs').addEventListener('click',e=>{const b=e.target.closest('[data-tab]');if(!b)return;S.tab=b.dataset.tab;S.confirmDel=null;S.discardArm=false;render();window.scrollTo(0,0)});
$('#rest').addEventListener('click',e=>{const a=e.target.closest('[data-act]');if(!a)return;if(a.dataset.act==='rest-add')restEnd+=30000;else stopRest();tickRest()});

$('#view').addEventListener('input',e=>{
  const t=e.target;
  if(t.dataset.k&&S.draft){S.draft.exercises[+t.dataset.ei].sets[+t.dataset.si][t.dataset.k]=t.value.replace(/[^0-9.]/g,'');saveDraft()}
  else if(t.id==='add-ex'){loadLib().then(()=>{const r=$('#ex-results');if(!r)return;const q=$('#add-ex').value;const m=searchLib(q);
    r.innerHTML=m.map(x=>`<button class="res" data-act="pick" data-name="${esc(x.name)}"><b>${esc(cap(x.name))}</b><span>${esc(cap(x.target))} · ${esc(cap(x.equip))}</span></button>`).join('')||(q.trim().length>1&&LIB&&LIB.length?'<p class="muted small" style="margin:6px 0 0">No match. Tap Add to use your own name.</p>':'')})}
  else if(t.id==='notes'&&S.draft){S.draft.notes=t.value;saveDraft()}
  else if(t.id==='sess-date'&&S.draft){S.draft.date=t.value||today();saveDraft()}
});
$('#view').addEventListener('change',e=>{if(e.target.id==='w531-week'){S.settings.week=+e.target.value;saveSettings().then(render);return}if(e.target.id==='prog-ex'){S.progEx=e.target.value;render()}});
$('#view').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.id==='add-ex'){e.preventDefault();addEx()}});

function addEx(){const i=$('#add-ex');const n=i.value.trim();if(!n||!S.draft)return;S.draft.exercises.push(makeExercise(n,3,''));saveDraft();render()}

$('#view').addEventListener('click',async e=>{
  const a=e.target.closest('[data-act]');if(!a)return;const act=a.dataset.act,D=S.draft;
  if(act!=='discard')S.discardArm=false;
  if(act==='start')return startDraft(a.dataset.id);
  if(act==='prog'){S.settings.program=a.dataset.id;await saveSettings();render();return}
  if(act==='tm-fill'){Object.entries(MAIN).forEach(([k,n])=>{const b=bestE1(n);const el=$('#tm-'+k);if(b&&el)el.value=r5(b*0.9)});
    const m=$('#tm-msg');m.hidden=false;m.textContent='Filled from 90% of your best estimated 1RM. Lifts with no history stay blank. Tap Save to keep them.';return}
  if(act==='tm-save'){const tm={};Object.keys(MAIN).forEach(k=>{const v=+($('#tm-'+k).value||0);if(v>0)tm[k]=v});S.settings.tm=tm;await saveSettings();render();return}
  if(act==='done'){const s=D.exercises[+a.dataset.ei].sets[+a.dataset.si];s.done=!s.done;
    if(s.done){const prev=D.exercises[+a.dataset.ei].sets[+a.dataset.si-1];if(s.r===''&&prev&&prev.r)s.r=prev.r;startRest()}
    saveDraft();render();return}
  if(act==='addset'){const ex=D.exercises[+a.dataset.ei];const l=ex.sets[ex.sets.length-1]||{w:'',r:''};ex.sets.push({w:l.w,r:'',done:false});saveDraft();render();return}
  if(act==='rmset'){D.exercises[+a.dataset.ei].sets.pop();saveDraft();render();return}
  if(act==='swap'){const i=+a.dataset.ei;S.swap=S.swap===i?null:i;if(!LIB)loadLib().then(render);render();return}
  if(act==='swapto'){const i=+a.dataset.ei,old=D.exercises[i],n=cap(a.dataset.name);
    const ne=makeExercise(n,old.sets.length,old.reps||'5-8');D.exercises[i]=ne;S.swap=null;S.info.delete(old.name);saveDraft();render();return}
  if(act==='rmex'){S.swap=null;D.exercises.splice(+a.dataset.ei,1);saveDraft();render();return}
  if(act==='addex')return addEx();
  if(act==='pick'){const n=cap(a.dataset.name);ALIAS[n]=a.dataset.name;D.exercises.push(makeExercise(n,3,''));saveDraft();render();return}
  if(act==='info'){const n=a.dataset.name;S.info.has(n)?S.info.delete(n):S.info.add(n);loadLib().then(render);render();return}
  if(act==='discard'){if(!S.discardArm){S.discardArm=true;render();return}S.draft=null;S.discardArm=false;store(DRAFT_KEY,null);stopRest();render();return}
  if(act==='save')return saveWorkout();
  if(act==='delw'||act==='delb'){const id=a.dataset.id;if(S.confirmDel!==id){S.confirmDel=id;render();return}
    S.confirmDel=null;try{await S.db.collection(act==='delw'?'workouts':'body').doc(id).delete()}catch(err){setStatus('Delete failed. Try again.',true)}return}
  if(act==='saveb')return saveBody();
});

async function saveWorkout(){
  const D=S.draft,err=$('#save-err');
  const exercises=D.exercises.map(e=>({name:e.name,sets:e.sets.filter(s=>s.w!==''&&s.r!==''&&+s.r>0).map(s=>({w:+s.w,r:+s.r}))})).filter(e=>e.sets.length);
  if(!exercises.length){err.hidden=false;err.textContent='Enter weight and reps for at least one set before saving.';return}
  S.saving=true;render();
  try{
    const id=D.date+'-'+Math.random().toString(36).slice(2,8);
    await S.db.collection('workouts').doc(id).set({date:D.date,dayId:D.dayId,dayName:D.dayName,exercises,notes:D.notes.trim(),savedAt:new Date().toISOString()});
    if(D.dayId==='531-squat'){const st=S.settings;if(st.week>=4){st.week=1;Object.keys(st.tm).forEach(k=>st.tm[k]+=TM_STEP[k])}else st.week=(st.week||1)+1;await saveSettings()}
    S.draft=null;store(DRAFT_KEY,null);stopRest();S.saving=false;S.tab='history';render();window.scrollTo(0,0);
  }catch(x){S.saving=false;render();const e2=$('#save-err');e2.hidden=false;
    e2.textContent=x&&x.code==='quota_exceeded'?'Storage is full. Delete old entries and try again.':'Couldn\'t save. Your session is still here; try again in a moment.'}
}
async function saveBody(){
  const date=$('#b-date').value||today(),w=$('#b-w').value.trim(),f=$('#b-f').value.trim(),msg=$('#b-msg');
  const wn=w===''?null:+w,fn=f===''?null:+f;
  if((wn==null&&fn==null)||(wn!=null&&!(wn>0))||(fn!=null&&!(fn>0&&fn<70))){msg.hidden=false;msg.textContent='Enter a weight in lb, a body fat % between 0 and 70, or both.';return}
  try{await S.db.collection('body').doc(date).set({date,weight:wn,bf:fn,savedAt:new Date().toISOString()});}
  catch(x){msg.hidden=false;msg.textContent='Couldn\'t save the weigh-in. Try again in a moment.'}
}

/* ---------- boot ---------- */
S.draft=load(DRAFT_KEY);{const st=load(SET_KEY);if(st)S.settings={...S.settings,...st,tm:st.tm||{}};applySettings();}loadLib().then(()=>{const a=document.activeElement;if(!(a&&/INPUT|TEXTAREA/.test(a.tagName)))render()});
render();
/* ---------- device storage (standalone build) ---------- */
const LocalDB=(()=>{const KEY='ironlog-data-v1';const read=()=>{try{return JSON.parse(localStorage.getItem(KEY))||{}}catch(e){return {}}};let data=read();
  const subs=[];const persist=()=>{try{localStorage.setItem(KEY,JSON.stringify(data))}catch(e){setStatus('Storage is full or blocked on this device',true)}};
  const notify=()=>subs.forEach(f=>f());
  const snapCol=c=>{const o=data[c]||{};const docs=Object.keys(o).sort().map(id=>({id,exists:true,data:()=>o[id],metadata:{fromCache:false}}));return{docs,size:docs.length,empty:!docs.length,metadata:{fromCache:false,hasPendingWrites:false}}};
  const snapDoc=(c,id)=>{const v=(data[c]||{})[id];return{id,exists:!!v,data:()=>v,metadata:{fromCache:false}}};
  const sub=f=>{subs.push(f);setTimeout(f,0);return()=>{const i=subs.indexOf(f);if(i>=0)subs.splice(i,1)}};
  const docRef=(c,id)=>({id,set:async v=>{(data[c]=data[c]||{})[id]=JSON.parse(JSON.stringify(v));persist();notify()},
    delete:async()=>{if(data[c])delete data[c][id];persist();notify()},onSnapshot:cb=>sub(()=>cb(snapDoc(c,id)))});
  window.addEventListener('storage',e=>{if(e.key===KEY){data=read();notify()}});
  return{doc:p=>{const [c,id]=p.split('/');return docRef(c,id)},
    collection:c=>({doc:id=>docRef(c,id||Math.random().toString(36).slice(2)),onSnapshot:cb=>sub(()=>cb(snapCol(c)))}),
    exportAll:()=>JSON.parse(JSON.stringify(data)),
    mergeAll:d=>{let n=0;for(const c of ['workouts','body','settings']){if(d[c]&&typeof d[c]==='object'){data[c]=data[c]||{};for(const [id,v] of Object.entries(d[c])){data[c][id]=v;n++}}}persist();notify();return n}};
})();
function backupCard(){
  return `<section class="card stack"><h2>Backup</h2>
  <p class="muted small" style="margin:0">Your log is stored in this browser only. Export a backup now and then, and import it on a new phone or after clearing browser data. Importing adds to what's here. Matching entries are replaced, not doubled.</p>
  <div class="row"><button class="btn" data-act="export">Export backup</button><label class="btn" style="display:inline-flex;align-items:center">Import backup<input type="file" id="import-file" accept="application/json,.json" hidden></label></div>
  <p class="muted small" id="backup-msg" hidden></p></section>`;
}
document.addEventListener('click',e=>{if(!e.target.closest('[data-act="export"]'))return;
  const blob=new Blob([JSON.stringify({app:'iron-log',version:1,exportedAt:new Date().toISOString(),...LocalDB.exportAll()},null,1)],{type:'application/json'});
  const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='iron-log-backup-'+today()+'.json';document.body.appendChild(a);a.click();
  setTimeout(()=>{URL.revokeObjectURL(a.href);a.remove()},1000)});
document.addEventListener('change',async e=>{if(e.target.id!=='import-file')return;const f=e.target.files[0];if(!f)return;
  const msg=()=>document.getElementById('backup-msg');
  try{const d=JSON.parse(await f.text());if(!d||(!d.workouts&&!d.body))throw 0;const n=LocalDB.mergeAll(d);
    const m=msg();if(m){m.hidden=false;m.textContent=`Imported ${n} entries.`}}
  catch(x){const m=msg();if(m){m.hidden=false;m.textContent="That file isn't an Iron Log backup."}}
  e.target.value=''});
(()=>{
  S.db=LocalDB;setStatus('Saved on this device');
  const live=()=>{};
  const rerender=()=>{if(!(S.tab==='log'&&S.draft)&&!(document.activeElement&&document.activeElement.closest('.form-grid')))render()};
  LocalDB.collection('workouts').onSnapshot(s=>{S.workouts=s.docs.map(d=>({id:d.id,...d.data()}));S.ready.w=true;rerender()});
  LocalDB.doc('settings/main').onSnapshot(d=>{if(!d.exists)return;const v=d.data();S.settings={program:v.program||'ul',tm:v.tm||{},week:v.week||1};store(SET_KEY,S.settings);applySettings();rerender()});
  LocalDB.collection('body').onSnapshot(s=>{S.body=s.docs.map(d=>({id:d.id,...d.data()}));S.ready.b=true;
    if(!(document.activeElement&&document.activeElement.closest('.form-grid')))rerender()});
})();

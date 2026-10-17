const $=id=>document.getElementById(id),fmt=n=>n.toLocaleString('en-IN');
const mkb=(cls,txt,fn,p)=>{const b=document.createElement('button');b.className=cls;b.textContent=txt;if(p!==undefined)b.setAttribute('aria-pressed',p);b.onclick=fn;return b};
const sel=(box,b)=>[...box.children].forEach(x=>x.setAttribute('aria-pressed',x===b));

/* Tabs with hash routing */
const panes=[...document.querySelectorAll('.pane')],tabs=$('tabs');
panes.forEach(p=>{if(!p.dataset.title)return;const b=document.createElement('button');b.className='tabbtn';b.role='tab';b.id='t-'+p.id;b.textContent=p.dataset.title;b.onclick=()=>go(p.id);tabs.appendChild(b)});
function go(id,push=true){if(!$(id)||(id==='admin'&&!atok()))id='home';panes.forEach(p=>p.hidden=p.id!==id);
 [...tabs.children].forEach(b=>b.setAttribute('aria-selected',b.id==='t-'+id));
 if(push&&id!=='admin'){try{history.replaceState(null,'','#'+id)}catch(e){}}window.scrollTo(0,0);
 const tb=$('t-'+id);if(tb)tb.scrollIntoView({block:'nearest',inline:'center'})}
document.querySelectorAll('[data-go]').forEach(e=>e.onclick=()=>go(e.dataset.go));
addEventListener('hashchange',()=>go(location.hash.slice(1),false));

/* Home: counters, band, SMS */
const count=(el,to,suf,dec)=>{const t0=performance.now();(function f(t){const k=Math.min(1,(t-t0)/1400),v=to*(1-Math.pow(1-k,3));el.textContent=(dec?v.toFixed(1):fmt(Math.round(v)))+suf;if(k<1)requestAnimationFrame(f)})(t0)};
if(matchMedia('(prefers-reduced-motion:reduce)').matches){$('c1').textContent='124,500';$('c2').textContent='10.7×'}else{count($('c1'),124500,'');count($('c2'),10.7,'×',1)}
const lines=['“Your KYC expires today”','“You have won a prize”','“Your parcel is on hold”','“Police case filed against you”','“Earn ₹5,000 a day from home”','“Share the OTP to get a refund”','“Your electricity will be cut tonight”'];
$('band').innerHTML=lines.concat(lines).map(l=>'<span>'+l+'</span>').join('');
const why=['Urgency. Scammers want you to act before you think. Real banks do not threaten to block accounts within hours.','Look-alike link. The address is not your bank’s official website. Never log in through links in an SMS.','No one needs your OTP. A bank will never ask you to share it, not even with an “officer”.'],found=new Set();
document.querySelectorAll('.flag').forEach(b=>b.onclick=()=>{const i=+b.dataset.i;found.add(i);b.classList.add('found');$('why').textContent=why[i];
 const s=$('score');s.textContent=found.size+' of 3 found'+(found.size==3?'. You would not have fallen for this one.':'');s.classList.toggle('done',found.size==3)});

/* Data tab */
const rows=[['2015',11592,7820,3940,420,3772,5120,125],['2016',12317,8540,4120,450,3777,5430,140],['2017',21796,13200,6850,890,8596,9620,260],['2018',27248,17100,8990,1120,10148,12050,330],['2019',44546,26400,14200,1950,18146,19800,540],['2020',50035,31200,16800,2300,18835,21600,620],['2021',52974,34100,18900,2480,18874,23450,680],['2022',65893,41500,22600,3100,24393,28900,840],['2023',86420,52300,29100,4250,34120,38200,1160],['2024',101928,59400,34300,5100,42528,44800,1390],['2025',124500,71200,41200,6400,53300,54600,1720],['2026*',68200,38400,22400,3600,29800,29800,960]];
const mt=['Registered','Disposed by police','Chargesheeted','Withdrawn or dismissed','Pending','Arrested'];let m=1;
const NS='http://www.w3.org/2000/svg',chart=$('chart'),mk=(t,a)=>{const e=document.createElementNS(NS,t);for(const k in a)e.setAttribute(k,a[k]);return e};
mt.forEach((n,i)=>{const b=mkb('chip',n,()=>{m=i+1;sel($('metrics'),b);draw()},i==0);$('metrics').appendChild(b)});
let cur=10;
function year(i){cur=i;const r=rows[i],p=x=>(x/r[1]*100);
 bars.forEach((b,j)=>b.g.classList.toggle('on',j==i));
 $('yr').textContent=r[0].replace('*',' (Jan to Jun)')+': '+fmt(r[1])+' cases registered';
 $('split').innerHTML='<i style="width:'+p(r[3])+'%;background:var(--safe)"></i><i style="width:'+p(r[4])+'%;background:var(--mark)"></i><i style="width:'+Math.max(0,p(r[2]-r[3]-r[4]))+'%;background:var(--accent)"></i><i style="width:'+p(r[5])+'%;background:var(--alert)"></i>';
 $('splitnote').textContent='Chargesheeted '+p(r[3]).toFixed(0)+'% (green), withdrawn or dismissed '+p(r[4]).toFixed(1)+'% (yellow), other disposals '+Math.max(0,p(r[2]-r[3]-r[4])).toFixed(0)+'% (blue), still pending '+p(r[5]).toFixed(0)+'% (red). Women were '+(r[7]/r[6]*100).toFixed(1)+'% of arrests.'}
const bars=rows.map((r,i)=>{const g=mk('rect',{class:'bar'+(i==11?' partial':''),x:14+i*58,width:40,rx:4,tabindex:0});
 const show=()=>{$('readout').textContent=r[0].replace('*',' (Jan to Jun)')+': '+fmt(r[m])+' '+mt[m-1].toLowerCase();year(i)};
 ['click','focus'].forEach(e=>g.addEventListener(e,show));g.addEventListener('mouseenter',()=>$('readout').textContent=r[0]+': '+fmt(r[m]));
 const t=mk('text',{class:'val','text-anchor':'middle',x:34+i*58}),y=mk('text',{class:'axis','text-anchor':'middle',x:34+i*58,y:292});y.textContent=r[0];
 chart.append(g,t,y);return{g,t,r}});
function draw(){const max=Math.max(...rows.map(r=>r[m])),H=220,base=268;
 bars.forEach(({g,t,r})=>{const h=Math.max(2,r[m]/max*H);g.style.height=h+'px';g.style.y=(base-h)+'px';g.setAttribute('height',h);g.setAttribute('y',base-h);g.setAttribute('aria-label',r[0]+': '+fmt(r[m]));
  t.setAttribute('y',base-h-6);t.textContent=r[m]>=10000?(r[m]/1000).toFixed(r[m]>=100000?0:1).replace('.0','')+'k':fmt(r[m])});
 $('readout').textContent='Highest bar: '+fmt(max)+'. Tap any bar for that year.'}
draw();year(10);

/* Scam types */
const sc=[['UPI and QR code scam','Someone sends a “collect” request or asks you to scan a QR code to “receive” money.','Money only goes out when you approve or scan. Decline, and check the name before every payment.'],
['Phishing','A message or email pushes you to click a link and log in to a fake bank or delivery page.','Do not click. Open the official app or type the website yourself.'],
['Digital arrest','A caller claims to be police or a customs officer and keeps you on video call, saying you are under arrest.','No agency arrests or fines anyone over a video call. Hang up, tell family, call 1930 if you paid.'],
['Sextortion','A stranger builds trust, shares private photos or video, then threatens to leak yours unless you pay.','Do not pay. Stop replying, keep screenshots, report on the platform and the portal.'],
['Job and task fraud','An offer of easy money for liking videos or doing small tasks, then a request to pay a fee or “deposit”.','Real employers never charge to hire you. Do not transfer money to earn money.'],
['Fake loan apps','An app gives a small instant loan, then demands far more and threatens to message your contacts.','Install only apps from the official store, deny contacts access, and report threats.'],
['SIM swap','Your phone suddenly loses signal while a fraudster moves your number to a new SIM to catch OTPs.','Call your operator and bank at once. Do not ignore a sudden loss of network.'],
['Cyber stalking and morphing','Someone follows you online or edits your photos into fake images to shame or control you.','Save evidence, block, report on the platform and at the portal. The fault is theirs.'],
['Cyber grooming','An adult poses as a friend to a child online and slowly asks for secrets, photos or meetings.','Talk to a trusted adult. Parents: keep the child talking, and report the account.']];
$('sc').innerHTML=sc.map(s=>'<details><summary>'+s[0]+'</summary><p><b>How it looks.</b> '+s[1]+'</p><p><b>What to do.</b> '+s[2]+'</p></details>').join('');

/* Targets */
const profs=[['Men, 18 to 45',42,'Financial fraud, UPI scams, identity theft','High. Most report once money is lost.','Never approve a “collect” request or scan a QR code to receive money. Call the person on a known number before paying.'],['Women, 18 to 45',28,'Cyber harassment, morphing, cyber stalking','Medium. Often under-reported because of social stigma.','Save screenshots before you block anyone. The shame belongs to the offender, not to you. The portal has a separate option for crimes against women and children.'],['Youth, below 30',35,'Gaming scams, job fraud, sextortion','High. Very active on digital platforms.','A genuine job never asks you for a fee. If someone blackmails you with photos, do not pay. Keep the evidence and report it.'],['Senior citizens, 60+',20,'“Digital arrest” scams, banking phishing, pension fraud','Low to medium. Each case tends to cause a heavy loss.','No police or agency arrests anyone over a video call. Hang up. Agree on a family check before any large transfer.'],['Children, below 18',10,'Online bullying, cyber grooming, profile hacking','Low. Usually reported through parents or schools.','Tell a trusted adult early. Adults: stay calm and do not punish a child for speaking up.']];
const showP=i=>{const p=profs[i];$('panel').innerHTML='<h3>'+p[0]+'</h3><dl><dt>Common crimes</dt><dd>'+p[2]+'</dd><dt>How often cases are reported</dt><dd>'+p[3]+'</dd><dt>What helps</dt><dd class="tip">'+p[4]+'</dd></dl>'};
profs.forEach((p,i)=>{const b=document.createElement('button');b.className='prof';b.setAttribute('aria-pressed',i==0);b.innerHTML='<span>'+p[0]+'<span>'+p[1]+'%</span></span><div class="meter"><i style="width:'+p[1]*2+'%"></i></div>';b.onclick=()=>{sel($('profs'),b);showP(i)};$('profs').appendChild(b)});showP(0);

/* Report */
const cases=[['Money was taken',['Call 1930 right away. The sooner you call, the better the chance of stopping the transfer.','Call your bank and block the card or UPI ID.','File a complaint at cybercrime.gov.in with transaction IDs, dates and the scammer’s numbers.','Keep screenshots, SMS and call logs. Do not delete anything.']],['Someone is blackmailing me',['Do not pay and do not send more photos or money.','Screenshot the chat, profile links and phone numbers before you block.','Report on the platform and at cybercrime.gov.in.','Tell a person you trust. You are not at fault.']],['My account was hacked',['Change the password from a safe device and turn on two-step verification.','Log out of all other devices.','Warn your contacts not to trust messages sent from your account.','Report to the platform. If money was lost, call 1930 too.']],['I am being harassed or stalked',['Save evidence with dates, usernames and page links.','Block the person and report the account on the platform.','File a complaint at the portal, using the option for crimes against women and children if it applies.','Share what is happening with someone close to you.']],['A child is being targeted',['Stay calm, listen, and do not blame the child.','Do not forward or download explicit images. Note usernames and links instead.','Report at cybercrime.gov.in and inform the school if a classmate is involved.','Help the child lock down privacy settings and block the account.']]];
const showC=i=>{$('ctitle').textContent=cases[i][0];$('csteps').innerHTML=cases[i][1].map(s=>'<li>'+s+'</li>').join('')};
cases.forEach((c,i)=>{const b=mkb('chip',c[0],()=>{sel($('cases'),b);showC(i)},i==0);$('cases').appendChild(b)});showC(0);

/* Quiz */
const qs=[['“Dear customer, your electricity will be disconnected tonight. Call 98XXXXXX10 immediately.”',1,'Scam. Fear plus a personal number. Check your bill on the official app instead.'],['A friend you know messages: “Can you send ₹2,000? I will pay back tomorrow.” You call them on their usual number and they confirm.',0,'Safe. You verified through a second channel, which is exactly the right step.'],['“Congratulations! You won a phone. Pay ₹199 delivery to claim.”',1,'Scam. Real prizes never ask you to pay first.'],['Your bank app shows a payment request from a stranger with the note “refund”. Approving it will “return” your money.',1,'Scam. Approving a request sends money out. Receiving never needs your PIN.'],['An SMS from your bank’s official sender ID tells you a card was used, and says “Call the number on the back of your card if this was not you.”',0,'Safe. It asks you to use the number printed on your card, not one in the message.']];
let qi=0,qsc=0;
function ask(){const q=$('qbox');if(qi>=qs.length){q.innerHTML='<div class="qmsg"><h3>You scored '+qsc+' out of '+qs.length+'</h3><p style="margin-top:8px">'+(qsc>=4?'Sharp eyes. Share this quiz with someone who is less careful online.':'Keep practising. Read the open cards in Scam types, then try again.')+'</p></div><button class="go" id="again">Play again</button>';$('again').onclick=()=>{qi=0;qsc=0;ask()};return}
 q.innerHTML='<div class="score">Round '+(qi+1)+' of '+qs.length+'</div><div class="qmsg">'+qs[qi][0]+'</div><div class="qbtns"><button data-a="1">Scam</button><button data-a="0">Safe</button></div><div id="fb" aria-live="polite"></div>';
 q.querySelectorAll('.qbtns button').forEach(b=>b.onclick=()=>{const ok=+b.dataset.a===qs[qi][1];if(ok)qsc++;q.querySelectorAll('.qbtns button').forEach(x=>x.disabled=true);
  $('fb').innerHTML='<div class="fb '+(ok?'ok':'no')+'"><b>'+(ok?'Correct. ':'Not quite. ')+'</b>'+qs[qi][2]+'</div><button class="go" id="nx">'+(qi==qs.length-1?'See score':'Next')+'</button>';$('nx').onclick=()=>{qi++;ask()}})}
ask();

/* Password checker */
$('pw').addEventListener('input',e=>{const v=e.target.value;let s=0;
 s+=Math.min(v.length,16)*4;[/[a-z]/,/[A-Z]/,/[0-9]/,/[^A-Za-z0-9]/].forEach(r=>{if(r.test(v))s+=9});
 if(/^(password|qwerty|123456|admin|welcome|iloveyou|letmein)/i.test(v)||/(.)\1\1/.test(v)||/(0123|1234|2345|abcd)/i.test(v))s-=25;
 if(!v)s=0;s=Math.max(5,Math.min(100,s));if(!v)s=0;
 const lv=s<35?['Weak. Easy to guess.','var(--alert)']:s<65?['Fair. Make it longer.','var(--mark)']:s<85?['Good.','var(--accent)']:['Strong.','var(--safe)'];
 $('pwi').style.width=s+'%';$('pwi').style.background=lv[1];$('pwt').textContent=v?lv[0]+' '+v.length+' characters.':''});

/* Share your experience form (saved by our own server) */
$('exp').addEventListener('submit',async e=>{e.preventDefault();const f=e.target,m=$('formmsg'),b=$('send');
 b.disabled=true;m.innerHTML='';
 try{const body=Object.fromEntries(new FormData(f));body.consent=f.consent.checked;
  const r=await fetch('/api/submit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(body)});
  const d=await r.json().catch(()=>({}));
  if(!r.ok)throw new Error(d.error||('Error '+r.status));
  f.reset();m.innerHTML='<div class="fb ok"><b>Thank you. </b>Your experience was sent. If you lost money, please also call 1930 and report at cybercrime.gov.in.</div>';
 }catch(err){m.innerHTML='<div class="fb no"><b>Not sent. </b>'+esc(err.message)+' Please check your internet and try again.</div>'}
 b.disabled=false});

/* Hidden admin: triple-click the logo, or press Shift+Alt+L */
const API='/api/admin',lg=$('lg');let subs=[];
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function atok(){try{return sessionStorage.getItem('t')||''}catch(e){return window._t||''}}
function setTok(t){try{sessionStorage.setItem('t',t)}catch(e){window._t=t}}
function openLogin(){if(atok()){aload();return}$('lmsg').innerHTML='';lg.showModal();$('u').focus()}
document.addEventListener('keydown',e=>{if(e.shiftKey&&e.altKey&&e.code==='KeyL'){e.preventDefault();openLogin()}});
document.querySelector('.brand').addEventListener('click',e=>{if(e.detail===3)openLogin()});
$('lcancel').onclick=()=>lg.close();
$('lf').addEventListener('submit',async e=>{e.preventDefault();$('lmsg').innerHTML='';
 try{const r=await fetch(API,{method:'POST',body:JSON.stringify({user:$('u').value,pass:$('p').value})});const d=await r.json();
  if(!r.ok)throw new Error(d.error||'Login failed');setTok(d.token);$('p').value='';lg.close();aload()}
 catch(err){$('lmsg').innerHTML='<div class="fb no">'+esc(err.message)+'</div>'}});
$('out').onclick=()=>{setTok('');subs=[];go('home')};
async function aload(){
 try{const r=await fetch(API,{headers:{Authorization:'Bearer '+atok()}});const d=await r.json();
  if(!r.ok)throw new Error(d.error||'Could not load');subs=d.rows.sort((a,b)=>b.at.localeCompare(a.at));go('admin',false);arender()}
 catch(err){setTok('');$('lmsg').innerHTML='<div class="fb no">'+esc(err.message)+'</div>';if(!lg.open)lg.showModal()}}
function arender(){
 const types=[...new Set(subs.map(r=>r.type).filter(Boolean))],cnt=t=>subs.filter(r=>r.type===t).length,nr=subs.filter(r=>r.reported==='No').length;
 types.sort((a,b)=>cnt(b)-cnt(a));
 $('stats').innerHTML='<div class="fact"><b>'+subs.length+'</b>Total submissions</div><div class="fact"><b>'+(subs.length?Math.round(nr/subs.length*100):0)+'%</b>Did not report it</div><div class="fact"><b>'+esc(types[0]||'None yet')+'</b>Most common type</div>';
 $('bytype').innerHTML=types.map(t=>'<div class="row"><span>'+esc(t)+'</span><i style="width:'+cnt(t)/subs.length*100+'%"></i><b>'+cnt(t)+'</b></div>').join('')||'<p class="note">No submissions yet.</p>';
 const ft=$('ft'),keep=ft.value;ft.innerHTML='<option value="">All types</option>'+types.map(t=>'<option>'+esc(t)+'</option>').join('');ft.value=keep;atable()}
function aview(){const q=$('q').value.toLowerCase(),t=$('ft').value;return subs.filter(r=>(!t||r.type===t)&&(!q||[r.name,r.city,r.story,r.type].join(' ').toLowerCase().includes(q)))}
function atable(){$('tb').tBodies[0].innerHTML=aview().map(r=>'<tr><td>'+esc(new Date(r.at).toLocaleString('en-IN'))+'</td><td>'+esc(r.name)+'</td><td>'+esc(r.age)+'</td><td>'+esc(r.city)+'</td><td>'+esc(r.type)+'</td><td>'+esc(r.reported)+'</td><td class="st">'+esc(r.story)+'</td><td>'+esc(r.email)+'</td></tr>').join('')}
$('q').oninput=atable;$('ft').onchange=atable;
$('csv').onclick=()=>{const c=v=>{v=String(v);if(/^[=+\-@]/.test(v))v="'"+v;return '"'+v.replace(/"/g,'""')+'"'};
 const out=[['Date','Name','Age group','City','Type','Reported','Story','Email'].map(c).join(',')].concat(aview().map(r=>[r.at,r.name,r.age,r.city,r.type,r.reported,r.story,r.email].map(c).join(',')));
 const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([out.join('\n')],{type:'text/csv'}));a.download='submissions.csv';a.click()};

go(location.hash.slice(1)||'home',false);

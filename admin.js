const crypto=require('crypto');
const H={'Content-Type':'application/json','Cache-Control':'no-store'};
const res=(c,o)=>({statusCode:c,headers:H,body:JSON.stringify(o)});
const sha=s=>crypto.createHash('sha256').update(String(s)).digest();
const same=(a,b)=>crypto.timingSafeEqual(sha(a),sha(b));
const sign=t=>crypto.createHmac('sha256',process.env.SESSION_SECRET).update(t).digest('base64url');
const make=()=>{const e=String(Date.now()+2*3600*1000);return e+'.'+sign(e)};
const valid=t=>{if(!t)return false;const [e,s]=t.split('.');if(!e||!s||Date.now()>Number(e))return false;
 const x=Buffer.from(sign(e)),y=Buffer.from(s);return x.length===y.length&&crypto.timingSafeEqual(x,y)};
const api=async p=>{const r=await fetch('https://api.netlify.com/api/v1'+p,{headers:{Authorization:'Bearer '+process.env.NETLIFY_API_TOKEN}});
 if(!r.ok)throw new Error('Netlify API '+r.status);return r.json()};
exports.handler=async event=>{
 const miss=['ADMIN_USER','ADMIN_PASS','SESSION_SECRET','NETLIFY_API_TOKEN','NF_SITE_ID'].filter(k=>!process.env[k]);
 if(miss.length)return res(500,{error:'Server is not set up yet. Missing: '+miss.join(', ')});
 if(event.httpMethod==='POST'){
  let b={};try{b=JSON.parse(event.body||'{}')}catch(e){}
  const good=(same(b.user||'',process.env.ADMIN_USER)&same(b.pass||'',process.env.ADMIN_PASS))===1;
  if(!good){await new Promise(r=>setTimeout(r,1000));return res(401,{error:'Wrong username or password'})}
  return res(200,{token:make()});
 }
 if(event.httpMethod==='GET'){
  if(!valid((event.headers.authorization||'').replace(/^Bearer /,'')))return res(401,{error:'Session expired. Please log in again.'});
  try{
   const forms=await api('/sites/'+process.env.NF_SITE_ID+'/forms');
   const f=forms.find(x=>x.name==='experience');
   if(!f)return res(200,{rows:[]});
   let rows=[];
   for(let p=1;p<=10;p++){const part=await api('/forms/'+f.id+'/submissions?per_page=100&page='+p);rows=rows.concat(part);if(part.length<100)break}
   return res(200,{rows:rows.map(s=>({at:s.created_at,name:s.data.name||'',age:s.data.age_group||'',city:s.data.city||'',type:s.data.crime_type||'',story:s.data.story||'',reported:s.data.reported||'',email:s.data.email||''}))});
  }catch(e){return res(502,{error:'Could not load submissions. '+e.message})}
 }
 return res(405,{error:'Method not allowed'});
};

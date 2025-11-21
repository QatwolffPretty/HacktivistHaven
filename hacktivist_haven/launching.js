/* Background Particles */
const bg=document.getElementById('bgCanvas'),g=bg.getContext('2d');
let parts=[];
function resize(){bg.width=innerWidth;bg.height=innerHeight;}
resize();addEventListener('resize',resize);
function makeParticles(){
  parts=[];const count=Math.max(25,Math.floor(bg.width*bg.height/100000));
  for(let i=0;i<count;i++){
    parts.push({x:Math.random()*bg.width,y:Math.random()*bg.height,r:Math.random()*2+0.8,sx:(Math.random()-0.5)*0.3,sy:(Math.random()*0.5)+0.1,h:350+Math.random()*30});
  }
}
makeParticles();
function drawBg(){
  g.clearRect(0,0,bg.width,bg.height);
  for(const p of parts){
    const grd=g.createRadialGradient(p.x,p.y,p.r*0.2,p.x,p.y,p.r*12);
    grd.addColorStop(0,`hsla(${p.h},100%,65%,0.1)`);grd.addColorStop(1,`hsla(${p.h},100%,55%,0)`);
    g.fillStyle=grd;g.fillRect(p.x-p.r*12,p.y-p.r*12,p.r*24,p.r*24);
    p.x+=p.sx;p.y+=p.sy;if(p.x>bg.width+50)p.x=-50;if(p.y>bg.height+50)p.y=-50;if(p.x<-50)p.x=bg.width+50;
  }
  requestAnimationFrame(drawBg);
}
drawBg();

/* Countdown */
const target=new Date("2025-10-27T00:00:00").getTime();
const dEl=document.getElementById('days'),
      hEl=document.getElementById('hours'),
      mEl=document.getElementById('minutes'),
      sEl=document.getElementById('seconds'),
      sub=document.getElementById('subtitle');
function update(){
  const now=new Date().getTime(),diff=target-now;
  if(diff<=0){
    sub.textContent="🚀 We're Live! Redirecting...";
    dEl.textContent=hEl.textContent=mEl.textContent=sEl.textContent='00';
    setTimeout(()=>window.location.href='landingpage.html',4000);
    return;
  }
  const d=Math.floor(diff/(1000*60*60*24));
  const h=Math.floor((diff%(1000*60*60*24))/(1000*60*60));
  const m=Math.floor((diff%(1000*60*60))/(1000*60));
  const s=Math.floor((diff%(1000*60))/1000);
  dEl.textContent=d.toString().padStart(2,'0');
  hEl.textContent=h.toString().padStart(2,'0');
  mEl.textContent=m.toString().padStart(2,'0');
  sEl.textContent=s.toString().padStart(2,'0');
}
setInterval(update,1000);update();

/* Email Notify */
document.getElementById('notifyForm').addEventListener('submit',e=>{
  e.preventDefault();
  const email=document.getElementById('emailInput').value.trim();
  if(!email)return;
  alert(`✅ Thanks ${email}! You'll get launch updates.`);
  document.getElementById('emailInput').value='';
});

/* Google Calendar */
document.getElementById('googleRemind').addEventListener('click',()=>{
  const url='https://www.google.com/calendar/render?action=TEMPLATE&text=Hacktivist%20Haven%20Launch&dates=20251231T000000Z/20251231T010000Z&details=Hacktivist%20Haven%20is%20live!&location=https://hactivisthaven.com';
  window.open(url,'_blank');
});
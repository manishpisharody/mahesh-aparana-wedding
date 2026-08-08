/* Edit these values to personalize the complete invitation. */
const weddingConfig = {
  brideName: "Aparna", groomName: "Mahesh",
  weddingDate: "2026-08-28T09:30:00+05:30",
  thalikettuVenue: "Vadakkunnathan",
  weddingVenue: "PTRL Mahal, Kattungachira, Irinjalakuda", weddingTime: "9:30 AM",
  receptionVenue: "PCK Auditorium, Vellangallur", receptionTime: "Time to be updated",
  whatsappNumber: "UPDATE_NUMBER",
  websiteUrl: "",
  mapLinks: {
    thalikettu: "https://www.google.com/maps/search/?api=1&query=Vadakkunnathan+Temple+Thrissur",
    wedding: "https://www.google.com/maps/search/?api=1&query=PTRL+Mahal+Kattungachira+Irinjalakuda",
    reception: "https://www.google.com/maps/search/?api=1&query=PCK+Auditorium+Vellangallur"
  },
  musicPath: "assets/audio/wedding-music.mp3"
};

const $ = (s, root=document) => root.querySelector(s), $$ = (s, root=document) => [...root.querySelectorAll(s)];
let entered = false, petals = [], petalRun = false;

function applyConfig(){
  $$('[data-bride]').forEach(e=>e.textContent=weddingConfig.brideName);
  $$('[data-groom]').forEach(e=>e.textContent=weddingConfig.groomName);
  $$('[data-reception-time]').forEach(e=>e.textContent=weddingConfig.receptionTime);
  $$('.map-link').forEach(e=>e.href=weddingConfig.mapLinks[e.dataset.map]);
  document.title=`${weddingConfig.brideName} & ${weddingConfig.groomName} | Wedding Invitation`;
  $('#music').src=weddingConfig.musicPath;
}

window.addEventListener('load',()=>setTimeout(()=>$('#loader').classList.add('hidden'),450));
applyConfig();

$('#openInvitation').addEventListener('click',()=>{
  entered=true; document.body.classList.remove('locked'); document.body.classList.add('main-open');
  $('#welcome').classList.add('opened'); $('#mainContent').setAttribute('aria-hidden','false');
  launchPetals(true); playMusic(); setTimeout(()=>$('#welcome').remove(),1000);
});

const audio=$('#music'), musicIcon=$('#musicToggle i'); audio.volume=.28;
function playMusic(){audio.play().then(()=>musicIcon.className='bi bi-volume-up').catch(()=>musicIcon.className='bi bi-volume-mute')}
$('#musicToggle').addEventListener('click',()=>{if(audio.paused)playMusic();else{audio.pause();musicIcon.className='bi bi-volume-mute'}});
audio.addEventListener('error',()=>{$('#musicToggle').title='Add music at assets/audio/wedding-music.mp3'});

function updateCountdown(){
  const target=new Date(weddingConfig.weddingDate), now=new Date(), diff=target-now, grid=$('#countdownGrid');
  if(diff<=0){const after=now-target>86400000;grid.innerHTML=`<div style="grid-column:1/-1"><strong>${after?'Happily Married ♥':'Today is the day ♥'}</strong></div>`;return}
  const vals=[Math.floor(diff/86400000),Math.floor(diff/3600000)%24,Math.floor(diff/60000)%60,Math.floor(diff/1000)%60];
  ['days','hours','minutes','seconds'].forEach((id,i)=>$('#'+id).textContent=String(vals[i]).padStart(2,'0'));
} updateCountdown(); setInterval(updateCountdown,1000);

const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');observer.unobserve(e.target)}}),{threshold:.12}); $$('.reveal').forEach(e=>observer.observe(e));
window.addEventListener('scroll',()=>{const y=scrollY,h=document.documentElement.scrollHeight-innerHeight;$('#progress').style.width=`${h?y/h*100:0}%`;$('#toTop').classList.toggle('show',y>700)},{passive:true});
$('#toTop').onclick=()=>scrollTo({top:0,behavior:'smooth'});

$('#addCalendar').addEventListener('click',()=>{
  const start='20260828T040000Z',end='20260828T113000Z',title=encodeURIComponent(`Wedding of ${weddingConfig.brideName} & ${weddingConfig.groomName}`),details=encodeURIComponent('Join us for our wedding celebration.'),location=encodeURIComponent(weddingConfig.weddingVenue);
  open(`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${details}&location=${location}`,'_blank','noopener');
});

function whatsappUrl(message, direct=false){const number=/^\d{8,15}$/.test(weddingConfig.whatsappNumber)?weddingConfig.whatsappNumber:'';return `https://wa.me/${direct?number:''}?text=${encodeURIComponent(message)}`}
$('#rsvpForm').addEventListener('submit',e=>{e.preventDefault();const name=$('#guestName').value.trim(),count=$('#guestCount').value,status=$('input[name="attendance"]:checked').value,note=$('#guestMessage').value.trim();if(weddingConfig.whatsappNumber==='UPDATE_NUMBER'){$('#rsvpHint').textContent='Please update whatsappNumber in js/script.js before sending RSVPs.';return}const msg=`Hi, I am ${name}. I am ${status} the wedding on 28 August 2026${status==='attending'?` with ${count} guest(s)`:''}.${note?`\n\nMessage: ${note}`:''}`;open(whatsappUrl(msg,true),'_blank','noopener')});
$('#shareButton').addEventListener('click',async()=>{const url=weddingConfig.websiteUrl||location.href,msg=`With great happiness, we invite you to join us for the wedding celebration of ${weddingConfig.brideName} & ${weddingConfig.groomName} on 28 August 2026. Your presence and blessings would mean a lot to us.`;if(navigator.share){try{await navigator.share({title:document.title,text:msg,url});return}catch(e){if(e.name==='AbortError')return}}open(whatsappUrl(`${msg}\n\n${url}`),'_blank','noopener')});

const lightbox=$('#lightbox'); $$('.photo').forEach(b=>b.onclick=()=>{lightbox.querySelector('img').src=b.dataset.full;lightbox.classList.add('open');document.body.classList.add('locked')});
function closeLightbox(){lightbox.classList.remove('open');document.body.classList.remove('locked')} lightbox.querySelector('button').onclick=closeLightbox; lightbox.onclick=e=>{if(e.target===lightbox)closeLightbox()}; addEventListener('keydown',e=>{if(e.key==='Escape')closeLightbox()});

function launchPetals(burst=false){
  if(matchMedia('(prefers-reduced-motion: reduce)').matches)return;
  const canvas=$('#petals'),ctx=canvas.getContext('2d'),mobile=innerWidth<600,count=burst?(mobile?22:40):(mobile?7:12);
  const resize=()=>{canvas.width=innerWidth*devicePixelRatio;canvas.height=innerHeight*devicePixelRatio;ctx.setTransform(devicePixelRatio,0,0,devicePixelRatio,0,0)};resize();addEventListener('resize',resize,{passive:true});
  const colors=['#fffdf4','#efd9cf','#e7cc8b']; petals=Array.from({length:count},()=>({x:Math.random()*innerWidth,y:-Math.random()*innerHeight,r:3+Math.random()*5,v:.55+Math.random()*1.2,s:Math.random()*6.28,w:Math.random()*.03+.01,c:colors[Math.floor(Math.random()*colors.length)]}));
  if(petalRun)return;petalRun=true;let start=performance.now();function draw(now){ctx.clearRect(0,0,innerWidth,innerHeight);petals.forEach(p=>{p.y+=p.v;p.x+=Math.sin(p.s)*.35;p.s+=p.w;if(p.y>innerHeight+15){p.y=-15;p.x=Math.random()*innerWidth}ctx.save();ctx.translate(p.x,p.y);ctx.rotate(p.s);ctx.fillStyle=p.c;ctx.globalAlpha=.75;ctx.beginPath();ctx.ellipse(0,0,p.r,p.r*.45,0,0,Math.PI*2);ctx.fill();ctx.restore()});if(now-start<9000||entered){requestAnimationFrame(draw)}else petalRun=false}requestAnimationFrame(draw);
}

const questions = [ /* same 20 DDoS, Phishing, Termux questions */ 
{q:"What does DDoS stand for?",a:"Distributed Denial of Service",o:["Distributed Denial of Service","Domain Disruption of Server","Data Delay of System","Device Denial Service"]},
{q:"Which layer does an HTTP flood target?",a:"Application layer",o:["Transport layer","Application layer","Network layer","Data link layer"]},
{q:"What is the goal of a DDoS attack?",a:"Overload a server or network",o:["Steal credentials","Overload a server or network","Encrypt files","Gain admin access"]},
{q:"A botnet is used for?",a:"Launching coordinated attacks",o:["Creating backups","Launching coordinated attacks","Monitoring traffic","Encrypting files"]},
{q:"Common protocol in amplification attacks?",a:"DNS",o:["FTP","DNS","SMTP","SSH"]},
{q:"Phishing is?",a:"Tricking users into revealing personal info",o:["Scanning systems","Tricking users into revealing personal info","Encrypting files","Password cracking"]},
{q:"Spear phishing targets?",a:"Specific individuals or organizations",o:["Random users","Specific individuals or organizations","ISPs","Hackers"]},
{q:"Main defense against phishing?",a:"Multi-factor authentication",o:["Open all links","Ignore warnings","Multi-factor authentication","Disable antivirus"]},
{q:"Phishing relies on?",a:"Social engineering",o:["Social engineering","Coding errors","Network latency","Firewalls"]},
{q:"Suspicious sign in emails?",a:"Urgent request for information",o:["Proper domain","Urgent request for information","Formal greeting","HTTPS link"]},
{q:"Termux is used for?",a:"Running Linux commands on Android",o:["Running Linux commands on Android","Streaming videos","Editing photos","Calling functions"]},
{q:"Command to update Termux?",a:"pkg update && pkg upgrade",o:["pkg update && pkg upgrade","bash reload","sudo restart","termux --update"]},
{q:"Install Git in Termux?",a:"pkg install git",o:["pkg install git","bash get git","install git","add git"]},
{q:"List files in Termux?",a:"ls",o:["ls","cd","rm","pwd"]},
{q:"Navigate to parent directory?",a:"cd ..",o:["cd ..","ls -a","rm -rf","pwd"]},
{q:"Exit Termux command?",a:"exit",o:["exit","close","quit","end"]},
{q:"Language Termux can run natively?",a:"Python",o:["Python","C#","Java","Kotlin"]},
{q:"Termux provides?",a:"Linux environment on Android",o:["Linux environment on Android","Windows registry","Apple tools","Game emulator"]},
{q:"Termux package manager?",a:"pkg",o:["pkg","pip","brew","npm"]},
{q:"Best way to secure Termux tools?",a:"Use ethical hacking responsibly",o:["Disable Wi-Fi","Use ethical hacking responsibly","Share access","Ignore updates"]}
];

let current=0,score=0,username="",selectedAnswers=[];
const el=id=>document.getElementById(id);
const nameCard=el("nameCard"),usernameInput=el("usernameInput"),startQuizBtn=el("startQuizBtn"),nameError=el("nameError"),
quizCard=el("quizCard"),questionText=el("questionText"),answersContainer=el("answersContainer"),
nextBtn=el("nextBtn"),progressText=el("progressText"),progressBar=el("progressBar"),
resultModal=el("resultModal"),resultText=el("resultText"),rankText=el("rankText"),
answersReview=el("answersReview"),returnDashboard=el("returnDashboard"),retryQuiz=el("retryQuiz"),
userNameText=el("userNameText"),adminAccess=el("adminAccess"),adminModal=el("adminModal"),
adminLogin=el("adminLogin"),adminCancel=el("adminCancel"),adminMsg=el("adminMsg"),adminPass=el("adminPass");

startQuizBtn.onclick=()=>{
  const name=usernameInput.value.trim();
  if(!name||name.toLowerCase()==="guest"){nameError.style.display="block";return;}
  username=name;nameError.style.display="none";
  nameCard.classList.add("hidden");quizCard.classList.remove("hidden");
  showQuestion();
};

function shuffle(a){return a.sort(()=>Math.random()-0.5);}
function showQuestion(){
  const q=questions[current];
  progressText.textContent=`Question ${current+1} of ${questions.length}`;
  progressBar.style.width=`${(current/questions.length)*100}%`;
  questionText.textContent=q.q;
  answersContainer.innerHTML="";
  shuffle(q.o).forEach(opt=>{
    const div=document.createElement("div");
    div.className="answer";div.textContent=opt;
    div.onclick=()=>selectAnswer(div,opt===q.a);
    answersContainer.appendChild(div);
  });
}
function selectAnswer(el,correct){
  document.querySelectorAll(".answer").forEach(b=>b.classList.remove("selected"));
  el.classList.add("selected");el.dataset.correct=correct;
}
nextBtn.onclick=()=>{
  const chosen=document.querySelector(".answer.selected");
  if(!chosen)return alert("Please select an answer!");
  const correct=chosen.dataset.correct==="true";
  selectedAnswers.push({q:questions[current].q,a:questions[current].a,user:chosen.textContent,correct});
  if(correct)score++;
  current++;
  if(current<questions.length)showQuestion();else endQuiz();
};

function endQuiz(){
  progressBar.style.width="100%";quizCard.classList.add("hidden");
  resultModal.classList.remove("hidden");
  resultText.textContent=`You scored ${score} / ${questions.length}`;
  userNameText.textContent=`Well done, ${username}!`;
  const pct=(score/questions.length)*100;
  let rank="Beginner";if(pct>=80)rank="Expert";else if(pct>=50)rank="Intermediate";
  rankText.textContent=`Rank: ${rank} (${pct.toFixed(0)}%)`;
  let reviewHTML="<h3>Review</h3>";
  selectedAnswers.forEach((item,i)=>{
    reviewHTML+=`<p><strong>Q${i+1}:</strong> ${item.q}<br>
      <span class="${item.correct?'correct':'wrong'}">${item.correct?'✔ Correct':'✖ Wrong'} — Your answer: ${item.user}</span><br>
      <span class="muted">Correct: ${item.a}</span></p>`;
  });
  answersReview.innerHTML=reviewHTML;
  saveResult(score,rank);startConfetti();
}

function saveResult(score,rank){
  const key='unit17_leaderboard_v1';
  const data=JSON.parse(localStorage.getItem(key)||'{}');
  if(!data['CyberSecurity'])data['CyberSecurity']=[];
  data['CyberSecurity'].push({name:'Hacktivist Haven Quiz',score,date:new Date().toLocaleString(),level:rank});
  localStorage.setItem(key,JSON.stringify(data));
}

retryQuiz.onclick=()=>location.reload();
returnDashboard.onclick=()=>location.href="student-dashboard.html";

adminAccess.onclick=()=>{adminModal.style.display="flex";};
adminCancel.onclick=()=>{adminModal.style.display="none";adminPass.value="";};
adminLogin.onclick=()=>{
  if(adminPass.value==="rootaccess"){alert("Welcome, admin.");adminModal.style.display="none";}
  else adminMsg.style.display="block";
};

const canvas=document.getElementById("confettiCanvas"),ctx=canvas.getContext("2d");
function resize(){canvas.width=innerWidth;canvas.height=innerHeight;}
window.addEventListener("resize",resize);resize();
function startConfetti(){
  const confetti=Array.from({length:60},()=>({
    x:Math.random()*canvas.width,y:Math.random()*canvas.height,
    r:Math.random()*2+1,d:Math.random()*1+0.5,
    color:`hsl(${Math.random()*360},100%,70%)`
  }));
  let t=0;function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(c=>{
      ctx.beginPath();ctx.arc(c.x,c.y,c.r,0,Math.PI*2);
      ctx.fillStyle=c.color;ctx.fill();
      c.y+=c.d;if(c.y>canvas.height)c.y=0;
    });
    t++;if(t<500)requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
}

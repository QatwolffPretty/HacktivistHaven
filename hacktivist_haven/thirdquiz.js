const nameScreen = document.getElementById('name-screen');
const quizContainer = document.querySelector('.quiz-container');
const resultScreen = document.getElementById('result-screen');
const nextBtn = document.getElementById('next-btn');
const questionContainer = document.getElementById('question-container');
const progress = document.getElementById('progress');

let userName = "";
let current = 0;
let score = 0;

document.getElementById('startBtn').onclick = () => {
  const nameInput = document.getElementById('studentName').value.trim();
  if(!nameInput) return alert("Please enter your name first!");
  userName = nameInput;
  localStorage.setItem('quiz_user', userName);
  nameScreen.classList.add('hidden');
  quizContainer.classList.remove('hidden');
  loadQuestion();
};

const quizData = [
  {
    type:'objective',
    question:"What is ransomware?",
    translation:"Apakah itu ransomware?",
    options:["Malware that locks files for ransom","System cleaner","Network firewall","Hardware upgrade tool"],
    correct:"Malware that locks files for ransom"
  },
  {
    type:'objective',
    question:"How does ransomware usually spread?",
    translation:"Bagaimana ransomware biasanya tersebar?",
    options:["Phishing emails","Antivirus updates","System restore","Hardware upgrades"],
    correct:"Phishing emails"
  },
  {
    type:'objective',
    question:"What does a ransomware attacker usually demand?",
    translation:"Apa yang biasanya diminta oleh penyerang ransomware?",
    options:["Ransom payment","System access","Software update","Free antivirus"],
    correct:"Ransom payment"
  },
  {
    type:'objective',
    question:"Which file type is often used to deliver ransomware?",
    translation:"Jenis fail manakah sering digunakan untuk menghantar ransomware?",
    options:[".exe or .zip attachments",".txt files",".jpg images",".mp3 songs"],
    correct:".exe or .zip attachments"
  },
  {
    type:'objective',
    question:"What should you never do when infected by ransomware?",
    translation:"Apa yang anda tidak boleh lakukan apabila dijangkiti ransomware?",
    options:["Pay the ransom","Disconnect network","Inform IT","Use backup"],
    correct:"Pay the ransom"
  },
  {
    type:'objective',
    question:"Which is an example of ransomware?",
    translation:"Yang manakah contoh ransomware?",
    options:["WannaCry","Photoshop","Norton","Tor Browser"],
    correct:"WannaCry"
  },
  {
    type:'objective',
    question:"What is the first action if you suspect ransomware?",
    translation:"Apakah tindakan pertama jika anda mengesyaki ransomware?",
    options:["Disconnect from internet","Restart PC","Pay attacker","Install new browser"],
    correct:"Disconnect from internet"
  },
  {
    type:'objective',
    question:"How can backups help against ransomware?",
    translation:"Bagaimana sandaran membantu melawan ransomware?",
    options:["Restore encrypted files","Stop attack","Hide system","Speed performance"],
    correct:"Restore encrypted files"
  },
  {
    type:'objective',
    question:"Which of the following is NOT ransomware?",
    translation:"Yang manakah BUKAN ransomware?",
    options:["Trojan.Dropper","CryptoLocker","Ryuk","BadRabbit"],
    correct:"Trojan.Dropper"
  },
  {
    type:'objective',
    question:"Where should backups be stored?",
    translation:"Di mana sandaran harus disimpan?",
    options:["Offline or cloud storage","Same infected drive","USB always connected","Random folder"],
    correct:"Offline or cloud storage"
  },
  {
    type:'objective',
    question:"What does encryption mean in ransomware?",
    translation:"Apakah maksud penyulitan dalam ransomware?",
    options:["Locking files with code","Deleting data","Copying files","Scanning viruses"],
    correct:"Locking files with code"
  },
  {
    type:'objective',
    question:"Why are organizations targeted by ransomware?",
    translation:"Mengapa organisasi menjadi sasaran ransomware?",
    options:["They can pay larger ransom","They have fewer files","They’re unconnected","They are immune"],
    correct:"They can pay larger ransom"
  },
  {
    type:'objective',
    question:"What is a ransom note?",
    translation:"Apakah nota tebusan?",
    options:["Message demanding payment","Security update","Error report","Antivirus alert"],
    correct:"Message demanding payment"
  },
  {
    type:'objective',
    question:"Which one is a prevention step?",
    translation:"Yang manakah langkah pencegahan?",
    options:["Regular backups","Open unknown links","Ignore updates","Disable antivirus"],
    correct:"Regular backups"
  },
  {
    type:'objective',
    question:"What does decrypt mean?",
    translation:"Apa maksud menyahsulit?",
    options:["Unlock encrypted files","Delete system","Install ransomware","Hide folders"],
    correct:"Unlock encrypted files"
  },
  {
    type:'objective',
    question:"What is double extortion?",
    translation:"Apakah pemerasan berganda?",
    options:["Stealing and encrypting data","Running two antiviruses","Using two passwords","Backup twice"],
    correct:"Stealing and encrypting data"
  },
  {
    type:'objective',
    question:"What is the purpose of ransomware note?",
    translation:"Apakah tujuan nota ransomware?",
    options:["To threaten and demand money","To teach coding","To test firewalls","To inform antivirus"],
    correct:"To threaten and demand money"
  },
  {
    type:'objective',
    question:"What should companies do after recovery?",
    translation:"Apa perlu dilakukan syarikat selepas pemulihan?",
    options:["Improve security and train staff","Ignore incident","Delete backups","Change logo"],
    correct:"Improve security and train staff"
  },
  {
    type:'objective',
    question:"Which department usually handles ransomware?",
    translation:"Jabatan manakah biasanya mengendalikan ransomware?",
    options:["IT or Cybersecurity team","Finance department","Marketing","HR"],
    correct:"IT or Cybersecurity team"
  },
  {
    type:'objective',
    question:"What is the best long-term defense?",
    translation:"Apakah pertahanan jangka panjang terbaik?",
    options:["Awareness and training","Pay ransom","Ignore updates","Use pirated software"],
    correct:"Awareness and training"
  },
  // Subjective (5)
  {type:'subjective',question:"What should you do first if infected?",translation:"Apa yang patut anda buat dahulu jika dijangkiti?",answerKeywords:["disconnect","report","backup","restore"]},
  {type:'subjective',question:"Give one common delivery method of ransomware.",translation:"Beri satu cara ransomware disebar.",answerKeywords:["phishing","email","attachment","link"]},
  {type:'subjective',question:"Why should you not pay ransom?",translation:"Mengapa anda tidak patut bayar tebusan?",answerKeywords:["no guarantee","fund crime","backup","restore"]},
  {type:'subjective',question:"Name a famous ransomware example.",translation:"Namakan contoh ransomware terkenal.",answerKeywords:["wannacry","petya","ryuk","bad rabbit"]},
  {type:'subjective',question:"List one prevention method.",translation:"Senaraikan satu cara pencegahan.",answerKeywords:["backup","training","update","patch"]},
];

function shuffle(arr){return arr.sort(()=>Math.random()-0.5);}

function loadQuestion(){
  const q=quizData[current];
  questionContainer.classList.add('fade-in');
  questionContainer.innerHTML=`<div class='question'>${q.question}</div><div class='translation'>${q.translation}</div>`;
  if(q.type==='objective'){
    const opts=shuffle([...q.options]);
    const cont=document.createElement('div');cont.classList.add('options');
    opts.forEach(o=>{
      const div=document.createElement('div');
      div.classList.add('option');
      div.innerHTML=`${o}<br><span class='translation'>${translate(o)}</span>`;
      div.onclick=()=>{document.querySelectorAll('.option').forEach(el=>el.classList.remove('selected'));div.classList.add('selected');};
      cont.appendChild(div);
    });
    questionContainer.appendChild(cont);
  }else{
    questionContainer.innerHTML+=`<input type='text' id='subjective' placeholder='Your answer...' />`;
  }
  progress.style.width=`${(current/quizData.length)*100}%`;
}

function translate(opt){
  const t={
    "Malware that locks files for ransom":"Perisian hasad yang mengunci fail untuk tebusan",
    "Phishing emails":"Emel pancingan data",
    "Ransom payment":"Bayaran tebusan",
    ".exe or .zip attachments":"Lampiran .exe atau .zip",
    "Pay the ransom":"Bayar tebusan",
    "WannaCry":"WannaCry",
    "Disconnect from internet":"Putuskan sambungan internet",
    "Restore encrypted files":"Pulihkan fail yang disulitkan",
    "Trojan.Dropper":"Trojan.Dropper",
    "Offline or cloud storage":"Storan luar talian atau awan",
    "Locking files with code":"Mengunci fail dengan kod",
    "They can pay larger ransom":"Mereka boleh bayar tebusan lebih besar",
    "Message demanding payment":"Mesej yang menuntut bayaran",
    "Regular backups":"Sandaran berkala",
    "Unlock encrypted files":"Buka fail yang disulitkan",
    "Stealing and encrypting data":"Mencuri dan menyulitkan data",
    "To threaten and demand money":"Mengugut dan menuntut wang",
    "Improve security and train staff":"Tingkat keselamatan dan latih kakitangan",
    "IT or Cybersecurity team":"Pasukan IT atau keselamatan siber",
    "Awareness and training":"Kesedaran dan latihan"
  };return t[opt]||opt;
}

nextBtn.onclick=()=>{
  const q=quizData[current];
  let correct=false;
  if(q.type==='objective'){
    const sel=document.querySelector('.option.selected');
    if(sel && sel.textContent.includes(q.correct)) correct=true;
  }else{
    const ans=document.getElementById('subjective').value.toLowerCase();
    correct=q.answerKeywords.some(k=>ans.includes(k));
  }
  if(correct)score++;
  current++;
  if(current<quizData.length)loadQuestion();else showResult();
};

function showResult(){
  quizContainer.classList.add('hidden');
  resultScreen.classList.remove('hidden');
  const percent=Math.round((score/quizData.length)*100);
  let rank="Bronze";
  if(percent>=90)rank="Diamond";
  else if(percent>=75)rank="Gold";
  else if(percent>=50)rank="Silver";
  document.getElementById('score-text').textContent=`${userName}, you scored ${score}/${quizData.length} (${percent}%)`;
  document.getElementById('rank-display').innerHTML=`<p>Your Rank: <strong>${rank}</strong></p>`;
  startConfetti();
  const data=JSON.parse(localStorage.getItem('thirdquiz_leaderboard_v1')||'{}');
  if(!data['Week3'])data['Week3']=[];
  data['Week3'].push({name:userName,score:percent,date:new Date().toLocaleString()});
  localStorage.setItem('thirdquiz_leaderboard_v1',JSON.stringify(data));
}

// --- Enhanced Leaderboard Display ---
function loadLeaderboardSummary(){
  const key = 'thirdquiz_leaderboard_v1';
  const data = JSON.parse(localStorage.getItem(key) || '{}');
  const leaderboardSection = document.createElement('div');
  leaderboardSection.className = 'panel';
  leaderboardSection.innerHTML = `<h2>🏆 Leaderboard Summary</h2><p class="muted">Top performers from all quizzes</p>`;

  let all = [];
  Object.keys(data).forEach(level => {
    data[level].forEach(entry => {
      all.push({ ...entry, level });
    });
  });
  if (all.length === 0) {
    leaderboardSection.innerHTML += '<small>No leaderboard data yet.</small>';
  } else {
    all.sort((a,b) => b.score - a.score);
    const top5 = all.slice(0,5);
    let table = `<table style="width:100%;margin-top:12px;border-collapse:collapse">
      <thead><tr><th>Name</th><th>Score (%)</th><th>Level</th><th>Date</th></tr></thead><tbody>`;
    top5.forEach(row => {
      table += `<tr><td>${row.name}</td><td>${row.score}</td><td>${row.level}</td><td>${row.date}</td></tr>`;
    });
    table += '</tbody></table>';
    leaderboardSection.innerHTML += table;
  }

  document.querySelector('#quizList').prepend(leaderboardSection);
}
loadLeaderboardSummary();

function startConfetti(){
  const canvas=document.getElementById('confetti-canvas');
  const ctx=canvas.getContext('2d');
  canvas.width=window.innerWidth;
  canvas.height=window.innerHeight;
  const confetti=Array.from({length:100}).map(()=>({
    x:Math.random()*canvas.width,y:Math.random()*canvas.height-canvas.height,
    r:Math.random()*6+2,c:`hsl(${Math.random()*360},40%,70%)`,s:Math.random()*3+2
  }));
  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    confetti.forEach(p=>{ctx.beginPath();ctx.arc(p.x,p.y,p.r,0,Math.PI*2);ctx.fillStyle=p.c;ctx.fill();p.y+=p.s;if(p.y>canvas.height)p.y=-10;});
    requestAnimationFrame(draw);
  }draw();
}

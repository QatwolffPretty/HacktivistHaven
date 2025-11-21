// Unit17 Cybersecurity Quiz — Cleaned & Corrected

// ---------- QUESTION BANKS ----------
const BANKS = {
  beginner: [
    {q:'What does HTTPS indicate about a website?', a:['It is secure (encrypted)','It is faster','It has more ads','It is offline'], correct:0, explain:'HTTPS uses TLS to encrypt data in transit.'},
    {q:'Which practice improves password security?', a:['Using unique long passphrases','Using your birthday','Sharing passwords','Using "password"'], correct:0, explain:'Long, unique passwords reduce guessing and reuse risk.'},
    {q:'What is phishing?', a:['A scam to trick people into revealing data','A firewall tool','A network cable','A software update'], correct:0, explain:'Phishing uses fake messages or sites to steal credentials.'},
    {q:'What is malware?', a:['Malicious software','A security patch','A backup file','A hardware device'], correct:0, explain:'Malware is any software designed to harm or exploit.'},
    {q:'What does a VPN primarily provide?', a:['Encrypted tunnel for network traffic','Faster internet speed','Antivirus protection','Password manager'], correct:0, explain:'VPNs encrypt traffic over untrusted networks.'},
    {q:'Why should you update software regularly?', a:['To get security patches','To slow down system','To lose files','To change colors'], correct:0, explain:'Updates often include fixes for vulnerabilities.'},
    {q:'Which is a sign of a phishing email?', a:['Urgent request and poor grammar','Very long password','Frequent updates','High-resolution images'], correct:0, explain:'Scammers use urgency and mistakes to trick users.'},
    {q:'What is two-factor authentication (2FA)?', a:['An extra verification step beyond password','A firewall protocol','A network scanner','A file type'], correct:0, explain:'2FA adds an additional factor like code or biometrics.'},
    {q:'What should you do before opening an unexpected attachment?', a:['Verify sender and scan file','Open immediately','Forward to everyone','Delete your account'], correct:0, explain:'Confirm sender via different channel and scan the file.'},
    {q:'Which file extension is most likely to be executable?', a:['.exe','.txt','.jpg','.pdf'], correct:0, explain:'.exe can execute code on Windows systems.'},
    {q:'What is a firewall?', a:['A device or software that filters network traffic','A virus','A password','An email server'], correct:0, explain:'Firewalls allow or block traffic based on rules.'},
    {q:'What does "backup" mean?', a:['A copy of data stored separately','Deleting files','Sharing data publicly','Formatting disk'], correct:0, explain:'Backups let you recover from data loss or ransomware.'},
    {q:'Why avoid public Wi-Fi for sensitive tasks?', a:['Traffic can be intercepted by attackers','It is slower','It uses more battery','It is illegal'], correct:0, explain:'Untrusted networks allow eavesdropping without encryption.'},
    {q:'What is social engineering?', a:['Manipulating people to reveal info','Encrypting files','Updating software','Monitoring network traffic'], correct:0, explain:'It attacks human trust rather than technical vulnerabilities.'},
    {q:'What is the main purpose of antivirus software?', a:['Detect and remove malware','Speed up the CPU','Change screen resolution','Store passwords'], correct:0, explain:'Antivirus scans for known malicious patterns and removes them.'},
    {q:'What should you do after a suspected credential leak?', a:['Change passwords immediately','Wait for a week','Share passwords','Ignore it'], correct:0, explain:'Change passwords, enable 2FA and monitor accounts.'},
    {q:'What is the least secure password choice?', a:['123456','a random long passphrase','A password manager generated value','Unique combination of words'], correct:0, explain:'Short common passwords are trivial to guess.'},
    {q:'Which of these is personal data?', a:['Email address','Public government website','Company domain','Generic product name'], correct:0, explain:'Email links to an individual and is personal data.'},
    {q:'What is encryption?', a:['Transforming data to unreadable format without a key','Deleting files','Backing up data','Compressing files'], correct:0, explain:'Encryption protects confidentiality by encoding data.'},
    {q:'Who is responsible for cybersecurity?', a:['Everyone','Only IT','Only government','Only developers'], correct:0, explain:'Security is a shared responsibility across roles.'}
  ],
  hard: [
    {q:'What is SQL injection (SQLi)?', a:['Inserting malicious SQL via input fields','A type of firewall','Email spoofing','A packet filter'], correct:0, explain:'SQLi exploits unsanitized input to manipulate databases.'},
    {q:'What does XSS stand for?', a:['Cross-Site Scripting','Extra Secure Socket','XML Schema Service','Cross Server Sync'], correct:0, explain:'XSS injects scripts into pages viewed by others.'},
    {q:'What is CSRF?', a:['Cross-Site Request Forgery','Certificate Signing Request Form','Cookie Security Flag','Content Security Rule'], correct:0, explain:'CSRF tricks authenticated users into performing actions.'},
    {q:'What is a zero-day vulnerability?', a:['A previously unknown vulnerability without a patch','An expired certificate','A firewall misconfiguration','A leaked password'], correct:0, explain:'Zero-days are unknown to vendor and unpatched.'},
    {q:'What does CVE refer to?', a:['Common Vulnerabilities and Exposures identifier','Certificate Validation Error','Central Virus Engine','Control Vector Enumeration'], correct:0, explain:'CVE provides standard IDs for known vulnerabilities.'},
    {q:'What is a botnet used for?', a:['DDoS, spam, and other large-scale abuse','Secure VPNs','Password management','Antivirus testing'], correct:0, explain:'Botnets are networks of compromised devices under attacker control.'},
    {q:'Which tool is commonly used for network discovery and port scanning?', a:['Nmap','Photoshop','Excel','VLC'], correct:0, explain:'Nmap scans hosts and open ports for reconnaissance.'},
    {q:'What is privilege escalation?', a:['Attaining higher access rights than intended','Resetting a password','Updating software','Blocking ports'], correct:0, explain:'Escalation gives attackers more control after compromise.'},
    {q:'What is fuzzing?', a:['Automated testing with malformed inputs to find crashes','A firewall rule type','Encryption technique','Phishing method'], correct:0, explain:'Fuzzers send unexpected inputs to detect vulnerabilities.'},
    {q:'What is a honeypot?', a:['Decoy system to trap attackers and gather intel','A backup server','An authentication token','A logging service'], correct:0, explain:'Honeypots simulate vulnerable targets to study attackers.'},
    {q:'What is TLS used for?', a:['Encrypting network traffic (HTTPS)','Database replication','Local backups','Disk formatting'], correct:0, explain:'TLS secures communication channels like HTTPS.'},
    {q:'What is a man-in-the-middle (MITM) attack?', a:['Intercepting and possibly altering communication between parties','A type of backup','A patching method','A password policy'], correct:0, explain:'MITM places attacker between client and server to eavesdrop or modify.'},
    {q:'What is IDS (Intrusion Detection System)?', a:['Tool to detect suspicious activity','A storage device','A firewall vendor','An antivirus engine'], correct:0, explain:'IDS monitors and alerts on potential intrusions.'},
    {q:'What is OSINT?', a:['Open-Source Intelligence','Offline Security Integration','Organizational Security Inspection','Open System Interface Network'], correct:0, explain:'OSINT uses publicly available information for intelligence.'},
    {q:'What is certificate pinning?', a:['Binding expected certificate(s) to an application to prevent MITM','Pinning network devices to racks','Locking user accounts','A logging technique'], correct:0, explain:'Pinning prevents acceptance of rogue CA-signed certs.'},
    {q:'What is CVSS?', a:['Common Vulnerability Scoring System','Certificate Validation Signing Standard','Cloud Verification Security Scheme','Critical Virus Severity Scale'], correct:0, explain:'CVSS provides numerical severity scores for vulnerabilities.'},
    {q:'What is a supply-chain attack?', a:['Compromising software/hardware through a third-party vendor','Blocking network ports','Password spraying','Phishing campaign'], correct:0, explain:'Attackers target vendors to reach many customers.'},
    {q:'What is segmentation fault typically caused by?', a:['Invalid memory access','Slow network','Expired certificate','Old drivers'], correct:0, explain:'Segfaults occur when code accesses memory it shouldn’t.'},
    {q:'What is rate limiting used for?', a:['Preventing abuse by limiting request frequency','Encrypting connections','Storing logs','Backing up data'], correct:0, explain:'Rate limits mitigate brute-force and DoS abuse.'},
    {q:'Which principle restricts access to minimum required rights?', a:['Least privilege','Separation of duties','Defense-in-depth','Open access'], correct:0, explain:'Least privilege reduces potential damage of compromise.'}
  ],
  advanced: [
    {q:'What is a buffer overflow vulnerability?', a:['When excess data overwrites memory and may change control flow','A DNS cache issue','A firewall rule overflow','A web server error'], correct:0, explain:'Buffer overflows can lead to arbitrary code execution.'},
    {q:'What is ROP (Return-Oriented Programming)?', a:['Chaining existing code snippets (gadgets) to perform tasks','Remote orchestration protocol','A logging mechanism','An encryption scheme'], correct:0, explain:'ROP reuses small snippets in binaries to bypass defenses.'},
    {q:'What is ASLR?', a:['Address Space Layout Randomization','Automated Security Log Rotation','Application Service Load Runner','Asynchronous Link Routing'], correct:0, explain:'ASLR randomizes memory addresses to hinder exploits.'},
    {q:'What is a kernel rootkit?', a:['Malware that compromises the OS kernel to hide and persist','User-level spyware','A backup driver','A security patch'], correct:0, explain:'Kernel rootkits operate at the core OS level, making detection hard.'},
    {q:'What is SSRF (Server-Side Request Forgery)?', a:['Forcing a server to make requests to internal resources','Secure Shell Remote Forwarding','Server Sync Replication Failure','Session State Replay Function'], correct:0, explain:'SSRF abuses server trust to access internal services.'},
    {q:'What is blind SQL injection?', a:['Exploiting SQLi without visible output using inference or timing','Visible error-based SQLi','Network sniffing','Brute forcing'], correct:0, explain:'Blind SQLi extracts data via boolean/timing side effects.'},
    {q:'What is a side-channel attack?', a:['Attacks that infer secrets from indirect signals like timing or power','Direct SQL query','Phishing type','Firewall bypass'], correct:0, explain:'Side-channels leak information through unintended physical effects.'},
    {q:'What is protocol fuzzing?', a:['Sending malformed protocol messages to find implementation bugs','Encrypting protocols','Routing packets','Backing up config'], correct:0, explain:'Protocol fuzzing tests network services for robustness.'},
    {q:'What is PKI?', a:['Public Key Infrastructure','Private Key Integration','Packet Key Identifier','Protocol Key Interface'], correct:0, explain:'PKI manages certificates and keys for trust relationships.'},
    {q:'What is RCE (Remote Code Execution)?', a:['Execution of attacker-supplied code on a remote target','Read-only config error','Restricted credential escalation','Runtime checksum error'], correct:0, explain:'RCE allows attackers to run arbitrary commands or code remotely.'},
    {q:'What is certificate revocation (CRL/OCSP)?', a:['Mechanisms to mark certificates as no longer trusted','Certificate backup','A type of encryption','Firewall rule'], correct:0, explain:'CRLs and OCSP indicate certificates that should not be trusted.'},
    {q:'Which language is commonly considered memory-safe?', a:['Rust','C','Assembly','Basic'], correct:0, explain:'Rust enforces memory-safety rules to prevent many classes of bugs.'},
    {q:'What is privilege separation?', a:['Splitting programs into components with limited privileges','Granting all privileges','Combining services','Revoking users'], correct:0, explain:'Separation reduces impact of compromise by limiting privileges.'},
    {q:'What is a bootkit?', a:['Malware that infects the boot process before OS loads','User app','Antivirus update','Hardware patch'], correct:0, explain:'Bootkits persist by compromising early startup stages.'},
    {q:'What is a timing attack?', a:['Inferring secrets by measuring operation duration','Slowing networks','Packet replay','Session hijacking'], correct:0, explain:'Differences in execution time can leak sensitive data.'},
    {q:'What is sandbox escape?', a:['Breaking out of restricted execution environment to access host system','Creating sandbox','Updating container','Logging info'], correct:0, explain:'Escaping a sandbox undermines isolation controls.'},
    {q:'What is Control-Flow Integrity (CFI)?', a:['Technique ensuring program follows intended control flow','A logging standard','A network protocol','A file format'], correct:0, explain:'CFI defends against code-reuse and control-flow attacks.'},
    {q:'What is a firmware rootkit?', a:['Malware embedded in device firmware persisting across reinstalls','Normal firmware update','BIOS password','Driver signature'], correct:0, explain:'Firmware rootkits are persistent and hard to remove.'},
    {q:'What is homomorphic encryption (short)?', a:['Encryption that allows computations on ciphertexts','A type of hashing','A compression method','Password storage'], correct:0, explain:'Homomorphic schemes permit operations on encrypted data without decryption.'},
    {q:'What is binary exploitation?', a:['Attacking compiled programs by exploiting memory/format bugs','Web UI testing','Network scanning','Log analysis'], correct:0, explain:'Binary exploitation targets low-level vulnerabilities in compiled code.'}
  ]
};

// ---------- State ----------
let state = {
  level: '',
  username: '',
  questions: [],
  order: [],
  idx: 0,
  answers: []
};

// ---------- DOM refs ----------
const levelButtons = document.querySelectorAll('.level-btn');
const usernameInput = document.getElementById('username');
const setupPanel = document.getElementById('setupPanel');
const quizPanel = document.getElementById('quizPanel');
const resultPanel = document.getElementById('resultPanel');
const qIndexEl = document.getElementById('qIndex');
const qTotalEl = document.getElementById('qTotal');
const progEl = document.getElementById('prog');
const questionEl = document.getElementById('question');
const answersEl = document.getElementById('answers');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const skipBtn = document.getElementById('skipBtn');
const scoreEl = document.getElementById('score');
const correctEl = document.getElementById('correct');
const wrongEl = document.getElementById('wrong');
const skippedEl = document.getElementById('skipped');
const explainBox = document.getElementById('explainBox');
const lbLevel = document.getElementById('lbLevel');
const leaderboardEl = document.getElementById('leaderboard');
const clearLBBtn = document.getElementById('clearLB');
const exportLBBtn = document.getElementById('exportLB');
const saveScoreBtn = document.getElementById('saveScoreBtn');
const resultTitle = document.getElementById('resultTitle');
const resultSub = document.getElementById('resultSub');
const resultBadge = document.getElementById('resultBadge');
const resultDetails = document.getElementById('resultDetails');
const reviewBtn = document.getElementById('reviewBtn');
const playAgainBtn = document.getElementById('playAgainBtn');
const reviewArea = document.getElementById('reviewArea');
const confettiCanvas = document.getElementById('confetti');
const confCtx = confettiCanvas.getContext('2d');

// ---------- Helpers ----------
function shuffle(a) {
  const b = a.slice();
  for (let i = b.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [b[i], b[j]] = [b[j], b[i]];
  }
  return b;
}
function nowISO() { return new Date().toLocaleString(); }
function cap(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, m => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  }[m]));
}

// ---------- Event Listeners ----------
levelButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const level = btn.getAttribute('data-level');
    state.username = usernameInput.value.trim() || 'Guest';
    start(level);
  });
});

// ---------- Start Quiz ----------
function start(level) {
  state.level = level;
  const bank = (BANKS[level] || []).slice();
  const picked = shuffle(bank).slice(0, 20);
  state.questions = picked;
  state.order = shuffle(Array.from({ length: picked.length }, (_, i) => i));
  state.idx = 0;
  state.answers = Array(picked.length).fill(undefined);
  setupPanel.classList.add('hidden');
  resultPanel.classList.add('hidden');
  quizPanel.classList.remove('hidden');
  document.getElementById('saveName').value = state.username;
  render();
  updateStats();
  renderLeaderboard();
}

// ---------- Render Question ----------
function render() {
  const qIndex = state.order[state.idx];
  const q = state.questions[qIndex];
  qIndexEl.textContent = state.idx + 1;
  qTotalEl.textContent = state.questions.length;
  questionEl.textContent = q.q;
  answersEl.innerHTML = '';
  explainBox.textContent = '';
  q.a.forEach((opt, i) => {
    const div = document.createElement('div');
    div.className = 'ans';
    div.tabIndex = 0;
    div.innerHTML = `<span class="key">${String.fromCharCode(65 + i)}</span> <span>${opt}</span>`;
    div.addEventListener('click', () => choose(i));
    div.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') choose(i);
    });
    if (state.answers[qIndex] === i) div.classList.add('selected');
    answersEl.appendChild(div);
  });
  updateProgress();
}

// ---------- Choose & Navigation ----------
function choose(choice) {
  const qIndex = state.order[state.idx];
  state.answers[qIndex] = choice;
  Array.from(answersEl.children).forEach((n, i) =>
    n.classList.toggle('selected', i === choice)
  );
  const q = state.questions[qIndex];
  if (choice === q.correct) {
    explainBox.innerHTML = `<strong style="color:var(--accent)">Correct.</strong> <span class="muted">${q.explain || ''}</span>`;
  } else {
    explainBox.innerHTML = `<strong style="color:#ff6b6b">Wrong.</strong> Correct: <strong>${q.a[q.correct]}</strong>. <span class="muted">${q.explain || ''}</span>`;
  }
  updateStats();
  setTimeout(() => {
    if (state.idx < state.order.length - 1) { state.idx++; render(); }
    else finish();
  }, 350);
}
prevBtn.addEventListener('click', () => {
  if (state.idx > 0) { state.idx--; render(); }
});
nextBtn.addEventListener('click', () => {
  if (state.idx < state.order.length - 1) { state.idx++; render(); }
  else finish();
});
skipBtn.addEventListener('click', () => {
  const qIndex = state.order[state.idx];
  state.answers[qIndex] = undefined;
  updateStats();
  if (state.idx < state.order.length - 1) { state.idx++; render(); }
  else finish();
});

// ---------- Stats & Progress ----------
function updateProgress() {
  const pct = Math.round((state.idx / Math.max(1, state.order.length - 1)) * 100);
  progEl.style.width = pct + '%';
}
function updateStats() {
  let correct = 0, wrong = 0, skipped = 0, pts = 0;
  state.answers.forEach((v, i) => {
    if (v === undefined) skipped++;
    else if (v === state.questions[i].correct) { correct++; pts += 5; }
    else wrong++;
  });
  scoreEl.textContent = pts;
  correctEl.textContent = correct;
  wrongEl.textContent = wrong;
  skippedEl.textContent = skipped;
}

// ---------- Finish & Result ----------
function finish() {
  let correct = 0;
  state.answers.forEach((v, i) => {
    if (v !== undefined && v === state.questions[i].correct) correct++;
  });
  const total = state.questions.length;
  const pct = Math.round((correct / total) * 100);
  let badge = '';
  if (pct >= 85) badge = 'Hacker Elite';
  else if (pct >= 65) badge = 'Threat Analyst';
  else if (pct >= 50) badge = 'Cyber Guardian';
  else badge = 'Keep Learning';

  quizPanel.classList.add('hidden');
  resultPanel.classList.remove('hidden');
  resultTitle.textContent = `${escapeHtml(state.username)} — ${pct}%`;
  resultSub.textContent = `Score: ${scoreEl.textContent} points — ${correct}/${total} correct`;
  resultBadge.textContent = badge;
  resultDetails.innerHTML = `<div class="muted">Level: ${cap(state.level)} • Completed: ${nowISO()}</div>`;
  reviewArea.innerHTML = '';
  resultPanel.scrollIntoView({ behavior: 'smooth' });
  if (pct >= 50) fireConfetti();
}

// ---------- Leaderboard (local) ----------
const LB_KEY = 'unit17_leaderboard_v1';
function getLeaderboard() {
  try {
    const raw = localStorage.getItem(LB_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch (e) { return {}; }
}
function saveLeaderboard(obj) {
  localStorage.setItem(LB_KEY, JSON.stringify(obj));
}
function addScoreToLeaderboard(level, name, scorePoints) {
  const lb = getLeaderboard();
  if (!lb[level]) lb[level] = [];
  lb[level].push({ name: name || 'Guest', score: scorePoints, date: nowISO() });
  lb[level].sort((a, b) => b.score - a.score);
  lb[level] = lb[level].slice(0, 10);
  saveLeaderboard(lb);
  renderLeaderboard();
}
function renderLeaderboard() {
  const level = lbLevel.value;
  const lb = getLeaderboard();
  const list = lb[level] || [];
  leaderboardEl.innerHTML = '';
  if (list.length === 0) {
    leaderboardEl.innerHTML = `<div class="muted" style="padding:8px">No scores yet for ${cap(level)}.</div>`;
    return;
  }
  list.forEach((entry, i) => {
    const row = document.createElement('div'); row.className = 'row-entry';
    row.innerHTML = `<div style="display:flex;gap:8px;align-items:center"><div style="width:28px">${i + 1}.</div><div><strong>${escapeHtml(entry.name)}</strong><div class="muted" style="font-size:12px">${entry.date}</div></div></div><div><strong>${entry.score}</strong></div>`;
    leaderboardEl.appendChild(row);
  });
}
lbLevel.addEventListener('change', renderLeaderboard);
clearLBBtn.addEventListener('click', () => {
  if (!confirm('Clear all leaderboard data for this level?')) return;
  const lb = getLeaderboard();
  delete lb[lbLevel.value];
  saveLeaderboard(lb);
  renderLeaderboard();
});
exportLBBtn.addEventListener('click', () => {
  const data = getLeaderboard();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a'); a.href = url; a.download = 'unit17_leaderboard.json'; a.click();
  URL.revokeObjectURL(url);
});

// ---------- Save Score (local + Google Sheets) ----------
// Replace with your actual Google Apps Script web app URL
const GOOGLE_SHEET_URL = "https://script.google.com/macros/s/AKfycbwrMblm5fmGSSvkV9q53gyYow-LJqdof-3zNQwj-mHQJChEGYQd2t4h9uzehNjGN-s8/exec";

function sendScoreToGoogleSheet(name, score, level) {
  fetch(GOOGLE_SHEET_URL, {
    method: "POST",
    body: JSON.stringify({
      name: name,
      score: score,
      level: level,
      date: new Date().toLocaleString()
    }),
    headers: { "Content-Type": "application/json" }
  }).then(r => r.text()).then(console.log);
}

saveScoreBtn.addEventListener('click', () => {
  const name = (document.getElementById('saveName').value || state.username || 'Guest').trim();
  const pts = parseInt(scoreEl.textContent) || 0;
  addScoreToLeaderboard(state.level, name, pts); // local
  sendScoreToGoogleSheet(name, pts, state.level); // cloud
  alert('Score saved to leaderboard!');
});

// ---------- Review & Replay ----------
reviewBtn.addEventListener('click', () => {
  reviewArea.classList.toggle('hidden');
  if (!reviewArea.classList.contains('hidden')) buildReview();
});
playAgainBtn.addEventListener('click', () => {
  resultPanel.classList.add('hidden');
  setupPanel.classList.remove('hidden');
  renderLeaderboard();
});
function buildReview() {
  reviewArea.innerHTML = '';
  state.questions.forEach((q, i) => {
    const your = state.answers[i];
    const node = document.createElement('div');
    node.style.padding = '8px';
    node.style.borderTop = '1px solid rgba(255,255,255,0.02)';
    node.innerHTML = `<strong>${i + 1}.</strong> ${q.q}<div class="muted" style="margin-top:6px">Your answer: <strong>${your === undefined ? 'No answer' : q.a[your]}</strong> • Correct: <strong>${q.a[q.correct]}</strong><div style="margin-top:6px;color:var(--muted)">${q.explain || ''}</div></div>`;
    reviewArea.appendChild(node);
  });
}

// ---------- Keyboard ----------
window.addEventListener('keydown', (e) => {
  if (quizPanel.classList.contains('hidden')) return;
  if (['1', '2', '3', '4'].includes(e.key)) {
    const idx = parseInt(e.key) - 1;
    const children = answersEl.children;
    if (children[idx]) children[idx].click();
  }
  if (e.key === 'ArrowRight') { nextBtn.click(); }
  if (e.key === 'ArrowLeft') { prevBtn.click(); }
  if (e.key === 's') skipBtn.click();
});

// ---------- Confetti ----------
function resizeCanvas() {
  confettiCanvas.width = confettiCanvas.clientWidth;
  confettiCanvas.height = confettiCanvas.clientHeight;
}
window.addEventListener('resize', resizeCanvas); resizeCanvas();
let confettiPieces = [];
function fireConfetti() {
  confettiPieces = [];
  for (let i = 0; i < 120; i++)
    confettiPieces.push({
      x: Math.random() * confettiCanvas.width,
      y: -20 - Math.random() * 200,
      r: 4 + Math.random() * 8,
      vx: (Math.random() - 0.5) * 3,
      vy: 1 + Math.random() * 3,
      rot: Math.random() * 360,
      vr: (Math.random() - 0.5) * 12
    });
  requestAnimationFrame(drawConfetti);
  setTimeout(() => confettiPieces = [], 4200);
}
function drawConfetti() {
  confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
  confettiPieces.forEach(c => {
    c.x += c.vx; c.y += c.vy; c.vy += 0.02; c.rot += c.vr;
    confCtx.save(); confCtx.translate(c.x, c.y); confCtx.rotate(c.rot * Math.PI / 180);
    confCtx.fillStyle = 'rgba(255,255,255,0.9)';
    confCtx.fillRect(-c.r / 2, -c.r / 2, c.r, c.r / 2);
    confCtx.restore();
  });
  if (confettiPieces.length) requestAnimationFrame(drawConfetti);
}

// ---------- Admin Button ----------
document.getElementById('adminLoginBtn').onclick = function() {
  window.location.href = "admin page.html";
};

// ---------- Init ----------
renderLeaderboard();



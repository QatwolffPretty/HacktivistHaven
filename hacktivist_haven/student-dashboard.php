<?php
session_start();
if (!isset($_SESSION['logged_in'])) {
    header("Location: signin.html");
    exit();
}

// ✅ Admin protection for admin page
if (basename($_SERVER['PHP_SELF']) === "admin-dashboard.php" && $_SESSION['role'] !== "admin") {
    header("Location: student-dashboard.php");
    exit();
}
?>


<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Student Dashboard</title>
  <link rel="icon" type="image/x-icon" href="forum-bg.png" />
  <link rel="stylesheet" href="index.css" />
  <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
  <style>
    :root{
      --bg-red:#6e0000;
      --bg-grey:#1a1a1a;
      --accent1:#ff2d55;
      --accent2:#ff6b81;
      --muted:#9aa4ab;
      --glass:rgba(255,255,255,0.04);
    }
    html,body{height:100%;margin:0;font-family:Inter,-apple-system,system-ui,'Segoe UI',Roboto,Arial;
      color:#fff;background:linear-gradient(135deg,var(--bg-red),var(--bg-grey));transition:background .6s ease;}
    .wrap{padding:24px;display:flex;justify-content:center}
    .container{width:1180px;max-width:96%;border-radius:18px;padding:18px;
      background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));
      backdrop-filter:blur(18px)saturate(140%);
      box-shadow:0 30px 80px rgba(0,0,0,0.6);
      border:1px solid rgba(255,255,255,0.03);}
    header{display:flex;justify-content:space-between;align-items:center}
    .brand{display:flex;gap:12px;align-items:center}
    .logo {
      width: 56px;
      height: 56px;
      border-radius: 12px;
      background: linear-gradient(135deg, #000 40%, #ff2d55 120%);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      box-shadow:
        0 0 15px rgba(255, 45, 85, 0.7),
        0 0 30px rgba(255, 45, 85, 0.4),
        inset 0 0 8px rgba(255, 45, 85, 0.5);
      transition: box-shadow 0.4s ease, transform 0.3s ease;
    }
    .logo:hover {
      transform: scale(1.05);
      box-shadow:
        0 0 25px rgba(255, 45, 85, 0.9),
        0 0 40px rgba(255, 45, 85, 0.6),
        inset 0 0 10px rgba(255, 45, 85, 0.6);
    }
    .logo img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      border-radius: 12px;
    }

    h1 { 
      margin:0;
      font-size:18px;
    }

    .lead { 
      color:var(--muted);
      font-size:13px;
    }

    nav { 
      display:flex;
      gap:10px;
      align-items:center
    }

    .nav-link {
      padding:8px 12px;
      border-radius:10px;
      color:var(--muted);
      text-decoration:none;
      border:1px solid transparent;
    }

    .nav-link:hover {
      color:#fff;
    }

    .nav-primary { 
      background:linear-gradient(90deg,var(--accent1),var(--accent2));
      color:#14080a;
      font-weight:700;
      border:0;
    }

    .layout {
      display:grid;
      grid-template-columns:320px 1fr 320px;
      gap:18px;
      margin-top:18px;
    }

    @media (max-width:1100px) {
      .layout {
        grid-template-columns:1fr;
      }
    }

    .panel { 
      padding:16px;
      border-radius:12px;
      background:linear-gradient(180deg,rgba(255,255,255,0.015),rgba(255,255,255,0.01));
      border:1px solid rgba(255,255,255,0.02);
    }

    .profile { display:flex;
      gap:12px;
      align-items:center;
    }

    .avatar {  
      width:72px;
      height:72px;
      border-radius:14px;
      background:linear-gradient(135deg,rgba(255,255,255,0.03),rgba(255,255,255,0.02));
      display:flex;
      align-items:center;
      justify-content:center;
      font-weight:800;
      font-size:22px;
      text-transform:uppercase;
    }
    
    .greet { 
      line-height:1;
    }
    
    .greet .name { 
      font-weight:800;
      font-size:16px;
      color:var(--accent1);
    }

    .muted {
      color:var(--muted);
    }

    .side-nav { 
      margin-top:12px;
      display:flex;
      flex-direction:column;
      gap:8px;
    }

    .side-btn { 
      display:flex;
      align-items:center;
      gap:8px;
      padding:10px;
      border-radius:10px;
      background:transparent;
      border:1px solid rgba(255,255,255,0.02);
      color:var(--muted);
      cursor:pointer;
      transition:transform .18s,box-shadow .18s;
    }
    
    .side-btn:hover{transform:translateY(-4px);box-shadow:0 8px 30px rgba(255,45,85,0.12)}
    .side-btn.active{background:linear-gradient(90deg,var(--accent1),rgba(0,0,0,0.04));color:#14080a;font-weight:700}
    .card-title{display:flex;justify-content:space-between;align-items:center;gap:12px}
    .stats-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:12px;margin-top:12px}
    .stat{padding:12px;border-radius:12px;background:rgba(255,255,255,0.02);border:1px solid rgba(255,255,255,0.02);text-align:center}
    .stat .big{font-size:20px;font-weight:800;color:var(--accent1)}
    table{width:100%;border-collapse:collapse;margin-top:12px}
    th,td{padding:10px;text-align:left;border-bottom:1px solid rgba(255,255,255,0.02);font-size:13px}
    th{color:var(--muted);font-weight:700}
    .badge{padding:6px 8px;border-radius:999px;background:linear-gradient(90deg,var(--accent1),var(--accent2));color:#14080a;font-weight:800;font-size:12px}
    .chart-wrap{padding:12px;border-radius:12px;background:var(--glass);border:1px solid rgba(255,255,255,0.02);display:flex;flex-direction:column;align-items:center}
    canvas{max-width:220px}
    .notes{margin-top:12px;padding:10px;border-radius:8px;background:linear-gradient(180deg,rgba(20,20,20,0.3),rgba(255,255,255,0.01));width:100%}
    .note-item{padding:8px;border-radius:8px;background:transparent;border:1px dashed rgba(255,255,255,0.02);margin-bottom:8px;display:flex;justify-content:space-between;align-items:center;opacity:1;transition:opacity .3s ease}
    .note-item.removing{opacity:0}
    .delete-btn{background:transparent;border:none;color:var(--accent1);cursor:pointer;font-size:16px;transition:transform .2s;}
    .delete-btn:hover{transform:scale(1.2);color:#ff6b81}
    .btn{padding:10px 14px;border-radius:10px;border:0;cursor:pointer}
    .btn.ghost{background:transparent;border:1px solid rgba(255,255,255,0.04);color:var(--muted)}
    .btn.primary{background:linear-gradient(90deg,var(--accent1),var(--accent2));color:#14080a;font-weight:800}

    /* Glassmorph confirm modal */
    #modalOverlay{position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.4);
      backdrop-filter:blur(6px);display:none;justify-content:center;align-items:center;z-index:999;}
    #confirmModal{background:linear-gradient(180deg,rgba(30,30,30,0.8),rgba(0,0,0,0.6));
      border:1px solid rgba(255,255,255,0.1);border-radius:16px;padding:24px 28px;max-width:320px;
      box-shadow:0 20px 60px rgba(0,0,0,0.6);text-align:center;}
    #confirmModal h3{margin-top:0;font-weight:700;margin-bottom:10px;}
    #confirmModal p{color:var(--muted);margin-bottom:20px;font-size:14px;}
    .modal-btns{display:flex;justify-content:center;gap:10px;}
    .modal-btn{padding:10px 16px;border-radius:10px;border:0;cursor:pointer;font-weight:600;}
    .cancel-btn{background:transparent;border:1px solid rgba(255,255,255,0.2);color:var(--muted);}
    .delete-confirm{background:linear-gradient(90deg,var(--accent1),var(--accent2));color:#14080a;}

    /* Responsive Design for Mobile and Small Devices */
    @media (max-width: 768px) {
      .wrap { padding: 12px; }
      .container { padding: 12px; max-width: 100%; }
      header { flex-direction: column; gap: 12px; text-align: center; }
      .brand { justify-content: center; }
      nav { justify-content: center; flex-wrap: wrap; }
      .layout { grid-template-columns: 1fr; gap: 12px; }
      .stats-grid { grid-template-columns: repeat(2, 1fr); gap: 8px; }
      .stat { padding: 8px; }
      .stat .big { font-size: 16px; }
      .chart-wrap canvas { max-width: 150px; height: 150px; }
      .notes input, .btn { font-size: 14px; padding: 8px 12px; }
      .table-wrap { overflow-x: auto; }
      table { font-size: 12px; min-width: 400px; }
      th, td { padding: 8px 4px; }
      .modal-btns { flex-direction: column; gap: 8px; }
      .modal-btn { width: 100%; }
    }

    @media (max-width: 480px) {
      .wrap { padding: 8px; }
      .container { padding: 8px; }
      .logo { width: 48px; height: 48px; }
      .avatar { width: 60px; height: 60px; font-size: 18px; }
      h1 { font-size: 16px; }
      .lead { font-size: 12px; }
      .stats-grid { grid-template-columns: 1fr; }
      .stat .big { font-size: 14px; }
      .chart-wrap canvas { max-width: 120px; height: 120px; }
      .notes input { font-size: 12px; }
      .btn { font-size: 12px; padding: 6px 10px; }
      .panel { padding: 12px; }
      .card-title { flex-direction: column; gap: 8px; align-items: flex-start; }
    }
  </style>
</head>
<body>
  <div class="wrap">
    <div class="container">
      <header>
        <div class="brand">
          <div class="logo">
            <img src="forum-bg.png" style="width:100%;height:100%;object-fit:cover;border-radius:12px;">
          </div>
          <div>
            <h1>Hacktivist Haven</h1>
            <div class="lead">Student Forum · Quizzes · Notes</div>
          </div>
        </div>
        <nav>
          <a class="nav-link" href="community.html">Community</a>
          <a class="nav-link" id="nav-notes" href="#">Notes</a>
          <a class="nav-link nav-primary" href="signin.html">Log out</a>
        </nav>
      </header>

      <div class="layout">
        <div class="panel">
          <div class="profile">
            <div class="avatar" id="avatarInitial">S</div>
            <div>
              <div class="greet">Hello, <div class="name" id="greetName">Kittendusty</div></div>
              <div class="muted" id="greetExtra">Welcome back to Hacktivist Haven</div>
            </div>
          </div>
          <div class="side-nav">
            <button class="side-btn active" data-view="dashboard">Dashboard</button>
            <button class="side-btn" data-view="quizzes">My Quizzes</button>
            <button class="side-btn" data-view="notes">Reminder</button>
            <button class="side-btn" data-view="classnotes">Class Notes</button>
            <button class="side-btn" data-view="profile">Profile Settings</button>
            <button class="side-btn" data-view="payments">Payments</button>
          </div>
        </div>

        <main class="panel" id="mainPanel"></main>

        <aside>
          <div class="chart-wrap panel">
            <div class="muted">Your Rank in Hacktivist Haven</div>
            <canvas id="rankDonut" width="220" height="220"></canvas>
            <div style="margin-top:10px"><strong id="rankText">—</strong></div>
          </div>
          <div style="margin-top:12px" class="panel">
            <div style="display:flex;justify-content:space-between;align-items:center"><strong>Reminder</strong><small class="muted">Pinned</small></div>
            <div class="notes" id="notesList"></div>
            <div style="margin-top:8px;display:flex;gap:8px"><input id="newNote" type="text" placeholder="Quick note..." />
              <button class="btn primary" id="saveNote">Save</button>
            </div>
          </div>
        </aside>
      </div>

      <footer style="margin-top:14px;text-align:center;color:var(--muted);font-size:13px">Designed with love · by Kitten</footer>
    </div>
  </div>

  <!-- Confirm Modal -->
  <div id="modalOverlay">
    <div id="confirmModal">
      <h3>Delete Note</h3>
      <p>Are you sure you want to delete this note?</p>
      <div class="modal-btns">
        <button class="modal-btn cancel-btn" id="cancelDel">Cancel</button>
        <button class="modal-btn delete-confirm" id="confirmDel">Delete</button>
      </div>
    </div>
  </div>

  <script src="index.js"></script>
  <script>
  let rankChart;
  let noteToDelete = null;

  function showConfirmModal(callback){
    const overlay=document.getElementById('modalOverlay');
    overlay.style.display='flex';
    document.getElementById('cancelDel').onclick=()=>{overlay.style.display='none';noteToDelete=null;}
    document.getElementById('confirmDel').onclick=()=>{overlay.style.display='none';callback();}
  }

  function loadUser(){
    const user=JSON.parse(localStorage.getItem('hh_user')||'null');
    if(user){
      document.getElementById('greetName').textContent=user.fullname||user.username||'Student';
      document.getElementById('greetExtra').textContent='Username: '+(user.username||'—');
      document.getElementById('avatarInitial').textContent=(user.username?user.username[0]:'S').toUpperCase();
    }
  }

  function loadNotes(){
    const notes = JSON.parse(localStorage.getItem('hh_notes')||'[]');
    const out=document.getElementById('notesList');out.innerHTML='';
    if(notes.length===0){out.innerHTML='<div class="muted">No notes yet</div>';return;}
    notes.forEach(n=>{const d=document.createElement('div');d.className='note-item';d.textContent=n;out.appendChild(d)});
  }

  document.getElementById('saveNote').addEventListener('click',()=>{const v=document.getElementById('newNote').value.trim();if(!v)return;const n=JSON.parse(localStorage.getItem('hh_notes')||'[]');n.unshift(v);localStorage.setItem('hh_notes',JSON.stringify(n));document.getElementById('newNote').value='';loadNotes();});

  function renderRankDonut(all){
    const ctx=document.getElementById('rankDonut').getContext('2d');
    if(rankChart) rankChart.destroy();
    if(!all||all.length===0){rankChart=new Chart(ctx,{type:'doughnut',data:{labels:['No Data'],datasets:[{data:[1],backgroundColor:['rgba(255,255,255,0.1)']}]},options:{plugins:{legend:{display:false}}}});
      document.getElementById('rankText').textContent='No data yet';return;
    }
    const userBest=Math.max(...all.map(x=>x.score||0));
    const globalBest=100;const pct=Math.round((userBest/globalBest)*100);const remain=100-pct;
    rankChart=new Chart(ctx,{type:'doughnut',data:{labels:['You','Others'],datasets:[{data:[pct,remain],backgroundColor:['#ff2d55','rgba(255,255,255,0.08)'],hoverOffset:8}]},options:{cutout:'70%',plugins:{legend:{display:false}},animation:{animateRotate:true,duration:900}}});
    document.getElementById('rankText').textContent=`Top ${Math.max(1,100-pct)}% • ${userBest} pts`;
  }

  // 🔥 UPDATED: Payments and Profile sections
  function loadDashboard(view='dashboard'){
    const panel=document.getElementById('mainPanel');panel.innerHTML='';

    if(view==='profile'){
      const user=JSON.parse(localStorage.getItem('hh_user')||'{}');
      panel.innerHTML = `
        <div class='panel' style='margin:10px'>
          <h2>Profile Settings</h2>
          <p class='muted'>Update your profile information.</p>
          <div style='margin-top:16px'>
            <label for='profileFullname' style='display:block;margin-bottom:8px;color:var(--muted);'>Full Name</label>
            <input type='text' id='profileFullname' value='${user.fullname||''}' style='width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;margin-bottom:16px;'>
            <label for='profileUsername' style='display:block;margin-bottom:8px;color:var(--muted);'>Username</label>
            <input type='text' id='profileUsername' value='${user.username||''}' style='width:100%;padding:10px;border-radius:8px;border:1px solid rgba(255,255,255,0.1);background:rgba(255,255,255,0.05);color:#fff;margin-bottom:16px;'>
            <button class='btn primary' id='saveProfile'>Save Changes</button>
          </div>
        </div>`;
      document.getElementById('saveProfile').onclick = () => {
        const fullname = document.getElementById('profileFullname').value.trim();
        const username = document.getElementById('profileUsername').value.trim();
        if(!username) return alert('Username is required.');
        const updatedUser = { ...user, fullname, username };
        localStorage.setItem('hh_user', JSON.stringify(updatedUser));
        loadUser();
        alert('Profile updated successfully!');
      };
      return;
    }

    if(view==='payments'){
      const payment = JSON.parse(localStorage.getItem('hh_payment') || '{"status":"unpaid"}');

      if(payment.status === 'paid'){
        panel.innerHTML = `
          <div class='panel' style='margin:10px'>
            <h2>Payment Receipt</h2>
            <p class='muted'>Thank you for your payment, your fees are confirmed.</p>
            <div class='panel' style='background:linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01));border-radius:12px;padding:12px;'>
              <strong>Receipt ID:</strong> ${payment.id}<br>
              <strong>Paid On:</strong> ${payment.date}<br>
              <strong>Amount:</strong> RM ${payment.amount}<br>
              <strong>Status:</strong> ✅ Paid
            </div>
            <div style='margin-top:16px'>
              <button class='btn ghost' id='resetPayment'>Reset Payment</button>
            </div>
          </div>`;
        document.getElementById('resetPayment').onclick = () => {
          localStorage.removeItem('hh_payment');
          loadDashboard('payments');
        };
      } else {
        panel.innerHTML = `
          <div class='panel' style='margin:10px'>
            <h2>Payments</h2>
            <p class='muted'>Payment status:</p>
            <div class='panel' style='display:flex;justify-content:space-between;align-items:center;padding:12px;'>
              <div>Payment Status: <strong id='feeStatus'>Unpaid</strong></div>
              <div style='display:flex;gap:8px'>
                <button class='btn primary' id='payNow'>Pay Now</button>
                <button class='btn ghost' id='markPaid'>Already Paid</button>
              </div>
            </div>
          </div>`;
        document.getElementById('payNow').onclick = () => alert('Payment simulated.');
        document.getElementById('markPaid').onclick = () => {
          const receipt = {
            status: 'paid',
            id: 'HH-' + Math.floor(Math.random() * 1000000),
            date: new Date().toLocaleString(),
            amount: 200.00
          };
          localStorage.setItem('hh_payment', JSON.stringify(receipt));
          loadDashboard('payments');
        };
      }
      return;
    }

    if(view==='quizzes'){
      panel.innerHTML=`<div style="padding:16px"><h2>My Quizzes</h2><p class="muted">Select a quiz to start.</p><div style="margin-top:16px;display:flex;flex-direction:column;gap:12px"><button class="btn primary" onclick="window.location='index.html'">Week 1</button><button class="btn primary" onclick="window.location='secondquiz.html'">Week 2</button><button class="btn primary" onclick="window.location='thirdquiz.html'">Week 3</button></div></div>`;
      return;
    }

    if(view==='classnotes'){
      panel.innerHTML=`<div style="padding:16px"><h2>Class Notes</h2><p class="muted">Notes covered by the admin on previous topics.</p><div style="margin-top:16px"><div class="note-item"><strong>Week 1: Introduction to Programming</strong><br><small class="muted">Basics of variables, loops, and functions.</small><br><button class="btn primary" onclick="window.open('week1.pdf')">Download PDF</button></div><div class="note-item"><strong>Week 2: Data Structures</strong><br><small class="muted">Arrays, lists, and basic algorithms.</small><br><button class="btn primary" onclick="window.open('week2.pdf')">Download PDF</button></div><div class="note-item"><strong>Week 3: Advanced Topics</strong><br><small class="muted">Object-oriented programming and error handling.</small><br><button class="btn primary" onclick="window.open('week3.pdf')">Download PDF</button></div></div></div>`;
      return;
    }

    if(view==='notes'){ // unchanged
      const notes=JSON.parse(localStorage.getItem('hh_notes')||'[]');
      let html='<div style="padding:16px"><h2>Your Notes</h2>';
      if(notes.length===0) html+='<p class="muted">No notes saved yet.</p>';
      notes.forEach((n,i)=>{
        html+=`<div class='note-item' data-index='${i}'><span>${n}</span><button class='delete-btn' title='Delete'>🗑️</button></div>`;
      });
      html+='</div>';panel.innerHTML=html;

      panel.querySelectorAll('.delete-btn').forEach(btn=>{
        btn.addEventListener('click',()=>{
          const div=btn.closest('.note-item');
          const index=div.dataset.index;
          showConfirmModal(()=>{
            div.classList.add('removing');
            setTimeout(()=>{
              const notes=JSON.parse(localStorage.getItem('hh_notes')||'[]');
              notes.splice(index,1);
              localStorage.setItem('hh_notes',JSON.stringify(notes));
              loadDashboard('notes');
              loadNotes();
            },300);
          });
        });
      });
      return;
    }

    panel.innerHTML=`<div class='card-title'><div><p class='welcome'>Good day, <strong id='mainName'>Kittendusty</strong> 👋</p><div class='muted'>Here’s what you’ve been up to — your recent quiz activity, scores and progress.</div></div><div><button class='btn ghost' id='btnTakeQuiz'>Take Quiz</button></div></div><div class='stats-grid' style='margin-top:16px'><div class='stat'><div class='muted'>Total Points</div><div class='big' id='statPoints'>0</div></div><div class='stat'><div class='muted'>Best Rank</div><div class='big' id='statRank'>—</div></div><div class='stat'><div class='muted'>Accuracy</div><div class='big' id='statAcc'>0%</div></div></div><div style='margin-top:18px'><div style='display:flex;justify-content:space-between;align-items:center'><strong>Recent Quizzes</strong><div class='muted'>Showing latest attempts</div></div><table id='quizTable'><thead><tr><th>Quiz</th><th>Date</th><th>Score</th><th>Level</th></tr></thead><tbody></tbody></table></div>`;
    document.getElementById('btnTakeQuiz').addEventListener('click',()=>{window.location='index.html';});
    loadQuizResults();
  }

  function loadQuizResults(){
    const user = JSON.parse(localStorage.getItem('hh_user') || '{}');
    const userName = user.username || user.fullname || '';
    const quizzes = ['unit17', 'secondquiz', 'thirdquiz'];
    let all = [];
    quizzes.forEach(quiz => {
      const key = `${quiz}_leaderboard_v1`;
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      Object.keys(data).forEach(level => {
        data[level].forEach(entry => {
          if (entry.name === userName) {
            all.push({ ...entry, level, quiz });
          }
        });
      });
    });
    const tbody = document.querySelector('#quizTable tbody');
    tbody.innerHTML = '';
    if (all.length === 0) {
      tbody.innerHTML = '<tr><td colspan="4" class="muted">No quiz attempts yet. Go take one!</td></tr>';
      renderRankDonut([]);
      return;
    }
    all.sort((a, b) => new Date(b.date) - new Date(a.date));
    all.forEach(r => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${r.quiz}</td><td>${r.date || '-'}</td><td><span class='badge'>${r.score || 0}</span></td><td>${r.level}</td>`;
      tbody.appendChild(tr);
    });
    const total = all.reduce((s, i) => s + (i.score || 0), 0);
    document.getElementById('statPoints').textContent = total;
    document.getElementById('statAcc').textContent = all.length ? Math.round(total / (all.length * 100) * 100) + '%' : '0%';
    document.getElementById('statRank').textContent = '#' + Math.floor(Math.random() * 50 + 1);
    renderRankDonut(all);
  }

  document.querySelectorAll('.side-btn').forEach(b=>b.addEventListener('click',()=>{document.querySelectorAll('.side-btn').forEach(x=>x.classList.remove('active'));b.classList.add('active');loadDashboard(b.dataset.view);}));loadUser();loadDashboard();loadNotes();
  </script>
</body>
</html>

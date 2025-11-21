// Sidebar Navigation
document.querySelectorAll(".side-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    document.querySelectorAll(".side-btn").forEach(b => b.classList.remove("active"));
    btn.classList.add("active");
    loadView(btn.dataset.view);
  });
});

function loadView(view = "dashboard") {
  const panel = document.getElementById("mainPanel");
  panel.innerHTML = "";

  if (view === "dashboard") {
    panel.innerHTML = `
      <h2>Dashboard</h2>
      <p class="muted">Welcome to admin control panel.</p>
      <div id="stats"></div>
    `;
    loadDashboardStats();
    loadPinnedAnnouncements();
  }

  if (view === "community") {
    panel.innerHTML = `
      <h2>Community Posts</h2>
      <div id="communityPosts"></div>
    `;
    loadCommunityPosts();
  }


if (view === "posts") {
  panel.innerHTML = `
    <div style="padding:16px">
      <h2>Post Announcement</h2>
      <label>Title</label><input id="postTitle"/>
      <label>Tag</label>
      <select id="postTag">
        <option>General</option>
        <option>Cybersecurity</option>
        <option>Event</option>
      </select>
      <label>Content</label><textarea id="postContent"></textarea>

      <button class="btn primary" id="postSubmit">Post</button>

      <h3 style="margin-top:20px">Existing Announcements</h3>
      <div id="announcementList"></div>
    </div>`;
  
  document.getElementById("postSubmit").onclick = createAnnouncement;
  loadAnnouncements();
}


  if (view === "logout") {
    localStorage.removeItem("hh_signed");
    window.location = "backend/logout-admin.php";
  }
}

// --- Fetch Data ---
async function loadDashboardStats() {
  const res = await fetch("backend/admin_get_announcements.php");
  const data = await res.json();
  document.getElementById("stats").innerHTML = `
    <strong>Total Announcements: ${data.length}</strong>
  `;
}

async function loadCommunityPosts() {
  const res = await fetch("backend/get_posts.php")
    .then(res => res.json())
    .then(post => {
      renderPosts(post);
    });
  const data = await res.json();

  // Filter only non-deleted posts
  const visiblePosts = data.filter(c => c.deleted == 0);

  const box = document.getElementById("communityPosts");
  box.innerHTML = visiblePosts.map(c => `
    <div class="card">
      <strong>${c.title}</strong><br>
      <small>By ${c.author_name || 'Unknown'}</small>
      <p>${c.content}</p>
    </div>
  `).join("") || "<small>No posts yet</small>";
}


async function loadPinnedAnnouncements() {
  const res = await fetch("backend/admin_get_pinned_posts.php");
  const data = await res.json();
  const container = document.getElementById("recentPosts");
  container.innerHTML = data.map(p => `
    <div class="note-item">
      <strong>${p.title}</strong><br><small>${p.createdAt}</small>
    </div>
  `).join("") || "<small>No pinned posts</small>";
}

// Announcement management
async function loadAnnouncements() {
  const res = await fetch("backend/admin_get_announcements.php");
  const data = await res.json();
  const list = document.getElementById("announcementList");

  const active = data.filter(p => p.deleted == 0);
  const deleted = data.filter(p => p.deleted == 1);

  list.innerHTML = `
    <h3>Active Announcements</h3>
    ${active.length ? active.map(p => `
      <div class="card">
        <div style="display:flex;justify-content:space-between;align-items:center">
          <strong>${p.title}</strong>
          <div>
            <button class="btn ghost" onclick="editAnnouncement(${p.id})">Edit</button>
            <button class="btn danger" onclick="deleteAnnouncement(${p.id})">Delete</button>
          </div>
        </div>
      </div>
    `).join("") : "<small>No active announcements</small>"}
  `;
}


async function createAnnouncement() {
  const title = document.getElementById("postTitle").value.trim();
  const content = document.getElementById("postContent").value.trim();
  const tag = document.getElementById("postTag").value;

  if (!title || !content) return alert("Enter title & content");

  await fetch("backend/admin_create_announcement.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({title, content, tag})
  });

  loadDashboardStats();
  loadAnnouncements();
  alert("Posted!");
}

async function editAnnouncement(id) {
  const title = prompt("New title?");
  const content = prompt("New content?");

  if (!title || !content) return;

  await fetch("backend/admin_edit_announcement.php", {
    method: "POST",
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({id, title, content})
  });

  alert("Updated ✅");
  loadAnnouncements("active");
}


async function deleteAnnouncement(id) {
  await fetch("backend/admin_delete_announcement.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({id})
  });
  loadAnnouncements();
  alert("Deleted (soft)");
}

async function restore(id) {
  await fetch("backend/restore_post.php", {
    method: "POST",
    headers: {"Content-Type":"application/json"},
    body: JSON.stringify({id})
  });
  loadAnnouncements();
  alert("Restored");
}

loadView();

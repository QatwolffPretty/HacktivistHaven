/***********************
* Community Forum JS
 * MySQL version + Mediastack News
 ***********************/

// State variables
let posts = [];
let editId = null;
let activeFilter = 'all';
let activeTag = null;

// Logged-in user
const currentUser = JSON.parse(localStorage.getItem('hh_user') || 'null') || {
  username: 'Guest',
  fullname: 'Guest'
};

// safe initials helper
function getInitials(name) {
  if (!name) return 'G';
  // prefer fullname split, then username fallback
  const parts = String(name).trim().split(/\s+/);
  if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
  return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
}

// API path
const API_URL = "http://localhost/hacktivist_haven/backend/";

function safeCommentsArr(comments) {
  if (!Array.isArray(comments)) return [];
  return comments;
}

// DOM refs
const postsList = document.getElementById('postsList');
const emptyState = document.getElementById('emptyState');
const modalBackdrop = document.getElementById('modalBackdrop');
const modalTitle = document.getElementById('modalTitle');
const postTitle = document.getElementById('postTitle');
const postTag = document.getElementById('postTag');
const postContent = document.getElementById('postContent');
const postImageInput = document.getElementById('postImage');
const imagePreview = document.getElementById('imagePreview');
const modalSave = document.getElementById('modalSave');
const modalCancel = document.getElementById('modalCancel');
const btnCreate = document.getElementById('btnCreate');
const fabNew = document.getElementById('fabNew');
const searchInput = document.getElementById('searchInput');
const navButtons = document.querySelectorAll('.sidebar .nav button');
const chips = document.querySelectorAll('.chip[data-tag]');
const topGreeting = document.getElementById('topGreeting');

function updateGreeting() {
  const currentUser = JSON.parse(localStorage.getItem('hh_user') || '{}');
  const name = currentUser.username || "Guest";
  document.getElementById("greetingUser").textContent = name;
}

updateGreeting();

document.getElementById('btnSignOut').style.display =
  (currentUser.username && currentUser.username !== 'Guest') ? 'inline-block' : 'none';

// Sign out handler
document.getElementById('btnSignOut').addEventListener('click', () => {
  localStorage.removeItem('hh_user');
  location.href = 'signin.html';
});

async function loadPostsFromDB() {
  try {
    const res = await fetch('/hacktivist_haven/backend/get_posts.php');
    if (!res.ok) throw new Error('Network error');
    const posts = await res.json();

    // render list (only non-deleted for community.html)
    renderPostsUI(posts);
    renderTopContributors(posts);
  } catch (err) {
    console.error('Failed loading posts', err);
    document.getElementById('postsList').innerHTML = '<div class="muted">Failed to load posts</div>';
  }
}

function renderPostsUI(postsAll) {
  // postsAll is full list; community.html should show non-deleted
  const posts = postsAll.filter(p => Number(p.deleted) === 0);

  postsList.innerHTML = '';
  if (!posts.length) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  posts.forEach(p => {
    const author = p.author_name || p.author || 'Guest';
    const initials = getInitials(author);

    const card = document.createElement('article');
    card.className = 'post-card fade-in';
    card.dataset.id = p.id;
    card.innerHTML = `
      <div class="post-meta">
        <div class="avatar-sm">${initials}</div>
        <div class="small muted" style="margin-top:8px">${formatDate(p.created_at || p.createdAt || p.createdAt)}</div>
      </div>
      <div class="post-body">
        <div class="post-title">
          <h3>${escapeHtml(p.title)}</h3>
          <div style="display:flex;gap:8px;align-items:center">
            <div class="muted" style="font-size:12px">${escapeHtml(author)}</div>
            <div style="font-size:12px;color:var(--muted);padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.02);margin-left:8px">${escapeHtml(p.tag || 'general')}</div>
          </div>
        </div>
        <div class="post-content">${escapeHtml(p.content).slice(0,800).replace(/\n/g,'<br>')}</div>
        ${p.image ? `<div class="post-image"><img src="${p.image}" alt="post image" style="width:100%;display:block"></div>` : ''}
        <div class="post-actions">
          <button class="icon-btn like-btn">${p.likes>0 ? '❤' : '♡'} <span class="count">${p.likes}</span></button>
          <button class="icon-btn comment-btn">💬 <span class="count">${(JSON.parse(p.comments || '[]')).length}</span></button>
          <div style="flex:1"></div>
          ${(author === (currentUser.username || currentUser.fullname) || currentUser.username === 'admin') ? `
            <button class="icon-btn edit-btn">✏️ Edit</button>
            <button class="icon-btn delete-btn">🗑️ Delete</button>
          ` : ''}
        </div>
        <div class="comments-area" style="margin-top:10px;display:none">
          <div class="muted small" style="margin-bottom:6px">Comments</div>
          <div class="comments-list" style="display:flex;flex-direction:column;gap:8px"></div>
          <div style="display:flex;gap:8px;margin-top:8px">
            <input class="input comment-input" placeholder="Add a comment..." />
            <button class="btn primary add-comment">Reply</button>
          </div>
        </div>
      </div>
    `;

    // actions wiring
    card.querySelector('.like-btn')?.addEventListener('click', async () => {
      try {
        await fetch('/hacktivist_haven/backend/like_post.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'id=' + encodeURIComponent(p.id)
        });
        await loadPostsFromDB();
      } catch (e) { console.error(e); }
    });

    const commentBtn = card.querySelector('.comment-btn');
    const commentsArea = card.querySelector('.comments-area');
    const commentsList = card.querySelector('.comments-list');

    commentBtn?.addEventListener('click', () => {
      commentsArea.style.display = commentsArea.style.display === 'none' ? 'block' : 'none';
      renderCommentsList(p, commentsList);
    });

    function renderCommentsList(postObj, listEl) {
      listEl.innerHTML = '';
      let comments = [];
      try { comments = JSON.parse(postObj.comments || '[]'); } catch(e){ comments = []; }
      if (!comments.length) {
        listEl.innerHTML = '<div class="muted">No comments</div>';
        return;
      }
      comments.forEach(c => {
        const r = document.createElement('div');
        r.innerHTML = `<strong style="color:var(--accent1)">${escapeHtml(c.author)}</strong> <div style="margin-top:6px">${escapeHtml(c.text)}</div>`;
        listEl.appendChild(r);
      });
    }

    card.querySelector('.add-comment')?.addEventListener('click', async () => {
      const txt = card.querySelector('.comment-input').value.trim();
      if (!txt) return;
      const form = new URLSearchParams();
      form.append('post_id', p.id);
      form.append('author', currentUser.fullname || currentUser.username || 'Guest');
      form.append('text', txt);
      try {
        const resp = await fetch('/hacktivist_haven/backend/add_comment.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: form.toString()
        });
        const json = await resp.json();
        if (json.success) {
          await loadPostsFromDB();
        } else {
          alert('Comment failed: ' + (json.error || 'server error'));
        }
      } catch (e) { console.error(e); alert('Comment failed'); }
    });

    card.querySelector('.delete-btn')?.addEventListener('click', async () => {
      if (!confirm('Delete this post?')) return;
      try {
        const res = await fetch('/hacktivist_haven/backend/delete_post.php', {
          method: 'POST',
          headers: {'Content-Type': 'application/x-www-form-urlencoded'},
          body: 'id=' + encodeURIComponent(p.id)
        });
        const js = await res.json();
        if (js.success) await loadPostsFromDB();
      } catch (e) { console.error(e); }
    });

    card.querySelector('.edit-btn')?.addEventListener('click', () => {
      openModal(false, {
        id: p.id, title: p.title, tag: p.tag, content: p.content, image: p.image
      });
    });

    postsList.appendChild(card);
  });
}


/*******************************
* Save New Post to MySQL
*******************************/
async function createPost(postData) {
  await fetch('http://localhost/hacktivist_haven/backend/add_post.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams(postData)
  });
  loadPostsFromDB();
}

/*******************************
 * Like Post
 *******************************/
async function likePost(id) {
  await fetch('http://localhost/hacktivist_haven/backend/like_post.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id })
  });
  loadPostsFromDB();
}

/*******************************
 * Delete Post
 *******************************/
async function deletePost(id) {
  await fetch('http://localhost/hacktivist_haven/backend/delete_post.php', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ id })
  });
  loadPostsFromDB();
}

// --- utilities ---
function id() { return 'p-' + Math.floor(Math.random() * 1e9).toString(36); }
function timeNow() { return new Date().toISOString(); }
function formatDate(dateStr) {
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return 'Date unavailable';
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}/${month}/${year}`;
}

function renderPostHTML(p) {
  return `
      <article class="post-card fade-in" data-id="${p.id}">
        <div class="post-meta">
          <div class="avatar-sm">${(p.author_name || 'G')[0].toUpperCase()}</div>
          <div class="small muted" style="margin-top:8px">${formatDate(p.created_at || p.createdAt)}</div>
        </div>
        <div class="post-body">
          <div class="post-title">
            <h3>${escapeHtml(p.title)}</h3>
            <div style="display:flex;gap:8px;align-items:center">
              <div class="muted" style="font-size:12px">${escapeHtml(p.author_name || p.author || 'Unknown')} ${p.role === "admin" ? "<span class='badge admin'>ADMIN</span>" : ""}</div>
              <div style="font-size:12px;color:var(--muted);padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.02);margin-left:8px">${escapeHtml(p.tag || 'general')}</div>
            </div>
          </div>
          <div class="post-content">${escapeHtml(p.content).slice(0, 800).replace(/\n/g, '<br>')}</div>
          ${p.image ? `<div class="post-image"><img src="${p.image}" alt="post image" style="width:100%;display:block"></div>` : ''}
          <div class="post-actions">
            <button class="icon-btn like-btn">${p.likes > 0 ? '❤' : '♡'} <span class="count">${p.likes || 0}</span></button>
            <button class="icon-btn comment-btn">💬 <span class="count">${safeCommentsArr(p.comments).length}</span></button>
            <button class="icon-btn pin-btn" title="Pin post">${p.pinned ? '📌 Pinned' : '📍 Pin'}</button>
            <div style="flex:1"></div>
            ${(p.author_name === (currentUser.username || currentUser.fullname) || currentUser.username === 'admin') ? `
              <button class="icon-btn edit-btn">✏️ Edit</button>
              <button class="icon-btn delete-btn">🗑️ Delete</button>
            ` : ''}
          </div>
          <div class="comments-area" style="margin-top:10px;display:none">
            <div class="muted small" style="margin-bottom:6px">Comments</div>
            <div class="comments-list" style="display:flex;flex-direction:column;gap:8px"></div>
            <div style="display:flex;gap:8px;margin-top:8px">
              <input class="input comment-input" placeholder="Add a comment..." />
              <button class="btn primary add-comment">Reply</button>
            </div>
          </div>
        </div>
      </article>
    `;
}

// --- modal ---
function openModal(newPost = true, post = null) {
  modalBackdrop.style.display = 'flex';
  modalBackdrop.setAttribute('aria-hidden', 'false');
  if (newPost) {
    modalTitle.textContent = 'Create Post';
    postTitle.value = ''; postTag.value = ''; postContent.value = ''; postImageInput.value = ''; imagePreview.innerHTML = '';
    editId = null;
  } else {
    modalTitle.textContent = 'Edit Post';
    postTitle.value = post.title || '';
    postTag.value = post.tag || '';
    postContent.value = post.content || '';
    editId = post.id;
    imagePreview.innerHTML = post.image ? `<img src="${post.image}" style="max-width:100%;border-radius:10px;border:1px solid rgba(255,255,255,0.03)">` : '';
  }
}
function closeModal() {
  modalBackdrop.style.display = 'none';
  modalBackdrop.setAttribute('aria-hidden', 'true');
}
modalCancel.addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', (e) => { if (e.target === modalBackdrop) closeModal(); });

// image preview
postImageInput.addEventListener('change', () => {
  const f = postImageInput.files[0];
  if (!f) { imagePreview.innerHTML = ''; return; }
  const reader = new FileReader();
  reader.onload = () => { imagePreview.innerHTML = `<img src="${reader.result}" style="max-width:100%;border-radius:10px;border:1px solid rgba(255,255,255,0.03)">`; }
  reader.readAsDataURL(f);
});

// create / edit save
modalSave.addEventListener('click', async () => {
  const title = postTitle.value.trim();
  const content = postContent.value.trim();
  const tag = postTag.value.trim() || 'general';
  const author = currentUser.username || 'Guest';

  if (!title || !content) {
    alert("Please fill title & content");
    return;
  }

  const file = postImageInput.files[0];
  let imageData = null;

  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      imageData = reader.result;
      sendPost();
    };
    reader.readAsDataURL(file);
  } else {
    sendPost();
  }

  async function sendPost() {
    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("tag", tag);
    formData.append("author", author);
    if (imageData) formData.append("image", imageData);

    const res = await fetch('http://localhost/hacktivist_haven/backend/add_post.php', {
      method: 'POST',
      body: formData
    });

    const result = await res.json();
    if (result.success) {
      closeModal();
      loadPostsFromDB(); // reload posts from DB
    } else {
      alert("Post failed: " + result.error);
    }
  }
});

// open modal handlers
btnCreate.addEventListener('click', () => openModal(true));
fabNew.addEventListener('click', () => openModal(true));

// --- fetch Palestine news ---
async function fetchPalestineNews() {
  try {
    const API_KEY = '28ddf1e7cf16c424e1476a9f125d3e49';
    const url = `https://api.mediastack.com/v1/news?access_key=${API_KEY}&keywords=palestine&languages=en&limit=5`;
    const response = await fetch(url);
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching news:', error);
    return [];
  }
}

// --- utility to get full country name ---
function getCountryName(code) {
  const countries = {
    'us': 'United States',
    'gb': 'United Kingdom',
    'ca': 'Canada',
    'au': 'Australia',
    'de': 'Germany',
    'fr': 'France',
    'it': 'Italy',
    'es': 'Spain',
    'nl': 'Netherlands',
    'ie': 'Ireland',
    'be': 'Belgium',
    'ch': 'Switzerland',
    'at': 'Austria',
    'se': 'Sweden',
    'no': 'Norway',
    'dk': 'Denmark',
    'fi': 'Finland',
    'pt': 'Portugal',
    'pl': 'Poland',
    'cz': 'Czech Republic',
    'hu': 'Hungary',
    'gr': 'Greece',
    'tr': 'Turkey',
    'ru': 'Russia',
    'cn': 'China',
    'jp': 'Japan',
    'kr': 'South Korea',
    'in': 'India',
    'br': 'Brazil',
    'mx': 'Mexico',
    'ar': 'Argentina',
    'za': 'South Africa',
    'eg': 'Egypt',
    'il': 'Israel',
    'my': 'Malaysia',
    'sa': 'Saudi Arabia',
    'ae': 'United Arab Emirates',
    'qa': 'Qatar',
    'kw': 'Kuwait',
    'bh': 'Bahrain',
    'om': 'Oman',
    'jo': 'Jordan',
    'lb': 'Lebanon',
    'sy': 'Syria',
    'iq': 'Iraq',
    'ir': 'Iran',
    'pk': 'Pakistan',
    'af': 'Afghanistan',
    'ye': 'Yemen',
    'ps': 'Palestine',
    // Add more as needed
  };
  return countries[code?.toLowerCase()] || code || 'Country unavailable';
}

// --- render posts ---
function renderPosts() {
  // filters: activeFilter, activeTag, search
  const query = (searchInput.value || '').toLowerCase().trim();
  let list = posts.slice(); // copy

  // Hide soft deleted posts
  list = list.filter(p => p.deleted != 1);

  if (activeFilter === 'news') {
    // Show news showcase with fetched Palestine news
    fetchPalestineNews().then(news => {
      postsList.innerHTML = `
          <div class="news-showcase">
            <div class="news-grid">
              ${news.slice(0, 6).map(article => `
                <div class="news-item">
                  <h4><a href="${article.url}" target="_blank" style="color:#fff;text-decoration:none;">${escapeHtml(article.title)}</a></h4>
                  <div style="display:flex;justify-content:space-between;align-items:center">
                    <small class="muted">${article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Date unavailable'} - ${getCountryName(article.country)}</small>
                    <span style="padding:4px 6px;border-radius:6px;border:1px solid rgba(255,255,255,0.02);font-size:11px;">Palestine</span>
                  </div>
                  <p>${escapeHtml(article.description || 'No description available.')}</p>
                  <a href="${article.url}" target="_blank" style="color:var(--accent1);font-size:13px;text-decoration:none;">Read more →</a>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      emptyState.style.display = 'none';
    }).catch(() => {
      postsList.innerHTML = `
          <div class="news-showcase">
            <div class="news-grid">
              <div class="news-item">
                <h4>Unable to Load News</h4>
                <p>Please try again later.</p>
              </div>
            </div>
          </div>
        `;
      emptyState.style.display = 'none';
    });
    return;
  }

  if (activeTag === 'palestine') {
    // Show news + posts tagged with palestine
    fetchPalestineNews().then(news => {
      const newsHtml = `
          <div class="news-showcase">
            <div class="news-grid">
              ${news.slice(0, 6).map(article => `
                <div class="news-item">
                  <h4><a href="${article.url}" target="_blank" style="color:#fff;text-decoration:none;">${escapeHtml(article.title)}</a></h4>
                  <div style="display:flex;gap:8px;align-items:center">
                    <div class="muted" style="font-size:12px">${article.published_at ? new Date(article.published_at).toLocaleDateString() : 'Date unavailable'} - ${getCountryName(article.country)}</div>
                    <div style="font-size:12px;color:var(--muted);padding:6px;border-radius:8px;border:1px solid rgba(255,255,255,0.02);margin-left:8px">Palestine</div>
                  </div>
                  <p>${escapeHtml(article.description || 'No description available.')}</p>
                  <a href="${article.url}" target="_blank" style="color:var(--accent1);font-size:13px;text-decoration:none;">Read more →</a>
                </div>
              `).join('')}
            </div>
          </div>
        `;
      // Filter posts with tag palestine
      let filteredPosts = posts.slice().filter(p => (p.tag || '').toLowerCase() === 'palestine');
      // Hide soft deleted posts
      filteredPosts = filteredPosts.filter(p => p.deleted != 1);
      if (query) {
        filteredPosts = filteredPosts.filter(p => (p.title + ' ' + p.content + ' ' + (p.author_name || '')).toLowerCase().includes(query));
      }
      let postsHtml = '';
      if (filteredPosts.length === 0) {
        postsHtml = '<div class="muted" style="padding:18px;text-align:center;">No posts tagged with Palestine yet.</div>';
      } else {
        postsHtml = filteredPosts.map(renderPostHTML).join('');
      }
      postsList.innerHTML = newsHtml + postsHtml;
      emptyState.style.display = 'none';
      // Wire up actions for posts
      filteredPosts.forEach(p => {
        const card = postsList.querySelector(`[data-id="${p.id}"]`);
        if (card) {
          // Add event listeners as in original code
          const likeBtn = card.querySelector('.like-btn');
          likeBtn.addEventListener('click', () => {
            likePost(p.id);
          });
          const commentBtn = card.querySelector('.comment-btn');
          const commentsArea = card.querySelector('.comments-area');
          const commentsList = card.querySelector('.comments-list');
          commentBtn.addEventListener('click', () => {
            commentsArea.style.display = commentsArea.style.display === 'none' ? 'block' : 'none';
            renderComments(card, p);
          });
          const addCommentBtn = card.querySelector('.add-comment');
          addCommentBtn.addEventListener('click', () => {
            const input = card.querySelector('.comment-input');
            const txt = input.value.trim();
            if (!txt) return;
            p.comments = safeCommentsArr(p.comments);
            p.comments.push({ author: currentUser.username || currentUser.fullname || 'Guest', text: txt, at: timeNow() });
            loadPostsFromDB();
            renderComments(card, p);
          });
          const pinBtn = card.querySelector('.pin-btn');
          pinBtn.addEventListener('click', () => {
            p.pinned = !p.pinned;
            loadPostsFromDB();
          });
          const editBtn = card.querySelector('.edit-btn');
          if (editBtn) {
            editBtn.addEventListener('click', () => openModal(false, p));
          }
          const deleteBtn = card.querySelector('.delete-btn');
          if (deleteBtn) {
            deleteBtn.addEventListener('click', () => {
              if (confirm('Delete this post?')) {
                fetch(`backend/delete_post.php?id=${p.id}`)
                  .then(res => res.json())
                  .then(data => {
                    if (data.success) {
                      loadPostsFromDB(); // ✅ always reload from database
                    } else {
                      console.error("Delete failed", data.error);
                    }
                  })
                  .catch(err => console.error("Network error:", err));
              }
            });
          }
        }
      });
    }).catch(() => {
      postsList.innerHTML = `
          <div class="news-showcase">
            <div class="news-grid">
              <div class="news-item">
                <h4>Unable to Load News</h4>
                <p>Please try again later.</p>
              </div>
            </div>
          </div>
        `;
      // Filter posts with tag palestine
      let filteredPosts = posts.slice().filter(p => (p.tag || '').toLowerCase() === 'palestine');
      // Hide soft deleted posts
      filteredPosts = filteredPosts.filter(p => p.deleted != 1);
      if (query) {
        filteredPosts = filteredPosts.filter(p => (p.title + ' ' + p.content + ' ' + (p.author_name || '')).toLowerCase().includes(query));
      }
      if (filteredPosts.length === 0) {
        postsList.innerHTML += '<div class="muted" style="padding:18px;text-align:center;">No posts tagged with Palestine yet.</div>';
      } else {
        postsList.innerHTML += filteredPosts.map(renderPostHTML).join('');
        // Wire up actions
        filteredPosts.forEach(p => {
          const card = postsList.querySelector(`[data-id="${p.id}"]`);
          if (card) {
            const likeBtn = card.querySelector('.like-btn');
            likeBtn.addEventListener('click', () => {
              likePost(p.id);
            });
            const commentBtn = card.querySelector('.comment-btn');
            const commentsArea = card.querySelector('.comments-area');
            const commentsList = card.querySelector('.comments-list');
            commentBtn.addEventListener('click', () => {
              commentsArea.style.display = commentsArea.style.display === 'none' ? 'block' : 'none';
              renderComments(card, p);
            });
            const addCommentBtn = card.querySelector('.add-comment');
            addCommentBtn.addEventListener('click', () => {
              const input = card.querySelector('.comment-input');
              const txt = input.value.trim();
              if (!txt) return;
              p.comments = safeCommentsArr(p.comments);
              p.comments.push({ author: currentUser.username || currentUser.fullname || 'Guest', text: txt, at: timeNow() });
              loadPostsFromDB();
              renderComments(card, p);
            });
            const pinBtn = card.querySelector('.pin-btn');
            pinBtn.addEventListener('click', () => {
              p.pinned = !p.pinned;
              loadPostsFromDB();
            });
            const editBtn = card.querySelector('.edit-btn');
            if (editBtn) {
              editBtn.addEventListener('click', () => openModal(false, p));
            }
            const deleteBtn = card.querySelector('.delete-btn');
            if (deleteBtn) {
              deleteBtn.addEventListener('click', () => {
                if (confirm('Delete this post?')) {
                  fetch(`backend/delete_post.php?id=${p.id}`)
                    .then(res => res.json())
                    .then(data => {
                      if (data.success) {
                        loadPostsFromDB(); // ✅ always reload from database
                      } else {
                        console.error("Delete failed", data.error);
                      }
                    })
                    .catch(err => console.error("Network error:", err));
                }
              });
            }
          }
        });
      }
      emptyState.style.display = 'none';
    });
    return;
  }

  if (activeFilter === 'mine') {
    list = list.filter(p => p.author_name === (currentUser.username || currentUser.fullname));
  } else if (activeFilter === 'pinned') {
    list = list.filter(p => p.pinned);
  } else if (activeFilter === 'popular') {
    list = list.sort((a, b) => (b.likes + b.comments.length) - (a.likes + a.comments.length));
  } else if (activeFilter === 'newest') {
    list = list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  } // 'all' does nothing

  if (activeTag) list = list.filter(p => (p.tag || '').toLowerCase() === activeTag.toLowerCase());

  if (query) {
    list = list.filter(p => (p.title + ' ' + p.content + ' ' + (p.author_name || '')).toLowerCase().includes(query));
  }

  postsList.innerHTML = '';
  if (list.length === 0) {
    emptyState.style.display = 'block';
    return;
  } else {
    emptyState.style.display = 'none';
  }

  postsList.innerHTML = list.map(renderPostHTML).join('');
  list.forEach(p => {
    const card = postsList.querySelector(`[data-id="${p.id}"]`);
    if (!card) return;
    const likeBtn = card.querySelector('.like-btn');
    likeBtn.addEventListener('click', () => {
      fetch("http://localhost/hacktivist_haven/backend/like_post.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `id=${p.id}`
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            p.likes = (p.likes || 0) + 1;
            likeBtn.querySelector('.count').textContent = p.likes;
          } else {
            console.error(data.error);
          }
        });
    });
    likeBtn.disabled = true;
    setTimeout(() => likeBtn.disabled = false, 2000);
    const commentBtn = card.querySelector('.comment-btn');
    const commentsArea = card.querySelector('.comments-area');
    const commentsList = card.querySelector('.comments-list');
    commentBtn.addEventListener('click', () => {
      commentsArea.style.display = commentsArea.style.display === 'none' ? 'block' : 'none';
      renderComments(card, p);
    });
    function renderComments(card, p) {
      commentsList.innerHTML = '';
      (p.comments || []).forEach(c => {
        const row = document.createElement('div');
        row.style.display = 'flex'; row.style.justifyContent = 'space-between'; row.style.alignItems = 'center';
        row.innerHTML = `<div><strong style="color:var(--accent1)">${escapeHtml(c.author)}</strong> <span class="muted small">${c.at}</span><div style="margin-top:6px">${escapeHtml(c.text)}</div></div>`;
        commentsList.appendChild(row);
      });
      card.querySelector('.comment-input').value = '';
    }
    const addCommentBtn = card.querySelector('.add-comment');
    addCommentBtn.addEventListener('click', () => {
      const input = card.querySelector('.comment-input');
      const txt = input.value.trim();
      if (!txt) return;
      fetch("http://localhost/hacktivist_haven/backend/add_comment.php", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: `post_id=${p.id}&author=${encodeURIComponent(currentUser.fullname || currentUser.username)}&text=${encodeURIComponent(txt)}`
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            // update UI immediately
            p.comments.push({
              author: currentUser.fullname || currentUser.username,
              text: txt,
              at: new Date().toISOString()
            });
            input.value = "";
            renderComments(card, p);
          } else {
            console.error(data.error);
            alert("Comment failed!");
          }
        })
        .catch(err => console.error(err));
    });
    const pinBtn = card.querySelector('.pin-btn');
    pinBtn.addEventListener('click', () => {
      p.pinned = !p.pinned;
      loadPostsFromDB();
    });
    const editBtn = card.querySelector('.edit-btn');
    if (editBtn) {
      editBtn.addEventListener('click', () => {
        openModal(false, p);
      });
    }
    const deleteBtn = card.querySelector('.delete-btn');
    if (deleteBtn) {
      deleteBtn.addEventListener('click', () => {
        if (confirm('Delete this post?')) {
          fetch(`backend/delete_post.php?id=${p.id}`)
            .then(res => res.json())
            .then(data => {
              if (data.success) {
                loadPostsFromDB(); // ✅ always reload from database
              } else {
                console.error("Delete failed", data.error);
              }
            })
            .catch(err => console.error("Network error:", err));
        }
      });
    }
    renderComments(card, p);
  });

  // update top contributors right panel
  renderTopContributors();
}

// helper escape
function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '<')
    .replace(/>/g, '>')
    .replace(/"/g, '"')
    .replace(/'/g, '&#039;');
}

// --- sidebar nav handlers ---
navButtons.forEach(b => {
  b.addEventListener('click', () => {
    navButtons.forEach(x => x.classList.remove('active'));
    b.classList.add('active');
    activeFilter = b.dataset.filter;
    renderPosts();
  });
});

// tags chips
chips.forEach(c => {
  c.addEventListener('click', () => {
    if (activeTag === c.dataset.tag) {
      activeTag = null; c.classList.remove('active');
    } else {
      chips.forEach(x => x.classList.remove('active'));
      activeTag = c.dataset.tag;
      c.classList.add('active');
    }
    renderPosts();
  });
});

// search
searchInput.addEventListener('input', () => { renderPosts(); });

// sort chips
document.getElementById('sortRecent').addEventListener('click', () => {
  posts = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  renderPosts();
});
document.getElementById('sortTop').addEventListener('click', () => {
  posts = posts.sort((a, b) => (b.likes + (b.comments?.length || 0)) - (a.likes + (a.comments?.length || 0)));
  renderPosts();
});

// top contributors
function renderTopContributors(postsAll) {
  const map = {};
  (postsAll || []).forEach(p => {
    const name = p.author_name || p.author || 'Guest';
    map[name] = (map[name] || 0) + 1;
  });
  const arr = Object.entries(map).sort((a,b)=>b[1]-a[1]).slice(0,6);
  const container = document.getElementById('topContrib') || document.getElementById('topContributors');
  if (!container) return;
  if (!arr.length) { container.innerHTML = '<div class="muted">No contributors yet</div>'; return;}
  container.innerHTML = arr.map(([name,count]) => `<div style="display:flex;justify-content:space-between;align-items:center;margin-top:8px"><div><strong style="color:var(--accent1)">${escapeHtml(name)}</strong><div class="muted small">posts</div></div><div class="badge" style="background:linear-gradient(90deg,var(--accent1),var(--accent2));padding:6px 10px;border-radius:999px;color:#14080a;font-weight:800">${count}</div></div>`).join('');
}


// initial render
document.addEventListener('DOMContentLoaded', () => {
  updateGreeting();
  loadPostsFromDB();
});



// expose for debug
window.hh_forum = { posts, renderPosts };

// --- ✅ Top Contributors Ranking ---
async function loadTopContributors() {
    try {
        const res = await fetch("backend/get_posts.php");
        const posts = await res.json();

        const scoreMap = {};

        posts.forEach(p => {
            const name = p.author_name || p.author || "Guest";
            scoreMap[name] = (scoreMap[name] || 0) + 1;
        });

        const sorted = Object.entries(scoreMap)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5);

        const section = document.getElementById("topContributors");
        if (!section) return;

        if (sorted.length === 0) {
            section.innerHTML = `<small class="muted">No contributors yet.</small>`;
            return;
        }

        section.innerHTML = sorted
            .map(([name, score], i) =>
                `<div>#${i + 1} — ${name} (${score})</div>`
            )
            .join("");

    } catch (err) {
        console.error("Top contributor failed", err);
    }
}

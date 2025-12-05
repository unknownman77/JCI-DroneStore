// forum.js - demo forum posts rendering, search and category filtering, uses DOM manipulation and event listeners

let POSTS = [
  {
    id: 1,
    user: 'JCI_Rep',
    verified: true,
    title: 'SkyVision X7 firmware 2.1.0 released',
    desc: 'Stability improvements and obstacle avoidance tuning. Update via the JCI app.',
    category: 'firmware',
    views: 1240,
    likes: 320,
    shares: 42
  },
  {
    id: 2,
    user: 'pilot_anna',
    verified: false,
    title: 'Best settings for sunset cinematography',
    desc: 'Sharing my exposure and ND filter workflow for golden hour shots.',
    category: 'tips',
    views: 540,
    likes: 120,
    shares: 8
  },
  {
    id: 3,
    user: 'rescue_team_ny',
    verified: false,
    title: 'Thermal mapping mission — lessons learned',
    desc: 'How we used SkyVision Enterprise for night search operations.',
    category: 'missions',
    views: 860,
    likes: 210,
    shares: 26
  },
  {
    id: 4,
    user: 'tech_john',
    verified: false,
    title: 'Propeller replacement guide',
    desc: 'Step-by-step guide to replace and balance props safely.',
    category: 'repairs',
    views: 320,
    likes: 45,
    shares: 3
  }
];

document.addEventListener('DOMContentLoaded', () => {
  // load saved posts from localStorage (user-created)
  try {
    const saved = JSON.parse(localStorage.getItem('jci-posts') || 'null');
    if (Array.isArray(saved) && saved.length) {
      // append saved posts after defaults
      POSTS = POSTS.concat(saved);
    }
  } catch (e) {
    console.warn('Could not load saved posts', e);
  }

  renderPosts(POSTS);
  attachForumHandlers();
  attachCreatePostHandlers();
});

function renderPosts(list) {
  const container = document.getElementById('forumList');
  if (!container) return;
  container.innerHTML = '';
  list.forEach(p => {
    const post = document.createElement('article');
    post.className = 'post';
    post.innerHTML = `
      <header>
        <strong>${p.title}</strong>
        <div class="post-meta">
          <span>${p.user} ${p.verified ? '<span class="verified" aria-hidden="true">Verified</span>' : ''}</span>
          <span>• ${p.category}</span>
        </div>
      </header>
      <p>${p.desc}</p>
      <div class="post-meta" aria-hidden="true">
        <span>👁 ${p.views}</span>
        <span>❤️ ${p.likes}</span>
        <span>🔗 ${p.shares}</span>
      </div>
    `;
    container.appendChild(post);
  });
}

function savePosts() {
  try {
    // only persist user-created posts (those with id >= 1000000000000 or created timestamp)
    // for simplicity we persist all posts beyond the initial seed (length > 0)
    // find posts that are not part of the initial 4 seed items by id greater than max of initial IDs
    const seedMaxId = 4;
    const userPosts = POSTS.filter(p => p.id > seedMaxId);
    localStorage.setItem('jci-posts', JSON.stringify(userPosts));
  } catch (e) {
    console.warn('Could not save posts', e);
  }
}

function attachCreatePostHandlers() {
  const form = document.getElementById('newPostForm');
  const cancel = document.getElementById('cancelPost');
  if (cancel && form) {
    cancel.addEventListener('click', () => { form.reset(); });
  }

  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const user = (document.getElementById('postUser') || {}).value || 'anonymous';
    const title = (document.getElementById('postTitle') || {}).value || '';
    const category = (document.getElementById('postCategory') || {}).value || 'general';
    const desc = (document.getElementById('postDesc') || {}).value || '';

    // basic validation
    if (!title.trim() || !desc.trim()) {
      alert('Please provide a title and message for your post.');
      return;
    }

    const newPost = {
      id: Date.now(),
      user: user.trim(),
      verified: false,
      title: title.trim(),
      desc: desc.trim(),
      category: category,
      views: 1,
      likes: 0,
      shares: 0
    };

    // add to start of POSTS so new posts appear first
    POSTS.unshift(newPost);
    savePosts();

    // re-render respecting current search/filter state
    const activeCat = document.querySelector('.category.active');
    const cat = activeCat ? activeCat.getAttribute('data-cat') : 'all';
    if (cat === 'all') renderPosts(POSTS);
    else renderPosts(POSTS.filter(p => p.category === cat));

    form.reset();
  });
}

function attachForumHandlers() {
  const search = document.getElementById('forumSearch');
  const sort = document.getElementById('forumSort');
  const categories = document.querySelectorAll('.category');

  if (search) {
    search.addEventListener('input', () => {
      const q = search.value.trim().toLowerCase();
      const filtered = POSTS.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.user.toLowerCase().includes(q));
      renderPosts(filtered);
    });
  }

  if (sort) {
    sort.addEventListener('change', () => {
      const val = sort.value;
      let sorted = [...POSTS];
      if (val === 'hot') {
        sorted.sort((a,b) => (b.views + b.likes*2 + b.shares*3) - (a.views + a.likes*2 + a.shares*3));
      } else if (val === 'new') {
        sorted = sorted.reverse(); // demo only
      } else if (val === 'likes') {
        sorted.sort((a,b) => b.likes - a.likes);
      }
      renderPosts(sorted);
    });
  }

  categories.forEach(btn => {
    btn.addEventListener('click', () => {
      categories.forEach(c => c.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-cat');
      if (cat === 'all') {
        renderPosts(POSTS);
      } else {
        renderPosts(POSTS.filter(p => p.category === cat));
      }
    });
  });
}


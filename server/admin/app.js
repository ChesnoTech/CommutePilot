// Shared utilities for admin dashboard
const API = '';

function getToken() {
  return localStorage.getItem('cp_token');
}

function requireAuth() {
  if (!getToken()) {
    window.location.href = 'login.html';
  }
}

function logout() {
  localStorage.removeItem('cp_token');
  localStorage.removeItem('cp_admin');
  window.location.href = 'login.html';
}

async function apiFetch(path, options = {}) {
  const token = getToken();
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (res.status === 401) {
    logout();
    return null;
  }

  return res.json();
}

function formatDate(dateStr) {
  if (!dateStr) return '--';
  const d = new Date(dateStr);
  return d.toLocaleDateString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function timeAgo(dateStr) {
  if (!dateStr) return 'Never';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = now - then;

  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;

  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;

  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;

  return formatDate(dateStr);
}

function setActivePage(page) {
  document.querySelectorAll('.sidebar a').forEach(a => {
    a.classList.toggle('active', a.dataset.page === page);
  });
}

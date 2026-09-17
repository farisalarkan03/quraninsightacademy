// ============================================================
// QIA — Main.js (Client-Side Router & App Bootstrapper)
// src/lib/main.js
// ============================================================

import '@/styles/main.css'
import { authService } from '@/lib/supabase.js'
import { renderLanding } from '@/pages/landing.js'
import { renderAdmin }   from '@/pages/admin.js'
import { renderMentor }  from '@/pages/mentor.js'
import { renderWali }    from '@/pages/portal-wali.js'

// ── Global toast helper ─────────────────────────────────────
export function showToast(message, type = 'info', duration = 3500) {
  const container = document.getElementById('toast-container')
  if (!container) return
  const icons = { success: 'fa-circle-check', error: 'fa-circle-xmark', info: 'fa-circle-info' }
  const toast = document.createElement('div')
  toast.className = `toast toast-${type}`
  toast.innerHTML = `<i class="fa-solid ${icons[type] || 'fa-circle-info'} toast-icon"></i> ${message}`
  container.appendChild(toast)
  requestAnimationFrame(() => { requestAnimationFrame(() => { toast.classList.add('show') }) })
  setTimeout(() => {
    toast.classList.remove('show')
    setTimeout(() => toast.remove(), 350)
  }, duration)
}

// ── Simple client-side router ───────────────────────────────
const routes = {
  '/':            { render: renderLanding },
  '/admin':       { render: renderAdmin },
  '/mentor':      { render: renderMentor },
  '/wali':        { render: renderWali },
  '/portal-wali': { render: renderWali },
}

async function navigate(path, push = true) {
  const cleanPath = (path || '/').replace(/\/$/, '') || '/'
  if (push) history.pushState({}, '', cleanPath)

  const app = document.getElementById('app')
  if (!app) return

  const route = routes[cleanPath] || routes['/']

  // Micro-transition
  app.style.opacity = '0.7'
  app.style.transition = 'opacity 0.15s ease'
  await new Promise(r => setTimeout(r, 60))
  app.innerHTML = ''
  app.style.opacity = '1'

  try {
    await route.render(app, navigate, showToast)
  } catch (err) {
    console.error('Render error on route', cleanPath, err)
    showToast('Terjadi kesalahan saat memuat halaman: ' + err.message, 'error')
  }
}

// Expose globally so inline HTML onclick="navigate(...)" and onclick="navigateTo(...)" always work
window.navigate = navigate
window.navigateTo = navigate

// ── Intercept anchor clicks ─────────────────────────────────
document.addEventListener('click', e => {
  const a = e.target.closest('[data-link]')
  if (a) {
    e.preventDefault()
    const href = a.getAttribute('href') || a.dataset.link
    if (href) navigate(href)
  }
})

// ── Handle browser back/forward ─────────────────────────────
window.addEventListener('popstate', () => {
  navigate(window.location.pathname, false)
})

// ── Boot app ────────────────────────────────────────────────
;(async () => {
  try {
    // Remove initial loader safely
    const loader = document.getElementById('initial-loader')
    if (loader) {
      loader.style.opacity = '0'
      setTimeout(() => { if (loader.parentNode) loader.remove() }, 200)
    }

    // Listen for auth changes
    authService.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        const path = window.location.pathname
        if (path === '/admin' || path === '/mentor') navigate('/')
      }
    })

    await navigate(window.location.pathname, false)
  } catch (err) {
    console.error('Fatal boot error:', err)
    const loader = document.getElementById('initial-loader')
    if (loader) loader.remove()
    const app = document.getElementById('app')
    if (app && !app.innerHTML.trim()) {
      renderLanding(app, navigate, showToast)
    }
  }
})()

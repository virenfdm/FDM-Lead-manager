'use strict';
/* MBA Admission Lead Manager - plain JavaScript version (no Node.js / no build step). */
const CFG = window.CONFIG || {};
const configured = !!(CFG.SUPABASE_URL && CFG.SUPABASE_ANON_KEY && !CFG.SUPABASE_URL.includes('YOUR-PROJECT') && !CFG.SUPABASE_ANON_KEY.includes('YOUR-ANON'));
const sb = configured ? window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY) : null;

// ---------- constants ----------
const K = {
  PROGRAMS: ['MBA', 'PGDM', 'MMS', 'Online MBA', 'Distance MBA', 'Executive MBA', 'Other'],
  SPECS: ['Finance', 'Marketing', 'HR', 'Business Analytics', 'Operations', 'International Business', 'Supply Chain Management', 'IT', 'Digital Marketing', 'Entrepreneurship', 'Healthcare Management', 'BFSI', 'Retail Management', 'Product Management', 'Other'],
  LOCS: ['Mumbai', 'Pune', 'Bangalore', 'Delhi NCR', 'Indore', 'Bhopal', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Chennai', 'Other'],
  MODES: ['Regular', 'Online', 'Distance', 'Part-time'], YN: ['Yes', 'No'], YNU: ['Yes', 'No', 'Undecided'],
  EXAMS: ['CAT', 'XAT', 'CMAT', 'MAT', 'NMAT', 'SNAP', 'MAH MBA/MMS CET', 'ATMA', 'GMAT', 'Other'],
  EXAM_ST: ['Planning', 'Registered', 'Appeared', 'Result Awaited', 'Result Declared', 'Not Taking'],
  RES: ['Percentage', 'CGPA'], DEGREES: ['BBA', 'BCom', 'BA', 'BSc', 'BCA', 'BE/BTech', 'BPharm', 'BHM', 'BMS', 'Other'],
  ACAD_ST: ['Pursuing', 'Final Year', 'Completed'], QUAL: ['Class 12', 'Diploma'],
  STATUS: ['New', 'Not Contacted', 'Contacted', 'Interested', 'Follow-up Required', 'Not Interested', 'Application Started', 'Application Submitted', 'Shortlisted', 'GD/PI Scheduled', 'Offer Received', 'Admission Confirmed', 'Lost'],
  PRIORITY: ['Hot', 'Warm', 'Cold'], APP_ST: ['Not Started', 'In Progress', 'Submitted'], OFFER_ST: ['Not Received', 'Received', 'Accepted', 'Declined'],
  ADM_ST: ['Pending', 'Confirmed', 'Cancelled'], SOURCES: ['Website', 'Walk-in', 'Referral', 'Instagram', 'Facebook', 'Google Ads', 'WhatsApp', 'College Fair', 'Cold Call', 'Other'],
  INTER: ['Call', 'WhatsApp', 'Email', 'Counselling Session', 'College Recommendation', 'Application Update', 'Note'],
  OUTCOMES: ['Connected - Interested', 'Connected - Needs Time', 'Connected - Not Interested', 'Not Reachable', 'Switched Off', 'No Answer', 'Call Back Later', 'Wrong Number', 'Other'],
  STATES: ['Andhra Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Delhi', 'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Odisha', 'Punjab', 'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Other']
};
const AC = {
  class10: ['board', 'passing_year', 'result_type', 'result_value'],
  class12: ['qualification_type', 'board', 'stream', 'passing_year', 'result_type', 'result_value'],
  graduation: ['degree', 'other_degree', 'institution', 'specialization', 'passing_year', 'academic_status', 'result_type', 'result_value', 'backlogs', 'backlog_count']
};

// ---------- helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const spin = (t = 'Loading…') => `<div class="flex items-center justify-center gap-3 p-10 text-slate-500"><div class="h-5 w-5 animate-spin rounded-full border-2 border-navy-200 border-t-navy-600"></div>${t}</div>`;
const toast = (msg, err) => {
  const d = document.createElement('div');
  d.className = `toast-in max-w-sm rounded-xl px-4 py-3 text-sm font-medium text-white shadow-xl ${err ? 'bg-gradient-to-br from-rose-500 to-red-700' : 'bg-gradient-to-br from-emerald-500 to-emerald-700'}`; d.textContent = msg;
  $('#toasts').appendChild(d); setTimeout(() => d.remove(), 4500);
};
const normMobile = (m) => String(m || '').replace(/\D/g, '').slice(-10);
const validMobile = (m) => /^[6-9]\d{9}$/.test(normMobile(m));
const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const inr = (n) => (n === null || n === undefined || n === '' ? '—' : '₹' + Number(n).toLocaleString('en-IN'));
const fmtDate = (d) => (d ? new Date(d).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }) : '—');
const fmtDT = (d) => (d ? new Date(d).toLocaleString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');
const todayStr = () => { const d = new Date(); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 10); };
const sod = () => { const d = new Date(); d.setHours(0, 0, 0, 0); return d.getTime(); };
const eod = () => { const d = new Date(); d.setHours(23, 59, 59, 999); return d.getTime(); };
const toLocalInput = (iso) => { if (!iso) return ''; const d = new Date(iso); d.setMinutes(d.getMinutes() - d.getTimezoneOffset()); return d.toISOString().slice(0, 16); };
const fromLocalInput = (v) => (v ? new Date(v).toISOString() : null);
const nn = (v) => (v === '' || v === undefined || v === null ? null : v);
const num = (v) => (v === '' || v === null || v === undefined || isNaN(Number(v)) ? null : Number(v));
const gradOf = (l) => (l.lead_academics || []).find((a) => a.level === 'graduation');
const bestPct = (l) => { const p = (l.lead_exams || []).map((e) => e.percentile).filter((x) => x !== null && x !== undefined); return p.length ? Math.max(...p) : null; };
const fmtRes = (a) => (a && a.result_value !== null && a.result_value !== undefined ? a.result_value + (a.result_type === 'CGPA' ? ' CGPA' : '%') : '—');

async function fetchAll(table, select = '*', order = 'created_at') {
  const out = [], size = 1000;
  for (let from = 0; ; from += size) {
    const { data, error } = await sb.from(table).select(select).order(order, { ascending: false }).range(from, from + size - 1);
    if (error) throw error;
    out.push(...(data || []));
    if (!data || data.length < size) break;
  }
  return out;
}

// ---------- UI snippets ----------
const opts = (list, sel) => list.map((o) => `<option ${o === sel ? 'selected' : ''}>${esc(o)}</option>`).join('');
const fld = (label, inner, req, id = '') => `<label class="block" ${id ? `id="${id}"` : ''}><span class="label">${label}${req ? '<span class="text-red-600"> *</span>' : ''}</span>${inner}</label>`;
const inp = (n, label, v = '', a = '', req = false) => fld(label, `<input class="input" name="${n}" value="${esc(v)}" ${a}>`, req);
const sel = (n, label, list, v = '', req = false, a = '') => fld(label, `<select class="input" name="${n}" ${a}><option value="">Select…</option>${opts(list, v)}</select>`, req);
const sec = (title, body, open) => `<details class="card overflow-hidden" ${open ? 'open' : ''}><summary class="cursor-pointer select-none bg-slate-50/70 px-5 py-3.5 font-bold text-navy-800">${title}</summary><div class="p-5">${body}</div></details>`;
const GRID = 'grid gap-3 sm:grid-cols-2 lg:grid-cols-3';
const COLORS = { New: 'bg-blue-100 text-blue-800', 'Not Contacted': 'bg-slate-100 text-slate-700', Contacted: 'bg-sky-100 text-sky-800', Interested: 'bg-emerald-100 text-emerald-800', 'Follow-up Required': 'bg-amber-100 text-amber-800', 'Not Interested': 'bg-red-100 text-red-700', 'Application Started': 'bg-indigo-100 text-indigo-800', 'Application Submitted': 'bg-indigo-100 text-indigo-800', Shortlisted: 'bg-violet-100 text-violet-800', 'GD/PI Scheduled': 'bg-violet-100 text-violet-800', 'Offer Received': 'bg-teal-100 text-teal-800', 'Admission Confirmed': 'bg-green-200 text-green-900', Lost: 'bg-gray-200 text-gray-600', Hot: 'bg-red-100 text-red-700', Warm: 'bg-orange-100 text-orange-700', Cold: 'bg-sky-100 text-sky-700' };
const badge = (t) => (t ? `<span class="inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset ring-black/5 ${COLORS[t] || 'bg-slate-100 text-slate-700'}">${esc(t)}</span>` : '—');

function modal(title, body, wide) {
  closeModal();
  const d = document.createElement('div'); d.id = 'modal';
  d.className = 'fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 p-4 backdrop-blur-sm';
  d.innerHTML = `<div class="pop max-h-[90vh] w-full overflow-auto rounded-2xl bg-white p-6 shadow-2xl ${wide ? 'max-w-2xl' : 'max-w-md'}"><div class="mb-4 flex items-center justify-between"><h3 class="text-lg font-semibold text-navy-800">${esc(title)}</h3><button onclick="closeModal()" class="rounded-lg px-2 text-2xl leading-none text-slate-400 hover:bg-slate-100 hover:text-slate-700">×</button></div>${body}</div>`;
  d.addEventListener('click', (e) => { if (e.target === d) closeModal(); });
  document.body.appendChild(d);
}
const closeModal = () => $('#modal')?.remove();
function confirmBox(title, message, onYes) {
  modal(title, `<p class="mb-5 text-sm text-slate-600">${esc(message)}</p><div class="flex justify-end gap-2"><button class="btn-outline" onclick="closeModal()">Cancel</button><button id="cfYes" class="btn-danger">Delete</button></div>`);
  $('#cfYes').onclick = async (e) => { e.target.disabled = true; e.target.textContent = 'Working…'; await onYes(); closeModal(); };
}

// ---------- state ----------
let ME = null, PEOPLE = [];
const isAdmin = () => ME && ME.role === 'admin';
const main = () => $('#main');

// ---------- auth ----------
let SUPPRESS_AUTH = false;
function renderLogin(mode = 'in') {
  $('#app').innerHTML = `<div class="grid min-h-screen lg:grid-cols-2"><div class="login-art relative hidden flex-col justify-between overflow-hidden p-12 text-white lg:flex"><img src="logo-white.png" alt="FDM - The future begins here" class="relative z-10 h-16 w-auto self-start"><div class="relative z-10 max-w-md"><div class="mb-3 text-xs font-bold uppercase tracking-[.2em] text-red-300">MBA Admission Lead Manager</div><h2 class="text-4xl font-extrabold leading-tight">Turn every enquiry into a confirmed admission.</h2><p class="mt-4 text-white/70">Leads, counselling, follow-ups and offers, all in one beautiful workspace.</p><div class="mt-8 grid grid-cols-3 gap-3 text-center text-xs text-white/90"><div class="glass">Lead tracking</div><div class="glass">Smart follow-ups</div><div class="glass">Excel import</div></div></div><p class="relative z-10 text-xs text-white/50">© FDM · The future begins here</p></div>
    <div class="flex items-center justify-center p-6"><form id="lf" class="pop card w-full max-w-sm space-y-5 p-8"><img src="logo.png" alt="FDM" class="h-12 w-auto lg:hidden">
    <div><h1 class="text-2xl font-extrabold text-navy-800">${mode === 'in' ? 'Welcome back' : 'Create your account'}</h1><p class="mt-1 text-sm text-slate-500">${mode === 'in' ? 'Sign in to continue' : 'Create an account (the first account becomes Admin)'}</p></div>
    ${mode === 'up' ? '<div><label class="label">Full name</label><input class="input" name="name" required></div>' : ''}
    <div><label class="label">Email</label><input type="email" class="input" name="email" required></div>
    <div><label class="label">Password</label><input type="password" class="input" name="pw" required></div>
    <div id="lmsg"></div>
    <button class="btn-primary w-full !py-2.5" id="lbtn">${mode === 'in' ? 'Sign in' : 'Create account'}</button>
    <button type="button" class="w-full text-center text-sm font-medium text-navy-600 hover:underline" id="lsw">${mode === 'in' ? 'First time? Create an account' : 'Already have an account? Sign in'}</button></form></div></div>`;
  $('#lsw').onclick = () => renderLogin(mode === 'in' ? 'up' : 'in');
  $('#lf').onsubmit = async (e) => {
    e.preventDefault(); const f = e.target; const msg = $('#lmsg'); msg.innerHTML = '';
    const b = $('#lbtn'); b.disabled = true; b.textContent = 'Please wait…';
    let err = null, info = '';
    if (mode === 'in') { ({ error: err } = await sb.auth.signInWithPassword({ email: f.email.value, password: f.pw.value })); }
    else if (f.pw.value.length < 8) err = { message: 'Password must be at least 8 characters.' };
    else { SUPPRESS_AUTH = true; const r = await sb.auth.signUp({ email: f.email.value, password: f.pw.value, options: { data: { full_name: f.name.value } } }); err = r.error; if (!err && r.data.session) { await sb.auth.signOut(); SUPPRESS_AUTH = false; renderLogin('in'); toast('Account created successfully. Please sign in.'); return; } SUPPRESS_AUTH = false; if (!err) return showOtp(f.email.value); }
    if (err) msg.innerHTML = `<div class="rounded-lg bg-red-50 p-2 text-sm text-red-700">${esc(err.message)}</div>`;
    if (info) msg.innerHTML = `<div class="rounded-lg bg-emerald-50 p-2 text-sm text-emerald-700">${esc(info)}</div>`;
    b.disabled = false; b.textContent = mode === 'in' ? 'Sign in' : 'Create account';
  };
}
function showOtp(email) {
  $('#app').innerHTML = `<div class="flex min-h-screen items-center justify-center p-6"><form id="of" class="pop card w-full max-w-sm space-y-5 p-8 text-center"><img src="logo.png" alt="FDM" class="mx-auto h-12 w-auto"><div><h1 class="text-2xl font-extrabold text-navy-800">Verify your email</h1><p class="mt-1 text-sm text-slate-500">We sent a verification code to <b>${esc(email)}</b>. Enter it below.</p></div><input id="otp" class="input text-center text-2xl font-bold tracking-[.4em]" inputmode="numeric" autocomplete="one-time-code" maxlength="10" placeholder="Enter code" required><div id="omsg"></div><button class="btn-primary w-full !py-2.5" id="obtn">Verify &amp; create account</button><div class="flex justify-between text-sm font-medium text-navy-600"><button type="button" id="ores" class="hover:underline">Resend code</button><button type="button" id="oback" class="hover:underline">Back</button></div></form></div>`;
  const say = (t, ok) => { $('#omsg').innerHTML = `<div class="rounded-lg p-2 text-sm ${ok ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}">${esc(t)}</div>`; };
  $('#oback').onclick = () => renderLogin('up');
  $('#ores').onclick = async () => { const { error } = await sb.auth.resend({ type: 'signup', email }); error ? say(error.message) : say('A new code has been sent.', true); };
  $('#of').onsubmit = async (e) => {
    e.preventDefault(); const b = $('#obtn'); b.disabled = true; b.textContent = 'Verifying…'; $('#omsg').innerHTML = '';
    SUPPRESS_AUTH = true;
    const { error } = await sb.auth.verifyOtp({ email, token: $('#otp').value.trim(), type: 'signup' });
    if (!error) { await sb.auth.signOut(); SUPPRESS_AUTH = false; renderLogin('in'); toast('Account verified successfully. Please sign in.'); return; }
    SUPPRESS_AUTH = false; say(error.message); b.disabled = false; b.textContent = 'Verify & create account';
  };
}
async function afterAuth(session) {
  if (!session) { ME = null; return renderLogin(); }
  if (ME && ME.id === session.user.id) return;
  const { data } = await sb.from('profiles').select('*').eq('id', session.user.id).single();
  if (!data) { toast('Profile not found. Did you run schema.sql?', true); return renderLogin(); }
  if (!data.active) { toast('This account is deactivated.', true); await sb.auth.signOut(); return; }
  ME = data;
  const p = await sb.from('profiles').select('id,full_name').eq('active', true).order('full_name'); PEOPLE = p.data || [];
  renderShell(); route();
}
function renderShell() {
  const items = [['dashboard', 'Dashboard', '#/'], ['leads', 'Leads', '#/leads'], ['followups', 'Follow-ups', '#/followups'], ['import', 'Import / Export', '#/import']];
  if (isAdmin()) items.push(['users', 'Users', '#/users']);
  const IC = { dashboard: '<path d="M3 13h8V3H3zM13 21h8V11h-8zM13 3v6h8V3zM3 21h8v-6H3z"/>', leads: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.9M16 3.1a4 4 0 0 1 0 7.8"/>', followups: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>', import: '<path d="M12 3v12M7 10l5 5 5-5M4 21h16"/>', users: '<circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/>' };
  const ico = (k) => `<svg class="h-[18px] w-[18px] shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">${IC[k]}</svg>`;
  $('#app').innerHTML = `<div class="min-h-screen md:flex">
    <header class="flex items-center justify-between bg-navy-800 px-4 py-3 text-white md:hidden"><img src="logo-white.png" alt="FDM" class="h-9 w-auto"><button class="text-2xl" onclick="$('#side').classList.toggle('hidden')">☰</button></header>
    <aside id="side" class="relative hidden w-full shrink-0 text-white md:sticky md:top-0 md:block md:h-screen md:w-64">
      <div class="hidden px-6 pb-4 pt-7 md:block"><img src="logo-white.png" alt="FDM - The future begins here" class="h-14 w-auto"><div class="mt-4 text-[11px] font-bold uppercase tracking-[.18em] text-white/40">Admission Lead Manager</div></div>
      <nav class="space-y-1 px-4 pb-3 md:mt-2">${items.map(([k, l, h]) => `<a data-nav="${k}" href="${h}" onclick="if(innerWidth<768)$('#side').classList.add('hidden')" class="nav-link">${ico(k)}${l}</a>`).join('')}
      <a href="#/leads/new" class="mt-4 flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5 text-sm font-semibold hover:bg-white/10">+ Add Lead</a></nav>
      <div class="flex items-center gap-3 border-t border-white/10 px-5 py-4 text-xs md:absolute md:bottom-0 md:w-64"><div class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-navy-500 to-navy-700 text-sm font-bold">${esc((ME.full_name || '?').trim().charAt(0).toUpperCase())}</div><div class="min-w-0 flex-1"><div class="truncate text-sm font-semibold text-white">${esc(ME.full_name)}</div><div class="capitalize text-white/50">${ME.role}</div></div><button class="rounded-lg px-2 py-1 text-white/60 hover:bg-white/10 hover:text-white" onclick="signOut()">Sign out</button></div>
    </aside><main id="main" class="min-w-0 flex-1 p-4 md:p-8"></main></div>`;
}
async function signOut() { await sb.auth.signOut(); ME = null; renderLogin(); }

// ---------- router ----------
function route() {
  if (!ME || !$('#main')) return;
  const h = location.hash.replace(/^#\/?/, ''); const p = h.split('/');
  const key = p[0] || 'dashboard';
  $$('[data-nav]').forEach((a) => { const on = a.dataset.nav === key; a.classList.toggle('nav-active', on); });
  main().innerHTML = spin();
  const run = async () => {
    if (!h) return dashboardPage();
    if (p[0] === 'leads') { if (!p[1]) return leadsPage(); if (p[1] === 'new') return leadForm(); if (p[2] === 'edit') return leadForm(p[1]); return profilePage(p[1]); }
    if (p[0] === 'followups') return followupsPage();
    if (p[0] === 'import') return importPage();
    if (p[0] === 'users' && isAdmin()) return usersPage();
    location.hash = '#/';
  };
  run().catch((e) => { main().innerHTML = `<div class="rounded-lg bg-red-50 p-4 text-red-700">${esc(e.message || e)}</div>`; });
}
window.addEventListener('hashchange', route);

// ---------- dashboard ----------
async function dashboardPage() {
  const leads = await fetchAll('leads', 'id,lead_code,full_name,program,lead_status,priority,application_status,offer_status,admission_status,created_at');
  const { data: fus, error } = await sb.from('followups').select('*, leads(id,full_name,lead_code)').eq('status', 'pending').order('due_at');
  if (error) throw error;
  const s = sod(), e = eod(), t = (f) => new Date(f.due_at).getTime();
  const today = fus.filter((f) => t(f) >= s && t(f) <= e), over = fus.filter((f) => t(f) < s), up = fus.filter((f) => t(f) > e);
  const cnt = (x) => leads.filter((l) => l.lead_status === x).length;
  const stats = [['Total Leads', leads.length, 'bg-navy-700'], ['New Leads', cnt('New'), 'bg-blue-600'], ['Interested', cnt('Interested'), 'bg-emerald-600'], ['Hot Leads', leads.filter((l) => l.priority === 'Hot').length, 'bg-red-600'],
    ['Follow-ups Due Today', today.length, 'bg-amber-600'], ['Overdue Follow-ups', over.length, 'bg-rose-700'],
    ['Applications Submitted', leads.filter((l) => l.lead_status === 'Application Submitted' || l.application_status === 'Submitted').length, 'bg-indigo-600'],
    ['Offers Received', leads.filter((l) => l.lead_status === 'Offer Received' || ['Received', 'Accepted'].includes(l.offer_status)).length, 'bg-teal-600'],
    ['Admissions Confirmed', leads.filter((l) => l.lead_status === 'Admission Confirmed' || l.admission_status === 'Confirmed').length, 'bg-green-700']];
  const by = K.STATUS.map((x) => [x, cnt(x)]); const max = Math.max(1, ...by.map((x) => x[1]));
  const upList = [...over.slice(0, 3), ...today, ...up].slice(0, 8);
  main().innerHTML = `<div class="space-y-6"><div class="flex items-center justify-between"><div><h1 class="text-3xl font-extrabold text-navy-800">Dashboard</h1><p class="mt-1 text-sm text-slate-500">Welcome back, ${esc(ME.full_name)} · ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })}</p></div><a href="#/leads/new" class="btn-primary">+ Add Lead</a></div>
    <div class="grid grid-cols-2 gap-3 lg:grid-cols-3 xl:grid-cols-5">${stats.map(([l, n, c]) => `<div class="card stat overflow-hidden"><div class="h-1.5 ${c}"></div><div class="p-4"><div class="text-3xl font-extrabold text-navy-800">${n}</div><div class="text-xs font-medium text-slate-500">${l}</div></div></div>`).join('')}</div>
    <div class="grid gap-6 lg:grid-cols-2"><div class="card p-4"><h2 class="mb-3 font-semibold text-navy-800">Leads by Status</h2><div class="space-y-2">${by.map(([x, n]) => `<div class="flex items-center gap-2 text-xs"><div class="w-36 shrink-0 text-slate-600">${x}</div><div class="h-3 flex-1 overflow-hidden rounded-full bg-slate-100"><div class="h-3 rounded-full bg-gradient-to-r from-navy-500 to-navy-700" style="width:${(n / max) * 100}%"></div></div><div class="w-8 text-right font-medium">${n}</div></div>`).join('')}</div></div>
    <div class="card p-4"><div class="mb-3 flex justify-between"><h2 class="font-semibold text-navy-800">Upcoming Follow-ups</h2><a href="#/followups" class="text-sm text-navy-600 underline">View all</a></div>
      ${upList.map((f) => `<a href="#/leads/${f.leads?.id}" class="flex justify-between border-b border-slate-100 py-2 text-sm hover:bg-navy-50"><span>${esc(f.leads?.full_name)} <span class="text-xs text-slate-400">${esc(f.leads?.lead_code)}</span></span><span class="${t(f) < s ? 'text-red-600' : 'text-slate-600'}">${fmtDT(f.due_at)}</span></a>`).join('') || '<p class="text-sm text-slate-400">No pending follow-ups.</p>'}</div></div>
    <div class="card p-4"><h2 class="mb-3 font-semibold text-navy-800">Recent Leads</h2><div class="overflow-x-auto"><table class="w-full"><tbody>
      ${leads.slice(0, 8).map((l) => `<tr class="border-t border-slate-100"><td class="td"><a class="font-medium text-navy-700 hover:underline" href="#/leads/${l.id}">${esc(l.full_name)}</a></td><td class="td text-slate-500">${esc(l.lead_code)}</td><td class="td">${esc(l.program || '—')}</td><td class="td">${badge(l.lead_status)}</td><td class="td">${badge(l.priority)}</td><td class="td text-slate-500">${fmtDate(l.created_at)}</td></tr>`).join('') || '<tr><td class="td text-slate-400">No leads yet. Add your first lead.</td></tr>'}
    </tbody></table></div></div></div>`;
}

// ---------- leads list ----------
let LEADS = [], SORT = { k: 'created_at', dir: -1 }, PG = 0, SHOWF = false;
const EMPTY_F = { q: '', bmin: '', bmax: '', program: '', spec: '', loc: '', exam: '', pmin: '', gmin: '', status: '', priority: '' };
let F = { ...EMPTY_F };
const PAGE_SIZE = 15;

async function leadsPage() {
  LEADS = await fetchAll('leads', '*, lead_exams(*), lead_academics(*)');
  drawLeadsShell();
}
function drawLeadsShell() {
  const fsel = (k, label, list) => `<select class="input" onchange="setF('${k}',this.value)"><option value="">${label}: All</option>${opts(list, F[k])}</select>`;
  const fnum = (k, ph) => `<input class="input" type="number" placeholder="${ph}" value="${esc(F[k])}" oninput="setF('${k}',this.value)">`;
  main().innerHTML = `<div class="space-y-4"><div class="flex flex-wrap items-center justify-between gap-2"><h1 class="text-2xl font-extrabold text-navy-800">Leads <span id="lcount" class="text-base font-normal text-slate-400"></span></h1><a href="#/leads/new" class="btn-primary">+ Add New Lead</a></div>
    <div class="card space-y-3 p-3"><div class="flex gap-2"><input class="input" placeholder="Search name, mobile, email or Lead ID…" value="${esc(F.q)}" oninput="setF('q',this.value)"><button class="btn-outline whitespace-nowrap" onclick="SHOWF=!SHOWF;drawLeadsShell()">${SHOWF ? 'Hide' : 'Filters'}</button><button class="btn-outline" onclick="F={...EMPTY_F};PG=0;drawLeadsShell()">Reset</button></div>
    ${SHOWF ? `<div class="grid grid-cols-2 gap-2 md:grid-cols-4">${fnum('bmin', 'Min budget ₹')}${fnum('bmax', 'Max budget ₹')}${fsel('program', 'Program', K.PROGRAMS)}${fsel('spec', 'Specialization', K.SPECS)}${fsel('loc', 'Location', K.LOCS)}${fsel('exam', 'Exam', K.EXAMS)}${fnum('pmin', 'Min percentile')}${fnum('gmin', 'Min graduation %')}${fsel('status', 'Status', K.STATUS)}${fsel('priority', 'Priority', K.PRIORITY)}</div>` : ''}</div>
    <div class="card overflow-x-auto" id="tbl"></div><div class="flex items-center justify-between text-sm" id="pg"></div></div>`;
  drawLeads();
}
function setF(k, v) { F[k] = v; PG = 0; drawLeads(); }
function filteredLeads() {
  const q = F.q.trim().toLowerCase(), qd = q.replace(/\D/g, '');
  return LEADS.filter((l) => {
    if (q && !((l.full_name || '').toLowerCase().includes(q) || (l.email || '').toLowerCase().includes(q) || (l.lead_code || '').toLowerCase().includes(q) || (qd && (l.mobile || '').includes(qd)))) return false;
    if (F.bmin && !(l.total_budget >= Number(F.bmin))) return false;
    if (F.bmax && !(l.total_budget <= Number(F.bmax))) return false;
    if (F.program && l.program !== F.program) return false;
    if (F.spec && l.specialization !== F.spec) return false;
    if (F.loc && !(l.locations || []).includes(F.loc)) return false;
    if (F.exam && !(l.lead_exams || []).some((e) => e.exam_name === F.exam)) return false;
    if (F.pmin && !((bestPct(l) ?? -1) >= Number(F.pmin))) return false;
    if (F.gmin) { const g = gradOf(l); if (!(g && g.result_type !== 'CGPA' && g.result_value >= Number(F.gmin))) return false; }
    if (F.status && l.lead_status !== F.status) return false;
    if (F.priority && l.priority !== F.priority) return false;
    return true;
  });
}
function drawLeads() {
  const val = (l, k) => (k === 'pct' ? bestPct(l) : k === 'grad' ? gradOf(l)?.result_value : l[k]);
  const rows = filteredLeads().sort((a, b) => { const x = val(a, SORT.k), y = val(b, SORT.k); if (x == null && y == null) return 0; if (x == null) return 1; if (y == null) return -1; return (x > y ? 1 : x < y ? -1 : 0) * SORT.dir; });
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE)); if (PG >= pages) PG = pages - 1;
  const view = rows.slice(PG * PAGE_SIZE, PG * PAGE_SIZE + PAGE_SIZE);
  const th = (k, l) => `<th class="th cursor-pointer select-none" onclick="sortBy('${k}')">${l}${SORT.k === k ? (SORT.dir === 1 ? ' ▲' : ' ▼') : ''}</th>`;
  $('#lcount').textContent = `(${rows.length})`;
  $('#tbl').innerHTML = `<table class="w-full"><thead class="border-b bg-slate-50"><tr>${th('lead_code', 'ID')}${th('full_name', 'Name')}${th('mobile', 'Mobile')}${th('email', 'Email')}${th('program', 'Program')}${th('total_budget', 'Budget')}${th('specialization', 'Specialization')}<th class="th">Locations</th>${th('grad', 'Grad %')}${th('pct', 'Percentile')}${th('lead_status', 'Status')}${th('priority', 'Priority')}${th('next_followup', 'Next Follow-up')}<th class="th">Actions</th></tr></thead><tbody>
    ${view.map((l) => `<tr class="border-b border-slate-100 hover:bg-navy-50/40"><td class="td text-slate-500">${esc(l.lead_code)}</td><td class="td font-medium"><a class="text-navy-700 hover:underline" href="#/leads/${l.id}">${esc(l.full_name)}</a></td><td class="td">${esc(l.mobile)}</td><td class="td">${esc(l.email || '—')}</td><td class="td">${esc(l.program || '—')}</td><td class="td">${inr(l.total_budget)}</td><td class="td">${esc(l.specialization || '—')}</td><td class="td">${esc((l.locations || []).join(', ') || '—')}</td><td class="td">${fmtRes(gradOf(l))}</td><td class="td">${bestPct(l) ?? '—'}</td><td class="td">${badge(l.lead_status)}</td><td class="td">${badge(l.priority)}</td><td class="td whitespace-nowrap">${fmtDT(l.next_followup)}</td>
      <td class="td whitespace-nowrap"><a class="text-navy-600 hover:underline" href="#/leads/${l.id}">View</a> · <a class="text-navy-600 hover:underline" href="#/leads/${l.id}/edit">Edit</a>${isAdmin() ? ` · <button class="text-red-600 hover:underline" onclick="askDelete('${l.id}')">Delete</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="14" class="p-8 text-center text-slate-400">No leads match.</td></tr>'}</tbody></table>`;
  $('#pg').innerHTML = `<span class="text-slate-500">Page ${PG + 1} of ${pages}</span><div class="flex gap-2"><button class="btn-outline" ${PG === 0 ? 'disabled' : ''} onclick="PG--;drawLeads()">Previous</button><button class="btn-outline" ${PG + 1 >= pages ? 'disabled' : ''} onclick="PG++;drawLeads()">Next</button></div>`;
}
function sortBy(k) { SORT = { k, dir: SORT.k === k ? -SORT.dir : 1 }; drawLeads(); }
function askDelete(id, goList) {
  const l = LEADS.find((x) => x.id === id) || { full_name: 'this lead', lead_code: '' };
  confirmBox('Delete lead?', `Permanently delete ${l.full_name} ${l.lead_code}, with all exams, follow-ups and history? This cannot be undone.`, async () => {
    const { error } = await sb.from('leads').delete().eq('id', id);
    if (error) return toast(error.message, true);
    toast('Lead deleted'); LEADS = LEADS.filter((x) => x.id !== id);
    if (goList) location.hash = '#/leads'; else drawLeads();
  });
}

// ---------- add / edit lead ----------
let ORIG_FOLLOW = '';
const examRow = (x = {}) => `<div class="exam-row rounded-lg border border-slate-200 p-3"><div class="grid gap-3 sm:grid-cols-3 lg:grid-cols-6">
  <label class="block"><span class="label">Exam</span><select class="input" data-k="exam_name">${opts(K.EXAMS, x.exam_name || 'CAT')}</select></label>
  <label class="block"><span class="label">Year</span><input class="input" type="number" data-k="exam_year" value="${esc(x.exam_year ?? '')}"></label>
  <label class="block"><span class="label">Status</span><select class="input" data-k="status"><option value="">Select…</option>${opts(K.EXAM_ST, x.status)}</select></label>
  <label class="block"><span class="label">Score</span><input class="input" type="number" step="any" data-k="score" value="${esc(x.score ?? '')}"></label>
  <label class="block"><span class="label">Percentile</span><input class="input" type="number" step="any" data-k="percentile" value="${esc(x.percentile ?? '')}"></label>
  <label class="block"><span class="label">Target %ile</span><input class="input" type="number" step="any" data-k="target_percentile" value="${esc(x.target_percentile ?? '')}"></label></div>
  <button type="button" class="mt-2 text-sm text-red-600 hover:underline" onclick="this.closest('.exam-row').remove()">Remove exam</button></div>`;

async function leadForm(id) {
  let l = { lead_status: 'New', priority: 'Warm', lead_date: todayStr(), assigned_to: ME.id, locations: [] }, exams = [];
  if (id) {
    const { data, error } = await sb.from('leads').select('*, lead_exams(*), lead_academics(*)').eq('id', id).single();
    if (error || !data) { toast(error?.message || 'Lead not found', true); location.hash = '#/leads'; return; }
    l = data; exams = data.lead_exams || [];
  }
  ORIG_FOLLOW = toLocalInput(l.next_followup);
  const A = (lvl) => (l.lead_academics || []).find((a) => a.level === lvl) || {};
  const ai = (lvl, k, label, a = '') => inp(`${lvl}__${k}`, label, A(lvl)[k] ?? '', a);
  const as = (lvl, k, label, list, def = '') => sel(`${lvl}__${k}`, label, list, A(lvl)[k] ?? def);
  const g = A('graduation');
  main().innerHTML = `<form id="lform" class="mx-auto max-w-5xl space-y-3" novalidate><h1 class="text-2xl font-extrabold text-navy-800">${id ? 'Edit Lead' : 'Add New Lead'}</h1>
  ${sec('1. Personal Details', `<div class="${GRID}">
    ${inp('full_name', 'Full Name', l.full_name, '', true)}
    ${fld('Mobile Number', `<input class="input" name="mobile" inputmode="numeric" value="${esc(l.mobile || '')}" onblur="checkDup(this,'${id || ''}')">`, true)}
    ${inp('alt_mobile', 'Alternate Mobile', l.alt_mobile, 'inputmode="numeric"')}${inp('email', 'Email ID', l.email, 'type="email"')}${inp('city', 'Current City', l.city)}${sel('state', 'State', K.STATES, l.state)}
    ${fld('Lead Source', `<input class="input" name="lead_source" list="srcs" value="${esc(l.lead_source || '')}"><datalist id="srcs">${K.SOURCES.map((s) => `<option value="${s}">`).join('')}</datalist>`)}
    ${inp('lead_date', 'Lead Creation Date', l.lead_date, 'type="date"')}</div><div id="dupbox"></div>`, true)}
  ${sec('2. Admission Preferences', `<div class="${GRID}">${sel('program', 'Preferred Program', K.PROGRAMS, l.program)}${sel('specialization', 'Preferred Specialization', K.SPECS, l.specialization)}
    ${inp('total_budget', 'Total Budget (INR)', l.total_budget, 'type="number" min="0"')}${inp('annual_fee_budget', 'Preferred Annual Fee Budget (INR)', l.annual_fee_budget, 'type="number" min="0"')}
    ${inp('preferred_college', 'Preferred College Name', l.preferred_college)}${sel('hostel', 'Hostel Required', K.YN, l.hostel)}${sel('study_mode', 'Study Mode', K.MODES, l.study_mode)}${sel('study_abroad', 'Study Abroad Preference', K.YNU, l.study_abroad)}</div>
    <div class="mt-3"><span class="label">Preferred Locations (select multiple)</span><div class="flex flex-wrap gap-2">${K.LOCS.map((x) => `<label class="cursor-pointer"><input type="checkbox" name="loc" value="${x}" class="peer hidden" ${(l.locations || []).includes(x) ? 'checked' : ''}><span class="inline-block rounded-full border border-slate-300 px-3 py-1 text-sm text-slate-600 peer-checked:border-navy-700 peer-checked:bg-navy-700 peer-checked:text-white">${x}</span></label>`).join('')}</div></div>`)}
  ${sec('3. Entrance Examinations', `<div id="exams" class="space-y-3">${exams.map(examRow).join('')}</div><button type="button" class="btn-outline mt-3" onclick="$('#exams').insertAdjacentHTML('beforeend', examRow())">+ Add Exam Record</button>`)}
  ${sec('4. Class 10 Details', `<div class="${GRID}">${ai('class10', 'board', 'Board')}${ai('class10', 'passing_year', 'Passing Year', 'type="number"')}${as('class10', 'result_type', 'Result Type', K.RES, 'Percentage')}${ai('class10', 'result_value', 'Percentage / CGPA', 'type="number" step="any"')}</div>`)}
  ${sec('5. Class 12 / Diploma Details', `<div class="${GRID}">${as('class12', 'qualification_type', 'Qualification Type', K.QUAL, 'Class 12')}${ai('class12', 'board', 'Board or Institution')}${ai('class12', 'stream', 'Stream')}${ai('class12', 'passing_year', 'Passing Year', 'type="number"')}${as('class12', 'result_type', 'Result Type', K.RES, 'Percentage')}${ai('class12', 'result_value', 'Percentage / CGPA', 'type="number" step="any"')}</div>`)}
  ${sec('6. Graduation Details', `<div class="${GRID}">
    ${fld('Degree', `<select class="input" name="graduation__degree" onchange="$('#odeg').classList.toggle('hidden',this.value!=='Other')"><option value="">Select…</option>${opts(K.DEGREES, g.degree)}</select>`)}
    <div id="odeg" class="${g.degree === 'Other' ? '' : 'hidden'}">${ai('graduation', 'other_degree', 'Other Degree Name')}</div>
    ${ai('graduation', 'institution', 'College / University')}${ai('graduation', 'specialization', 'Graduation Specialization')}${ai('graduation', 'passing_year', 'Passing Year', 'type="number"')}${as('graduation', 'academic_status', 'Academic Status', K.ACAD_ST)}
    ${as('graduation', 'result_type', 'Result Type', K.RES, 'Percentage')}${ai('graduation', 'result_value', 'Percentage / CGPA', 'type="number" step="any"')}
    ${fld('Backlogs', `<select class="input" name="graduation__backlogs" onchange="$('#bcnt').classList.toggle('hidden',this.value!=='Yes')"><option value="">Select…</option>${opts(K.YN, g.backlogs || 'No')}</select>`)}
    <div id="bcnt" class="${g.backlogs === 'Yes' ? '' : 'hidden'}">${ai('graduation', 'backlog_count', 'Number of Backlogs', 'type="number" min="0"')}</div>
    ${inp('edu_gap', 'Education Gap (e.g. 1 year)', l.edu_gap)}${inp('work_exp_years', 'Work Experience (years)', l.work_exp_years, 'type="number" step="any" min="0"')}</div>`)}
  ${sec('7. Counselling Details', `<div class="${GRID}">${sel('lead_status', 'Lead Status', K.STATUS, l.lead_status, true)}${sel('priority', 'Lead Priority', K.PRIORITY, l.priority, true)}
    ${fld('Assigned Counsellor', `<select class="input" name="assigned_to" ${isAdmin() ? '' : 'disabled'}>${PEOPLE.map((p) => `<option value="${p.id}" ${p.id === l.assigned_to ? 'selected' : ''}>${esc(p.full_name)}</option>`).join('')}</select>`, true)}
    ${inp('last_contact_date', 'Last Contact Date', l.last_contact_date, 'type="date"')}${inp('next_followup', 'Next Follow-up (Date & Time)', toLocalInput(l.next_followup), 'type="datetime-local"')}
    ${sel('application_status', 'Application Status', K.APP_ST, l.application_status)}${sel('offer_status', 'Offer Letter Status', K.OFFER_ST, l.offer_status)}${sel('admission_status', 'Final Admission Status', K.ADM_ST, l.admission_status)}</div>
    <div class="mt-3">${fld('Counsellor Remarks', `<textarea class="input" rows="3" name="remarks">${esc(l.remarks || '')}</textarea>`)}</div>`, true)}
  <div class="flex justify-end gap-2 py-2"><button type="button" class="btn-outline" onclick="history.back()">Cancel</button><button class="btn-primary" id="savebtn">${id ? 'Save Changes' : 'Add Lead'}</button></div></form>`;
  $('#lform').onsubmit = (e) => { e.preventDefault(); saveLead(id); };
}
async function checkDup(el, id) {
  const box = $('#dupbox'); box.innerHTML = '';
  if (!validMobile(el.value)) return;
  const { data } = await sb.rpc('find_lead_by_mobile', { m: el.value, exclude_id: id || null });
  if (data && data.length) box.innerHTML = `<div class="mt-3 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm text-amber-900">⚠ Duplicate mobile number: already used by ${data.map((d) => esc(`${d.name} (${d.code}${d.counsellor ? ', counsellor: ' + d.counsellor : ''})`)).join('; ')}. You can still save.</div>`;
}
async function saveLead(id) {
  const form = $('#lform'); const fd = new FormData(form); const g = (n) => (fd.get(n) ?? '').toString().trim();
  $$('.border-red-500', form).forEach((x) => x.classList.remove('border-red-500'));
  const bad = [];
  if (!g('full_name')) bad.push('full_name');
  if (!validMobile(g('mobile'))) bad.push('mobile');
  if (g('alt_mobile') && !validMobile(g('alt_mobile'))) bad.push('alt_mobile');
  if (g('email') && !validEmail(g('email'))) bad.push('email');
  const exams = $$('.exam-row').map((r) => Object.fromEntries($$('[data-k]', r).map((i) => [i.dataset.k, i.value])));
  if (exams.some((x) => x.percentile !== '' && (x.percentile < 0 || x.percentile > 100))) toast('Percentile must be between 0 and 100', true), bad.push('percentile');
  if (bad.length) {
    bad.forEach((n) => { const el = form.elements[n] || $(`[data-k="${n}"]`); if (el) { el.classList.add('border-red-500'); el.closest('details')?.setAttribute('open', ''); } });
    const msgs = { full_name: 'Full name is required', mobile: 'Enter a valid 10-digit Indian mobile number', alt_mobile: 'Alternate mobile is invalid', email: 'Email is invalid' };
    return toast(msgs[bad[0]] || 'Please fix the highlighted fields', true);
  }
  const btn = $('#savebtn'); btn.disabled = true; btn.textContent = 'Saving…';
  try {
    const assigned = isAdmin() ? g('assigned_to') : ME.id;
    const p = { full_name: g('full_name'), mobile: normMobile(g('mobile')), alt_mobile: g('alt_mobile') ? normMobile(g('alt_mobile')) : null, email: nn(g('email')), city: nn(g('city')), state: nn(g('state')), lead_source: nn(g('lead_source')),
      lead_date: g('lead_date') || todayStr(), program: nn(g('program')), specialization: nn(g('specialization')), locations: fd.getAll('loc'), total_budget: num(g('total_budget')), annual_fee_budget: num(g('annual_fee_budget')),
      preferred_college: nn(g('preferred_college')), hostel: nn(g('hostel')), study_mode: nn(g('study_mode')), study_abroad: nn(g('study_abroad')), work_exp_years: num(g('work_exp_years')), edu_gap: nn(g('edu_gap')),
      lead_status: g('lead_status') || 'New', priority: g('priority') || 'Warm', assigned_to: assigned, last_contact_date: nn(g('last_contact_date')), next_followup: fromLocalInput(g('next_followup')), remarks: nn(g('remarks')),
      application_status: nn(g('application_status')), offer_status: nn(g('offer_status')), admission_status: nn(g('admission_status')) };
    let leadId = id;
    if (id) { const { error } = await sb.from('leads').update(p).eq('id', id); if (error) throw error; }
    else { const { data, error } = await sb.from('leads').insert(p).select('id').single(); if (error) throw error; leadId = data.id; }

    await sb.from('lead_exams').delete().eq('lead_id', leadId);
    const ex = exams.filter((x) => x.exam_name).map((x) => ({ lead_id: leadId, exam_name: x.exam_name, exam_year: num(x.exam_year), status: nn(x.status), score: num(x.score), percentile: num(x.percentile), target_percentile: num(x.target_percentile) }));
    if (ex.length) { const { error } = await sb.from('lead_exams').insert(ex); if (error) throw error; }

    await sb.from('lead_academics').delete().eq('lead_id', leadId);
    const intKeys = ['passing_year', 'backlog_count'], numKeys = ['result_value'];
    const rows = Object.keys(AC).map((lvl) => {
      const r = { lead_id: leadId, level: lvl };
      AC[lvl].forEach((k) => { const v = g(`${lvl}__${k}`); r[k] = intKeys.includes(k) || numKeys.includes(k) ? num(v) : nn(v); });
      return r;
    }).filter((r) => r.board || r.stream || r.passing_year || r.result_value !== null || r.degree || r.institution || r.specialization || r.academic_status);
    if (rows.length) { const { error } = await sb.from('lead_academics').insert(rows); if (error) throw error; }

    if (p.next_followup && g('next_followup') !== ORIG_FOLLOW) {
      await sb.from('followups').update({ status: 'completed', outcome: 'Rescheduled', completed_at: new Date().toISOString() }).eq('lead_id', leadId).eq('status', 'pending');
      const { error } = await sb.from('followups').insert({ lead_id: leadId, due_at: p.next_followup, remarks: p.remarks });
      if (error) throw error;
    }
    toast(id ? 'Lead updated' : 'Lead added'); location.hash = `#/leads/${leadId}`;
  } catch (err) { toast(err.message || 'Save failed', true); btn.disabled = false; btn.textContent = id ? 'Save Changes' : 'Add Lead'; }
}

// ---------- student profile ----------
async function profilePage(id) {
  const { data: l, error } = await sb.from('leads').select('*, lead_exams(*), lead_academics(*), assignee:profiles!leads_assigned_to_fkey(full_name)').eq('id', id).single();
  if (error || !l) { toast(error?.message || 'Lead not found', true); location.hash = '#/leads'; return; }
  if (!LEADS.find((x) => x.id === l.id)) LEADS.push(l);
  const hist = (await sb.from('interactions').select('*, author:profiles!interactions_created_by_fkey(full_name)').eq('lead_id', id).order('occurred_at', { ascending: false })).data || [];
  const fus = (await sb.from('followups').select('*').eq('lead_id', id).order('due_at', { ascending: false })).data || [];
  const ac = (lv) => (l.lead_academics || []).find((a) => a.level === lv) || {};
  const c10 = ac('class10'), c12 = ac('class12'), g = ac('graduation');
  const kv = (k, v) => `<div><div class="label">${k}</div><div class="text-sm">${v === null || v === undefined || v === '' ? '—' : esc(v)}</div></div>`;
  const card = (t, body) => `<div class="card p-4"><h2 class="mb-3 font-semibold text-navy-800">${t}</h2><div class="grid grid-cols-2 gap-3 md:grid-cols-3">${body}</div></div>`;
  main().innerHTML = `<div class="mx-auto max-w-5xl space-y-4">
    <div class="flex flex-wrap items-start justify-between gap-2"><div><h1 class="text-2xl font-extrabold text-navy-800">${esc(l.full_name)} <span class="text-base font-normal text-slate-400">${esc(l.lead_code)}</span></h1><div class="mt-1 flex gap-2">${badge(l.lead_status)}${badge(l.priority)}</div></div>
      <div class="flex gap-2"><a class="btn-primary" href="tel:+91${esc(l.mobile)}" title="Call ${esc(l.full_name)}">📞 Call Now</a><a class="btn-outline" target="_blank" rel="noreferrer" href="https://wa.me/91${esc(l.mobile)}">WhatsApp</a><a class="btn-primary" href="#/leads/${l.id}/edit">Edit</a>${isAdmin() ? `<button class="btn-danger" onclick="askDelete('${l.id}',true)">Delete</button>` : ''}</div></div>
    ${card('Personal Details', kv('Mobile', l.mobile) + kv('Alternate Mobile', l.alt_mobile) + kv('Email', l.email) + kv('City', l.city) + kv('State', l.state) + kv('Lead Source', l.lead_source) + kv('Lead Date', fmtDate(l.lead_date)) + kv('Counsellor', l.assignee?.full_name))}
    ${card('Admission Preferences', kv('Program', l.program) + kv('Specialization', l.specialization) + kv('Locations', (l.locations || []).join(', ')) + kv('Total Budget', inr(l.total_budget)) + kv('Annual Fee Budget', inr(l.annual_fee_budget)) + kv('Preferred College', l.preferred_college) + kv('Hostel', l.hostel) + kv('Study Mode', l.study_mode) + kv('Study Abroad', l.study_abroad))}
    <div class="card p-4"><h2 class="mb-3 font-semibold text-navy-800">Entrance Exams</h2><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr><th class="th">Exam</th><th class="th">Year</th><th class="th">Status</th><th class="th">Score</th><th class="th">Percentile</th><th class="th">Target</th></tr></thead><tbody>
      ${(l.lead_exams || []).map((e) => `<tr class="border-t"><td class="td">${esc(e.exam_name)}</td><td class="td">${e.exam_year ?? '—'}</td><td class="td">${esc(e.status || '—')}</td><td class="td">${e.score ?? '—'}</td><td class="td">${e.percentile ?? '—'}</td><td class="td">${e.target_percentile ?? '—'}</td></tr>`).join('') || '<tr><td class="td text-slate-400" colspan="6">No exam records.</td></tr>'}</tbody></table></div></div>
    ${card('Academic Details', kv('Class 10 Board', c10.board) + kv('Class 10 Year', c10.passing_year) + kv('Class 10 Result', fmtRes(c10)) + kv((c12.qualification_type || 'Class 12') + ' Institution', c12.board) + kv('Stream', c12.stream) + kv('Year', c12.passing_year) + kv('Result', fmtRes(c12)) +
      kv('Degree', g.degree === 'Other' ? g.other_degree : g.degree) + kv('College / University', g.institution) + kv('Specialization', g.specialization) + kv('Graduation Year', g.passing_year) + kv('Academic Status', g.academic_status) + kv('Graduation Result', fmtRes(g)) +
      kv('Backlogs', g.backlogs === 'Yes' ? `Yes (${g.backlog_count ?? '?'})` : g.backlogs) + kv('Education Gap', l.edu_gap) + kv('Work Experience', l.work_exp_years !== null ? l.work_exp_years + ' yrs' : null))}
    ${card('Counselling Status', kv('Last Contact', fmtDate(l.last_contact_date)) + kv('Next Follow-up', fmtDT(l.next_followup)) + kv('Application', l.application_status) + kv('Offer Letter', l.offer_status) + kv('Final Admission', l.admission_status) + kv('Remarks', l.remarks))}
    <div class="card space-y-3 p-4"><h2 class="font-semibold text-navy-800">Counselling History</h2>
      <div class="grid gap-2 sm:grid-cols-4"><label class="block"><span class="label">Type</span><select id="it" class="input">${opts(K.INTER, 'Call')}</select></label><label class="block"><span class="label">Date & Time</span><input id="iw" type="datetime-local" class="input" value="${toLocalInput(new Date().toISOString())}"></label>
        <label class="block sm:col-span-2"><span class="label">Notes</span><input id="in" class="input" placeholder="What was discussed / recommended?"></label></div>
      <button class="btn-primary" id="ib" onclick="addInteraction('${l.id}')">Log Interaction</button>
      <div class="divide-y">${hist.map((h) => `<div class="py-2 text-sm"><div class="flex justify-between"><span class="font-medium text-navy-700">${esc(h.type)}</span><span class="text-xs text-slate-400">${fmtDT(h.occurred_at)}${h.author?.full_name ? ' · ' + esc(h.author.full_name) : ''}</span></div><div class="text-slate-700">${esc(h.notes)}</div></div>`).join('') || '<p class="py-2 text-sm text-slate-400">No history yet.</p>'}</div></div>
    <div class="card p-4"><h2 class="mb-2 font-semibold text-navy-800">Follow-ups</h2>${fus.map((f) => `<div class="flex justify-between border-t py-2 text-sm"><span>${fmtDT(f.due_at)} ${f.outcome ? `<span class="text-slate-500">— ${esc(f.outcome)}</span>` : ''}</span><span class="${f.status === 'pending' ? 'text-amber-600' : 'text-emerald-600'}">${f.status}</span></div>`).join('') || '<p class="text-sm text-slate-400">No follow-ups scheduled.</p>'}</div></div>`;
}
async function addInteraction(id) {
  const notes = $('#in').value.trim(), type = $('#it').value;
  if (!notes) return toast('Please enter notes', true);
  const b = $('#ib'); b.disabled = true; b.textContent = 'Saving…';
  const { error } = await sb.from('interactions').insert({ lead_id: id, type, notes, occurred_at: fromLocalInput($('#iw').value) });
  if (!error && ['Call', 'WhatsApp', 'Email', 'Counselling Session'].includes(type)) await sb.from('leads').update({ last_contact_date: todayStr() }).eq('id', id);
  if (error) { toast(error.message, true); b.disabled = false; b.textContent = 'Log Interaction'; return; }
  toast('Interaction logged'); profilePage(id);
}

// ---------- follow-ups ----------
let FTAB = 'Today', FROWS = [];
async function followupsPage() {
  const { data, error } = await sb.from('followups').select('*, leads(id,full_name,lead_code,mobile,lead_status)').order('due_at');
  if (error) throw error; FROWS = data || []; drawFollow();
}
function drawFollow() {
  const s = sod(), e = eod(), t = (f) => new Date(f.due_at).getTime();
  const lists = { Today: FROWS.filter((f) => f.status === 'pending' && t(f) >= s && t(f) <= e), Overdue: FROWS.filter((f) => f.status === 'pending' && t(f) < s), Upcoming: FROWS.filter((f) => f.status === 'pending' && t(f) > e), Completed: FROWS.filter((f) => f.status === 'completed').reverse() };
  main().innerHTML = `<div class="space-y-4"><h1 class="text-2xl font-extrabold text-navy-800">Follow-ups</h1>
    <div class="flex flex-wrap gap-2">${Object.keys(lists).map((x) => `<button onclick="FTAB='${x}';drawFollow()" class="rounded-full px-4 py-2 text-sm font-semibold transition ${FTAB === x ? 'bg-gradient-to-br from-navy-500 to-navy-700 text-white shadow-md shadow-red-500/25' : 'border border-slate-200 bg-white text-slate-600 hover:bg-navy-50'}">${x} (${lists[x].length})</button>`).join('')}</div>
    <div class="card overflow-x-auto"><table class="w-full"><thead class="border-b bg-slate-50"><tr><th class="th">When</th><th class="th">Student</th><th class="th">Mobile</th><th class="th">Status</th><th class="th">${FTAB === 'Completed' ? 'Outcome' : 'Remarks'}</th><th class="th"></th></tr></thead><tbody>
    ${lists[FTAB].map((f) => `<tr class="border-b border-slate-100"><td class="td whitespace-nowrap ${FTAB === 'Overdue' ? 'text-red-600' : ''}">${fmtDT(FTAB === 'Completed' ? f.completed_at : f.due_at)}</td><td class="td"><a class="font-medium text-navy-700 hover:underline" href="#/leads/${f.leads?.id}">${esc(f.leads?.full_name)}</a> <span class="text-xs text-slate-400">${esc(f.leads?.lead_code)}</span></td><td class="td"><a class="text-navy-600" href="tel:+91${esc(f.leads?.mobile)}">${esc(f.leads?.mobile)}</a></td><td class="td">${badge(f.leads?.lead_status)}</td><td class="td text-slate-600">${esc(FTAB === 'Completed' ? [f.outcome, f.remarks].filter(Boolean).join(' — ') : f.remarks || '—')}</td><td class="td">${f.status === 'pending' ? `<button class="btn-primary !py-1" onclick="openFU('${f.id}')">Record outcome</button>` : ''}</td></tr>`).join('') || '<tr><td colspan="6" class="p-8 text-center text-slate-400">Nothing here.</td></tr>'}</tbody></table></div></div>`;
}
function openFU(fid) {
  const f = FROWS.find((x) => x.id === fid);
  modal(`Follow-up: ${f.leads?.full_name}`, `<div class="space-y-3">
    <label class="block"><span class="label">Call outcome</span><select id="fo" class="input">${opts(K.OUTCOMES)}</select></label>
    <label class="block"><span class="label">Remarks</span><textarea id="fr" class="input" rows="3"></textarea></label>
    <label class="block"><span class="label">Update lead status (optional)</span><select id="fs" class="input"><option value="">Keep current</option>${opts(K.STATUS)}</select></label>
    <label class="block"><span class="label">Schedule next follow-up (optional)</span><input id="fn" type="datetime-local" class="input"></label>
    <div class="flex justify-end gap-2"><button class="btn-outline" onclick="closeModal()">Cancel</button><button class="btn-primary" id="fsave" onclick="saveFU('${fid}')">Save</button></div></div>`, true);
}
async function saveFU(fid) {
  const f = FROWS.find((x) => x.id === fid); const b = $('#fsave'); b.disabled = true; b.textContent = 'Saving…';
  const outcome = $('#fo').value, remarks = $('#fr').value.trim(), status = $('#fs').value, next = fromLocalInput($('#fn').value), now = new Date().toISOString();
  try {
    let r = await sb.from('followups').update({ status: 'completed', outcome, remarks: remarks || null, completed_at: now }).eq('id', fid); if (r.error) throw r.error;
    r = await sb.from('interactions').insert({ lead_id: f.lead_id, type: 'Call', notes: outcome + (remarks ? ' — ' + remarks : '') }); if (r.error) throw r.error;
    if (next) { r = await sb.from('followups').insert({ lead_id: f.lead_id, due_at: next }); if (r.error) throw r.error; }
    const upd = { last_contact_date: todayStr(), next_followup: next }; if (status) upd.lead_status = status; if (remarks) upd.remarks = remarks;
    r = await sb.from('leads').update(upd).eq('id', f.lead_id); if (r.error) throw r.error;
    toast('Follow-up recorded'); closeModal(); followupsPage();
  } catch (e) { toast(e.message, true); b.disabled = false; b.textContent = 'Save'; }
}

// ---------- import / export ----------
const TARGETS = [['full_name', 'Full Name', 1], ['mobile', 'Mobile', 1], ['alt_mobile', 'Alternate Mobile'], ['email', 'Email'], ['city', 'City'], ['state', 'State'], ['lead_source', 'Lead Source'], ['program', 'Program'], ['specialization', 'Specialization'],
  ['locations', 'Preferred Locations (comma separated)'], ['total_budget', 'Total Budget'], ['annual_fee_budget', 'Annual Fee Budget'], ['lead_status', 'Lead Status'], ['priority', 'Priority'], ['remarks', 'Remarks']];
const SYN = { full_name: ['name', 'studentname', 'fullname'], mobile: ['phone', 'mobileno', 'mobilenumber', 'contact', 'phonenumber'], email: ['emailid', 'mail'], locations: ['preferredlocation', 'location'], total_budget: ['budget'], lead_source: ['source'] };
const norm = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
let IMP = { headers: [], raw: [], map: {}, name: '', dbDup: [], skipDup: true, assignTo: null };
const download = (blob, name) => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000); };

async function importPage() {
  IMP = { headers: [], raw: [], map: {}, name: '', dbDup: [], skipDup: true, assignTo: ME.id };
  main().innerHTML = `<div class="space-y-6"><h1 class="text-2xl font-extrabold text-navy-800">Import / Export</h1>
    <div class="card space-y-3 p-4"><h2 class="font-semibold text-navy-800">Export leads</h2><p class="text-sm text-slate-500">${isAdmin() ? 'Exports all leads.' : 'Exports your assigned leads.'}</p><div class="flex gap-2"><button class="btn-primary" onclick="doExport('xlsx',this)">Export Excel (.xlsx)</button><button class="btn-outline" onclick="doExport('csv',this)">Export CSV</button></div></div>
    <div class="card space-y-4 p-4"><div class="flex flex-wrap items-center justify-between gap-2"><h2 class="font-semibold text-navy-800">Import leads</h2><button class="text-sm text-navy-600 underline" onclick="downloadTemplate()">Download template</button></div>
    <input type="file" accept=".xlsx,.xls,.csv" onchange="onImpFile(this.files[0])" class="block text-sm"><div id="impBody"></div></div></div>`;
}
async function doExport(kind, btn) {
  btn.disabled = true; const old = btn.textContent; btn.textContent = 'Exporting…';
  try {
    const rows = await fetchAll('leads', '*, lead_exams(*), lead_academics(*), assignee:profiles!leads_assigned_to_fkey(full_name)');
    const data = rows.map((l) => { const g = gradOf(l) || {}; return { 'Lead ID': l.lead_code, 'Full Name': l.full_name, Mobile: l.mobile, 'Alternate Mobile': l.alt_mobile, Email: l.email, City: l.city, State: l.state, 'Lead Source': l.lead_source, 'Lead Date': l.lead_date,
      Program: l.program, Specialization: l.specialization, 'Preferred Locations': (l.locations || []).join(', '), 'Total Budget': l.total_budget, 'Annual Fee Budget': l.annual_fee_budget, 'Preferred College': l.preferred_college, Hostel: l.hostel, 'Study Mode': l.study_mode, 'Study Abroad': l.study_abroad,
      Exams: (l.lead_exams || []).map((e) => `${e.exam_name} ${e.exam_year || ''} ${e.percentile ?? ''}%ile`.trim()).join('; '), Degree: g.degree === 'Other' ? g.other_degree : g.degree, 'Graduation Result': g.result_value, 'Result Type': g.result_type, 'Work Exp (yrs)': l.work_exp_years,
      'Lead Status': l.lead_status, Priority: l.priority, Counsellor: l.assignee?.full_name, 'Last Contact': l.last_contact_date, 'Next Follow-up': l.next_followup, Remarks: l.remarks, 'Application Status': l.application_status, 'Offer Status': l.offer_status, 'Admission Status': l.admission_status }; });
    const ws = XLSX.utils.json_to_sheet(data);
    if (kind === 'csv') download(new Blob(['\ufeff' + XLSX.utils.sheet_to_csv(ws)], { type: 'text/csv;charset=utf-8' }), `leads-${todayStr()}.csv`);
    else { const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Leads'); XLSX.writeFile(wb, `leads-${todayStr()}.xlsx`); }
    toast(`Exported ${data.length} leads`);
  } catch (e) { toast(e.message, true); }
  btn.disabled = false; btn.textContent = old;
}
function downloadTemplate() {
  const ws = XLSX.utils.aoa_to_sheet([TARGETS.map((t) => t[1]), ['Rahul Sharma', '9876543210', '', 'rahul@example.com', 'Bhopal', 'Madhya Pradesh', 'Website', 'MBA', 'Finance', 'Pune, Mumbai', 500000, 300000, 'New', 'Warm', 'Sample row']]);
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, 'Template'); XLSX.writeFile(wb, 'lead-import-template.xlsx');
}
async function onImpFile(file) {
  if (!file) return;
  try {
    const wb = XLSX.read(await file.arrayBuffer(), { type: 'array' });
    const rows = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]], { defval: '', raw: false });
    if (!rows.length) return toast('The file has no data rows', true);
    const h = Object.keys(rows[0]), m = {};
    TARGETS.forEach(([k, label]) => { const c = h.find((x) => [norm(k), norm(label), ...(SYN[k] || [])].includes(norm(x))); if (c) m[k] = c; });
    IMP = { ...IMP, headers: h, raw: rows, map: m, name: file.name }; await refreshDup(); drawImp();
  } catch (e) { toast('Could not read file: ' + e.message, true); }
}
async function refreshDup() {
  IMP.dbDup = [];
  if (!IMP.map.mobile) return;
  const ms = [...new Set(IMP.raw.map((r) => normMobile(r[IMP.map.mobile])).filter(validMobile))];
  for (let i = 0; i < ms.length; i += 500) { const { data } = await sb.rpc('existing_mobiles', { ms: ms.slice(i, i + 500) }); IMP.dbDup.push(...(data || [])); }
}
function impRows() {
  const seen = new Set();
  return IMP.raw.map((r, i) => {
    const g = (k) => (IMP.map[k] ? String(r[IMP.map[k]] ?? '').trim() : '');
    const errors = [], mobile = normMobile(g('mobile'));
    if (!g('full_name')) errors.push('Name missing'); if (!validMobile(mobile)) errors.push('Invalid mobile'); if (g('email') && !validEmail(g('email'))) errors.push('Invalid email');
    const dup = !validMobile(mobile) ? '' : seen.has(mobile) ? 'Repeated in file' : IMP.dbDup.includes(mobile) ? 'Already in database' : ''; if (validMobile(mobile)) seen.add(mobile);
    const money = (k) => num(g(k).replace(/[₹,\s]/g, ''));
    return { i, errors, dup, rec: { full_name: g('full_name'), mobile, alt_mobile: g('alt_mobile') ? normMobile(g('alt_mobile')) : null, email: g('email') || null, city: g('city') || null, state: g('state') || null, lead_source: g('lead_source') || null,
      program: g('program') || null, specialization: g('specialization') || null, locations: g('locations') ? g('locations').split(/[,;]/).map((x) => x.trim()).filter(Boolean) : [], total_budget: money('total_budget'), annual_fee_budget: money('annual_fee_budget'),
      lead_status: K.STATUS.find((s) => s.toLowerCase() === g('lead_status').toLowerCase()) || 'New', priority: K.PRIORITY.find((s) => s.toLowerCase() === g('priority').toLowerCase()) || 'Warm', remarks: g('remarks') || null, assigned_to: IMP.assignTo, lead_date: todayStr() } };
  });
}
function drawImp() {
  const box = $('#impBody'); if (!IMP.raw.length) { box.innerHTML = ''; return; }
  const rows = impRows(), ok = rows.filter((v) => !v.errors.length && (!IMP.skipDup || !v.dup)), ready = IMP.map.full_name && IMP.map.mobile;
  box.innerHTML = `<div class="space-y-4"><div><div class="mb-2 text-sm font-medium">Column mapping — ${esc(IMP.name)} (${IMP.raw.length} rows)</div><div class="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
    ${TARGETS.map(([k, label, req]) => `<label class="block"><span class="label">${label}${req ? '<span class="text-red-600"> *</span>' : ''}</span><select class="input" onchange="IMP.map['${k}']=this.value;(${k === 'mobile'})?refreshDup().then(drawImp):drawImp()"><option value="">— not mapped —</option>${IMP.headers.map((h) => `<option ${IMP.map[k] === h ? 'selected' : ''}>${esc(h)}</option>`).join('')}</select></label>`).join('')}</div></div>
    <div class="flex flex-wrap items-end gap-4">${isAdmin() ? `<label class="block"><span class="label">Assign imported leads to</span><select class="input" onchange="IMP.assignTo=this.value">${PEOPLE.map((p) => `<option value="${p.id}" ${p.id === IMP.assignTo ? 'selected' : ''}>${esc(p.full_name)}</option>`).join('')}</select></label>` : ''}
      <label class="flex items-center gap-2 text-sm"><input type="checkbox" ${IMP.skipDup ? 'checked' : ''} onchange="IMP.skipDup=this.checked;drawImp()">Skip duplicates (same mobile)</label></div>
    <div class="text-sm"><span class="font-medium text-emerald-700">${rows.filter((v) => !v.errors.length && !v.dup).length} valid</span> · <span class="font-medium text-amber-700">${rows.filter((v) => v.dup).length} duplicates</span> · <span class="font-medium text-red-600">${rows.filter((v) => v.errors.length).length} invalid</span></div>
    <div class="max-h-80 overflow-auto rounded-lg border"><table class="w-full"><thead class="sticky top-0 bg-slate-50"><tr><th class="th">Row</th><th class="th">Name</th><th class="th">Mobile</th><th class="th">Program</th><th class="th">Check</th></tr></thead><tbody>
    ${rows.slice(0, 50).map((v) => `<tr class="border-t"><td class="td">${v.i + 2}</td><td class="td">${esc(v.rec.full_name)}</td><td class="td">${esc(v.rec.mobile)}</td><td class="td">${esc(v.rec.program || '—')}</td><td class="td ${v.errors.length ? 'text-red-600' : v.dup ? 'text-amber-700' : 'text-emerald-700'}">${esc(v.errors.length ? v.errors.join(', ') : v.dup || 'OK')}</td></tr>`).join('')}</tbody></table></div>
    ${rows.length > 50 ? `<p class="text-xs text-slate-400">Preview shows the first 50 rows; all ${rows.length} rows are validated.</p>` : ''}
    <button class="btn-primary" id="impbtn" ${ok.length && ready ? '' : 'disabled'} onclick="doImport()">Import ${ok.length} leads</button>${ready ? '' : '<p class="text-sm text-red-600">Map the Full Name and Mobile columns to continue.</p>'}</div>`;
}
async function doImport() {
  const b = $('#impbtn'); b.disabled = true; b.textContent = 'Importing…';
  try {
    const recs = impRows().filter((v) => !v.errors.length && (!IMP.skipDup || !v.dup)).map((v) => ({ ...v.rec, assigned_to: isAdmin() ? IMP.assignTo : ME.id }));
    for (let i = 0; i < recs.length; i += 200) { const { error } = await sb.from('leads').insert(recs.slice(i, i + 200)); if (error) throw error; }
    toast(`Imported ${recs.length} leads`); importPage();
  } catch (e) { toast('Import failed: ' + e.message, true); b.disabled = false; b.textContent = 'Retry import'; }
}

// ---------- users (admin) ----------
async function usersPage() {
  const { data } = await sb.from('profiles').select('*').order('created_at');
  main().innerHTML = `<div class="space-y-4"><h1 class="text-2xl font-extrabold text-navy-800">Users</h1>
    <div class="rounded-lg bg-navy-50 p-3 text-sm text-navy-800">To add a counsellor: Supabase Dashboard → Authentication → Users → Add user (or ask them to use "Create an account" on the login page). They appear here as Counsellor; promote to Admin if needed.</div>
    <div class="card overflow-x-auto"><table class="w-full"><thead class="border-b bg-slate-50"><tr><th class="th">Name</th><th class="th">Email</th><th class="th">Role</th><th class="th">Active</th></tr></thead><tbody>
    ${(data || []).map((u) => `<tr class="border-b border-slate-100"><td class="td"><input class="input !py-1" value="${esc(u.full_name || '')}" onchange="updUser('${u.id}',{full_name:this.value})"></td><td class="td">${esc(u.email)}</td>
      <td class="td"><select class="input !py-1" onchange="updUser('${u.id}',{role:this.value})"><option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option><option value="counsellor" ${u.role === 'counsellor' ? 'selected' : ''}>Counsellor</option></select></td>
      <td class="td"><input type="checkbox" ${u.active ? 'checked' : ''} onchange="updUser('${u.id}',{active:this.checked})"></td></tr>`).join('')}</tbody></table></div></div>`;
}
async function updUser(id, patch) {
  if (id === ME.id && (patch.role === 'counsellor' || patch.active === false)) { toast("You can't demote or deactivate yourself.", true); return usersPage(); }
  const { error } = await sb.from('profiles').update(patch).eq('id', id);
  if (error) toast(error.message, true); else toast('User updated');
  const p = await sb.from('profiles').select('id,full_name').eq('active', true).order('full_name'); PEOPLE = p.data || [];
  usersPage();
}

// ---------- start ----------
(async function boot() {
  if (!configured) {
    $('#app').innerHTML = `<div class="mx-auto mt-20 max-w-xl rounded-xl border border-amber-300 bg-amber-50 p-6 text-sm"><h1 class="mb-2 text-lg font-bold text-navy-800">Supabase is not connected yet</h1><p>Open <code>config.js</code>, paste your Supabase Project URL and anon key, save, and reload this page. See README.md.</p></div>`;
    return;
  }
  $('#app').innerHTML = spin();
  const hs = location.hash, fromMail = /[#&]type=(signup|invite|email_change)/.test(hs), mailErr = /[#&]error(_description)?=/.test(hs);
  if (fromMail || mailErr) {
    if (fromMail) { await sb.auth.getSession(); await sb.auth.signOut(); }
    history.replaceState(null, '', location.pathname + location.search);
    renderLogin('in');
    if (fromMail) toast('Email confirmed successfully. Please sign in.'); else toast('This confirmation link is invalid or has expired. Please sign in or create the account again.', true);
  } else { const { data } = await sb.auth.getSession(); await afterAuth(data.session); }
  sb.auth.onAuthStateChange((ev, s) => { if (!SUPPRESS_AUTH && (ev === 'SIGNED_IN' || ev === 'SIGNED_OUT')) setTimeout(() => afterAuth(s), 0); });
})();

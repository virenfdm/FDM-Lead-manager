// ---------- Campus Guide files (Google Drive project) ----------
const CF_KEY = 'fdm_campus_files_v1';
const CF_CATS = ['University brochure', 'Country guide', 'Training', 'Newsletter', 'Map', 'Other'];
const CF_KIND = {
  p: { n: 'PDF', g: 'from-rose-500 to-red-600', t: 'text-red-700', b: 'bg-red-50', i: 'M7 3h7l5 5v13H7zM14 3v5h5' },
  w: { n: 'Word', g: 'from-sky-500 to-blue-700', t: 'text-blue-700', b: 'bg-blue-50', i: 'M7 3h7l5 5v13H7zM14 3v5h5M9.5 13l1.2 5 1.3-4 1.3 4 1.2-5' },
  g: { n: 'Google Doc', g: 'from-teal-400 to-emerald-600', t: 'text-emerald-700', b: 'bg-emerald-50', i: 'M7 3h7l5 5v13H7zM14 3v5h5M10 13h6M10 17h6' },
  i: { n: 'Image', g: 'from-fuchsia-500 to-violet-600', t: 'text-violet-700', b: 'bg-violet-50', i: 'M4 5h16v14H4zM4 16l5-5 4 4 3-3 4 4M15 9h.01' },
};
const CF_SEED = [
  ['1YkTYAPbUZ6zYKr7pEoLsVoMWHWtyVmqsfzticYuuOJc', 'MCQ Assessment', 'g', 12709, 'Training'],
  ['1PGj1h-xC_sSniAjeaOr0OWQSHLOVD1x7', 'International exam guide.docx', 'w', 44432, 'Country guide'],
  ['1OkHrIH-OEyoVqJAQewigciUrLya4cCh0', 'Mumbai-Map.png', 'i', 2450711, 'Map'],
  ['1Z0tmQWNtM-2AXU7u2fxEtkwnlDV-HVTqllbBnCb1WUY', 'InterView_Q', 'g', 14977, 'Training'],
  ['1PCHvWsrUV909cFKbSmD7AfuR6op2gatL', 'Alliance.pdf', 'p', 4096678, 'University brochure'],
  ['14y_7uy7XKzxE7A5vuCqLCh_KtueZWfwo', 'placement-brochure-2025-26.pdf', 'p', 8183354, 'University brochure'],
  ['1IJjr1SygcScsxM0HFGfc5eLWZH-vmWNQB6Ct-NynmZY', 'Marketing related Certifications', 'g', 18920, 'Training'],
  ['1LKyeKcPOEvpi2bKVZr6QmyZF_57BpmA_', 'ASM Pune.pdf', 'p', 3857736, 'University brochure'],
  ['1u78BvsqmzOjjxoL_8RXa1gah_ejSYhBj', 'STUDYING IN UNITED KINGDOM 2025.docx', 'w', 75327, 'Country guide'],
  ['1qV_g-tg4c2nZZ8v-k-gDUcpq3TMpKIyz', 'Jaipuria-Admission-Brochure.pdf', 'p', 6063243, 'University brochure'],
  ['1-3OGOv_518M6FFFEmaTbqgFl0qSJ5m6j', 'STUDYING IN IRELAND 2025.docx', 'w', 347224, 'Country guide'],
  ['1rxf326T4gF4MLVa21W0JDbirZ1dXfm8k4FYyZPZQkNE', 'Sales Psychology', 'g', 11487, 'Training'],
  ['1NlZbyk9pxvnB4XXiBfKhrjju0gFY8nRu', 'woxsen university .pdf', 'p', 5422374, 'University brochure'],
  ['1bkoV6wWZQRI1YccpvI7SE7n30WTWcE8O', 'WOXSEN UNIVERSTIY.pdf', 'p', 5422374, 'University brochure'],
  ['16GZYt3jX5Sf8SfEY0uJ-Fzi8_CTiLeku', 'Career-Management-Brochure-2025-1.pdf', 'p', 8253686, 'University brochure'],
  ['17G2pylDN97BoVjapMVflWB1QVIC5t92b', 'atlas MBA Brochure (2).pdf', 'p', 2146548, 'University brochure'],
  ['1NA-Py2f7Zo2O92VqNr2R7px0_gVm67jY', 'atlas MBA Brochure (2) (1).pdf', 'p', 2146548, 'University brochure'],
  ['1F4DRgdpYJwiBi_jhYKFIEd6j4PtRAjZF', 'PGDM Booklet 2026-1.pdf', 'p', 14003149, 'University brochure'],
  ['1xfwHxE9tuhBI3CoJY_Fmq5w2bmoqpENX', 'PGDM Booklet 2026-1.pdf (copy)', 'p', 14003149, 'University brochure'],
  ['100pyDSd61fkBZgo0sUV2IfoBnwGTMYy9Z26qhtvup30', 'ITM - Mumbai', 'g', 102091, 'University brochure'],
  ['17SEgN2La7pEdUj_XRckUzxdbVbCTjR-v', 'WOXSEN UNIVERSTIY (1).pdf', 'p', 5422374, 'University brochure'],
  ['1N0bvdqpEmgQXozqqy7wXzdYe2avSOQun', 'woxsen fees.pdf', 'p', 273513, 'University brochure'],
  ['1oZG2hSmV9S13C3VhLyvaf3oBvUwBW5eu', 'FIIB brochure.pdf', 'p', 6734143, 'University brochure'],
  ['1JJyABQ92iHD3hpmeovlpVmJfH32excG1', 'atlas MBA Brochure (2).pdf (copy)', 'p', 2146548, 'University brochure'],
  ['1S-N7aZc5MSwSPD219KF_F25-riWuq18a_-9KrFR3G58', 'AI & Education', 'g', 37718, 'Training'],
  ['1LqgMA_wsAG3hJowwz2gXZjFAe3fc8YLp', 'PIBM-Prospectus-2026-28.pdf', 'p', 20475904, 'University brochure'],
  ['1r9u2e4aCF8KPZV_iFxIm_jrsW4j4FmE1', 'PIBM-Prospectus-2026-28 (2).pdf', 'p', 20475904, 'University brochure'],
  ['1V864smBmne0KNGk6Ke8RyZCknyDa7E9w', 'PIBM-Prospectus-2026-28 (1).pdf', 'p', 20475904, 'University brochure'],
  ['1MgpwrmU1dGJt1XZ5OnB-RtHIrQi7PldS', 'feb newslettter final.pdf', 'p', 1203499, 'Newsletter'],
  ['1UIfBojHOFP2dQgtM86Ci4eVK07ZYhHj2', 'August 2026 Newsletter .pdf', 'p', 1270836, 'Newsletter'],
].map(([id, title, kind, size, cat]) => ({ id, title, kind, size, cat, notes: '' }));

let CF = null, CFQ = { q: '', cat: '' };
const cfLoad = () => { if (CF) return CF; try { CF = JSON.parse(localStorage.getItem(CF_KEY)); } catch (e) { CF = null; } return (CF = Array.isArray(CF) ? CF : CF_SEED.map((x) => ({ ...x }))); };
const cfSave = () => { try { localStorage.setItem(CF_KEY, JSON.stringify(CF)); } catch (e) { toast('Could not save on this browser', true); } cfPush(); };

// ---------- Google Drive sync (index file: FDM-Campus-Guide-index.json) ----------
const CFD = { token: '', fileId: '', name: 'FDM-Campus-Guide-index.json' };
const cfApi = async (url, opt = {}) => {
  const r = await fetch(url, { ...opt, headers: { Authorization: 'Bearer ' + CFD.token, ...(opt.headers || {}) } });
  if (r.status === 401) { CFD.token = ''; throw new Error('Google session expired. Click "Connect Google Drive" again.'); }
  if (!r.ok) throw new Error('Google Drive error ' + r.status);
  return r;
};
async function cfPush() {
  if (!CFD.token || !CFD.fileId) return;
  try { await cfApi(`https://www.googleapis.com/upload/drive/v3/files/${CFD.fileId}?uploadType=media`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(CF) }); }
  catch (e) { toast(e.message, true); }
}
function cfDriveConnect() {
  const id = window.CAMPUS_GOOGLE_CLIENT_ID;
  if (!id) return modal('Connect Google Drive', `<ol class="list-decimal space-y-2 pl-5 text-sm text-slate-600"><li>Open Google Cloud Console, create a project and enable the <b>Google Drive API</b>.</li><li>Go to Credentials, create an <b>OAuth client ID</b> (Web application) and add your site address under Authorised JavaScript origins.</li><li>Copy the Client ID into <b>campus-config.js</b>, then reload this page.</li></ol><p class="mt-3 text-xs text-slate-500">The app only touches one file it creates itself (${CFD.name}). It cannot see the rest of your Drive.</p>`);
  if (!window.google || !google.accounts) return toast('Google sign-in did not load. Check your internet connection.', true);
  google.accounts.oauth2.initTokenClient({
    client_id: id, scope: 'https://www.googleapis.com/auth/drive.file',
    callback: async (t) => {
      if (!t.access_token) return toast('Google sign-in was cancelled', true);
      CFD.token = t.access_token;
      try {
        const q = encodeURIComponent(`name='${CFD.name}' and trashed=false`);
        const f = (await (await cfApi(`https://www.googleapis.com/drive/v3/files?q=${q}&fields=files(id)`)).json()).files || [];
        if (f.length) { CFD.fileId = f[0].id; const d = await (await cfApi(`https://www.googleapis.com/drive/v3/files/${CFD.fileId}?alt=media`)).json(); if (Array.isArray(d)) { CF = d; localStorage.setItem(CF_KEY, JSON.stringify(CF)); } }
        else {
          const b = '-fdm-', meta = JSON.stringify({ name: CFD.name, mimeType: 'application/json' });
          const body = `--${b}\r\nContent-Type: application/json\r\n\r\n${meta}\r\n--${b}\r\nContent-Type: application/json\r\n\r\n${JSON.stringify(cfLoad())}\r\n--${b}--`;
          CFD.fileId = (await (await cfApi('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart&fields=id', { method: 'POST', headers: { 'Content-Type': 'multipart/related; boundary=' + b }, body })).json()).id;
        }
        toast('Google Drive connected'); campusPage();
      } catch (e) { toast(e.message, true); }
    },
  }).requestAccessToken();
}
const cfSize = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');
const cfUrl = (f, mode) => f.kind === 'g' ? `https://docs.google.com/document/d/${f.id}/${mode === 'edit' ? 'edit' : 'preview'}` : `https://drive.google.com/file/d/${f.id}/${mode === 'edit' ? 'view' : 'preview'}`;
const cfId = (s) => { const m = String(s).match(/[-\w]{25,}/); return m ? m[0] : ''; };

function campusPage() {
  const list = cfLoad(), K = (f) => CF_KIND[f.kind] || CF_KIND.p;
  const q = CFQ.q.toLowerCase();
  const shown = list.filter((f) => (!CFQ.cat || f.cat === CFQ.cat) && (!q || (f.title + ' ' + f.notes + ' ' + f.cat).toLowerCase().includes(q)));
  const chip = (c, label) => `<button onclick="CFQ.cat='${c}';campusPage()" class="rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${CFQ.cat === c ? 'bg-white text-brand-600 shadow' : 'bg-white/15 text-white hover:bg-white/25'}">${label}</button>`;
  main().innerHTML = `
  <div class="overflow-hidden rounded-3xl bg-gradient-to-br from-brand-500 via-brand-600 to-navy-800 p-6 text-white shadow-xl md:p-8">
    <div class="flex flex-wrap items-start justify-between gap-4">
      <div><div class="text-xs font-semibold uppercase tracking-widest text-white/70">Google Drive project</div>
      <h1 class="font-display text-3xl font-extrabold md:text-4xl">Campus Guide</h1>
      <p class="mt-1 text-sm text-white/80">${list.length} files · brochures, guides, training material. Edit details, add notes, open or preview any file.</p></div>
      <div class="flex flex-wrap gap-2"><button class="btn bg-white/15 text-white hover:bg-white/25" onclick="cfDriveConnect()">${CFD.fileId ? '✓ Synced with Google Drive' : 'Connect Google Drive'}</button><button class="btn bg-white text-brand-600 hover:bg-navy-50" onclick="cfForm()">+ Add file</button></div>
    </div>
    <div class="mt-5 flex flex-wrap items-center gap-2">
      <input id="cfq" class="w-full rounded-full border-0 bg-white/95 px-4 py-2.5 text-sm text-navy-800 placeholder:text-slate-400 sm:w-72" placeholder="Search files…" value="${esc(CFQ.q)}">
      ${chip('', 'All')}${CF_CATS.map((c) => chip(c, c)).join('')}
    </div>
  </div>
  <div class="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
    ${shown.map((f) => { const k = K(f), i = list.indexOf(f); return `
    <div class="card group flex flex-col overflow-hidden rounded-3xl bg-white transition hover:-translate-y-1">
      <div class="flex items-center gap-3 bg-gradient-to-r ${k.g} p-4 text-white">
        <div class="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-white/20"><svg viewBox="0 0 24 24" class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="${k.i}"/></svg></div>
        <div class="min-w-0"><div class="text-xs font-semibold uppercase tracking-wider text-white/80">${k.n}</div><div class="text-sm font-semibold">${cfSize(f.size)}</div></div>
      </div>
      <div class="flex flex-1 flex-col p-4">
        <h3 class="font-display text-base font-semibold leading-snug text-navy-800 break-words">${esc(f.title)}</h3>
        <span class="mt-2 w-fit rounded-full ${k.b} px-2.5 py-1 text-xs font-semibold ${k.t}">${esc(f.cat || 'Other')}</span>
        <p class="mt-3 flex-1 text-sm text-slate-500">${f.notes ? esc(f.notes) : '<span class="italic text-slate-400">No notes yet</span>'}</p>
        <div class="mt-4 flex flex-wrap gap-2">
          <a class="btn-primary !px-3.5 !py-2 text-xs" href="${cfUrl(f, 'edit')}" target="_blank" rel="noopener">Open</a>
          <button class="btn-outline !px-3.5 !py-2 text-xs" onclick="cfPreview(${i})">Preview</button>
          <button class="btn-outline !px-3.5 !py-2 text-xs" onclick="cfForm(${i})">Edit</button>
          <button class="btn-outline !px-3.5 !py-2 text-xs text-red-600" onclick="cfDel(${i})">Remove</button>
        </div>
      </div>
    </div>`; }).join('') || '<div class="col-span-full rounded-3xl bg-white p-10 text-center text-slate-500">No files match your search.</div>'}
  </div>`;
  const s = $('#cfq'); s.oninput = () => { CFQ.q = s.value; const p = s.selectionStart; campusPage(); const n = $('#cfq'); n.focus(); n.setSelectionRange(p, p); };
}
function cfPreview(i) {
  const f = CF[i];
  modal(f.title, `<iframe src="${cfUrl(f)}" class="h-[65vh] w-full rounded-xl border border-navy-100"></iframe><p class="mt-2 text-xs text-slate-500">If the preview is blank, the file isn't shared with your Google account. Use Open instead.</p>`, true);
}
function cfForm(i) {
  const f = i === undefined ? { title: '', cat: 'University brochure', notes: '', kind: 'p', size: 0 } : CF[i];
  modal(i === undefined ? 'Add file' : 'Edit file', `<form id="cff" class="space-y-3">
    ${inp('title', 'Name', f.title, 'required', true)}
    ${i === undefined ? inp('link', 'Google Drive link or file ID', '', 'required placeholder="https://drive.google.com/file/d/…"', true) : ''}
    ${fld('Category', `<select class="input" name="cat">${CF_CATS.map((c) => `<option ${c === f.cat ? 'selected' : ''}>${c}</option>`).join('')}</select>`)}
    ${fld('Notes', `<textarea class="input" name="notes" rows="3">${esc(f.notes)}</textarea>`)}
    <div class="flex justify-end gap-2 pt-2"><button type="button" class="btn-outline" onclick="closeModal()">Cancel</button><button class="btn-primary">Save</button></div></form>`);
  $('#cff').onsubmit = (e) => {
    e.preventDefault(); const d = Object.fromEntries(new FormData(e.target));
    if (i === undefined) {
      const id = cfId(d.link); if (!id) return toast('Could not find a file ID in that link', true);
      const t = d.title.toLowerCase(), isDoc = /docs\.google\.com\/document/.test(d.link);
      CF.unshift({ id, title: d.title.trim(), cat: d.cat, notes: d.notes.trim(), size: 0, kind: isDoc ? 'g' : /\.(png|jpe?g|gif|webp)$/.test(t) ? 'i' : /\.docx?$/.test(t) ? 'w' : 'p' });
    } else Object.assign(CF[i], { title: d.title.trim(), cat: d.cat, notes: d.notes.trim() });
    cfSave(); closeModal(); campusPage(); toast('Saved');
  };
}
function cfDel(i) { confirmBox('Remove file', `Remove "${CF[i].title}" from Campus Guide? (The Google Drive file is not deleted.)`, () => { CF.splice(i, 1); cfSave(); campusPage(); }); }

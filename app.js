'use strict';

const $ = (selector, root = document) => root.querySelector(selector);
const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
$('#year').textContent = new Date().getFullYear();

// Navigation and tabs remain keyboard accessible.
const menu = $('.menu-toggle');
const nav = $('#main-nav');
function closeMenu() { menu.setAttribute('aria-expanded', 'false'); menu.setAttribute('aria-label', 'Open navigation'); nav.classList.remove('is-open'); }
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  menu.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
  nav.classList.toggle('is-open', open);
});
$$('a', nav).forEach(a => a.addEventListener('click', closeMenu));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && menu.getAttribute('aria-expanded') === 'true') { closeMenu(); menu.focus(); } });
window.matchMedia('(min-width: 651px)').addEventListener('change', e => { if (e.matches) closeMenu(); });

function wireTabs(buttons, onSelect) {
  buttons.forEach((button, index) => {
    button.addEventListener('click', () => {
      buttons.forEach(b => { b.setAttribute('aria-selected', String(b === button)); b.tabIndex = b === button ? 0 : -1; b.classList.toggle('active', b === button); });
      onSelect(button);
    });
    button.addEventListener('keydown', e => {
      let next;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = (index + 1) % buttons.length;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = (index - 1 + buttons.length) % buttons.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = buttons.length - 1;
      if (next !== undefined) { e.preventDefault(); buttons[next].focus(); buttons[next].click(); }
    });
  });
}
wireTabs($$('.service-tab'), button => {
  $$('.service-panel').forEach(panel => panel.hidden = panel.id !== `${button.dataset.service}-panel`);
});

if ('IntersectionObserver' in window && !reducedMotion) {
  const reveal = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) { entry.target.classList.add('is-visible'); reveal.unobserve(entry.target); }
  }), { threshold: .08 });
  $$('.reveal').forEach(el => { el.classList.add('is-ready'); reveal.observe(el); });
}

// All workbench content is illustrative and lives only in this tab.
const initialTasks = () => [
  { text: 'Gather the project information', owner: 'You', done: true },
  { text: 'Confirm the budget and next steps', owner: 'Team', done: false },
  { text: 'Review open actions', owner: 'You', done: false },
  { text: 'Prepare the weekly update', owner: 'Team', done: false }
];
let tasks = initialTasks();
let currentDemo = 'tracker';
let workflowTimer;
const demoContent = $('#demo-content');
const icons = { check: '<svg class="icon" aria-hidden="true"><use href="#check"/></svg>' };

function updateTracker() {
  const count = tasks.filter(t => t.done).length;
  $('#task-total').textContent = tasks.length;
  $('#task-done').textContent = count;
  $('#task-open').textContent = tasks.length - count;
  $('#task-progress').style.width = `${Math.round(count / tasks.length * 100)}%`;
  $('#tracker-progressbar').setAttribute('aria-valuenow', String(count));
  $('#tracker-progressbar').setAttribute('aria-valuemax', String(tasks.length));
}
function renderTaskRows() {
  const list = $('#task-list');
  list.replaceChildren();
  tasks.forEach((task, index) => {
    const label = document.createElement('label'); label.className = 'task-row';
    const input = document.createElement('input'); input.type = 'checkbox'; input.checked = task.done;
    input.setAttribute('aria-label', `Complete ${task.text}`);
    input.addEventListener('change', () => { task.done = input.checked; updateTracker(); });
    const text = document.createElement('span'); text.className = 'task-text'; text.textContent = task.text;
    const owner = document.createElement('span'); owner.className = 'task-owner'; owner.textContent = task.owner;
    label.append(input, text, owner); list.append(label);
  });
  updateTracker();
}
function renderTracker() {
  demoContent.innerHTML = `<div class="demo-title-row"><div><h3>A project, in focus.</h3><p>Try completing a task or adding your own.</p></div><span class="demo-label">EXAMPLE DATA</span></div><div class="tracker-summary"><div><strong id="task-total">4</strong><span>PROJECT ACTIONS</span></div><div><strong id="task-done">1</strong><span>COMPLETED</span></div><div><strong id="task-open">3</strong><span>STILL TO DO</span></div></div><div class="tracker-progress" id="tracker-progressbar" role="progressbar" aria-label="Example project completion" aria-valuemin="0" aria-valuemax="4" aria-valuenow="1"><span id="task-progress"></span></div><div id="task-list" class="tracker-list"></div><form class="demo-task-form" id="demo-task-form"><input id="new-task" aria-label="New example task" placeholder="Add an example task…" maxlength="70" required><button class="mini-button" type="submit">Add +</button></form><div class="demo-bottom"><span id="task-notice" role="status">An example, not a client project.</span><button class="demo-reset" id="reset-tracker">Reset example</button></div>`;
  renderTaskRows();
  $('#demo-task-form').addEventListener('submit', e => {
    e.preventDefault(); const input = $('#new-task'); const value = input.value.trim();
    if (!value) return;
    if (tasks.length >= 12) { $('#task-notice').textContent = 'Example limit reached. Reset to start again.'; return; }
    tasks.push({ text: value, owner: 'You', done: false }); renderTaskRows(); input.value = ''; input.focus();
    $('#task-notice').textContent = 'Task added. Changes stay in this tab.';
  });
  $('#reset-tracker').addEventListener('click', () => { tasks = initialTasks(); renderTaskRows(); $('#task-notice').textContent = 'Example reset.'; $('#new-task').value = ''; });
}
function renderWorkflow() {
  demoContent.innerHTML = `<div class="demo-title-row"><div><h3>Connect the repeat.</h3><p>A sample path from information to update.</p></div><span class="demo-label">SIMULATION</span></div><div class="workflow-stack"><div class="workflow-node"><span>01</span><div><strong>Collect the information</strong><small>Start with an agreed source or template.</small></div></div><div class="workflow-node"><span>02</span><div><strong>Organize & check</strong><small>Structure the data and flag what needs review.</small></div></div><div class="workflow-node"><span>03</span><div><strong>Prepare a useful update</strong><small>Create a consistent summary for a person to review.</small></div></div></div><button class="mini-button" id="run-workflow">Run the example →</button><p class="workflow-status" id="workflow-status" role="status" aria-live="polite">See the sequence. No files or external systems are connected.</p>`;
  $('#run-workflow').addEventListener('click', () => {
    const button = $('#run-workflow'); const nodes = $$('.workflow-node');
    nodes.forEach(n => n.classList.remove('running', 'complete')); button.disabled = true;
    const messages = ['Collecting the example information…', 'Organizing the example data…', 'Preparing the example summary…'];
    let step = 0;
    function advance() {
      if (currentDemo !== 'workflow') return;
      nodes.forEach((node, i) => { node.classList.toggle('running', i === step); node.classList.toggle('complete', i < step); });
      if (step < 3) { $('#workflow-status').textContent = messages[step]; step++; workflowTimer = window.setTimeout(advance, reducedMotion ? 150 : 700); }
      else { $('#workflow-status').textContent = 'Example complete. The summary is ready for human review. A real workflow would be scoped to your tools.'; button.disabled = false; button.textContent = 'Run it again ↻'; }
    }
    advance();
  });
}
function renderChecklist() {
  demoContent.innerHTML = `<div class="demo-title-row"><div><h3>A calmer home office.</h3><p>Small checks. A clearer starting point.</p></div><span class="demo-label">TRY A CHECKLIST</span></div><div class="checklist"><label class="checklist-row"><input type="checkbox"><span><strong>Write down the symptom</strong><small>What happens, on which device, and when?</small></span></label><label class="checklist-row"><input type="checkbox"><span><strong>Check the connections</strong><small>Power, cables, and the expected Wi-Fi network.</small></span></label><label class="checklist-row"><input type="checkbox"><span><strong>Know your backup status</strong><small>Confirm important files are backed up before changes.</small></span></label><label class="checklist-row"><input type="checkbox"><span><strong>Choose the next step</strong><small>Explain the issue before changing settings or buying equipment.</small></span></label></div><p class="checklist-status" id="checklist-status" role="status" aria-live="polite">0 of 4 checked. This checklist does not diagnose or scan your device.</p><div class="demo-bottom"><span>Only check items you have actually reviewed.</span><button class="demo-reset" id="reset-checklist">Reset</button></div>`;
  const boxes = $$('.checklist-row input');
  const update = () => { const count = boxes.filter(b => b.checked).length; $('#checklist-status').textContent = `${count} of 4 checked. ${count === 4 ? 'You have a useful starting point for a conversation.' : 'This checklist does not diagnose or scan your device.'}`; };
  boxes.forEach(b => b.addEventListener('change', update));
  $('#reset-checklist').addEventListener('click', () => { boxes.forEach(b => b.checked = false); update(); });
}
wireTabs($$('.demo-tab'), button => {
  window.clearTimeout(workflowTimer); currentDemo = button.dataset.demo;
  demoContent.setAttribute('aria-labelledby', button.id);
  ({ tracker: renderTracker, workflow: renderWorkflow, checklist: renderChecklist })[currentDemo]();
});
renderTracker();

// This is a draft builder, not a server-side submission form.
const brief = $('#brief-dialog');
const privacy = $('#privacy-dialog');
let lastDialogTrigger;
function openDialog(dialog, trigger) { lastDialogTrigger = trigger; dialog.showModal(); document.body.classList.add('dialog-open'); }
$$('[data-open-brief]').forEach(trigger => trigger.addEventListener('click', () => {
  if (trigger.dataset.topic) $('#inquiry-topic').value = trigger.dataset.topic;
  $('#brief-status').textContent = ''; $('#brief-fallback').hidden = true;
  openDialog(brief, trigger);
}));
$('#privacy-open').addEventListener('click', e => openDialog(privacy, e.currentTarget));
$$('[data-close-dialog]').forEach(button => button.addEventListener('click', () => button.closest('dialog').close()));
[brief, privacy].forEach(dialog => {
  dialog.addEventListener('close', () => { document.body.classList.remove('dialog-open'); lastDialogTrigger?.focus(); });
  dialog.addEventListener('click', e => { if (e.target === dialog) { const bounds = dialog.getBoundingClientRect(); if (e.clientX < bounds.left || e.clientX > bounds.right || e.clientY < bounds.top || e.clientY > bounds.bottom) dialog.close(); } });
});
function inquiryText() {
  const form = $('#brief-form'); const data = new FormData(form);
  return `Hello Gheiath,\n\nI’m interested in: ${data.get('topic')}\n${data.get('name').trim() ? `Name: ${data.get('name').trim()}\n` : ''}Preferred way to talk: ${data.get('mode')}\n\nHere’s what I have in mind:\n${data.get('message').trim()}\n\nSent from the AcornByte website inquiry builder.`;
}
$('#brief-form').addEventListener('submit', e => {
  e.preventDefault(); if (!e.currentTarget.reportValidity()) return;
  const subject = `AcornByte inquiry: ${$('#inquiry-topic').value}`;
  const url = `mailto:ewaisg@acornbyte.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(inquiryText())}`;
  $('#brief-status').textContent = 'Your email app has been requested. Review and send the draft there. If it doesn’t open, use “Copy inquiry” and email ewaisg@acornbyte.com. Nothing has been sent by this site.';
  const link = document.createElement('a'); link.href = url; link.click();
});
$('#copy-brief').addEventListener('click', async () => {
  if (!$('#brief-form').reportValidity()) return;
  const text = inquiryText();
  try { if (!navigator.clipboard) throw new Error('Clipboard unavailable'); await navigator.clipboard.writeText(text); $('#brief-status').textContent = 'Inquiry copied. Paste it into an email to ewaisg@acornbyte.com and send when you’re ready.'; }
  catch { $('#brief-fallback').hidden = false; $('#brief-output').value = text; $('#brief-output').focus(); $('#brief-output').select(); $('#brief-status').textContent = 'Automatic copying is unavailable. Copy the selected inquiry below, then email it to ewaisg@acornbyte.com.'; }
});

// Deep-link the secondary service track without hiding the business offering.
$$('[data-local-help]').forEach(link => link.addEventListener('click', () => $('#tech-tab').click()));

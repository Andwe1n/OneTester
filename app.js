const icons = {
  hardware:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 1v3m6-3v3M9 20v3m6-3v3M1 9h3m-3 6h3m16-6h3m-3 6h3"/><rect x="9" y="9" width="6" height="6" rx="1"/>',
  sequence:'<rect x="3" y="3" width="6" height="6" rx="1.5"/><rect x="15" y="15" width="6" height="6" rx="1.5"/><path d="M6 9v7a2 2 0 0 0 2 2h7M9 6h7a2 2 0 0 1 2 2v3m-3-3 3 3 3-3"/>',
  tuning:'<path d="M3 18V6m0 12h18M6 14c3 0 3-7 6-7s3 7 6 7h3"/>',
  trajectory:'<circle cx="5" cy="18" r="2"/><circle cx="19" cy="6" r="2"/><path d="M5 16V9a4 4 0 0 1 8 0v6a3 3 0 0 0 6 0V8"/>',
  runs:'<path d="M5 3h10l4 4v14H5zM14 3v5h5M8 12h8m-8 4h5"/>',
  robot:'<rect x="4" y="5" width="16" height="14" rx="3"/><path d="M9 5V2m6 3V2M1 10h3m16 0h3M8 19v3m8-3v3M8 14h8"/><path d="M8 9h1m6 0h1" stroke-width="3"/>',
  chevron:'<path d="m9 5 7 7-7 7"/>',down:'<path d="m7 10 5 5 5-5"/>',
  search:'<circle cx="10.5" cy="10.5" r="6.5"/><path d="m16 16 4.5 4.5"/>',
  plug:'<path d="m8 3 1 4m7-4-1 4M6 7h12v3a6 6 0 0 1-12 0zM12 16v5"/>',
  stop:'<rect x="6" y="6" width="12" height="12" rx="2"/>',
  plus:'<path d="M12 5v14M5 12h14"/>',
  refresh:'<path d="M20 7v5h-5M4 17v-5h5"/><path d="M6 6a8 8 0 0 1 13 3M5 15a8 8 0 0 0 13 3"/>',
  servo:'<rect x="5" y="8" width="14" height="12" rx="2"/><path d="M3 12h2m14 0h2M12 8V3M8 3h8"/><circle cx="12" cy="13" r="2"/>',
  motor:'<rect x="5" y="5" width="14" height="14" rx="4"/><circle cx="12" cy="12" r="3"/><path d="M12 1v4m0 14v4M1 9h4m14 6h4"/>',
  sensor:'<path d="M9 8a6 6 0 0 1 0 8M5 4a11 11 0 0 1 0 16M16 10a3 3 0 0 1 0 4"/><circle cx="20" cy="12" r="1"/>',
  imu:'<circle cx="12" cy="12" r="8"/><path d="m15 9-2 4-4 2 2-4zM12 1v3m0 16v3M1 12h3m16 0h3"/>',
  more:'<circle cx="5" cy="12" r="1"/><circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/>',
  save:'<path d="M4 3h14l3 3v15H3V3zM7 3v6h10V3M7 21v-8h10v8"/>',
  check:'<path d="m5 12 4 4L19 6"/>',
  arrow:'<path d="M4 12h16m-5-5 5 5-5 5"/>',
  play:'<path d="m8 4 12 8-12 8z"/>',
  clock:'<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>',
  shield:'<path d="m12 3 8 3v6c0 5-8 9-8 9s-8-4-8-9V6z"/><path d="m8 12 3 3 5-6"/>',
  sliders:'<path d="M5 3v8m0 4v6m7-18v3m0 4v11m7-18v11m0 4v3"/><rect x="2" y="11" width="6" height="4" rx="1"/><rect x="9" y="6" width="6" height="4" rx="1"/><rect x="16" y="14" width="6" height="4" rx="1"/>',
  export:'<path d="M12 15V3m-4 4 4-4 4 4M5 13v7h14v-7"/>',
  help:'<circle cx="12" cy="12" r="9"/><path d="M9 9a3 3 0 0 1 6 0c0 2-3 2-3 4m0 3h.01"/>',
  gear:'<path d="m9 3-1 3-3 1 1 3-2 2 2 2-1 3 3 1 1 3h6l1-3 3-1-1-3 2-2-2-2 1-3-3-1-1-3z"/><circle cx="12" cy="12" r="3"/>',
  close:'<path d="m6 6 12 12M6 18 18 6"/>',
  cursor:'<path d="m5 3 14 10-7 1-3 7z"/>',
  waypoint:'<path d="M19 10c0 5-7 11-7 11S5 15 5 10a7 7 0 0 1 14 0"/><circle cx="12" cy="10" r="2"/>',
  trash:'<path d="M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7"/>',
  copy:'<rect x="8" y="8" width="12" height="13" rx="2"/><path d="M16 8V3H3v13h5"/>',
  bolt:'<path d="m13 2-9 12h7l-1 8 10-13h-7z"/>',
  book:'<path d="M12 5C9 2 4 3 2 4v15c4-2 7-1 10 1 3-2 6-3 10-1V4c-2-1-7-2-10 1zm0 0v15"/>',
};
const icon = (name, cls = '') => `<svg class="icon ${cls}" viewBox="0 0 24 24" aria-hidden="true">${icons[name] || icons.hardware}</svg>`;
const escapeHTML = value => String(value).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp = (value,min,max) => Math.max(min,Math.min(max,value));
const devices = [
  {id:'wrist',name:'Wrist servo',detail:'Positional servo',type:'servo',port:'Servo 0',model:'REV Smart Robot Servo',value:.52,min:.05,max:.95,direction:'Forward'},
  {id:'claw',name:'Claw servo',detail:'Positional servo',type:'servo',port:'Servo 1',model:'Positional PWM servo',value:.18,min:.05,max:.95,direction:'Forward'},
  {id:'intake',name:'Intake roller',detail:'Continuous rotation',type:'crservo',port:'Servo 2',model:'Continuous-rotation servo',value:0,min:-1,max:1,direction:'Forward'},
  {id:'front_left',name:'Front left',detail:'Drive motor',type:'motor',port:'Motor 0',model:'goBILDA 5203 · 312 RPM',value:0,min:-1,max:1,direction:'Forward'},
  {id:'front_right',name:'Front right',detail:'Drive motor',type:'motor',port:'Motor 1',model:'goBILDA 5203 · 312 RPM',value:0,min:-1,max:1,direction:'Reverse'},
  {id:'lift',name:'Lift motor',detail:'Motor with encoder',type:'motor',port:'Motor 2',model:'REV HD Hex · 20:1',value:0,min:-1,max:1,direction:'Forward'},
  {id:'distance',name:'Front distance',detail:'Distance sensor',type:'sensor',port:'I²C 0',model:'REV 2m Distance Sensor',value:248},
  {id:'imu',name:'Hub IMU',detail:'Inertial measurement',type:'imu',port:'Built-in',model:'Control Hub IMU',value:0},
];
let saved = {};
try { saved = JSON.parse(localStorage.getItem('onetester-demo') || '{}'); } catch {}
for (const d of devices) {
  const config = saved.devices?.[d.id];
  if (config && ['servo','motor','crservo'].includes(d.type)) {
    if(d.type==='servo'&&Number.isFinite(config.min)&&Number.isFinite(config.max)&&config.min>=0&&config.max<=1&&config.min<config.max){d.min=config.min;d.max=config.max;}
    if(d.type==='servo'&&Number.isFinite(config.value)) d.value=clamp(config.value,d.min,d.max);
    if(['Forward','Reverse'].includes(config.direction)) d.direction=config.direction;
  }
}
const titles = {hardware:'Hardware',sequences:'Sequences',pid:'PID tuner',trajectories:'Trajectories',runs:'Test runs',profiles:'Robot profiles'};
const state = {
  view:'hardware',selected:'wrist',filter:'all',query:'',tab:'configuration',motorMode:'power',saved:true,configDrafts:{},configErrors:{},
  presets:{wrist:[{name:'Stowed',value:.10},{name:'Ready',value:.52},{name:'Deployed',value:.90}],claw:[{name:'Open',value:.18},{name:'Hold',value:.50},{name:'Closed',value:.76}]},
  activity:[{label:'Demo profile loaded',value:'8 devices',time:'Just now'}],
  sequence:[{device:'wrist',value:.90,wait:0},{device:'wait',value:400,wait:400},{device:'claw',value:.76,wait:0},{device:'wrist',value:.10,wait:0}],
  sequenceName:'Score & retract',sequenceRunning:false,sequenceStep:-1,
  gains:{p:.014,i:0,d:.0006,target:900},pidRunning:false,
  runs:[{name:'Lift · position response',type:'PID tuning',p:.014,i:0,d:.0006,date:'Demo recording',settle:.92,overshoot:5.8},{name:'Wrist · deploy cycle',type:'Sequence',date:'Demo recording',duration:1.6},{name:'Lift · baseline response',type:'PID tuning',p:.01,i:0,d:.0001,date:'Demo recording',settle:1.28,overshoot:13.2}],
  waypoint:1,fieldTool:'select',trajectoryRunning:false,
  waypoints:[{name:'Start position',x:-48,y:-48,heading:90},{name:'Approach',x:-24,y:12,heading:45},{name:'Score',x:36,y:36,heading:0},{name:'Park',x:48,y:-12,heading:-90}],
};
if (saved.presets && !Array.isArray(saved.presets)) {
  for (const id of ['wrist','claw']) {
    const list=saved.presets[id];
    if(Array.isArray(list)&&list.length<=6&&list.every(p=>typeof p.name==='string'&&Number.isFinite(p.value)&&p.value>=0&&p.value<=1)) state.presets[id]=list;
  }
}
const currentPresets=()=>state.presets[state.selected]||[];
const stepDuration=step=>step.device==='wait'?step.value:600;
let sequenceTimer, pidTimer, trajectoryTimer, toastTimer;
const currentDevice = () => devices.find(d=>d.id===state.selected);
const isServo = d => ['servo','crservo'].includes(d.type);
const deviceIcon = d => isServo(d)?'servo':d.type==='motor'?'motor':d.type==='imu'?'imu':'sensor';
const btn = (text,action,style='',ico='') => `<button class="btn ${style}" data-action="${action}">${ico?icon(ico):''}${text}</button>`;
function notify(message){
  const toast=document.getElementById('toast'); toast.textContent=message;toast.classList.add('visible');
  clearTimeout(toastTimer);toastTimer=setTimeout(()=>toast.classList.remove('visible'),3400);
}
function log(label,value=''){
  state.activity.unshift({label,value,time:new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})});
  state.activity=state.activity.slice(0,30);
}
function saveWorkspace(){
  try {
    localStorage.setItem('onetester-demo',JSON.stringify({devices:Object.fromEntries(devices.filter(d=>['servo','motor','crservo'].includes(d.type)).map(d=>[d.id,{...(d.type==='servo'?{value:d.value,min:d.min,max:d.max}:{}),direction:d.direction}])),presets:state.presets}));
    state.saved=true;notify('Demo configuration saved on this device.');return true;
  } catch {notify('Browser storage is unavailable. Export your profile to keep it.');return false;}
}
function navItem(view,label,ico){
  return `<button class="nav-item ${state.view===view?'active':''}" data-view="${view}" data-label="${label}" title="${label}" aria-label="${label}" ${state.view===view?'aria-current="page"':''}>${icon(ico)}<span class="nav-text">${label}</span></button>`;
}
function render(){
  document.getElementById('app').innerHTML=`<div class="app-shell">
    <aside class="sidebar" aria-label="Main navigation">
      <button class="brand" data-action="guide" aria-label="About OneTester" title="OneTester"><svg viewBox="0 0 34 40" fill="none" aria-hidden="true"><path d="m5 10 9-5v29l-9-7zM20 5l9 5v17l-9 7z" fill="currentColor"/><path d="M14 16h6v7h-6z" fill="currentColor"/></svg><span>OneTester<span class="brand-period">.</span></span></button>
      <span class="navigation-label">WORKSPACE</span><nav class="nav-group">${navItem('hardware','Hardware','hardware')}${navItem('sequences','Sequences','sequence')}${navItem('pid','PID tuner','tuning')}${navItem('trajectories','Trajectories','trajectory')}</nav>
      <span class="navigation-label">LIBRARY</span><nav class="nav-group nav-library">${navItem('runs','Test runs','runs')}${navItem('profiles','Robot profiles','robot')}</nav>
      <div class="sidebar-bottom"><button class="nav-item" data-action="shortcuts" data-label="Help & shortcuts" aria-label="Keyboard shortcuts" title="Keyboard shortcuts">${icon('help')}</button><span class="rail-version">PREVIEW / 0.3</span></div>
    </aside>
    <div class="workspace"><header class="topbar"><div class="header-title"><h1>${titles[state.view]}</h1><span class="header-product">Configure. Test. Refine.</span></div><div class="top-actions"><span class="demo-pill"><i class="status-dot"></i>Demo mode</span><button class="profile-switch" data-view="profiles">Practice robot ${icon('down')}</button>${btn('Connect robot','connect','','plug')}${btn('Stop all','stop','danger','stop')}<button class="avatar" data-view="profiles" aria-label="Robot profiles">OT</button></div></header>
      <main class="main view-enter ${state.view==='hardware'?'hardware-main':''}">${renderView()}<footer class="workspace-footer"><span class="footer-status"><i class="status-dot"></i>Simulation workspace <span>·</span> No robot connected</span><span>OneTester <span class="mono">0.3</span><button data-action="shortcuts" title="Keyboard shortcuts"><kbd>?</kbd></button></span></footer></main>
    </div></div>`;
}
function pageHeading(title,description,actions=''){
  return `<div class="page-heading"><div><h1>${title}</h1><p>${description}</p></div><div class="heading-actions">${actions}</div></div>`;
}
function renderView(){
  if(state.view==='hardware')return renderHardware();
  if(state.view==='sequences')return renderSequences();
  if(state.view==='pid')return renderPID();
  if(state.view==='trajectories')return renderTrajectories();
  if(state.view==='runs')return renderRuns();
  return renderProfiles();
}
function renderHardware(){
  return `<div class="settings-intro"><span>Device configuration</span><p>Set up your hardware, then test each change.</p><button class="text-link" data-action="export-profile">${icon('export')}Export profile</button></div><div class="hardware-grid">
    <section class="device-library panel" aria-label="Robot devices">
      <div class="device-library-heading"><h2>Devices <span>8</span></h2><button class="icon-button" data-action="scan" aria-label="Scan devices" title="Scan devices">${icon('refresh')}</button><button class="icon-button" data-action="add-device" aria-label="Add device" title="Add device">${icon('plus')}</button></div>
      <div class="device-search">${icon('search')}<input id="device-search" aria-label="Search devices" placeholder="Find a device…" value="${escapeHTML(state.query)}"><kbd>/</kbd></div>
      <div class="device-filters" role="group" aria-label="Filter devices">${[['all','All'],['motor','Motors'],['servo','Servos'],['sensor','Sensors']].map(([id,name])=>`<button data-filter="${id}" class="${state.filter===id?'active':''}" aria-pressed="${state.filter===id}">${name}</button>`).join('')}</div>
      <div class="device-group-label">${icon('hardware')}CONTROL HUB <span>DEMO</span></div><div class="device-list" id="device-list">${renderDeviceList()}</div>
      <button class="device-map-link" data-action="hardware-map">${icon('hardware')}View port map ${icon('arrow')}</button>
    </section><div class="device-workspace">${renderDeviceDetail()}</div></div>`;
}
function renderDeviceList(){
  const filtered=devices.filter(d=>!state.query||`${d.name} ${d.detail} ${d.port}`.toLowerCase().includes(state.query.toLowerCase())).filter(d=>state.filter==='all'||(state.filter==='servo'?isServo(d):state.filter==='sensor'?['sensor','imu'].includes(d.type):d.type===state.filter));
  return filtered.length?filtered.map(d=>`<button class="device-row ${state.selected===d.id?'selected':''}" data-device="${d.id}" aria-pressed="${state.selected===d.id}" aria-label="${d.name}, ${d.detail}, ${d.port}"><span class="device-icon">${icon(deviceIcon(d))}</span><span class="device-row-text"><span class="device-name">${d.name}</span><span class="device-meta">${d.detail}</span></span><span class="device-port">${d.port}${configDirty(d)?'<i class="draft-dot" title="Unsaved settings"></i>':''}</span></button>`).join(''):'<div class="empty-state">No matching devices.<br>Try another name or filter.</div>';
}
function configValues(d){return {min:d.min?.toFixed(2)??'',max:d.max?.toFixed(2)??'',direction:d.direction??'Forward'};}
function configDraft(d){return state.configDrafts[d.id]||configValues(d);}
function configDirty(d){return JSON.stringify(configDraft(d))!==JSON.stringify(configValues(d));}
function updateConfigDraft(el){
  const d=currentDevice();state.configDrafts[d.id]={...configDraft(d),[el.dataset.configField]:el.value};delete state.configErrors[d.id];
  const dirty=configDirty(d),label=document.getElementById('saved-label');if(label)label.textContent=dirty?'Unsaved changes':'No unsaved changes';
  document.querySelectorAll('[data-action="save"],[data-action="revert-settings"]').forEach(button=>button.disabled=!dirty);
  const error=document.getElementById('config-error');if(error)error.textContent='';
  document.getElementById('device-list').innerHTML=renderDeviceList();
}
function saveConfiguration(){
  const d=currentDevice(),draft=configDraft(d),before={...d};
  if(d.type==='servo'){
    const min=draft.min.trim()===''?NaN:Number(draft.min),max=draft.max.trim()===''?NaN:Number(draft.max);
    if(!Number.isFinite(min)||!Number.isFinite(max)||min<0||max>1||min>=max){state.configErrors[d.id]='Enter both limits between 0 and 1. Minimum must be lower than maximum.';render();document.getElementById('config-min').focus();return;}
    d.min=min;d.max=max;d.value=clamp(d.value,min,max);
  }
  if(d.direction)d.direction=draft.direction;
  if(saveWorkspace()){delete state.configDrafts[d.id];delete state.configErrors[d.id];log('Settings saved',d.name);}else Object.assign(d,before);
  render();
}
function renderDeviceDetail(){
  const d=currentDevice(),settings=state.tab==='configuration',test=state.tab==='control',dirty=configDirty(d),editable=['servo','motor','crservo'].includes(d.type);
  return `<section class="panel device-detail"><div class="device-detail-head"><div class="detail-title-line"><div><div class="port-path">CONTROL HUB <span>/</span> ${d.port.toUpperCase()}</div><div class="detail-title"><h2>${d.name}</h2><span class="tag">${d.detail}</span></div><p class="device-subtitle">${settings?'Configuration for this device in Practice robot.':test?'Send a test command using the saved device settings.':'Recent commands and configuration changes.'}</p></div><button class="icon-button" title="Device information" data-action="device-info">${icon('help')}</button></div><div class="tabs" role="tablist" aria-label="Device settings">${[['configuration','Settings','gear'],['control','Quick test','sliders'],['activity','Activity','clock']].map(([id,title,ico])=>`<button role="tab" aria-selected="${state.tab===id}" class="tab ${state.tab===id?'active':''}" data-tab="${id}">${icon(ico)}${title}</button>`).join('')}</div></div>
    <div class="control-body ${settings?'configuration-body':'test-body'}">${settings?renderConfiguration(d):state.tab==='activity'?renderActivity():`${dirty?'<div class="draft-notice">You have unsaved settings. Quick test uses the saved configuration.</div>':''}${d.type==='servo'?renderServo(d):d.type==='crservo'||d.type==='motor'?renderMotor(d):renderSensor(d)}`}</div>
    ${state.tab==='activity'?'':`<div class="detail-footer"><span class="save-label">${icon(settings?'save':'shield')}<span id="saved-label">${settings?(dirty?'Unsaved changes':'No unsaved changes'):'Simulation only · no robot connected'}</span></span><div class="detail-footer-actions">${settings&&editable?`<button class="btn" data-action="revert-settings" ${dirty?'':'disabled'}>Revert</button><button class="btn primary" data-action="save" ${dirty?'':'disabled'}>${icon('save')}Save changes</button>`:test?`<button class="btn" data-tab="configuration">${icon('gear')}Device settings</button>${isServo(d)?btn('Add to sequence','to-sequence','primary','sequence'):''}`:''}</div></div>`}</section>`;
}
function renderServo(d){
  return `<div class="value-label">Commanded position <span class="info-icon" title="The last position command. A standard servo does not report its actual shaft position.">i</span></div><div class="test-value-row"><div class="large-value" id="position-readout">${d.value.toFixed(2)}<span class="value-unit">pos</span></div><span class="test-value-caption">Normalized command<br>Range ${d.min.toFixed(2)} — ${d.max.toFixed(2)}</span></div>
    <div class="range-wrap"><div class="range-ends"><span>Position</span><span>${d.min.toFixed(2)} — ${d.max.toFixed(2)}</span></div><input type="range" id="position-slider" aria-label="Commanded servo position" min="${d.min}" max="${d.max}" step=".01" value="${d.value}"></div>
    <div class="nudge-controls"><button data-action="nudge-down" aria-label="Decrease position by 0.01">−</button><div class="unit-input"><input class="number-input" id="position-input" type="number" aria-label="Exact servo position" min="${d.min}" max="${d.max}" step=".01" value="${d.value.toFixed(2)}"><span>pos</span></div><button data-action="nudge-up" aria-label="Increase position by 0.01">+</button></div>
    <div class="preset-section"><div class="section-label">Saved positions<button class="text-link" data-action="new-preset" aria-label="Save current position">${icon('plus')}Save</button></div><div class="preset-grid">${currentPresets().map((p,i)=>`<button class="preset ${Math.abs(p.value-d.value)<.005?'selected':''}" data-preset="${i}" ${p.value<d.min||p.value>d.max?'disabled title="Outside the saved operating range"':''}><span>${escapeHTML(p.name)}</span><span class="preset-value">${Number(p.value).toFixed(2)}</span></button>`).join('')}</div></div>
    <div class="note-inline">${icon('shield')}Command only. No measured shaft feedback.</div>`;
}

function renderMotor(d){
  const motor=d.type==='motor',mode=state.motorMode,powerMode=!motor||mode==='power';
  const unit=powerMode?'%':mode==='velocity'?'ticks/s':'ticks';
  const v=powerMode?d.value*100:(d.target||0),min=powerMode?-100:mode==='velocity'?-1500:-3000,max=-min;
  return `${motor?`<div class="control-mode" role="group" aria-label="Motor control mode">${[['power','Power'],['velocity','Velocity'],['position','Position']].map(([key,label])=>`<button data-motor-mode="${key}" class="${mode===key?'active':''}">${label}</button>`).join('')}</div>`:''}
    <div class="value-label">${powerMode?'Commanded power':mode==='velocity'?'Target velocity':'Target position'}</div>
    <div class="test-value-row"><div class="large-value" id="motor-readout">${Math.round(v)}<span class="value-unit">${unit}</span></div><span class="test-value-caption">${powerMode?'Zero is neutral.':'Encoder control'}<br>Simulated command</span></div>
    <div class="range-wrap"><div class="range-ends"><span>${powerMode?'Power':'Target'}</span><span>${min} — ${max} ${unit}</span></div><input type="range" id="motor-slider" aria-label="${powerMode?'Motor power':mode==='velocity'?'Target velocity':'Target position'}" min="${min}" max="${max}" step="${powerMode?1:10}" value="${v}"></div>
    <div class="motor-actions">${btn('Zero output','zero','small-btn','stop')}${motor?btn('Tune PID','goto-pid','ghost small-btn','tuning'):''}</div>
    <div class="readout-row"><div class="readout"><span>${motor?'SIMULATED VELOCITY':'COMMANDED POWER'}</span><strong id="motor-speed">${motor?Math.round(d.value*1050):Math.round(d.value*100)}</strong><small>${motor?'ticks/s':'%'}</small></div><div class="readout"><span>${motor?'SIMULATED CURRENT':'DIRECTION'}</span><strong id="motor-current">${motor?(Math.abs(d.value)*2.1).toFixed(2):d.value===0?'Stop':d.value>0?'CW':'CCW'}</strong><small>${motor?'A':''}</small></div><div class="readout"><span>${motor?'ZERO POWER':'FEEDBACK'}</span><strong style="font-family:var(--sans);font-size:13px">${motor?'Brake':'Unavailable'}</strong></div></div>
    <div class="note-inline">${icon('shield')}${motor?'Simulated data. No motor is connected.':'CR servos control power and direction, not angular position.'}</div>`;
}
function renderSensor(d){
  const imu=d.type==='imu';
  return `<div class="sensor-reading">${icon(imu?'imu':'sensor')}<div class="value-label" style="justify-content:center;margin-top:17px">${imu?'Simulated heading':'Simulated distance'}</div><div class="large-value">${imu?'0.0':'248'}<span class="value-unit">${imu?'deg':'mm'}</span></div><div class="sensor-metrics">${imu?'<span>Pitch <strong>0.2°</strong></span><span>Roll <strong>−0.1°</strong></span>':'<span>Range <strong>20–2000 mm</strong></span><span>Interface <strong>I²C</strong></span>'}</div></div><div class="config-info" style="margin-top:20px">${imu?'IMU orientation and calibration belong to the robot profile. A future connected view will show heading, angular velocity, and reset controls.':'A sensor workspace brings readings, supported units, and configuration together. This is a static demo reading; live sampling requires a robot connection.'}</div>`;
}
function renderConfiguration(d){
  const draft=configDraft(d),servo=d.type==='servo',actuator=['servo','motor','crservo'].includes(d.type);
  const row=(title,description,field)=>`<div class="settings-row"><div class="setting-description"><h4>${title}</h4><p>${description}</p></div><div class="setting-value">${field}</div></div>`;
  return `<div class="settings-layout"><div class="settings-form"><section class="settings-section"><div class="settings-section-title">${icon('hardware')}<h3>General</h3></div>
    ${row('Device name','Configured in your robot profile.',`<span class="readonly-value">${d.name}</span>`)}
    ${row('Connection','Hub and port assignment.',`<span class="readonly-value">Control Hub <span class="setting-separator">/</span> ${d.port}</span>`)}
    </section>
    ${servo?`<section class="settings-section"><div class="settings-section-title">${icon('sliders')}<h3>Operating limits</h3><span class="section-unit">POSITION · 0–1</span></div><div class="settings-row limits-row"><div class="setting-description"><h4>Position range</h4><p>Keep commands within your mechanism’s usable travel.</p></div><div class="setting-value range-fields"><div class="field"><label for="config-min">Minimum</label><input id="config-min" data-config-field="min" type="number" min="0" max="1" step=".01" required value="${escapeHTML(draft.min)}" aria-describedby="config-error"></div><span>—</span><div class="field"><label for="config-max">Maximum</label><input id="config-max" data-config-field="max" type="number" min="0" max="1" step=".01" required value="${escapeHTML(draft.max)}" aria-describedby="config-error"></div></div></div><p class="setting-footnote">Values are normalized SDK positions, not degrees.</p></section>`:''}
    ${actuator?`<section class="settings-section"><div class="settings-section-title">${icon('refresh')}<h3>Behavior</h3></div>${row('Direction','Reverse the logical command direction.',`<div class="field"><label class="sr-only" for="config-direction">Direction</label><select id="config-direction" data-config-field="direction"><option ${draft.direction==='Forward'?'selected':''}>Forward</option><option ${draft.direction==='Reverse'?'selected':''}>Reverse</option></select></div>`)}</section>`:`<section class="settings-section"><div class="settings-section-title">${icon('sensor')}<h3>Sensor readings</h3></div>${row('Available values','View sample data in Quick test.',`<span class="readonly-value">${d.type==='imu'?'Heading, pitch, roll':'Distance in millimeters'}</span>`)}</section>`}
    <p id="config-error" class="config-error" role="alert">${state.configErrors[d.id]||''}</p>
    <div class="settings-note">${icon('shield')}<p>${servo?'These are runtime settings. Vendor firmware and servo mode programming may require a dedicated programmer.':'Settings are saved in this demo profile. Live hardware configuration requires a robot connection.'}</p></div>
  </div><aside class="settings-reference" aria-label="Device details"><h3>Device details</h3><dl><dt>Model</dt><dd>${d.model}</dd><dt>Interface</dt><dd>${servo||d.type==='crservo'?'PWM':d.type==='motor'?'DC motor + encoder':d.type==='imu'?'Integrated IMU':'I²C'}</dd><dt>Control</dt><dd>${servo?'Position command':d.type==='crservo'?'Power and direction':d.type==='motor'?'Power, velocity, position':'Readings only'}</dd><dt>Feedback</dt><dd>${isServo(d)?'No shaft position feedback':d.type==='motor'?'Encoder · current':'Sensor measurements'}</dd></dl>
    ${servo?`<div class="settings-presets"><h3>Saved positions <span>${currentPresets().length}</span></h3>${currentPresets().map(p=>`<div><span>${escapeHTML(p.name)}</span><code ${p.value<d.min||p.value>d.max?'class="outside-range" title="Outside the saved operating range"':''}>${p.value.toFixed(2)}</code></div>`).join('')}<button class="text-link" data-tab="control">Use in Quick test ${icon('arrow')}</button></div>`:''}
  </aside></div>`;
}
function renderActivity(){
  return `<ul class="activity-list">${state.activity.map(item=>`<li>${icon('check')}<span>${escapeHTML(item.label)} ${item.value?`<span class="mono">${escapeHTML(item.value)}</span>`:''}</span><time>${item.time}</time></li>`).join('')}</ul>`;
}

function renderSequences(){
  return `${pageHeading('Sequences','Configure device actions and waits.',btn('New sequence','new-sequence','primary','plus'))}<div class="sequence-layout"><section class="panel recipe-list"><p>MY SEQUENCES</p><button class="recipe-item selected" data-action="current-recipe"><strong>${escapeHTML(state.sequenceName)}</strong><span>${state.sequence.length} steps · Mechanism sequence</span></button><button class="recipe-item" data-action="load-intake"><strong>Intake cycle</strong><span>3 steps · Example recipe</span></button></section><div><section class="panel recipe-content"><div class="recipe-title"><div><h2>${escapeHTML(state.sequenceName)}</h2><p>Ordered actions for the selected sequence.</p></div><span class="tag warm">${icon('sequence')}SEQUENCE</span></div><div class="sequence-steps">${state.sequence.map((s,i)=>{const wait=s.device==='wait';const d=devices.find(x=>x.id===s.device);return `<div class="sequence-step ${state.sequenceStep===i?'running':''}"><span class="step-number">${String(i+1).padStart(2,'0')}</span><div class="step-card">${icon(wait?'clock':deviceIcon(d))}<div><strong>${wait?'Wait':d.name}</strong><p>${wait?'Pause before the next movement':d.type==='crservo'?'Set commanded power':'Set commanded position'}</p></div><span class="tag mono">${wait?s.value+' ms':Number(s.value).toFixed(2)}</span><button class="icon-button" data-delete-step="${i}" title="Remove step ${i+1}" ${state.sequenceRunning?'disabled':''}>${icon('trash')}</button></div></div>`;}).join('')}</div><button class="add-step" data-action="add-step" ${state.sequenceRunning?'disabled':''}>${icon('plus')}Add a step</button><div class="sequence-summary"><p>${state.sequence.length} steps <span style="color:#c5c9bb">·</span> <span class="mono">${(state.sequence.reduce((sum,s)=>sum+(stepDuration(s)),0)/1000).toFixed(1)}s</span> estimated<br><span class="small" style="font-size:8px">Preview only · no robot connected</span></p><div style="display:flex;gap:7px">${btn('Export','export-sequence','small-btn','export')}${btn(state.sequenceRunning?'Stop preview':'Run preview',state.sequenceRunning?'stop':'run-sequence','accent',state.sequenceRunning?'stop':'play')}</div></div></section><div class="hint-card">${icon('book')}<div><strong>Think in mechanisms, not numbers.</strong><p>Save meaningful positions like “ready to score” and reuse them in every sequence.</p></div></div></div></div>`;
}
function pidModel(){
  const g=state.gains;const damping=clamp(.62+g.d*230-g.p*6+g.i*6,.22,.98);const omega=6+Math.sqrt(Math.max(0,g.p))*18;const settle=4/(damping*omega);const overshoot=Math.exp(-damping*Math.PI/Math.sqrt(1-damping*damping))*100;
  const points=[];for(let n=0;n<=120;n++){const t=n/120*3;const wd=omega*Math.sqrt(1-damping*damping);const y=1-Math.exp(-damping*omega*t)*(Math.cos(wd*t)+(damping*omega/wd)*Math.sin(wd*t));points.push([n/120,y]);}
  return {points,settle,overshoot};
}
function responseChart(){
  const model=pidModel();const path=model.points.map(([x,y],i)=>`${i?'L':'M'}${(42+x*598).toFixed(1)} ${(235-y*170).toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 660 280" fill="none" aria-label="Illustrative PID response based on a simplified model"><defs><linearGradient id="chart-fill" x1="0" y1="60" x2="0" y2="235" gradientUnits="userSpaceOnUse"><stop stop-color="#b9def3" stop-opacity=".09"/><stop offset="1" stop-color="#b9def3" stop-opacity="0"/></linearGradient></defs>${[0,1,2,3,4].map(i=>`<path d="M42 ${35+i*50}H640" stroke="#343a3c"/><text x="30" y="${38+i*50}" text-anchor="end" class="chart-label">${Math.round(state.gains.target*(1.18-i*.295))}</text>`).join('')}${[0,1,2,3,4,5,6].map(i=>`<path d="M${42+i*99.67} 35V235" stroke="#2d3234"/><text x="${42+i*99.67}" y="258" text-anchor="middle" class="chart-label">${(i*.5).toFixed(1)}s</text>`).join('')}<path d="M42 65H640" stroke="#737f85" stroke-dasharray="5 5"/><path d="${path}L640 235H42Z" fill="url(#chart-fill)"/><path d="${path}" stroke="#b9def3" stroke-width="2" stroke-linecap="round"/><circle cx="640" cy="65" r="3" fill="#b9def3"/></svg>`;
}
function renderPID(){
  const model=pidModel();
  return `${pageHeading('PID tuner','Adjust gains and compare simulated responses.',btn('Export gains','export-gains','','export')+btn('Record test','pid-run','primary',state.pidRunning?'clock':'play'))}<div class="pid-layout"><div><section class="panel pid-chart-panel"><div class="chart-toolbar"><div><h2>Lift motor <span class="tag" style="margin-left:7px">Position control</span></h2><p>Simplified demo model · not measured motor data</p></div><div class="legend"><span><i class="target"></i>Target</span><span><i></i>Response</span></div></div><div class="response-chart" id="response-chart">${responseChart()}</div><div class="metric-grid"><div class="metric"><span>Settling time</span><strong id="settling-value">${model.settle.toFixed(2)}<small>s</small></strong></div><div class="metric"><span>Overshoot</span><strong id="overshoot-value">${model.overshoot.toFixed(1)}<small>%</small></strong></div><div class="metric"><span>Target position</span><strong id="target-value">${state.gains.target}<small>ticks</small></strong></div></div></section><div class="hint-card">${icon('tuning')}<div><strong>Change one thing. See what it does.</strong><p>Adjust the gains to explore an illustrative response. Connected tests will use your robot’s measured telemetry.</p></div></div></div><section class="panel gains-panel"><h3>Control parameters</h3>${[['p','Proportional','Kp','How strongly to correct position error.'],['i','Integral','Ki','How accumulated error is corrected.'],['d','Derivative','Kd','How changes in error are damped.']].map(([key,label,symbol,hint])=>`<div class="gain-row"><div class="gain-label"><label for="gain-${key}">${label}</label><span class="gain-symbol">${symbol}</span></div><input id="gain-${key}" data-gain="${key}" type="number" step="${key==='d'?'.0001':'.001'}" min="0" max="1" value="${state.gains[key]}"><small>${hint}</small></div>`).join('')}<div class="gain-row"><div class="gain-label"><label for="gain-target">Target position</label></div><div class="target-field"><input id="gain-target" data-gain="target" type="number" min="1" max="5000" step="50" value="${state.gains.target}"><span>ticks</span></div></div>${btn(state.pidRunning?'Recording demo…':'Run demo test','pid-run','accent',state.pidRunning?'clock':'play')}</section></div><section class="panel run-table-panel"><div class="panel-header"><h3 class="panel-title">Recent tuning runs</h3><button class="text-link" data-view="runs">All test runs ${icon('arrow')}</button></div>${renderRunTable(state.runs.filter(r=>r.type==='PID tuning').slice(0,3),true)}</section>`;
}
const fieldPoint = point => ({x:250+point.x/72*215,y:250-point.y/72*215});
function fieldSVG(){
  const ps=state.waypoints.map(fieldPoint);const path=ps.map((p,i)=>`${i?'L':'M'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  return `<svg viewBox="0 0 500 500" aria-label="Editable robot trajectory on a generic 144 inch field"><rect x="35" y="35" width="430" height="430" fill="#25292b" stroke="#505b61"/>${[0,1,2,3,4,5,6].map(i=>`<path d="M${35+i*71.667} 35V465M35 ${35+i*71.667}H465" stroke="#394247" stroke-dasharray="${i===3?'4 4':'0'}" stroke-width="${i===3?'1.1':'.7'}"/>`).join('')}<rect x="36" y="36" width="71" height="71" fill="#2e3940" opacity=".6"/><rect x="393" y="393" width="71" height="71" fill="#353432" opacity=".7"/><path d="${path}" fill="none" stroke="#526b7c" stroke-width="22" stroke-linejoin="round" stroke-linecap="round" opacity=".4"/><path d="${path}" fill="none" stroke="#b9def3" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" stroke-dasharray="${state.trajectoryRunning?'6 4':'0'}" class="robot-path-preview"/>${state.waypoints.map((p,i)=>{const pt=ps[i];return `<g class="waypoint ${state.waypoint===i?'active':''}" data-waypoint="${i}" role="button" tabindex="0" aria-label="Waypoint ${i+1}: ${escapeHTML(p.name)}"><circle class="waypoint-ring" cx="${pt.x}" cy="${pt.y}" r="12" fill="#27363f" stroke="#526e7e"/><circle cx="${pt.x}" cy="${pt.y}" r="4" fill="${state.waypoint===i?'#b9def3':'#789aaa'}"/><path d="M${pt.x} ${pt.y}l${(Math.cos(-p.heading*Math.PI/180)*23).toFixed(1)} ${(Math.sin(-p.heading*Math.PI/180)*23).toFixed(1)}" stroke="#b9def3" stroke-width="1.5"/><text x="${pt.x+18}" y="${pt.y-16}" fill="#91a7b2" font-family="monospace" font-size="9">${String(i+1).padStart(2,'0')}</text></g>`;}).join('')}<g ${state.trajectoryRunning?'':`transform="translate(${ps[0].x},${ps[0].y}) rotate(${-state.waypoints[0].heading})"`} opacity=".9">${state.trajectoryRunning?`<animateMotion dur="3s" fill="freeze" path="${path}" rotate="auto"/>`:''}<rect x="-20" y="-20" width="40" height="40" rx="5" fill="#344c5a" fill-opacity=".7" stroke="#b9def3"/><path d="M5-8 13 0 5 8M-9 0h22" fill="none" stroke="#b9def3" stroke-width="1.5"/></g><text x="250" y="23" text-anchor="middle" font-size="8" fill="#889ba5" font-family="monospace">+72 in</text><text x="250" y="484" text-anchor="middle" font-size="8" fill="#889ba5" font-family="monospace">−72 in</text><text x="16" y="253" text-anchor="middle" font-size="8" fill="#889ba5" font-family="monospace" transform="rotate(-90 16 253)">−72 in</text><text x="484" y="253" text-anchor="middle" font-size="8" fill="#889ba5" font-family="monospace" transform="rotate(90 484 253)">+72 in</text></svg>`;
}
function trajectoryLength(){return state.waypoints.slice(1).reduce((s,p,i)=>s+Math.hypot(p.x-state.waypoints[i].x,p.y-state.waypoints[i].y),0);}
function renderTrajectories(){
  const wp=state.waypoints[state.waypoint];
  return `${pageHeading('Trajectories','Edit waypoint coordinates, headings, and path geometry.',btn('Export path','export-path','','export')+btn(state.trajectoryRunning?'Stop preview':'Preview path',state.trajectoryRunning?'stop':'preview-path','primary',state.trajectoryRunning?'stop':'play'))}<div class="trajectory-layout"><section class="panel field-panel"><div class="field-toolbar"><strong>Score & park <span class="tag" style="margin-left:6px">Draft</span></strong><span class="simulation-label">Generic field <span class="mono">144 × 144 in</span></span></div><div class="field-canvas ${state.trajectoryRunning?'is-running':''}" id="field-canvas">${fieldSVG()}<div class="field-toolbox"><button class="icon-button ${state.fieldTool==='select'?'active':''}" data-field-tool="select" title="Select a waypoint">${icon('cursor')}</button><button class="icon-button ${state.fieldTool==='add'?'active':''}" data-field-tool="add" title="Click the field to add a waypoint">${icon('plus')}</button></div><div class="field-coordinates"><span>X →</span><span>Y ↑</span><span>ORIGIN: CENTER</span></div><span class="field-scale">1 TILE = 24 IN</span></div><div class="trajectory-footer"><div class="trajectory-stats"><span><strong>${trajectoryLength().toFixed(1)}</strong>in total</span><span><strong>${state.waypoints.length}</strong>waypoints</span></div><span class="tag">Polyline preview</span></div></section><section class="panel waypoints-panel"><h3>Waypoints</h3>${state.waypoints.map((p,i)=>`<button class="waypoint-item ${state.waypoint===i?'active':''}" data-waypoint="${i}"><span class="waypoint-num">${String(i+1).padStart(2,'0')}</span><div><strong>${escapeHTML(p.name)}</strong><p>x ${p.x} <span style="color:#cad0bd">/</span> y ${p.y} <span style="color:#cad0bd">/</span> ${p.heading}°</p></div>${icon('chevron')}</button>`).join('')}<div class="waypoint-properties"><div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:12px"><h4 style="margin:0">Selected waypoint</h4><button class="icon-button" data-action="remove-waypoint" title="Remove selected waypoint" ${state.waypoints.length<=2?'disabled':''}>${icon('trash')}</button></div><div class="coordinate-fields">${[['x','X · in',-72,72],['y','Y · in',-72,72],['heading','Heading · deg',-180,180]].map(([key,title,min,max])=>`<div class="field"><label for="wp-${key}">${title}</label><input id="wp-${key}" data-coordinate="${key}" type="number" min="${min}" max="${max}" step="1" value="${wp[key]}"></div>`).join('')}<div class="field"><label>Segment</label><input value="Line" disabled></div></div></div>${btn('Add waypoint','add-waypoint','','plus')}</section></div><div class="hint-card">${icon('trajectory')}<div><strong>Plan here. Execute on the robot.</strong><p>This is a geometry preview. Real trajectories will also need drivetrain constraints, localization, and a robot-side motion library.</p></div></div>`;
}
function renderRunTable(runs,pidOnly=false){
  return `<table class="data-table"><thead><tr><th>Test run</th><th>${pidOnly?'Kp / Ki / Kd':'Type'}</th><th>${pidOnly?'Settling':'Source'}</th><th>${pidOnly?'Overshoot':'Status'}</th><th></th></tr></thead><tbody>${runs.length?runs.map((r)=>`<tr><td><strong style="font-weight:500">${escapeHTML(r.name)}</strong><span style="display:block;color:var(--muted);font-size:8px;margin-top:5px">${r.date}</span></td><td class="mono">${pidOnly?`${r.p} / ${r.i} / ${r.d}`:r.type}</td><td class="mono">${pidOnly?r.settle.toFixed(2)+' s':'Simulation'}</td><td>${pidOnly?`<span class="mono">${r.overshoot.toFixed(1)}%</span>`:'<span class="pill">Demo recording</span>'}</td><td><button class="icon-button" title="Export test run" data-export-run="${state.runs.indexOf(r)}">${icon('export')}</button></td></tr>`).join(''):'<tr><td colspan="5">Your recorded demo tests will appear here.</td></tr>'}</tbody></table>`;
}
function renderRuns(){
  return `${pageHeading('Test runs','Keep the experiment. Remember what worked.',btn('Export all','export-runs','primary','export'))}<div class="run-stat-row"><section class="panel stat-card"><span>Recorded tests</span><strong>${String(state.runs.length).padStart(2,'0')}</strong><small>Demo and session recordings</small></section><section class="panel stat-card"><span>PID experiments</span><strong>${String(state.runs.filter(r=>r.type==='PID tuning').length).padStart(2,'0')}</strong><small>Each keeps its control parameters</small></section><section class="panel stat-card"><span>Connected robot runs</span><strong>00</strong><small>Connect your robot to record real data</small></section></div><section class="panel run-table-panel"><div class="panel-header"><h2 class="panel-title">All recordings</h2><span class="simulation-label"><i class="status-dot"></i>Simulation data</span></div>${renderRunTable(state.runs)}</section><div class="hint-card">${icon('runs')}<div><strong>Make every test reproducible.</strong><p>Future robot recordings can keep the battery voltage, hardware profile, commands, and telemetry together for meaningful comparisons.</p></div></div>`;
}
function renderProfiles(){
  return `${pageHeading('Robot profiles','One home for the details that make your robot yours.',btn('Export profile','export-profile','primary','export'))}<div class="profile-grid"><section class="panel profile-card"><div class="profile-top"><div class="profile-illustration">${icon('robot')}</div><div><h2>Practice robot</h2><p>FTC demo configuration</p></div><span class="tag warm" style="margin-left:auto">Active</span></div><div class="profile-details"><span><strong>8</strong> devices</span><span><strong>1</strong> Control Hub</span><span>Local demo</span></div><div style="display:flex;justify-content:space-between;align-items:center"><span class="small muted" style="font-size:9px">Mechanisms, limits, and named presets.</span>${btn('Open','open-profile','small-btn','arrow')}</div></section><button class="panel profile-add" data-action="new-profile">${icon('plus')}<strong>Another robot. A fresh workspace.</strong><span>Robot profiles are coming after this design pass.</span></button></div><div class="hint-card" style="max-width:900px">${icon('shield')}<div><strong>Settings worth keeping.</strong><p>Servo limits, hardware capabilities, motor ratios, and saved presets belong to the robot profile, ready to share with your team.</p></div></div>`;
}
function setPosition(raw,preserveInput=false){
  const d=currentDevice();if(!Number.isFinite(raw))return;d.value=Math.round(clamp(raw,d.min,d.max)*100)/100;state.saved=false;
  document.getElementById('position-readout').innerHTML=`${d.value.toFixed(2)}<span class="value-unit">pos</span>`;
  document.getElementById('position-slider').value=d.value;if(!preserveInput)document.getElementById('position-input').value=d.value.toFixed(2);
  document.querySelectorAll('[data-preset]').forEach(el=>el.classList.toggle('selected',Math.abs(currentPresets()[el.dataset.preset].value-d.value)<.005));
}
function setMotor(raw){
  const d=currentDevice();if(!Number.isFinite(raw))return;const powerMode=d.type==='crservo'||state.motorMode==='power';
  if(powerMode)d.value=clamp(raw/100,-1,1);else d.target=clamp(raw,-3000,3000);
  const unit=powerMode?'%':state.motorMode==='velocity'?'ticks/s':'ticks';
  document.getElementById('motor-readout').innerHTML=`${Math.round(raw)}<span class="value-unit">${unit}</span>`;
  document.getElementById('motor-speed').textContent=d.type==='motor'?Math.round(d.value*1050):Math.round(d.value*100);
  document.getElementById('motor-current').textContent=d.type==='motor'?(Math.abs(d.value)*2.1).toFixed(2):d.value===0?'Stop':d.value>0?'CW':'CCW';
}
function openDialog(title,body,footer=''){
  const dialog=document.getElementById('dialog');
  dialog.innerHTML=`<div class="dialog-content"><div class="dialog-top"><h2>${title}</h2><button class="icon-button" data-action="close-dialog" aria-label="Close dialog">${icon('close')}</button></div>${body}${footer?`<div class="dialog-footer">${footer}</div>`:''}</div>`;
  dialog.showModal();
}
function download(name,content,type='application/json'){
  const blob=new Blob([content],{type});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=name;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);notify(`${name} exported.`);
}
function csv(records){
  const keys=[...new Set(records.flatMap(r=>Object.keys(r)))];return [keys,...records.map(r=>keys.map(k=>r[k]??''))].map(row=>row.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\r\n');
}
function stopAll(){
  clearTimeout(sequenceTimer);clearTimeout(pidTimer);clearTimeout(trajectoryTimer);state.sequenceRunning=false;state.sequenceStep=-1;state.pidRunning=false;state.trajectoryRunning=false;
  devices.filter(d=>d.type==='motor'||d.type==='crservo').forEach(d=>{d.value=0;d.target=0;});
  log('All demo outputs stopped');render();notify('Demo stopped. Motor and CR servo outputs set to zero.');
}
function runSequence(){
  if(state.sequenceRunning)return;if(!state.sequence.length){notify('Add a step before running a preview.');return;}
  const steps=structuredClone(state.sequence);
  state.sequenceRunning=true;state.sequenceStep=0;render();
  const step=()=>{
    if(!state.sequenceRunning)return;
    if(state.sequenceStep>=steps.length){state.sequenceRunning=false;state.sequenceStep=-1;state.runs.unshift({name:state.sequenceName,type:'Sequence',date:'This session',duration:steps.reduce((sum,step)=>sum+stepDuration(step),0)/1000});log('Sequence preview completed',state.sequenceName);render();notify('Sequence preview complete. Demo recording added.');return;}
    const item=steps[state.sequenceStep];if(item.device!=='wait'){const d=devices.find(x=>x.id===item.device);d.value=clamp(item.value,d.min,d.max);}
    render();sequenceTimer=setTimeout(()=>{state.sequenceStep++;step();},stepDuration(item));
  };step();
}
function runPID(){
  if(state.pidRunning)return;
  state.pidRunning=true;const model=pidModel();const gains={...state.gains};render();notify('Recording a simulated response…');
  pidTimer=setTimeout(()=>{state.pidRunning=false;state.runs.unshift({name:'Lift · position response',type:'PID tuning',p:gains.p,i:gains.i,d:gains.d,date:'This session',settle:model.settle,overshoot:model.overshoot});log('PID demo recorded',`Kp ${gains.p}`);render();notify('Demo response recorded with its control parameters.');},1800);
}
const actions={
  'close-dialog':()=>document.getElementById('dialog').close(),
  connect:()=>openDialog('Connect your robot',`<p class="dialog-description">This first version is an interactive design prototype. Explore every workspace with simulated hardware.</p><div class="dialog-info">${icon('plug')}<span>The connected version will communicate with a robot-side integration on your FTC Robot Controller.</span></div><ol class="dialog-list"><li><span class="mono">01</span>Install the OneTester integration in your robot project.</li><li><span class="mono">02</span>Join your robot’s Wi-Fi network.</li><li><span class="mono">03</span>Connect, review the hardware map, and start a test.</li></ol>`,btn('Continue in demo','close-dialog','accent','arrow')),
  stop:stopAll,
  scan:()=>{log('Demo hardware scan completed','8 devices');render();notify('Demo map refreshed. 8 configured devices found.');},
  'add-device':()=>openDialog('A place for every device',`<p class="dialog-description">OneTester will discover configured devices through the robot connection. The first visual prototype has a fixed map of 8 demo devices.</p><div class="dialog-info">${icon('hardware')}<span>Motors, positional and CR servos, analog and digital sensors, I²C devices, IMUs, and vision devices can share one capability-based hardware map.</span></div>`,btn('Explore demo devices','close-dialog','accent')),
  'hardware-map':()=>openDialog('Control Hub · demo map',`<p class="dialog-description">Configured devices, organized by their physical connection.</p><ul class="activity-list" style="min-height:0">${devices.map(d=>`<li style="padding:9px 0">${icon(deviceIcon(d))}<span>${d.name}</span><span class="mono" style="margin-left:auto;font-size:10px">${d.port}</span></li>`).join('')}</ul>`),
  'device-info':()=>{const d=currentDevice();openDialog(d.name,`<p class="dialog-description">${d.model}<br>Control Hub · ${d.port}</p><div class="dialog-info">${icon(deviceIcon(d))}<span>${d.type==='servo'?'Supports normalized position commands from 0 to 1 and direction reversal. Actual shaft position is unavailable without external feedback.':d.type==='crservo'?'Supports continuous power from −1 to +1. Zero is neutral. Angular position control is unavailable.':d.type==='motor'?'Supports open-loop power, encoder velocity, and encoder position. The demo readouts are simulated.':'Readings and configuration depend on the sensor adapter. This preview shows illustrative static data.'}</span></div>`);},
  'nudge-down':()=>setPosition(currentDevice().value-.01),
  'nudge-up':()=>setPosition(currentDevice().value+.01),
  'new-preset':()=>{if(currentPresets().length>=6){notify('This preview supports up to 6 saved positions.');return;}openDialog('Save a position',`<p class="dialog-description">Give position <span class="mono">${currentDevice().value.toFixed(2)}</span> a name that makes sense for your mechanism.</p><div class="field"><label for="preset-name">Position name</label><input id="preset-name" placeholder="e.g. Ready to score" maxlength="24" autofocus></div>`,btn('Cancel','close-dialog')+btn('Save position','confirm-preset','accent','save'));},
  'confirm-preset':()=>{const input=document.getElementById('preset-name');const name=input.value.trim();if(!name){input.focus();return;}state.presets[state.selected].push({name,value:currentDevice().value});document.getElementById('dialog').close();saveWorkspace();render();},
  save:saveConfiguration,
  'revert-settings':()=>{delete state.configDrafts[state.selected];delete state.configErrors[state.selected];render();},
  'to-sequence':()=>{if(state.sequenceRunning){notify('Stop the preview before editing the sequence.');return;}const d=currentDevice();if(!isServo(d)){notify('This sequence prototype supports positional and CR servo steps.');return;}state.sequence.push({device:d.id,value:d.value,wait:0});log('Added sequence step',d.name);notify(`${d.name} at ${d.value.toFixed(2)} added to ${state.sequenceName}.`);},
  zero:()=>{currentDevice().value=0;currentDevice().target=0;setMotor(0);document.getElementById('motor-slider').value=0;log('Output zeroed',currentDevice().name);},
  'goto-pid':()=>{state.view='pid';render();},
  'new-sequence':()=>{if(state.sequenceRunning){notify('Stop the preview before creating a sequence.');return;}openDialog('New sequence',`<p class="dialog-description">Start with a name, then add the movements your mechanism needs.</p><div class="field"><label for="sequence-name">Sequence name</label><input id="sequence-name" placeholder="e.g. Deploy intake" maxlength="40" autofocus></div>`,btn('Cancel','close-dialog')+btn('Create sequence','confirm-sequence','accent','plus'));},
  'confirm-sequence':()=>{const input=document.getElementById('sequence-name');if(!input.value.trim()){input.focus();return;}state.sequenceName=input.value.trim();state.sequence=[];state.sequenceStep=-1;state.sequenceRunning=false;clearTimeout(sequenceTimer);document.getElementById('dialog').close();state.view='sequences';render();},
  'current-recipe':()=>{},
  'load-intake':()=>{if(state.sequenceRunning){notify('Stop the preview before switching sequences.');return;}state.sequenceName='Intake cycle';state.sequence=[{device:'intake',value:.6,wait:0},{device:'wait',value:1000,wait:1000},{device:'intake',value:0,wait:0}];render();},
  'add-step':()=>{if(state.sequenceRunning)return;openDialog('Add a step',`<div class="field"><label for="step-device">Device or action</label><select id="step-device"><option value="wrist">Wrist servo · position</option><option value="claw">Claw servo · position</option><option value="intake">Intake roller · power</option><option value="wait">Wait · milliseconds</option></select></div><div class="field"><label for="step-value">Value</label><input id="step-value" type="number" min="0" max="1" step=".01" value=".5"><small id="step-hint">Normalized command, between 0 and 1.</small></div>`,btn('Cancel','close-dialog')+btn('Add step','confirm-step','accent','plus'));},
  'confirm-step':()=>{const device=document.getElementById('step-device').value,value=document.getElementById('step-value').valueAsNumber;const d=devices.find(x=>x.id===device);if(!Number.isFinite(value)||(device==='wait'?(value<0||value>10000):value<d.min||value>d.max)){notify(device==='wait'?'Enter a wait between 0 and 10000 ms.':`Use a value between ${d.min} and ${d.max}.`);return;}state.sequence.push({device,value,wait:device==='wait'?value:0});document.getElementById('dialog').close();render();},
  'run-sequence':runSequence,'pid-run':runPID,
  'export-sequence':()=>download('onetester-sequence.json',JSON.stringify({name:state.sequenceName,source:'visual-prototype',steps:state.sequence},null,2)),
  'export-gains':()=>download('onetester-pid-gains.json',JSON.stringify({source:'illustrative-demo-model',motor:'lift',...state.gains},null,2)),
  'export-profile':()=>download('onetester-robot-profile.json',JSON.stringify({name:'Practice robot',source:'visual-prototype',devices,presets:state.presets},null,2)),
  'export-path':()=>download('onetester-path.json',JSON.stringify({name:'Score & park',units:'inches',origin:'field-center',type:'polyline-geometry',executable:false,waypoints:state.waypoints},null,2)),
  'export-runs':()=>download('onetester-demo-runs.csv',csv(state.runs),'text/csv'),
  'preview-path':()=>{state.trajectoryRunning=true;render();notify('Previewing path geometry. No robot commands are sent.');trajectoryTimer=setTimeout(()=>{state.trajectoryRunning=false;render();notify('Geometry preview complete.');},3000);},
  'remove-waypoint':()=>{if(state.waypoints.length<=2)return;state.waypoints.splice(state.waypoint,1);state.waypoint=Math.min(state.waypoint,state.waypoints.length-1);render();},
  'add-waypoint':()=>{state.waypoints.push({name:`Waypoint ${state.waypoints.length+1}`,x:0,y:0,heading:0});state.waypoint=state.waypoints.length-1;render();},
  'new-profile':()=>openDialog('Your robot, your workspace',`<p class="dialog-description">Multiple robot profiles will keep each robot’s hardware map and mechanism settings together.</p><div class="dialog-info">${icon('robot')}<span>The current design pass includes one demo profile. Export it to review the proposed structure with your team.</span></div>`,btn('Close','close-dialog')+btn('Export demo profile','export-profile','accent','export')),
  'open-profile':()=>{state.view='hardware';render();},
  shortcuts:()=>openDialog('A few useful shortcuts',`<div class="shortcut"><span>Stop all demo activity</span><kbd>Space</kbd></div><div class="shortcut"><span>Hardware</span><kbd>1</kbd></div><div class="shortcut"><span>Sequences</span><kbd>2</kbd></div><div class="shortcut"><span>PID tuner</span><kbd>3</kbd></div><div class="shortcut"><span>Trajectories</span><kbd>4</kbd></div><div class="shortcut"><span>Show this guide</span><kbd>?</kbd></div>`),
  guide:()=>openDialog('Meet your robot workbench',`<p class="dialog-description">One workspace, from the first servo movement to a complete autonomous plan.</p><ol class="dialog-list"><li><span class="mono">01</span><span><strong>Hardware</strong> — select a device and try its controls.</span></li><li><span class="mono">02</span><span><strong>Sequences</strong> — combine meaningful mechanism movements.</span></li><li><span class="mono">03</span><span><strong>PID tuner</strong> — explore gains and keep test recordings.</span></li><li><span class="mono">04</span><span><strong>Trajectories</strong> — build a path from editable waypoints.</span></li></ol><div class="dialog-info">${icon('shield')}<span>All controls use local demo data. Hardware connection is part of a future implementation.</span></div>`,btn('Let’s explore','close-dialog','accent','arrow')),
};
document.addEventListener('click',event=>{
  const target=event.target.closest('button,[data-waypoint]');if(!target||target.disabled)return;
  if(target.dataset.action){actions[target.dataset.action]?.();return;}
  if(target.dataset.view){state.view=target.dataset.view;render();return;}
  if(target.dataset.device){state.selected=target.dataset.device;state.tab='configuration';state.motorMode='power';render();return;}
  if(target.dataset.filter){state.filter=target.dataset.filter;render();return;}
  if(target.dataset.tab){state.tab=target.dataset.tab;render();return;}
  if(target.dataset.preset!==undefined){const p=currentPresets()[target.dataset.preset];setPosition(p.value);log('Position preset applied',p.name);return;}
  if(target.dataset.direction){currentDevice().direction=target.dataset.direction;state.saved=false;log('Direction changed',target.dataset.direction);render();return;}
  if(target.dataset.motorMode){state.motorMode=target.dataset.motorMode;render();return;}
  if(target.dataset.deleteStep!==undefined&&!state.sequenceRunning){state.sequence.splice(Number(target.dataset.deleteStep),1);render();return;}
  if(target.dataset.waypoint!==undefined){state.waypoint=Number(target.dataset.waypoint);render();return;}
  if(target.dataset.fieldTool){state.fieldTool=target.dataset.fieldTool;render();if(state.fieldTool==='add')notify('Click inside the field to place a waypoint.');return;}
  if(target.dataset.exportRun!==undefined){const run=state.runs[Number(target.dataset.exportRun)];download('onetester-demo-run.csv',csv([run]),'text/csv');}
});
document.addEventListener('input',event=>{
  const el=event.target;
  if(el.dataset.configField)updateConfigDraft(el);
  if(el.id==='device-search'){state.query=el.value;document.getElementById('device-list').innerHTML=renderDeviceList();}
  if(el.id==='position-slider')setPosition(Number(el.value));
  if(el.id==='position-input'&&Number.isFinite(el.valueAsNumber))setPosition(el.valueAsNumber,true);
  if(el.dataset.coordinate&&Number.isFinite(el.valueAsNumber)){const limit=el.dataset.coordinate==='heading'?180:72;state.waypoints[state.waypoint][el.dataset.coordinate]=clamp(Math.round(el.valueAsNumber),-limit,limit);document.querySelector('#field-canvas > svg').outerHTML=fieldSVG();}
  if(el.id==='motor-slider')setMotor(Number(el.value));
  if(el.dataset.gain){const value=el.valueAsNumber;if(!Number.isFinite(value))return;state.gains[el.dataset.gain]=clamp(value,el.dataset.gain==='target'?1:0,el.dataset.gain==='target'?5000:1);const model=pidModel();document.getElementById('response-chart').innerHTML=responseChart();document.getElementById('settling-value').innerHTML=`${model.settle.toFixed(2)}<small>s</small>`;document.getElementById('overshoot-value').innerHTML=`${model.overshoot.toFixed(1)}<small>%</small>`;document.getElementById('target-value').innerHTML=`${state.gains.target}<small>ticks</small>`;}
});
document.addEventListener('change',event=>{
  const el=event.target;
  if(el.dataset.configField)updateConfigDraft(el);
  if(el.id==='position-input'){setPosition(el.valueAsNumber);log('Position commanded',currentDevice().value.toFixed(2));}
  if(el.id==='position-slider')log('Position commanded',currentDevice().value.toFixed(2));
  if(el.dataset.coordinate){if(!Number.isFinite(el.valueAsNumber)){render();return;}const limit=el.dataset.coordinate==='heading'?180:72;state.waypoints[state.waypoint][el.dataset.coordinate]=clamp(Math.round(el.valueAsNumber),-limit,limit);render();}
  if(el.id==='step-device'){const input=document.getElementById('step-value');const wait=el.value==='wait',cr=el.value==='intake';input.min=cr?-1:0;input.max=wait?10000:1;input.step=wait?100:.01;input.value=wait?400:cr?0:.5;document.getElementById('step-hint').textContent=wait?'Pause duration, from 0 to 10000 milliseconds.':cr?'Power command, from −1 to 1. Zero is neutral.':'Normalized command, between 0 and 1.';}
});
document.addEventListener('click',event=>{
  if(state.view!=='trajectories'||state.fieldTool!=='add'||event.target.closest('button,[data-waypoint]'))return;
  const svg=event.target.closest('#field-canvas > svg');if(!svg)return;
  const rect=svg.getBoundingClientRect(),sx=(event.clientX-rect.left)/rect.width*500,sy=(event.clientY-rect.top)/rect.height*500;
  if(sx<35||sx>465||sy<35||sy>465)return;
  state.waypoints.push({name:`Waypoint ${state.waypoints.length+1}`,x:Math.round((sx-250)/215*72),y:Math.round((250-sy)/215*72),heading:0});state.waypoint=state.waypoints.length-1;state.fieldTool='select';render();
});
document.addEventListener('keydown',event=>{
  if(document.getElementById('dialog').open)return;
  if((event.key==='Enter'||event.key===' ')&&event.target.dataset.waypoint!==undefined){event.preventDefault();state.waypoint=Number(event.target.dataset.waypoint);render();return;}
  if(event.target.closest('input,select,textarea,button,a,[role="button"],[role="tab"],[contenteditable="true"]'))return;
  if(event.code==='Space'){event.preventDefault();stopAll();}
  if(event.key==='?')actions.shortcuts();
  if(event.key==='/'&&state.view==='hardware'){event.preventDefault();document.getElementById('device-search')?.focus();}
  const view={1:'hardware',2:'sequences',3:'pid',4:'trajectories'}[event.key];if(view){state.view=view;render();}
});
document.getElementById('dialog').addEventListener('click',event=>{if(event.target.id==='dialog'){const rect=event.target.getBoundingClientRect();if(event.clientX<rect.left||event.clientX>rect.right||event.clientY<rect.top||event.clientY>rect.bottom)event.target.close();}});
render();

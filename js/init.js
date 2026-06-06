// ══════════════════════════════════════════
// 숫자 천단위 쉼표 — 전역 ko-KR 기본값 설정
// 11651.71 → 11,651.71 (소수점 포함 모든 숫자)
// ══════════════════════════════════════════
(function(){
  const _orig = Number.prototype.toLocaleString;
  Number.prototype.toLocaleString = function(locale, opts){
    if(locale === undefined){
      const n = Number(this);
      if(!Number.isInteger(n)){
        const dec = (n.toString().split('.')[1]||'').length;
        return _orig.call(this, 'ko-KR', {
          minimumFractionDigits: dec,
          maximumFractionDigits: dec
        });
      }
      return _orig.call(this, 'ko-KR');
    }
    return _orig.call(this, locale, opts);
  };
})();

// ── 오늘 날짜 칸 자동 스크롤 (이번 달 진입 시) ──
(function scrollToToday(){
  const now = new Date();
  if(curY === now.getFullYear() && curM === now.getMonth()){
    setTimeout(()=>{
      const todayEl = document.querySelector('.cal-day.today');
      if(todayEl) todayEl.scrollIntoView({behavior:'smooth', block:'center'});
    }, 150);
  }
})();

try { bgIdx = parseInt(localStorage.getItem('atm2_bgIdx')||'0')||0; } catch(e){}
applyBg(bgIdx, false);

function applyBg(idx, animate){
  const c = BG_COLORS[idx];
  const isDark = c.dark;
  const root = document.documentElement;

  document.body.style.background = c.bg;

  if(isDark){
    // ── 다크 배경 ──
    // surface: 배경보다 약간 밝은 불투명 색
    root.style.setProperty('--surface',  '#1e2230');
    root.style.setProperty('--surface2', '#252a3a');
    root.style.setProperty('--surface3', '#2d3348');
    root.style.setProperty('--border',   '#3a4060');
    root.style.setProperty('--text',     '#e8ecf4');
    root.style.setProperty('--text2',    '#a0aabf');
    root.style.setProperty('--text3',    '#6a7490');
    // 강조색: 다크용 밝은 계열 고정
    root.style.setProperty('--accent',   '#4f7cff');
    root.style.setProperty('--accent2',  '#9b7cff');
    root.style.setProperty('--green',    '#3dd68c');
    root.style.setProperty('--yellow',   '#ffd166');
    root.style.setProperty('--red',      '#ff5c7a');
    root.style.setProperty('--cyan',     '#3dd6d6');
    root.style.setProperty('--orange',   '#ff8c42');
    root.style.setProperty('--sat',      '#7fb3ff');
    root.style.setProperty('--sun',      '#ff8fab');
    document.body.style.color = '#e8ecf4';
    // 사이드바·배너
    const sidebar=document.getElementById('sidebar');
    const banner=document.getElementById('banner');
    sidebar.style.background='#1e2230';
    sidebar.style.borderRightColor='#3a4060';
    banner.style.background='#161920';
    banner.style.borderBottomColor='#3a4060';
  } else {
    // ── 밝은 배경 ──
    // surface: 흰색에 가까운 반불투명 → 완전 불투명 밝은 색으로 고정
    root.style.setProperty('--surface',  '#ffffff');
    root.style.setProperty('--surface2', '#f0f2f8');
    root.style.setProperty('--surface3', '#e4e7f0');
    root.style.setProperty('--border',   '#c8ccdc');
    root.style.setProperty('--text',     '#1a1a2e');
    root.style.setProperty('--text2',    '#3a3a5a');
    root.style.setProperty('--text3',    '#6a6a8a');
    // 강조색: 밝은 배경에서 잘 보이는 진한 계열 고정
    root.style.setProperty('--accent',   '#2255cc');
    root.style.setProperty('--accent2',  '#6600cc');
    root.style.setProperty('--green',    '#1a9e5e');
    root.style.setProperty('--yellow',   '#9a6800');
    root.style.setProperty('--red',      '#cc0022');
    root.style.setProperty('--cyan',     '#007a7a');
    root.style.setProperty('--orange',   '#c05000');
    root.style.setProperty('--sat',      '#1a44bb');
    root.style.setProperty('--sun',      '#aa1155');
    document.body.style.color = '#1a1a2e';
    const sidebar=document.getElementById('sidebar');
    const banner=document.getElementById('banner');
    sidebar.style.background='#f0f2f8';
    sidebar.style.borderRightColor='#c8ccdc';
    banner.style.background='#e8eaf4';
    banner.style.borderBottomColor='#c8ccdc';
  }

  const ci = document.getElementById('company-input');
  if(ci) ci.style.color = isDark ? '#e8ecf4' : '#1a1a2e';

  if(animate) showBgToast(c.name, isDark);
  try { localStorage.setItem('atm2_bgIdx', idx); } catch(e){}
}

function showBgToast(name, isDark){
  let t = document.getElementById('bg-toast');
  if(!t){
    t = document.createElement('div');
    t.id = 'bg-toast';
    t.style.cssText = `
      position:fixed; bottom:24px; left:50%; transform:translateX(-50%);
      backdrop-filter:blur(12px); border-radius:20px;
      padding:8px 20px; font-size:13px; font-weight:600;
      pointer-events:none; z-index:9999; opacity:0;
      transition:opacity .3s ease; white-space:nowrap;
    `;
    document.body.appendChild(t);
  }
  if(isDark){
    t.style.background = 'rgba(255,255,255,.13)';
    t.style.border     = '1px solid rgba(255,255,255,.2)';
    t.style.color      = '#fff';
  } else {
    t.style.background = 'rgba(0,0,0,.12)';
    t.style.border     = '1px solid rgba(0,0,0,.18)';
    t.style.color      = '#1a1a2e';
  }
  t.textContent = '🎨 ' + name;
  t.style.opacity = '1';
  clearTimeout(t._timer);
  t._timer = setTimeout(()=>{ t.style.opacity='0'; }, 1400);
}

// 배경색 탭 변경 기능 비활성화 (설정에서 수동 변경)
function toggleBgChange(){ /* 미사용 */ }

// ── 배경색 팔레트 렌더링 ──
function renderBgPalette(){
  const pal = document.getElementById('bg-palette');
  const nameEl = document.getElementById('bg-cur-name');
  if(!pal) return;
  pal.innerHTML = '';
  BG_COLORS.forEach((c, i) => {
    const btn = document.createElement('button');
    btn.title = c.name;
    btn.style.cssText = `width:100%;aspect-ratio:1;border-radius:6px;border:2px solid ${i===bgIdx?'var(--accent)':'var(--border)'};background:${c.bg};cursor:pointer;transition:border-color .15s;`;
    btn.onclick = () => {
      bgIdx = i;
      applyBg(i, true);
      renderBgPalette();
    };
    pal.appendChild(btn);
  });
  if(nameEl) nameEl.textContent = '현재: ' + BG_COLORS[bgIdx].name;
}

// ── 근무시간 커스텀 설정 ──
// 기본값 (2교대 12시간, 3교대 8시간)
let customShift = {
  day: { start: 9, end: 18 },
  night: { start: 22, end: 6 },
  shift2day: { start: 8, end: 20 },
  shift2night: { start: 20, end: 8 },
  shift3a: { start: 6, end: 14 },
  shift3b: { start: 14, end: 22 },
  shift3c: { start: 22, end: 6 }
};

function buildHourOpts(selId, curVal){
  const sel = document.getElementById(selId);
  if(!sel) return;
  sel.innerHTML = '';
  for(let h=0;h<24;h++){
    const opt = document.createElement('option');
    opt.value = h;
    opt.textContent = (h<10?'0':'')+h+':00';
    if(h === curVal) opt.selected = true;
    sel.appendChild(opt);
  }
}

function initCustomShiftSelects(){
  // 로컬스토리지에서 불러오기
  try {
    const saved = localStorage.getItem('atm2_customShift');
    if(saved) customShift = Object.assign(customShift, JSON.parse(saved));
  } catch(e){}
  buildHourOpts('custom-day-start', customShift.day.start);
  buildHourOpts('custom-day-end', customShift.day.end);
  buildHourOpts('custom-night-start', customShift.night.start);
  buildHourOpts('custom-night-end', customShift.night.end);
  buildHourOpts('custom-2shift-day-start', customShift.shift2day.start);
  buildHourOpts('custom-2shift-day-end', customShift.shift2day.end);
  buildHourOpts('custom-2shift-night-start', customShift.shift2night.start);
  buildHourOpts('custom-2shift-night-end', customShift.shift2night.end);
  buildHourOpts('custom-3a-start', customShift.shift3a.start);
  buildHourOpts('custom-3a-end', customShift.shift3a.end);
  buildHourOpts('custom-3b-start', customShift.shift3b.start);
  buildHourOpts('custom-3b-end', customShift.shift3b.end);
  buildHourOpts('custom-3c-start', customShift.shift3c.start);
  buildHourOpts('custom-3c-end', customShift.shift3c.end);
}

function updateCustomShift(){
  const g = id => { const el = document.getElementById(id); return el ? parseInt(el.value) : 0; };
  customShift.day         = { start: g('custom-day-start'),          end: g('custom-day-end')          };
  customShift.night       = { start: g('custom-night-start'),        end: g('custom-night-end')        };
  customShift.shift2day   = { start: g('custom-2shift-day-start'),   end: g('custom-2shift-day-end')   };
  customShift.shift2night = { start: g('custom-2shift-night-start'), end: g('custom-2shift-night-end') };
  customShift.shift3a     = { start: g('custom-3a-start'),           end: g('custom-3a-end')           };
  customShift.shift3b     = { start: g('custom-3b-start'),           end: g('custom-3b-end')           };
  customShift.shift3c     = { start: g('custom-3c-start'),           end: g('custom-3c-end')           };
  // 기존 변수에 반영
  dayStart   = customShift.day.start;
  nightStart = customShift.night.start;
  // 2교대 시간 반영
  if(typeof SHIFT2 !== 'undefined'){
    SHIFT2.day   = { s: customShift.shift2day.start,   e: customShift.shift2day.end   };
    SHIFT2.night = { s: customShift.shift2night.start, e: customShift.shift2night.end };
  }
  SHIFT3.A = { s: customShift.shift3a.start, e: customShift.shift3a.end };
  SHIFT3.B = { s: customShift.shift3b.start, e: customShift.shift3b.end };
  SHIFT3.C = { s: customShift.shift3c.start, e: customShift.shift3c.end };
  try { localStorage.setItem('atm2_customShift', JSON.stringify(customShift)); } catch(e){}
  updateLegend();
  renderCalendar();
  showToast('⏱ 근무시간 설정 저장됨');
}

function resetCustomShift(){
  customShift = {
    day: { start: 9, end: 18 },
    night: { start: 22, end: 6 },
    shift2day: { start: 8, end: 20 },
    shift2night: { start: 20, end: 8 },
    shift3a: { start: 6, end: 14 },
    shift3b: { start: 14, end: 22 },
    shift3c: { start: 22, end: 6 }
  };
  try { localStorage.removeItem('atm2_customShift'); } catch(e){}
  initCustomShiftSelects();
  updateCustomShift();
}

// ── 초기화 ──
(function(){
  renderBgPalette();
  initCustomShiftSelects();
})();


const asstBtnEl = document.getElementById('asst-btn');

// ── 출근/퇴근 버튼 함수 (실시간 한국 표준시) ──
function nowKSTStr(){
  // 한국 표준시 (UTC+9)
  const now = new Date();
  const kst = new Date(now.getTime() + (9*60 - now.getTimezoneOffset())*60000);
  const h = kst.getUTCHours();
  const m = kst.getUTCMinutes();
  return String(h).padStart(2,'0') + ':' + String(m).padStart(2,'0');
}

function manualRecordAttendance(){
  const today = new Date();
  const y = today.getFullYear();
  const mo = today.getMonth();
  const d = today.getDate();
  if(y !== curY || mo !== curM){ curY=y; curM=mo; renderCalendar(); }
  const key = `${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  if(dayData[key] && dayData[key].status === 'work' && dayData[key].start){
    if(!asstOpen) toggleAsst();
    addBotMsg(`오늘(${d}일)은 이미 출근(${dayData[key].start})이 기록되어 있어요! 🐱\n변경하려면 달력에서 날짜를 클릭해주세요.`);
    return;
  }
  const startTime = nowKSTStr();
  const startNum = timeStrToNum(startTime);
  const endNum = startNum + 8;
  const endH = Math.floor(endNum); const endM2 = Math.round((endNum-endH)*60);
  const endTime = String(endH).padStart(2,'0')+':'+String(endM2).padStart(2,'0');
  if(!dayData[key]) dayData[key]={};
  dayData[key].status='work'; dayData[key].start=startTime; dayData[key].end=endTime;
  lsSave(); renderCalendar();
  if(!asstOpen) toggleAsst();
  addBotMsg(`✅ ${mo+1}월 ${d}일 출근 완료! 🐱\n⏰ 출근 시각: ${startTime}\n🏁 퇴근 예정: ${endTime} (자동 +8h)\n퇴근 시 퇴근 버튼을 눌러주세요!`);
}

function manualRecordLeave(){
  const today = new Date();
  const y = today.getFullYear();
  const mo = today.getMonth();
  const d = today.getDate();
  if(y !== curY || mo !== curM){ curY=y; curM=mo; renderCalendar(); }
  const key = `${y}-${String(mo+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
  if(!dayData[key] || dayData[key].status !== 'work'){
    if(!asstOpen) toggleAsst();
    addBotMsg(`오늘(${d}일)에 출근 기록이 없어요! 🐱\n먼저 출근 버튼을 눌러주세요.`);
    return;
  }
  const leaveTime = nowKSTStr();
  dayData[key].end = leaveTime;
  lsSave(); renderCalendar();
  const startTime = dayData[key].start || '?';
  if(!asstOpen) toggleAsst();
  addBotMsg(`✅ ${mo+1}월 ${d}일 퇴근 완료! 🐱\n⏰ 출근: ${startTime} → 퇴근: ${leaveTime}\n오늘도 수고하셨어요! 🐾`);
}


// 머니냥 클릭 → 채팅 열기/닫기
if(asstBtnEl){
  asstBtnEl.addEventListener('click', ()=>{ toggleAsst(); });
}



// 페이지 로드 후 연차 정보 표시
(function(){
  if(hireDate){
    const hi = document.getElementById('hire-date-inp');
    if(hi) hi.value = hireDate;
    renderLeaveInfo();
  }
})();

// ══════════════════════════════════════════
// 온보딩 튜토리얼
// ══════════════════════════════════════════
var _obCur = 1;
var _obTotal = 3;
var _obLsKey = 'atm2_onboarding_done';
var _obSelectedWT = 'day';

function obSelectWT(btn){
  document.querySelectorAll('.ob-wt-btn').forEach(b=>b.classList.remove('ob-wt-active'));
  btn.classList.add('ob-wt-active');
  _obSelectedWT = btn.dataset.wt;
}

function _obUpdateUI(){
  for(var i=1;i<=_obTotal;i++){
    var s=document.getElementById('ob-s'+i);
    if(s) s.className='ob-slide'+(i===_obCur?' active':'');
  }
  var fill=document.getElementById('ob-progress-fill');
  if(fill) fill.style.width=(_obCur/_obTotal*100)+'%';
  for(var j=1;j<=_obTotal;j++){
    var d=document.getElementById('ob-dot-'+j);
    if(!d) continue;
    d.className='ob-dot'+(j===_obCur?' active':j<_obCur?' done':'');
  }
  var btn=document.getElementById('ob-next');
  if(btn) btn.textContent=_obCur===_obTotal?'✅ 시작하기!':'다음 →';
  var skip=document.getElementById('ob-skip');
  if(skip) skip.textContent=_obCur===1?'건너뛰기':'← 이전';
  // 포커스 이동
  setTimeout(function(){
    var inp = _obCur===1 ? document.getElementById('ob-name-inp')
            : _obCur===2 ? document.getElementById('ob-wage-inp')
            : document.getElementById('ob-hire-inp');
    if(inp) inp.focus();
  }, 200);
}

function obNext(){
  if(_obCur===1){
    // STEP 1 → 이름/사업장 저장
    var name = (document.getElementById('ob-name-inp')||{}).value||'';
    var company = (document.getElementById('ob-company-inp')||{}).value||'';
    if(name.trim()){
      memName = name.trim();
      if(activeWpId && company.trim()) wpUpdate(activeWpId, {name: company.trim()});
      var ci = document.getElementById('company-input');
      if(ci && company.trim()) ci.value = company.trim();
    }
    _obCur++; _obUpdateUI();
  } else if(_obCur===2){
    // STEP 2 → 시급/근무유형 저장
    var wageEl = document.getElementById('ob-wage-inp');
    var wage = parseInt((wageEl||{}).value||'10320');
    if(wage < 10320){
      var warn = document.getElementById('ob-wage-warn');
      if(warn){ warn.style.display='block'; }
      if(wageEl) wageEl.style.borderColor='var(--red)';
      return; // 최저시급 미만이면 진행 막음
    }
    hourlyRate = wage;
    companyRate = wage;
    wt = _obSelectedWT;
    if(activeWpId && activeEmpId){
      empUpdate(activeWpId, activeEmpId, {hourlyRate: wage, companyRate: wage, wt: _obSelectedWT});
    }
    // 근무유형 버튼 UI 갱신
    document.querySelectorAll('.wt-btn').forEach(function(b){ b.classList.remove('active'); });
    var wtBtn = document.getElementById('wt-'+_obSelectedWT);
    if(wtBtn) wtBtn.classList.add('active');
    _obCur++; _obUpdateUI();
  } else {
    obClose();
  }
}

function obClose(){
  // STEP 3 → 입사일 저장 + 최종 저장
  var hireEl = document.getElementById('ob-hire-inp');
  if(hireEl && hireEl.value){
    hireDate = hireEl.value;
    var hi = document.getElementById('hire-date-inp');
    if(hi) hi.value = hireDate;
    if(activeWpId && activeEmpId) empUpdate(activeWpId, activeEmpId, {hireDate: hireDate});
  }
  lsSave();
  renderCalendar();
  updateEmpSwitcher();
  var ov=document.getElementById('onboarding-overlay');
  if(ov) ov.classList.remove('show');
  try{ localStorage.setItem(_obLsKey,'1'); }catch(e){}
  var rb=document.getElementById('ob-reopen-btn');
  if(rb) rb.dataset.show='true';
  _obCur=1;
  // 완료 토스트
  setTimeout(function(){ showToast('설정 완료! 달력에서 출근을 기록해보세요 🐱'); }, 400);
}

function obOpen(){
  _obCur=1;
  _obUpdateUI();
  var ov=document.getElementById('onboarding-overlay');
  if(ov) ov.classList.add('show');
}

// DOM 준비 후 이벤트 연결 및 자동 표시
document.addEventListener('DOMContentLoaded', function(){
  // skip/이전 버튼
  var skipBtn=document.getElementById('ob-skip');
  if(skipBtn){
    skipBtn.addEventListener('click', function(){
      if(_obCur===1){ obClose(); }
      else { _obCur--; _obUpdateUI(); }
    });
  }

  // 키보드
  document.addEventListener('keydown', function(e){
    var ov=document.getElementById('onboarding-overlay');
    if(!ov||!ov.classList.contains('show')) return;
    if(e.key==='ArrowRight'||e.key==='Enter') obNext();
    if(e.key==='ArrowLeft'&&_obCur>1){ _obCur--; _obUpdateUI(); }
    if(e.key==='Escape') obClose();
  });

  // 첫 진입 체크
  try{
    var done=localStorage.getItem(_obLsKey);
    if(!done){
      setTimeout(function(){
        _obUpdateUI();
        var ov=document.getElementById('onboarding-overlay');
        if(ov) ov.classList.add('show');
      }, 700);
    } else {
      var rb=document.getElementById('ob-reopen-btn');
      if(rb) rb.dataset.show='true';
    }
  }catch(e){}
});

// showOnboarding → obOpen 연결
function showOnboarding(){
  if(typeof obOpen === 'function') obOpen();
  else {
    const ov = document.getElementById('onboarding-overlay');
    if(ov) ov.classList.add('show');
  }
}

// ══════════════════════════════════════════
// 설정 페이지
// ══════════════════════════════════════════
function renderSettingsPage(){
  const page = document.getElementById('settings-page');
  if(!page){ console.error('settings-page not found'); return; }

  const savedName = localStorage.getItem('atm2_companyName') || '';
  const savedWage = localStorage.getItem('atm2_baseWage') || '10320';
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const currentWT = typeof workType !== 'undefined' ? workType : localStorage.getItem('atm2_workType') || 'day';
  const currentAlarm = localStorage.getItem('atm2_alarmSound') || 'beep';
  const lunchVal = typeof lunchBreak !== 'undefined' ? lunchBreak : 1;

  // 근무형태별 시간/휴게 정보
  const wtInfo = {
    day: {
      label:'☀️ 주간고정근무', defaultTime:'09:00~18:00',
      breaks:[
        {id:'day_morning', label:'오전 휴식', default:15},
        {id:'day_lunch',   label:'점심시간', default:60},
        {id:'day_evening', label:'오후 휴식', default:15},
      ]
    },
    night: {
      label:'🌙 야간근무', defaultTime:'00:00~08:00',
      breaks:[
        {id:'night_morning', label:'오전 휴식', default:15},
        {id:'night_evening', label:'오후 휴식', default:15},
        {id:'night_snack',   label:'야식시간',  default:30},
      ]
    },
    '2shift': {
      label:'🔄 주야2교대', defaultTime:'주간 08:00~20:00 / 야간 20:00~08:00',
      breaks:[
        {id:'2s_day_morning', label:'[주간] 오전 휴식', default:15},
        {id:'2s_day_lunch',   label:'[주간] 점심시간', default:60},
        {id:'2s_day_evening', label:'[주간] 오후 휴식', default:15},
        {id:'2s_day_dinner',  label:'[주간] 저녁시간', default:30},
        {id:'2s_night_morning',label:'[야간] 오전 휴식',default:15},
        {id:'2s_night_evening',label:'[야간] 오후 휴식',default:15},
        {id:'2s_night_snack', label:'[야간] 야식시간',  default:30},
      ]
    },
    '3shift': {
      label:'⚙️ 주야3교대', defaultTime:'조간 07:00~15:00 / 석간 15:00~23:00 / 야간 23:00~07:00',
      breaks:[
        {id:'3s_a_morning', label:'[조간] 오전 휴식', default:15},
        {id:'3s_a_lunch',   label:'[조간] 점심시간', default:60},
        {id:'3s_a_evening', label:'[조간] 오후 휴식', default:15},
        {id:'3s_b_morning', label:'[석간] 오전 휴식', default:15},
        {id:'3s_b_evening', label:'[석간] 오후 휴식', default:15},
        {id:'3s_b_dinner',  label:'[석간] 저녁시간', default:30},
        {id:'3s_c_morning', label:'[야간] 오전 휴식', default:15},
        {id:'3s_c_evening', label:'[야간] 오후 휴식', default:15},
        {id:'3s_c_snack',   label:'[야간] 야식시간',  default:30},
      ]
    }
  };

  // 저장된 휴게시간 불러오기
  function getBreakVal(id, def){ 
    const v = localStorage.getItem('atm2_break_'+id);
    return v !== null ? parseInt(v) : def;
  }

  // 알람음 목록
  const alarmSounds = [
    {id:'beep',       label:'🔔 기본 비프음'},
    {id:'soft',       label:'🎵 부드러운 알림'},
    {id:'ding',       label:'🔔 딩동'},
    {id:'chime',      label:'🎶 차임벨'},
    {id:'bell',       label:'🔔 교회 종'},
    {id:'digital',    label:'📱 디지털 알림'},
    {id:'piano',      label:'🎹 피아노'},
    {id:'marimba',    label:'🎵 마림바'},
    {id:'glass',      label:'🥂 유리잔'},
    {id:'wood',       label:'🪘 나무 타악'},
    {id:'alert',      label:'⚠️ 경보음'},
    {id:'success',    label:'✅ 성공음'},
    {id:'notify',     label:'💬 카톡 스타일'},
    {id:'pop',        label:'🫧 팝'},
    {id:'tick',       label:'⏱️ 틱톡'},
    {id:'whistle',    label:'📯 휘파람'},
    {id:'horn',       label:'📣 호른'},
    {id:'xylophone',  label:'🎵 실로폰'},
    {id:'cuckoo',     label:'🕊️ 뻐꾸기'},
    {id:'rooster',    label:'🐓 닭 울음'},
  ];

  let html = '<div style="padding:16px 20px 80px;max-width:520px;margin:0 auto;">';
  html += '<h2 style="font-size:20px;font-weight:700;margin-bottom:16px;">⚙️ 설정</h2>';

  // ── 기본 정보 ──
  const savedHireDate = hireDate || localStorage.getItem('atm2_hireDate') || '';
  // 연차 현황 미리 계산
  let leaveStatusHtml = '';
  if(savedHireDate){
    const al = (typeof calcAnnualLeave === 'function') ? calcAnnualLeave(savedHireDate) : null;
    if(al){
      const usedL = (typeof curY !== 'undefined') ? (() => {
        let u = 0;
        const dim = new Date(curY, curM+1, 0).getDate();
        for(let d=1;d<=dim;d++){
          const k = dk(curY,curM,d);
          const dd = dayData[k];
          if(!dd) continue;
          if(dd.status==='leave') u += 1;
          if(dd.status==='half')  u += 0.5;
        }
        return u;
      })() : 0;
      const totalL = (leaveOverride !== null && leaveOverride !== undefined) ? leaveOverride : al.totalLeave;
      const remainL = Math.max(0, totalL - usedL);
      leaveStatusHtml = `
        <div style="background:rgba(61,214,140,.08);border:1px solid rgba(61,214,140,.25);border-radius:8px;padding:10px 12px;margin-top:8px;">
          <div style="font-size:11px;font-weight:700;color:var(--green);margin-bottom:6px;">🌿 연차 현황</div>
          <div style="display:flex;gap:12px;flex-wrap:wrap;">
            <span style="font-size:12px;color:var(--text2);">총 연차 <b style="color:var(--text);">${totalL}일</b></span>
            <span style="font-size:12px;color:var(--text2);">이번달 사용 <b style="color:var(--red);">${usedL}일</b></span>
            <span style="font-size:12px;color:var(--text2);">잔여 <b style="color:var(--green);">${remainL}일</b></span>
          </div>
          ${al.nextInfo ? `<div style="font-size:11px;color:var(--text3);margin-top:4px;">📅 ${al.nextInfo}</div>` : ''}
        </div>`;
    }
  }

  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;">📋 기본 정보</div>
    <div style="margin-bottom:10px;">
      <div style="font-size:12px;color:var(--text3);margin-bottom:5px;">사업장/회사명</div>
      <input id="set-company-name" type="text" value="${savedName}" placeholder="예: 주식회사 머니냥"
        style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);
               border-radius:8px;padding:9px 12px;font-size:14px;font-family:'Noto Sans KR';outline:none;box-sizing:border-box;">
    </div>
    <div style="margin-bottom:12px;">
      <div style="font-size:12px;color:var(--text3);margin-bottom:5px;">기본 시급 (원)</div>
      <input id="set-base-wage" type="number" value="${savedWage}" min="9860" step="10"
        style="width:100%;background:var(--surface2);border:1px solid var(--border);color:var(--text);
               border-radius:8px;padding:9px 12px;font-size:14px;font-family:'JetBrains Mono';font-weight:700;outline:none;box-sizing:border-box;">
      <div style="font-size:11px;color:var(--text3);margin-top:3px;">2026년 최저시급 10,320원</div>
    </div>
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;color:var(--text3);margin-bottom:5px;">📅 입사일 <span style="font-size:10px;">(연차 자동 계산)</span></div>
      ${(()=>{
        const parts = savedHireDate ? savedHireDate.split('-') : ['','',''];
        const sy = parts[0]||'', sm = parts[1]||'', sd = parts[2]||'';
        const selStyle = `background:var(--surface2);border:1px solid var(--border);color:var(--text);
          border-radius:8px;padding:9px 8px;font-size:14px;font-family:'Noto Sans KR';
          outline:none;cursor:pointer;`;
        const nowY = new Date().getFullYear();
        const yOpts = `<option value="">년</option>` +
          Array.from({length:30},(_,i)=>nowY-i)
            .map(y=>`<option value="${y}" ${sy==y?'selected':''}>${y}년</option>`).join('');
        const mOpts = `<option value="">월</option>` +
          Array.from({length:12},(_,i)=>i+1)
            .map(m=>`<option value="${String(m).padStart(2,'0')}" ${sm==String(m).padStart(2,'0')?'selected':''}>${m}월</option>`).join('');
        const dOpts = `<option value="">일</option>` +
          Array.from({length:31},(_,i)=>i+1)
            .map(d=>`<option value="${String(d).padStart(2,'0')}" ${sd==String(d).padStart(2,'0')?'selected':''}>${d}일</option>`).join('');
        return `
        <div style="display:grid;grid-template-columns:2fr 1.2fr 1.2fr;gap:6px;margin-bottom:4px;">
          <select id="hire-y" style="${selStyle}" onchange="syncHireDate()">${yOpts}</select>
          <select id="hire-m" style="${selStyle}" onchange="syncHireDate()">${mOpts}</select>
          <select id="hire-d" style="${selStyle}" onchange="syncHireDate()">${dOpts}</select>
        </div>
        <input type="hidden" id="set-hire-date" value="${savedHireDate}">`;
      })()}
      ${leaveStatusHtml}
    </div>
    <button onclick="saveBasicSettings()"
      style="width:100%;padding:10px;border-radius:8px;border:none;background:var(--accent);
             color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'Noto Sans KR';">
      💾 저장</button>
  </div>`;

  // ── 근무 형태 선택 ──
  const wtBtns = Object.entries(wtInfo).map(([id, info]) => `
    <button onclick="setSettingsWT('${id}')" id="swt-${id}"
      style="padding:8px 10px;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;
             font-family:'Noto Sans KR';border:1.5px solid ${currentWT===id?'var(--accent)':'var(--border)'};
             background:${currentWT===id?'rgba(79,124,255,.1)':'var(--surface2)'};
             color:${currentWT===id?'var(--accent)':'var(--text2)'};">
      ${info.label.split(' ')[0]} ${info.label.split(' ').slice(1).join(' ')}
    </button>`).join('');

  const curInfo = wtInfo[currentWT] || wtInfo['day'];

  function renderBreaksHtml(info){
    return info.breaks.map(b => {
      const val = getBreakVal(b.id, b.default);
      return `<div style="display:flex;align-items:center;justify-content:space-between;
                          padding:6px 0;border-bottom:1px solid var(--border);">
        <span style="font-size:12px;color:var(--text2);">${b.label}</span>
        <div style="display:flex;align-items:center;gap:5px;">
          <input type="number" min="0" max="120" step="5" value="${val}"
            onchange="saveBreakVal('${b.id}', this.value)"
            style="width:55px;background:var(--surface);border:1px solid var(--border);color:var(--text);
                   border-radius:6px;padding:4px 6px;font-size:13px;font-family:'JetBrains Mono';
                   font-weight:700;text-align:center;outline:none;">
          <span style="font-size:11px;color:var(--text3);">분</span>
        </div>
      </div>`;
    }).join('');
  }

  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px;">🕐 근무 형태</div>
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:14px;">
      ${wtBtns}
    </div>
    <div id="wt-detail-box" style="background:var(--surface2);border-radius:10px;padding:12px 14px;">
      <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:4px;">${curInfo.label}</div>
      <div style="font-size:12px;color:var(--text3);margin-bottom:10px;">기본 시간: ${curInfo.defaultTime}</div>
      <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:8px;">휴게시간 설정</div>
      ${renderBreaksHtml(curInfo)}
    </div>
  </div>`;

  // ── N잡 설정 ──
  (function(){
    let njobWages = {};
    try{ const r = localStorage.getItem('atm2_jobWages'); if(r) njobWages = JSON.parse(r); }catch(e){}

    const njobTypes = [
      { id:'convenience', icon:'🏪', label:'편의점 알바', unit:'시급' },
      { id:'shortAlba',   icon:'📋', label:'단기 알바',   unit:'시급' },
      { id:'delivery',    icon:'🛵', label:'배달',         unit:'건당 단가' },
      { id:'driver',      icon:'🚗', label:'대리기사',     unit:'건당 단가' },
      { id:'freelancer',  icon:'💻', label:'프리랜서',     unit:'건당 단가' },
    ];

    const rows = njobTypes.map(t => `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 0;border-bottom:1px solid var(--border);">
        <span style="font-size:16px;flex-shrink:0;">${t.icon}</span>
        <div style="flex:1;">
          <div style="font-size:12px;font-weight:600;color:var(--text);">${t.label}</div>
          <div style="font-size:10px;color:var(--text3);">기본 ${t.unit}</div>
        </div>
        <input type="number" id="njob-wage-${t.id}" min="0" step="100"
          value="${njobWages[t.id] || (t.unit==='시급' ? 10320 : 0)}"
          style="width:100px;background:var(--surface2);border:1px solid var(--border);color:var(--text);
                 border-radius:7px;padding:6px 8px;font-size:13px;font-family:'JetBrains Mono';
                 font-weight:700;text-align:right;outline:none;">
        <span style="font-size:11px;color:var(--text3);flex-shrink:0;">원</span>
      </div>`).join('');

    html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">💼 N잡 기본 단가 설정</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:14px;">달력에서 기록 시 자동으로 적용되는 기본값</div>
      ${rows}
      <button onclick="saveNjobWages()"
        style="width:100%;margin-top:14px;padding:10px;border-radius:8px;border:none;
               background:var(--accent);color:#fff;font-size:13px;font-weight:700;
               cursor:pointer;font-family:'Noto Sans KR';">💾 저장</button>
    </div>`;
  })();


  // ── 급여일 설정 ──
  (function(){
    const savedPayday = localStorage.getItem('atm2_payday') || '';
    // 직종별 급여일 설정 로드
    let paydaySettings = {};
    try{ const r=localStorage.getItem('atm2_payday_settings'); if(r) paydaySettings=JSON.parse(r); }catch(e){}

    const DOW = ['일','월','화','수','목','금','토'];

    // 직종별 설정 행 생성
    function paydayRow(id, icon, label, defaultCfg){
      const cfg = paydaySettings[id] || defaultCfg;
      const typeA = cfg.type==='monthly'  ? 'selected' : '';
      const typeB = cfg.type==='weekly'   ? 'selected' : '';
      const typeC = cfg.type==='instant'  ? 'selected' : '';

      // 월 고정일
      const monthlyHtml = `<div id="pd-monthly-${id}" style="display:${cfg.type==='monthly'?'flex':'none'};align-items:center;gap:6px;margin-top:8px;">
        <span style="font-size:12px;color:var(--text2);">매월</span>
        <input type="number" id="pd-day-${id}" min="1" max="31" value="${cfg.day||25}"
          style="width:60px;background:var(--surface2);border:1px solid var(--border);color:var(--text);
                 border-radius:6px;padding:5px 8px;font-size:14px;font-family:'JetBrains Mono';font-weight:700;text-align:center;outline:none;">
        <span style="font-size:12px;color:var(--text2);">일 지급</span>
      </div>`;

      // 주급 방식 (마감 기준요일 + N일 후 지급)
      const weeklyDowOpts = DOW.map((d,i)=>`<option value="${i}" ${(cfg.cutDow||0)==i?'selected':''}>${d}요일</option>`).join('');
      const weeklyHtml = `<div id="pd-weekly-${id}" style="display:${cfg.type==='weekly'?'block':'none'};margin-top:8px;">
        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;">
          <select id="pd-cutdow-${id}"
            style="background:var(--surface2);border:1px solid var(--border);color:var(--text);
                   border-radius:6px;padding:5px 8px;font-size:12px;font-family:'Noto Sans KR';outline:none;">
            ${weeklyDowOpts}
          </select>
          <span style="font-size:12px;color:var(--text3);">마감 →</span>
          <input type="number" id="pd-offset-${id}" min="0" max="14" value="${cfg.offset||4}"
            style="width:45px;background:var(--surface2);border:1px solid var(--border);color:var(--text);
                   border-radius:6px;padding:5px 6px;font-size:14px;font-family:'JetBrains Mono';font-weight:700;text-align:center;outline:none;">
          <span style="font-size:12px;color:var(--text2);">일 후 지급</span>
        </div>
        <div style="font-size:10px;color:var(--text3);margin-top:4px;">
          예: 토요일 마감 → 4일 후 = 수요일 지급 (쿠팡 방식)
        </div>
      </div>`;

      // 당일/익일
      const instantOpts = [
        {v:0,l:'당일 지급'},{v:1,l:'+1일 (익일)'},{v:2,l:'+2일'},{v:3,l:'+3일 (익주 초)'}
      ].map(o=>`<option value="${o.v}" ${(cfg.offset||0)==o.v?'selected':''}>${o.l}</option>`).join('');
      const instantHtml = `<div id="pd-instant-${id}" style="display:${cfg.type==='instant'?'flex':'none'};align-items:center;gap:6px;margin-top:8px;">
        <select id="pd-ioffset-${id}"
          style="flex:1;background:var(--surface2);border:1px solid var(--border);color:var(--text);
                 border-radius:6px;padding:7px 10px;font-size:13px;font-family:'Noto Sans KR';outline:none;">
          ${instantOpts}
        </select>
      </div>`;

      return `<div style="padding:10px 0;border-bottom:1px solid var(--border);">
        <div style="display:flex;align-items:center;gap:8px;margin-bottom:6px;">
          <span style="font-size:16px;">${icon}</span>
          <span style="font-size:13px;font-weight:600;color:var(--text);flex:1;">${label}</span>
          <select id="pd-type-${id}" onchange="updatePaydayTypeUI('${id}')"
            style="background:var(--surface2);border:1px solid var(--border);color:var(--text);
                   border-radius:6px;padding:5px 8px;font-size:12px;font-family:'Noto Sans KR';outline:none;">
            <option value="monthly"  ${typeA}>월 고정일</option>
            <option value="weekly"   ${typeB}>주급 방식</option>
            <option value="instant"  ${typeC}>당일/익일</option>
          </select>
        </div>
        ${monthlyHtml}${weeklyHtml}${instantHtml}
      </div>`;
    }

    const rows =
      paydayRow('employee',    '🏢', '직장 급여',    {type:'monthly', day: savedPayday||25}) +
      paydayRow('convenience', '🏪', '편의점 알바',  {type:'monthly', day:25}) +
      paydayRow('shortAlba',   '📋', '단기 알바',    {type:'weekly',  cutDow:6, offset:4}) +
      paydayRow('delivery',    '🛵', '배달',          {type:'weekly',  cutDow:0, offset:3}) +
      paydayRow('driver',      '🚗', '대리기사',      {type:'instant', offset:0}) +
      paydayRow('freelancer',  '💻', '프리랜서',      {type:'monthly', day:15});

    html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
      <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:4px;">💰 급여일 설정</div>
      <div style="font-size:11px;color:var(--text3);margin-bottom:14px;">직종마다 다른 지급 방식 설정 → D-3·D-1·당일 알림</div>
      ${rows}
      <div style="padding:10px 0;border-bottom:1px solid var(--border);"></div>
      <button onclick="saveAllPaydaySettings()"
        style="width:100%;margin-top:14px;padding:10px;border-radius:8px;border:none;
               background:var(--accent);color:#fff;font-size:13px;font-weight:700;
               cursor:pointer;font-family:'Noto Sans KR';">💾 저장</button>
    </div>`;
  })();

  // ── 스마트 알림 + 알람음 ──
  const soundBtns = alarmSounds.map(s => `
    <button onclick="previewAndSelectAlarm('${s.id}', this)"
      style="padding:7px 10px;border-radius:8px;font-size:12px;cursor:pointer;
             font-family:'Noto Sans KR';border:1px solid ${currentAlarm===s.id?'var(--accent)':'var(--border)'};
             background:${currentAlarm===s.id?'rgba(79,124,255,.1)':'var(--surface2)'};
             color:${currentAlarm===s.id?'var(--accent)':'var(--text2)'};
             font-weight:${currentAlarm===s.id?'700':'400'};">
      ${s.label}
    </button>`).join('');

  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;">🔔 스마트 알림</div>
    <div style="margin-bottom:14px;">
      <div style="font-size:12px;font-weight:700;color:var(--text2);margin-bottom:8px;">알람음 선택 (탭하면 미리듣기)</div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;">
        ${soundBtns}
      </div>
    </div>
    <div id="smart-notif-toggles-s" style="margin-bottom:8px;"></div>
    <label style="display:flex;align-items:center;justify-content:space-between;padding:8px 0;cursor:pointer;">
      <div>
        <div style="font-size:13px;font-weight:600;color:var(--text);">🔊 알림 소리 ON/OFF</div>
        <div style="font-size:11px;color:var(--text3);">선택한 알람음으로 알림</div>
      </div>
      <div onclick="toggleSoundNotifBtn(this)"
        id="sound-toggle-s"
        style="width:44px;height:24px;border-radius:12px;cursor:pointer;flex-shrink:0;
               background:var(--accent);position:relative;transition:background .25s;">
        <span style="position:absolute;top:3px;left:22px;width:18px;height:18px;border-radius:50%;
                     background:#fff;transition:left .25s;display:block;"></span>
      </div>
    </label>
  </div>`;

  // ── 화면 설정 ──
  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;">🎨 화면 설정</div>
    <div style="display:flex;align-items:center;justify-content:space-between;padding:6px 0;">
      <div>
        <div style="font-size:13px;color:var(--text);">다크 모드</div>
        <div style="font-size:11px;color:var(--text3);">현재: ${isDark?'다크':'라이트'} 모드</div>
      </div>
      <div onclick="toggleDarkModeBtn(this)"
        id="dark-toggle-s"
        style="width:44px;height:24px;border-radius:12px;cursor:pointer;flex-shrink:0;
               background:${isDark?'var(--accent)':'var(--border)'};position:relative;transition:background .25s;">
        <span style="position:absolute;top:3px;left:${isDark?'22':'3'}px;width:18px;height:18px;border-radius:50%;
                     background:#fff;transition:left .25s;display:block;"></span>
      </div>
    </div>
  </div>`;

  // ── 데이터 관리 ──
  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;">💾 데이터 관리</div>
    <div style="font-size:11px;color:var(--text3);margin-bottom:10px;padding:8px 10px;background:rgba(255,209,102,.07);border-radius:7px;">
      💡 서버 연동 후에는 자동 저장으로 대체 예정
    </div>
    <div style="display:flex;flex-direction:column;gap:8px;">
      <button onclick="exportData()"
        style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);
               background:var(--surface2);color:var(--text);font-size:13px;font-weight:600;
               cursor:pointer;font-family:'Noto Sans KR';text-align:left;">📤 데이터 백업</button>
      <button onclick="document.getElementById('import-inp2').click()"
        style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid var(--border);
               background:var(--surface2);color:var(--text);font-size:13px;font-weight:600;
               cursor:pointer;font-family:'Noto Sans KR';text-align:left;">📥 데이터 복원</button>
      <button onclick="if(confirm('모든 데이터를 초기화할까요?\n되돌릴 수 없어요!'))resetAllData()"
        style="width:100%;padding:10px 14px;border-radius:8px;border:1px solid rgba(255,92,122,.3);
               background:none;color:var(--red);font-size:13px;font-weight:600;
               cursor:pointer;font-family:'Noto Sans KR';text-align:left;">🗑️ 전체 초기화</button>
    </div>
  </div>`;

  // ── 도움말 ──
  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:14px;">📖 도움말</div>
    <button onclick="showOnboarding()"
      style="width:100%;padding:12px;border-radius:8px;border:1px solid rgba(79,124,255,.3);
             background:rgba(79,124,255,.06);color:var(--accent);font-size:13px;font-weight:700;
             cursor:pointer;font-family:'Noto Sans KR';">🗺️ 사용 가이드 다시보기</button>
  </div>`;

  // ── 문의하기 ──
  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;margin-bottom:12px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:6px;">📬 문의하기</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:12px;line-height:1.6;">버그 신고, 기능 건의, 사용 문의를 남겨주세요.<br>확인 후 빠르게 답변드릴게요 🐱</div>
    <div style="margin-bottom:8px;">
      <input id="contact-name" type="text" placeholder="이름 (선택)"
        style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1px solid var(--border);
               background:var(--surface2);color:var(--text);font-size:14px;font-family:'Noto Sans KR';outline:none;margin-bottom:8px;">
      <input id="contact-email" type="email" placeholder="이메일 (답변 받을 주소)"
        style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1px solid var(--border);
               background:var(--surface2);color:var(--text);font-size:14px;font-family:'Noto Sans KR';outline:none;margin-bottom:8px;">
      <textarea id="contact-msg" placeholder="문의 내용을 입력해주세요" rows="4"
        style="width:100%;box-sizing:border-box;padding:10px 12px;border-radius:8px;border:1px solid var(--border);
               background:var(--surface2);color:var(--text);font-size:14px;font-family:'Noto Sans KR';
               outline:none;resize:none;margin-bottom:10px;"></textarea>
      <button onclick="submitContact()"
        style="width:100%;padding:11px;border-radius:8px;border:none;background:var(--accent);
               color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'Noto Sans KR';">
        📨 문의 보내기</button>
      <div id="contact-result" style="margin-top:8px;font-size:12px;text-align:center;min-height:16px;"></div>
    </div>
  </div>`;

  // ── 앱 정보 ──
  html += `<div style="background:var(--surface);border:1px solid var(--border);border-radius:12px;padding:16px 18px;">
    <div style="font-size:13px;font-weight:700;color:var(--text);margin-bottom:12px;">ℹ️ 앱 정보</div>
    <div style="display:flex;flex-direction:column;gap:8px;font-size:13px;">
      <div style="display:flex;justify-content:space-between;padding:5px 0;border-bottom:1px solid var(--border);">
        <span style="color:var(--text2);">앱 이름</span><span style="font-weight:600;">머니냥</span>
      </div>
      <div style="display:flex;justify-content:space-between;padding:5px 0;">
        <span style="color:var(--text2);">버전</span><span style="font-weight:600;">v1.0.0</span>
      </div>
    </div>
  </div>`;

  html += '</div>';
  page.innerHTML = html;
}

// 설정 페이지에서 근무형태 선택
function setSettingsWT(wt){
  const wtInfo = {
    day: {
      label:'☀️ 주간고정근무', defaultTime:'09:00~18:00',
      breaks:[
        {label:'오전 휴식', time:'15분'},
        {label:'점심시간', time:'1시간'},
        {label:'오후 휴식', time:'15분'},
      ]
    },
    night: {
      label:'🌙 야간근무', defaultTime:'00:00~08:00',
      breaks:[
        {label:'오전 휴식', time:'15분'},
        {label:'오후 휴식', time:'15분'},
        {label:'야식시간', time:'30분'},
      ]
    },
    '2shift': {
      label:'🔄 주야2교대', defaultTime:'주간 08:00~20:00 / 야간 20:00~08:00',
      breaks:[
        {label:'[주간] 오전 휴식', time:'15분'},
        {label:'[주간] 점심시간', time:'1시간'},
        {label:'[주간] 오후 휴식', time:'15분'},
        {label:'[주간] 저녁시간', time:'30분'},
        {label:'[야간] 오전 휴식', time:'15분'},
        {label:'[야간] 오후 휴식', time:'15분'},
        {label:'[야간] 야식시간', time:'30분'},
      ]
    },
    '3shift': {
      label:'⚙️ 주야3교대', defaultTime:'조간 07:00~15:00 / 석간 15:00~23:00 / 야간 23:00~07:00',
      breaks:[
        {label:'[조간] 오전 휴식', time:'15분'},
        {label:'[조간] 점심시간', time:'1시간'},
        {label:'[조간] 오후 휴식', time:'15분'},
        {label:'[석간] 오전 휴식', time:'15분'},
        {label:'[석간] 오후 휴식', time:'15분'},
        {label:'[석간] 저녁시간', time:'30분'},
        {label:'[야간] 오전 휴식', time:'15분'},
        {label:'[야간] 오후 휴식', time:'15분'},
        {label:'[야간] 야식시간', time:'30분'},
      ]
    }
  };

  // 기존 근무형태 함수 호출
  if(typeof setWT === 'function') setWT(wt);

  // 버튼 스타일 업데이트
  Object.keys(wtInfo).forEach(id => {
    const btn = document.getElementById('swt-'+id);
    if(!btn) return;
    btn.style.borderColor = id===wt ? 'var(--accent)' : 'var(--border)';
    btn.style.background  = id===wt ? 'rgba(79,124,255,.1)' : 'var(--surface2)';
    btn.style.color       = id===wt ? 'var(--accent)' : 'var(--text2)';
    btn.style.fontWeight  = id===wt ? '700' : '400';
  });

  // 상세 박스 업데이트
  const info = wtInfo[wt] || wtInfo['day'];
  const box = document.getElementById('wt-detail-box');
  if(!box) return;
  const breaksHtml = info.breaks.map(b => {
    const val = (() => { const v=localStorage.getItem('atm2_break_'+b.id); return v!==null?parseInt(v):b.default; })();
    return `<div style="display:flex;align-items:center;justify-content:space-between;
                        padding:6px 0;border-bottom:1px solid var(--border);">
      <span style="font-size:12px;color:var(--text2);">${b.label}</span>
      <div style="display:flex;align-items:center;gap:5px;">
        <input type="number" min="0" max="120" step="5" value="${val}"
          onchange="saveBreakVal('${b.id}', this.value)"
          style="width:55px;background:var(--surface);border:1px solid var(--border);color:var(--text);
                 border-radius:6px;padding:4px 6px;font-size:13px;font-family:'JetBrains Mono';
                 font-weight:700;text-align:center;outline:none;">
        <span style="font-size:11px;color:var(--text3);">분</span>
      </div>
    </div>`;
  }).join('');
  box.innerHTML = `
    <div style="font-size:12px;font-weight:700;color:var(--accent);margin-bottom:4px;">${info.label}</div>
    <div style="font-size:12px;color:var(--text3);margin-bottom:10px;">기본 시간: ${info.defaultTime}</div>
    <div style="font-size:12px;font-weight:700;color:var(--text);margin-bottom:8px;">휴게시간 설정</div>
    ${breaksHtml}`;

  showToast('✅ ' + info.label.split(' ').slice(1).join(' ') + ' 설정됨');
}

// 휴게시간 저장
function saveBreakVal(id, val){
  localStorage.setItem('atm2_break_'+id, parseInt(val)||0);
  showToast('✅ 저장됨');
}

// 알람음 미리듣기 + 선택
function previewAndSelectAlarm(soundId, btn){
  // 버튼 스타일 업데이트
  document.querySelectorAll('[onclick^="previewAndSelectAlarm"]').forEach(b => {
    b.style.borderColor = 'var(--border)';
    b.style.background  = 'var(--surface2)';
    b.style.color       = 'var(--text2)';
    b.style.fontWeight  = '400';
  });
  btn.style.borderColor = 'var(--accent)';
  btn.style.background  = 'rgba(79,124,255,.1)';
  btn.style.color       = 'var(--accent)';
  btn.style.fontWeight  = '700';

  localStorage.setItem('atm2_alarmSound', soundId);
  playAlarmSound(soundId);
}

// 알람음 재생
function playAlarmSound(soundId){
  try{
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const sounds = {
      beep:      [[880,0.1],[880,0.1]],
      soft:      [[440,0.3]],
      ding:      [[1047,0.5]],
      chime:     [[523,0.2],[659,0.2],[784,0.4]],
      bell:      [[349,0.8]],
      digital:   [[1200,0.05],[1200,0.05],[1200,0.05]],
      piano:     [[523,0.3],[659,0.3]],
      marimba:   [[784,0.2],[1047,0.2],[1319,0.3]],
      glass:     [[1568,0.6]],
      wood:      [[200,0.1],[150,0.1]],
      alert:     [[440,0.1],[880,0.1],[440,0.1]],
      success:   [[523,0.15],[659,0.15],[784,0.15],[1047,0.3]],
      notify:    [[880,0.1],[1108,0.2]],
      pop:       [[600,0.08]],
      tick:      [[1000,0.05]],
      whistle:   [[2093,0.3]],
      horn:      [[196,0.4]],
      xylophone: [[1047,0.15],[1319,0.15],[1568,0.15]],
      cuckoo:    [[659,0.2],[523,0.3]],
      rooster:   [[523,0.1],[659,0.1],[784,0.1],[659,0.1],[523,0.2]],
    };
    const notes = sounds[soundId] || sounds['beep'];
    let time = ctx.currentTime;
    notes.forEach(([freq, dur]) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = freq;
      osc.type = ['bell','glass','chime','piano','marimba'].includes(soundId) ? 'sine' : 'square';
      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.001, time + dur);
      osc.start(time);
      osc.stop(time + dur);
      time += dur + 0.05;
    });
  }catch(e){ console.log('알람음 재생 실패:', e); }
}

// 다크모드 토글 버튼
function toggleDarkModeBtn(btn){
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  const newDark = !isDark;

  // 테마 적용
  document.documentElement.setAttribute('data-theme', newDark ? 'dark' : 'light');
  localStorage.setItem('atm2_theme', newDark ? 'dark' : 'light');

  // 버튼 즉시 업데이트
  btn.style.background = newDark ? 'var(--accent)' : 'var(--border)';
  const knob = btn.querySelector('span');
  if(knob) knob.style.left = newDark ? '22px' : '3px';

  // 설정 페이지 다시 렌더 (테마 반영)
  setTimeout(()=>{
    renderSettingsPage();
    showToast(newDark ? '🌙 다크모드 ON' : '☀️ 라이트모드 ON');
  }, 100);
}

// 소리 토글 버튼
function toggleSoundNotifBtn(btn){
  const isOn = btn.style.background.includes('accent') || btn.style.background.includes('4f7cff') || btn.style.background.includes('var(--accent)');
  btn.style.background = isOn ? 'var(--border)' : 'var(--accent)';
  const knob = btn.querySelector('span');
  if(knob) knob.style.left = isOn ? '3px' : '22px';
  showToast(isOn ? '🔕 알림 소리 OFF' : '🔔 알림 소리 ON');
}

// 급여일 타입 변경 시 UI 토글
function updatePaydayTypeUI(id){
  const type = document.getElementById('pd-type-'+id)?.value;
  if(!type) return;
  const monthly = document.getElementById('pd-monthly-'+id);
  const weekly  = document.getElementById('pd-weekly-'+id);
  const instant = document.getElementById('pd-instant-'+id);
  if(monthly) monthly.style.display = type==='monthly' ? 'flex' : 'none';
  if(weekly)  weekly.style.display  = type==='weekly'  ? 'block': 'none';
  if(instant) instant.style.display = type==='instant' ? 'flex' : 'none';
}

// 전체 급여일 저장
function saveAllPaydaySettings(){
  const ids = ['employee','convenience','shortAlba','delivery','driver','freelancer'];
  let settings = {};
  ids.forEach(id => {
    const type = document.getElementById('pd-type-'+id)?.value || 'monthly';
    if(type === 'monthly'){
      settings[id] = { type, day: parseInt(document.getElementById('pd-day-'+id)?.value)||25 };
    } else if(type === 'weekly'){
      settings[id] = { type,
        cutDow: parseInt(document.getElementById('pd-cutdow-'+id)?.value)||6,
        offset: parseInt(document.getElementById('pd-offset-'+id)?.value)||4 };
    } else {
      settings[id] = { type,
        offset: parseInt(document.getElementById('pd-ioffset-'+id)?.value)||0 };
    }
  });
  try{ localStorage.setItem('atm2_payday_settings', JSON.stringify(settings)); }catch(e){}
  // 기존 직장인 급여일 호환성 유지
  if(settings.employee?.day){
    localStorage.setItem('atm2_payday', String(settings.employee.day));
    const el = document.getElementById('payday-input');
    if(el){ el.value = settings.employee.day; if(typeof savePayday==='function') savePayday(); }
  }
  showToast('✅ 급여일 설정 저장됨');
}

// 급여일 저장 (구버전 호환)
function savePaydayFromSettings(){
  const val = document.getElementById('payday-input-s')?.value;
  if(!val){ showToast('⚠️ 급여일을 입력해주세요'); return; }
  const paydayInp = document.getElementById('payday-input');
  if(paydayInp) paydayInp.value = val;
  if(typeof savePayday === 'function') savePayday();
  else {
    localStorage.setItem('atm2_payday', val);
    showToast('✅ 급여일 ' + val + '일 저장됨');
  }
}

// 문의하기 전송
async function submitContact(){
  const name  = (document.getElementById('contact-name')?.value || '').trim();
  const email = (document.getElementById('contact-email')?.value || '').trim();
  const msg   = (document.getElementById('contact-msg')?.value || '').trim();
  const result = document.getElementById('contact-result');
  if(!result) return;
  if(!msg){ result.style.color='var(--red)'; result.textContent='✏️ 문의 내용을 입력해주세요.'; return; }
  result.style.color='var(--text3)'; result.textContent='전송 중...';
  try {
    const res = await fetch('https://formspree.io/f/xykvrolk', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ name, email, message: msg })
    });
    if(res.ok){
      result.style.color='var(--green)';
      result.textContent='✅ 문의가 접수됐어요! 감사합니다 🐱';
      if(document.getElementById('contact-name'))  document.getElementById('contact-name').value  = '';
      if(document.getElementById('contact-email')) document.getElementById('contact-email').value = '';
      if(document.getElementById('contact-msg'))   document.getElementById('contact-msg').value   = '';
    } else {
      result.style.color='var(--red)'; result.textContent='⚠️ 전송 실패. 다시 시도해주세요.';
    }
  } catch(e){
    result.style.color='var(--red)'; result.textContent='⚠️ 네트워크 오류. 다시 시도해주세요.';
  }
}


// ── N잡 기본 단가 저장 ──
function saveNjobWages(){
  const ids = ['convenience','shortAlba','delivery','driver','freelancer'];
  let wages = {};
  try{ const r = localStorage.getItem('atm2_jobWages'); if(r) wages = JSON.parse(r); }catch(e){}
  ids.forEach(id => {
    const el = document.getElementById('njob-wage-'+id);
    if(el) wages[id] = parseInt(el.value)||0;
  });
  try{ localStorage.setItem('atm2_jobWages', JSON.stringify(wages)); }catch(e){}
  showToast('✅ N잡 단가 설정 저장됨');
}

// ── 기본 설정 저장 (회사명 + 시급 + 입사일) ──
function saveBasicSettings(){
  const name  = (document.getElementById('set-company-name')?.value||'').trim();
  const wage  = parseFloat(document.getElementById('set-base-wage')?.value||'10320');
  const hire  = document.getElementById('set-hire-date')?.value||'';

  // 회사명 저장
  if(name){
    localStorage.setItem('atm2_companyName', name);
    const compEl = document.getElementById('company-name');
    if(compEl) compEl.textContent = name;
  }

  // 시급 저장
  if(wage >= 10320){
    localStorage.setItem('atm2_baseWage', String(wage));
    // 활성 직원에도 반영
    if(typeof activeWpId !== 'undefined' && activeWpId && activeEmpId){
      hourlyRate   = wage;
      companyRate  = wage;
      empUpdate(activeWpId, activeEmpId, { hourlyRate: wage, companyRate: wage });
      if(typeof renderSalaryIfVisible === 'function') renderSalaryIfVisible();
    }
  } else {
    showToast('⚠️ 시급은 최저시급(10,320원) 이상이어야 합니다'); return;
  }

  // 입사일 저장
  if(hire){
    hireDate = hire;
    localStorage.setItem('atm2_hireDate', hire);
    // 활성 직원에도 반영
    if(typeof activeWpId !== 'undefined' && activeWpId && activeEmpId){
      empUpdate(activeWpId, activeEmpId, { hireDate: hire });
      const hi = document.getElementById('hire-date-inp');
      if(hi) hi.value = hire;
    }
  }

  lsSave();
  showToast('✅ 설정이 저장됐습니다!');
  // 연차 현황 갱신
  renderSettingsPage();
}

// ── 입사일 셀렉트 → hidden input 동기화 + 연차 현황 갱신 ──
function syncHireDate(){
  const y = document.getElementById('hire-y')?.value||'';
  const m = document.getElementById('hire-m')?.value||'';
  const d = document.getElementById('hire-d')?.value||'';
  const hidden = document.getElementById('set-hire-date');
  // 사이드바 hire-date-inp도 동기화
  const sideInp = document.getElementById('hire-date-inp');
  if(y && m && d){
    const val = `${y}-${m}-${d}`;
    if(hidden) hidden.value = val;
    if(sideInp) sideInp.value = val;
    hireDate = val;
    // 연차 현황 즉시 갱신
    renderSettingsPage();
  } else {
    if(hidden) hidden.value = '';
    if(sideInp) sideInp.value = '';
  }
}

// ── 사이드바 입사일 셀렉트 초기화 ──
function initSidebarHireSelects(){
  const sy = document.getElementById('sb-hire-y');
  const sm = document.getElementById('sb-hire-m');
  const sd = document.getElementById('sb-hire-d');
  if(!sy||!sm||!sd) return;

  const nowY = new Date().getFullYear();
  const parts = hireDate ? hireDate.split('-') : ['','',''];
  const cy=parts[0]||'', cm=parts[1]||'', cd=parts[2]||'';

  // 년 옵션
  let yHtml = '<option value="">년</option>';
  for(let y=nowY;y>=nowY-40;y--)
    yHtml += `<option value="${y}" ${cy==y?'selected':''}>${y}년</option>`;
  sy.innerHTML = yHtml;

  // 월 옵션
  let mHtml = '<option value="">월</option>';
  for(let m=1;m<=12;m++){
    const mv = String(m).padStart(2,'0');
    mHtml += `<option value="${mv}" ${cm==mv?'selected':''}>${m}월</option>`;
  }
  sm.innerHTML = mHtml;

  // 일 옵션
  let dHtml = '<option value="">일</option>';
  for(let d=1;d<=31;d++){
    const dv = String(d).padStart(2,'0');
    dHtml += `<option value="${dv}" ${cd==dv?'selected':''}>${d}일</option>`;
  }
  sd.innerHTML = dHtml;
}

function syncSidebarHire(){
  const y = document.getElementById('sb-hire-y')?.value||'';
  const m = document.getElementById('sb-hire-m')?.value||'';
  const d = document.getElementById('sb-hire-d')?.value||'';
  if(y && m && d){
    const val = `${y}-${m}-${d}`;
    const hidden = document.getElementById('hire-date-inp');
    if(hidden) hidden.value = val;
    hireDate = val;
    lsSave();
    if(typeof renderLeaveInfo === 'function') renderLeaveInfo();
    // 설정 페이지 셀렉트도 동기화
    const hy = document.getElementById('hire-y');
    const hm = document.getElementById('hire-m');
    const hdd = document.getElementById('hire-d');
    if(hy) hy.value = y;
    if(hm) hm.value = m;
    if(hdd) hdd.value = d;
  }
}

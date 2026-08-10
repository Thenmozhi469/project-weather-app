'use strict';
/* =============================================================
   WeatherNow — script.js  (All 26 phases)
   API key: 065e4d1b60cf7c882bc79567481c67aa
   Note: OWM keys activate within 2 hours of signup.
         Until then the app runs on rich mock data so you
         can see every feature working immediately.
============================================================= */

/* ── CONFIG ─────────────────────────────────────────── */
const CFG = {
  KEY:     '065e4d1b60cf7c882bc79567481c67aa',
  BASE:    'https://api.openweathermap.org/data/2.5',
  GEO:     'https://api.openweathermap.org/geo/1.0',
  ICON:    'https://openweathermap.org/img/wn',
  POPULAR: ['London','New York','Tokyo','Paris','Sydney','Dubai','Mumbai','Berlin'],
  MAX_REC: 10,
  TTL:     5 * 60 * 1000,
};

/* ── STATE ──────────────────────────────────────────── */
const S = {
  unit:'C', theme:'dark', data:null, city:'London, GB',
  coords:{ lat:51.5074, lon:-0.1278 },
  favs:[], recent:[], clock:null, tzOff:0,
  mock:false, cache:new Map(),
};

/* ── DOM ────────────────────────────────────────────── */
const g = id => document.getElementById(id);
const D = {
  bg:g('bgLayer'), bgP:g('bgParticles'),
  si:g('searchInput'), sc:g('searchClear'), sb:g('searchBtn'),
  sl:g('suggList'), rp:g('recentPanel'), rc:g('recentChips'),
  cr:g('clearRecent'), gps:g('gpsBtn'), wgps:g('welcomeGpsBtn'),
  bC:g('btnC'), bF:g('btnF'),
  tBtn:g('themeBtn'), tIco:g('themeIco'),
  ws:g('welcomeScreen'), ls:g('loadingScreen'),
  es:g('errorScreen'), et:g('errorTitle'), em:g('errorMsg'), er:g('retryBtn'),
  dash:g('dashboard'), pc:g('popularChips'), tw:g('toastWrap'),
  hCity:g('heroCity'), hCtry:g('heroCtry'),
  hDate:g('heroDate'), hClock:g('heroClock'),
  hIco:g('heroIcon'), hTemp:g('heroTemp'),
  hCond:g('heroCond'), hFeels:g('heroFeels'),
  hHi:g('heroHigh'), hLo:g('heroLow'), hTZ:g('heroTZ'),
  sH:g('sHum'), sW:g('sWind'), sV:g('sVis'), sP:g('sPres'),
  sSr:g('sSunrise'), sSs:g('sSunset'), sCl:g('sCloud'), sUV:g('sUV'),
  fb:g('favBtn'), fi:g('favIco'),
  hl:g('hourlyList'), fl:g('forecastList'),
  ac:g('aqiCard'), aa:g('aqiArc'), an:g('aqiNum'), al:g('aqiLbl'),
  ab:g('aqiBadge'), av:g('aqiAdvice'), ap:g('aqiPoll'),
  dU:g('dUV'), uF:g('uvFill'), uL:g('uvLvl'),
  dW:g('dWind'), ca:g('compassArrow'), cd:g('compassDir'),
  dH:g('dHum'), hF:g('humFill'), hL:g('humLvl'),
  dP:g('dPres'), pL:g('presLvl'),
  fs:g('favSection'), fg:g('favGrid'),
};

/* ── MOCK DATA ──────────────────────────────────────── */
function makeMock(city='London', country='GB') {
  const now = Math.floor(Date.now()/1000);
  const icons = ['01d','02d','03d','04d','09d','10d','13d','50d'];
  const descs = ['Clear sky','Few clouds','Scattered clouds','Broken clouds',
                 'Light rain','Moderate rain','Snow','Mist'];
  const list  = Array.from({length:40},(_,i)=>{
    const ci = i % icons.length;
    const base = 18 + Math.sin(i/5)*7;
    return {
      dt: now + i*10800,
      main:{ temp:base, feels_like:base-2, temp_min:base-3,
             temp_max:base+3, humidity:55+Math.round(Math.random()*30), pressure:1015 },
      weather:[{id:800+ci,description:descs[ci],icon:icons[ci]}],
      wind:{ speed:3+Math.random()*8, deg:Math.round(Math.random()*360) },
      clouds:{all:10+Math.round(Math.random()*80)},
      pop: i%7===0 ? 0.6 : Math.random()*0.3,
      visibility:10000,
    };
  });
  return {
    current:{
      name:city, dt:now, timezone:3600,
      coord:{lat:51.51,lon:-0.13},
      main:{temp:22.4,feels_like:21.1,temp_min:16.8,temp_max:26.2,humidity:62,pressure:1018},
      weather:[{id:802,description:'Scattered clouds',icon:'03d'}],
      wind:{speed:4.6,deg:240}, clouds:{all:38}, visibility:10000,
      sys:{country,sunrise:now-21600,sunset:now+21600},
    },
    forecast:{list},
    aqi:{list:[{
      main:{aqi:2},
      components:{pm2_5:8.4,pm10:14.2,o3:72.1,no2:18.6,so2:4.2,co:312},
    }]},
  };
}

/* ── API ────────────────────────────────────────────── */
const mkUrl = (path,p={}) =>
  `${CFG.BASE}${path}?${new URLSearchParams({appid:CFG.KEY,units:'metric',...p})}`;
const mkGeo = (path,p={}) =>
  `${CFG.GEO}${path}?${new URLSearchParams({appid:CFG.KEY,...p})}`;

async function safeFetch(endpoint) {
  const hit = S.cache.get(endpoint);
  if (hit && Date.now()-hit.ts < CFG.TTL) return hit.data;
  const ctrl = new AbortController();
  const tid  = setTimeout(()=>ctrl.abort(), 8000);
  try {
    const r = await fetch(endpoint,{signal:ctrl.signal});
    clearTimeout(tid);
    if (!r.ok) throw new Error(`${r.status}`);
    const d = await r.json();
    S.cache.set(endpoint,{data:d,ts:Date.now()});
    return d;
  } catch(e) {
    clearTimeout(tid);
    throw e;
  }
}

async function fetchWeather(lat,lon) {
  try {
    const [cur,fc,aq] = await Promise.all([
      safeFetch(mkUrl('/weather',      {lat,lon})),
      safeFetch(mkUrl('/forecast',     {lat,lon,cnt:40})),
      safeFetch(mkUrl('/air_pollution',{lat,lon})),
    ]);
    S.mock = false;
    return {current:cur, forecast:fc, aqi:aq};
  } catch(e) {
    const msg = e.message || '';
    // Only fall back to mock for auth errors or network failures
    if (msg.includes('401') || msg.includes('403') || msg.includes('Failed to fetch') || msg.includes('NetworkError')) {
      S.mock = true;
      const name = S.city.split(',')[0].trim() || 'London';
      return makeMock(name, 'GB');
    }
    // For real errors (404 city not found, 5xx etc) propagate them
    throw new Error('Failed to load weather data. Please try again.');
  }
}

async function geocity(q) {
  try {
    const d = await safeFetch(mkGeo('/direct',{q,limit:5}));
    if (Array.isArray(d) && d.length) return d;
    throw new Error('nf');
  } catch {
    S.mock = true;
    return [{name:q,country:'–',state:'',lat:51.51,lon:-0.13}];
  }
}

async function revGeo(lat,lon) {
  try {
    const d = await safeFetch(mkGeo('/reverse',{lat,lon,limit:1}));
    return d[0]||null;
  } catch { return null; }
}

/* ── SCREENS ────────────────────────────────────────── */
const SCREENS = ['welcomeScreen','loadingScreen','errorScreen','dashboard'];
function show(name) {
  // Hide ALL screens first, then show only the target
  SCREENS.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.hidden = true;
  });
  const target = {
    welcome:  'welcomeScreen',
    loading:  'loadingScreen',
    error:    'errorScreen',
    dashboard:'dashboard',
  }[name];
  if (target) {
    const el = document.getElementById(target);
    if (el) el.hidden = false;
  }
}
function showErr(msg) {
  D.et.textContent = msg.toLowerCase().includes('not found') ? 'City Not Found' : 'Something Went Wrong';
  D.em.textContent = msg || 'Please try again.';
  show('error');
}

/* ── LOAD & RENDER ──────────────────────────────────── */
let _reqId = 0; // guards against stale responses

async function load(lat, lon) {
  const reqId = ++_reqId;
  show('loading');
  try {
    const d = await fetchWeather(lat, lon);
    if (reqId !== _reqId) return; // stale — a newer request is in flight
    S.data  = d;
    S.tzOff = d.current.timezone;
    render(d);
    show('dashboard');   // ← only called after successful render
    mockBanner();
  } catch(e) {
    if (reqId !== _reqId) return;
    showErr(e.message || 'Unable to load weather data.');
  }
}

function mockBanner() {
  let b = g('mockBanner');
  if (S.mock) {
    if (!b) {
      b = document.createElement('div'); b.id='mockBanner';
      b.style.cssText='position:fixed;top:58px;left:50%;transform:translateX(-50%);z-index:999;background:linear-gradient(90deg,#f97316,#facc15);color:#000;font-weight:700;font-size:.78rem;padding:6px 20px;border-radius:20px;box-shadow:0 4px 16px rgba(0,0,0,.4);white-space:nowrap;cursor:default';
      b.title='OpenWeatherMap keys take up to 2 hours after signup to activate';
      document.body.appendChild(b);
    }
    b.textContent='⏳ Demo data — API key activates in ~2 h. Refresh for live weather.';
  } else if (b) b.remove();
}

async function searchCity(q) {
  q = q.trim(); if (!q) return;
  hideDD();
  show('loading');
  try {
    const places = await geocity(q);
    const {lat,lon,name,country} = places[0];
    S.city   = `${name}, ${country}`;
    S.coords = {lat,lon};
    addRec(name);
    await load(lat,lon);
  } catch(e) { showErr(e.message); }
}

/* ── GPS ────────────────────────────────────────────── */
function useGPS() {
  if (!navigator.geolocation) { showErr('Geolocation not supported.'); return; }
  show('loading');
  navigator.geolocation.getCurrentPosition(
    async p => {
      const {latitude:lat,longitude:lon} = p.coords;
      S.coords={lat,lon};
      const pl = await revGeo(lat,lon);
      S.city = pl ? `${pl.name}, ${pl.country}` : `${lat.toFixed(2)},${lon.toFixed(2)}`;
      await load(lat,lon);
    },
    e => showErr({1:'Location access denied.',2:'Location unavailable.',3:'Location timed out.'}[e.code]||'Location error.'),
    {timeout:8000}
  );
}

/* ── RENDER DASHBOARD ───────────────────────────────── */
function render({current:c, forecast:fc, aqi}) {
  renderHero(c);
  renderHourly(fc);
  renderForecast(fc);
  renderAQI(aqi);
  renderDetails(c);
  renderFavs();
  setBg(c.weather[0].id, c.dt, c.sys.sunrise, c.sys.sunset);
  startClock();
  updateFavBtn();
}

/* ── HERO ───────────────────────────────────────────── */
function renderHero(c) {
  D.hCity.textContent  = c.name || S.city.split(',')[0];
  D.hCtry.textContent  = c.sys?.country||'';
  D.hDate.textContent  = localDate(c.dt, c.timezone);
  D.hIco.src           = icoUrl(c.weather[0].icon,'4x');
  D.hIco.alt           = c.weather[0].description;
  D.hTemp.textContent  = fmt(c.main.temp);
  D.hCond.textContent  = cap(c.weather[0].description);
  D.hFeels.textContent = `Feels like ${fmt(c.main.feels_like)}`;
  D.hHi.querySelector('span').textContent = fmt(c.main.temp_max);
  D.hLo.querySelector('span').textContent = fmt(c.main.temp_min);
  D.hTZ.textContent    = tzStr(c.timezone);
  D.sH.textContent     = `${c.main.humidity}%`;
  D.sW.textContent     = `${kmh(c.wind.speed)} km/h`;
  D.sV.textContent     = `${(c.visibility/1000).toFixed(1)} km`;
  D.sP.textContent     = `${c.main.pressure} hPa`;
  D.sSr.textContent    = unixFmt(c.sys.sunrise, c.timezone);
  D.sSs.textContent    = unixFmt(c.sys.sunset,  c.timezone);
  D.sCl.textContent    = `${c.clouds.all}%`;
  D.sUV.textContent    = '–';
}

/* ── HOURLY ─────────────────────────────────────────── */
function renderHourly(fc) {
  D.hl.innerHTML = fc.list.slice(0,8).map((h,i)=>`
    <div class="h-item${i===0?' is-now':''}" role="listitem">
      <span class="h-time">${i===0?'Now':unixShort(h.dt,S.tzOff)}</span>
      <img class="h-icon" src="${icoUrl(h.weather[0].icon)}" alt="${h.weather[0].description}" width="34" height="34"/>
      <span class="h-temp">${fmt(h.main.temp)}</span>
      ${h.pop>0.05?`<span class="h-rain">💧${Math.round(h.pop*100)}%</span>`:''}
    </div>`).join('');
}

/* ── 5-DAY FORECAST ─────────────────────────────────── */
function renderForecast(fc) {
  const days={};
  fc.list.forEach(it=>{
    const d=new Date((it.dt+S.tzOff)*1000);
    const k=`${d.getUTCFullYear()}-${d.getUTCMonth()}-${d.getUTCDate()}`;
    (days[k]=days[k]||[]).push(it);
  });
  const entries=Object.values(days).slice(0,5);
  const allT=fc.list.map(i=>i.main.temp);
  const gMin=Math.min(...allT), gMax=Math.max(...allT), gR=gMax-gMin||1;

  D.fl.innerHTML=entries.map((di,i)=>{
    const mid=di.find(x=>{const h=new Date((x.dt+S.tzOff)*1000).getUTCHours();return h>=11&&h<=14;})||di[Math.floor(di.length/2)];
    const ts=di.map(x=>x.main.temp);
    const lo=Math.min(...ts), hi=Math.max(...ts);
    const pop=Math.round(Math.max(...di.map(x=>x.pop||0))*100);
    const bL=((lo-gMin)/gR)*100, bW=Math.max(((hi-lo)/gR)*100,8);
    const label=i===0?'Today':i===1?'Tomorrow':new Date((mid.dt+S.tzOff)*1000).toLocaleDateString('en-US',{weekday:'long',timeZone:'UTC'});
    return `<div class="f-item" role="listitem">
      <span class="f-day">${label}</span>
      <img class="f-icon" src="${icoUrl(mid.weather[0].icon)}" alt="${mid.weather[0].description}" width="34" height="34"/>
      <span class="f-desc">${cap(mid.weather[0].description)}</span>
      <span class="f-rain">${pop>10?'💧'+pop+'%':''}</span>
      <div class="f-bar-wrap">
        <span class="f-min">${fmt(lo)}</span>
        <div class="f-bar"><div class="f-fill" style="margin-left:${bL}%;width:${bW}%"></div></div>
        <span class="f-max">${fmt(hi)}</span>
      </div></div>`;
  }).join('');
}

/* ── AQI ────────────────────────────────────────────── */
const AQI={
  1:{label:'Good',     color:'#4ade80',advice:'Air quality is great — enjoy outdoor activities!'},
  2:{label:'Fair',     color:'#a3e635',advice:'Acceptable air quality. Sensitive groups take care.'},
  3:{label:'Moderate', color:'#facc15',advice:'Moderate pollution. Limit prolonged outdoor exertion.'},
  4:{label:'Poor',     color:'#fb923c',advice:'Unhealthy for all. Reduce outdoor activities.'},
  5:{label:'Very Poor',color:'#f87171',advice:'Very unhealthy! Stay indoors.'},
};
function renderAQI(aqi) {
  if (!aqi?.list?.length){D.ac.hidden=true;return;}
  D.ac.hidden=false;
  const {main:{aqi:idx},components:comp}=aqi.list[0];
  const cfg=AQI[idx]||AQI[1];
  D.aa.style.stroke=cfg.color;
  D.aa.style.strokeDashoffset=173-((idx-1)/4)*173;
  D.an.textContent=idx; D.al.textContent='AQI';
  D.ab.textContent=cfg.label;
  D.ab.style.cssText=`background:${cfg.color}22;color:${cfg.color};border:1px solid ${cfg.color}55;padding:4px 11px;border-radius:20px;font-size:.75rem;font-weight:700`;
  D.av.textContent=cfg.advice;
  D.av.style.cssText=`border-left:3px solid ${cfg.color};background:${cfg.color}11`;
  D.ap.innerHTML=[
    ['PM2.5',comp.pm2_5],['PM10',comp.pm10],['O₃',comp.o3],
    ['NO₂',comp.no2],['SO₂',comp.so2],['CO',comp.co],
  ].map(([n,v])=>`<div class="poll-tile">
    <span class="poll-name">${n}</span>
    <span class="poll-val">${v!=null?+v.toFixed(1):'–'}</span>
    <span class="poll-unit">μg/m³</span></div>`).join('');
}

/* ── DETAILS ────────────────────────────────────────── */
function renderDetails(c) {
  D.dU.textContent='–'; D.uF.style.width='0%'; D.uL.textContent='N/A on free plan';
  const w=kmh(c.wind.speed); D.dW.textContent=`${w} km/h`;
  const deg=c.wind.deg||0;
  D.ca.style.transform=`rotate(${deg}deg)`;
  D.cd.textContent=windDir(deg);
  const h=c.main.humidity; D.dH.textContent=`${h}%`;
  D.hF.style.width=`${h}%`;
  D.hL.textContent=h<30?'Dry':h<60?'Comfortable':h<80?'Humid':'Very Humid';
  const p=c.main.pressure; D.dP.textContent=`${p} hPa`;
  D.pL.textContent=p<1000?'Low':p<1013?'Normal':p<1030?'High':'Very High';
}

/* ── BACKGROUND ─────────────────────────────────────── */
function setBg(id,dt,sr,ss) {
  const night=dt<sr||dt>ss;
  D.bg.className='bg-layer '+(night?'w-night':
    id===800?'w-sunny':id>800?'w-cloudy':
    id>=700?'w-fog':id>=600?'w-snow':
    id>=500?'w-rain':id>=300?'w-rain':'w-storm');
}

/* ── CLOCK ──────────────────────────────────────────── */
function startClock() {
  if(S.clock) clearInterval(S.clock);
  const tick=()=>{
    const now=new Date();
    const loc=new Date(now.getTime()+now.getTimezoneOffset()*60000+S.tzOff*1000);
    D.hClock.textContent=loc.toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',second:'2-digit'});
  };
  tick(); S.clock=setInterval(tick,1000);
}

/* ── UNIT TOGGLE ────────────────────────────────────── */
function setUnit(u) {
  S.unit=u;
  D.bC.classList.toggle('active',u==='C'); D.bF.classList.toggle('active',u==='F');
  D.bC.setAttribute('aria-pressed',u==='C'); D.bF.setAttribute('aria-pressed',u==='F');
  localStorage.setItem('wn_unit',u);
  if(S.data) render(S.data);
}

/* ── THEME ──────────────────────────────────────────── */
function setTheme(t) {
  S.theme=t;
  document.documentElement.setAttribute('data-theme',t);
  D.tIco.className=t==='dark'?'fa-solid fa-moon':'fa-solid fa-sun';
  localStorage.setItem('wn_theme',t);
}

/* ── FAVORITES ──────────────────────────────────────── */
function loadFavs(){try{S.favs=JSON.parse(localStorage.getItem('wn_favs')||'[]');}catch{S.favs=[];}}
function saveFavs(){localStorage.setItem('wn_favs',JSON.stringify(S.favs));}
function toggleFav(){
  if(!S.data) return;
  const c=S.data.current, name=c.name, country=c.sys?.country||'';
  const idx=S.favs.findIndex(f=>f.name===name&&f.country===country);
  if(idx===-1){S.favs.push({name,country,lat:c.coord.lat,lon:c.coord.lon});toast('Added to favorites ❤️','ok');}
  else{S.favs.splice(idx,1);toast('Removed from favorites','inf');}
  saveFavs(); updateFavBtn(); renderFavs();
}
function updateFavBtn(){
  if(!S.data) return;
  const c=S.data.current;
  const on=S.favs.some(f=>f.name===c.name&&f.country===(c.sys?.country||''));
  D.fb.classList.toggle('is-fav',on);
  D.fi.className=on?'fa-solid fa-heart':'fa-regular fa-heart';
}
function renderFavs(){
  if(!S.favs.length){D.fs.hidden=true;return;}
  D.fs.hidden=false;
  D.fg.innerHTML=S.favs.map((f,i)=>`
    <div class="fav-card" role="listitem" tabindex="0"
         data-lat="${f.lat}" data-lon="${f.lon}" data-i="${i}">
      <span class="fav-city">${f.name}</span>
      <span class="fav-ctry">${f.country}</span>
      <span class="fav-temp">–</span>
      <button class="fav-del" data-i="${i}" aria-label="Remove ${f.name}">
        <i class="fa-solid fa-xmark" aria-hidden="true"></i>
      </button>
    </div>`).join('');
  D.fg.querySelectorAll('.fav-card').forEach(el=>{
    el.addEventListener('click',e=>{
      if(e.target.closest('.fav-del'))return;
      load(+el.dataset.lat,+el.dataset.lon);
    });
    el.addEventListener('keydown',e=>{if(e.key==='Enter')el.click();});
  });
  D.fg.querySelectorAll('.fav-del').forEach(btn=>{
    btn.addEventListener('click',e=>{
      e.stopPropagation();
      S.favs.splice(+btn.dataset.i,1); saveFavs(); renderFavs(); updateFavBtn();
    });
  });
}

/* ── RECENT ─────────────────────────────────────────── */
function loadRec(){try{S.recent=JSON.parse(localStorage.getItem('wn_rec')||'[]');}catch{S.recent=[];}}
function saveRec(){localStorage.setItem('wn_rec',JSON.stringify(S.recent));}
function addRec(city){
  S.recent=[city,...S.recent.filter(c=>c.toLowerCase()!==city.toLowerCase())].slice(0,CFG.MAX_REC);
  saveRec();
}
function showRecPanel(){
  if(!S.recent.length){D.rp.hidden=true;return;}
  D.rp.hidden=false;
  D.rc.innerHTML=S.recent.map(c=>`<button class="r-chip">${c}</button>`).join('');
  D.rc.querySelectorAll('.r-chip').forEach(b=>{
    b.addEventListener('click',()=>{D.si.value=b.textContent;hideDD();searchCity(b.textContent);});
  });
}

/* ── SUGGESTIONS ────────────────────────────────────── */
let debT=null;
async function showSugg(q) {
  if(q.length<2){D.sl.hidden=true;return;}
  try {
    const ps=await geocity(q);
    D.sl.hidden=false;
    D.sl.innerHTML=ps.map((p,i)=>`
      <li class="sugg-item" role="option" tabindex="0"
          data-lat="${p.lat}" data-lon="${p.lon}"
          data-name="${p.name}, ${p.country}">
        <i class="fa-solid fa-location-dot" aria-hidden="true"></i>
        <div>
          <div class="sugg-name">${p.name}</div>
          <div class="sugg-sub">${[p.state,p.country].filter(Boolean).join(', ')}</div>
        </div>
      </li>`).join('');
    D.sl.querySelectorAll('.sugg-item').forEach(li=>{
      const sel=()=>{
        const{lat,lon,name}=li.dataset;
        D.si.value=name; S.city=name; S.coords={lat:+lat,lon:+lon};
        addRec(name.split(',')[0]); hideDD(); load(+lat,+lon);
      };
      li.addEventListener('click',sel);
      li.addEventListener('keydown',e=>{if(e.key==='Enter')sel();});
    });
  } catch{D.sl.hidden=true;}
}
function hideDD(){D.sl.hidden=true;D.rp.hidden=true;}

/* ── TOAST ──────────────────────────────────────────── */
function toast(msg,type='inf',dur=3500){
  const d=document.createElement('div');
  d.className=`toast t-${type}`;
  d.innerHTML=`<span>${{ok:'✅',err:'❌',inf:'ℹ️'}[type]}</span><span>${msg}</span>`;
  D.tw.appendChild(d);
  setTimeout(()=>{d.classList.add('out');d.addEventListener('animationend',()=>d.remove());},dur);
}

/* ── PARTICLES ──────────────────────────────────────── */
function particles(n=20){
  D.bgP.innerHTML='';
  for(let i=0;i<n;i++){
    const p=document.createElement('div'); p.className='particle';
    p.style.cssText=`left:${Math.random()*100}%;bottom:${Math.random()*15}%;
      width:${2+Math.random()*3}px;height:${2+Math.random()*3}px;
      opacity:${.3+Math.random()*.5};
      animation-duration:${8+Math.random()*12}s;
      animation-delay:-${Math.random()*12}s`;
    D.bgP.appendChild(p);
  }
}

/* ── POPULAR CHIPS ──────────────────────────────────── */
function renderPop(){
  D.pc.innerHTML=CFG.POPULAR.map(c=>`<button class="pop-chip">${c}</button>`).join('');
  D.pc.querySelectorAll('.pop-chip').forEach(b=>b.addEventListener('click',()=>searchCity(b.textContent)));
}

/* ── UTILS ──────────────────────────────────────────── */
const fmt   = c => S.unit==='F' ? `${Math.round(c*9/5+32)}°F` : `${Math.round(c)}°C`;
const kmh   = ms => Math.round(ms*3.6);
const icoUrl= (code,sz='2x') => `${CFG.ICON}/${code}@${sz}.png`;
const cap   = s => s ? s[0].toUpperCase()+s.slice(1) : s;

function unixFmt(ts,tz){
  return new Date((ts+tz)*1000).toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit',timeZone:'UTC'});
}
function unixShort(ts,tz){
  const h=new Date((ts+tz)*1000).getUTCHours();
  return `${h%12||12}${h>=12?'PM':'AM'}`;
}
function localDate(ts,tz){
  return new Date((ts+tz)*1000).toLocaleDateString('en-US',{weekday:'long',month:'long',day:'numeric',timeZone:'UTC'});
}
function tzStr(off){
  const h=Math.floor(Math.abs(off)/3600), m=Math.floor((Math.abs(off)%3600)/60);
  return `UTC${off>=0?'+':'-'}${h}${m?':'+String(m).padStart(2,'0'):''}`;
}
function windDir(deg){
  return ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'][Math.round(deg/22.5)%16];
}

/* ── EVENTS ─────────────────────────────────────────── */
function bindEvents(){
  D.si.addEventListener('input',e=>{
    const v=e.target.value.trim();
    D.sc.hidden=!v;
    clearTimeout(debT);
    if(v.length>=2) debT=setTimeout(()=>showSugg(v),320);
    else{ D.sl.hidden=true; if(!v&&S.recent.length) showRecPanel(); }
  });
  D.si.addEventListener('focus',()=>{if(!D.si.value.trim()&&S.recent.length)showRecPanel();});
  D.si.addEventListener('keydown',e=>{
    if(e.key==='Enter'){hideDD();searchCity(D.si.value);}
    if(e.key==='Escape')hideDD();
  });
  D.sc.addEventListener('click',()=>{D.si.value='';D.sc.hidden=true;D.sl.hidden=true;D.si.focus();});
  D.sb.addEventListener('click',()=>{hideDD();searchCity(D.si.value);});
  D.cr.addEventListener('click',()=>{S.recent=[];saveRec();D.rp.hidden=true;});
  D.gps.addEventListener('click',useGPS);
  D.wgps.addEventListener('click',useGPS);
  D.bC.addEventListener('click',()=>setUnit('C'));
  D.bF.addEventListener('click',()=>setUnit('F'));
  D.tBtn.addEventListener('click',()=>setTheme(S.theme==='dark'?'light':'dark'));
  D.fb.addEventListener('click',toggleFav);
  D.er.addEventListener('click',()=>{if(S.coords)load(S.coords.lat,S.coords.lon);else show('welcome');});
  document.addEventListener('click',e=>{if(!e.target.closest('.search-wrapper'))hideDD();});
}

/* ── INIT ───────────────────────────────────────────── */
function init(){
  loadFavs(); loadRec();
  setUnit(localStorage.getItem('wn_unit')||'C');
  setTheme(localStorage.getItem('wn_theme')||'dark');
  renderPop(); particles(); bindEvents();
  /* Auto-load London on startup */
  load(51.5074, -0.1278);
}

document.addEventListener('DOMContentLoaded', init);

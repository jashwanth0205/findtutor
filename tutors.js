function populateSubjects(){
  const select = document.getElementById('subject');
  SUBJECTS.forEach(s=>{ const o=document.createElement('option'); o.value=s; o.textContent=s; select.appendChild(o); });
}
function createPlaceholder(){
  const select = document.getElementById('subject');
  if(!select.querySelector('option[value=""]')){
    const o=document.createElement('option'); o.value=""; o.textContent="Select subject"; o.disabled=true; o.selected=true; select.prepend(o);
  }
}
function renderResults(items){
  const box = document.getElementById('results');
  box.innerHTML='';
  if(!items.length){ box.innerHTML = '<div class="card">No tutors found.</div>'; return; }
  items.forEach(t=>{
    const el = document.createElement('div');
    el.className='result-card';
    el.innerHTML = `<strong>${t.name}</strong><span>Subject: ${t.subject}</span><span>Location: ${t.location}</span><span>Rating: ${t.rating}</span><a class="btn" href="${WHATSAPP_URL}" target="_blank">Contact on WhatsApp</a>`;
    box.appendChild(el);
  });
}
function handleSearch(){
  const form = document.getElementById('searchForm');
  form.addEventListener('submit',(e)=>{
    e.preventDefault();
    const loc = document.getElementById('location').value.trim().toLowerCase();
    const subj = document.getElementById('subject').value;
    if(!subj) return;
    const tutors = getTutors();
    const filtered = tutors.filter(t=> t.subject===subj && t.location.toLowerCase().includes(loc));
    renderResults(filtered);
  });
}
async function reverseGeocode(lat,lon){
  try{
    const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`);
    const data = await res.json();
    const city = data.address?.city || data.address?.town || data.address?.village || data.address?.suburb || data.address?.state || "";
    return city;
  }catch(e){
    return "";
  }
}
function detectLocation(){
  const btn = document.getElementById('detectLocationBtn');
  const input = document.getElementById('location');
  if(btn){
    btn.addEventListener('click',()=>{
      if(!navigator.geolocation){ return; }
      navigator.geolocation.getCurrentPosition(async (pos)=>{
        const loc = await reverseGeocode(pos.coords.latitude,pos.coords.longitude);
        if(loc){ input.value = loc; }
      });
    });
  }
}
function attemptAutoDetect(){
  const input = document.getElementById('location');
  if(!navigator.geolocation) return;
  navigator.geolocation.getCurrentPosition(async (pos)=>{
    const loc = await reverseGeocode(pos.coords.latitude,pos.coords.longitude);
    if(loc){ input.value = loc; }
  });
}
async function fetchSuggestions(q){
  try{
    const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(q)}&format=json&limit=5`;
    const res = await fetch(url);
    const data = await res.json();
    return data.map(d=>d.display_name.split(',')[0]);
  }catch(e){
    return [];
  }
}
function unique(arr){ return Array.from(new Set(arr)); }
function locationAutocomplete(){
  const input = document.getElementById('location');
  const box = document.getElementById('locationSuggestions');
  input.addEventListener('input', async ()=>{
    const q = input.value.trim().toLowerCase();
    if(!q){ box.classList.remove('active'); box.innerHTML=''; return; }
    const local = LOCATIONS.filter(l=>l.toLowerCase().includes(q));
    let remote = [];
    if(q.length>=3){ remote = await fetchSuggestions(q); }
    const merged = unique([...local, ...remote]).slice(0,8);
    if(!merged.length){ box.classList.remove('active'); box.innerHTML=''; return; }
    box.classList.add('active');
    box.innerHTML = merged.map(m=>`<div class="suggestion-item" data-v="${m}">${m}</div>`).join('');
    Array.from(box.querySelectorAll('.suggestion-item')).forEach(el=>{
      el.addEventListener('click',()=>{ input.value = el.dataset.v; box.classList.remove('active'); box.innerHTML=''; });
    });
  });
}
document.addEventListener('DOMContentLoaded',()=>{ requireAuth(); populateSubjects(); createPlaceholder(); handleSearch(); detectLocation(); attemptAutoDetect(); locationAutocomplete(); });
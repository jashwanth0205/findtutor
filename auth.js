function switchTabs(){
  const tabs = document.querySelectorAll('.tab');
  const panels = document.querySelectorAll('.panel');
  tabs.forEach(t=>t.addEventListener('click',()=>{
    tabs.forEach(x=>x.classList.remove('active'));
    t.classList.add('active');
    panels.forEach(p=>p.classList.remove('active'));
    document.getElementById(t.dataset.tab).classList.add('active');
  }));
}
async function handleSignup(){
  const form = document.getElementById('signupForm');
  const error = document.getElementById('signupError');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    error.textContent='';
    const name = document.getElementById('signupName').value.trim();
    const email = document.getElementById('signupEmail').value.trim().toLowerCase();
    const password = document.getElementById('signupPassword').value;
    if(!name||!email||!password){ error.textContent='All fields are required.'; return; }
    const users = getUsers();
    if(users.find(u=>u.email===email)){ error.textContent='Email already registered.'; return; }
    const hash = await sha256(password);
    users.push({ id: Date.now(), name, email, passwordHash: hash });
    setUsers(users);
    setAuth({ email, name });
    window.location.replace('home.html');
  });
}
async function handleLogin(){
  const form = document.getElementById('loginForm');
  const error = document.getElementById('loginError');
  form.addEventListener('submit', async (e)=>{
    e.preventDefault();
    error.textContent='';
    const email = document.getElementById('loginEmail').value.trim().toLowerCase();
    const password = document.getElementById('loginPassword').value;
    const users = getUsers();
    const hash = await sha256(password);
    const user = users.find(u=>u.email===email && u.passwordHash===hash);
    if(!user){ error.textContent='Invalid email or password.'; return; }
    setAuth({ email: user.email, name: user.name });
    window.location.replace('home.html');
  });
}
document.addEventListener('DOMContentLoaded',()=>{ switchTabs(); handleSignup(); handleLogin(); });
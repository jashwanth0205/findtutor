document.addEventListener('DOMContentLoaded',()=>{
  requireAuth();
  const auth = getAuth();
  const title = document.getElementById('welcomeTitle');
  if(title && auth){ title.textContent = `Welcome, ${auth.name}`; }
});
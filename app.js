const WHATSAPP_NUMBER = "7995497057";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER}`;
const SUBJECTS = ["Math","Science","English","Programming","Music","Art","History","Physics","Chemistry","Biology"];
const LOCATIONS = [
  "Kompally","Kondapur","Kukatpally","Madhapur","Gachibowli","Secunderabad","Begumpet","Banjara Hills","Jubilee Hills","Ameerpet",
  "Dilsukhnagar","LB Nagar","Hitech City","Mehdipatnam","Tolichowki","Alwal","Attapur","Nizampet","Bowenpally","Khairatabad",
  "Hyderabad","Warangal","Nizamabad","Karimnagar","Sangareddy","Shamshabad","Kondapur Village","Kompalle","Kom","Komarabanda"
];
function initWhatsappFab(){
  const fab = document.getElementById("whatsappFab");
  if(!fab) return;
  fab.addEventListener("click",()=>{ window.location.href = WHATSAPP_URL });
}
function ensureTutorSeed(){
  if(localStorage.getItem("tutolink:tutors")) return;
  const sample = [
    { id:1,name:"Ravi Kumar",subject:"Math",location:"Hyderabad",rating:4.7,phone:"7995497057" },
    { id:2,name:"Anita Sharma",subject:"Science",location:"Hyderabad",rating:4.6,phone:"7995497057" },
    { id:3,name:"John Doe",subject:"English",location:"Secunderabad",rating:4.5,phone:"7995497057" },
    { id:4,name:"Priya Singh",subject:"Programming",location:"Gachibowli",rating:4.8,phone:"7995497057" },
    { id:5,name:"Rahul Verma",subject:"Physics",location:"Madhapur",rating:4.4,phone:"7995497057" }
  ];
  localStorage.setItem("tutolink:tutors", JSON.stringify(sample));
}
function getTutors(){
  const raw = localStorage.getItem("tutolink:tutors");
  return raw ? JSON.parse(raw) : [];
}
function setAuth(user){
  localStorage.setItem("tutolink:auth", JSON.stringify(user));
}
function getAuth(){
  const raw = localStorage.getItem("tutolink:auth");
  return raw ? JSON.parse(raw) : null;
}
function clearAuth(){
  localStorage.removeItem("tutolink:auth");
}
async function sha256(text){
  const enc = new TextEncoder().encode(text);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b=>b.toString(16).padStart(2,"0")).join("");
}
function getUsers(){
  const raw = localStorage.getItem("tutolink:users");
  return raw ? JSON.parse(raw) : [];
}
function setUsers(users){
  localStorage.setItem("tutolink:users", JSON.stringify(users));
}
function requireAuth(){
  if(!getAuth()) window.location.replace("index.html");
}
function logoutHandler(){
  const btn = document.getElementById("logoutBtn");
  if(btn){ btn.addEventListener("click",()=>{ clearAuth(); window.location.replace("index.html"); }); }
}
document.addEventListener("DOMContentLoaded",()=>{ initWhatsappFab(); ensureTutorSeed(); logoutHandler(); });
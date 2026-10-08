const state={rel:"",receiver:"",sender:"",occasion:"Birthday",letter:"",vibe:"dreamy",questions:[]};
let step=1,qIndex=0;

const $=id=>document.getElementById(id);
function go(id){document.querySelectorAll(".screen").forEach(s=>s.classList.remove("active"));$(id).classList.add("active");window.scrollTo(0,0)}
function setStep(n){step=n;document.querySelectorAll(".form-step").forEach(s=>s.classList.toggle("active",+s.dataset.step===n));$("progress").style.width=(n*25)+"%";$("stepNo").textContent=n+"/4"}
function nextStep(){
  if(step===1&&!state.rel)return;
  if(step===2){state.receiver=$("receiver").value.trim();state.sender=$("sender").value.trim();state.occasion=$("occasion").value;if(!state.receiver||!state.sender){toast("Add both names first ✨");return}}
  if(step===3){state.letter=$("letter").value.trim();state.vibe=$("vibe").value;if(!state.letter){toast("Write a little something first 💌");return}}
  if(step<4){step++;setStep(step)}
}
function preview(){
  state.questions=[$("q1").value.trim(),$("q2").value.trim(),$("q3").value.trim()].filter(Boolean);
  $("pReceiver").textContent=state.receiver;$("pOccasion").textContent=state.occasion+" surprise";
  go("preview");
}
document.querySelectorAll(".choice").forEach(b=>b.addEventListener("click",()=>{document.querySelectorAll(".choice").forEach(x=>x.classList.remove("selected"));b.classList.add("selected");state.rel=b.dataset.rel;$("next1").disabled=false}));
$("letter").addEventListener("input",()=>{$("count").textContent=$("letter").value.length});
function showQuestions(){qIndex=0;renderQuestion();go("questions")}
function renderQuestion(){
  const qs=state.questions.length?state.questions:["Who is the best person ever?","Who deserves all the happiness?","Who would I choose again and again?"];
  $("qLabel").textContent=`Question ${qIndex+1} of ${qs.length}`;$("questionText").textContent=qs[qIndex];
}
function answer(btn){
  btn.style.borderColor="#e4a8c1";btn.style.background="#e4a8c11a";
  setTimeout(()=>{qIndex++;const total=state.questions.length||3;if(qIndex>=total){$("rReceiver").textContent=state.receiver;go("reveal")}else renderQuestion()},350)
}
function openLetter(){
  $("lOccasion").textContent=state.occasion+" · for my "+state.rel.toLowerCase();
  $("lReceiver").textContent=state.receiver;$("lText").textContent=state.letter;$("lSender").textContent=state.sender;go("letterScreen");
}
function encodeData(){
  const payload={...state,v:1};
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload)))).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"");
}
function decodeData(s){
  try{return JSON.parse(decodeURIComponent(escape(atob(s.replace(/-/g,"+").replace(/_/g,"/")))))}catch(e){return null}
}
function showShare(){
  const url=location.origin+location.pathname+"#letter="+encodeData();
  $("shareLink").textContent=url;$("sReceiver").textContent=state.receiver;$("qr").innerHTML="";
  if(window.QRCode)new QRCode($("qr"),{text:url,width:160,height:160,colorDark:"#30252e",colorLight:"#ffffff"});
  go("share");
}
async function copyLink(){try{await navigator.clipboard.writeText($("shareLink").textContent);toast("Link copied 💌")}catch(e){toast("Long-press the link to copy")}}
async function nativeShare(){const url=$("shareLink").textContent;if(navigator.share){await navigator.share({title:`A little surprise for ${state.receiver}`,text:"Someone made something special for you 💌",url})}else copyLink()}
function toast(t){$("toast").textContent=t;$("toast").classList.add("show");setTimeout(()=>$("toast").classList.remove("show"),1800)}

function loadShared(){
  if(!location.hash.startsWith("#letter="))return;
  const d=decodeData(location.hash.slice(8));if(!d)return;
  Object.assign(state,d);$("rReceiver").textContent=state.receiver;$("lOccasion").textContent=state.occasion+" · for my "+state.rel.toLowerCase();$("lReceiver").textContent=state.receiver;$("lText").textContent=state.letter;$("lSender").textContent=state.sender;
  go("preview");$("pReceiver").textContent=state.receiver;$("pOccasion").textContent=state.occasion+" surprise";
}
loadShared();

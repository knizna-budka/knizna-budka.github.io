const map=L.map("map").setView([48.1486,17.1077],13);
L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png",{attribution:"&copy; OpenStreetMap contributors"}).addTo(map);
let budky=[],userMarker=null,nearestMarker=null;
const navrhyKey="knizne-budky-navrhy";
const navrhy=JSON.parse(localStorage.getItem(navrhyKey)||"[]");
function pridajMarker(b,navrh=false){const marker=L.marker([b.lat,b.lng]).addTo(map).bindPopup("");marker.bindPopup(document.createTextNode(b.nazov));if(navrh)marker.bindTooltip("Návrh (uložený v tomto zariadení)");return marker;}
fetch("budky.json").then(r=>r.json()).then(data=>{budky=data.concat(navrhy);data.forEach(b=>pridajMarker(b));navrhy.forEach(b=>pridajMarker(b,true));}).catch(()=>{document.getElementById("status").textContent="Zoznam búdok sa nepodarilo načítať.";});
const nearestButton=document.getElementById("btn");
const status=document.getElementById("status");
function locationUnavailableMessage(){
if(!window.isSecureContext)return "Poloha funguje len cez zabezpečené HTTPS. Otvor aplikáciu v Safari alebo Chrome.";
if(!navigator.geolocation)return "Tento prehliadač nepodporuje určovanie polohy.";
return "";
}
function updateLocationAvailability(){
const reason=locationUnavailableMessage();
nearestButton.disabled=Boolean(reason);
nearestButton.title=reason;
if(reason)status.textContent=reason;
}
updateLocationAvailability();
function getLocation(onSuccess,onError){
const reason=locationUnavailableMessage();
if(reason){onError({kind:!window.isSecureContext?"insecure":"unsupported",message:reason});return;}
navigator.geolocation.getCurrentPosition(onSuccess,error=>{
const messages={
1:"Prístup k polohe bol zamietnutý. Povoľ ho v nastaveniach prehliadača alebo otvor aplikáciu v Safari/Chrome.",
2:"Poloha nie je momentálne dostupná. Skús to znova alebo pokračuj bez GPS.",
3:"Zisťovanie polohy trvalo príliš dlho. Skús to znova alebo pokračuj bez GPS."
};
onError({kind:error.code===1?"denied":"unavailable",message:messages[error.code]||"Polohu sa nepodarilo zistiť. Skús to znova alebo pokračuj bez GPS."});
},{enableHighAccuracy:true,timeout:15000,maximumAge:60000});
}
const form=document.getElementById("add-form"),locationStatus=document.getElementById("location-status");
document.getElementById("btn").addEventListener("click",najdiNajblizsiu);
document.getElementById("add-btn").addEventListener("click",()=>{form.hidden=false;document.getElementById("booth-name").focus();});
document.getElementById("close-form").addEventListener("click",()=>{form.hidden=true;});
document.getElementById("location-btn").addEventListener("click",()=>{
locationStatus.textContent="Zisťujem tvoju polohu…";
getLocation(pos=>{
document.getElementById("latitude").value=pos.coords.latitude.toFixed(6);
document.getElementById("longitude").value=pos.coords.longitude.toFixed(6);
locationStatus.textContent="Poloha je vyplnená. Pred uložením môžeš súradnice upraviť.";
},error=>{locationStatus.textContent=error.message;});
});
form.addEventListener("submit",event=>{
event.preventDefault();
if(!form.reportValidity())return;
const navrh={nazov:document.getElementById("booth-name").value.trim(),lat:Number(document.getElementById("latitude").value),lng:Number(document.getElementById("longitude").value)};
if(!navrh.nazov)return;
try{navrhy.push(navrh);localStorage.setItem(navrhyKey,JSON.stringify(navrhy));}catch(error){locationStatus.textContent="Návrh sa nepodarilo uložiť v tomto zariadení.";return;}
budky.push(navrh);pridajMarker(navrh,true).openPopup();map.flyTo([navrh.lat,navrh.lng],16);form.reset();form.hidden=true;locationStatus.textContent="Návrh je uložený v tomto zariadení.";
});
function najdiNajblizsiu(){
status.textContent="Hľadám najbližšiu búdku…";
getLocation(pos=>{
const lat=pos.coords.latitude,lng=pos.coords.longitude;
if(userMarker)map.removeLayer(userMarker);
userMarker=L.circleMarker([lat,lng],{radius:8,color:"blue",fillOpacity:1}).addTo(map);
let min=Infinity,n=null;
budky.forEach(b=>{const d=map.distance([lat,lng],[b.lat,b.lng]);if(d<min){min=d;n=b;}});
if(!n){status.textContent="Zatiaľ nemáme uložené žiadne búdky.";return;}
if(nearestMarker)map.removeLayer(nearestMarker);
nearestMarker=L.circle([n.lat,n.lng],{radius:50,color:"green"}).addTo(map);
map.flyTo([n.lat,n.lng],16);
status.innerHTML=`<strong>${n.nazov}</strong><br>Vzdialenosť: ${Math.round(min)} m<br><a class="nav-button" target="_blank" rel="noopener" href="https://maps.google.com/?q=${n.lat},${n.lng}">Navigovať</a>`;
},error=>{status.textContent=error.message;});
}

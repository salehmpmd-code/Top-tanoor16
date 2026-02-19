
let hero=document.getElementById('hero');
let menuDiv=document.getElementById('menu');

async function load(){
 const settings=await fetch('/api/settings').then(r=>r.json());
 const items=await fetch('/api/items').then(r=>r.json());

 let i=0;
 if(settings.heroImages.length){
   hero.style.backgroundImage=`url(${settings.heroImages[0]})`;
   setInterval(()=>{
     i=(i+1)%settings.heroImages.length;
     hero.style.backgroundImage=`url(${settings.heroImages[i]})`;
   },3000);
 }

 menuDiv.innerHTML="";
 items.forEach(item=>{
   menuDiv.innerHTML+=`
   <div class="card">
     <img src="${item.image}" />
     <h3>${item.name}</h3>
     <p>${item.description}</p>
     <strong>${item.price} تومان</strong>
   </div>`;
 });
}
load();

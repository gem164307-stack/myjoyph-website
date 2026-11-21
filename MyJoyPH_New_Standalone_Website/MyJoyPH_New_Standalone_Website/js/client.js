(() => {
const $=id=>document.getElementById(id), cfg=window.MYJOYPH;
$("year").textContent=new Date().getFullYear();
$("addressText").textContent=cfg.BUSINESS_ADDRESS;
const mapUrl="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(cfg.BUSINESS_ADDRESS);
$("directions").href=mapUrl;$("mapMore").href=mapUrl;$("facebook").href=cfg.FACEBOOK_URL;
const escape=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const price=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:cfg.CURRENCY}).format(Number(n)||0);
let menu=[],category="all";
function render(){
 const term=$("search").value.toLowerCase().trim();
 const list=menu.filter(x=>(category==="all"||x.category===category)&&(!term||`${x.name} ${x.description||""} ${x.category}`.toLowerCase().includes(term)));
 $("menuGrid").innerHTML=list.length?list.map(x=>`<article class="dish"><div class="dish-photo">${x.image_url?`<img src="${escape(x.image_url)}" alt="${escape(x.name)}" loading="lazy">`:'<span>✳</span>'}<small>${escape(x.category)}</small></div><div class="dish-info"><div><h3>${escape(x.name)}</h3><p>${escape(x.description||"A tasty MyJoyPH favorite.")}</p></div><b>${price(x.price)}</b></div></article>`).join(""):'<div class="empty"><b>Nothing here just yet.</b><p>Try a different search or category.</p></div>';
}
function renderCats(){
 const cats=[...new Set(menu.map(x=>x.category).filter(Boolean))].sort();
 $("categories").innerHTML=`<button class="category ${category==="all"?"active":""}" data-cat="all">Everything</button>`+cats.map(c=>`<button class="category ${category===c?"active":""}" data-cat="${escape(c)}">${escape(c)}</button>`).join("");
}
$("categories").addEventListener("click",e=>{const b=e.target.closest("[data-cat]");if(!b)return;category=b.dataset.cat;renderCats();render();});
$("search").addEventListener("input",render);
async function load(){
 if(!window.myjoyDb){$("menuGrid").innerHTML='<p class="status">Supabase client did not initialize. Check your configuration.</p>';return;}
 const {data,error}=await myjoyDb.from("menu_items").select("id,name,description,price,category,image_url,is_available").eq("is_available",true).order("created_at",{ascending:false});
 if(error){console.error(error);$("menuGrid").innerHTML='<p class="status">Menu setup is not complete yet. Follow SETUP.md to create the database tables.</p>';return;}
 menu=data||[];renderCats();render();if(!menu.length)$("menuStatus").textContent="Our menu is being updated. Please check back soon.";
}
load();
})();
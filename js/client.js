/*(() => {
const $=id=>document.getElementById(id), cfg=window.MYJOYPH;
$("year").textContent=new Date().getFullYear();
$("addressText").textContent=cfg.BUSINESS_ADDRESS;
const mapUrl="3rd level, ayala center cebu, Cebu City, 6000 Cebu"+encodeURIComponent(cfg.BUSINESS_ADDRESS);
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
*/

/*const address = window.MYJOYPH.BUSINESS_ADDRESS;
const facebookUrl = window.MYJOYPH.FACEBOOK_URL;

const mapsUrl = `https://maps.app.goo.gl/xcty6V6oXdkuwMb18=${encodeURIComponent(address)}`;

document.getElementById("addressText").textContent = address;

document.getElementById("directions").href = mapsUrl;
document.getElementById("mapMore").href = mapsUrl;

document.getElementById("facebook").href = facebookUrl;*/


/*const address = window.MYJOYPH.BUSINESS_ADDRESS;

const mapsUrl =
  "3rd level, ayala center cebu, Cebu City, 6000 Cebu" +
  encodeURIComponent(address);

document.getElementById("directions").href = mapsUrl;
document.getElementById("mapMore").href = mapsUrl;

*/


(() => {
  const $ = id => document.getElementById(id);
  const cfg = window.MYJOYPH;

  $("year").textContent = new Date().getFullYear();

  // MyJoy Ayala Center Cebu - exact Google Maps location
  const googleMapsUrl =
    "https://www.google.com/maps/place/My+Joy+Ayala+Center+Cebu/@10.31754,123.9057056,17z/data=!3m1!4b1!4m6!3m5!1s0x33a99967b51affcb:0x7f2c6c20a0a391f8!8m2!3d10.31754!4d123.9057056!16s%2Fg%2F11fj17crn_?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D";

  const directionsUrl =
    "https://www.google.com/maps/dir//3rd+level,+My+Joy+Ayala+Center+Cebu,+ayala+center+cebu,+Cebu+City,+6000+Cebu/@10.31754,123.9057056,17z/data=!4m16!1m7!3m6!1s0x33a99967b51affcb:0x7f2c6c20a0a391f8!2sMy+Joy+Ayala+Center+Cebu!8m2!3d10.31754!4d123.9057056!16s%2Fg%2F11fj17crn_!4m7!1m0!1m5!1m1!1s0x33a99967b51affcb:0x7f2c6c20a0a391f8!2m2!1d123.9057056!2d10.31754?entry=ttu&g_ep=EgoyMDI2MTExOC4xIKXMDSoASAFQAw%3D%3D";

  $("addressText").textContent = cfg.BUSINESS_ADDRESS;

  $("directions").href = directionsUrl;
  $("mapMore").href = googleMapsUrl;
  $("facebook").href = cfg.FACEBOOK_URL;

  // Make the entire Visit MyJoyPH card clickable
  const locationCard = document.querySelector(".location-card");

  if (locationCard) {
    locationCard.style.cursor = "pointer";

    locationCard.addEventListener("click", e => {
      if (e.target.closest("a")) return;
      window.open(googleMapsUrl, "_blank", "noopener");
    });
  }

  const escape = s => String(s ?? "").replace(/[&<>"']/g, c => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  }[c]));

  const price = n => new Intl.NumberFormat("en-PH", {
    style: "currency",
    currency: cfg.CURRENCY
  }).format(Number(n) || 0);

  let menu = [], category = "all";

  function render() {
    const term = $("search").value.toLowerCase().trim();

    const list = menu.filter(x =>
      (category === "all" || x.category === category) &&
      (!term || `${x.name} ${x.description || ""} ${x.category}`
        .toLowerCase().includes(term))
    );

    $("menuGrid").innerHTML = list.length
      ? list.map(x => `
        <article class="dish">
          <div class="dish-photo">
            ${x.image_url
              ? `<img src="${escape(x.image_url)}" alt="${escape(x.name)}" loading="lazy">`
              : `<span>✳</span>`}
            <small>${escape(x.category)}</small>
          </div>
          <div class="dish-info">
            <div>
              <h3>${escape(x.name)}</h3>
              <p>${escape(x.description || "A tasty MyJoyPH favorite.")}</p>
            </div>
            <b>${price(x.price)}</b>
          </div>
        </article>
      `).join("")
      : `
        <div class="empty">
          <b>Nothing here just yet.</b>
          <p>Try a different search or category.</p>
        </div>
      `;
  }

  function renderCats() {
    const cats = [...new Set(menu.map(x => x.category).filter(Boolean))].sort();

    $("categories").innerHTML =
      `<button class="category ${category === "all" ? "active" : ""}" data-cat="all">Everything</button>` +
      cats.map(c =>
        `<button class="category ${category === c ? "active" : ""}" data-cat="${escape(c)}">${escape(c)}</button>`
      ).join("");
  }

  $("categories").addEventListener("click", e => {
    const b = e.target.closest("[data-cat]");
    if (!b) return;

    category = b.dataset.cat;
    renderCats();
    render();
  });

  $("search").addEventListener("input", render);

  async function load() {
    if (!window.myjoyDb) {
      $("menuGrid").innerHTML =
        '<p class="status">Supabase client did not initialize. Check your configuration.</p>';
      return;
    }

    const { data, error } = await myjoyDb
      .from("menu_items")
      .select("id,name,description,price,category,image_url,is_available")
      .eq("is_available", true)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      $("menuGrid").innerHTML =
        '<p class="status">Menu setup is not complete yet. Follow SETUP.md to create the database tables.</p>';
      return;
    }

    menu = data || [];
    renderCats();
    render();

    if (!menu.length) {
      $("menuStatus").textContent =
        "Our menu is being updated. Please check back soon.";
    }
  }

  load();
})();

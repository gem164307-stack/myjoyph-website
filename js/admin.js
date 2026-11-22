(() => {
const $=id=>document.getElementById(id), db=window.myjoyDb, cfg=window.MYJOYPH;
let rows=[],picked=null,existingImage=null;
const esc=s=>String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const price=n=>new Intl.NumberFormat("en-PH",{style:"currency",currency:cfg.CURRENCY}).format(Number(n)||0);
function say(id,msg,bad=false){$(id).textContent=msg;$(id).className="status "+(bad?"bad":"");}
function visible(yes){$("login").classList.toggle("hidden",yes);$("panel").classList.toggle("hidden",!yes);}
async function authorized(){
 const {data:{user}}=await db.auth.getUser();if(!user)return false;
 const {data,error}=await db.from("site_admins").select("user_id").eq("user_id",user.id).maybeSingle();
 return !error&&!!data;
}
async function refresh(){
 const {data,error}=await db.from("menu_items").select("*").order("created_at",{ascending:false});
 if(error){say("formStatus",error.message,true);return;}rows=data||[];$("total").textContent=`${rows.length} item${rows.length===1?"":"s"}`;
 $("items").innerHTML=rows.length?rows.map(x=>`<div class="inventory-row"><div class="tiny-photo">${x.image_url?`<img src="${esc(x.image_url)}" alt="">`:"✳"}</div><div class="row-info"><b>${esc(x.name)}</b><span>${esc(x.category)} · ${price(x.price)}</span><small class="${x.is_available?"yes":"no"}">${x.is_available?"● Visible":"○ Hidden"}</small></div><div class="row-actions"><button data-edit="${esc(x.id)}">Edit</button><button data-remove="${esc(x.id)}">Delete</button></div></div>`).join(""):'<p class="hint">No menu items yet. Add the first one using the form.</p>';
}
function reset(){ $("itemForm").reset();$("itemId").value="";$("available").checked=true;$("bestSeller").checked=false;picked=null;existingImage=null;$("preview").classList.add("hidden");$("preview").innerHTML="";$("editorTitle").textContent="Add a menu item";$("save").textContent="Save item →";$("cancel").classList.add("hidden");say("formStatus","");}
$("photo").addEventListener("change",e=>{picked=e.target.files[0]||null;if(!picked)return;if(!picked.type.startsWith("image/")||picked.size>5*1024*1024){say("formStatus","Select an image smaller than 5 MB.",true);picked=null;e.target.value="";return;}const u=URL.createObjectURL(picked);$("preview").innerHTML=`<img src="${u}" alt="Preview">`;$("preview").classList.remove("hidden");});
$("itemForm").addEventListener("submit",async e=>{
 e.preventDefault();const id=$("itemId").value,name=$("name").value.trim(),category=$("category").value.trim(),amount=Number($("price").value);
 if(!name||!category||!Number.isFinite(amount)||amount<0){say("formStatus","Enter a valid name, category, and price.",true);return;}
 $("save").disabled=true;say("formStatus","Saving…");
 try{
  let image_url=existingImage;
  if(picked){const ext=(picked.name.split(".").pop()||"jpg").toLowerCase().replace(/[^a-z0-9]/g,"");const path=`menu/${crypto.randomUUID()}.${ext}`;
   const {error}=await db.storage.from(cfg.STORAGE_BUCKET).upload(path,picked,{contentType:picked.type});if(error)throw error;
   image_url=db.storage.from(cfg.STORAGE_BUCKET).getPublicUrl(path).data.publicUrl;
  }
  const values={name,category,price:amount,description:$("description").value.trim(),image_url,is_available:$("available").checked,is_best_seller:$("bestSeller").checked,updated_at:new Date().toISOString()};
  const result=id?await db.from("menu_items").update(values).eq("id",id):await db.from("menu_items").insert(values);
  if(result.error)throw result.error;reset();await refresh();say("formStatus","Saved. The customer menu will show the update.");
 }catch(err){console.error(err);say("formStatus",err.message||"Unable to save menu item.",true);}
 finally{$("save").disabled=false;}
});
$("items").addEventListener("click",async e=>{
 const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-remove]");
 if(edit){const x=rows.find(r=>String(r.id)===edit.dataset.edit);if(!x)return;$("itemId").value=x.id;$("name").value=x.name;$("price").value=x.price;$("category").value=x.category;$("description").value=x.description||"";$("available").checked=!!x.is_available;$("bestSeller").checked=!!x.is_best_seller;existingImage=x.image_url||null;picked=null;$("photo").value="";$("preview").innerHTML=existingImage?`<img src="${esc(existingImage)}" alt="Current image">`:"";$("preview").classList.toggle("hidden",!existingImage);$("editorTitle").textContent="Edit menu item";$("save").textContent="Update item →";$("cancel").classList.remove("hidden");window.scrollTo({top:0,behavior:"smooth"});}
 if(del){const x=rows.find(r=>String(r.id)===del.dataset.remove);if(!x||!confirm(`Delete ${x.name}?`))return;const {error}=await db.from("menu_items").delete().eq("id",x.id);if(error){alert(error.message);return;}await refresh();}
});
$("cancel").addEventListener("click",reset);
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();say("loginStatus","Signing in…");const {error}=await db.auth.signInWithPassword({email:$("email").value.trim(),password:$("password").value});if(error){say("loginStatus",error.message,true);return;}if(!await authorized()){await db.auth.signOut();say("loginStatus","This account has not been granted owner access.",true);return;}visible(true);await refresh();});
$("logout").addEventListener("click",async()=>{await db.auth.signOut();visible(false);});
async function init(){if(!db){say("loginStatus","Supabase is not initialized. Check js/config.js.",true);return;}const {data:{session}}=await db.auth.getSession();if(session&&await authorized()){visible(true);await refresh();}}
init();
})();
const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];
const cars = [
 {brand:"BMW",model:"3 Series",years:[2012,2026],desc:"Седан · 3 Series",img:"https://images.unsplash.com/photo-1555215695-3004980ad54e?auto=format&fit=crop&w=900&q=80"},
 {brand:"BMW",model:"5 Series",years:[2010,2026],desc:"Седан · 5 Series",img:"https://images.unsplash.com/photo-1556189250-72ba954cfc2b?auto=format&fit=crop&w=900&q=80"},
 {brand:"Mercedes-Benz",model:"C-Class",years:[2012,2026],desc:"Седан · C-Class",img:"https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?auto=format&fit=crop&w=900&q=80"},
 {brand:"Toyota",model:"Camry",years:[2006,2026],desc:"Седан · Camry",img:"https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?auto=format&fit=crop&w=900&q=80"},
 {brand:"Hyundai",model:"Solaris",years:[2011,2026],desc:"Седан · Solaris",img:"https://images.unsplash.com/photo-1609521263047-f8f205293f24?auto=format&fit=crop&w=900&q=80"},
 {brand:"Daewoo",model:"Lanos",years:[1997,2017],desc:"Седан · Lanos",img:"https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=900&q=80"},
 {brand:"Lada",model:"Vesta",years:[2015,2026],desc:"Седан · Vesta",img:"https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?auto=format&fit=crop&w=900&q=80"},
 {brand:"Kia",model:"Rio",years:[2000,2026],desc:"Седан / хэтчбек · Rio",img:"https://images.unsplash.com/photo-1552519507-da3b142c6e3d?auto=format&fit=crop&w=900&q=80"},
 {brand:"Volkswagen",model:"Golf",years:[2000,2026],desc:"Хэтчбек · Golf",img:"https://images.unsplash.com/photo-1611859266238-4b98091d9d9b?auto=format&fit=crop&w=900&q=80"},
 {brand:"Audi",model:"A4",years:[2001,2026],desc:"Седан · A4",img:"https://images.unsplash.com/photo-1606664515524-ed2f786a0bd6?auto=format&fit=crop&w=900&q=80"}
];
const brands = ["Все","BMW","Mercedes-Benz","Toyota","Hyundai","Daewoo","Lada","Kia","Volkswagen","Audi"];
let selectedBrand = "Все", pendingCar = null;
let state = JSON.parse(localStorage.getItem("motorika-state") || '{"car":null,"services":[]}');
function persist(){localStorage.setItem("motorika-state",JSON.stringify(state));renderCar();renderServices();renderExpenses();renderReminders();if(typeof updateTripCar==="function")updateTripCar();}
function toast(msg){const t=$("#toast");t.textContent=msg;t.classList.add("show");clearTimeout(window.toastTimer);window.toastTimer=setTimeout(()=>t.classList.remove("show"),2300);}
function page(name){$$(".page").forEach(p=>p.classList.toggle("active",p.id===`page-${name}`));$$(".nav-item").forEach(b=>b.classList.toggle("selected",b.dataset.page===name));window.scrollTo({top:0,behavior:"smooth"});}
$$("[data-page]").forEach(b=>b.addEventListener("click",e=>{e.preventDefault();page(b.dataset.page);}));
function renderBrands(){$("#brand-filters").innerHTML=brands.map(b=>`<button class="chip ${selectedBrand===b?"active":""}" data-brand="${b}">${b}</button>`).join("");$$("[data-brand]").forEach(b=>b.onclick=()=>{selectedBrand=b.dataset.brand;renderBrands();renderCars();});}
function renderCars(){const q=$("#car-search").value.toLowerCase().trim();const list=cars.filter(c=>(selectedBrand==="Все"||c.brand===selectedBrand)&&(`${c.brand} ${c.model} ${c.desc}`).toLowerCase().includes(q));$("#car-list").innerHTML=list.length?list.map(c=>`<button class="car-option" data-car="${cars.indexOf(c)}"><span class="car-thumb" style="background-image:url('${c.img}')"></span><span><b>${c.brand} ${c.model}</b><small>${c.desc} · ${c.years[0]}–${c.years[1]}</small></span><span class="arrow">›</span></button>`).join(""):`<div class="empty-state">Ничего не найдено. Попробуй другую марку или модель.</div>`;$$("[data-car]").forEach(b=>b.onclick=()=>openConfig(cars[+b.dataset.car]));}
function openConfig(c){pendingCar=c;$("#config-title").textContent=`${c.brand} ${c.model}`;$("#car-year").innerHTML=Array.from({length:c.years[1]-c.years[0]+1},(_,i)=>c.years[1]-i).map(y=>`<option>${y}</option>`).join("");$("#car-mileage").value="";$("#car-config").classList.remove("hidden");$("#car-config").scrollIntoView({behavior:"smooth",block:"start"});}
$("#close-config").onclick=()=>$("#car-config").classList.add("hidden");
$("#save-car").onclick=()=>{if(!pendingCar)return;state.car={...pendingCar,year:+$("#car-year").value,engine:$("#car-engine").value,mileage:$("#car-mileage").value?+$("#car-mileage").value:null};persist();$("#car-config").classList.add("hidden");page("home");toast("Автомобиль сохранён на устройстве");};
$("#car-search").addEventListener("input",renderCars);
function renderCar(){const c=state.car;if(!c){$("#hero-name").textContent="Выбери свой автомобиль";$("#hero-meta").textContent="Марка · Модель · Год";$("#hero-photo").style.backgroundImage="linear-gradient(130deg,#26362b,#121814)";return;}$("#hero-name").textContent=`${c.brand} ${c.model}`;$("#hero-meta").textContent=`${c.year} · ${c.engine}${c.mileage?` · ${c.mileage.toLocaleString("ru-RU")} км`:""}`;$("#hero-photo").style.backgroundImage=`linear-gradient(0deg,#131a16aa,transparent),url('${c.img}')`;}
$("#service-date").value=new Date().toISOString().slice(0,10);
$("#add-service").onclick=()=>{const type=$("#service-type").value,date=$("#service-date").value,cost=Number($("#service-cost").value)||0,note=$("#service-note").value.trim();if(!date){toast("Укажи дату записи");return;}state.services.unshift({id:Date.now(),type,date,cost,note});$("#service-cost").value="";$("#service-note").value="";persist();toast("Запись добавлена");};
function renderServices(){const list=$("#service-list");$("#service-count").textContent=`${state.services.length} записей`;if(!state.services.length){list.innerHTML='<div class="empty-state">Здесь появится история обслуживания. Добавь первую запись выше.</div>';return;}list.innerHTML=state.services.map(s=>`<div class="record"><span class="record-icon">⌁</span><span class="record-info"><b>${escapeHtml(s.type)}</b><small>${formatDate(s.date)}${s.note?` · ${escapeHtml(s.note)}`:""}</small></span><span class="record-price">${s.cost?s.cost.toLocaleString("ru-RU")+" ₽":"—"}</span><button class="delete-btn" data-delete="${s.id}" aria-label="Удалить запись">×</button></div>`).join("");$$("[data-delete]").forEach(b=>b.onclick=()=>{state.services=state.services.filter(s=>s.id!==+b.dataset.delete);persist();toast("Запись удалена");});}
function renderExpenses(){const sum=state.services.reduce((a,s)=>a+s.cost,0);$("#total-expenses").textContent=sum.toLocaleString("ru-RU")+" ₽";$("#total-records").textContent=state.services.length;}
function renderReminders(){const r=$("#home-reminders");if(!state.services.length){r.textContent="Пока напоминаний нет. Добавь запись об обслуживании — и веди историю автомобиля в одном месте.";r.className="empty-state";return;}r.className="stack";r.innerHTML=state.services.slice(0,3).map(s=>`<div class="record"><span class="record-icon">✓</span><span class="record-info"><b>${escapeHtml(s.type)}</b><small>${formatDate(s.date)} · записано в историю</small></span></div>`).join("");}
function formatDate(d){if(!d)return "";const [y,m,day]=d.split("-");return `${day}.${m}.${y}`;}
function escapeHtml(s){return String(s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function calcFuel(){const d=+$("#fuel-distance").value||0,c=+$("#fuel-consumption").value||0,p=+$("#fuel-price").value||0;$("#fuel-result").textContent=Math.round(d*c/100*p).toLocaleString("ru-RU")+" ₽";}
$("#calc-fuel").onclick=calcFuel;["fuel-distance","fuel-consumption","fuel-price"].forEach(id=>$("#"+id).addEventListener("input",calcFuel));
function askQuestion(q){if(!q.trim())return;const w=$("#chat-window");const u=document.createElement("div");u.className="chat-bubble user";u.textContent=q;w.append(u);const b=document.createElement("div");b.className="chat-bubble bot";b.innerHTML='<span class="bot-mark">✳</span><div><b>Моторика</b><p>Я сохранил твой вопрос в этом демо-интерфейсе. Чтобы отвечать по-настоящему, следующим шагом подключим AI-сервис. Пока могу подсказать: напиши марку, модель, год и симптомы автомобиля — так будет проще подготовить точный запрос.</p></div>';w.append(b);$("#chat-input").value="";w.scrollIntoView({behavior:"smooth",block:"end"});}
$("#chat-form").addEventListener("submit",e=>{e.preventDefault();askQuestion($("#chat-input").value);});
$$("[data-question]").forEach(b=>b.onclick=()=>askQuestion(b.dataset.question));
$("#install-help").onclick=()=>toast("В Safari нажми «Поделиться» → «На экран Домой»");

function updateTripCar(){const c=state.car;const box=$("#trip-car-summary");if(!box)return;if(!c){box.textContent="Автомобиль не выбран — сначала выбери машину в гараже.";return;}box.textContent=`${c.brand} ${c.model}, ${c.year} · ${c.engine}${c.mileage?` · ${c.mileage.toLocaleString("ru-RU")} км`:""}`;const defaults={"Lanos":8.0,"Camry":9.0,"Solaris":7.0,"Rio":7.0,"Vesta":7.5,"Golf":7.0,"3 Series":7.5,"5 Series":8.5,"C-Class":8.0,"A4":8.0};if(!$("#trip-consumption").dataset.userEdited){$("#trip-consumption").value=defaults[c.model]||8.0;}}
$("#trip-consumption").addEventListener("input",()=>$("#trip-consumption").dataset.userEdited="1");
function calculateTrip(){const d=+$("#trip-distance").value,speed=+$("#trip-speed").value,base=+$("#trip-consumption").value,price=+$("#trip-fuel-price").value;const style=$("#trip-style").value,load=$("#trip-load").value;if(d<=0||speed<10||speed>160||base<=0||price<0){toast("Проверь расстояние, скорость и расход");return;}
 const styleFactor={city:1.24,mixed:1,highway:speed>110?1.12:speed<60?1.10:0.88}[style];
 // A simple indicative model: speed multiplier + road conditions + load. Not OEM test data.
 const speedFactor=speed<30?1.20:speed<50?1.08:speed<=90?1:speed<=110?1.04:speed<=130?1.13:1.25;
 const loadFactor={light:0.96,normal:1,heavy:1.12}[load];
 const estimated=base*styleFactor*speedFactor*loadFactor;
 const litres=d*estimated/100,cost=litres*price,mins=d/speed*60;
 const hours=Math.floor(mins/60),minutes=Math.round(mins%60);
 $("#trip-time").textContent=hours?`${hours} ч ${minutes} мин`:`${minutes} мин`;
 $("#trip-speed-label").textContent=`Средняя скорость: ${speed} км/ч`;
 $("#trip-litres").textContent=`${litres.toLocaleString("ru-RU",{maximumFractionDigits:1})} л`;
 $("#trip-cost").textContent=`${Math.round(cost).toLocaleString("ru-RU")} ₽`;
 $("#trip-final-consumption").textContent=`${estimated.toLocaleString("ru-RU",{maximumFractionDigits:1})} л`;
 $("#trip-distance-result").textContent=`${d.toLocaleString("ru-RU")} км`;
 $("#trip-explanation").textContent=`Оценка рассчитана от базового расхода ${base.toLocaleString("ru-RU")} л/100 км с поправками на скорость, дорожный режим и загрузку. Реальный расход зависит от двигателя, коробки, передач и оборотов, температуры, рельефа, шин, пробок и манеры езды. Время — без остановок и задержек. Это приблизительная модель, не данные бортового компьютера и не гарантированный расход производителя.`;
 $("#trip-results").classList.remove("hidden");
}
$("#calculate-trip").addEventListener("click",calculateTrip);

renderBrands();renderCars();persist();updateTripCar();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});

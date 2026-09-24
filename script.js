var WA="996555000000";
var MENU={
  tea:[["Ширчай","Молочный чай с солью и маслом, 350 мл",90,"pial"],["Чайник чая","Чёрный или зелёный, 700 мл",120,"pot"],["Максым","Прохладный напиток из зерновых, 300 мл",80,"mug"],["Американо","Свежая обжарка, 200 мл",130,"mug"],["Капучино","220 мл",180,"mug"]],
  hot:[["Лагман","Домашняя лапша, говядина, овощи",320,"bowl"],["Манты","5 штук, со сметаной",340,"round"],["Самса из тандыра","С говядиной и луком",110,"samsa"],["Ош (плов)","По-бишкекски, с конской колбасой",380,"bowl"],["Бешбармак","На 2–3 персоны, по предзаказу",1400,"bowl"]],
  sweet:[["Боорсоки","6 штук, мёд или сметана",150,"round"],["Чак-чак","Порция, с орехами",140,"round"],["Медовик","Кусок",190,"cake"],["Лепёшка с каймаком","Горячая, с вареньем",120,"round"]]
};
var P={},cart={},cur="tea",$=function(i){return document.getElementById(i)};
Object.keys(MENU).forEach(function(k){MENU[k].forEach(function(i){P[i[0]]=i[2]})});
function fmt(n){return n.toLocaleString("ru-RU")+" сом"}
function show(k){cur=k;$("list").innerHTML=MENU[k].map(function(i){var q=cart[i[0]]||0;
  return '<li><span class="ph"><svg width="38" height="38" aria-hidden="true"><use href="#i-'+i[3]+'"/></svg></span><div class="tx"><b>'+i[0]+'</b><small>'+i[1]+'</small></div><div class="pr"><span class="price">'+fmt(i[2])+'</span><button class="add" data-n="'+i[0]+'" aria-label="Добавить: '+i[0]+'">+'+(q?' '+q:'')+'</button></div></li>'}).join("")}
document.querySelectorAll(".tab").forEach(function(b){b.addEventListener("click",function(){
  document.querySelectorAll(".tab").forEach(function(x){x.setAttribute("aria-selected",x===b)});show(b.dataset.t)})});
$("list").addEventListener("click",function(e){var b=e.target.closest(".add");if(b){change(b.dataset.n,1)}});
function change(n,d){cart[n]=Math.max(0,(cart[n]||0)+d);if(!cart[n])delete cart[n];draw()}
function mode(){return document.querySelector('input[name="m"]:checked').value}
function draw(){
  var names=Object.keys(cart),cnt=0,sub=0;
  names.forEach(function(n){cnt+=cart[n];sub+=cart[n]*P[n]});
  var del=mode()==="d",fee=del?(sub>=1500?0:+$("zone").value):0,total=sub+fee;
  $("bar").hidden=!cnt;document.body.classList.toggle("hasbar",!!cnt);
  $("bt").textContent=cnt+" поз. на "+fmt(sub);
  if(!cnt)$("sheet").hidden=true;
  $("items").innerHTML=names.map(function(n){return '<div class="ci"><span>'+n+'<br><small>'+fmt(P[n])+'</small></span><span class="q"><button data-n="'+n+'" data-d="-1" aria-label="Убрать">−</button><b>'+cart[n]+'</b><button data-n="'+n+'" data-d="1" aria-label="Добавить">+</button></span></div>'}).join("");
  $("zone").style.display=$("addr").style.display=del?"":"none";
  $("tot").innerHTML='<p><span>Блюда</span><span>'+fmt(sub)+'</span></p>'+(del?'<p><span>Доставка</span><span>'+(fee?fmt(fee):"бесплатно")+'</span></p>':'')+'<p><b>Итого</b><b>'+fmt(total)+'</b></p>';
  var bad=del&&sub<500,w=$("warn");w.hidden=!bad;w.textContent=bad?"Минимальный заказ на доставку 500 сом. Добавьте ещё "+fmt(500-sub)+" или выберите самовывоз.":"";
  var t="Здравствуйте! Хочу заказать ("+(del?"доставка":"самовывоз")+"):\n"+names.map(function(n){return "• "+n+" × "+cart[n]}).join("\n")+"\nИтого: "+fmt(total);
  if(del)t+="\nАдрес: "+($("addr").value||"—");
  t+="\nИмя: "+($("nm").value||"—")+"\nТелефон: "+($("ph").value||"—");
  var g=$("go");g.href="https://wa.me/"+WA+"?text="+encodeURIComponent(t);g.setAttribute("aria-disabled",bad||!cnt);
  show(cur);
}
$("items").addEventListener("click",function(e){var b=e.target.closest("button");if(b)change(b.dataset.n,+b.dataset.d)});
["zone","addr","nm","ph"].forEach(function(i){$(i).addEventListener("input",draw)});
document.querySelectorAll('input[name="m"]').forEach(function(r){r.addEventListener("change",draw)});
$("open").addEventListener("click",function(){$("sheet").hidden=false;$("close").focus()});
$("close").addEventListener("click",function(){$("sheet").hidden=true;$("open").focus()});
$("sheet").addEventListener("click",function(e){if(e.target===this)this.hidden=true});
document.addEventListener("keydown",function(e){if(e.key==="Escape")$("sheet").hidden=true});
show("tea");draw();
(function(){
  var dot=$("dot"),st=$("st");
  try{
    var p=new Intl.DateTimeFormat("en-GB",{timeZone:"Asia/Bishkek",weekday:"short",hour:"numeric",minute:"numeric",hour12:false}).formatToParts(new Date()),g={};
    p.forEach(function(x){g[x.type]=x.value});
    var h=(+g.hour%24)+(+g.minute)/60,late=(g.weekday==="Fri"||g.weekday==="Sat"||g.weekday==="Sun"),c=late?23:22,on=h>=8&&h<c;
    dot.className="dot"+(on?" on":"");
    st.textContent=on?"Сейчас открыто, до "+c+":00 по Бишкеку":"Сейчас закрыто, откроемся в 8:00 по Бишкеку";
  }catch(e){st.textContent="Ежедневно с 8:00"}
})();

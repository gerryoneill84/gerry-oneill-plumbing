
(function() {
  const ITEMS_KEY='gerry_estimate_items_v1';
  const $items=document.getElementById('items');
  const $total=document.getElementById('total');
  const $whatsapp=document.getElementById('whatsapp');
  const load=()=>JSON.parse(localStorage.getItem(ITEMS_KEY)||'[]');
  const save=(a)=>localStorage.setItem(ITEMS_KEY,JSON.stringify(a));
  const currency=(n)=>'€'+(Math.round(n*100)/100).toLocaleString('en-IE',{minimumFractionDigits:0});
  function render(){
    const arr=load();
    if($items){
      $items.innerHTML=''; let total=0;
      arr.forEach((it,idx)=>{ total+=it.price;
        const row=document.createElement('div'); row.className='item';
        row.innerHTML=`<span class="name">${it.name}</span><span>${currency(it.price)}</span>`;
        const del=document.createElement('button'); del.textContent='Remove';
        del.onclick=()=>{arr.splice(idx,1);save(arr);render();};
        row.appendChild(del); $items.appendChild(row);
      });
      if($total) $total.textContent=currency(total);
      if($whatsapp){
        const lines=arr.map(it=>`• ${it.name} — ${currency(it.price)}`);
        lines.push(`Total: ${currency(total)}`);
        const text=encodeURIComponent(`Gerry O’Neill estimate:\n${lines.join('\n')}`);
        $whatsapp.href=`https://wa.me/353871234567?text=${text}`;
      }
    }
  }
  function add(name,price){const arr=load();arr.push({name,price:Number(price)});save(arr);render();}
  document.querySelectorAll('.product .add').forEach(btn=>btn.addEventListener('click',e=>{const card=e.currentTarget.closest('.product'); add(card.dataset.name, card.dataset.price);}));
  document.querySelectorAll('.add-job').forEach(btn=>btn.addEventListener('click',e=>{add(e.currentTarget.dataset.name, e.currentTarget.dataset.price);}));
  const addSvcs=document.getElementById('add-services');
  if(addSvcs) addSvcs.addEventListener('click',()=>{const checks=document.querySelectorAll('.svc:checked'); let extra=0;
    const emergency=document.getElementById('emergency'); if(emergency&&emergency.checked) extra+=60;
    const travel=document.getElementById('travel'); const km=Number(travel?travel.value:0)||0; extra+=km*1;
    checks.forEach(ch=>add(ch.dataset.name, ch.dataset.price)); if(extra>0) add('Call-out extras', extra);
  });
  render();
})();

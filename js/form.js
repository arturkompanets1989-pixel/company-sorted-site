/* Форма сразу открывает чат WhatsApp с готовым текстом; отправляет человек. Сервера нет. Код партнёра — из js/ref.js. */
(function(){
  function open(lines){
    if(window.csRef) lines.push('ref: '+window.csRef);
    var u='https://wa.me/94701698954?text='+encodeURIComponent(lines.join('\n'));
    var w=window.open(u,'_blank'); if(!w) location.href=u;
  }
  var f=document.getElementById('leadForm');
  if(f) f.addEventListener('submit',function(e){
    e.preventDefault(); var d=new FormData(e.target), l=['Company Sorted request'];
    var s=f.querySelector('[name=service]'); if(s&&s.value) l.push('Need: '+s.value);
    if(d.get('company')) l.push('Company: '+d.get('company'));
    l.push('Contact: '+d.get('contact'));
    if(d.get('message')) l.push('Details: '+d.get('message'));
    open(l);
  });
  var b=document.getElementById('sendBtn'); if(!b) return;
  var fs=document.querySelectorAll('.form .field');
  fs.forEach(function(x){ x.dataset.d=x.textContent;
    x.addEventListener('focus',function(){ if(x.textContent===x.dataset.d) x.textContent=''; });
    x.addEventListener('blur',function(){ if(!x.textContent.trim()) x.textContent=x.dataset.d; });
  });
  function send(){ var l=['Company name check'];
    fs.forEach(function(x){ if(x.textContent!==x.dataset.d) l.push(x.dataset.label+': '+x.textContent.trim()); });
    open(l);
  }
  b.addEventListener('click',send);
  b.addEventListener('keydown',function(e){ if(e.key==='Enter') send(); });
})();

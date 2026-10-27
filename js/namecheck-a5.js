/* Door A5: the company name request.
   Honest by design: there is no public register we can query from the page, so it never says a name is free.
   It checks what it can see, lists the names as they will be sent, and puts them into the WhatsApp message.
   Nothing is stored and nothing is sent until the person presses the WhatsApp button. */
(function(){
  var form=document.getElementById('nameform'); if(!form) return;
  var out=document.getElementById('names-out'), rows=document.getElementById('names-rows');
  var msg=document.getElementById('names-check'), wa=document.getElementById('ask-wa');
  function clean(s){return s.replace(/\s+/g,' ').trim()}
  function row(a,b){var tr=document.createElement('tr');
    [a,b].forEach(function(t,i){var td=document.createElement('td');td.textContent=t;if(i===1)td.className='muted';tr.appendChild(td)});
    rows.appendChild(tr)}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var names=['n1','n2','n3'].map(function(id){return clean(form[id].value)}).filter(Boolean);
    var what=clean(form.what.value), where=clean(form.where.value);
    msg.textContent='';
    if(!names.length){msg.textContent='Check: type at least one name.';form.n1.focus();return}
    for(var i=0;i<names.length;i++){
      if(names[i].length<3){msg.textContent='Check: each name needs at least three characters.';return}
      if(!/^[A-Za-z0-9&.,'() -]+$/.test(names[i])){msg.textContent='Check: use Latin letters, numbers and ordinary punctuation.';return}
    }
    rows.textContent='';
    names.forEach(function(n){row(n,'Preliminary search')});
    if(what) row('What the company will do: '+what,'Sent with the names');
    if(where) row('Country you live in: '+where,'Sent with the names');
    out.hidden=false;
    var text='Please check a company name for me. Names: '+names.join('; ')+'.';
    if(what) text+=' The company will: '+what+'.';
    if(where) text+=' I live in: '+where+'.';
    if(wa) wa.href='https://wa.me/94701698954?text='+encodeURIComponent(text);
  });
})();

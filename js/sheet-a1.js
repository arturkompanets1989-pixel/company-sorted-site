/* Door A1: land dates from the day the deed of transfer was registered (or the planned date).
   Every rule carries its source; the facts registry lines are in brackets.
   - six-monthly letter to the Registrar of Lands by the company secretary, "in every six months period
     commencing from the date of the registration of the relevant deed of transfer", Act 38 of 2014, s. 4(4)(a) [Ф-155, Ф-109]
   - foreign share below 50% for twenty consecutive years from the transfer; above it, six months to restore,
     Act 38 of 2014, s. 2(2) [Ф-82, Ф-81]
   - the operating company's lease cannot be mortgaged to a licensed bank for five years from signing of the lease,
     Act 38 of 2014, s. 11 [Ф-159а]; execution comes before registration, so the date shown is the latest possible end
   - any share transfer: form BO 3 within 20 working days; form BO 4 every year with each company's annual return,
     beneficial ownership regulations 09.10.2026 [Ф-108] */
(function(){
  var form=document.getElementById('calc'); if(!form) return;
  var out=document.getElementById('sheet-out'), rows=document.getElementById('sheet-rows');
  var wa=document.getElementById('ask-wa');
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmt(d){return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()}
  // add months, holding the day inside the target month (31 August + 6 months = 28 or 29 February)
  function addMonths(d,n){var y=d.getFullYear(),m=d.getMonth()+n,last=new Date(y,m+1,0).getDate();return new Date(y,m,Math.min(d.getDate(),last))}
  function row(what,when,src){var tr=document.createElement('tr');
    [what,when,src].forEach(function(t,i){var td=document.createElement('td');td.textContent=t;if(i===2)td.className='muted';tr.appendChild(td)});
    rows.appendChild(tr)}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=form.agm.value; if(!v){form.agm.focus();return}
    var p=v.split('-'), deed=new Date(+p[0],+p[1]-1,+p[2]), today=new Date(); today.setHours(0,0,0,0);
    rows.textContent='';
    // six-monthly periods [Ф-155]: show the period running today (or the first one, if the date is ahead) and the next three
    var k=0; while(addMonths(deed,6*(k+1))<=today) k++;
    for(var i=k;i<k+4;i++){
      var from=addMonths(deed,6*i), to=addMonths(deed,6*(i+1)); to.setDate(to.getDate()-1);
      row('Six-monthly letter to the Registrar of Lands', 'Once between '+fmt(from)+' and '+fmt(to), 'Act 38 of 2014, s. 4(4)(a)');
    }
    // five years without a bank mortgage [Ф-159а]
    row('No bank mortgage of your company\u2019s lease, if the lease is signed on your date', 'Until '+fmt(addMonths(deed,60)), 'Act 38 of 2014, s. 11');
    // twenty years below 50% [Ф-82]
    row('Foreign share stays below 50%', 'Until '+fmt(addMonths(deed,240)), 'Act 38 of 2014, s. 2(2)(a)');
    row('If the foreign share reaches 50%', 'Six months to bring it back below half', 'Act 38 of 2014, s. 2(2), proviso');
    // beneficial ownership [Ф-108]
    // no beneficial ownership dates until the official gazette is read (root, 29.10)
    row('Beneficial ownership forms for each company', 'We confirm the current deadlines from the official gazette before we put them in your calendar', 'Official gazette');
    out.hidden=false;
    if(wa) wa.href='https://wa.me/94701698954?text='+encodeURIComponent('Please send me the dates for my land structure. Deed of transfer registered (or planned): '+fmt(deed)+'.');
  });
})();

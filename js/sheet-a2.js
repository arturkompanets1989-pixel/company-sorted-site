/* Door A2: open years counted from the last annual return filed, or from incorporation.
   A calculation from the visitor's date, not a check with the Registrar or Inland Revenue.
   Every rule carries its source; the facts registry lines are in brackets.
   - annual return: 30 working days after the annual general meeting, Companies Act s. 131(2) [Ф-16]
   - meeting: once in each calendar year, no later than 15 months after the previous one, s. 133(1) [Ф-16]
     (the date of the last filed return stands in for the date of the meeting behind it)
   - first meeting: within 18 months of incorporation, s. 133(2); no annual return in the year
     of incorporation, s. 131(3) [Ф-16]
   - BO 4 goes with the annual return, beneficial ownership regulations 09.10.2026 [Ф-93г, Ф-93ж];
     whether past-year returns filed now need it is open [Ф-164а]
   - beneficial ownership details of an existing company: 21 October 2026, Registrar's notice 30.09.2026 [Ф-43]
   - year of assessment 1 April to 31 March [Ф-31]; income tax return by 30 November after it,
     IRD tax calendar 2026 [Ф-32]
   - $150 per year reviewed: 50-ДЕНЬГИ, status not decided, shown as a proposed price;
     multiplication shown next to the sum (root rule 25.10.2026) */
(function(){
  var form=document.getElementById('calc'); if(!form) return;
  var out=document.getElementById('sheet-out'), rows=document.getElementById('sheet-rows');
  var sum=document.getElementById('sheet-sum'), msg=document.getElementById('calc-msg');
  var wa=document.getElementById('ask-wa');
  var MSG=msg?msg.textContent:'';
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmt(d){return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()}
  function parse(v){var p=v.split('-');return new Date(+p[0],+p[1]-1,+p[2])}
  function addWorkingDays(d,n){var r=new Date(d);while(n>0){r.setDate(r.getDate()+1);var w=r.getDay();if(w!==0&&w!==6)n--}return r}
  function addMonths(d,n){var r=new Date(d);r.setMonth(r.getMonth()+n);return r}
  function row(what,status,by,src){var tr=document.createElement('tr');
    var a=document.createElement('td');a.appendChild(document.createTextNode(what));
    if(status){a.appendChild(document.createElement('br'));var s=document.createElement('span');s.className='muted';s.textContent=status;a.appendChild(s)}
    tr.appendChild(a);
    [by,src].forEach(function(t,i){var td=document.createElement('td');td.textContent=t;if(i===1)td.className='muted';tr.appendChild(td)});
    rows.appendChild(tr)}

  form.addEventListener('submit',function(e){
    e.preventDefault();
    var a=form.agm.value, b=form.inc.value;
    if(!a&&!b){if(msg)msg.textContent='Enter one of the two dates. '+MSG;form.agm.focus();return}
    if(msg)msg.textContent=MSG;
    var filed=!!a, start=parse(filed?a:b), today=new Date(); today.setHours(0,0,0,0);
    if(start>today){if(msg)msg.textContent='The date is in the future. '+MSG;return}
    rows.textContent='';
    var late=0, prev, year, by, due;

    // Annual returns, s. 131(2) and s. 133 [Ф-16]
    if(filed){ prev=start; year=start.getFullYear()+1; }
    else {
      by=addMonths(start,18); due=addWorkingDays(by,30);           // s. 133(2), s. 131(2)
      if(due<today){late++;row('First annual return, Form 15','Late if not filed',fmt(due),'Companies Act, ss. 131(2), 133(2)')}
      else row('First annual return, Form 15','Next one, not late yet',fmt(due),'Companies Act, ss. 131(2), 133(2)');
      prev=by; year=by.getFullYear()+1;
    }
    while(due===undefined||due<today){
      by=new Date(year,11,31); var lim=addMonths(prev,15); if(lim<by) by=lim;   // s. 133(1)
      due=addWorkingDays(by,30);                                                // s. 131(2)
      if(due<today){late++;row('Annual return, Form 15, for the '+year+' meeting','Late if not filed',fmt(due),'Companies Act, ss. 131(2), 133(1)')}
      else row('Annual return, Form 15, for the '+year+' meeting','Next one, not late yet',fmt(due),'Companies Act, ss. 131(2), 133(1)');
      prev=by; year++;
    }

    // Beneficial ownership [Ф-93ж, Ф-164а, Ф-43]
    row('Beneficial ownership form BO 4','For past years: being confirmed','With each annual return','BO regulations, 09.10.2026');
    var bo=new Date(2026,9,21);
    if(start<bo) row('Beneficial ownership details of an existing company', bo<today?'Past the date, if not filed':'Due', fmt(bo), 'Registrar’s notice, 30.09.2026');

    // Income tax returns: year of assessment April to March [Ф-31], return by 30 November after it [Ф-32]
    for(var E=start.getFullYear(); E<=today.getFullYear()+1; E++){
      var yaEnd=new Date(E,2,31), tax=new Date(E,10,30);
      if(filed ? tax<=start : yaEnd<=start) continue;
      var name='Income tax return, year of assessment '+(E-1)+'/'+E;
      if(tax<today) row(name,'Check with Inland Revenue',fmt(tax),'IRD tax calendar 2026');
      else { row(name,'Next one',fmt(tax),'IRD tax calendar 2026'); break; }
    }

    // Our price for the years found: $150 x years, proposed (50-ДЕНЬГИ)
    sum.textContent = late
      ? late+(late===1?' annual return looks':' annual returns look')+' late from your date. Reviewing '+(late===1?'it':'them')+': '+late+' × $150 = $'+(late*150)+'. Proposed price, confirmed in your written quote. Tax returns are not counted here: only Inland Revenue knows whether they were filed.'
      : 'No annual return looks late from your date. Tax returns and beneficial ownership forms are checked separately.';
    out.hidden=false;
    if(wa) wa.href='https://wa.me/94701698954?text='+encodeURIComponent('Please send me the sheet of open years for my company. '+(filed?'Last annual return filed: ':'Incorporated, no annual return filed: ')+fmt(start)+'.');
  });
})();

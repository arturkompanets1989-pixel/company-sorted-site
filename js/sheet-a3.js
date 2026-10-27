/* Door A3: deadline sheet from the date of the last annual general meeting.
   Every rule carries its source; the facts registry lines are in brackets.
   - annual return: 30 working days after the meeting, Companies Act s. 131(2) [Ф-16]
   - BO 4 goes with the annual return, beneficial ownership regulations 09.10.2026 [Ф-93г]
   - next meeting: once a calendar year, no later than 15 months after the previous one, s. 133(1) [Ф-16];
     s. 133(1) also caps it at six months after the balance sheet date [Ф-163а] - the page note says so,
     because the balance sheet date is the visitor's own and is not asked for
   - final income tax payment 30 September, return 30 November, IRD tax calendar 2026 [Ф-33, Ф-32] */
(function(){
  var form=document.getElementById('calc'); if(!form) return;
  var out=document.getElementById('sheet-out'), rows=document.getElementById('sheet-rows');
  var wa=document.getElementById('ask-wa');
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmt(d){return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()}
  function addWorkingDays(d,n){var r=new Date(d);while(n>0){r.setDate(r.getDate()+1);var w=r.getDay();if(w!==0&&w!==6)n--}return r}
  function addMonths(d,n){var r=new Date(d);r.setMonth(r.getMonth()+n);return r}
  function nextAnnual(m,day,from){var r=new Date(from.getFullYear(),m,day);if(r<from)r=new Date(from.getFullYear()+1,m,day);return r}
  function row(what,by,src){var tr=document.createElement('tr');
    [what,by,src].forEach(function(t,i){var td=document.createElement('td');td.textContent=t;if(i===2)td.className='muted';tr.appendChild(td)});
    rows.appendChild(tr)}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=form.agm.value; if(!v){form.agm.focus();return}
    var p=v.split('-'), agm=new Date(+p[0],+p[1]-1,+p[2]), today=new Date(); today.setHours(0,0,0,0);
    rows.textContent='';
    var ret=addWorkingDays(agm,30);
    row('Annual return, Form 15', fmt(ret), 'Companies Act, s. 131(2)');
    row('Beneficial ownership, form BO 4', 'With the annual return', 'BO regulations, 09.10.2026');
    var next=addMonths(agm,15), endYear=new Date(agm.getFullYear()+1,11,31);
    row('Next annual general meeting', fmt(next<endYear?next:endYear), 'Companies Act, s. 133(1)');
    row('Final income tax payment', fmt(nextAnnual(8,30,today)), 'IRD tax calendar 2026');
    row('Company income tax return', fmt(nextAnnual(10,30,today)), 'IRD tax calendar 2026');
    out.hidden=false;
    if(wa) wa.href='https://wa.me/94701698954?text='+encodeURIComponent('Please send me the deadline sheet for my company. Last annual general meeting: '+fmt(agm)+'.');
  });
})();

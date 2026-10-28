/* Door A4: first-year calendar from the planned opening date.
   The page counts as if the company is registered on that date; registered earlier, every date moves earlier.
   Every rule carries its source; the facts registry lines are in brackets.
   - tax registration with the Commissioner-General within 30 days of incorporation,
     IRD notice SEC/PN/IT/2026/02, para 15 [Ф-178а]
   - food premises certificate valid two years, renewal applied three months before it ends,
     Food (Registration of Premises) Regulations 2019 [Ф-170]
   - council trade licence is annual, Pradeshiya Sabhas Act ss. 147, 149 [Ф-172]
   - first annual general meeting within 18 months of incorporation, s. 133(2) [Ф-16]; by the letter of s. 133(1)
     already in the next calendar year, so the earlier date is shown [Ф-250]
   - no annual return in the year of incorporation, s. 131(3); then 30 working days after the meeting, s. 131(2) [Ф-16]
   - no beneficial ownership dates until the official gazette is read (root, 29.10)
   - auditor appointed at each annual general meeting, s. 154(1) [Ф-147]
   - year of assessment 1 April to 31 March [Ф-31]; final payment 30 September [Ф-33],
     return 30 November after the year ends [Ф-32], IRD tax calendar 2026 */
(function(){
  var form=document.getElementById('calc'); if(!form) return;
  var out=document.getElementById('sheet-out'), rows=document.getElementById('sheet-rows');
  var wa=document.getElementById('ask-wa');
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  function fmt(d){return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()}
  function addDays(d,n){var r=new Date(d);r.setDate(r.getDate()+n);return r}
  function addWorkingDays(d,n){var r=new Date(d);while(n>0){r.setDate(r.getDate()+1);var w=r.getDay();if(w!==0&&w!==6)n--}return r}
  /* months added without spilling into the next month: 31 August + 18 months = 28 or 29 February */
  function addMonths(d,n){var r=new Date(d.getFullYear(),d.getMonth()+n,1);
    var last=new Date(r.getFullYear(),r.getMonth()+1,0).getDate();r.setDate(Math.min(d.getDate(),last));return r}
  function row(what,by,src){var tr=document.createElement('tr');
    [what,by,src].forEach(function(t,i){var td=document.createElement('td');td.textContent=t;if(i===2)td.className='muted';tr.appendChild(td)});
    rows.appendChild(tr)}
  form.addEventListener('submit',function(e){
    e.preventDefault();
    var v=form.agm.value; if(!v){form.agm.focus();return}
    var p=v.split('-'), d=new Date(+p[0],+p[1]-1,+p[2]);
    rows.textContent='';
    /* [Ф-178а] */
    row('Tax registration with Inland Revenue', fmt(addDays(d,30)), 'IRD notice SEC/PN/IT/2026/02, para 15');
    /* [Ф-170] certificate assumed issued on the opening date */
    row('Food premises certificate: renewal application, if issued on your date', fmt(addMonths(d,21)), 'Food (Registration of Premises) Regulations 2019');
    /* [Ф-172] */
    row('Council trade licence', 'Renewed every year; your council sets the renewal date', 'Pradeshiya Sabhas Act, ss. 147, 149');
    /* [Ф-31, Ф-33, Ф-32]: the year of assessment that holds the date ends on 31 March */
    var endY=d.getMonth()>=3?d.getFullYear()+1:d.getFullYear();
    row('First year of assessment ends', fmt(new Date(endY,2,31)), 'IRD tax calendar 2026');
    row('Final income tax payment for that year', fmt(new Date(endY,8,30)), 'IRD tax calendar 2026');
    row('Company income tax return for that year', fmt(new Date(endY,10,30)), 'IRD tax calendar 2026');
    /* [Ф-16] s. 133(2); [Ф-147] s. 154(1) */
    var m18=addMonths(d,18), nextYearEnd=new Date(d.getFullYear()+1,11,31), agm=m18<nextYearEnd?m18:nextYearEnd;
    row('First annual general meeting, and the auditor appointed at it: none in the year of opening, then by this date, or 6 months after your balance date if earlier', fmt(agm), 'Companies Act, ss. 133(1)–(2), 154(1)');
    /* [Ф-16] s. 131(2), (3); [Ф-93г] */
    row('First annual return, Form 15, if the meeting is on its last day', fmt(addWorkingDays(agm,30)), 'Companies Act, s. 131(2)');
    out.hidden=false;
    var what=(form.trade&&form.trade.value||'').trim();
    if(wa) wa.href='https://wa.me/94701698954?text='+encodeURIComponent('Please send me the first-year calendar for my business. Planned opening date: '+fmt(d)+'.'+(what?' The business: '+what+'.':''));
  });
})();

/* Your company's calendar: the free step of the funnel, built in the browser from one date.
   Template: 25-КОНТЕНТ\ДОКУМЕНТЫ-КЛИЕНТУ\КАЛЕНДАРЬ-EN.html. Dates only from 01-ФАКТЫ\КАЛЕНДАРЬ-СРОКОВ;
   the registry line of every rule is in brackets here and never shown on the page.
   Registrar:  no annual return in the year of registration, s. 131(3) [Ф-16]
               first annual general meeting within 18 months of registration, s. 133(2) [Ф-16]; by the letter of
               s. 133(1) already in the next calendar year, the earlier date shown with a caveat [Ф-250]
               a meeting once each calendar year, no later than 15 months after the last one and
               6 months after the balance date, s. 133(1) [Ф-16]
               annual return within 30 working days of the meeting, at least one every year, s. 131(1)-(2) [Ф-16, Ф-163]
               financial statements within 6 months after the balance date, s. 150(1) [Ф-149]
               change of directors or secretary within 20 working days, s. 223 [Ф-62]
   Inland Revenue: registration of a new company within 30 days, s. 102(1A) [Ф-237, Ф-178а];
               year of assessment 1 April - 31 March [Ф-31]; instalments 15 August, 15 November,
               15 February, 15 May, s. 90 [Ф-34]; final payment 30 September, s. 82(2)(c)(ii) [Ф-33а];
               return 30 November, s. 93(1) [Ф-32]; no statement of estimated tax [Ф-236а]
   Working days: Monday to Friday; a public holiday moves a date later, s. 529 [Ф-251], so a computed date is the earliest.
   Bank account opened in person [Ф-184а].
   If it applies: APIT by the 15th, annual statement 30 April [Ф-37]; EPF and ETF last working day of the
               next month [Ф-40, Ф-41]; VAT payment by the 20th, return by the last day of the month after the period [Ф-36]
   Beneficial ownership: no dates until the official gazette is read. */
(function(){
  var M=['January','February','March','April','May','June','July','August','September','October','November','December'];
  var WA='https://wa.me/94701698954';
  var BO='We confirm the current beneficial ownership deadlines from the official gazette before we put them in your calendar.';

  var DOORS={
    a3:{name:'You need an accountant who answers', label:'Your last annual general meeting, or the written resolution that replaced it',
        line:'Who files for you, and where your registered office is recorded.'},
    a2:{name:'You are behind on filings', label:'Your last annual return that was filed (or your registration date, if none was ever filed)',
        line:'The filing history at two authorities, which you cannot pull up yourself.'},
    a5:{name:'You open a company from abroad', label:'The registration date, actual or planned', month:'The month you arrive in Sri Lanka',
        line:'The secretary files; the bank account you open in person.'}
  };

  function fmt(d){return d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()}
  function fmtM(d){return M[d.getMonth()]+' '+d.getFullYear()}
  function parse(v){if(!v)return null;var p=v.split('-');return new Date(+p[0],+p[1]-1,+(p[2]||1))}
  function addMonths(d,n){var y=d.getFullYear(),m=d.getMonth()+n,last=new Date(y,m+1,0).getDate();return new Date(y,m,Math.min(d.getDate(),last))}
  function addWorkingDays(d,n){var r=new Date(d);while(n>0){r.setDate(r.getDate()+1);var w=r.getDay();if(w!==0&&w!==6)n--}return r}
  function ya(start){return 'Y/A '+start+'/'+(start+1)}
  function el(tag,cls,text){var e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e}

  /* tax dates in the next twelve months from today, same for every company */
  function taxRows(today){
    var rows=[],y=today.getFullYear();
    for(var k=y-1;k<=y+1;k++){
      rows.push([new Date(k,7,15),'1st instalment of income tax, '+ya(k)+'*','Inland Revenue Act, s. 90']);
      rows.push([new Date(k,10,15),'2nd instalment of income tax, '+ya(k)+'*','Inland Revenue Act, s. 90']);
      rows.push([new Date(k,1,15),'3rd instalment of income tax, '+ya(k-1)+'*','Inland Revenue Act, s. 90']);
      rows.push([new Date(k,4,15),'4th instalment of income tax, '+ya(k-1)+'*','Inland Revenue Act, s. 90']);
      rows.push([new Date(k,8,30),'Final payment of income tax, '+ya(k-1),'Inland Revenue Act, s. 82(2)(c)(ii)']);
      rows.push([new Date(k,10,30),'Income tax return, '+ya(k-1)+', also with no income','Inland Revenue Act, s. 93(1)']);
    }
    var end=addMonths(today,12);
    return rows.filter(function(r){return r[0]>=today&&r[0]<end}).sort(function(a,b){return a[0]-b[0]}).map(function(r){return [fmt(r[0]),r[1],r[2]]});
  }

  /* the Registrar's part, from the visitor's date */
  function registrarRows(door,d,arrive,today){
    var r=[];
    if(door==='a3'){
      r.push(['About '+fmt(addWorkingDays(d,30))+', or later with public holidays','Annual return for that meeting, signed by a director and the secretary','Companies Act, s. 131(2)']);
      var cap=addMonths(d,15),endNext=new Date(d.getFullYear()+1,11,31);
      r.push(['By '+fmt(cap<endNext?cap:endNext)+', or 6 months after your balance date if earlier','Next annual general meeting, or a written resolution in its place','Companies Act, ss. 133(1), 144']);
      r.push(['Within 6 months after your balance date','Financial statements, signed','Companies Act, s. 150(1)']);
    }
    if(door==='a2'){
      var from=d.getFullYear()+1, to=today.getFullYear();
      for(var y=from;y<to;y++) r.push([String(y),'Annual return for '+y+': none filed after your date, so this year looks open','Companies Act, s. 131(1)']);
      if(from<=to) r.push([String(to),'Annual return for '+to+': due within 30 working days of this year’s meeting','Companies Act, ss. 131(2), 133(1)']);
      if(from<to) r.push(['Each of those years','A meeting, or a written resolution, and signed financial statements behind each return','Companies Act, ss. 133(1), 144, 150(1)']);
      r.push(['Each year of assessment since','Income tax returns: only Inland Revenue can say which were filed; we check','Inland Revenue Act, s. 93(1)']);
    }
    if(door==='a5'){
      r.push([String(d.getFullYear()),'Year of registration: no annual return','Companies Act, s. 131(3)']);
      /* [Ф-237, Ф-178а] tax registration within 30 days of incorporation, IRA s. 102(1A) */
      var tin=new Date(d); tin.setDate(tin.getDate()+30);
      r.push(['By '+fmt(tin),'Registration of the company with Inland Revenue, for its tax number','Inland Revenue Act, s. 102(1A)']);
      /* [Ф-250] first meeting: not in the year of registration, within 18 months (s. 133(2)); by the letter of
         s. 133(1) already in the next calendar year. The link between the two is our reading, so the earlier
         date is shown, with the caveat */
      var m18=addMonths(d,18), nextYearEnd=new Date(d.getFullYear()+1,11,31), agm=m18<nextYearEnd?m18:nextYearEnd;
      r.push(['By '+fmt(agm)+', or 6 months after your balance date if earlier','First annual general meeting: none in the year of registration, then within 18 months. Read with the rule of one meeting in each calendar year, the earlier date is shown; how the two rules combine is our reading, the Act has no direct provision.','Companies Act, s. 133(1)–(2)']);
      r.push(['Within 30 working days of that meeting: about '+fmt(addWorkingDays(agm,30))+' or later with public holidays','First annual return','Companies Act, s. 131(2)']);
      if(arrive) r.push([fmtM(arrive),'You arrive: the bank account is opened in person','Bank’s own rules']);
    }
    r.push(['Within 20 working days of a change','Change of directors or secretary','Companies Act, s. 223']);
    return r;
  }

  function table(caption,rows,cols){
    var t=el('table','table cal__table'),c=el('caption','label',caption),h=el('thead'),tr=el('tr');
    t.appendChild(c);cols.forEach(function(x){var th=el('th',null,x);th.scope='col';tr.appendChild(th)});h.appendChild(tr);t.appendChild(h);
    var b=el('tbody');rows.forEach(function(r){var tr=el('tr');r.forEach(function(x,i){var td=el('td',i===2?'muted':null,x);tr.appendChild(td)});b.appendChild(tr)});t.appendChild(b);
    var w=el('div','cal__wrap');w.appendChild(t);return w;
  }

  function mount(root){
    var fixed=root.getAttribute('data-door'), door=fixed&&DOORS[fixed]?fixed:null;
    var q=new URLSearchParams(location.search).get('door'); if(!door&&q&&DOORS[q])door=q;
    root.textContent='';
    var form=el('form','calc cal__form'); form.noValidate=true;
    if(!fixed){
      var sw=el('div','cal__switch'); sw.setAttribute('role','group'); sw.setAttribute('aria-label','Your situation');
      Object.keys(DOORS).forEach(function(k){
        var b=el('button','cal__opt',DOORS[k].name); b.type='button'; b.setAttribute('aria-pressed',k===door?'true':'false');
        b.addEventListener('click',function(){door=k;draw()}); sw.appendChild(b);
      });
      form.appendChild(sw);
    }
    var fields=el('div','cal__fields'); form.appendChild(fields);
    var out=el('div','cal__out'); out.hidden=true; out.setAttribute('aria-live','polite');
    root.appendChild(form); root.appendChild(out);
    var uid='cal'+Math.random().toString(36).slice(2,7);

    function draw(){
      if(!fixed){[].forEach.call(form.querySelectorAll('.cal__opt'),function(b,i){b.setAttribute('aria-pressed',Object.keys(DOORS)[i]===door?'true':'false')})}
      fields.textContent=''; out.hidden=true;
      if(!door){fields.appendChild(el('p','note','Choose your situation, then give us one date.'));return}
      var D=DOORS[door];
      var l=el('label','calc__label',D.label); l.htmlFor=uid+'d'; fields.appendChild(l);
      var row=el('div','calc__row'), i=el('input','input'); i.type='date'; i.id=uid+'d'; i.required=true; i.min='2000-01-01'; row.appendChild(i);
      if(D.month){
        fields.appendChild(row); var l2=el('label','calc__label calc__label--next',D.month); l2.htmlFor=uid+'m'; fields.appendChild(l2);
        row=el('div','calc__row'); var m=el('input','input'); m.type='month'; m.id=uid+'m'; row.appendChild(m);
      }
      var go=el('button','btn btn--primary','Show my calendar'); go.type='submit'; row.appendChild(go); fields.appendChild(row);
      fields.appendChild(el('p','note','Do not know the date? That is the first finding. Write to us and we start by finding it.'));
    }

    form.addEventListener('submit',function(e){
      e.preventDefault(); if(!door)return;
      var dIn=form.querySelector('input[type=date]'), d=parse(dIn.value); if(!d){dIn.focus();return}
      var mIn=form.querySelector('input[type=month]'), arrive=mIn?parse(mIn.value):null;
      var today=new Date(); today.setHours(0,0,0,0);
      out.textContent='';
      out.appendChild(el('h3','h3 cal__title','Your company’s calendar'));
      out.appendChild(el('p','note','Counted from '+fmt(d)+(arrive?' and your arrival in '+fmtM(arrive):'')+', on '+fmt(today)+'.'));
      out.appendChild(table('Registrar of Companies: from your date',registrarRows(door,d,arrive,today),['When','What is filed or done','Law']));
      out.appendChild(el('p','note',BO));
      out.appendChild(table('Inland Revenue: the next twelve months, the same for every company',taxRows(today),['Date','What','Law']));
      out.appendChild(el('p','note','* Paid by a company that derives or expects to derive assessable income. The year of assessment runs 1 April to 31 March.'));
      out.appendChild(table('Only if it applies',[
        ['Salary tax (APIT), to Inland Revenue','15th of the next month; annual statement 30 April','IRD tax calendar 2026'],
        ['EPF and ETF, from the first employee','Last working day of the next month','EPF and ETF rules'],
        ['VAT, once registered','Payment by the 20th; return by the last day of the month after the period','IRD, VAT']],['What','Due','Source']));
      var line=el('div','cal__line'); line.appendChild(el('p','label','The line you cannot close yourself')); line.appendChild(el('p',null,DOORS[door].line)); out.appendChild(line);
      out.appendChild(el('p','note','Working days are counted Monday to Friday; a public holiday moves a date later, never earlier. This is a calculation from your date, not a check of your company with the Registrar or Inland Revenue.'));
      var text='Please send me my company’s calendar in writing.\n'+DOORS[door].name+'.\nMy date: '+fmt(d)+(arrive?'\nArrival: '+fmtM(arrive):'');
      var a=el('a','btn btn--primary cal__wa','Get this in writing on WhatsApp'); a.href=WA+'?text='+encodeURIComponent(text);
      var p=el('p','actions'); p.appendChild(a); out.appendChild(p);
      var band=document.getElementById('ask-wa'); if(band) band.href=a.href;
      out.hidden=false; out.querySelector('.cal__title').setAttribute('tabindex','-1'); out.querySelector('.cal__title').focus();
    });
    draw();
  }

  [].forEach.call(document.querySelectorAll('[data-calendar]'),mount);
})();

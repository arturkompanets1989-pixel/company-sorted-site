/* Partner code. A partner's QR opens any page with ?p=<code> (codes: 30-ПАРТНЁРЫ\КАК-СЧИТАЕМ-КОМИССИЮ.md, section 8).
   The code is kept for this visit only (sessionStorage of this tab) and added as the last line
   "ref: <code>" of the text of every WhatsApp button. No cookies, no third-party counters.
   Without a code nothing changes. The link is rewritten at click time, so buttons whose text
   a page script fills in later (the deadline sheets, the name check) carry the code too. */
(function(){
  var KEY='cs-ref', code=null;
  function clean(v){ v=(v||'').toLowerCase(); return /^[a-z0-9]{2,24}$/.test(v) ? v : null; }
  try{
    var fromUrl=clean(new URLSearchParams(location.search).get('p'));
    if(fromUrl){ sessionStorage.setItem(KEY,fromUrl); }
    code=fromUrl||clean(sessionStorage.getItem(KEY));
  }catch(e){
    code=clean(new URLSearchParams(location.search).get('p'));
  }
  if(!code) return;

  function withRef(href){
    var u; try{ u=new URL(href); }catch(e){ return href; }
    if(u.hostname!=='wa.me') return href;
    var text=u.searchParams.get('text')||'', line='ref: '+code;
    if(text.slice(-line.length)===line) return href;
    /* built by hand: URLSearchParams would write spaces as "+", WhatsApp reads %20 reliably */
    return u.origin+u.pathname+'?text='+encodeURIComponent(text ? text+'\n'+line : 'Hello.\n'+line);
  }
  function mark(a){ a.href=withRef(a.href); }
  function all(){ var l=document.querySelectorAll('a[href^="https://wa.me/"]'); for(var i=0;i<l.length;i++) mark(l[i]); }

  document.addEventListener('click',function(e){
    var a=e.target.closest && e.target.closest('a[href^="https://wa.me/"]');
    if(a) mark(a);
  },true);
  if(document.readyState==='loading') document.addEventListener('DOMContentLoaded',all); else all();
  window.csRef=code;
})();

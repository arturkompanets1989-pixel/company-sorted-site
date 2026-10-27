/* Menu button below 1024 px: opens the section list. */
(function(){
  var b=document.querySelector('.bar__menu'), m=document.getElementById('menu');
  if(!b||!m) return;
  b.addEventListener('click',function(){
    var open=m.classList.toggle('is-open'); b.setAttribute('aria-expanded',open);
  });
})();

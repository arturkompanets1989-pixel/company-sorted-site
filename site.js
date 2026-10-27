/* Подгонка полосы 795px под узкий экран. Подключать на каждой странице двери
   строкой <script src="../22-ЭТАЛОН-ЛЕНДИНГА/эталон.js" defer></script> */
(function () {
  function fit() {
    var p = document.querySelector(".стр");
    if (!p) return;
    var k = Math.min(1, document.documentElement.clientWidth / 1192.5);
    p.style.transform = k < 1 ? "scale(" + k + ")" : "none";
    p.style.transformOrigin = "top left";
    document.body.style.height = k < 1 ? p.scrollHeight * k + "px" : "";
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", fit);
  else fit();
  addEventListener("resize", fit);
})();

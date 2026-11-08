// BADMAN BEGIN public pages: Thai / English.
// Thai is the default. ?lang=en (or the TH/EN button) switches and the choice is remembered on this device.
// Static text:  <b data-en="English">ไทย</b>   attributes: data-en-placeholder / data-en-aria-label / data-en-title / data-en-content
// Script text:  T("ไทย", "English")            dates: new Date(...).toLocaleDateString(LOCALE, ...)
(function () {
  var KEY = "badman-lang";
  var lang = "th";
  try {
    var q = new URLSearchParams(location.search).get("lang");
    if (q === "en" || q === "th") localStorage.setItem(KEY, q);
    lang = localStorage.getItem(KEY) === "en" ? "en" : "th";
  } catch (e) {}
  window.LANG = lang;
  window.LOCALE = lang === "en" ? "en-GB" : "th-TH";
  window.T = function (th, en) { return lang === "en" && en != null ? en : th; };
  document.documentElement.lang = lang;

  function apply(root) {
    if (lang !== "en") return;
    (root || document).querySelectorAll("[data-en]").forEach(function (el) { el.innerHTML = el.getAttribute("data-en"); });
    ["placeholder", "aria-label", "title", "content", "alt"].forEach(function (a) {
      (root || document).querySelectorAll("[data-en-" + a + "]").forEach(function (el) { el.setAttribute(a, el.getAttribute("data-en-" + a)); });
    });
  }
  window.applyLang = apply;

  function button() {
    var b = document.createElement("button");
    b.type = "button";
    b.className = "lang-toggle";
    b.setAttribute("aria-label", lang === "en" ? "เปลี่ยนเป็นภาษาไทย" : "Switch to English");
    b.innerHTML = lang === "en" ? "<b>EN</b><span>TH</span>" : "<b>TH</b><span>EN</span>";
    b.addEventListener("click", function () {
      try { localStorage.setItem(KEY, lang === "en" ? "th" : "en"); } catch (e) {}
      var u = new URL(location.href); u.searchParams.delete("lang");
      location.replace(u.toString());
    });
    return b;
  }
  var css = ".lang-toggle{display:inline-flex;align-items:center;gap:2px;border:1px solid rgba(233,185,47,.55);background:rgba(15,15,14,.85);border-radius:999px;padding:3px;cursor:pointer;font:inherit;font-size:12px;font-weight:900;line-height:1;flex:0 0 auto}" +
    ".lang-toggle b,.lang-toggle span{padding:5px 8px;border-radius:999px}.lang-toggle b{background:#e9b92f;color:#0f0f0e}.lang-toggle span{color:#d8d2c0}" +
    ".lang-toggle.floating{position:fixed;top:calc(10px + env(safe-area-inset-top));right:12px;z-index:50;box-shadow:0 4px 14px rgba(0,0,0,.25)}";
  function ready() {
    var st = document.createElement("style"); st.textContent = css; document.head.appendChild(st);
    var slot = document.querySelector("[data-lang-slot]");
    var b = button();
    if (slot) slot.appendChild(b); else { b.classList.add("floating"); document.body.appendChild(b); }
    if (document.title && document.querySelector("title[data-en]") && lang === "en") document.title = document.querySelector("title").getAttribute("data-en");
    apply(document);
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", ready); else ready();
})();
// English descriptions of the 8 levels (Thai ones live with LEVELS in each page and app/members.ts).
window.LEVEL_EN = {
  1: "Just picked up a racket: some serves clear the net, some don't. Here for the sweat and the laughs.",
  2: "Starting to hit the shuttle, can return shots that come straight at you and keep short 2–3 shot rallies.",
  3: "Hitting back more often, direction still a bit wild, starting to enjoy games with friends.",
  4: "Chases everything on court, full of energy, can clear to the back sometimes. Power and hustle.",
  5: "Keeps rallies going and starts dropping shots at the net. Ready for proper, fun games.",
  6: "Has cuts and saves, better placement, understands doubles positions. All-round skills growing.",
  7: "Skilled and fun to play with, varied shots, fit and quick, can guide teammates.",
  8: "Very experienced, plays every style and controls the game, shares the shuttle and is extra kind to beginners.",
};
// The staff type the fee in Thai ("100 บาท/คน + ลูกละ 28 บาท"); show it in English where the pattern is known.
window.feeText = function (s) {
  if (window.LANG !== "en" || !s) return s;
  return String(s).replace(/(\d+)\s*บาท\s*\/\s*คน/g, "$1 THB/person").replace(/ลูกละ\s*(\d+)\s*บาท/g, "$1 THB/shuttle").replace(/บาท/g, "THB");
};

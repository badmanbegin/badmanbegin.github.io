// "ศุกร์นี้ฉันไป!" story card (1080x1920), drawn on the device from public data only.
// Uses the sign-up page's globals: round, roster, standings(), mine(), isEarly(), capTotal(), photoData, API, FIREBASE, LV, T, LANG, LOCALE.
(function () {
  const W = 1080, H = 1920;
  const FONT = '"Noto Sans Thai","Leelawadee UI",Tahoma,sans-serif';
  // iPhone/iPad Safari measure Thai text on a canvas too narrow; measure with the page layout instead.
  let measurer = null;
  function textWidth(font, text) {
    if (!measurer) { measurer = document.createElement("span"); measurer.setAttribute("aria-hidden", "true"); measurer.style.cssText = "position:absolute;left:-10000px;top:0;visibility:hidden;white-space:pre;"; document.body.appendChild(measurer); }
    measurer.style.font = font; measurer.textContent = text;
    return measurer.getBoundingClientRect().width;
  }
  function center(ctx, text, x, y) { ctx.textAlign = "left"; ctx.fillText(text, x - textWidth(ctx.font, text) / 2, y); }
  function fit(ctx, text, max, size, weight) { let px = size; do { ctx.font = `${weight} ${px}px ${FONT}`; px -= 4; } while (textWidth(ctx.font, text) > max && px > 24); }
  function img(src) { return new Promise((ok) => { if (!src) return ok(null); const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; }); }
  function disc(ctx, im, x, y, r, fill) {
    ctx.save(); ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2); ctx.fillStyle = fill; ctx.fill(); ctx.clip();
    if (im) { const k = Math.max((2 * r) / im.width, (2 * r) / im.height); ctx.drawImage(im, x - (im.width * k) / 2, y - (im.height * k) / 2, im.width * k, im.height * k); }
    ctx.restore();
  }
  function pill(ctx, x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }

  async function draw() {
    const my = mine();
    const m = my?.memberId ? roster.get(my.memberId) : null;
    const lv = m?.level || null;
    const st = standings();
    const total = st.reduce((t, s) => t + s.used, 0), cap = capTotal();
    try {
      const sample = "กขคงจฉชซญฎฐดตถทธนบปผพฟภมยรลวศษสหฬอฮะาิีึืุูเแโใไ่้๊๋์ัำ็" + (my?.name || "") + "ศุกร์นี้ฉันไปมาตีด้วยกันลงชื่อที่";
      await Promise.race([Promise.all(["700", "800", "900"].map((w) => document.fonts.load(`${w} 40px "Noto Sans Thai"`, sample))), new Promise((r) => setTimeout(r, 4000))]);
    } catch {}
    let photo = null;
    if (m?.photo) {
      if (!photoData.has(m.id)) photoData.set(m.id, fetch(`${API}/photos/${encodeURIComponent(m.id)}?key=${FIREBASE.apiKey}`).then((r) => (r.ok ? r.json() : null)).then((d) => d?.fields?.data?.stringValue || null).catch(() => null));
      const src = await photoData.get(m.id);
      if (src && src.startsWith("data:image/")) photo = await img(src);
    }
    const [logo, art, badge] = await Promise.all([img("../badman-begin-logo.webp"), lv ? img(`../levels/full${lv}.webp`) : null, lv ? img(`../levels/lv${lv}.webp`) : null]);

    const c = document.createElement("canvas"); c.width = W; c.height = H;
    const ctx = c.getContext("2d");
    ctx.textBaseline = "middle";
    const g = ctx.createLinearGradient(0, 0, W * 0.4, H); g.addColorStop(0, "#080808"); g.addColorStop(0.62, "#161510"); g.addColorStop(1, "#3d300e"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(233,185,47,.15)"; ctx.lineWidth = 2;
    for (const r of [320, 420, 540]) { ctx.beginPath(); ctx.arc(W - 30, 250, r, 0, Math.PI * 2); ctx.stroke(); }
    for (const r of [260, 380]) { ctx.beginPath(); ctx.arc(40, H - 420, r, 0, Math.PI * 2); ctx.stroke(); }

    // header
    if (logo) { disc(ctx, logo, W / 2, 190, 92, "#0f0f0e"); ctx.beginPath(); ctx.arc(W / 2, 190, 92, 0, Math.PI * 2); ctx.lineWidth = 7; ctx.strokeStyle = "#e9b92f"; ctx.stroke(); }
    ctx.font = `900 50px ${FONT}`; const a = "BADMAN ", b = "BEGIN", aw = textWidth(ctx.font, a), bw = textWidth(ctx.font, b);
    ctx.textAlign = "left"; ctx.fillStyle = "#fff"; ctx.fillText(a, W / 2 - (aw + bw) / 2, 330); ctx.fillStyle = "#e9b92f"; ctx.fillText(b, W / 2 - (aw + bw) / 2 + aw, 330);

    // headline
    ctx.fillStyle = "#e9b92f"; fit(ctx, T("ศุกร์นี้ฉันไป!", "I'm in this Friday!"), W - 120, 132, 900); center(ctx, T("ศุกร์นี้ฉันไป!", "I'm in this Friday!"), W / 2, 470);
    const day = new Date(round.date + "T12:00:00+07:00").toLocaleDateString(LOCALE, { weekday: "long", day: "numeric", month: "long" });
    ctx.fillStyle = "#fff"; fit(ctx, day, W - 160, 56, 800); center(ctx, day, W / 2, 580);
    const when = T(`มา ${my.slot} น. • สนามแบดวังนาคา ลาดพร้าว 64`, `Arriving ${my.slot} • Wang Naka court, Lat Phrao 64`);
    ctx.fillStyle = "#d8d2c0"; fit(ctx, when, W - 140, 38, 700); center(ctx, when, W / 2, 650);

    // portrait
    const cx = W / 2, cy = 1010, R = 270;
    ctx.beginPath(); ctx.arc(cx, cy, R + 26, 0, Math.PI * 2); ctx.fillStyle = "rgba(233,185,47,.14)"; ctx.fill();
    disc(ctx, photo || art, cx, cy, R, photo || art ? "#fff" : "#0f0f0e");
    if (!photo && !art) { ctx.fillStyle = "#e9b92f"; ctx.font = `900 220px ${FONT}`; center(ctx, String(my.name).trim().replace(/^[เแโใไ]+/, "").charAt(0).toUpperCase(), cx, cy + 10); }
    ctx.beginPath(); ctx.arc(cx, cy, R, 0, Math.PI * 2); ctx.lineWidth = 14; ctx.strokeStyle = "#e9b92f"; ctx.stroke();
    if (badge && photo) { const bx = cx + R * 0.72, by = cy + R * 0.72; disc(ctx, badge, bx, by, 88, "#fff"); ctx.beginPath(); ctx.arc(bx, by, 88, 0, Math.PI * 2); ctx.lineWidth = 9; ctx.strokeStyle = "#e9b92f"; ctx.stroke(); }
    if (isEarly(my)) {
      const label = "🐦 EARLY BIRD"; ctx.font = `900 34px ${FONT}`; const w = textWidth(ctx.font, label) + 56;
      const px = cx - R * 0.95 - 10, py = cy - R * 0.92;
      ctx.save(); ctx.translate(px + w / 2, py + 34); ctx.rotate(-0.12);
      pill(ctx, -w / 2, -34, w, 68, 34); ctx.fillStyle = "#ffe08a"; ctx.fill(); ctx.lineWidth = 6; ctx.strokeStyle = "#0f0f0e"; ctx.stroke();
      ctx.fillStyle = "#0f0f0e"; center(ctx, label, 0, 2); ctx.restore();
    }

    // name + level
    ctx.fillStyle = "#fff"; fit(ctx, my.name, W - 140, 112, 900); center(ctx, my.name, cx, 1375);
    const lvl = lv ? `LEVEL ${lv} • ${LV[lv]}` : my.memberId ? T("สมาชิกก๊วน BADMAN BEGIN", "BADMAN BEGIN member") : T("มาครั้งแรก! ฝากตัวด้วย", "First time here!");
    ctx.fillStyle = "#e9b92f"; fit(ctx, lvl, W - 160, 44, 800); center(ctx, lvl, cx, 1465);
    if (my.guests?.length) { const gtxt = T(`+ พาเพื่อนมาอีก ${my.guests.length} คน`, `+ bringing ${my.guests.length} friend${my.guests.length > 1 ? "s" : ""}`); ctx.fillStyle = "#d8d2c0"; ctx.font = `700 34px ${FONT}`; center(ctx, gtxt, cx, 1525); }

    // seats box
    const left = Math.max(0, cap - total);
    const box = T(`ลงชื่อแล้ว ${total}/${cap} คน • ${left ? `เหลือ ${left} ที่` : "เต็มแล้ว ต่อคิวสำรองได้"}`, `${total}/${cap} signed up • ${left ? `${left} places left` : "full, waiting list open"}`);
    ctx.font = `800 38px ${FONT}`; const bwid = Math.min(W - 120, textWidth(ctx.font, box) + 80);
    pill(ctx, cx - bwid / 2, 1590, bwid, 84, 42); ctx.fillStyle = "rgba(255,255,255,.08)"; ctx.fill(); ctx.lineWidth = 3; ctx.strokeStyle = left && left <= 5 ? "#ff8a5c" : "rgba(233,185,47,.5)"; ctx.stroke();
    ctx.fillStyle = left && left <= 5 ? "#ffb08f" : "#fff"; fit(ctx, box, bwid - 50, 38, 800); center(ctx, box, cx, 1632);

    // call to action band
    ctx.fillStyle = "#e9b92f"; ctx.fillRect(0, H - 190, W, 190);
    ctx.fillStyle = "#0f0f0e"; fit(ctx, T("มาตีด้วยกัน! ลงชื่อได้ที่", "Come and play! Sign up at"), W - 120, 44, 800); center(ctx, T("มาตีด้วยกัน! ลงชื่อได้ที่", "Come and play! Sign up at"), cx, H - 130);
    fit(ctx, "badmanbegin.github.io/signup", W - 120, 58, 900); center(ctx, "badmanbegin.github.io/signup", cx, H - 62);
    return new Promise((ok) => c.toBlob((bl) => ok(bl), "image/png"));
  }

  const css = `.card-preview{position:fixed;inset:0;background:rgba(10,10,9,.88);z-index:30;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;padding:16px}
.card-preview img{max-width:min(360px,100%);max-height:calc(100vh - 170px);border-radius:16px;box-shadow:0 20px 60px rgba(0,0,0,.5)}
.card-preview .row{display:flex;gap:8px;flex-wrap:wrap;justify-content:center}
.card-preview .row a,.card-preview .row button{border:0;border-radius:11px;padding:11px 16px;font:inherit;font-weight:900;cursor:pointer;text-decoration:none;background:#e9b92f;color:#0f0f0e}
.card-preview .row #gcClose{background:rgba(255,255,255,.14);color:#fff}
.card-preview small{color:#d8d2c0;text-align:center}`;
  let styled = false;

  window.makeGoingCard = async function (btn) {
    if (!mine()) return;
    if (!styled) { const st = document.createElement("style"); st.textContent = css; document.head.appendChild(st); styled = true; }
    const label = btn.textContent; btn.disabled = true; btn.textContent = T("กำลังสร้างการ์ด…", "Making your card…");
    try {
      const blob = await draw();
      const file = new File([blob], "badman-im-in.png", { type: "image/png" });
      const url = URL.createObjectURL(blob);
      const canShare = navigator.canShare && navigator.canShare({ files: [file] });
      const box = document.createElement("div"); box.className = "card-preview"; box.id = "gcPreview";
      box.innerHTML = `<img src="${url}" alt="${T("การ์ดศุกร์นี้ฉันไป", "I'm in this Friday card")}"><div class="row">${canShare ? `<button id="gcShare">${T("แชร์ไป IG / FB / LINE", "Share to IG / FB / LINE")}</button>` : ""}<a href="${url}" download="badman-im-in.png">${T("ดาวน์โหลดรูป", "Download image")}</a><button id="gcClose">${T("ปิด", "Close")}</button></div><small>${T("ลงสตอรี่แล้วแท็กเพื่อนที่อยากชวนมาตีด้วยกัน", "Post it to your story and tag the friends you want to bring")}</small>`;
      box.addEventListener("click", async (e) => {
        if (e.target.id === "gcShare") { try { await navigator.share({ files: [file], title: "BADMAN BEGIN", text: T("ศุกร์นี้ฉันไปตีแบดที่ BADMAN BEGIN มาด้วยกัน! badmanbegin.github.io/signup", "I'm playing at BADMAN BEGIN this Friday, come along! badmanbegin.github.io/signup") }); } catch {} }
        else if (e.target.id === "gcClose" || e.target === box) { box.remove(); URL.revokeObjectURL(url); }
      });
      document.body.appendChild(box);
    } catch { toast(T("สร้างการ์ดไม่สำเร็จ ลองอีกครั้ง", "Couldn't make the card, try again")); }
    finally { btn.disabled = false; btn.textContent = label; }
  };
})();

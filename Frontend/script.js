/* ===== DADOS EDITÁVEIS ===== */
const CONFIG = { whatsapp: "258874083302", phone: "+258874083302", mapQuery: "VJ55+HQ Tete" };
const PRODUCTS = [
    { name: "Água Estrela Fresh", size: "1.5 L", price: 8.5, img: "img/botija15.png" },
    { name: "Água Estrela Familiar", size: "5L & 6L", price: 30, img: "img/botija56.jpg" },
    { name: "Água Estrela Clássica", size: "18L", price: 100, img: "img/botija18.jpg" },
    { name: "Água Estrela Especial", size: "25L", price: 110, img: "img/botija25.jpg" }];

const PAGAMENTO = {
    moeda: "MT", metodos: [
        { id: "mpesa", nome: "M-Pesa", info: "Número M-Pesa: a confirmar pela empresa." },
        { id: "emola", nome: "e-Mola", info: "Número e-Mola: a confirmar pela empresa." },
        { id: "dinheiro", nome: "Numerário na entrega", info: "Pague ao receber o seu pedido." }]
};

const WHY = [
    { t: "Qualidade", d: "Texto a confirmar pela empresa.", i: '<path d="M12 2l3 6.5 7 .9-5.1 4.8 1.3 7L12 17.8 5.8 21.2l1.3-7L2 9.4l7-.9z"/>' },
    { t: "Frescura", d: "Texto a confirmar pela empresa.", i: '<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>' },
    { t: "Confiança", d: "Texto a confirmar pela empresa.", i: '<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>' },
    { t: "Compromisso com os Clientes", d: "Texto a confirmar pela empresa.", i: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7z"/>' }];
/* ================================================================== */

const $ = s => document.querySelector(s);
const wa = t => `https://wa.me/${CONFIG.whatsapp}` + (t ? `?text=${encodeURIComponent(t)}` : "");
const esc = s => s.replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));

/* ligações */
$("#wabig").href = wa("Olá! Gostaria de fazer um pedido de Água Estrela.");
$("#wasm").href = $("#fab").href = wa("Olá! Gostaria de falar com a Água Estrela.");
$("#call").href = "tel:" + CONFIG.phone;
$("#maplink").href = "https://www.google.com/maps/search/?api=1&query=" + encodeURIComponent(CONFIG.mapQuery);

/* produtos e benefícios */
const fmt = n => n.toLocaleString("pt-PT", { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " " + PAGAMENTO.moeda;
const cart = PRODUCTS.map(() => 0);
const count = () => cart.reduce((s, q) => s + q, 0);
const total = () => cart.reduce((s, q, i) => s + q * PRODUCTS[i].price, 0);

$("#plist").innerHTML = PRODUCTS.map((p, i) => `<article class="card rv">${p.img ? `<img class="pimg-img" src="${esc(p.img)}" alt="${esc(p.name)}" loading="lazy">` : '<div class="pimg">Espaço reservado para a fotografia da garrafa</div>'}<h3>${esc(p.name)}</h3><div class="meta">${esc(p.size)}</div><div class="price">${fmt(p.price)}</div>
<div class="qty" role="group" aria-label="Quantidade de ${esc(p.name)}"><button type="button" data-q="${i}" data-d="-1" aria-label="Diminuir quantidade">−</button><output id="q${i}">0</output><button type="button" data-q="${i}" data-d="1" aria-label="Aumentar quantidade">+</button></div>
<div class="sub" id="s${i}"></div>
<a class="btn btn-p" href="#pedidos" data-p="${i}">FAZER PEDIDO</a></article>`).join("");

function upd() {
    PRODUCTS.forEach((p, i) => { $("#q" + i).textContent = cart[i]; $("#s" + i).textContent = cart[i] ? "Subtotal: " + fmt(cart[i] * p.price) : "" });
    const n = count();
    $("#resumo").innerHTML = n
        ? "<ul>" + PRODUCTS.map((p, i) => cart[i] ? `<li><span>${cart[i]} × ${esc(p.name)} (${esc(p.size)})</span><b>${fmt(cart[i] * p.price)}</b></li>` : "").join("") + `</ul><div class="tot"><span>TOTAL</span><b>${fmt(total())}</b></div>`
        : '<p class="vazio">Ainda não adicionou produtos. Use os botões − e + nos cartões acima.</p>';
    $("#bar").hidden = !n; $("#bar-n").textContent = n; $("#bar-t").textContent = fmt(total());
    if (n) $("#e-cart").textContent = "";
}
document.addEventListener("click", e => {
    const q = e.target.closest("[data-q]");
    if (q) { const i = +q.dataset.q; cart[i] = Math.max(0, Math.min(99, cart[i] + (+q.dataset.d))); upd(); return }
    const a = e.target.closest("[data-p]");
    if (a && !cart[+a.dataset.p]) { cart[+a.dataset.p] = 1; upd() }
});

const pag = $("#pag");
pag.innerHTML = '<option value="">Seleccione…</option>' + PAGAMENTO.metodos.map(m => `<option value="${m.id}">${esc(m.nome)}</option>`).join("");
pag.onchange = () => { const m = PAGAMENTO.metodos.find(x => x.id === pag.value); $("#paginfo").textContent = m ? m.info : "" };
upd();

$("#wlist").innerHTML = WHY.map(w => `<article class="card rv"><div class="ico"><svg viewBox="0 0 24 24" aria-hidden="true">${w.i}</svg></div><h3>${esc(w.t)}</h3><p>${esc(w.d)}</p></article>`).join("");

/* menu mobile */
const burger = $("#burger"), menu = $("#menu");
burger.onclick = () => { const o = menu.classList.toggle("open"); burger.setAttribute("aria-expanded", o) };
menu.addEventListener("click", e => { if (e.target.closest("a")) { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false) } });

/* gotas de água */
$("#drops").innerHTML = Array.from({ length: 14 }, (_, i) => `<span class="drop" style="left:${(i * 7.3 + 3) % 98}%;top:${(i * 13) % 40}px;animation-duration:${6 + i % 5 * 1.5}s;animation-delay:${-i * 1.1}s;transform-origin:center;scale:${.6 + i % 4 * .25}"></span>`).join("");

/* animações ao fazer scroll */
const io = new IntersectionObserver(es => es.forEach(x => { if (x.isIntersecting) { x.target.classList.add("in"); io.unobserve(x.target) } }), { threshold: .12 });
document.querySelectorAll(".rv").forEach((el, i) => { el.style.transitionDelay = (i % 4) * 80 + "ms"; io.observe(el) });

/* telefone: só dígitos, formatado, sem o prefixo 258 */
$("#tel").addEventListener("input", e => {
    let d = e.target.value.replace(/\D/g, "");
    if (d.startsWith("258") && d.length > 9) d = d.slice(3);
    d = d.slice(0, 9);
    e.target.value = d.replace(/^(\d{2})(\d{0,3})(\d{0,4}).*/, (m, a, b, c) => [a, b, c].filter(Boolean).join(" "));
});

/* formulário com validação */
const F = $("#form");
const rules = {
    nome: v => v.trim().length >= 3 || "Indique o seu nome completo.",
    loc: v => v.trim().length >= 3 || "Indique a localização de entrega.",
    pag: v => v !== "" || "Seleccione a forma de pagamento.",
    tel: v => /^8[2-7]\d{7}$/.test(v.replace(/\s/g, "")) || "Indique um número válido, com 9 dígitos (ex.: 84 123 4567).",

};
F.addEventListener("submit", e => {
    e.preventDefault(); let ok = true;
    for (const k in rules) { const el = F.elements[k], r = rules[k](el.value); $("#e-" + k).textContent = r === true ? "" : r; el.setAttribute("aria-invalid", r !== true); if (r !== true) ok = false }
    const vazio = count() === 0;
    $("#e-cart").textContent = vazio ? "Adicione pelo menos um produto ao pedido." : "";
    if (vazio) ok = false;
    if (!ok) { const bad = F.querySelector('[aria-invalid="true"]'); bad ? bad.focus() : $("#produtos").scrollIntoView(); return }
    const m = PAGAMENTO.metodos.find(x => x.id === F.pag.value);
    const linhas = PRODUCTS.map((p, i) => cart[i] ? `• ${cart[i]} × ${p.name} (${p.size}) — ${fmt(cart[i] * p.price)}` : "").filter(Boolean).join("\n");
    const t = `Olá! Gostaria de fazer um pedido de Água Estrela.\n\nNome: ${F.nome.value.trim()}\nTelefone: +258 ${F.tel.value.trim()}\n\nPEDIDO:\n${linhas}\n\nTOTAL: ${fmt(total())}\nPagamento: ${m.nome}` + (F.msg.value.trim() ? `\n\nMensagem: ${F.msg.value.trim()}` : "");
    $("#ok").hidden = false; window.open(wa(t), "_blank", "noopener");
});
// Maakt HTML veilig om te tonen in het admin-dashboard (alleen in de browser gebruiken).
// Houdt eenvoudige opmaak (alinea's, vet, lijsten, links) en gooit al het andere weg:
// scripts, event-handlers (onerror=…), style, iframes, plaatjes en javascript:-links.
const TOEGESTAAN = new Set([
  "p", "br", "b", "strong", "i", "em", "u", "s", "ul", "ol", "li", "a",
  "h1", "h2", "h3", "h4", "blockquote", "span", "div", "hr",
]);
const WEG_MET_INHOUD = new Set(["script", "style", "iframe", "object", "embed", "template", "noscript", "svg", "math"]);

function schoon(bron: Node, doel: Node, doc: Document) {
  for (const kind of Array.from(bron.childNodes)) {
    if (kind.nodeType === Node.TEXT_NODE) {
      doel.appendChild(doc.createTextNode(kind.textContent ?? ""));
      continue;
    }
    if (kind.nodeType !== Node.ELEMENT_NODE) continue;
    const el = kind as Element;
    const tag = el.tagName.toLowerCase();
    if (WEG_MET_INHOUD.has(tag)) continue;
    if (!TOEGESTAAN.has(tag)) { schoon(el, doel, doc); continue; } // onbekende tag: alleen de inhoud
    const nieuw = doc.createElement(tag);
    if (tag === "a") {
      const href = (el.getAttribute("href") ?? "").trim();
      if (/^(https?:|mailto:)/i.test(href)) {
        nieuw.setAttribute("href", href);
        nieuw.setAttribute("target", "_blank");
        nieuw.setAttribute("rel", "noopener noreferrer");
      }
    }
    schoon(el, nieuw, doc);
    doel.appendChild(nieuw);
  }
}

/** Tekst met \n of HTML → veilige HTML. Platte tekst krijgt <br> voor regelafbrekingen. */
export function veiligeHtml(invoer: string | null | undefined): string {
  const s = invoer ?? "";
  if (typeof window === "undefined") return "";
  const bevatHtml = /<[a-z][\s\S]*>/i.test(s);
  // DOMParser voert geen scripts uit en laadt geen plaatjes.
  const bronDoc = new DOMParser().parseFromString(bevatHtml ? s.replace(/\n/g, "<br>") : "", "text/html");
  const doel = document.implementation.createHTMLDocument("");
  const wrapper = doel.createElement("div");
  if (bevatHtml) {
    schoon(bronDoc.body, wrapper, doel);
  } else {
    s.split("\n").forEach((regel, i) => {
      if (i) wrapper.appendChild(doel.createElement("br"));
      wrapper.appendChild(doel.createTextNode(regel));
    });
  }
  return wrapper.innerHTML;
}

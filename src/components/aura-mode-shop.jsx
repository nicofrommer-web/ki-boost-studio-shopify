import { useMemo, useState } from "react";

/**
 * Aura Mode — Batch #04
 * Japandi-inspired E-Commerce Frontend (React + Tailwind).
 * Farben: #F5F2EB (Sand) / #C86D51 (Terracotta) · Fonts: Playfair Display / Inter.
 *
 * Selbstständige, lauffähige Komponente ohne externe Bild- oder Datenabhängigkeiten:
 * Produktbilder werden als generative SVG/Gradient-Platzhalter im Markenlook gerendert,
 * damit die Komponente ohne Netzwerkzugriff funktioniert.
 */

const FREE_SHIPPING_GOAL = 150;

const MATERIALS = {
  gold: { label: "Gold Vermeil", hex: "#C9A24B" },
  silver: { label: "Silber 925", hex: "#B9B7B0" },
  rose: { label: "Roségold", hex: "#D9A79C" },
};

const PRODUCTS = [
  {
    id: "aura-ring",
    name: "Aura Ring",
    category: "Ring",
    price: 68,
    compareAt: null,
    stock: 3,
    rating: 4.9,
    reviews: 128,
    icon: "ring",
    materials: ["gold", "silver", "rose"],
    description:
      "Ein schmaler, fließender Ring mit organischer Wellenform — inspiriert von den sanften Linien japanischer Keramik. Handpoliert in Kleinserie.",
    details: ["925er Sterlingsilber, 18k vergoldet", "Wasserfest & anlaufresistent", "Handgefertigt in Kleinserie · Batch #04"],
  },
  {
    id: "kiro-necklace",
    name: "Kiro Necklace",
    category: "Kette",
    price: 89,
    compareAt: 109,
    stock: 11,
    rating: 4.8,
    reviews: 96,
    icon: "necklace",
    materials: ["gold", "silver"],
    description:
      "Feine Ankerkette mit einem einzelnen, asymmetrischen Anhänger. Reduziert auf das Wesentliche — der ruhige Gegenpol zum lauten Alltag.",
    details: ["Kettenlänge 45 cm + 5 cm Verlängerung", "Anhänger 12 × 8 mm", "Batch #04 · limitiert auf 200 Stück"],
  },
  {
    id: "nami-hoops",
    name: "Nami Hoops",
    category: "Ohrringe",
    price: 54,
    compareAt: null,
    stock: 3,
    rating: 5.0,
    reviews: 74,
    icon: "hoops",
    materials: ["gold", "silver", "rose"],
    description:
      "Minimalistische Creolen mit strukturierter Oberfläche, die das Licht wie bewegtes Wasser einfängt. Federleicht für den ganzen Tag.",
    details: ["Durchmesser 22 mm", "Gewicht: nur 3,1 g pro Ohrring", "Hypoallergener Verschluss"],
  },
  {
    id: "sora-bracelet",
    name: "Sora Bracelet",
    category: "Armband",
    price: 72,
    compareAt: null,
    stock: 16,
    rating: 4.7,
    reviews: 61,
    icon: "bracelet",
    materials: ["gold", "silver", "rose"],
    description:
      "Ein zartes Kettenarmband mit mattierten und polierten Gliedern im Wechsel — für den Japandi-Look aus Kontrast und Ruhe.",
    details: ["Länge 16 cm + 3 cm Verlängerung", "Verstellbarer Karabinerverschluss", "Batch #04"],
  },
  {
    id: "yuki-cuff",
    name: "Yuki Cuff",
    category: "Manschette",
    price: 96,
    compareAt: 118,
    stock: 4,
    rating: 4.9,
    reviews: 42,
    icon: "cuff",
    materials: ["gold", "silver"],
    description:
      "Eine offene Manschette mit skulpturaler, leicht gebürsteter Oberfläche. Das Statement-Piece der Kollektion — bewusst unaufdringlich.",
    details: ["Offene Passform, one-size", "Handgebürstete Oberflächenveredelung", "Limitierte Auflage · Batch #04"],
  },
];

const TESTIMONIALS = [
  {
    name: "Lina M.",
    location: "Hamburg",
    rating: 5,
    verified: true,
    text: "Die Verarbeitung ist unfassbar hochwertig für den Preis. Der Aura Ring sieht aus wie handgefertigtes Designerstück — und fühlt sich auch so an.",
  },
  {
    name: "Jonas B.",
    location: "Wien",
    rating: 5,
    verified: true,
    text: "Habe die Kiro Necklace für meine Partnerin bestellt. Die Verpackung allein war schon ein Erlebnis. Lieferung war schneller als erwartet.",
  },
  {
    name: "Amelie K.",
    location: "Zürich",
    rating: 4,
    verified: true,
    text: "Sehr reduziertes, zeitloses Design — genau das, wonach ich gesucht habe. Die Nami Hoops trage ich inzwischen fast täglich.",
  },
  {
    name: "Sophia R.",
    location: "München",
    rating: 5,
    verified: true,
    text: "Endlich ein Schmucklabel, das nicht nach Massenware aussieht. Batch #04 war innerhalb von Tagen ausverkauft, verständlich.",
  },
];

const TRUST_BADGES = [
  { icon: "leaf", label: "Klimaneutraler Versand" },
  { icon: "return", label: "30 Tage Rückgaberecht" },
  { icon: "lock", label: "Sichere Zahlung (SSL)" },
  { icon: "hand", label: "Handgefertigt in Kleinserie" },
];

function formatPrice(value) {
  return `${value.toFixed(2).replace(".", ",")} €`;
}

function Icon({ name, className = "w-5 h-5" }) {
  const common = { className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 1.5 };
  switch (name) {
    case "cart":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.5l1.5 12.75h12.75L19.5 7.5H5.36" />
          <circle cx="9" cy="20.25" r="1" fill="currentColor" stroke="none" />
          <circle cx="17" cy="20.25" r="1" fill="currentColor" stroke="none" />
        </svg>
      );
    case "close":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    case "star":
      return (
        <svg viewBox="0 0 20 20" className={className} fill="currentColor">
          <path d="M10 1.5l2.6 5.27 5.82.85-4.21 4.1 1 5.79L10 14.9l-5.21 2.61 1-5.79-4.21-4.1 5.82-.85L10 1.5z" />
        </svg>
      );
    case "minus":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14" />
        </svg>
      );
    case "plus":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
        </svg>
      );
    case "chevronLeft":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      );
    case "chevronRight":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
      );
    case "leaf":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 20c8-1 12-6 13-15-9 1-13 6-13 15zM6 18c3-4 6-6 11-11" />
        </svg>
      );
    case "return":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v6h6M4.5 15a8 8 0 1 0 2-9.5L4 10" />
        </svg>
      );
    case "lock":
      return (
        <svg {...common}>
          <rect x="4.5" y="10.5" width="15" height="9" rx="1.5" />
          <path strokeLinecap="round" d="M7.5 10.5V7a4.5 4.5 0 0 1 9 0v3.5" />
        </svg>
      );
    case "hand":
      return (
        <svg {...common}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 11V5a1.5 1.5 0 0 1 3 0v5m0-3a1.5 1.5 0 0 1 3 0v3m0-2a1.5 1.5 0 0 1 3 0v3.5M7 11l-1.8 1.8a2 2 0 0 0 0 2.9l3.6 3.6a4 4 0 0 0 2.9 1.2h2.3a4 4 0 0 0 4-4v-4.5a1.5 1.5 0 0 0-3 0" />
        </svg>
      );
    default:
      return null;
  }
}

function JewelryGlyph({ icon, className = "w-10 h-10" }) {
  const common = { className, fill: "none", stroke: "currentColor", strokeWidth: 1.1, viewBox: "0 0 64 64" };
  switch (icon) {
    case "ring":
      return (
        <svg {...common}>
          <circle cx="32" cy="36" r="16" />
          <path d="M24 20l8-8 8 8-4 8h-8l-4-8z" />
        </svg>
      );
    case "necklace":
      return (
        <svg {...common}>
          <path d="M14 12c0 14 8 24 18 24s18-10 18-24" />
          <circle cx="32" cy="40" r="5" />
        </svg>
      );
    case "hoops":
      return (
        <svg {...common}>
          <circle cx="22" cy="30" r="11" />
          <circle cx="42" cy="30" r="11" />
        </svg>
      );
    case "bracelet":
      return (
        <svg {...common}>
          <ellipse cx="32" cy="32" rx="20" ry="12" />
          <path d="M12 32c0-2 4-3 20-3s20 1 20 3" />
        </svg>
      );
    case "cuff":
      return (
        <svg {...common}>
          <path d="M16 24a16 16 0 0 1 26-3M48 40a16 16 0 0 1-26 3" />
          <path d="M16 24l-2 6 6 2M48 40l2-6-6-2" />
        </svg>
      );
    default:
      return null;
  }
}

function ProductMedia({ icon, tone = 0, className = "" }) {
  const gradients = [
    "from-[#EAE4D6] to-[#F5F2EB]",
    "from-[#E8DCD3] to-[#F5F2EB]",
    "from-[#DCC9BC] to-[#F0E9DE]",
  ];
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br ${gradients[tone % gradients.length]} ${className}`}
    >
      <div className="absolute inset-0 opacity-20 [background-image:radial-gradient(circle_at_20%_20%,#2B2A28_1px,transparent_1px)] [background-size:14px_14px]" />
      <JewelryGlyph icon={icon} className="relative w-16 h-16 text-aura-terracotta/70" />
    </div>
  );
}

function StockBadge({ stock }) {
  if (stock > 10) return null;
  const label = stock <= 3 ? `Nur noch ${stock} auf Lager` : `Wenige Stück verfügbar (${stock})`;
  return (
    <span className="absolute left-3 top-3 z-10 rounded-full bg-aura-terracotta px-3 py-1 text-[11px] font-medium tracking-wide text-white shadow-soft">
      {label}
    </span>
  );
}

function RatingStars({ rating, size = "w-3.5 h-3.5" }) {
  return (
    <div className="flex items-center gap-0.5 text-aura-terracotta">
      {Array.from({ length: 5 }).map((_, i) => (
        <Icon
          key={i}
          name="star"
          className={`${size} ${i < Math.round(rating) ? "text-aura-terracotta" : "text-aura-stone/30"}`}
        />
      ))}
    </div>
  );
}

function Swatches({ materials, selected, onSelect, size = "w-5 h-5" }) {
  return (
    <div className="flex items-center gap-2">
      {materials.map((key) => {
        const m = MATERIALS[key];
        const isActive = key === selected;
        return (
          <button
            key={key}
            type="button"
            title={m.label}
            aria-label={m.label}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(key);
            }}
            className={`${size} rounded-full ring-offset-2 transition ${
              isActive ? "ring-2 ring-aura-ink" : "ring-1 ring-aura-stone/40 hover:ring-aura-ink/60"
            }`}
            style={{ backgroundColor: m.hex }}
          />
        );
      })}
    </div>
  );
}

function ProductCard({ product, onQuickView, onAddToCart, tone }) {
  const [material, setMaterial] = useState(product.materials[0]);
  return (
    <div className="group flex flex-col">
      <div className="relative">
        <StockBadge stock={product.stock} />
        <ProductMedia icon={product.icon} tone={tone} className="aspect-[4/5] w-full" />
        <button
          type="button"
          onClick={() => onQuickView(product.id, material)}
          className="absolute inset-x-3 bottom-3 translate-y-2 rounded-full bg-white/90 py-2.5 text-center text-xs font-medium uppercase tracking-wider text-aura-ink opacity-0 backdrop-blur transition-all duration-200 group-hover:translate-y-0 group-hover:opacity-100"
        >
          Quick View
        </button>
      </div>
      <div className="mt-4 flex flex-1 flex-col">
        <p className="text-[11px] uppercase tracking-widest text-aura-stone">{product.category}</p>
        <h3 className="mt-1 font-serif text-lg text-aura-ink">{product.name}</h3>
        <div className="mt-1 flex items-center gap-2">
          <RatingStars rating={product.rating} />
          <span className="text-xs text-aura-stone">({product.reviews})</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="font-medium text-aura-ink">{formatPrice(product.price)}</span>
          {product.compareAt && (
            <span className="text-sm text-aura-stone line-through">{formatPrice(product.compareAt)}</span>
          )}
        </div>
        <div className="mt-3">
          <Swatches materials={product.materials} selected={material} onSelect={setMaterial} />
        </div>
        <button
          type="button"
          onClick={() => onAddToCart(product.id, material)}
          className="mt-4 w-full rounded-full border border-aura-ink py-2.5 text-xs font-medium uppercase tracking-wider text-aura-ink transition hover:bg-aura-ink hover:text-aura-sand"
        >
          In den Warenkorb
        </button>
      </div>
    </div>
  );
}

function QuickViewModal({ product, initialMaterial, onClose, onAddToCart }) {
  const [material, setMaterial] = useState(initialMaterial);
  const [qty, setQty] = useState(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-aura-ink/50 p-4" onClick={onClose}>
      <div
        className="relative grid w-full max-w-3xl grid-cols-1 gap-6 rounded-2xl bg-aura-sand p-6 shadow-soft sm:grid-cols-2 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Schließen"
          className="absolute right-4 top-4 rounded-full p-1.5 text-aura-ink/70 hover:bg-aura-ink/5"
        >
          <Icon name="close" className="h-5 w-5" />
        </button>
        <ProductMedia icon={product.icon} className="aspect-square w-full" />
        <div className="flex flex-col">
          <p className="text-[11px] uppercase tracking-widest text-aura-stone">{product.category} · Batch #04</p>
          <h2 className="mt-1 font-serif text-2xl text-aura-ink">{product.name}</h2>
          <div className="mt-2 flex items-center gap-2">
            <RatingStars rating={product.rating} />
            <span className="text-xs text-aura-stone">{product.reviews} Bewertungen</span>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-lg font-medium text-aura-ink">{formatPrice(product.price)}</span>
            {product.compareAt && (
              <span className="text-sm text-aura-stone line-through">{formatPrice(product.compareAt)}</span>
            )}
          </div>
          {product.stock <= 3 && (
            <p className="mt-2 text-xs font-medium text-aura-terracotta">Nur noch {product.stock} auf Lager</p>
          )}
          <p className="mt-4 text-sm leading-relaxed text-aura-ink/80">{product.description}</p>
          <ul className="mt-4 space-y-1.5 text-xs text-aura-stone">
            {product.details.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-aura-terracotta">—</span>
                {d}
              </li>
            ))}
          </ul>

          <div className="mt-5">
            <p className="mb-2 text-xs font-medium uppercase tracking-wider text-aura-ink">Material</p>
            <Swatches materials={product.materials} selected={material} onSelect={setMaterial} size="w-6 h-6" />
          </div>

          <div className="mt-5 flex items-center gap-3">
            <div className="flex items-center rounded-full border border-aura-ink/20">
              <button
                type="button"
                aria-label="Menge verringern"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="p-2.5 text-aura-ink hover:text-aura-terracotta"
              >
                <Icon name="minus" className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm">{qty}</span>
              <button
                type="button"
                aria-label="Menge erhöhen"
                onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                className="p-2.5 text-aura-ink hover:text-aura-terracotta"
              >
                <Icon name="plus" className="h-3.5 w-3.5" />
              </button>
            </div>
            <button
              type="button"
              onClick={() => {
                onAddToCart(product.id, material, qty);
                onClose();
              }}
              className="flex-1 rounded-full bg-aura-terracotta py-3 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-aura-terracottaDark"
            >
              In den Warenkorb — {formatPrice(product.price * qty)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function CompleteTheLook({ anchorProduct, suggestions, onAddToCart }) {
  if (!anchorProduct) return null;
  return (
    <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="mb-8 flex items-end justify-between">
        <div>
          <p className="text-[11px] uppercase tracking-widest text-aura-terracotta">Complete the Look</p>
          <h2 className="mt-1 font-serif text-2xl text-aura-ink sm:text-3xl">
            Passt perfekt zur {anchorProduct.name}
          </h2>
        </div>
        <span className="hidden text-sm text-aura-stone sm:block">
          Set-Rabatt: 10 % beim Kauf von 2 oder mehr Teilen
        </span>
      </div>
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {[anchorProduct, ...suggestions].map((p, i) => (
          <div key={p.id} className="flex items-center gap-4 rounded-xl border border-aura-ink/10 bg-white/50 p-4">
            <ProductMedia icon={p.icon} tone={i} className="h-20 w-20 shrink-0" />
            <div className="min-w-0 flex-1">
              <p className="truncate font-serif text-base text-aura-ink">{p.name}</p>
              <p className="text-sm text-aura-stone">{formatPrice(p.price)}</p>
            </div>
            <button
              type="button"
              onClick={() => onAddToCart(p.id, p.materials[0])}
              aria-label={`${p.name} hinzufügen`}
              className="shrink-0 rounded-full border border-aura-ink p-2 text-aura-ink transition hover:bg-aura-ink hover:text-aura-sand"
            >
              <Icon name="plus" className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

function FreeShippingBar({ subtotal }) {
  const remaining = Math.max(0, FREE_SHIPPING_GOAL - subtotal);
  const pct = Math.min(100, (subtotal / FREE_SHIPPING_GOAL) * 100);
  return (
    <div className="rounded-xl bg-aura-sandDark/60 p-4">
      <p className="text-xs text-aura-ink">
        {remaining > 0 ? (
          <>
            Noch <span className="font-semibold text-aura-terracotta">{formatPrice(remaining)}</span> bis zum
            gratis Versand
          </>
        ) : (
          <span className="font-semibold text-aura-terracotta">Gratis Versand freigeschaltet ✓</span>
        )}
      </p>
      <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-white">
        <div
          data-testid="free-shipping-progress"
          className="h-full rounded-full bg-aura-terracotta transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function CartDrawer({ open, onClose, cart, onChangeQty, onRemove, onAddToCart }) {
  const lines = cart.map(({ productId, material, qty }) => {
    const product = PRODUCTS.find((p) => p.id === productId);
    return { product, material, qty };
  });
  const subtotal = lines.reduce((sum, l) => sum + l.product.price * l.qty, 0);

  const cartProductIds = new Set(cart.map((l) => l.productId));
  const upsell = PRODUCTS.find((p) => !cartProductIds.has(p.id));

  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-aura-ink/40 transition-opacity ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
      />
      <aside
        data-testid="cart-drawer"
        className={`fixed right-0 top-0 z-50 flex h-full w-full max-w-md transform flex-col bg-aura-sand shadow-soft transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!open}
      >
        <div className="flex items-center justify-between border-b border-aura-ink/10 px-6 py-5">
          <h2 className="font-serif text-xl text-aura-ink">Warenkorb ({lines.reduce((n, l) => n + l.qty, 0)})</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Warenkorb schließen"
            className="rounded-full p-1.5 hover:bg-aura-ink/5"
          >
            <Icon name="close" className="h-5 w-5" />
          </button>
        </div>

        <div className="px-6 pt-4">
          <FreeShippingBar subtotal={subtotal} />
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {lines.length === 0 ? (
            <p className="mt-10 text-center text-sm text-aura-stone">Dein Warenkorb ist noch leer.</p>
          ) : (
            <ul data-testid="cart-lines" className="space-y-5">
              {lines.map(({ product, material, qty }, idx) => (
                <li key={`${product.id}-${material}-${idx}`} className="flex gap-4">
                  <ProductMedia icon={product.icon} tone={idx} className="h-20 w-20 shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="font-serif text-sm text-aura-ink">{product.name}</p>
                        <p className="text-xs text-aura-stone">{MATERIALS[material].label}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(product.id, material)}
                        aria-label={`${product.name} entfernen`}
                        className="text-xs text-aura-stone underline-offset-2 hover:text-aura-terracotta hover:underline"
                      >
                        Entfernen
                      </button>
                    </div>
                    <div className="mt-2 flex items-center justify-between">
                      <div className="flex items-center rounded-full border border-aura-ink/20">
                        <button
                          type="button"
                          aria-label="Menge verringern"
                          onClick={() => onChangeQty(product.id, material, qty - 1)}
                          className="p-1.5 text-aura-ink hover:text-aura-terracotta"
                        >
                          <Icon name="minus" className="h-3 w-3" />
                        </button>
                        <span className="w-5 text-center text-xs">{qty}</span>
                        <button
                          type="button"
                          aria-label="Menge erhöhen"
                          onClick={() => onChangeQty(product.id, material, qty + 1)}
                          className="p-1.5 text-aura-ink hover:text-aura-terracotta"
                        >
                          <Icon name="plus" className="h-3 w-3" />
                        </button>
                      </div>
                      <span className="text-sm font-medium text-aura-ink">{formatPrice(product.price * qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}

          {upsell && (
            <div className="mt-6 rounded-xl border border-dashed border-aura-terracotta/40 p-4">
              <p className="text-[11px] uppercase tracking-widest text-aura-terracotta">Dazu passt auch</p>
              <div className="mt-3 flex items-center gap-3">
                <ProductMedia icon={upsell.icon} className="h-14 w-14 shrink-0" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-aura-ink">{upsell.name}</p>
                  <p className="text-xs text-aura-stone">{formatPrice(upsell.price)}</p>
                </div>
                <button
                  type="button"
                  onClick={() => onAddToCart(upsell.id, upsell.materials[0])}
                  className="shrink-0 rounded-full bg-aura-ink px-3 py-1.5 text-[11px] font-medium uppercase tracking-wider text-aura-sand transition hover:bg-aura-terracotta"
                >
                  +1 Klick
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="border-t border-aura-ink/10 px-6 py-5">
          <div className="mb-4 flex items-center justify-between text-sm">
            <span className="text-aura-stone">Zwischensumme</span>
            <span data-testid="cart-subtotal" className="font-medium text-aura-ink">{formatPrice(subtotal)}</span>
          </div>
          <button
            type="button"
            disabled={lines.length === 0}
            className="w-full rounded-full bg-aura-terracotta py-3.5 text-xs font-medium uppercase tracking-wider text-white transition hover:bg-aura-terracottaDark disabled:cursor-not-allowed disabled:opacity-40"
          >
            Zur Kasse
          </button>
          <p className="mt-3 text-center text-[11px] text-aura-stone">
            Versand & Steuern werden an der Kasse berechnet.
          </p>
        </div>
      </aside>
    </>
  );
}

function TestimonialSlider() {
  const [index, setIndex] = useState(0);
  const total = TESTIMONIALS.length;
  const go = (dir) => setIndex((i) => (i + dir + total) % total);
  const t = TESTIMONIALS[index];

  return (
    <section className="bg-aura-sandDark/50 py-16">
      <div className="mx-auto max-w-3xl px-4 text-center sm:px-6">
        <p className="text-[11px] uppercase tracking-widest text-aura-terracotta">Stimmen unserer Kund:innen</p>
        <div className="mt-6 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Vorherige Bewertung"
            className="rounded-full border border-aura-ink/20 p-2 text-aura-ink hover:bg-aura-ink hover:text-aura-sand"
          >
            <Icon name="chevronLeft" className="h-4 w-4" />
          </button>
          <div className="min-h-[10rem] flex-1">
            <RatingStars rating={t.rating} size="w-4 h-4" />
            <p className="mx-auto mt-4 max-w-xl font-serif text-xl leading-relaxed text-aura-ink sm:text-2xl">
              „{t.text}“
            </p>
            <p className="mt-4 text-sm text-aura-stone">
              {t.name} · {t.location}
              {t.verified && <span className="ml-2 text-aura-terracotta">✓ Verifizierter Kauf</span>}
            </p>
          </div>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Nächste Bewertung"
            className="rounded-full border border-aura-ink/20 p-2 text-aura-ink hover:bg-aura-ink hover:text-aura-sand"
          >
            <Icon name="chevronRight" className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-6 flex justify-center gap-2">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Zu Bewertung ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-1.5 rounded-full transition-all ${
                i === index ? "w-6 bg-aura-terracotta" : "w-1.5 bg-aura-ink/20"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

function TrustBadges() {
  return (
    <section className="border-y border-aura-ink/10 bg-aura-sand py-10">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 px-4 sm:grid-cols-4 sm:px-6 lg:px-8">
        {TRUST_BADGES.map((b) => (
          <div key={b.label} className="flex flex-col items-center gap-2 text-center">
            <div className="rounded-full bg-aura-sandDark p-3 text-aura-terracotta">
              <Icon name={b.icon} className="h-5 w-5" />
            </div>
            <p className="text-xs text-aura-ink/80">{b.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Header({ cartCount, onOpenCart }) {
  return (
    <header className="sticky top-0 z-30 border-b border-aura-ink/10 bg-aura-sand/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <span className="font-serif text-lg tracking-wide text-aura-ink">AURA MODE</span>
        <nav className="hidden gap-8 text-xs font-medium uppercase tracking-widest text-aura-ink/80 sm:flex">
          <a href="#kollektion" className="hover:text-aura-terracotta">
            Kollektion
          </a>
          <a href="#reviews" className="hover:text-aura-terracotta">
            Reviews
          </a>
          <a href="#story" className="hover:text-aura-terracotta">
            Unsere Story
          </a>
        </nav>
        <button
          type="button"
          onClick={onOpenCart}
          aria-label="Warenkorb öffnen"
          className="relative rounded-full p-2 text-aura-ink hover:bg-aura-ink/5"
        >
          <Icon name="cart" className="h-5 w-5" />
          {cartCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-aura-terracotta text-[10px] font-medium text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}

function Hero({ onShopNow }) {
  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-1 items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:py-24 lg:px-8">
        <div>
          <span className="inline-block rounded-full border border-aura-terracotta/40 px-4 py-1.5 text-[11px] font-medium uppercase tracking-widest text-aura-terracotta">
            #04 Batch — Limitierte Edition
          </span>
          <h1 className="mt-6 font-serif text-4xl leading-tight text-aura-ink sm:text-5xl lg:text-6xl">
            Ruhe, die man
            <br />
            trägt.
          </h1>
          <p className="mt-5 max-w-md text-base leading-relaxed text-aura-ink/70">
            Handgefertigter Schmuck an der Schnittstelle von japanischem Minimalismus und
            skandinavischer Wärme. Jedes Stück in Kleinserie gefertigt — wenn Batch #04
            ausverkauft ist, ist es ausverkauft.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <button
              type="button"
              onClick={onShopNow}
              className="rounded-full bg-aura-ink px-8 py-3.5 text-xs font-medium uppercase tracking-wider text-aura-sand transition hover:bg-aura-terracotta"
            >
              Jetzt entdecken
            </button>
            <span className="text-xs text-aura-stone">Nur noch wenige Stücke pro Design verfügbar</span>
          </div>
        </div>
        <div className="relative">
          <ProductMedia icon="ring" tone={2} className="aspect-[4/5] w-full" />
          <div className="absolute -bottom-6 -left-6 hidden rounded-2xl bg-white p-4 shadow-soft sm:block">
            <p className="text-xs text-aura-stone">Bewertet mit</p>
            <div className="mt-1 flex items-center gap-2">
              <RatingStars rating={4.9} />
              <span className="text-sm font-medium text-aura-ink">4.9/5</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function AuraModeShop() {
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [quickView, setQuickView] = useState(null); // { productId, material }

  const addToCart = (productId, material, qty = 1) => {
    setCart((prev) => {
      const existing = prev.find((l) => l.productId === productId && l.material === material);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId && l.material === material ? { ...l, qty: l.qty + qty } : l
        );
      }
      return [...prev, { productId, material, qty }];
    });
    setCartOpen(true);
  };

  const changeQty = (productId, material, qty) => {
    setCart((prev) =>
      qty <= 0
        ? prev.filter((l) => !(l.productId === productId && l.material === material))
        : prev.map((l) => (l.productId === productId && l.material === material ? { ...l, qty } : l))
    );
  };

  const removeFromCart = (productId, material) => {
    setCart((prev) => prev.filter((l) => !(l.productId === productId && l.material === material)));
  };

  const cartCount = useMemo(() => cart.reduce((n, l) => n + l.qty, 0), [cart]);

  const quickViewProduct = quickView ? PRODUCTS.find((p) => p.id === quickView.productId) : null;

  const completeTheLookAnchor = PRODUCTS[0];
  const completeTheLookSuggestions = PRODUCTS.slice(1, 3);

  return (
    <div className="min-h-screen bg-aura-sand font-sans text-aura-ink">
      <Header cartCount={cartCount} onOpenCart={() => setCartOpen(true)} />
      <Hero onShopNow={() => document.getElementById("kollektion")?.scrollIntoView({ behavior: "smooth" })} />

      <section id="kollektion" className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-10 text-center">
          <p className="text-[11px] uppercase tracking-widest text-aura-terracotta">Die Kollektion</p>
          <h2 className="mt-2 font-serif text-3xl text-aura-ink sm:text-4xl">Batch #04</h2>
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-10 sm:grid-cols-3 lg:grid-cols-5">
          {PRODUCTS.map((product, i) => (
            <ProductCard
              key={product.id}
              product={product}
              tone={i}
              onQuickView={(productId, material) => setQuickView({ productId, material })}
              onAddToCart={addToCart}
            />
          ))}
        </div>
      </section>

      <CompleteTheLook
        anchorProduct={completeTheLookAnchor}
        suggestions={completeTheLookSuggestions}
        onAddToCart={addToCart}
      />

      <div id="reviews">
        <TestimonialSlider />
      </div>
      <TrustBadges />

      <footer id="story" className="mx-auto max-w-6xl px-4 py-16 text-center sm:px-6 lg:px-8">
        <h2 className="font-serif text-2xl text-aura-ink sm:text-3xl">Unsere Story</h2>
        <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-aura-ink/70">
          Aura Mode entsteht in kleinen, limitierten Batches — bewusst gegen Massenproduktion und für
          Stücke, die bleiben. Jedes Batch trägt eine eigene Nummer, jedes Design eine eigene Geschichte.
        </p>
        <p className="mt-8 text-xs text-aura-stone">© 2026 Aura Mode. Alle Rechte vorbehalten.</p>
      </footer>

      {quickViewProduct && (
        <QuickViewModal
          key={quickViewProduct.id}
          product={quickViewProduct}
          initialMaterial={quickView.material}
          onClose={() => setQuickView(null)}
          onAddToCart={addToCart}
        />
      )}

      <CartDrawer
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onChangeQty={changeQty}
        onRemove={removeFromCart}
        onAddToCart={addToCart}
      />
    </div>
  );
}

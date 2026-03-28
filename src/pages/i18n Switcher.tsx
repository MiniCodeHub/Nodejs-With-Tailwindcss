import { useState, createContext, useContext } from "react";
import type { ReactNode } from "react";

// ── Types ──────────────────────────────────────────────────────────────────
type Locale = "en" | "es" | "fr" | "de" | "ja" | "ar";

interface Language { code: Locale; label: string; flag: string; dir: "ltr" | "rtl"; }

interface Translations {
  hero_title:    string;
  hero_sub:      string;
  nav_home:      string;
  nav_about:     string;
  nav_pricing:   string;
  nav_contact:   string;
  cta_primary:   string;
  cta_secondary: string;
  feat_title:    string;
  feat_1_title:  string;
  feat_1_desc:   string;
  feat_2_title:  string;
  feat_2_desc:   string;
  feat_3_title:  string;
  feat_3_desc:   string;
  stats_users:   string;
  stats_uptime:  string;
  stats_rating:  string;
  footer_copy:   string;
  lang_label:    string;
}

type TranslationMap = Record<Locale, Translations>;

// ── Language config ────────────────────────────────────────────────────────
const LANGUAGES: Language[] = [
  { code: "en", label: "English",  flag: "🇬🇧", dir: "ltr" },
  { code: "es", label: "Español",  flag: "🇪🇸", dir: "ltr" },
  { code: "fr", label: "Français", flag: "🇫🇷", dir: "ltr" },
  { code: "de", label: "Deutsch",  flag: "🇩🇪", dir: "ltr" },
  { code: "ja", label: "日本語",   flag: "🇯🇵", dir: "ltr" },
  { code: "ar", label: "العربية",  flag: "🇸🇦", dir: "rtl" },
];

// ── Translations ───────────────────────────────────────────────────────────
const T: TranslationMap = {
  en: {
    hero_title:    "Build faster, ship smarter",
    hero_sub:      "The all-in-one platform that lets your team move fast without breaking things.",
    nav_home:      "Home", nav_about: "About", nav_pricing: "Pricing", nav_contact: "Contact",
    cta_primary:   "Get Started Free", cta_secondary: "See how it works",
    feat_title:    "Everything your team needs",
    feat_1_title:  "Lightning Fast",    feat_1_desc: "Sub-50ms response times across all regions.",
    feat_2_title:  "Secure by Default", feat_2_desc: "AES-256 encryption and SOC 2 Type II certified.",
    feat_3_title:  "Always On",         feat_3_desc: "99.99% uptime SLA backed by a dedicated team.",
    stats_users: "10k+ Teams", stats_uptime: "99.99% Uptime", stats_rating: "4.9★ Rating",
    footer_copy: "© 2025 Nexus Inc. All rights reserved.",
    lang_label: "Language",
  },
  es: {
    hero_title:    "Construye más rápido, lanza con inteligencia",
    hero_sub:      "La plataforma todo en uno que permite a tu equipo moverse rápido sin romper nada.",
    nav_home:      "Inicio", nav_about: "Acerca", nav_pricing: "Precios", nav_contact: "Contacto",
    cta_primary:   "Empieza Gratis", cta_secondary: "Ver cómo funciona",
    feat_title:    "Todo lo que tu equipo necesita",
    feat_1_title:  "Ultrarrápido",       feat_1_desc: "Tiempos de respuesta menores a 50ms en todas las regiones.",
    feat_2_title:  "Seguro por defecto", feat_2_desc: "Cifrado AES-256 y certificación SOC 2 Tipo II.",
    feat_3_title:  "Siempre disponible", feat_3_desc: "SLA de 99.99% de disponibilidad con equipo dedicado.",
    stats_users: "+10k Equipos", stats_uptime: "99.99% Disponibilidad", stats_rating: "4.9★ Calificación",
    footer_copy: "© 2025 Nexus Inc. Todos los derechos reservados.",
    lang_label: "Idioma",
  },
  fr: {
    hero_title:    "Construisez plus vite, livrez plus intelligemment",
    hero_sub:      "La plateforme tout-en-un qui permet à votre équipe d'avancer vite sans casser quoi que ce soit.",
    nav_home:      "Accueil", nav_about: "À propos", nav_pricing: "Tarifs", nav_contact: "Contact",
    cta_primary:   "Commencer gratuitement", cta_secondary: "Voir comment ça marche",
    feat_title:    "Tout ce dont votre équipe a besoin",
    feat_1_title:  "Ultra-rapide",         feat_1_desc: "Temps de réponse inférieurs à 50ms dans toutes les régions.",
    feat_2_title:  "Sécurisé par défaut",  feat_2_desc: "Chiffrement AES-256 et certification SOC 2 Type II.",
    feat_3_title:  "Toujours disponible",  feat_3_desc: "SLA de disponibilité à 99.99% soutenu par une équipe dédiée.",
    stats_users: "+10k Équipes", stats_uptime: "99.99% Disponibilité", stats_rating: "4.9★ Note",
    footer_copy: "© 2025 Nexus Inc. Tous droits réservés.",
    lang_label: "Langue",
  },
  de: {
    hero_title:    "Schneller bauen, klüger liefern",
    hero_sub:      "Die All-in-One-Plattform, die Ihrem Team ermöglicht, schnell voranzukommen ohne etwas zu beschädigen.",
    nav_home:      "Startseite", nav_about: "Über uns", nav_pricing: "Preise", nav_contact: "Kontakt",
    cta_primary:   "Kostenlos starten", cta_secondary: "So funktioniert es",
    feat_title:    "Alles, was Ihr Team braucht",
    feat_1_title:  "Blitzschnell",           feat_1_desc: "Antwortzeiten unter 50ms in allen Regionen.",
    feat_2_title:  "Standardmäßig sicher",   feat_2_desc: "AES-256-Verschlüsselung und SOC 2 Typ II-zertifiziert.",
    feat_3_title:  "Immer verfügbar",         feat_3_desc: "99.99% Verfügbarkeits-SLA mit einem dedizierten Team.",
    stats_users: "10k+ Teams", stats_uptime: "99.99% Verfügbarkeit", stats_rating: "4.9★ Bewertung",
    footer_copy: "© 2025 Nexus Inc. Alle Rechte vorbehalten.",
    lang_label: "Sprache",
  },
  ja: {
    hero_title:    "より速く構築し、よりスマートに出荷",
    hero_sub:      "チームが物事を壊さずに素早く動けるオールインワンプラットフォーム。",
    nav_home:      "ホーム", nav_about: "会社概要", nav_pricing: "料金", nav_contact: "お問い合わせ",
    cta_primary:   "無料で始める", cta_secondary: "仕組みを見る",
    feat_title:    "チームに必要なすべて",
    feat_1_title:  "超高速",             feat_1_desc: "全リージョンで50ms未満の応答時間。",
    feat_2_title:  "デフォルトで安全",   feat_2_desc: "AES-256暗号化とSOC 2タイプII認定。",
    feat_3_title:  "常時稼働",           feat_3_desc: "専任チームによる99.99%稼働SLA。",
    stats_users: "10k+ チーム", stats_uptime: "99.99% 稼働率", stats_rating: "4.9★ 評価",
    footer_copy: "© 2025 Nexus Inc. 全著作権所有。",
    lang_label: "言語",
  },
  ar: {
    hero_title:    "ابنِ بشكل أسرع، واشحن بذكاء أكبر",
    hero_sub:      "المنصة الشاملة التي تتيح لفريقك التحرك بسرعة دون كسر أي شيء.",
    nav_home:      "الرئيسية", nav_about: "حول", nav_pricing: "الأسعار", nav_contact: "اتصل بنا",
    cta_primary:   "ابدأ مجانًا", cta_secondary: "شاهد كيف يعمل",
    feat_title:    "كل ما يحتاجه فريقك",
    feat_1_title:  "سريع البرق",     feat_1_desc: "أوقات استجابة أقل من 50ms عبر جميع المناطق.",
    feat_2_title:  "آمن افتراضيًا",  feat_2_desc: "تشفير AES-256 ومعتمد بمعيار SOC 2 النوع الثاني.",
    feat_3_title:  "دائم التشغيل",   feat_3_desc: "اتفاقية مستوى خدمة بنسبة 99.99% مدعومة بفريق مخصص.",
    stats_users: "+10k فريق", stats_uptime: "99.99% وقت تشغيل", stats_rating: "4.9★ تقييم",
    footer_copy: "© 2025 Nexus Inc. جميع الحقوق محفوظة.",
    lang_label: "اللغة",
  },
};

// ── i18n Context ───────────────────────────────────────────────────────────
interface I18nCtx { locale: Locale; t: Translations; lang: Language; setLocale: (l: Locale) => void; }
const I18nContext = createContext<I18nCtx | null>(null);

function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const lang = LANGUAGES.find(l => l.code === locale)!;
  return (
    <I18nContext.Provider value={{ locale, t: T[locale], lang, setLocale }}>
      <div dir={lang.dir} style={{ fontFamily: locale === "ja" || locale === "ar" ? "system-ui, sans-serif" : undefined }}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

// ── Language Switcher ──────────────────────────────────────────────────────
function LangSwitcher() {
  const { locale, t, setLocale } = useI18n();
  const [open, setOpen] = useState(false);
  const current = LANGUAGES.find(l => l.code === locale)!;

  return (
    <div className="relative">
      <button onClick={() => setOpen(o => !o)}
        className="flex items-center gap-2 px-3 py-1.5 bg-white/10 hover:bg-white/20
          border border-white/15 rounded-xl text-sm font-medium transition">
        <span>{current.flag}</span>
        <span>{current.label}</span>
        <span className="text-xs opacity-60">{open ? "▲" : "▼"}</span>
      </button>
      {open && (
        <div className="absolute top-full mt-2 right-0 bg-gray-900 border border-gray-700
          rounded-2xl shadow-2xl overflow-hidden z-50 min-w-[160px]">
          <div className="px-3 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-800">
            {t.lang_label}
          </div>
          {LANGUAGES.map(lang => (
            <button key={lang.code} onClick={() => { setLocale(lang.code); setOpen(false); }}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-sm transition text-left
                ${locale === lang.code
                  ? "bg-indigo-600/20 text-indigo-300"
                  : "text-gray-300 hover:bg-gray-800"}`}>
              <span>{lang.flag}</span>
              <span>{lang.label}</span>
              {lang.dir === "rtl" && <span className="ms-auto text-xs text-gray-600">RTL</span>}
              {locale === lang.code && <span className="ms-auto text-xs text-indigo-400">✓</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── Page Sections ──────────────────────────────────────────────────────────
function Nav() {
  const { t } = useI18n();
  return (
    <nav className="bg-gray-950/80 backdrop-blur border-b border-gray-800 sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-indigo-500 flex items-center justify-center font-bold text-sm">N</div>
          <span className="font-semibold text-sm text-white">Nexus</span>
        </div>
        <div className="hidden sm:flex items-center gap-5 text-sm text-gray-400">
          {[t.nav_home, t.nav_about, t.nav_pricing, t.nav_contact].map(item => (
            <a key={item} href="#" className="hover:text-white transition">{item}</a>
          ))}
        </div>
        <LangSwitcher />
      </div>
    </nav>
  );
}

function Hero() {
  const { t } = useI18n();
  return (
    <section className="text-center py-20 px-6">
      <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight mb-5 max-w-3xl mx-auto">
        {t.hero_title}
      </h1>
      <p className="text-gray-400 text-base sm:text-lg max-w-xl mx-auto mb-10 leading-relaxed">{t.hero_sub}</p>
      <div className="flex flex-wrap gap-3 justify-center">
        <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl
          font-semibold text-sm transition active:scale-95">
          {t.cta_primary}
        </button>
        <button className="px-6 py-3 bg-white/8 hover:bg-white/15 border border-white/10 text-white
          rounded-xl font-semibold text-sm transition">
          {t.cta_secondary}
        </button>
      </div>
    </section>
  );
}

function Stats() {
  const { t } = useI18n();
  return (
    <div className="flex flex-wrap justify-center gap-8 py-8 border-y border-gray-800 px-6">
      {[t.stats_users, t.stats_uptime, t.stats_rating].map(s => (
        <div key={s} className="text-center">
          <p className="text-xl font-bold text-white">{s}</p>
        </div>
      ))}
    </div>
  );
}

function Features() {
  const { t } = useI18n();
  const feats = [
    { icon:"⚡", title: t.feat_1_title, desc: t.feat_1_desc },
    { icon:"🔒", title: t.feat_2_title, desc: t.feat_2_desc },
    { icon:"🟢", title: t.feat_3_title, desc: t.feat_3_desc },
  ];
  return (
    <section className="py-16 px-6 max-w-5xl mx-auto">
      <h2 className="text-2xl font-bold text-white text-center mb-10">{t.feat_title}</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {feats.map(f => (
          <div key={f.title} className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
            <div className="text-3xl mb-4">{f.icon}</div>
            <h3 className="font-semibold text-white text-sm mb-2">{f.title}</h3>
            <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Footer() {
  const { t, lang } = useI18n();
  return (
    <footer className="border-t border-gray-800 py-6 text-center">
      <p className="text-xs text-gray-600">{t.footer_copy}</p>
      <p className="text-xs text-gray-700 mt-1">
        Currently: {lang.flag} {lang.label} ({lang.dir.toUpperCase()})
      </p>
    </footer>
  );
}

// ── Root ───────────────────────────────────────────────────────────────────
export default function App() {
  return (
    <I18nProvider>
      <div className="min-h-screen bg-gray-950 text-white font-sans">
        <Nav />
        <Hero />
        <Stats />
        <Features />
        <Footer />
      </div>
    </I18nProvider>
  );
}
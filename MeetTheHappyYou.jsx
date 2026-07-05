import React, { useState, useRef, useEffect } from "react";
import {
  Heart, Sparkles, Sun, Video, PenLine, Flower2, Calendar, ChevronRight,
  ChevronLeft, Plus, X, Camera, Star, Smile, CloudRain, Meh, Bell, ArrowLeft,
  Check, Lock, Share2, Play, Trash2, Quote, Home as HomeIcon, Wand2, ListChecks,
  Circle, CheckCircle2, Mail, User, LogOut, Mic, Shuffle, Send, Download,
  BookHeart, Pause
} from "lucide-react";

/* ---------------------------------------------------------------------------
   Bloom — "Meet the happy you"
   A warm, guilt-free daily wellbeing app. The feeling of opening it is the product.
   Direction: warm cream + paper grain, a soft serif (Fraunces) used with restraint,
   a clay/terracotta identity with sage & blush alternates chosen during onboarding.
--------------------------------------------------------------------------- */

const BASE = {
  cream: "#F4ECDD", card: "#FCF7EC", ink: "#3B322A", inkSoft: "#8C8070",
  line: "#E7DAC6", sun: "#E7B25C", sage: "#8FA783", blush: "#CBA091",
};
const THEMES = {
  terracotta: { accent: "#B26647", accentDeep: "#8F4E33", accentSoft: "#ECD8C9" },
  sage:       { accent: "#7E9A6F", accentDeep: "#5E7A50", accentSoft: "#DDE7D2" },
  blush:      { accent: "#C07D6E", accentDeep: "#A15B4C", accentSoft: "#F1DCD4" },
};

// components reference colors as CSS variables so the theme can switch live
const P = {
  cream: "var(--cream)", card: "var(--card)", ink: "var(--ink)", inkSoft: "var(--inkSoft)",
  line: "var(--line)", sun: "var(--sun)", sage: "var(--sage)", blush: "var(--blush)",
  accent: "var(--accent)", accentDeep: "var(--accentDeep)", accentSoft: "var(--accentSoft)",
};
const soft = "0 10px 30px rgba(90,70,45,0.12)";
const softer = "0 4px 16px rgba(90,70,45,0.08)";
const font = {
  serif: "'Fraunces', Georgia, 'Times New Roman', serif",
  ui: "'Nunito', ui-rounded, system-ui, sans-serif",
};

/* ---------- date helpers ---------- */
const daysAgo = (n) => { const d = new Date(); d.setDate(d.getDate() - n); return d; };
const iso = (d) => d.toISOString().slice(0, 10);
const fmtDay = (d) => d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const daysBetween = (isoDate) => Math.max(1, Math.round((Date.now() - new Date(isoDate).getTime()) / 86400000));
const dayIndex = () => Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);

/* ---------- prompt library (never show a blank box) ---------- */
const PROMPTS = {
  gratitude: [
    "What are you looking forward to today?",
    "What small thing made you smile recently?",
    "Who or what supported you this week?",
    "What did your body do for you today?",
    "What comfort are you grateful for right now?",
    "What went better than you expected?",
    "What in this room are you glad to have?",
  ],
  appreciation: [
    "Who deserves your appreciation today?",
    "Whose small kindness stayed with you?",
    "What quality in yourself are you quietly proud of?",
    "Who made your week lighter?",
    "Who believed in you when you didn't?",
    "What part of you carried you through today?",
  ],
};

const AFFIRMATIONS = {
  "Self-worth": ["I am enough exactly as I am today.", "My worth is not measured by what I produce.", "I belong here, and my presence matters."],
  "Anxiety": ["This feeling is a wave. I can let it rise and pass.", "I am safe in this moment, breathing, right now.", "I don't have to solve everything today."],
  "Self-forgiveness": ["I did the best I could with what I knew then.", "I release the weight I've carried for myself.", "Being human means being imperfect — and that's okay."],
  "Confidence": ["I trust myself to handle what comes.", "I have made it through hard days before.", "My voice deserves to be heard."],
  "Calm": ["I let my shoulders soften and my jaw unclench.", "There is nowhere I need to rush to right now.", "I invite ease into this moment."],
};

const MOODS = [
  { key: "joyful", label: "Joyful", Icon: Sun }, { key: "content", label: "Content", Icon: Smile },
  { key: "okay", label: "Okay", Icon: Meh }, { key: "low", label: "Low", Icon: CloudRain },
];

/* ---------- seed data ---------- */
const seedEntries = (kind) => {
  const g = ["the smell of rain this morning and my warm cup of chai","my sister called just to check on me — it made my whole day","a slow, unhurried breakfast with nowhere to be","finishing something I'd put off for weeks"];
  const a = ["my mum, for her endless patience with me","my own body, for carrying me through a long day","the friend who always texts back, even at midnight","myself, for choosing rest instead of pushing through"];
  const src = kind === "gratitude" ? g : a;
  return [
    { id: kind+"1", date: iso(daysAgo(1)), type: "text", content: src[0], joyful: true },
    { id: kind+"2", date: iso(daysAgo(2)), type: "text", content: src[1], joyful: true },
    { id: kind+"3", date: iso(daysAgo(6)), type: "text", content: src[2], joyful: false },
    { id: kind+"4", date: iso(daysAgo(20)), type: "text", content: src[3], joyful: true },
    { id: kind+"5", date: iso(daysAgo(48)), type: "text", content: src[0], joyful: false },
  ];
};
const seedVideos = [
  { id:"v1", date: iso(daysAgo(3)), label:"The day I got the news", mood:"joyful", shared:false },
  { id:"v2", date: iso(daysAgo(9)), label:"Sunset at the lake", mood:"content", shared:false },
  { id:"v3", date: iso(daysAgo(30)), label:"Dancing in the kitchen", mood:"joyful", shared:false },
];
const seedManifest = [
  { id:"m1", title:"My calm, light-filled home", affirmation:"I am waking up in my own peaceful home, full of light and plants.", why:"A space that feels like exhale.", achieved:false },
  { id:"m2", title:"Mornings that feel like mine", affirmation:"I am moving my body every morning and it feels joyful, not forced.", why:"I want to greet the day gently.", achieved:false },
  { id:"m3", title:"Work that lights me up", affirmation:"I am doing work that feels meaningful and pays me well.", why:"Proof it can happen.", achieved:true },
];
const seedTodos = [
  { id:"t1", text:"Drink a full glass of water before coffee", done:true },
  { id:"t2", text:"Step outside for 10 minutes of sun", done:false },
  { id:"t3", text:"Send the message I keep putting off", done:false },
];

/* ============================ atoms ============================ */
function SoftButton({ children, onClick, primary, ghost, style }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: font.ui, fontWeight: 800, fontSize: 15, border: ghost ? `1px solid ${P.line}` : "none",
      cursor: "pointer", padding: "12px 20px", borderRadius: 14,
      background: primary ? P.accent : ghost ? "transparent" : P.card,
      color: primary ? "#fff" : P.ink,
      boxShadow: primary ? "0 8px 18px rgba(120,70,40,0.28)" : ghost ? "none" : softer,
      transition: "transform .14s ease", ...style,
    }}
      onMouseDown={(e)=>e.currentTarget.style.transform="scale(0.97)"}
      onMouseUp={(e)=>e.currentTarget.style.transform="scale(1)"}
      onMouseLeave={(e)=>e.currentTarget.style.transform="scale(1)"}
    >{children}</button>
  );
}
function SectionLabel({ children, right }) {
  return (
    <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom: 10 }}>
      <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: P.inkSoft }}>{children}</div>
      {right}
    </div>
  );
}
function EmptyNote({ children }) { return <div style={{ color: P.inkSoft, fontSize: 14, padding: "8px 2px" }}>{children}</div>; }
function Bloom({ size = 28 }) { return <Flower2 size={size} color={P.accent} strokeWidth={2} />; }

/* ============================ THE APP ============================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("terracotta");
  const [onboarded, setOnboarded] = useState(false);
  const [view, setView] = useState("home");
  const [dir, setDir] = useState(0);
  const [myAff, setMyAff] = useState([]);
  const [pillar, setPillar] = useState("gratitude");
  const [gratitude, setGratitude] = useState(seedEntries("gratitude"));
  const [appreciation, setAppreciation] = useState(seedEntries("appreciation"));
  const [videos, setVideos] = useState(seedVideos);
  const [manifest, setManifest] = useState(seedManifest);
  const [todos, setTodos] = useState(seedTodos.map(t => ({ ...t, date: iso(new Date()) })));
  const [moodToday, setMoodToday] = useState(null);
  const [streak, setStreak] = useState(12);
  const [grace] = useState(2);
  const [reminder, setReminder] = useState("08:00");
  const [resurface, setResurface] = useState(null);
  const [moment, setMoment] = useState(null);
  const [recap, setRecap] = useState(false);
  const [shareCard, setShareCard] = useState(null);
  const [burst, setBurst] = useState(false);
  const [toast, setToast] = useState(null);

  const t = THEMES[theme];
  const flash = (m) => { setToast(m); setTimeout(() => setToast(null), 2200); };
  const signOut = () => { setUser(null); setOnboarded(false); setView("home"); };

  const TABS = ["home", "todo", "vision", "booth", "library"];
  const changeView = (v) => {
    const from = TABS.indexOf(view), to = TABS.indexOf(v);
    setDir(from >= 0 && to >= 0 ? (to > from ? 1 : to < from ? -1 : 0) : 0);
    setView(v);
  };
  const touch = useRef({ x: 0, y: 0, ok: false });
  const onTouchStart = (e) => {
    const tt = e.touches[0];
    const noswipe = e.target.closest && e.target.closest("[data-noswipe]");
    touch.current = { x: tt.clientX, y: tt.clientY, ok: !noswipe && TABS.includes(view) };
  };
  const onTouchEnd = (e) => {
    if (!touch.current.ok) return;
    const tt = e.changedTouches[0];
    const dx = tt.clientX - touch.current.x, dy = tt.clientY - touch.current.y;
    if (Math.abs(dx) > 64 && Math.abs(dy) < 48) {
      const i = TABS.indexOf(view);
      if (dx < 0 && i < TABS.length - 1) changeView(TABS[i + 1]);
      if (dx > 0 && i > 0) changeView(TABS[i - 1]);
    }
  };
  const addMyAff = (text) => setMyAff((p) => [{ id: Date.now() + "", text }, ...p]);
  const delMyAff = (id) => setMyAff((p) => p.filter((a) => a.id !== id));

  const swipeAnim = dir === 1 ? "slideL .32s ease both" : dir === -1 ? "slideR .32s ease both" : "floatIn .5s ease both";
  const doBloom = () => { setBurst(true); setTimeout(() => setBurst(false), 1500); };

  const pillarData = pillar === "gratitude" ? gratitude : appreciation;
  const setPillarData = pillar === "gratitude" ? setGratitude : setAppreciation;
  const hasToday = (arr) => arr.some(e => e.date === iso(new Date()));

  const addEntry = (entry, kind) => {
    const target = kind === "appreciation" ? appreciation : pillarData;
    const setter = kind === "appreciation" ? setAppreciation : setPillarData;
    setter(prev => [{ ...entry, id: entry.id || Date.now()+"", date: iso(new Date()) }, ...prev]);
    setStreak(s => s + (hasToday(target) ? 0 : 1));
    doBloom();
    flash("Saved. A little more of you, kept safe.");
  };
  const addTodo = (text) => setTodos(p => [...p, { id: Date.now()+"", text, done: false, date: iso(new Date()) }]);
  const toggleTodo = (id) => setTodos(p => p.map(x => x.id===id ? { ...x, done: !x.done } : x));
  const delTodo = (id) => setTodos(p => p.filter(x => x.id!==id));

  const liftMeUp = () => {
    const happy = [...videos.filter(v=>v.mood==="joyful"), ...gratitude.filter(e=>e.joyful), ...appreciation.filter(e=>e.joyful)];
    if (happy.length) setResurface(happy[Math.floor(Math.random()*happy.length)]);
  };
  const pickMood = (m) => { setMoodToday(m); if (m==="low"||m==="okay") setTimeout(liftMeUp, 450); };
  const openMoment = () => { const a = manifest.filter(m=>!m.achieved); if (a.length) setMoment(a[Math.floor(Math.random()*a.length)]); };

  const rootVars = {
    "--cream": BASE.cream, "--card": BASE.card, "--ink": BASE.ink, "--inkSoft": BASE.inkSoft,
    "--line": BASE.line, "--sun": BASE.sun, "--sage": BASE.sage, "--blush": BASE.blush,
    "--accent": t.accent, "--accentDeep": t.accentDeep, "--accentSoft": t.accentSoft,
  };
  const noise = `<svg xmlns='http://www.w3.org/2000/svg' width='140' height='140'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='saturate' values='0'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.5'/></svg>`;

  return (
    <div style={{ minHeight: "100vh", background: BASE.cream, fontFamily: font.ui, color: BASE.ink, position: "relative", ...rootVars }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,500;9..144,600;9..144,700&family=Nunito:wght@400;600;700;800&display=swap');
        * { box-sizing: border-box; -webkit-tap-highlight-color: transparent; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: var(--line); border-radius: 999px; }
        @keyframes floatIn { from { opacity: 0; transform: translateY(10px);} to { opacity: 1; transform: none;} }
        @keyframes glow { 0%,100%{ box-shadow: 0 0 0 rgba(231,178,92,0);} 50%{ box-shadow: 0 0 44px rgba(231,178,92,0.5);} }
        @keyframes petal { from { transform: scale(.5) rotate(-10deg); opacity: 0;} to { transform: none; opacity: 1;} }
        @keyframes bloomPop { 0%{ transform: scale(.2); opacity: 0;} 45%{ transform: scale(1.15); opacity: 1;} 100%{ transform: scale(1.6); opacity: 0;} }
        @keyframes bloomRing { 0%{ transform: scale(.3); opacity:.7;} 100%{ transform: scale(2.4); opacity: 0;} }
        @keyframes slideL { from { opacity: 0; transform: translateX(46px);} to { opacity: 1; transform: none;} }
        @keyframes slideR { from { opacity: 0; transform: translateX(-46px);} to { opacity: 1; transform: none;} }
        @keyframes noteRelease { 0%{ opacity: 1; transform: translateY(0) scale(1);} 55%{ opacity: .8;} 100%{ opacity: 0; transform: translateY(-72px) scale(.93);} }
        @keyframes settleIn { 0%{ opacity: 0; transform: translateY(-16px) scale(.97);} 60%{ opacity: 1;} 100%{ opacity: 1; transform: none;} }
        .floatIn { animation: floatIn .5s ease both; }
        button:focus-visible, [tabindex]:focus-visible, input:focus-visible, textarea:focus-visible { outline: 3px solid var(--accentDeep); outline-offset: 2px; }
        textarea, input { font-family: inherit; }
      `}</style>

      {/* paper grain overlay */}
      <div aria-hidden style={{
        position: "fixed", inset: 0, pointerEvents: "none", zIndex: 1, opacity: 0.05,
        mixBlendMode: "multiply",
        backgroundImage: `url("data:image/svg+xml;utf8,${noise}")`, backgroundSize: "140px 140px",
      }} />

      <div style={{ position: "relative", zIndex: 2 }}>
        {!user ? (
          <AuthView onAuth={(u) => { setUser(u); setOnboarded(!u.isNew); }} />
        ) : !onboarded ? (
          <OnboardingView user={user} setTheme={setTheme}
            onDone={(firstEntry) => {
              if (firstEntry) { setGratitude(p => [{ id: Date.now()+"", date: iso(new Date()), type:"text", content: firstEntry, joyful: true }, ...p]); doBloom(); }
              setOnboarded(true);
            }} />
        ) : (
          <>
            <div onTouchStart={onTouchStart} onTouchEnd={onTouchEnd} style={{ maxWidth: 468, margin: "0 auto", padding: "0 0 98px" }}>
              <div key={view} style={{ animation: swipeAnim }}>
                {view === "home" && <HomeView {...{ moodToday, pickMood, streak, grace, setView: changeView, setPillar, openMoment, liftMeUp, gratitude, appreciation, todos, toggleTodo, user, onSignOut: signOut, setRecap }} />}
                {view === "todo" && <TodoView {...{ todos, addTodo, toggleTodo, delTodo, onBack: () => changeView("home") }} />}
                {view === "pillar" && <PillarView kind={pillar} data={pillarData} onAdd={(e)=>addEntry(e, pillar)} onBack={() => changeView("home")} onShare={setShareCard} flash={flash} />}
                {view === "vision" && <VisionView {...{ manifest, setManifest, reminder, setReminder, openMoment, onBack: () => changeView("home"), flash, onShare:setShareCard }} />}
                {view === "booth" && <BoothView {...{ videos, setVideos, onBack: () => changeView("home"), flash, theme }} />}
                {view === "library" && <LibraryView onBack={() => changeView("home")} onShare={setShareCard} myAff={myAff} onAddAff={addMyAff} onDelAff={delMyAff} />}
              </div>
            </div>

            <nav style={{
              position: "fixed", bottom: 0, left: 0, right: 0, zIndex: 40,
              background: "rgba(252,247,236,0.94)", backdropFilter: "blur(10px)", borderTop: `1px solid ${P.line}`,
              display: "flex", justifyContent: "center", gap: 4, padding: "8px 6px calc(8px + env(safe-area-inset-bottom))",
            }}>
              {[
                { k:"home", label:"Home", Icon: HomeIcon },
                { k:"todo", label:"Today", Icon: ListChecks },
                { k:"vision", label:"Vision", Icon: Sparkles },
                { k:"booth", label:"Booth", Icon: Video },
                { k:"library", label:"Affirm", Icon: Quote },
              ].map(({ k, label, Icon }) => {
                const on = view === k || (k === "home" && view === "pillar");
                return (
                  <button key={k} onClick={() => changeView(k)} style={{
                    flex: 1, maxWidth: 84, background: "none", border: "none", cursor: "pointer",
                    display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 4px",
                    color: on ? P.accentDeep : P.inkSoft, fontFamily: font.ui, fontWeight: 800, fontSize: 11,
                  }}>
                    <Icon size={22} strokeWidth={on ? 2.4 : 2} /> {label}
                  </button>
                );
              })}
            </nav>

            {resurface && (
              <Modal onClose={() => setResurface(null)}>
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12, color: P.accentDeep, letterSpacing: 1.2, textTransform: "uppercase" }}>A little light for right now</div>
                  <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 24, margin: "8px 0 16px", color: P.ink }}>Here's you, {daysBetween(resurface.date)} days ago, feeling good.</h3>
                  {resurface.label ? (
                    <div style={{ height: 180, borderRadius: 20, background: `linear-gradient(135deg, ${P.accentSoft}, ${P.card})`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, animation: "glow 3s ease-in-out infinite" }}>
                      <Play size={40} color={P.accentDeep} fill={P.accentDeep} />
                      <span style={{ color: P.ink, fontFamily: font.serif, fontWeight: 600 }}>{resurface.label}</span>
                    </div>
                  ) : (
                    <p style={{ fontFamily: font.serif, fontSize: 20, lineHeight: 1.55, background: P.accentSoft, padding: 22, borderRadius: 20, fontStyle: "italic" }}>"{resurface.content}"</p>
                  )}
                  <p style={{ color: P.inkSoft, marginTop: 16, fontSize: 15 }}>That happy you is still in there. Be gentle with yourself today.</p>
                  <SoftButton primary onClick={() => setResurface(null)} style={{ marginTop: 18 }}>Thank you</SoftButton>
                </div>
              </Modal>
            )}

            {moment && (
              <Modal onClose={() => setMoment(null)} dim>
                <div style={{ textAlign: "center", animation: "petal .6s ease both" }}>
                  <div style={{ height: 190, borderRadius: 22, background: `linear-gradient(160deg, ${P.accentSoft}, ${P.card})`, display: "flex", alignItems: "center", justifyContent: "center", animation: "glow 3.5s ease-in-out infinite", marginBottom: 18 }}>
                    <Sparkles size={44} color={P.accentDeep} />
                  </div>
                  <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12, color: P.accentDeep, letterSpacing: 1.2, textTransform: "uppercase" }}>Your manifestation moment</div>
                  <p style={{ fontFamily: font.serif, fontSize: 23, lineHeight: 1.4, margin: "10px 0 6px" }}>{moment.affirmation}</p>
                  <p style={{ color: P.inkSoft, fontSize: 14 }}>Breathe. Read it aloud. Let it feel true.</p>
                  <SoftButton primary onClick={() => setMoment(null)} style={{ marginTop: 18 }}>I feel it</SoftButton>
                </div>
              </Modal>
            )}

            {recap && <RecapModal gratitude={gratitude} appreciation={appreciation} videos={videos} onClose={() => setRecap(false)} onShare={setShareCard} />}
            {shareCard && <ShareCardModal item={shareCard} theme={theme} onClose={() => setShareCard(null)} />}

            {burst && <BloomBurst />}

            {toast && (
              <div style={{ position: "fixed", bottom: 96, left: "50%", transform: "translateX(-50%)", background: P.ink, color: "#fff", padding: "12px 20px", borderRadius: 999, fontFamily: font.ui, fontWeight: 700, fontSize: 14, boxShadow: soft, zIndex: 70, animation: "floatIn .3s ease both", maxWidth: "88%", textAlign: "center" }}>{toast}</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

/* ============================ BLOOM BURST (delight) ============================ */
function BloomBurst() {
  return (
    <div aria-hidden style={{ position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", pointerEvents: "none", zIndex: 90 }}>
      <div style={{ position: "absolute", width: 120, height: 120, borderRadius: 999, border: `2px solid ${P.accent}`, animation: "bloomRing 1.4s ease-out forwards" }} />
      <div style={{ position: "absolute", width: 200, height: 200, borderRadius: 999, border: `2px solid ${P.sun}`, animation: "bloomRing 1.4s ease-out .15s forwards" }} />
      <div style={{ animation: "bloomPop 1.4s ease-out forwards" }}>
        <Flower2 size={92} color={P.accent} strokeWidth={1.6} />
      </div>
    </div>
  );
}

/* ============================ AUTH ============================ */
function AuthView({ onAuth }) {
  const [mode, setMode] = useState("signup");
  const [name, setName] = useState(""); const [email, setEmail] = useState(""); const [pass, setPass] = useState("");
  const [err, setErr] = useState("");
  const submit = () => {
    if (mode === "signup" && !name.trim()) return setErr("What should we call you?");
    if (!email.trim() || !email.includes("@")) return setErr("A valid email, please.");
    if (pass.length < 4) return setErr("A password of at least 4 characters.");
    onAuth({ name: name.trim() || email.split("@")[0], email: email.trim(), isNew: mode === "signup" });
  };
  return (
    <div style={{ maxWidth: 420, margin: "0 auto", padding: "44px 24px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", animation: "floatIn .5s ease both" }}>
      <div style={{ textAlign: "center", marginBottom: 26 }}>
        <div style={{ width: 78, height: 78, borderRadius: 26, margin: "0 auto 16px", background: `linear-gradient(140deg, ${P.accentSoft}, ${P.card})`, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: soft }}>
          <Flower2 size={42} color={P.accent} />
        </div>
        <h1 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 38, margin: 0, letterSpacing: -0.5 }}>Bloom</h1>
        <p style={{ fontFamily: font.serif, fontStyle: "italic", color: P.inkSoft, margin: "4px 0 0", fontSize: 17 }}>Meet the happy you</p>
      </div>
      <div style={{ background: P.card, borderRadius: 26, padding: 22, boxShadow: soft }}>
        <div style={{ display: "flex", background: P.cream, borderRadius: 14, padding: 4, marginBottom: 18 }}>
          {[["signup","Create account"],["login","Log in"]].map(([k,label]) => (
            <button key={k} onClick={() => { setMode(k); setErr(""); }} style={{ flex: 1, border: "none", cursor: "pointer", borderRadius: 11, padding: "10px", fontFamily: font.ui, fontWeight: 800, fontSize: 14, background: mode===k ? P.card : "transparent", color: mode===k ? P.ink : P.inkSoft, boxShadow: mode===k ? softer : "none" }}>{label}</button>
          ))}
        </div>
        {mode === "signup" && <AuthField Icon={User} placeholder="Your name" value={name} onChange={setName} />}
        <AuthField Icon={Mail} placeholder="Email" value={email} onChange={setEmail} type="email" />
        <AuthField Icon={Lock} placeholder="Password" value={pass} onChange={setPass} type="password" />
        {err && <div style={{ color: P.accentDeep, fontSize: 13, margin: "2px 2px 12px", fontWeight: 700 }}>{err}</div>}
        <SoftButton primary onClick={submit} style={{ width: "100%", marginTop: 4 }}>{mode === "signup" ? "Begin" : "Welcome back"}</SoftButton>
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: P.line }} />
          <span style={{ color: P.inkSoft, fontSize: 12, fontFamily: font.ui, fontWeight: 800 }}>or</span>
          <div style={{ flex: 1, height: 1, background: P.line }} />
        </div>
        {["Google","Apple"].map((prov) => (
          <button key={prov} onClick={() => onAuth({ name: prov + " friend", email: `you@${prov.toLowerCase()}.com`, isNew: true })} style={{ width: "100%", border: `1px solid ${P.line}`, background: P.card, cursor: "pointer", borderRadius: 14, padding: "12px", marginBottom: 10, fontFamily: font.ui, fontWeight: 800, fontSize: 14, color: P.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 10 }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: prov==="Google" ? "#fff" : P.ink, border: prov==="Google" ? `1px solid ${P.line}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: prov==="Google" ? P.accentDeep : "#fff" }}>{prov[0]}</span>
            Continue with {prov}
          </button>
        ))}
        <button onClick={() => onAuth({ name: "friend", email: "", isNew: false })} style={{ width: "100%", background: "none", border: "none", cursor: "pointer", marginTop: 6, color: P.accentDeep, fontFamily: font.ui, fontWeight: 800, fontSize: 14 }}>Explore as a guest</button>
      </div>
      <p style={{ textAlign: "center", color: P.inkSoft, fontSize: 11.5, marginTop: 18, lineHeight: 1.5 }}>Preview sign-in. Your real, secure account and saved entries arrive with the full app.</p>
    </div>
  );
}
function AuthField({ Icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: P.cream, border: `1px solid ${P.line}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
      <Icon size={18} color={P.inkSoft} />
      <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} type={type} style={{ flex: 1, border: "none", outline: "none", background: "transparent", fontSize: 15, color: P.ink }} />
    </div>
  );
}

/* ============================ ONBOARDING (60 seconds) ============================ */
function OnboardingView({ user, setTheme, onDone }) {
  const [step, setStep] = useState(0);
  const [goal, setGoal] = useState(null);
  const [vibe, setVibe] = useState("terracotta");
  const [entry, setEntry] = useState("");
  const prompt = PROMPTS.gratitude[dayIndex() % PROMPTS.gratitude.length];
  const first = user.name.split(" ")[0];

  const vibes = [
    { k: "terracotta", label: "Warm & earthy", sw: THEMES.terracotta.accent },
    { k: "sage", label: "Calm & green", sw: THEMES.sage.accent },
    { k: "blush", label: "Soft & tender", sw: THEMES.blush.accent },
  ];
  const goals = ["Feel more grateful","Manifest a dream","Be kinder to myself","Build a gentle daily habit"];

  return (
    <div style={{ maxWidth: 440, margin: "0 auto", padding: "40px 24px", minHeight: "100vh", display: "flex", flexDirection: "column", animation: "floatIn .5s ease both" }}>
      <div style={{ display: "flex", gap: 6, marginBottom: 28 }}>
        {[0,1,2].map(i => <div key={i} style={{ flex: 1, height: 5, borderRadius: 999, background: i <= step ? P.accent : P.line, transition: "background .3s" }} />)}
      </div>

      {step === 0 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <Flower2 size={40} color={P.accent} />
          <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 30, lineHeight: 1.15, margin: "16px 0 8px" }}>Welcome, {first}. Let's set the mood — sixty seconds.</h2>
          <p style={{ color: P.inkSoft, fontSize: 16, lineHeight: 1.6 }}>What brings you here? Pick the one that feels closest.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 18 }}>
            {goals.map(g => (
              <button key={g} onClick={() => setGoal(g)} style={{ textAlign: "left", border: goal===g ? `2px solid ${P.accent}` : `2px solid ${P.line}`, background: goal===g ? P.card : "transparent", cursor: "pointer", borderRadius: 16, padding: "16px 18px", fontFamily: font.serif, fontSize: 18, color: P.ink }}>{g}</button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <SoftButton primary onClick={() => setStep(1)} style={{ width: "100%" }}>Continue</SoftButton>
        </div>
      )}

      {step === 1 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 30, lineHeight: 1.15, margin: "0 0 8px" }}>Pick your vibe.</h2>
          <p style={{ color: P.inkSoft, fontSize: 16, lineHeight: 1.6 }}>This sets the colour of your whole space. You can change it later.</p>
          <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 18 }}>
            {vibes.map(v => (
              <button key={v.k} onClick={() => { setVibe(v.k); setTheme(v.k); }} style={{ display: "flex", alignItems: "center", gap: 14, border: vibe===v.k ? `2px solid ${v.sw}` : `2px solid ${P.line}`, background: vibe===v.k ? P.card : "transparent", cursor: "pointer", borderRadius: 16, padding: "14px 16px" }}>
                <span style={{ width: 34, height: 34, borderRadius: 999, background: v.sw }} />
                <span style={{ fontFamily: font.serif, fontSize: 18, color: P.ink }}>{v.label}</span>
                {vibe===v.k && <Check size={20} color={v.sw} style={{ marginLeft: "auto" }} />}
              </button>
            ))}
          </div>
          <div style={{ flex: 1 }} />
          <SoftButton primary onClick={() => setStep(2)} style={{ width: "100%" }}>Continue</SoftButton>
        </div>
      )}

      {step === 2 && (
        <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
          <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 30, lineHeight: 1.15, margin: "0 0 8px" }}>Now, your first bloom.</h2>
          <p style={{ color: P.inkSoft, fontSize: 16, lineHeight: 1.6 }}>Just one line — this is where it begins.</p>
          <NotebookPad prompt={prompt} value={entry} onChange={setEntry} />
          <div style={{ flex: 1 }} />
          <SoftButton primary onClick={() => onDone(entry.trim())} style={{ width: "100%" }} >
            {entry.trim() ? "Save my first entry" : "Skip for now"}
          </SoftButton>
        </div>
      )}
    </div>
  );
}

/* ============================ NOTEBOOK WRITING SURFACE ============================ */
function NotebookPad({ prompt, value, onChange, onShuffle }) {
  return (
    <div style={{ marginTop: 16, background: P.card, borderRadius: 18, padding: 18, boxShadow: softer, border: `1px solid ${P.line}` }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 12 }}>
        <BookHeart size={18} color={P.accent} style={{ marginTop: 3, flexShrink: 0 }} />
        <div style={{ flex: 1, fontFamily: font.serif, fontStyle: "italic", fontSize: 17, color: P.ink, lineHeight: 1.4 }}>{prompt}</div>
        {onShuffle && <button onClick={onShuffle} aria-label="Another prompt" style={{ background: "none", border: "none", cursor: "pointer", color: P.inkSoft, padding: 2 }}><Shuffle size={16} /></button>}
      </div>
      <div style={{ position: "relative" }}>
        <textarea value={value} onChange={(e)=>onChange(e.target.value)} rows={4} placeholder="Write in your own words…"
          style={{
            width: "100%", border: "none", outline: "none", resize: "none", background: "transparent",
            fontFamily: font.serif, fontSize: 19, lineHeight: "34px", color: P.ink,
            backgroundImage: `repeating-linear-gradient(transparent, transparent 33px, ${P.line} 33px, ${P.line} 34px)`,
          }} />
      </div>
    </div>
  );
}

/* ============================ HOME ============================ */
function HomeView({ moodToday, pickMood, streak, grace, setView, setPillar, openMoment, liftMeUp, gratitude, appreciation, todos, toggleTodo, user, onSignOut, setRecap }) {
  const [menu, setMenu] = useState(false);
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const first = (user?.name || "friend").split(" ")[0];
  const doneCount = todos.filter(t => t.done).length;
  const openPillar = (k) => { setPillar(k); setView("pillar"); };
  const monthName = MONTHS[new Date().getMonth()];

  const pillars = [
    { k:"gratitude", title:"Gratitude", sub:"What I received today", Icon: Heart },
    { k:"appreciation", title:"Appreciation", sub:"Who or what I value", Icon: Sun },
    { k:"vision", title:"Manifestation", sub:"What I'm reaching toward", Icon: Sparkles },
  ];

  return (
    <div style={{ padding: "26px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Bloom size={30} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, lineHeight: 1 }}>Bloom</div>
          <div style={{ fontFamily: font.serif, fontStyle: "italic", fontSize: 12.5, color: P.inkSoft }}>Meet the happy you</div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenu(m => !m)} aria-label="Your profile" style={{ width: 42, height: 42, borderRadius: 999, border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${P.accent}, ${P.sun})`, color: "#fff", fontFamily: font.serif, fontWeight: 600, fontSize: 18, boxShadow: softer }}>{first[0]?.toUpperCase()}</button>
          {menu && (
            <div style={{ position: "absolute", right: 0, top: 50, background: P.card, borderRadius: 16, padding: 14, boxShadow: soft, width: 220, zIndex: 30, border: `1px solid ${P.line}` }}>
              <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 16 }}>{user?.name || "Guest"}</div>
              <div style={{ color: P.inkSoft, fontSize: 12, marginBottom: 12, wordBreak: "break-all" }}>{user?.email || "Exploring as a guest"}</div>
              <button onClick={onSignOut} style={{ width: "100%", border: `1px solid ${P.line}`, background: P.cream, cursor: "pointer", borderRadius: 12, padding: "9px", fontFamily: font.ui, fontWeight: 800, fontSize: 13, color: P.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><LogOut size={16} /> Sign out</button>
            </div>
          )}
        </div>
      </div>

      <h1 style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 30, margin: "22px 0 4px", letterSpacing: -0.3 }}>{greet}, {first}.</h1>
      <p style={{ color: P.inkSoft, margin: 0, fontSize: 15 }}>It's good to see you back. No pressure today — just two quiet minutes.</p>

      <div style={{ marginTop: 18, background: P.card, borderRadius: 20, padding: "16px 18px", boxShadow: softer, display: "flex", alignItems: "center", gap: 14 }}>
        <Flower2 size={38} color={P.accent} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 18 }}>Welcome back — {streak} days in</div>
          <div style={{ color: P.inkSoft, fontSize: 13 }}>{grace} grace days in your pocket. Miss a day and nothing breaks.</div>
        </div>
      </div>

      <div style={{ marginTop: 20 }}>
        <SectionLabel>How are you, honestly?</SectionLabel>
        <div style={{ display: "flex", gap: 10 }}>
          {MOODS.map(({ key, label, Icon }) => {
            const on = moodToday === key;
            return (
              <button key={key} onClick={() => pickMood(key)} style={{ flex: 1, border: on ? `2px solid ${P.accent}` : `2px solid transparent`, background: P.card, borderRadius: 18, padding: "14px 6px", cursor: "pointer", boxShadow: softer, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>
                <Icon size={24} color={on ? P.accent : P.inkSoft} />
                <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12 }}>{label}</span>
              </button>
            );
          })}
        </div>
        {(moodToday === "low" || moodToday === "okay") && (
          <button onClick={liftMeUp} style={{ marginTop: 12, width: "100%", border: "none", cursor: "pointer", background: P.accentSoft, borderRadius: 16, padding: "14px", fontFamily: font.ui, fontWeight: 800, color: P.accentDeep, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Sparkles size={18} /> Show me a happier moment</button>
        )}
      </div>

      <div style={{ marginTop: 22 }}>
        <SectionLabel>Today's three pillars</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pillars.map(({ k, title, sub, Icon }) => (
            <button key={k} onClick={() => (k === "vision" ? setView("vision") : openPillar(k))} style={{ textAlign: "left", border: "none", cursor: "pointer", background: P.card, borderRadius: 22, padding: 16, boxShadow: softer, display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: P.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><Icon size={26} color={P.accentDeep} /></div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 19 }}>{title}</div>
                <div style={{ color: P.inkSoft, fontSize: 13 }}>{sub}</div>
              </div>
              <ChevronRight size={22} color={P.inkSoft} />
            </button>
          ))}
        </div>
      </div>

      {/* monthly recap */}
      <button onClick={() => setRecap(true)} style={{ marginTop: 16, width: "100%", border: `1px solid ${P.line}`, cursor: "pointer", background: P.card, borderRadius: 20, padding: 16, boxShadow: softer, display: "flex", alignItems: "center", gap: 12, textAlign: "left" }}>
        <div style={{ width: 46, height: 46, borderRadius: 14, background: P.accentSoft, display: "flex", alignItems: "center", justifyContent: "center" }}><BookHeart size={22} color={P.accentDeep} /></div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 17 }}>Your {monthName}, gathered</div>
          <div style={{ color: P.inkSoft, fontSize: 13 }}>Everything you were grateful for this month.</div>
        </div>
        <ChevronRight size={20} color={P.inkSoft} />
      </button>

      {/* today's list */}
      <div style={{ marginTop: 22 }}>
        <SectionLabel right={<button onClick={() => setView("todo")} style={{ background: "none", border: "none", cursor: "pointer", color: P.accentDeep, fontFamily: font.ui, fontWeight: 800, fontSize: 12 }}>Open list</button>}>Today's list</SectionLabel>
        <div style={{ background: P.card, borderRadius: 20, padding: 16, boxShadow: softer }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: P.cream, overflow: "hidden" }}>
              <div style={{ width: `${todos.length ? (doneCount/todos.length)*100 : 0}%`, height: "100%", background: P.accent, transition: "width .4s" }} />
            </div>
            <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 13, color: P.inkSoft }}>{doneCount}/{todos.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {todos.slice(0,4).map(t => (
              <button key={t.id} onClick={() => toggleTodo(t.id)} style={{ display: "flex", alignItems: "center", gap: 10, background: "none", border: "none", cursor: "pointer", padding: "6px 0", textAlign: "left" }}>
                {t.done ? <CheckCircle2 size={22} color={P.accent} /> : <Circle size={22} color={P.line} />}
                <span style={{ fontSize: 15, color: t.done ? P.inkSoft : P.ink, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.65 : 1 }}>{t.text}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={openMoment} style={{ marginTop: 16, width: "100%", border: "none", cursor: "pointer", background: `linear-gradient(135deg, ${P.accent}, ${P.sun})`, borderRadius: 22, padding: "18px", color: "#fff", boxShadow: "0 8px 20px rgba(120,70,40,0.25)", display: "flex", alignItems: "center", gap: 12 }}>
        <Wand2 size={24} />
        <div style={{ textAlign: "left", flex: 1 }}>
          <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 17 }}>Your manifestation moment</div>
          <div style={{ fontSize: 13, opacity: 0.95 }}>Pause 30 seconds with what you're calling in.</div>
        </div>
      </button>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={() => setView("booth")} style={{ background: "none", border: "none", cursor: "pointer", color: P.accentDeep, fontFamily: font.ui, fontWeight: 800, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6 }}><Video size={18} /> Capture today in the Joy Booth</button>
      </div>
    </div>
  );
}

/* ============================ PILLAR ============================ */
function PillarView({ kind, data, onAdd, onBack, onShare, flash }) {
  const isG = kind === "gratitude";
  const title = isG ? "Gratitude" : "Appreciation";
  const prompts = PROMPTS[kind];
  const [pi, setPi] = useState(dayIndex() % prompts.length);
  const [mode, setMode] = useState("write");   // write | speak | video
  const [text, setText] = useState("");
  const [byear, setByear] = useState(null);
  const [bmonth, setBmonth] = useState(null);
  const [sendModal, setSendModal] = useState(null);
  const [releasing, setReleasing] = useState(null);
  const [freshId, setFreshId] = useState(null);

  const todayIso = iso(new Date());
  const recent = data.filter(e => daysBetween(e.date) <= 6 || e.date === todayIso).sort((a,b) => a.date < b.date ? 1 : -1);
  const older = data.filter(e => !(daysBetween(e.date) <= 6 || e.date === todayIso));
  const years = {};
  older.forEach(e => { const d = new Date(e.date), y = d.getFullYear(), m = d.getMonth(); years[y] = years[y]||{}; years[y][m] = years[y][m]||[]; years[y][m].push(e); });

  const saveText = () => {
    if (!text.trim()) return;
    const content = text.trim(), id = "e" + Date.now();
    onAdd({ id, type: "text", content, joyful: true });
    setFreshId(id); setReleasing(content); setText("");
    setTimeout(() => setReleasing(null), 950);
  };
  const saveVoice = () => { const id = "e" + Date.now(); onAdd({ id, type: "voice", content: "A voice reflection", joyful: true }); setFreshId(id); };
  const saveVideo = () => { const id = "e" + Date.now(); onAdd({ id, type: "video", content: "A recorded reflection", joyful: true }); setFreshId(id); };

  return (
    <div>
      <TopBar title={title} onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ position: "relative" }}>
          <NotebookPad prompt={prompts[pi]} value={mode === "write" ? text : ""} onChange={setText} onShuffle={() => setPi(p => (p+1) % prompts.length)} />
          {releasing && (
            <div aria-hidden style={{ position: "absolute", left: 0, right: 0, top: 0, pointerEvents: "none", zIndex: 6, animation: "noteRelease .95s ease-in forwards" }}>
              <div style={{ background: P.card, border: `1px solid ${P.line}`, borderRadius: 18, padding: 18, boxShadow: soft, display: "flex", gap: 10 }}>
                <BookHeart size={18} color={P.accent} style={{ marginTop: 3, flexShrink: 0 }} />
                <div style={{ fontFamily: font.serif, fontSize: 18, lineHeight: 1.4, color: P.ink }}>{releasing}</div>
              </div>
            </div>
          )}
        </div>

        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <ModeChip active={mode==="write"} onClick={() => setMode("write")} Icon={PenLine} label="Write" />
          <ModeChip active={mode==="speak"} onClick={() => setMode("speak")} Icon={Mic} label="Speak" />
          <ModeChip active={mode==="video"} onClick={() => setMode("video")} Icon={Video} label="Record" />
        </div>

        {mode === "write" && (
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            <SoftButton primary onClick={saveText} style={{ flex: 1 }}>Keep it</SoftButton>
          </div>
        )}
        {mode === "speak" && <div style={{ marginTop: 12 }}><VoiceRecorder onSave={saveVoice} /></div>}
        {mode === "video" && <div style={{ marginTop: 12 }}><MiniVideoRecorder onSave={saveVideo} /></div>}

        {!isG && (
          <div style={{ marginTop: 14, background: P.accentSoft, borderRadius: 16, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12 }}>
            <Send size={20} color={P.accentDeep} />
            <div style={{ flex: 1, fontSize: 13.5, color: P.accentDeep, lineHeight: 1.4 }}>Appreciation grows when it's spoken. Want to tell them?</div>
            <button onClick={() => setSendModal(recent[0] || { content: "someone you value" })} style={{ border: "none", cursor: "pointer", background: P.card, color: P.accentDeep, borderRadius: 12, padding: "8px 12px", fontFamily: font.ui, fontWeight: 800, fontSize: 13 }}>Send it</button>
          </div>
        )}

        <div style={{ marginTop: 24 }}>
          <SectionLabel>The last few days</SectionLabel>
          {recent.length === 0 && <EmptyNote>Nothing here yet — today's a lovely place to start.</EmptyNote>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recent.map(e => <EntryCard key={e.id} e={e} fresh={e.id===freshId} onShare={() => onShare({ kind: "entry", label: isG ? "grateful for" : "appreciating", text: e.content, date: e.date })} onSend={!isG ? () => setSendModal(e) : null} />)}
          </div>
        </div>

        {Object.keys(years).length > 0 && (
          <div style={{ marginTop: 24 }}>
            <SectionLabel>Look back</SectionLabel>
            {!byear && Object.keys(years).sort((a,b)=>b-a).map(y => <ArchiveRow key={y} label={y} onClick={() => setByear(y)} />)}
            {byear && bmonth === null && (<>
              <BackRow label={byear} onClick={() => setByear(null)} />
              {Object.keys(years[byear]).sort((a,b)=>b-a).map(m => <ArchiveRow key={m} label={MONTHS[m]} count={years[byear][m].length} onClick={() => setBmonth(m)} />)}
            </>)}
            {byear && bmonth !== null && (<>
              <BackRow label={`${MONTHS[bmonth]} ${byear}`} onClick={() => setBmonth(null)} />
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {years[byear][bmonth].map(e => <EntryCard key={e.id} e={e} onShare={() => onShare({ kind: "entry", label: isG ? "grateful for" : "appreciating", text: e.content, date: e.date })} />)}
              </div>
            </>)}
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>

      {sendModal && (
        <SendModal entry={sendModal} onClose={() => setSendModal(null)} flash={flash} />
      )}
    </div>
  );
}

function ModeChip({ active, onClick, Icon, label }) {
  return (
    <button onClick={onClick} style={{ flex: 1, border: active ? `2px solid ${P.accent}` : `1px solid ${P.line}`, background: active ? P.card : "transparent", cursor: "pointer", borderRadius: 14, padding: "10px", fontFamily: font.ui, fontWeight: 800, fontSize: 13, color: active ? P.accentDeep : P.inkSoft, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
      <Icon size={16} /> {label}
    </button>
  );
}

function EntryCard({ e, onShare, onSend, fresh }) {
  const [playing, setPlaying] = useState(false);
  return (
    <div style={{ background: P.card, borderRadius: 18, padding: 16, boxShadow: softer, border: `1px solid ${P.line}`, animation: fresh ? "settleIn .6s ease both" : "none" }}>
      <div style={{ display: "flex", gap: 12 }}>
        <div style={{ width: 40, height: 40, borderRadius: 12, background: P.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
          {e.type === "video" ? <Play size={18} color={P.accentDeep} /> : e.type === "voice" ? <Mic size={18} color={P.accentDeep} /> : <Quote size={18} color={P.accentDeep} />}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font.serif, fontSize: 17, lineHeight: 1.5 }}>
            {e.type === "video" ? "A recorded reflection" : e.type === "voice" ? (playing ? "Playing your voice note…" : "A voice reflection") : e.content}
          </div>
          <div style={{ color: P.inkSoft, fontSize: 12, marginTop: 4, fontFamily: font.ui, fontWeight: 800 }}>{fmtDay(new Date(e.date))}</div>
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
        {e.type === "voice" && (
          <button onClick={() => setPlaying(p => !p)} style={miniBtn}>{playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "Pause" : "Play"}</button>
        )}
        {e.type === "text" && onShare && (
          <button onClick={onShare} style={miniBtn}><Share2 size={14} /> Share as card</button>
        )}
        {onSend && e.type === "text" && (
          <button onClick={onSend} style={miniBtn}><Send size={14} /> Send it</button>
        )}
      </div>
    </div>
  );
}
const miniBtn = { border: `1px solid ${P.line}`, background: P.cream, cursor: "pointer", borderRadius: 10, padding: "7px 12px", fontFamily: font.ui, fontWeight: 800, fontSize: 12, color: P.inkSoft, display: "inline-flex", alignItems: "center", gap: 6 };

function ArchiveRow({ label, count, onClick }) {
  return (
    <button onClick={onClick} style={{ width: "100%", background: P.card, border: `1px solid ${P.line}`, cursor: "pointer", borderRadius: 16, padding: "14px 16px", marginBottom: 8, boxShadow: softer, display: "flex", alignItems: "center", gap: 12 }}>
      <Calendar size={18} color={P.inkSoft} />
      <span style={{ flex: 1, textAlign: "left", fontFamily: font.serif, fontWeight: 600, fontSize: 16 }}>{label}</span>
      {count != null && <span style={{ background: P.accentSoft, color: P.accentDeep, fontFamily: font.ui, fontWeight: 800, fontSize: 12, padding: "3px 9px", borderRadius: 999 }}>{count}</span>}
      <ChevronRight size={18} color={P.inkSoft} />
    </button>
  );
}
function BackRow({ label, onClick }) {
  return <button onClick={onClick} style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6, color: P.accentDeep, fontFamily: font.ui, fontWeight: 800, fontSize: 14, marginBottom: 12 }}><ChevronLeft size={18} /> {label}</button>;
}

/* ---------- voice + video recorders ---------- */
function VoiceRecorder({ onSave }) {
  const [state, setState] = useState("idle"); // idle | rec | done | error
  const [secs, setSecs] = useState(0);
  const streamRef = useRef(null); const timer = useRef(null);
  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = s; setState("rec"); setSecs(0);
      timer.current = setInterval(() => setSecs(x => x+1), 1000);
    } catch { setState("error"); }
  };
  const stop = () => { streamRef.current?.getTracks().forEach(t=>t.stop()); clearInterval(timer.current); setState("done"); };
  useEffect(() => () => { streamRef.current?.getTracks().forEach(t=>t.stop()); clearInterval(timer.current); }, []);
  const mm = String(Math.floor(secs/60)).padStart(2,"0"), ss = String(secs%60).padStart(2,"0");
  return (
    <div style={{ background: P.card, borderRadius: 16, padding: 18, border: `1px solid ${P.line}`, textAlign: "center" }}>
      {state === "error" ? (
        <>
          <div style={{ color: P.inkSoft, fontSize: 13, marginBottom: 12 }}>Microphone isn't available in this preview — on your phone it records normally. You can still save a voice note.</div>
          <SoftButton primary onClick={onSave} style={{ width: "100%" }}>Save voice note</SoftButton>
        </>
      ) : (
        <>
          <div style={{ width: 64, height: 64, borderRadius: 999, margin: "0 auto 12px", background: state==="rec" ? P.accent : P.accentSoft, display: "flex", alignItems: "center", justifyContent: "center", animation: state==="rec" ? "glow 1.6s ease-in-out infinite" : "none" }}>
            <Mic size={28} color={state==="rec" ? "#fff" : P.accentDeep} />
          </div>
          <div style={{ fontFamily: font.serif, fontSize: 20, marginBottom: 12 }}>{state==="rec" ? `${mm}:${ss}` : state==="done" ? "Lovely — that's kept 💛" : "Speak freely"}</div>
          {state === "idle" && <SoftButton primary onClick={start} style={{ width: "100%" }}>Start recording</SoftButton>}
          {state === "rec" && <SoftButton primary onClick={stop} style={{ width: "100%", background: P.accentDeep }}>Stop</SoftButton>}
          {state === "done" && <SoftButton primary onClick={onSave} style={{ width: "100%" }}>Keep it</SoftButton>}
        </>
      )}
    </div>
  );
}
function MiniVideoRecorder({ onSave }) {
  const [state, setState] = useState("idle");
  const videoRef = useRef(null); const streamRef = useRef(null);
  const start = async () => {
    try { const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true }); streamRef.current = s; if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); } setState("rec"); }
    catch { setState("error"); }
  };
  const stop = () => { streamRef.current?.getTracks().forEach(t=>t.stop()); setState("done"); };
  useEffect(() => () => streamRef.current?.getTracks().forEach(t=>t.stop()), []);
  return (
    <div>
      <div style={{ borderRadius: 16, overflow: "hidden", background: "#2b2620", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {state === "rec" ? <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ color: "#fff", textAlign: "center", padding: 16, fontSize: 13, opacity: 0.9 }}>{state==="error" ? "Camera isn't available in this preview — it works on your phone. You can still save this reflection." : state==="done" ? "Looks lovely 💛" : "Tap record to begin"}</div>}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {state === "idle" && <SoftButton primary onClick={start} style={{ flex: 1 }}>Record</SoftButton>}
        {state === "rec" && <SoftButton primary onClick={stop} style={{ flex: 1, background: P.accentDeep }}>Stop</SoftButton>}
        {(state === "done" || state === "error") && <SoftButton primary onClick={onSave} style={{ flex: 1 }}>Keep it</SoftButton>}
      </div>
    </div>
  );
}

/* ---------- send appreciation outward ---------- */
function SendModal({ entry, onClose, flash }) {
  const [to, setTo] = useState("");
  const msg = `Hi${to ? " " + to : ""}, I was just reflecting and felt grateful for you — ${entry.content}. I wanted you to know. 💛`;
  const copy = () => { try { navigator.clipboard?.writeText(msg); } catch {} flash("Copied — go make their day."); onClose(); };
  const share = async () => {
    try { if (navigator.share) { await navigator.share({ text: msg }); onClose(); return; } } catch {}
    copy();
  };
  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, margin: "0 0 4px" }}>Send your appreciation</h3>
      <p style={{ color: P.inkSoft, fontSize: 13, marginTop: 0 }}>Told, not just logged. This is the quietly powerful part.</p>
      <input value={to} onChange={(e)=>setTo(e.target.value)} placeholder="Their name (optional)" style={{ width: "100%", border: `1px solid ${P.line}`, borderRadius: 12, padding: "11px 12px", fontSize: 15, color: P.ink, background: P.cream, marginBottom: 12 }} />
      <div style={{ background: P.accentSoft, borderRadius: 16, padding: 16, fontFamily: font.serif, fontSize: 16, lineHeight: 1.5, color: P.ink, marginBottom: 14 }}>{msg}</div>
      <div style={{ display: "flex", gap: 10 }}>
        <SoftButton primary onClick={share} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Send size={16} /> Share</SoftButton>
        <SoftButton ghost onClick={copy}>Copy</SoftButton>
      </div>
    </Modal>
  );
}

/* ============================ VISION ============================ */
function VisionView({ manifest, setManifest, reminder, setReminder, openMoment, onBack, flash, onShare }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState(""); const [aff, setAff] = useState(""); const [why, setWhy] = useState(""); const [img, setImg] = useState(null);
  const [freshId, setFreshId] = useState(null);
  const fileRef = useRef(null);
  const active = manifest.filter(m => !m.achieved); const done = manifest.filter(m => m.achieved);
  const add = () => { if (!title.trim() || !aff.trim()) return; const id = "man" + Date.now(); setManifest(p => [{ id, title: title.trim(), affirmation: aff.trim(), why: why.trim(), achieved: false, img }, ...p]); setFreshId(id); setTitle(""); setAff(""); setWhy(""); setImg(null); setAdding(false); flash("Added to your vision board ✨"); };
  const markDone = (id) => { setManifest(p => p.map(m => m.id===id ? { ...m, achieved: true } : m)); flash("Moved to Manifested ✨"); };
  const onFile = (e) => { const f = e.target.files?.[0]; if (f) setImg(URL.createObjectURL(f)); };

  return (
    <div>
      <TopBar title="Vision Board" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <button onClick={openMoment} style={{ width: "100%", border: "none", cursor: "pointer", marginBottom: 18, background: `linear-gradient(135deg, ${P.accent}, ${P.sun})`, borderRadius: 20, padding: 16, color: "#fff", display: "flex", alignItems: "center", gap: 10, boxShadow: soft }}>
          <Wand2 size={22} /> <span style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 17 }}>Take today's manifestation moment</span>
        </button>

        <div style={{ background: P.card, borderRadius: 18, padding: 16, boxShadow: softer, display: "flex", alignItems: "center", gap: 12, marginBottom: 20, border: `1px solid ${P.line}` }}>
          <Bell size={20} color={P.accentDeep} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 16 }}>Daily reminder</div>
            <div style={{ color: P.inkSoft, fontSize: 12 }}>A gentle nudge to visit your vision.</div>
          </div>
          <input type="time" value={reminder} onChange={(e)=>setReminder(e.target.value)} style={{ border: `1px solid ${P.line}`, borderRadius: 12, padding: "8px 10px", fontSize: 15, color: P.ink, background: P.cream }} />
        </div>

        <SectionLabel>What I'm calling in</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {active.map(m => (
            <div key={m.id} style={{ background: P.card, borderRadius: 20, overflow: "hidden", boxShadow: softer, border: `1px solid ${P.line}`, animation: m.id===freshId ? "settleIn .55s ease both" : "none" }}>
              <div style={{ height: 92, background: m.img ? `url(${m.img}) center/cover` : `linear-gradient(140deg, ${P.accentSoft}, ${P.card})`, display: "flex", alignItems: "flex-end", padding: 8 }}>{!m.img && <Sparkles size={20} color={P.accentDeep} />}</div>
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 15, lineHeight: 1.25 }}>{m.title}</div>
                <div style={{ color: P.inkSoft, fontSize: 12, marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>"{m.affirmation}"</div>
                <button onClick={() => markDone(m.id)} style={{ marginTop: 10, width: "100%", border: `1px solid ${P.accent}`, background: P.accentSoft, color: P.accentDeep, borderRadius: 10, padding: "7px", cursor: "pointer", fontFamily: font.ui, fontWeight: 800, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}><Check size={14} /> It came true</button>
              </div>
            </div>
          ))}
          <button onClick={() => setAdding(true)} style={{ border: `2px dashed ${P.accent}`, background: "transparent", cursor: "pointer", borderRadius: 20, minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 8, color: P.accentDeep }}>
            <Plus size={26} /> <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 13 }}>Add a dream</span>
          </button>
        </div>

        {done.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <SectionLabel>Manifested ✨ — dreams now real</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {done.map(m => (
                <div key={m.id} style={{ background: `linear-gradient(120deg, ${P.sun}22, ${P.card})`, border: `1px solid ${P.sun}66`, borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: P.sun + "44", display: "flex", alignItems: "center", justifyContent: "center" }}><Star size={20} color={P.accentDeep} fill={P.sun} /></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 16 }}>{m.title}</div>
                    <div style={{ color: P.inkSoft, fontSize: 12 }}>I dreamed this — and here it is.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>

      {adding && (
        <Modal onClose={() => setAdding(false)}>
          <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, margin: "0 0 4px" }}>Add to your vision board</h3>
          <p style={{ color: P.inkSoft, fontSize: 13, marginTop: 0 }}>Write your affirmation as if it's already true.</p>
          <button onClick={() => fileRef.current?.click()} style={{ width: "100%", height: 110, borderRadius: 16, border: `2px dashed ${P.line}`, cursor: "pointer", background: img ? `url(${img}) center/cover` : P.cream, display: "flex", alignItems: "center", justifyContent: "center", color: P.inkSoft, marginBottom: 12 }}>
            {!img && <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: font.ui, fontWeight: 800 }}><Camera size={18} /> Add a picture</span>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />
          <Field label="What are you manifesting?" value={title} onChange={setTitle} placeholder="e.g. My calm, light-filled home" />
          <Field label="Affirmation (present tense)" value={aff} onChange={setAff} placeholder="I am…" hint />
          <Field label="Why it matters (optional)" value={why} onChange={setWhy} placeholder="A word to future me" />
          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <SoftButton primary onClick={add} style={{ flex: 1 }}>Add it</SoftButton>
            <SoftButton ghost onClick={() => setAdding(false)}>Cancel</SoftButton>
          </div>
        </Modal>
      )}
    </div>
  );
}
function Field({ label, value, onChange, placeholder, hint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 13, display: "block", marginBottom: 5 }}>{label}</label>
      <input value={value} onChange={(e)=>onChange(e.target.value)} placeholder={placeholder} style={{ width: "100%", border: `1px solid ${P.line}`, borderRadius: 12, padding: "11px 12px", fontSize: 15, color: P.ink, background: P.cream }} />
      {hint && <div style={{ color: P.accentDeep, fontSize: 11, marginTop: 4 }}>Tip: "I am…" works better than "I will…"</div>}
    </div>
  );
}

/* ============================ JOY BOOTH ============================ */
function BoothView({ videos, setVideos, onBack, flash, theme }) {
  const [recording, setRecording] = useState(false);
  const [label, setLabel] = useState(""); const [camReady, setCamReady] = useState(false); const [camError, setCamError] = useState(false);
  const [recordedUrl, setRecordedUrl] = useState(null);
  const [frameVid, setFrameVid] = useState(null);
  const videoRef = useRef(null); const streamRef = useRef(null); const recRef = useRef(null); const chunks = useRef([]);
  const start = async () => {
    setCamError(false); setRecordedUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream; if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCamReady(true); chunks.current = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => setRecordedUrl(URL.createObjectURL(new Blob(chunks.current, { type: "video/webm" })));
      recRef.current = rec; rec.start(); setRecording(true);
    } catch { setCamError(true); }
  };
  const stop = () => { recRef.current?.stop(); streamRef.current?.getTracks().forEach(t=>t.stop()); setRecording(false); setCamReady(false); };
  const saveClip = () => { setVideos(p => [{ id: Date.now()+"", date: iso(new Date()), label: label.trim()||"A happy moment", mood: "joyful", url: recordedUrl }, ...p]); setRecordedUrl(null); setLabel(""); flash("Kept for your future self 💛"); };
  const savePlaceholder = () => { setVideos(p => [{ id: Date.now()+"", date: iso(new Date()), label: label.trim()||"A happy moment", mood: "joyful" }, ...p]); setLabel(""); setCamError(false); flash("Saved a joy note for today 💛"); };
  useEffect(() => () => streamRef.current?.getTracks().forEach(t=>t.stop()), []);

  return (
    <div>
      <TopBar title="Joy Booth" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: P.accentSoft, borderRadius: 16, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
          <Lock size={18} color={P.accentDeep} />
          <div style={{ fontSize: 13, color: P.accentDeep, lineHeight: 1.4 }}>Every video is private and yours. Download it in a beautiful Bloom frame — or share it, if you choose.</div>
        </div>
        <div style={{ background: P.card, borderRadius: 22, padding: 16, boxShadow: softer, border: `1px solid ${P.line}` }}>
          <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 18 }}>Capture a happy moment</div>
          <div style={{ color: P.inkSoft, fontSize: 13, marginBottom: 12 }}>A message from today's you to a future, low-day you.</div>
          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "#2b2620", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!camError && (camReady || recordedUrl) ? (
              recordedUrl ? <video src={recordedUrl} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                : <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            ) : (
              <div style={{ textAlign: "center", color: "#fff", padding: 20 }}>
                {camError ? <><Camera size={34} color="#fff" style={{ opacity: 0.8 }} /><div style={{ fontSize: 13, marginTop: 8, opacity: 0.9, lineHeight: 1.5 }}>Camera isn't available in this preview. On your phone it records normally — for now you can save a joy note.</div></>
                  : <><Video size={34} color="#fff" style={{ opacity: 0.8 }} /><div style={{ fontSize: 13, marginTop: 8, opacity: 0.9 }}>Tap record when you're ready</div></>}
              </div>
            )}
            {recording && <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.5)", color: "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}><span style={{ width: 8, height: 8, borderRadius: 999, background: "#ff6b6b" }} /> REC</div>}
          </div>
          <input value={label} onChange={(e)=>setLabel(e.target.value)} placeholder="Name this moment…" style={{ width: "100%", border: `1px solid ${P.line}`, borderRadius: 12, padding: "10px 12px", marginTop: 12, fontSize: 15, color: P.ink, background: P.cream }} />
          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {!recording && !recordedUrl && !camError && <SoftButton primary onClick={start} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Camera size={18} /> Record</SoftButton>}
            {recording && <SoftButton primary onClick={stop} style={{ flex: 1, background: P.accentDeep }}>Stop & keep</SoftButton>}
            {recordedUrl && <><SoftButton primary onClick={saveClip} style={{ flex: 1 }}>Keep it</SoftButton><SoftButton ghost onClick={() => setRecordedUrl(null)}>Retake</SoftButton></>}
            {camError && <SoftButton primary onClick={savePlaceholder} style={{ flex: 1 }}>Save a joy note</SoftButton>}
          </div>
        </div>
        <div style={{ marginTop: 24 }}>
          <SectionLabel>Your booth of happy moments</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {videos.map(v => (
              <div key={v.id} style={{ background: P.card, borderRadius: 18, overflow: "hidden", boxShadow: softer, border: `1px solid ${P.line}` }}>
                <div style={{ height: 96, background: v.url ? "#2b2620" : `linear-gradient(140deg, ${P.accentSoft}, ${P.card})`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  {v.url ? <video src={v.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Play size={26} color={P.accentDeep} fill={P.accentDeep} />}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 14, lineHeight: 1.25 }}>{v.label}</div>
                  <div style={{ color: P.inkSoft, fontSize: 11, marginTop: 2 }}>{fmtDay(new Date(v.date))}</div>
                  <button onClick={() => setFrameVid(v)} style={{ marginTop: 8, width: "100%", border: `1px solid ${P.line}`, background: P.accentSoft, color: P.accentDeep, borderRadius: 10, padding: "6px", cursor: "pointer", fontFamily: font.ui, fontWeight: 800, fontSize: 11, display: "flex", alignItems: "center", justifyContent: "center", gap: 5 }}><Download size={13} /> Save / Share</button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 24 }} />
      </div>
      {frameVid && <BrandedVideoModal video={frameVid} theme={theme} onClose={() => setFrameVid(null)} flash={flash} />}
    </div>
  );
}

/* ============================ BRANDED VIDEO FRAME + EXPORT ============================ */
function BrandedFrame({ video }) {
  return (
    <div style={{ borderRadius: 22, overflow: "hidden", background: `linear-gradient(160deg, ${P.accentSoft}, ${P.card})`, border: `1px solid ${P.line}`, padding: 16, boxShadow: soft }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
        <Flower2 size={22} color={P.accent} />
        <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 18, lineHeight: 1 }}>Bloom</div>
      </div>
      <div style={{ borderRadius: 16, overflow: "hidden", background: "#2b2620", aspectRatio: "4/5", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {video.url ? <video src={video.url} controls playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} /> : <Play size={44} color="#fff" fill="#fff" />}
      </div>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12 }}>
        <div style={{ fontFamily: font.serif, fontStyle: "italic", fontSize: 14, color: P.inkSoft }}>meet the happy you</div>
        <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12, color: P.accentDeep }}>{fmtDay(new Date(video.date))}</div>
      </div>
      <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 16, marginTop: 8 }}>{video.label}</div>
    </div>
  );
}

function BrandedVideoModal({ video, theme, onClose, flash }) {
  const [busy, setBusy] = useState(false);
  const download = async () => {
    setBusy(true);
    try {
      if (video.url) await compositeBrandedVideo(video, theme);
      else downloadVideoPoster(video, theme);
      flash("Saved with your Bloom frame 💛");
    } catch {
      downloadVideoPoster(video, theme);
      flash("Saved a framed image 💛");
    }
    setBusy(false);
  };
  const share = async () => {
    try { if (navigator.share) { await navigator.share({ title: "Bloom", text: `${video.label} — a happy moment. Meet the happy you.` }); return; } } catch {}
    flash("On the phone app this shares straight to your socials.");
  };
  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, margin: "0 0 4px" }}>Your moment, framed</h3>
      <p style={{ color: P.inkSoft, fontSize: 13, marginTop: 0 }}>Wrapped in Bloom — download it or share it, it's yours.</p>
      <BrandedFrame video={video} />
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <SoftButton primary onClick={download} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
          <Download size={16} /> {busy ? "Preparing…" : "Download"}
        </SoftButton>
        <SoftButton ghost onClick={share} style={{ display: "flex", alignItems: "center", gap: 8 }}><Share2 size={16} /> Share</SoftButton>
      </div>
      <p style={{ color: P.inkSoft, fontSize: 11.5, marginTop: 12, lineHeight: 1.5, textAlign: "center" }}>
        The frame you see here is baked into your download. On the phone app it exports as a ready-to-post video for Instagram or TikTok.
      </p>
    </Modal>
  );
}

/* draw the branded frame permanently onto the recorded video (best-effort in-browser) */
function compositeBrandedVideo(video, theme) {
  return new Promise((resolve, reject) => {
    if (!video.url || typeof MediaRecorder === "undefined") return reject("no-video");
    const t = THEMES[theme] || THEMES.terracotta;
    const v = document.createElement("video");
    v.src = video.url; v.playsInline = true; v.muted = false;
    v.onerror = () => reject("load-error");
    v.onloadedmetadata = () => {
      const vw = v.videoWidth || 720, vh = v.videoHeight || 960;
      const W = 1080, iw = W - 120, ih = Math.round(iw * (vh / vw));
      const padTop = 150, padBottom = 200, H = ih + padTop + padBottom;
      const canvas = document.createElement("canvas"); canvas.width = W; canvas.height = H;
      const ctx = canvas.getContext("2d");
      let stream;
      try { stream = canvas.captureStream(30); } catch (e) { return reject(e); }
      try { const ss = v.captureStream ? v.captureStream() : (v.mozCaptureStream && v.mozCaptureStream()); if (ss) ss.getAudioTracks().forEach(tr => stream.addTrack(tr)); } catch (e) {}
      let rec;
      try { rec = new MediaRecorder(stream); } catch (e) { return reject(e); }
      const chunks = [];
      rec.ondataavailable = (e) => e.data.size && chunks.push(e.data);
      rec.onstop = () => { triggerDownload(new Blob(chunks, { type: "video/webm" }), "bloom-video.webm"); resolve(); };
      const dateStr = new Date(video.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      const draw = () => {
        const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, t.accentSoft); g.addColorStop(1, BASE.card);
        ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
        ctx.save(); roundRect(ctx, 60, padTop, iw, ih, 28); ctx.clip();
        try { ctx.drawImage(v, 60, padTop, iw, ih); } catch (e) {}
        ctx.restore();
        drawBloomMark(ctx, 92, padTop - 74, t.accent, 20);
        ctx.textAlign = "left"; ctx.fillStyle = t.accentDeep; ctx.font = "600 46px Fraunces, Georgia, serif";
        ctx.fillText("Bloom", 128, padTop - 54);
        ctx.textAlign = "center"; ctx.fillStyle = BASE.inkSoft; ctx.font = "italic 30px Fraunces, Georgia, serif";
        ctx.fillText("meet the happy you", W / 2, padTop + ih + 68);
        ctx.font = "700 26px Nunito, sans-serif"; ctx.fillStyle = t.accentDeep;
        ctx.fillText(dateStr, W / 2, padTop + ih + 110);
        if (!v.ended) requestAnimationFrame(draw);
      };
      v.onended = () => { try { if (rec.state !== "inactive") rec.stop(); } catch (e) {} };
      v.play().then(() => { try { rec.start(); } catch (e) { return reject(e); } draw(); }).catch(reject);
      setTimeout(() => { try { if (rec.state !== "inactive") rec.stop(); } catch (e) {} }, 60000);
    };
  });
}

/* fallback: a branded poster image when no real video is available */
function downloadVideoPoster(video, theme) {
  const t = THEMES[theme] || THEMES.terracotta;
  const W = 1080, H = 1350;
  const c = document.createElement("canvas"); c.width = W; c.height = H;
  const ctx = c.getContext("2d");
  const g = ctx.createLinearGradient(0, 0, W, H); g.addColorStop(0, t.accentSoft); g.addColorStop(1, BASE.card);
  ctx.fillStyle = g; ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = t.accent + "55"; ctx.lineWidth = 3; roundRect(ctx, 60, 60, W - 120, H - 120, 40); ctx.stroke();
  drawBloomMark(ctx, 150, 172, t.accent, 26);
  ctx.textAlign = "left"; ctx.fillStyle = t.accentDeep; ctx.font = "600 58px Fraunces, Georgia, serif";
  ctx.fillText("Bloom", 198, 192);
  ctx.fillStyle = t.accent + "22"; roundRect(ctx, 140, 300, W - 280, 620, 32); ctx.fill();
  ctx.fillStyle = t.accentDeep; ctx.beginPath(); ctx.moveTo(W / 2 - 42, 558); ctx.lineTo(W / 2 - 42, 662); ctx.lineTo(W / 2 + 58, 610); ctx.closePath(); ctx.fill();
  ctx.textAlign = "center"; ctx.fillStyle = BASE.ink; ctx.font = "600 54px Fraunces, Georgia, serif";
  wrapText(ctx, video.label || "A happy moment", W / 2, 1030, W - 240, 66);
  ctx.fillStyle = BASE.inkSoft; ctx.font = "italic 30px Fraunces, Georgia, serif";
  ctx.fillText("meet the happy you", W / 2, H - 168);
  ctx.font = "700 26px Nunito, sans-serif"; ctx.fillStyle = t.accentDeep;
  ctx.fillText(new Date(video.date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), W / 2, H - 122);
  c.toBlob((b) => triggerDownload(b, "bloom-moment.png"));
}

function triggerDownload(blob, name) {
  const url = URL.createObjectURL(blob); const a = document.createElement("a");
  a.href = url; a.download = name; document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}
function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
function drawBloomMark(ctx, cx, cy, color, s) {
  ctx.save(); ctx.fillStyle = color;
  for (let i = 0; i < 6; i++) {
    const a = (Math.PI / 3) * i;
    ctx.beginPath();
    ctx.ellipse(cx + Math.cos(a) * s * 0.9, cy + Math.sin(a) * s * 0.9, s * 0.72, s * 0.42, a, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.beginPath(); ctx.arc(cx, cy, s * 0.55, 0, Math.PI * 2); ctx.fillStyle = "#F6E1B8"; ctx.fill();
  ctx.restore();
}
function LibraryView({ onBack, onShare, myAff, onAddAff, onDelAff }) {
  const cats = [...Object.keys(AFFIRMATIONS), "My own"];
  const [cat, setCat] = useState(cats[0]);
  const [draft, setDraft] = useState("");
  const isMine = cat === "My own";
  const submit = () => { if (draft.trim()) { onAddAff(draft.trim()); setDraft(""); } };

  return (
    <div>
      <TopBar title="Affirmations" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <p style={{ color: P.inkSoft, fontSize: 14, marginTop: 0 }}>Grounded in CBT and self-compassion — not empty pep talk. Pick what you need, or write your own.</p>
        <div data-noswipe style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 18 }}>
          {cats.map(c => (
            <button key={c} onClick={() => setCat(c)} style={{ whiteSpace: "nowrap", border: cat===c ? `2px solid ${P.accent}` : `1px solid ${P.line}`, background: cat===c ? P.card : "transparent", color: P.ink, cursor: "pointer", borderRadius: 999, padding: "8px 14px", fontFamily: font.ui, fontWeight: 800, fontSize: 13, display: "inline-flex", alignItems: "center", gap: 6 }}>
              {c === "My own" && <Plus size={14} color={cat===c ? P.accentDeep : P.inkSoft} />}{c}
            </button>
          ))}
        </div>

        {isMine ? (
          <>
            <div style={{ background: P.card, border: `1px solid ${P.line}`, borderRadius: 18, padding: 16, boxShadow: softer, marginBottom: 16 }}>
              <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 17, marginBottom: 4 }}>Write your own</div>
              <div style={{ color: P.inkSoft, fontSize: 13, marginBottom: 12 }}>The words that speak to <em>you</em>. Present tense works best.</div>
              <textarea value={draft} onChange={(e)=>setDraft(e.target.value)} rows={2} placeholder="I am…" style={{ width: "100%", border: `1px solid ${P.line}`, borderRadius: 12, padding: 12, fontFamily: font.serif, fontSize: 17, resize: "none", color: P.ink, background: P.cream }} />
              <SoftButton primary onClick={submit} style={{ width: "100%", marginTop: 10 }}>Add my affirmation</SoftButton>
            </div>
            {myAff.length === 0 ? (
              <EmptyNote>Your own affirmations will live here. Add the first one above.</EmptyNote>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {myAff.map((a) => (
                  <div key={a.id} style={{ background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: 20, boxShadow: softer }}>
                    <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                      <Quote size={22} color={P.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                      <div style={{ flex: 1, fontFamily: font.serif, fontWeight: 500, fontSize: 20, lineHeight: 1.45 }}>{a.text}</div>
                    </div>
                    <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                      <button onClick={() => onShare({ kind: "affirmation", label: "my affirmation", text: a.text })} style={miniBtn}><Share2 size={14} /> Share as card</button>
                      <button onClick={() => onDelAff(a.id)} style={miniBtn}><Trash2 size={14} /> Remove</button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {AFFIRMATIONS[cat].map((a, i) => (
              <div key={i} style={{ background: P.card, border: `1px solid ${P.line}`, borderRadius: 20, padding: 20, boxShadow: softer }}>
                <div style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                  <Quote size={22} color={P.accent} style={{ flexShrink: 0, marginTop: 4 }} />
                  <div style={{ fontFamily: font.serif, fontWeight: 500, fontSize: 20, lineHeight: 1.45 }}>{a}</div>
                </div>
                <button onClick={() => onShare({ kind: "affirmation", label: "today's affirmation", text: a })} style={{ ...miniBtn, marginTop: 12 }}><Share2 size={14} /> Share as card</button>
              </div>
            ))}
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ============================ TODAY'S LIST ============================ */
function TodoView({ todos, addTodo, toggleTodo, delTodo, onBack }) {
  const [text, setText] = useState("");
  const doneCount = todos.filter(t => t.done).length;
  const allDone = todos.length > 0 && doneCount === todos.length;
  const submit = () => { if (text.trim()) { addTodo(text.trim()); setText(""); } };
  return (
    <div>
      <TopBar title="Today's list" onBack={onBack} />
      <div style={{ padding: "0 20px" }}>
        <p style={{ color: P.inkSoft, fontSize: 14, marginTop: 0 }}>A few things to tend to today. Check them off as you go — leaving some unfinished is completely okay.</p>
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input value={text} onChange={(e)=>setText(e.target.value)} onKeyDown={(e)=>e.key==="Enter"&&submit()} placeholder="Add something for today…" style={{ flex: 1, border: `1px solid ${P.line}`, borderRadius: 14, padding: "12px 14px", fontSize: 15, color: P.ink, background: P.card, boxShadow: softer }} />
          <button onClick={submit} style={{ border: "none", cursor: "pointer", background: P.accent, color: "#fff", borderRadius: 14, width: 48, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 6px 16px rgba(120,70,40,0.28)" }}><Plus size={22} /></button>
        </div>
        {todos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 999, background: P.cream, overflow: "hidden" }}><div style={{ width: `${(doneCount/todos.length)*100}%`, height: "100%", background: `linear-gradient(90deg, ${P.accent}, ${P.sun})`, transition: "width .4s" }} /></div>
            <span style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 14, color: P.inkSoft }}>{doneCount} of {todos.length}</span>
          </div>
        )}
        {allDone && <div style={{ background: `linear-gradient(120deg, ${P.sun}22, ${P.accentSoft})`, borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 10, marginBottom: 16, fontFamily: font.serif, fontWeight: 600, color: P.accentDeep }}><Flower2 size={22} color={P.accent} /> Everything tended to. Rest easy — you showed up today.</div>}
        {todos.length === 0 ? <EmptyNote>Your list is clear. Add a task above, or simply enjoy the open space.</EmptyNote> : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todos.map(t => (
              <div key={t.id} style={{ background: P.card, borderRadius: 16, padding: "14px 16px", boxShadow: softer, border: `1px solid ${P.line}`, display: "flex", alignItems: "center", gap: 12 }}>
                <button onClick={() => toggleTodo(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>{t.done ? <CheckCircle2 size={26} color={P.accent} /> : <Circle size={26} color={P.line} />}</button>
                <span style={{ flex: 1, fontSize: 16, color: t.done ? P.inkSoft : P.ink, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1 }}>{t.text}</span>
                <button onClick={() => delTodo(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: P.line }}><Trash2 size={18} /></button>
              </div>
            ))}
          </div>
        )}
        <div style={{ marginTop: 16, textAlign: "center", color: P.inkSoft, fontSize: 12 }}>Unfinished tasks aren't failures — they're just tomorrow's gentle starting point.</div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ============================ MONTHLY RECAP ============================ */
function RecapModal({ gratitude, appreciation, videos, onClose, onShare }) {
  const now = new Date(); const y = now.getFullYear(); const m = now.getMonth();
  const inMonth = (arr) => arr.filter(e => { const d = new Date(e.date); return d.getFullYear()===y && d.getMonth()===m; });
  const g = inMonth(gratitude); const a = inMonth(appreciation); const v = inMonth(videos);
  return (
    <Modal onClose={onClose}>
      <div style={{ textAlign: "center", marginBottom: 4 }}>
        <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase", color: P.accentDeep }}>Your month, gathered</div>
        <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 26, margin: "6px 0 2px" }}>{MONTHS[m]} {y}</h3>
      </div>
      <div style={{ display: "flex", gap: 8, margin: "14px 0 18px" }}>
        {[["Gratitudes", g.length],["Appreciations", a.length],["Joy clips", v.length]].map(([l,n]) => (
          <div key={l} style={{ flex: 1, background: P.accentSoft, borderRadius: 16, padding: "12px 8px", textAlign: "center" }}>
            <div style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 24, color: P.accentDeep }}>{n}</div>
            <div style={{ fontSize: 11, color: P.accentDeep, fontFamily: font.ui, fontWeight: 700 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: font.ui, fontWeight: 800, fontSize: 12, letterSpacing: 1, textTransform: "uppercase", color: P.inkSoft, marginBottom: 8 }}>Everything you were grateful for</div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, maxHeight: 220, overflowY: "auto" }}>
        {[...g, ...a].filter(e => e.type === "text").map(e => (
          <div key={e.id} style={{ background: P.card, border: `1px solid ${P.line}`, borderRadius: 14, padding: "12px 14px", fontFamily: font.serif, fontSize: 16, lineHeight: 1.45 }}>"{e.content}"</div>
        ))}
        {g.length + a.length === 0 && <EmptyNote>This month is still a blank page — a lovely thing to fill.</EmptyNote>}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 18 }}>
        <SoftButton primary onClick={() => onShare({ kind: "recap", label: `${MONTHS[m]} in gratitude`, text: `${g.length} gratitudes, ${a.length} appreciations, ${v.length} joyful moments — and counting.` })} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Share2 size={16} /> Share my month</SoftButton>
        <SoftButton ghost onClick={onClose}>Close</SoftButton>
      </div>
    </Modal>
  );
}

/* ============================ SHAREABLE CARD (export as image) ============================ */
function ShareCardModal({ item, theme, onClose }) {
  const canvasRef = useRef(null);
  const t = THEMES[theme];
  useEffect(() => {
    const c = canvasRef.current; if (!c) return;
    const ctx = c.getContext("2d"); const W = 1080, H = 1350; c.width = W; c.height = H;
    const grad = ctx.createLinearGradient(0, 0, W, H);
    grad.addColorStop(0, t.accentSoft); grad.addColorStop(1, BASE.card);
    ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
    // inner frame
    ctx.strokeStyle = t.accent + "55"; ctx.lineWidth = 3;
    ctx.strokeRect(70, 70, W-140, H-140);
    ctx.textAlign = "center";
    // brand
    ctx.fillStyle = t.accentDeep; ctx.font = "600 44px Fraunces, Georgia, serif";
    ctx.fillText("Bloom", W/2, 190);
    ctx.fillStyle = BASE.inkSoft; ctx.font = "italic 28px Fraunces, Georgia, serif";
    ctx.fillText("meet the happy you", W/2, 235);
    // kicker
    ctx.fillStyle = t.accent; ctx.font = "800 30px Nunito, sans-serif";
    ctx.fillText((item.label || "").toUpperCase(), W/2, 470);
    // body
    ctx.fillStyle = BASE.ink; ctx.font = "600 60px Fraunces, Georgia, serif";
    wrapText(ctx, `"${item.text}"`, W/2, H/2 + 30, W - 260, 82);
    // footer
    ctx.fillStyle = BASE.inkSoft; ctx.font = "700 26px Nunito, sans-serif";
    ctx.fillText(new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }), W/2, H - 150);
  }, [item, theme]);

  const download = () => {
    const c = canvasRef.current; if (!c) return;
    c.toBlob((blob) => {
      const url = URL.createObjectURL(blob); const a = document.createElement("a");
      a.href = url; a.download = "bloom-card.png"; a.click(); URL.revokeObjectURL(url);
    });
  };
  return (
    <Modal onClose={onClose}>
      <h3 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 22, margin: "0 0 4px" }}>A card to share</h3>
      <p style={{ color: P.inkSoft, fontSize: 13, marginTop: 0 }}>Lovely on a Story — or just for you.</p>
      <div style={{ borderRadius: 18, overflow: "hidden", boxShadow: soft, border: `1px solid ${P.line}` }}>
        <canvas ref={canvasRef} style={{ width: "100%", display: "block" }} />
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
        <SoftButton primary onClick={download} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}><Download size={16} /> Save image</SoftButton>
        <SoftButton ghost onClick={onClose}>Close</SoftButton>
      </div>
    </Modal>
  );
}
function wrapText(ctx, text, x, y, maxWidth, lineHeight) {
  const words = text.split(" "); let line = ""; const lines = [];
  for (const w of words) { const test = line ? line + " " + w : w; if (ctx.measureText(test).width > maxWidth && line) { lines.push(line); line = w; } else line = test; }
  if (line) lines.push(line);
  let yy = y - (lines.length * lineHeight) / 2 + lineHeight / 2;
  for (const l of lines) { ctx.fillText(l, x, yy); yy += lineHeight; }
}

/* ============================ shared chrome ============================ */
function TopBar({ title, onBack }) {
  return (
    <div style={{ padding: "22px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onBack} style={{ width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer", background: P.card, boxShadow: softer, display: "flex", alignItems: "center", justifyContent: "center" }}><ArrowLeft size={20} color={P.ink} /></button>
      <h2 style={{ fontFamily: font.serif, fontWeight: 600, fontSize: 26, margin: 0, color: P.accentDeep, letterSpacing: -0.3 }}>{title}</h2>
    </div>
  );
}
function Modal({ children, onClose, dim }) {
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: dim ? "rgba(59,50,42,0.6)" : "rgba(59,50,42,0.42)", display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 80, animation: "floatIn .25s ease both" }}>
      <div onClick={(e)=>e.stopPropagation()} style={{ background: P.cream, borderRadius: 26, padding: 22, maxWidth: 400, width: "100%", maxHeight: "88vh", overflowY: "auto", boxShadow: "0 24px 70px rgba(0,0,0,0.28)", position: "relative" }}>
        <button onClick={onClose} style={{ position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 10, border: "none", cursor: "pointer", background: P.card, boxShadow: softer, display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2 }}><X size={18} color={P.ink} /></button>
        {children}
      </div>
    </div>
  );
}

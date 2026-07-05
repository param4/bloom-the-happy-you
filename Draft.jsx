import React, { useState, useRef, useEffect } from "react";
import {
  Heart, Sparkles, Sun, Video, PenLine, Flower2, Calendar,
  ChevronRight, ChevronLeft, Plus, X, Camera, Star, Smile,
  CloudRain, Meh, Bell, ArrowLeft, Check, Lock, Share2, Play,
  Trash2, Quote, Home as HomeIcon, Wand2, ListChecks, Circle, CheckCircle2,
  Mail, User, LogOut
} from "lucide-react";

/* ---------------------------------------------------------------------------
   "Meet the happy you"  (working title: Bloom)
   A gentle, guilt-free daily wellbeing app — a warm prototype.
   Palette chosen with color theory for mood upliftment:
   soft sage (calm, growth), warm cream (space, warmth),
   gentle lavender (soothing), warm peach/coral (delight, encouragement).
--------------------------------------------------------------------------- */

const P = {
  cream: "#FBF7F0",
  creamDeep: "#F3ECDF",
  card: "#FFFFFF",
  sage: "#9DBE93",
  sageLight: "#DEE9D6",
  sageDeep: "#6E8C63",
  lav: "#C7BAE4",
  lavLight: "#EBE5F7",
  lavDeep: "#8E7DB6",
  peach: "#F0A184",
  peachDeep: "#E5875F",
  sun: "#F4C978",
  ink: "#3E3A35",
  inkSoft: "#7A736A",
  line: "#EAE2D6",
};

const soft = "0 8px 24px rgba(120,110,95,0.10)";
const softer = "0 4px 14px rgba(120,110,95,0.08)";

const font = {
  display: "'Quicksand', ui-rounded, 'Segoe UI', system-ui, sans-serif",
  body: "'Nunito', ui-rounded, 'Segoe UI', system-ui, sans-serif",
};

/* ---------- date helpers ---------- */
const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d;
};
const iso = (d) => d.toISOString().slice(0, 10);
const fmtDay = (d) =>
  d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });
const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];

/* ---------- seed data so the archive + resurfacing feel alive ---------- */
const seedEntries = (kind) => {
  const g = [
    "the smell of rain this morning and my warm cup of chai",
    "my sister called just to check on me — it made my whole day",
    "a slow, unhurried breakfast with nowhere to be",
    "finishing something I'd been putting off for weeks",
  ];
  const a = [
    "my mum, for her endless patience with me",
    "my own body, for carrying me through a long day",
    "the friend who always texts back, even at midnight",
    "myself, for choosing rest instead of pushing through",
  ];
  const src = kind === "gratitude" ? g : a;
  return [
    { id: kind + "1", date: iso(daysAgo(1)), type: "text", content: src[0], joyful: true },
    { id: kind + "2", date: iso(daysAgo(2)), type: "text", content: src[1], joyful: true },
    { id: kind + "3", date: iso(daysAgo(5)), type: "text", content: src[2], joyful: false },
    { id: kind + "4", date: iso(daysAgo(41)), type: "text", content: src[3], joyful: true },
    { id: kind + "5", date: iso(daysAgo(73)), type: "text", content: src[0], joyful: false },
  ];
};

const seedVideos = [
  { id: "v1", date: iso(daysAgo(3)), label: "The day I got the news", mood: "joyful", shared: false, color: P.peach },
  { id: "v2", date: iso(daysAgo(9)), label: "Sunset at the lake", mood: "content", shared: false, color: P.sage },
  { id: "v3", date: iso(daysAgo(30)), label: "Dancing in the kitchen", mood: "joyful", shared: false, color: P.lav },
];

const seedManifest = [
  { id: "m1", title: "My calm, light-filled home", affirmation: "I am waking up in my own peaceful home, full of light and plants.", why: "A space that feels like exhale.", achieved: false, hue: P.sageLight },
  { id: "m2", title: "Mornings that feel like mine", affirmation: "I am moving my body every morning and it feels joyful, not forced.", why: "I want to greet the day gently.", achieved: false, hue: P.lavLight },
  { id: "m3", title: "Work that lights me up", affirmation: "I am doing work that feels meaningful and pays me well.", why: "Proof it can happen.", achieved: true, hue: P.creamDeep },
];

const seedTodos = [
  { id: "t1", text: "Drink a full glass of water before coffee", done: true },
  { id: "t2", text: "Step outside for 10 minutes of sun", done: false },
  { id: "t3", text: "Send the message I keep putting off", done: false },
  { id: "t4", text: "Tidy one small corner of the room", done: false },
];

const AFFIRMATIONS = {
  "Self-worth": [
    "I am enough exactly as I am today.",
    "My worth is not measured by what I produce.",
    "I belong here, and my presence matters.",
  ],
  "Anxiety": [
    "This feeling is a wave. I can let it rise and pass.",
    "I am safe in this moment, breathing, right now.",
    "I don't have to solve everything today.",
  ],
  "Self-forgiveness": [
    "I did the best I could with what I knew then.",
    "I release the weight I've been carrying for myself.",
    "Being human means being imperfect — and that's okay.",
  ],
  "Confidence": [
    "I trust myself to handle what comes.",
    "I have made it through hard days before.",
    "My voice deserves to be heard.",
  ],
  "Calm": [
    "I let my shoulders soften and my jaw unclench.",
    "There is nowhere I need to rush to right now.",
    "I invite ease into this moment.",
  ],
};

const MOODS = [
  { key: "joyful", label: "Joyful", Icon: Sun, tone: P.sun },
  { key: "content", label: "Content", Icon: Smile, tone: P.sage },
  { key: "okay", label: "Okay", Icon: Meh, tone: P.lav },
  { key: "low", label: "Low", Icon: CloudRain, tone: P.lavDeep },
];

/* ============================ small UI atoms ============================ */
function Pill({ children, bg, color }) {
  return (
    <span style={{
      background: bg, color, fontFamily: font.body, fontSize: 12, fontWeight: 700,
      padding: "4px 10px", borderRadius: 999, letterSpacing: 0.2,
    }}>{children}</span>
  );
}

function SoftButton({ children, onClick, primary, style }) {
  return (
    <button onClick={onClick} style={{
      fontFamily: font.display, fontWeight: 700, fontSize: 15,
      border: "none", cursor: "pointer",
      padding: "12px 20px", borderRadius: 16,
      background: primary ? P.peach : P.card,
      color: primary ? "#fff" : P.ink,
      boxShadow: primary ? "0 6px 16px rgba(229,135,95,0.35)" : softer,
      transition: "transform .15s ease, box-shadow .15s ease",
      ...style,
    }}
      onMouseDown={(e) => (e.currentTarget.style.transform = "scale(0.97)")}
      onMouseUp={(e) => (e.currentTarget.style.transform = "scale(1)")}
      onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
    >{children}</button>
  );
}

function Bloom({ size = 26, color = P.peach }) {
  // signature motif: a soft blooming flower
  return <Flower2 size={size} color={color} strokeWidth={2} />;
}

/* ============================ the app ============================ */
export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState("home");
  const [pillar, setPillar] = useState("gratitude");
  const [gratitude, setGratitude] = useState(seedEntries("gratitude"));
  const [appreciation, setAppreciation] = useState(seedEntries("appreciation"));
  const [videos, setVideos] = useState(seedVideos);
  const [manifest, setManifest] = useState(seedManifest);
  const [todos, setTodos] = useState(seedTodos.map((t) => ({ ...t, date: iso(new Date()) })));
  const [moodToday, setMoodToday] = useState(null);
  const [streak, setStreak] = useState(12);
  const [grace, setGrace] = useState(2);
  const [reminder, setReminder] = useState("08:00");
  const [resurface, setResurface] = useState(null);   // item to show in the lift-up modal
  const [moment, setMoment] = useState(null);          // manifestation moment card
  const [toast, setToast] = useState(null);

  const flash = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2200); };
  const signOut = () => { setUser(null); setView("home"); };

  const pillarData = pillar === "gratitude" ? gratitude : appreciation;
  const setPillarData = pillar === "gratitude" ? setGratitude : setAppreciation;

  const addEntry = (entry) => {
    setPillarData((prev) => [{ ...entry, id: Date.now() + "", date: iso(new Date()) }, ...prev]);
    setStreak((s) => s + (hasToday(pillarData) ? 0 : 1));
    flash("Saved. A little more of you, kept safe.");
  };
  const hasToday = (arr) => arr.some((e) => e.date === iso(new Date()));

  const liftMeUp = () => {
    const happy = [...videos.filter(v => v.mood === "joyful"),
      ...gratitude.filter(e => e.joyful), ...appreciation.filter(e => e.joyful)];
    if (!happy.length) return;
    setResurface(happy[Math.floor(Math.random() * happy.length)]);
  };

  const pickMood = (m) => {
    setMoodToday(m);
    if (m === "low" || m === "okay") setTimeout(liftMeUp, 450);
  };

  const addTodo = (text) => setTodos((p) => [...p, { id: Date.now() + "", text, done: false, date: iso(new Date()) }]);
  const toggleTodo = (id) => setTodos((p) => p.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  const delTodo = (id) => setTodos((p) => p.filter((t) => t.id !== id));

  const openMoment = () => {
    const active = manifest.filter(m => !m.achieved);
    if (active.length) setMoment(active[Math.floor(Math.random() * active.length)]);
  };

  return (
    <div style={{ minHeight: "100vh", background: P.cream, fontFamily: font.body, color: P.ink }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Quicksand:wght@500;600;700&family=Nunito:ital,wght@0,400;0,600;0,700;1,400&display=swap');
        * { box-sizing: border-box; }
        ::-webkit-scrollbar { width: 8px; height: 8px; }
        ::-webkit-scrollbar-thumb { background: ${P.line}; border-radius: 999px; }
        @keyframes floatIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: none; } }
        @keyframes glow { 0%,100% { box-shadow: 0 0 0 rgba(244,201,120,0.0);} 50% { box-shadow: 0 0 46px rgba(244,201,120,0.55);} }
        @keyframes petal { from { transform: scale(.6) rotate(-8deg); opacity: 0;} to { transform: none; opacity: 1;} }
        .floatIn { animation: floatIn .5s ease both; }
        button:focus-visible, [tabindex]:focus-visible { outline: 3px solid ${P.lavDeep}; outline-offset: 2px; }
      `}</style>

      {!user ? (
        <AuthView onAuth={setUser} />
      ) : (
      <>
      <div style={{ maxWidth: 460, margin: "0 auto", padding: "0 0 96px", position: "relative" }}>
        {view === "home" && (
          <HomeView {...{ moodToday, pickMood, streak, grace, setView, setPillar, openMoment, liftMeUp,
            gratitude, appreciation, todos, toggleTodo, user, onSignOut: signOut }} />
        )}
        {view === "todo" && (
          <TodoView {...{ todos, addTodo, toggleTodo, delTodo, onBack: () => setView("home") }} />
        )}
        {view === "pillar" && (
          <PillarView kind={pillar} data={pillarData} onAdd={addEntry} onBack={() => setView("home")} />
        )}
        {view === "vision" && (
          <VisionView {...{ manifest, setManifest, reminder, setReminder, openMoment, onBack: () => setView("home"), flash }} />
        )}
        {view === "booth" && (
          <BoothView {...{ videos, setVideos, onBack: () => setView("home"), flash }} />
        )}
        {view === "library" && (
          <LibraryView onBack={() => setView("home")} />
        )}
      </div>

      {/* bottom navigation */}
      <nav style={{
        position: "fixed", bottom: 0, left: 0, right: 0, background: "rgba(255,255,255,0.92)",
        backdropFilter: "blur(8px)", borderTop: `1px solid ${P.line}`, display: "flex",
        justifyContent: "center", gap: 6, padding: "8px 8px calc(8px + env(safe-area-inset-bottom))",
      }}>
        {[
          { k: "home", label: "Home", Icon: HomeIcon },
          { k: "todo", label: "Today", Icon: ListChecks },
          { k: "vision", label: "Vision", Icon: Sparkles },
          { k: "booth", label: "Booth", Icon: Video },
          { k: "library", label: "Affirm", Icon: Quote },
        ].map(({ k, label, Icon }) => {
          const on = view === k || (k === "home" && view === "pillar");
          return (
            <button key={k} onClick={() => setView(k)} style={{
              flex: 1, maxWidth: 84, background: "none", border: "none", cursor: "pointer",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "6px 4px",
              color: on ? P.peachDeep : P.inkSoft, fontFamily: font.display, fontWeight: 700, fontSize: 11,
            }}>
              <Icon size={22} strokeWidth={on ? 2.4 : 2} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* resurfacing modal — the magic */}
      {resurface && (
        <Modal onClose={() => setResurface(null)}>
          <div style={{ textAlign: "center" }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 13, color: P.lavDeep, letterSpacing: 1, textTransform: "uppercase" }}>
              A little light for right now
            </div>
            <h3 style={{ fontFamily: font.display, fontSize: 22, margin: "6px 0 16px", color: P.ink }}>
              Here's you, {daysBetween(resurface.date)} days ago, feeling good.
            </h3>
            {resurface.label ? (
              <div style={{
                height: 180, borderRadius: 20, background: `linear-gradient(135deg, ${resurface.color}, ${P.cream})`,
                display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column", gap: 8,
                animation: "glow 3s ease-in-out infinite",
              }}>
                <Play size={40} color="#fff" fill="#fff" />
                <span style={{ color: "#fff", fontFamily: font.display, fontWeight: 700 }}>{resurface.label}</span>
              </div>
            ) : (
              <p style={{ fontSize: 18, lineHeight: 1.6, background: P.sageLight, padding: 20, borderRadius: 20, fontStyle: "italic" }}>
                "{resurface.content}"
              </p>
            )}
            <p style={{ color: P.inkSoft, marginTop: 16, fontSize: 15 }}>
              That happy you is still in there. Be gentle with yourself today.
            </p>
            <SoftButton primary onClick={() => setResurface(null)} style={{ marginTop: 18 }}>Thank you</SoftButton>
          </div>
        </Modal>
      )}

      {/* manifestation moment */}
      {moment && (
        <Modal onClose={() => setMoment(null)} dim>
          <div style={{ textAlign: "center", animation: "petal .6s ease both" }}>
            <div style={{
              height: 190, borderRadius: 22, background: `linear-gradient(160deg, ${moment.hue}, #fff)`,
              display: "flex", alignItems: "center", justifyContent: "center",
              animation: "glow 3.5s ease-in-out infinite", marginBottom: 18,
            }}>
              <Sparkles size={44} color={P.peachDeep} />
            </div>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 12, color: P.peachDeep, letterSpacing: 1, textTransform: "uppercase" }}>
              Your manifestation moment
            </div>
            <p style={{ fontFamily: font.display, fontSize: 22, lineHeight: 1.4, margin: "10px 0 6px" }}>
              {moment.affirmation}
            </p>
            <p style={{ color: P.inkSoft, fontSize: 14 }}>Breathe. Read it aloud. Let it feel true.</p>
            <SoftButton primary onClick={() => setMoment(null)} style={{ marginTop: 18 }}>I feel it</SoftButton>
          </div>
        </Modal>
      )}

      {toast && (
        <div style={{
          position: "fixed", bottom: 92, left: "50%", transform: "translateX(-50%)",
          background: P.ink, color: "#fff", padding: "12px 20px", borderRadius: 999,
          fontFamily: font.body, fontWeight: 600, fontSize: 14, boxShadow: soft, zIndex: 60,
          animation: "floatIn .3s ease both", maxWidth: "88%", textAlign: "center",
        }}>{toast}</div>
      )}
      </>
      )}
    </div>
  );
}

function daysBetween(isoDate) {
  const d = new Date(isoDate);
  return Math.max(1, Math.round((Date.now() - d.getTime()) / 86400000));
}

/* ============================ AUTH / WELCOME ============================ */
function AuthView({ onAuth }) {
  const [mode, setMode] = useState("signup"); // signup | login
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [err, setErr] = useState("");

  const submit = () => {
    if (mode === "signup" && !name.trim()) return setErr("What should we call you?");
    if (!email.trim() || !email.includes("@")) return setErr("A valid email, please.");
    if (pass.length < 4) return setErr("A password of at least 4 characters.");
    const derived = name.trim() || email.split("@")[0];
    onAuth({ name: derived, email: email.trim() });
  };
  const social = (provider) => onAuth({ name: provider + " friend", email: `you@${provider.toLowerCase()}.com` });
  const guest = () => onAuth({ name: "friend", email: "" });

  return (
    <div className="floatIn" style={{ maxWidth: 420, margin: "0 auto", padding: "44px 24px 40px", minHeight: "100vh", display: "flex", flexDirection: "column", justifyContent: "center" }}>
      {/* hero */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{
          width: 76, height: 76, borderRadius: 24, margin: "0 auto 16px",
          background: `linear-gradient(140deg, ${P.sageLight}, ${P.lavLight})`,
          display: "flex", alignItems: "center", justifyContent: "center", boxShadow: soft,
        }}>
          <Flower2 size={40} color={P.peach} />
        </div>
        <h1 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 34, margin: 0 }}>Bloom</h1>
        <p style={{ fontFamily: font.body, fontStyle: "italic", color: P.inkSoft, margin: "4px 0 0", fontSize: 16 }}>Meet the happy you</p>
      </div>

      {/* card */}
      <div style={{ background: P.card, borderRadius: 26, padding: 22, boxShadow: soft }}>
        {/* mode toggle */}
        <div style={{ display: "flex", background: P.cream, borderRadius: 14, padding: 4, marginBottom: 18 }}>
          {[["signup", "Create account"], ["login", "Log in"]].map(([k, label]) => (
            <button key={k} onClick={() => { setMode(k); setErr(""); }} style={{
              flex: 1, border: "none", cursor: "pointer", borderRadius: 11, padding: "10px",
              fontFamily: font.display, fontWeight: 700, fontSize: 14,
              background: mode === k ? "#fff" : "transparent", color: mode === k ? P.ink : P.inkSoft,
              boxShadow: mode === k ? softer : "none",
            }}>{label}</button>
          ))}
        </div>

        {mode === "signup" && (
          <AuthField Icon={User} placeholder="Your name" value={name} onChange={setName} />
        )}
        <AuthField Icon={Mail} placeholder="Email" value={email} onChange={setEmail} type="email" />
        <AuthField Icon={Lock} placeholder="Password" value={pass} onChange={setPass} type="password" />

        {err && <div style={{ color: P.peachDeep, fontSize: 13, margin: "2px 2px 12px", fontWeight: 600 }}>{err}</div>}

        <SoftButton primary onClick={submit} style={{ width: "100%", marginTop: 4 }}>
          {mode === "signup" ? "Begin" : "Welcome back"}
        </SoftButton>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, margin: "18px 0" }}>
          <div style={{ flex: 1, height: 1, background: P.line }} />
          <span style={{ color: P.inkSoft, fontSize: 12, fontFamily: font.display, fontWeight: 700 }}>or</span>
          <div style={{ flex: 1, height: 1, background: P.line }} />
        </div>

        {["Google", "Apple"].map((prov) => (
          <button key={prov} onClick={() => social(prov)} style={{
            width: "100%", border: `1px solid ${P.line}`, background: P.card, cursor: "pointer",
            borderRadius: 14, padding: "12px", marginBottom: 10, fontFamily: font.display, fontWeight: 700,
            fontSize: 14, color: P.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
          }}>
            <span style={{ width: 20, height: 20, borderRadius: 6, background: prov === "Google" ? "#fff" : P.ink, border: prov === "Google" ? `1px solid ${P.line}` : "none", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 800, color: prov === "Google" ? P.peachDeep : "#fff" }}>{prov[0]}</span>
            Continue with {prov}
          </button>
        ))}

        <button onClick={guest} style={{
          width: "100%", background: "none", border: "none", cursor: "pointer", marginTop: 6,
          color: P.lavDeep, fontFamily: font.display, fontWeight: 700, fontSize: 14,
        }}>
          Explore as a guest
        </button>
      </div>

      <p style={{ textAlign: "center", color: P.inkSoft, fontSize: 11.5, marginTop: 18, lineHeight: 1.5 }}>
        Preview sign-in. Your real, secure account and saved entries arrive with the full app.
      </p>
    </div>
  );
}

function AuthField({ Icon, placeholder, value, onChange, type = "text" }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10, background: P.cream, border: `1px solid ${P.line}`, borderRadius: 14, padding: "12px 14px", marginBottom: 12 }}>
      <Icon size={18} color={P.inkSoft} />
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} type={type} style={{
        flex: 1, border: "none", outline: "none", background: "transparent", fontFamily: font.body, fontSize: 15, color: P.ink,
      }} />
    </div>
  );
}

/* ============================ HOME ============================ */
function HomeView({ moodToday, pickMood, streak, grace, setView, setPillar, openMoment, liftMeUp, gratitude, appreciation, todos, toggleTodo, user, onSignOut }) {
  const [menu, setMenu] = useState(false);
  const doneCount = todos.filter((t) => t.done).length;
  const firstName = (user?.name || "friend").split(" ")[0];
  const hour = new Date().getHours();
  const greet = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  const openPillar = (k) => { setPillar(k); setView("pillar"); };

  const pillars = [
    { k: "gratitude", title: "Gratitude", sub: "What I received today", Icon: Heart, bg: P.sageLight, ic: P.sageDeep, count: gratitude.length },
    { k: "appreciation", title: "Appreciation", sub: "Who or what I value", Icon: Sun, bg: "#FCEFD8", ic: P.peachDeep, count: appreciation.length },
    { k: "vision", title: "Manifestation", sub: "What I'm reaching toward", Icon: Sparkles, bg: P.lavLight, ic: P.lavDeep, count: null },
  ];

  return (
    <div className="floatIn" style={{ padding: "26px 20px 0" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <Bloom size={30} />
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 20, lineHeight: 1 }}>Bloom</div>
          <div style={{ fontFamily: font.body, fontSize: 12, color: P.inkSoft, fontStyle: "italic" }}>Meet the happy you</div>
        </div>
        <div style={{ position: "relative" }}>
          <button onClick={() => setMenu((m) => !m)} aria-label="Your profile" style={{
            width: 42, height: 42, borderRadius: 999, border: "none", cursor: "pointer",
            background: `linear-gradient(135deg, ${P.peach}, ${P.sun})`, color: "#fff",
            fontFamily: font.display, fontWeight: 700, fontSize: 17, boxShadow: softer,
          }}>{firstName[0]?.toUpperCase()}</button>
          {menu && (
            <div style={{
              position: "absolute", right: 0, top: 50, background: "#fff", borderRadius: 16, padding: 14,
              boxShadow: soft, width: 220, zIndex: 30, border: `1px solid ${P.line}`,
            }}>
              <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15 }}>{user?.name || "Guest"}</div>
              <div style={{ color: P.inkSoft, fontSize: 12, marginBottom: 12, wordBreak: "break-all" }}>{user?.email || "Exploring as a guest"}</div>
              <button onClick={onSignOut} style={{
                width: "100%", border: `1px solid ${P.line}`, background: P.cream, cursor: "pointer",
                borderRadius: 12, padding: "9px", fontFamily: font.display, fontWeight: 700, fontSize: 13,
                color: P.ink, display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}>
                <LogOut size={16} /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>

      <h1 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 27, margin: "22px 0 4px" }}>{greet}, {firstName}.</h1>
      <p style={{ color: P.inkSoft, margin: 0, fontSize: 15 }}>Two quiet minutes for yourself. No pressure, ever.</p>

      {/* kind streak */}
      <div style={{
        marginTop: 18, background: P.card, borderRadius: 20, padding: "16px 18px", boxShadow: softer,
        display: "flex", alignItems: "center", gap: 14,
      }}>
        <div style={{ position: "relative" }}>
          <Flower2 size={38} color={P.peach} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17 }}>{streak} days of showing up</div>
          <div style={{ color: P.inkSoft, fontSize: 13 }}>{grace} grace days in your pocket — miss a day, nothing breaks.</div>
        </div>
      </div>

      {/* mood check-in */}
      <div style={{ marginTop: 18 }}>
        <SectionLabel>How are you, honestly?</SectionLabel>
        <div style={{ display: "flex", gap: 10 }}>
          {MOODS.map(({ key, label, Icon, tone }) => {
            const on = moodToday === key;
            return (
              <button key={key} onClick={() => pickMood(key)} style={{
                flex: 1, border: on ? `2px solid ${tone}` : `2px solid transparent`,
                background: on ? "#fff" : P.card, borderRadius: 18, padding: "14px 6px", cursor: "pointer",
                boxShadow: softer, display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
              }}>
                <Icon size={24} color={tone} />
                <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 12 }}>{label}</span>
              </button>
            );
          })}
        </div>
        {(moodToday === "low" || moodToday === "okay") && (
          <button onClick={liftMeUp} style={{
            marginTop: 12, width: "100%", border: "none", cursor: "pointer",
            background: `linear-gradient(120deg, ${P.lavLight}, ${P.sageLight})`,
            borderRadius: 16, padding: "14px", fontFamily: font.display, fontWeight: 700, color: P.lavDeep,
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            <Sparkles size={18} /> Show me a happier moment
          </button>
        )}
      </div>

      {/* three pillars */}
      <div style={{ marginTop: 22 }}>
        <SectionLabel>Today's three pillars</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {pillars.map(({ k, title, sub, Icon, bg, ic, count }) => (
            <button key={k} onClick={() => (k === "vision" ? setView("vision") : openPillar(k))} style={{
              textAlign: "left", border: "none", cursor: "pointer", background: P.card,
              borderRadius: 22, padding: 16, boxShadow: softer, display: "flex", alignItems: "center", gap: 14,
            }}>
              <div style={{ width: 54, height: 54, borderRadius: 16, background: bg, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <Icon size={26} color={ic} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18 }}>{title}</div>
                <div style={{ color: P.inkSoft, fontSize: 13 }}>{sub}</div>
              </div>
              <ChevronRight size={22} color={P.inkSoft} />
            </button>
          ))}
        </div>
      </div>

      {/* today's list */}
      <div style={{ marginTop: 22 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
          <SectionLabel>Today's list</SectionLabel>
          <button onClick={() => setView("todo")} style={{
            background: "none", border: "none", cursor: "pointer", color: P.lavDeep,
            fontFamily: font.display, fontWeight: 700, fontSize: 12,
          }}>Open list</button>
        </div>
        <div style={{ background: P.card, borderRadius: 20, padding: 16, boxShadow: softer }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
            <div style={{ flex: 1, height: 8, borderRadius: 999, background: P.creamDeep, overflow: "hidden" }}>
              <div style={{ width: `${todos.length ? (doneCount / todos.length) * 100 : 0}%`, height: "100%", background: P.sage, transition: "width .4s ease" }} />
            </div>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 13, color: P.inkSoft }}>{doneCount}/{todos.length}</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            {todos.slice(0, 4).map((t) => (
              <button key={t.id} onClick={() => toggleTodo(t.id)} style={{
                display: "flex", alignItems: "center", gap: 10, background: "none", border: "none",
                cursor: "pointer", padding: "6px 0", textAlign: "left",
              }}>
                {t.done ? <CheckCircle2 size={22} color={P.sage} /> : <Circle size={22} color={P.line} />}
                <span style={{ fontSize: 15, color: t.done ? P.inkSoft : P.ink, textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.65 : 1 }}>{t.text}</span>
              </button>
            ))}
          </div>
          {doneCount === todos.length && todos.length > 0 && (
            <div style={{ marginTop: 10, color: P.sageDeep, fontFamily: font.display, fontWeight: 700, fontSize: 13, display: "flex", alignItems: "center", gap: 6 }}>
              <Flower2 size={16} /> All tended to — beautifully done.
            </div>
          )}
        </div>
      </div>

      {/* daily manifestation moment nudge */}
      <button onClick={openMoment} style={{
        marginTop: 16, width: "100%", border: "none", cursor: "pointer",
        background: `linear-gradient(135deg, ${P.peach}, ${P.sun})`,
        borderRadius: 22, padding: "18px", color: "#fff", boxShadow: "0 8px 20px rgba(229,135,95,0.3)",
        display: "flex", alignItems: "center", gap: 12,
      }}>
        <Wand2 size={24} />
        <div style={{ textAlign: "left", flex: 1 }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 16 }}>Your manifestation moment</div>
          <div style={{ fontSize: 13, opacity: 0.95 }}>Pause for 30 seconds with what you're calling in.</div>
        </div>
      </button>

      <div style={{ marginTop: 16, textAlign: "center" }}>
        <button onClick={() => setView("booth")} style={{
          background: "none", border: "none", cursor: "pointer", color: P.lavDeep,
          fontFamily: font.display, fontWeight: 700, fontSize: 14, display: "inline-flex", alignItems: "center", gap: 6,
        }}>
          <Video size={18} /> Capture today in the Joy Booth
        </button>
      </div>
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: font.display, fontWeight: 700, fontSize: 12, letterSpacing: 1,
      textTransform: "uppercase", color: P.inkSoft, marginBottom: 10,
    }}>{children}</div>
  );
}

/* ============================ PILLAR (gratitude / appreciation) ============================ */
function PillarView({ kind, data, onAdd, onBack }) {
  const isG = kind === "gratitude";
  const title = isG ? "Gratitude" : "Appreciation";
  const prompt = isG ? "What did today give you?" : "Who or what do you value right now?";
  const [mode, setMode] = useState(null); // 'write' | 'record'
  const [text, setText] = useState("");
  const [browseYear, setBrowseYear] = useState(null);
  const [browseMonth, setBrowseMonth] = useState(null);

  const todayIso = iso(new Date());
  const recent = data.filter((e) => daysBetween(e.date) <= 5 || e.date === todayIso)
    .sort((a, b) => (a.date < b.date ? 1 : -1));
  const older = data.filter((e) => !(daysBetween(e.date) <= 5 || e.date === todayIso));

  // archive: group older by year -> month
  const years = {};
  older.forEach((e) => {
    const d = new Date(e.date);
    const y = d.getFullYear(), m = d.getMonth();
    years[y] = years[y] || {};
    years[y][m] = years[y][m] || [];
    years[y][m].push(e);
  });

  const save = () => {
    if (mode === "write" && text.trim()) { onAdd({ type: "text", content: text.trim(), joyful: true }); setText(""); setMode(null); }
    if (mode === "record") { onAdd({ type: "video", content: "A recorded reflection", joyful: true }); setMode(null); }
  };

  return (
    <div className="floatIn">
      <TopBar title={title} onBack={onBack} tint={isG ? P.sageDeep : P.peachDeep} />

      <div style={{ padding: "0 20px" }}>
        {/* today's entry composer */}
        <div style={{ background: P.card, borderRadius: 22, padding: 18, boxShadow: softer }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 18 }}>{prompt}</div>
          <div style={{ color: P.inkSoft, fontSize: 13, marginTop: 2 }}>Write it, or record it — whichever feels easy today.</div>

          {!mode && (
            <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
              <SoftButton onClick={() => setMode("write")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <PenLine size={18} /> Write it
              </SoftButton>
              <SoftButton onClick={() => setMode("record")} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Video size={18} /> Record it
              </SoftButton>
            </div>
          )}

          {mode === "write" && (
            <div style={{ marginTop: 14 }}>
              <textarea value={text} onChange={(e) => setText(e.target.value)} autoFocus
                placeholder="In your own words…" rows={3} style={{
                  width: "100%", border: `1px solid ${P.line}`, borderRadius: 14, padding: 14,
                  fontFamily: font.body, fontSize: 16, resize: "none", color: P.ink, background: P.cream,
                }} />
              <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
                <SoftButton primary onClick={save} style={{ flex: 1 }}>Keep it</SoftButton>
                <SoftButton onClick={() => { setMode(null); setText(""); }}>Cancel</SoftButton>
              </div>
            </div>
          )}

          {mode === "record" && (
            <MiniRecorder onSave={save} onCancel={() => setMode(null)} />
          )}
        </div>

        {/* recent days */}
        <div style={{ marginTop: 24 }}>
          <SectionLabel>The last few days</SectionLabel>
          {recent.length === 0 && <EmptyNote>Nothing here yet — today's a lovely place to start.</EmptyNote>}
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {recent.map((e) => <EntryCard key={e.id} e={e} tint={isG ? P.sage : P.peach} />)}
          </div>
        </div>

        {/* archive */}
        {Object.keys(years).length > 0 && (
          <div style={{ marginTop: 24 }}>
            <SectionLabel>Look back</SectionLabel>
            {!browseYear && Object.keys(years).sort((a, b) => b - a).map((y) => (
              <ArchiveRow key={y} label={y} onClick={() => setBrowseYear(y)} />
            ))}
            {browseYear && browseMonth === null && (
              <>
                <BackRow label={browseYear} onClick={() => setBrowseYear(null)} />
                {Object.keys(years[browseYear]).sort((a, b) => b - a).map((m) => (
                  <ArchiveRow key={m} label={MONTHS[m]} count={years[browseYear][m].length} onClick={() => setBrowseMonth(m)} />
                ))}
              </>
            )}
            {browseYear && browseMonth !== null && (
              <>
                <BackRow label={`${MONTHS[browseMonth]} ${browseYear}`} onClick={() => setBrowseMonth(null)} />
                <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                  {years[browseYear][browseMonth].map((e) => <EntryCard key={e.id} e={e} tint={isG ? P.sage : P.peach} />)}
                </div>
              </>
            )}
          </div>
        )}
        <div style={{ height: 20 }} />
      </div>
    </div>
  );
}

function EntryCard({ e, tint }) {
  return (
    <div style={{ background: P.card, borderRadius: 18, padding: 16, boxShadow: softer, display: "flex", gap: 12 }}>
      <div style={{ width: 40, height: 40, borderRadius: 12, background: tint + "33", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
        {e.type === "video" ? <Play size={18} color={tint} /> : <Quote size={18} color={tint} />}
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 15, lineHeight: 1.5 }}>{e.type === "video" ? "🎬 A recorded reflection" : e.content}</div>
        <div style={{ color: P.inkSoft, fontSize: 12, marginTop: 4, fontFamily: font.display, fontWeight: 700 }}>
          {fmtDay(new Date(e.date))}
        </div>
      </div>
    </div>
  );
}

function ArchiveRow({ label, count, onClick }) {
  return (
    <button onClick={onClick} style={{
      width: "100%", background: P.card, border: "none", cursor: "pointer", borderRadius: 16,
      padding: "14px 16px", marginBottom: 8, boxShadow: softer, display: "flex", alignItems: "center", gap: 12,
    }}>
      <Calendar size={18} color={P.inkSoft} />
      <span style={{ flex: 1, textAlign: "left", fontFamily: font.display, fontWeight: 700, fontSize: 15 }}>{label}</span>
      {count != null && <Pill bg={P.sageLight} color={P.sageDeep}>{count}</Pill>}
      <ChevronRight size={18} color={P.inkSoft} />
    </button>
  );
}
function BackRow({ label, onClick }) {
  return (
    <button onClick={onClick} style={{
      background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 6,
      color: P.lavDeep, fontFamily: font.display, fontWeight: 700, fontSize: 14, marginBottom: 12,
    }}>
      <ChevronLeft size={18} /> {label}
    </button>
  );
}
function EmptyNote({ children }) {
  return <div style={{ color: P.inkSoft, fontSize: 14, padding: "8px 2px" }}>{children}</div>;
}

/* ============================ VISION BOARD (manifestation) ============================ */
function VisionView({ manifest, setManifest, reminder, setReminder, openMoment, onBack, flash }) {
  const [adding, setAdding] = useState(false);
  const [title, setTitle] = useState("");
  const [aff, setAff] = useState("");
  const [why, setWhy] = useState("");
  const [img, setImg] = useState(null);
  const fileRef = useRef(null);

  const active = manifest.filter((m) => !m.achieved);
  const done = manifest.filter((m) => m.achieved);

  const add = () => {
    if (!title.trim() || !aff.trim()) return;
    const hues = [P.sageLight, P.lavLight, P.creamDeep, "#FCEFD8"];
    setManifest((p) => [{ id: Date.now() + "", title: title.trim(), affirmation: aff.trim(), why: why.trim(), achieved: false, hue: hues[p.length % 4], img }, ...p]);
    setTitle(""); setAff(""); setWhy(""); setImg(null); setAdding(false);
    flash("Added to your vision board ✨");
  };
  const markDone = (id) => { setManifest((p) => p.map((m) => m.id === id ? { ...m, achieved: true } : m)); flash("Moved to Manifested ✨"); };

  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (f) setImg(URL.createObjectURL(f));
  };

  return (
    <div className="floatIn">
      <TopBar title="Vision Board" onBack={onBack} tint={P.lavDeep} />
      <div style={{ padding: "0 20px" }}>

        <button onClick={openMoment} style={{
          width: "100%", border: "none", cursor: "pointer", marginBottom: 18,
          background: `linear-gradient(135deg, ${P.lav}, ${P.peach})`, borderRadius: 20, padding: 16,
          color: "#fff", display: "flex", alignItems: "center", gap: 10, boxShadow: soft,
        }}>
          <Wand2 size={22} />
          <span style={{ fontFamily: font.display, fontWeight: 700 }}>Take today's manifestation moment</span>
        </button>

        {/* reminder */}
        <div style={{ background: P.card, borderRadius: 18, padding: 16, boxShadow: softer, display: "flex", alignItems: "center", gap: 12, marginBottom: 20 }}>
          <Bell size={20} color={P.peachDeep} />
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15 }}>Daily reminder</div>
            <div style={{ color: P.inkSoft, fontSize: 12 }}>A gentle nudge to visit your vision.</div>
          </div>
          <input type="time" value={reminder} onChange={(e) => setReminder(e.target.value)} style={{
            border: `1px solid ${P.line}`, borderRadius: 12, padding: "8px 10px", fontFamily: font.body, fontSize: 15, color: P.ink,
          }} />
        </div>

        <SectionLabel>What I'm calling in</SectionLabel>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          {active.map((m) => (
            <div key={m.id} style={{ background: P.card, borderRadius: 20, overflow: "hidden", boxShadow: softer }}>
              <div style={{ height: 92, background: m.img ? `url(${m.img}) center/cover` : `linear-gradient(140deg, ${m.hue}, #fff)`, display: "flex", alignItems: "flex-end", padding: 8 }}>
                {!m.img && <Sparkles size={20} color={P.lavDeep} />}
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 14, lineHeight: 1.25 }}>{m.title}</div>
                <div style={{ color: P.inkSoft, fontSize: 12, marginTop: 6, fontStyle: "italic", lineHeight: 1.4 }}>"{m.affirmation}"</div>
                <button onClick={() => markDone(m.id)} style={{
                  marginTop: 10, width: "100%", border: `1px solid ${P.sage}`, background: P.sageLight, color: P.sageDeep,
                  borderRadius: 10, padding: "7px", cursor: "pointer", fontFamily: font.display, fontWeight: 700, fontSize: 12,
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
                }}>
                  <Check size={14} /> It came true
                </button>
              </div>
            </div>
          ))}
          {/* add card */}
          <button onClick={() => setAdding(true)} style={{
            border: `2px dashed ${P.lav}`, background: "transparent", cursor: "pointer", borderRadius: 20,
            minHeight: 180, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
            gap: 8, color: P.lavDeep,
          }}>
            <Plus size={26} />
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 13 }}>Add a dream</span>
          </button>
        </div>

        {/* manifested gallery */}
        {done.length > 0 && (
          <div style={{ marginTop: 26 }}>
            <SectionLabel>Manifested ✨ — dreams now real</SectionLabel>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {done.map((m) => (
                <div key={m.id} style={{
                  background: `linear-gradient(120deg, ${P.sun}22, #fff)`, border: `1px solid ${P.sun}55`,
                  borderRadius: 18, padding: 16, display: "flex", alignItems: "center", gap: 12,
                }}>
                  <div style={{ width: 40, height: 40, borderRadius: 12, background: P.sun + "44", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <Star size={20} color={P.peachDeep} fill={P.sun} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 15 }}>{m.title}</div>
                    <div style={{ color: P.inkSoft, fontSize: 12 }}>I dreamed this — and here it is.</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <div style={{ height: 24 }} />
      </div>

      {/* add modal */}
      {adding && (
        <Modal onClose={() => setAdding(false)}>
          <h3 style={{ fontFamily: font.display, fontSize: 20, margin: "0 0 4px" }}>Add to your vision board</h3>
          <p style={{ color: P.inkSoft, fontSize: 13, marginTop: 0 }}>Write your affirmation as if it's already true.</p>

          <button onClick={() => fileRef.current?.click()} style={{
            width: "100%", height: 110, borderRadius: 16, border: `2px dashed ${P.line}`, cursor: "pointer",
            background: img ? `url(${img}) center/cover` : P.cream, display: "flex", alignItems: "center",
            justifyContent: "center", color: P.inkSoft, marginBottom: 12,
          }}>
            {!img && <span style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: font.display, fontWeight: 700 }}><Camera size={18} /> Add a picture</span>}
          </button>
          <input ref={fileRef} type="file" accept="image/*" onChange={onFile} style={{ display: "none" }} />

          <Field label="What are you manifesting?" value={title} onChange={setTitle} placeholder="e.g. My calm, light-filled home" />
          <Field label="Affirmation (present tense)" value={aff} onChange={setAff} placeholder="I am…" hint />
          <Field label="Why it matters (optional)" value={why} onChange={setWhy} placeholder="A word to future me" />

          <div style={{ display: "flex", gap: 10, marginTop: 8 }}>
            <SoftButton primary onClick={add} style={{ flex: 1 }}>Add it</SoftButton>
            <SoftButton onClick={() => setAdding(false)}>Cancel</SoftButton>
          </div>
        </Modal>
      )}
    </div>
  );
}

function Field({ label, value, onChange, placeholder, hint }) {
  return (
    <div style={{ marginBottom: 12 }}>
      <label style={{ fontFamily: font.display, fontWeight: 700, fontSize: 13, display: "block", marginBottom: 5 }}>{label}</label>
      <input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} style={{
        width: "100%", border: `1px solid ${P.line}`, borderRadius: 12, padding: "11px 12px",
        fontFamily: font.body, fontSize: 15, color: P.ink, background: P.cream,
      }} />
      {hint && <div style={{ color: P.lavDeep, fontSize: 11, marginTop: 4 }}>Tip: "I am…" works better than "I will…"</div>}
    </div>
  );
}

/* ============================ JOY BOOTH ============================ */
function BoothView({ videos, setVideos, onBack, flash }) {
  const [recording, setRecording] = useState(false);
  const [label, setLabel] = useState("");
  const [camReady, setCamReady] = useState(false);
  const [camError, setCamError] = useState(false);
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const recRef = useRef(null);
  const chunks = useRef([]);
  const [recordedUrl, setRecordedUrl] = useState(null);

  const start = async () => {
    setCamError(false); setRecordedUrl(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = stream;
      if (videoRef.current) { videoRef.current.srcObject = stream; videoRef.current.play(); }
      setCamReady(true);
      chunks.current = [];
      const rec = new MediaRecorder(stream);
      rec.ondataavailable = (e) => e.data.size && chunks.current.push(e.data);
      rec.onstop = () => {
        const blob = new Blob(chunks.current, { type: "video/webm" });
        setRecordedUrl(URL.createObjectURL(blob));
      };
      recRef.current = rec; rec.start(); setRecording(true);
    } catch (err) {
      setCamError(true);
    }
  };
  const stop = () => {
    recRef.current?.stop();
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setRecording(false); setCamReady(false);
  };
  const saveClip = () => {
    const colors = [P.peach, P.sage, P.lav, P.sun];
    setVideos((p) => [{ id: Date.now() + "", date: iso(new Date()), label: label.trim() || "A happy moment",
      mood: "joyful", shared: false, color: colors[p.length % 4], url: recordedUrl }, ...p]);
    setRecordedUrl(null); setLabel(""); flash("Kept for your future self 💛");
  };
  const savePlaceholder = () => {
    const colors = [P.peach, P.sage, P.lav, P.sun];
    setVideos((p) => [{ id: Date.now() + "", date: iso(new Date()), label: label.trim() || "A happy moment",
      mood: "joyful", shared: false, color: colors[p.length % 4] }, ...p]);
    setLabel(""); setCamError(false); flash("Saved a joy note for today 💛");
  };
  const toggleShare = (id) => setVideos((p) => p.map((v) => v.id === id ? { ...v, shared: !v.shared } : v));

  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  return (
    <div className="floatIn">
      <TopBar title="Joy Booth" onBack={onBack} tint={P.peachDeep} />
      <div style={{ padding: "0 20px" }}>
        <div style={{ background: P.lavLight, borderRadius: 16, padding: "12px 14px", display: "flex", gap: 10, alignItems: "center", marginBottom: 18 }}>
          <Lock size={18} color={P.lavDeep} />
          <div style={{ fontSize: 13, color: P.lavDeep, lineHeight: 1.4 }}>
            Private by default — only you can see these. Sharing is always your separate choice.
          </div>
        </div>

        {/* recorder stage */}
        <div style={{ background: P.card, borderRadius: 22, padding: 16, boxShadow: softer }}>
          <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 17 }}>Capture a happy moment</div>
          <div style={{ color: P.inkSoft, fontSize: 13, marginBottom: 12 }}>
            A message from today's you to a future, low-day you.
          </div>

          <div style={{ position: "relative", borderRadius: 18, overflow: "hidden", background: "#2b2822", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
            {!camError && (camReady || recordedUrl) ? (
              recordedUrl ? (
                <video src={recordedUrl} controls style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              )
            ) : (
              <div style={{ textAlign: "center", color: "#fff", padding: 20 }}>
                {camError ? (
                  <>
                    <Camera size={34} color="#fff" style={{ opacity: 0.8 }} />
                    <div style={{ fontSize: 13, marginTop: 8, opacity: 0.9, lineHeight: 1.5 }}>
                      Camera isn't available in this preview. On your phone it records normally — for now you can save a joy note.
                    </div>
                  </>
                ) : (
                  <>
                    <Video size={34} color="#fff" style={{ opacity: 0.8 }} />
                    <div style={{ fontSize: 13, marginTop: 8, opacity: 0.9 }}>Tap record when you're ready</div>
                  </>
                )}
              </div>
            )}
            {recording && (
              <div style={{ position: "absolute", top: 12, left: 12, background: "rgba(0,0,0,0.5)", color: "#fff", padding: "4px 10px", borderRadius: 999, fontSize: 12, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: "#ff6b6b", display: "inline-block" }} /> REC
              </div>
            )}
          </div>

          <input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="Name this moment…" style={{
            width: "100%", border: `1px solid ${P.line}`, borderRadius: 12, padding: "10px 12px", marginTop: 12,
            fontFamily: font.body, fontSize: 15, color: P.ink, background: P.cream,
          }} />

          <div style={{ display: "flex", gap: 10, marginTop: 12 }}>
            {!recording && !recordedUrl && !camError && (
              <SoftButton primary onClick={start} style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <Camera size={18} /> Record
              </SoftButton>
            )}
            {recording && (
              <SoftButton primary onClick={stop} style={{ flex: 1, background: P.lavDeep, boxShadow: "0 6px 16px rgba(142,125,182,0.4)" }}>Stop & keep</SoftButton>
            )}
            {recordedUrl && (
              <>
                <SoftButton primary onClick={saveClip} style={{ flex: 1 }}>Keep it</SoftButton>
                <SoftButton onClick={() => setRecordedUrl(null)}>Retake</SoftButton>
              </>
            )}
            {camError && (
              <SoftButton primary onClick={savePlaceholder} style={{ flex: 1 }}>Save a joy note</SoftButton>
            )}
          </div>
        </div>

        {/* gallery */}
        <div style={{ marginTop: 24 }}>
          <SectionLabel>Your booth of happy moments</SectionLabel>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            {videos.map((v) => (
              <div key={v.id} style={{ background: P.card, borderRadius: 18, overflow: "hidden", boxShadow: softer }}>
                <div style={{ height: 96, background: v.url ? "#2b2822" : `linear-gradient(140deg, ${v.color}, ${P.cream})`, display: "flex", alignItems: "center", justifyContent: "center", position: "relative" }}>
                  {v.url ? <video src={v.url} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    : <Play size={26} color="#fff" fill="#fff" />}
                </div>
                <div style={{ padding: 10 }}>
                  <div style={{ fontFamily: font.display, fontWeight: 700, fontSize: 13, lineHeight: 1.25 }}>{v.label}</div>
                  <div style={{ color: P.inkSoft, fontSize: 11, marginTop: 2 }}>{fmtDay(new Date(v.date))}</div>
                  <button onClick={() => toggleShare(v.id)} style={{
                    marginTop: 8, width: "100%", border: `1px solid ${v.shared ? P.sage : P.line}`,
                    background: v.shared ? P.sageLight : "transparent", color: v.shared ? P.sageDeep : P.inkSoft,
                    borderRadius: 10, padding: "6px", cursor: "pointer", fontFamily: font.display, fontWeight: 700, fontSize: 11,
                    display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  }}>
                    {v.shared ? <><Check size={13} /> Shared</> : <><Share2 size={13} /> Keep private</>}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

function MiniRecorder({ onSave, onCancel }) {
  const [state, setState] = useState("idle"); // idle | recording | error | done
  const videoRef = useRef(null);
  const streamRef = useRef(null);

  const start = async () => {
    try {
      const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      streamRef.current = s;
      if (videoRef.current) { videoRef.current.srcObject = s; videoRef.current.play(); }
      setState("recording");
    } catch { setState("error"); }
  };
  const stop = () => { streamRef.current?.getTracks().forEach((t) => t.stop()); setState("done"); };
  useEffect(() => () => streamRef.current?.getTracks().forEach((t) => t.stop()), []);

  return (
    <div style={{ marginTop: 14 }}>
      <div style={{ borderRadius: 14, overflow: "hidden", background: "#2b2822", aspectRatio: "4/3", display: "flex", alignItems: "center", justifyContent: "center" }}>
        {state === "recording"
          ? <video ref={videoRef} muted playsInline style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          : <div style={{ color: "#fff", textAlign: "center", padding: 16, fontSize: 13, opacity: 0.9 }}>
              {state === "error" ? "Camera isn't available in this preview — it works on your phone. You can still save this reflection."
                : state === "done" ? "Looks lovely 💛" : "Tap record to begin"}
            </div>}
      </div>
      <div style={{ display: "flex", gap: 10, marginTop: 10 }}>
        {state === "idle" && <SoftButton primary onClick={start} style={{ flex: 1 }}>Record</SoftButton>}
        {state === "recording" && <SoftButton primary onClick={stop} style={{ flex: 1, background: P.lavDeep }}>Stop</SoftButton>}
        {(state === "done" || state === "error") && <SoftButton primary onClick={onSave} style={{ flex: 1 }}>Keep it</SoftButton>}
        <SoftButton onClick={onCancel}>Cancel</SoftButton>
      </div>
    </div>
  );
}

/* ============================ TODAY'S LIST ============================ */
function TodoView({ todos, addTodo, toggleTodo, delTodo, onBack }) {
  const [text, setText] = useState("");
  const doneCount = todos.filter((t) => t.done).length;
  const allDone = todos.length > 0 && doneCount === todos.length;

  const submit = () => { if (text.trim()) { addTodo(text.trim()); setText(""); } };

  return (
    <div className="floatIn">
      <TopBar title="Today's list" onBack={onBack} tint={P.sageDeep} />
      <div style={{ padding: "0 20px" }}>
        <p style={{ color: P.inkSoft, fontSize: 14, marginTop: 0 }}>
          A few things to tend to today. Check them off as you go — leaving some unfinished is completely okay.
        </p>

        {/* add a task */}
        <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
          <input value={text} onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()} placeholder="Add something for today…" style={{
              flex: 1, border: `1px solid ${P.line}`, borderRadius: 14, padding: "12px 14px",
              fontFamily: font.body, fontSize: 15, color: P.ink, background: P.card, boxShadow: softer,
            }} />
          <button onClick={submit} style={{
            border: "none", cursor: "pointer", background: P.peach, color: "#fff", borderRadius: 14,
            width: 48, display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 6px 16px rgba(229,135,95,0.35)",
          }}>
            <Plus size={22} />
          </button>
        </div>

        {/* progress */}
        {todos.length > 0 && (
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <div style={{ flex: 1, height: 10, borderRadius: 999, background: P.creamDeep, overflow: "hidden" }}>
              <div style={{ width: `${(doneCount / todos.length) * 100}%`, height: "100%", background: `linear-gradient(90deg, ${P.sage}, ${P.sun})`, transition: "width .4s ease" }} />
            </div>
            <span style={{ fontFamily: font.display, fontWeight: 700, fontSize: 14, color: P.inkSoft }}>{doneCount} of {todos.length}</span>
          </div>
        )}

        {allDone && (
          <div style={{
            background: `linear-gradient(120deg, ${P.sun}22, ${P.sageLight})`, borderRadius: 18, padding: 16,
            display: "flex", alignItems: "center", gap: 10, marginBottom: 16,
            fontFamily: font.display, fontWeight: 700, color: P.sageDeep,
          }}>
            <Flower2 size={22} color={P.peach} /> Everything tended to. Rest easy — you showed up today.
          </div>
        )}

        {/* list */}
        {todos.length === 0 ? (
          <EmptyNote>Your list is clear. Add a task above, or simply enjoy the open space.</EmptyNote>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {todos.map((t) => (
              <div key={t.id} style={{
                background: P.card, borderRadius: 16, padding: "14px 16px", boxShadow: softer,
                display: "flex", alignItems: "center", gap: 12,
              }}>
                <button onClick={() => toggleTodo(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "flex" }}>
                  {t.done ? <CheckCircle2 size={26} color={P.sage} /> : <Circle size={26} color={P.line} />}
                </button>
                <span style={{
                  flex: 1, fontSize: 16, color: t.done ? P.inkSoft : P.ink,
                  textDecoration: t.done ? "line-through" : "none", opacity: t.done ? 0.6 : 1,
                  transition: "opacity .2s ease",
                }}>{t.text}</span>
                <button onClick={() => delTodo(t.id)} style={{ background: "none", border: "none", cursor: "pointer", padding: 4, color: P.line }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = P.peachDeep)}
                  onMouseLeave={(e) => (e.currentTarget.style.color = P.line)}>
                  <Trash2 size={18} />
                </button>
              </div>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16, textAlign: "center", color: P.inkSoft, fontSize: 12 }}>
          Unfinished tasks aren't failures — they're just tomorrow's gentle starting point.
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ============================ AFFIRMATIONS LIBRARY ============================ */
function LibraryView({ onBack }) {
  const cats = Object.keys(AFFIRMATIONS);
  const [cat, setCat] = useState(cats[0]);
  const tints = { "Self-worth": P.peach, "Anxiety": P.sage, "Self-forgiveness": P.lav, "Confidence": P.sun, "Calm": P.sageDeep };

  return (
    <div className="floatIn">
      <TopBar title="Affirmations" onBack={onBack} tint={P.sageDeep} />
      <div style={{ padding: "0 20px" }}>
        <p style={{ color: P.inkSoft, fontSize: 14, marginTop: 0 }}>
          Grounded in CBT and self-compassion — not empty pep talk. Pick what you need today.
        </p>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 6, marginBottom: 18 }}>
          {cats.map((c) => (
            <button key={c} onClick={() => setCat(c)} style={{
              whiteSpace: "nowrap", border: cat === c ? `2px solid ${tints[c]}` : `2px solid transparent`,
              background: cat === c ? "#fff" : P.card, color: P.ink, cursor: "pointer",
              borderRadius: 999, padding: "8px 14px", fontFamily: font.display, fontWeight: 700, fontSize: 13, boxShadow: softer,
            }}>{c}</button>
          ))}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {AFFIRMATIONS[cat].map((a, i) => (
            <div key={i} style={{
              background: `linear-gradient(135deg, ${tints[cat]}22, #fff)`, border: `1px solid ${tints[cat]}44`,
              borderRadius: 20, padding: 20, display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              <Quote size={22} color={tints[cat]} style={{ flexShrink: 0, marginTop: 2 }} />
              <div style={{ fontFamily: font.display, fontWeight: 600, fontSize: 18, lineHeight: 1.45 }}>{a}</div>
            </div>
          ))}
        </div>
        <div style={{ height: 24 }} />
      </div>
    </div>
  );
}

/* ============================ shared chrome ============================ */
function TopBar({ title, onBack, tint }) {
  return (
    <div style={{ padding: "22px 20px 16px", display: "flex", alignItems: "center", gap: 12 }}>
      <button onClick={onBack} style={{
        width: 40, height: 40, borderRadius: 12, border: "none", cursor: "pointer",
        background: P.card, boxShadow: softer, display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <ArrowLeft size={20} color={P.ink} />
      </button>
      <h2 style={{ fontFamily: font.display, fontWeight: 700, fontSize: 24, margin: 0, color: tint }}>{title}</h2>
    </div>
  );
}

function Modal({ children, onClose, dim }) {
  return (
    <div onClick={onClose} style={{
      position: "fixed", inset: 0, background: dim ? "rgba(62,58,53,0.55)" : "rgba(62,58,53,0.4)",
      display: "flex", alignItems: "center", justifyContent: "center", padding: 20, zIndex: 80,
      animation: "floatIn .25s ease both",
    }}>
      <div onClick={(e) => e.stopPropagation()} style={{
        background: P.cream, borderRadius: 26, padding: 22, maxWidth: 400, width: "100%",
        maxHeight: "88vh", overflowY: "auto", boxShadow: "0 20px 60px rgba(0,0,0,0.25)", position: "relative",
      }}>
        <button onClick={onClose} style={{
          position: "absolute", top: 14, right: 14, width: 34, height: 34, borderRadius: 10, border: "none",
          cursor: "pointer", background: "#fff", boxShadow: softer, display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <X size={18} color={P.ink} />
        </button>
        {children}
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from "react";

const COLORS = {
  yellow: "#FCD23A",
  blue: "#428BCA",
  dark: "#232323",
  light: "#F5F5F5",
  white: "#ffffff",
  textLight: "rgba(255,255,255,0.82)",
  textLighter: "rgba(255,255,255,0.72)",
  textDark: "#444",
  textCard: "#555",
  textMuted: "#666",
};

const CATEGORIES = [
  "Wszystkie",
  "Landing Page",
  "Newsletter",
  "Video",
  "Inne",
];

const CATEGORY_ICONS = {
  "Landing Page": "🌐",
  Newsletter: "📧",
  Video: "🎬",
  Inne: "🔧",
};

const DEFAULT_TOOLS = [
  {
    id: "demo1",
    name: "Przykładowe narzędzie",
    description: "Kliknij + aby dodać swoje pierwsze narzędzie do repozytorium.",
    url: "https://example.vercel.app",
    category: "Inne",
    date: "2025-01-01",
  },
];

export default function ToolRepository() {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("Wszystkie");
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    url: "",
    category: "Landing Page",
  });
  const formRef = useRef(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    loadTools();
  }, []);

  const loadTools = async () => {
    try {
      const result = await window.storage.get("marketing-tools");
      if (result && result.value) {
        setTools(JSON.parse(result.value));
      } else {
        setTools(DEFAULT_TOOLS);
        await window.storage.set("marketing-tools", JSON.stringify(DEFAULT_TOOLS));
      }
    } catch {
      setTools(DEFAULT_TOOLS);
    }
    setLoading(false);
  };

  const saveTools = async (newTools) => {
    setTools(newTools);
    try {
      await window.storage.set("marketing-tools", JSON.stringify(newTools));
    } catch (e) {
      console.error("Save error:", e);
    }
  };

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleSubmit = () => {
    if (!formData.name.trim() || !formData.url.trim()) return;
    let url = formData.url.trim();
    if (!/^https?:\/\//.test(url)) url = "https://" + url;

    if (editId) {
      const updated = tools.map((t) =>
        t.id === editId ? { ...t, ...formData, url } : t
      );
      saveTools(updated);
      showToast("Narzędzie zaktualizowane ✓");
      setEditId(null);
    } else {
      const newTool = {
        id: Date.now().toString(),
        ...formData,
        url,
        date: new Date().toISOString().split("T")[0],
      };
      saveTools([newTool, ...tools]);
      showToast("Narzędzie dodane ✓");
    }
    setFormData({ name: "", description: "", url: "", category: "Landing Page" });
    setShowForm(false);
  };

  const startEdit = (tool) => {
    setFormData({
      name: tool.name,
      description: tool.description,
      url: tool.url,
      category: tool.category,
    });
    setEditId(tool.id);
    setShowForm(true);
    setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const deleteTool = (id) => {
    saveTools(tools.filter((t) => t.id !== id));
    setConfirmDelete(null);
    showToast("Usunięto ✓");
  };

  const filtered = tools.filter((t) => {
    const matchCat = filter === "Wszystkie" || t.category === filter;
    const matchSearch =
      !search ||
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const stats = {
    total: tools.length,
    categories: [...new Set(tools.map((t) => t.category))].length,
    thisMonth: tools.filter((t) => {
      const d = new Date(t.date);
      const now = new Date();
      return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
    }).length,
  };

  if (loading) {
    return (
      <div style={{ background: COLORS.dark, minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: COLORS.yellow, fontSize: 18, fontFamily: "'DM Sans', sans-serif" }}>Ładowanie...</div>
      </div>
    );
  }

  return (
    <div
      style={{
        background: COLORS.light,
        minHeight: "100vh",
        fontFamily: "'DM Sans', sans-serif",
        position: "relative",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.5s ease",
      }}
    >
      <link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&family=Space+Mono:wght@400;700&display=swap" rel="stylesheet" />

      {/* TOAST */}
      {toast && (
        <div
          style={{
            position: "fixed",
            top: 24,
            right: 24,
            background: COLORS.dark,
            color: COLORS.yellow,
            padding: "14px 28px",
            borderRadius: 10,
            fontSize: 14,
            fontWeight: 600,
            zIndex: 1000,
            boxShadow: "0 8px 32px rgba(0,0,0,0.25)",
            border: `1px solid ${COLORS.yellow}33`,
            animation: "slideIn 0.3s ease",
          }}
        >
          {toast}
        </div>
      )}

      {/* HERO */}
      <div
        style={{
          background: COLORS.dark,
          padding: "48px 24px 40px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -60,
            right: -60,
            width: 200,
            height: 200,
            borderRadius: "50%",
            background: `${COLORS.yellow}08`,
            border: `1px solid ${COLORS.yellow}15`,
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -30,
            left: "20%",
            width: 120,
            height: 120,
            borderRadius: "50%",
            background: `${COLORS.blue}08`,
            border: `1px solid ${COLORS.blue}15`,
          }}
        />

        <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
            <div
              style={{
                width: 10,
                height: 10,
                borderRadius: "50%",
                background: COLORS.yellow,
                boxShadow: `0 0 12px ${COLORS.yellow}66`,
              }}
            />
            <span
              style={{
                fontFamily: "'Space Mono', monospace",
                fontSize: 11,
                letterSpacing: 3,
                color: COLORS.yellow,
                textTransform: "uppercase",
              }}
            >
              Marketing Toolbox
            </span>
          </div>
          <h1
            style={{
              fontSize: "clamp(28px, 5vw, 44px)",
              fontWeight: 700,
              color: COLORS.white,
              margin: "0 0 10px",
              lineHeight: 1.15,
            }}
          >
            Repozytorium <span style={{ color: COLORS.yellow }}>narzędzi</span>
          </h1>
          <p style={{ color: COLORS.textLighter, fontSize: 16, margin: 0, maxWidth: 500 }}>
            Wszystkie narzędzia marketingowe w jednym miejscu. Dodawaj, zarządzaj i prezentuj.
          </p>

          {/* STATS */}
          <div
            style={{
              display: "flex",
              gap: 24,
              marginTop: 28,
              flexWrap: "wrap",
            }}
          >
            {[
              { label: "Narzędzi", value: stats.total, color: COLORS.yellow },
              { label: "Kategorii", value: stats.categories, color: COLORS.blue },
              { label: "W tym miesiącu", value: stats.thisMonth, color: COLORS.yellow },
            ].map((s) => (
              <div
                key={s.label}
                style={{
                  background: `${s.color}0A`,
                  border: `1px solid ${s.color}25`,
                  borderRadius: 10,
                  padding: "14px 22px",
                  minWidth: 110,
                }}
              >
                <div style={{ fontSize: 26, fontWeight: 700, color: s.color, fontFamily: "'Space Mono', monospace" }}>
                  {s.value}
                </div>
                <div style={{ fontSize: 12, color: COLORS.textLighter, marginTop: 2 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* TOOLBAR */}
      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "24px 24px 0" }}>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 12,
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 20,
          }}
        >
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", alignItems: "center" }}>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: 8,
                  border: filter === cat ? `2px solid ${COLORS.blue}` : `1px solid #ddd`,
                  background: filter === cat ? COLORS.blue : COLORS.white,
                  color: filter === cat ? COLORS.white : COLORS.textCard,
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  transition: "all 0.2s",
                }}
              >
                {cat !== "Wszystkie" && CATEGORY_ICONS[cat] + " "}
                {cat}
              </button>
            ))}
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <input
              type="text"
              placeholder="Szukaj..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                padding: "9px 16px",
                borderRadius: 8,
                border: `1px solid #ddd`,
                fontSize: 13,
                fontFamily: "'DM Sans', sans-serif",
                outline: "none",
                width: 160,
                transition: "border 0.2s",
              }}
              onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
              onBlur={(e) => (e.target.style.borderColor = "#ddd")}
            />
            <button
              onClick={() => {
                setEditId(null);
                setFormData({ name: "", description: "", url: "", category: "Landing Page" });
                setShowForm(!showForm);
              }}
              style={{
                padding: "9px 20px",
                borderRadius: 8,
                border: "none",
                background: COLORS.yellow,
                color: COLORS.dark,
                fontSize: 14,
                fontWeight: 700,
                cursor: "pointer",
                fontFamily: "'DM Sans', sans-serif",
                display: "flex",
                alignItems: "center",
                gap: 6,
                boxShadow: `0 2px 12px ${COLORS.yellow}44`,
                transition: "transform 0.15s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.03)")}
              onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
            >
              <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Dodaj
            </button>
          </div>
        </div>

        {/* ADD/EDIT FORM */}
        {showForm && (
          <div
            ref={formRef}
            style={{
              background: COLORS.white,
              borderRadius: 14,
              padding: 28,
              marginBottom: 24,
              border: `2px solid ${COLORS.yellow}`,
              boxShadow: `0 4px 24px ${COLORS.yellow}15`,
              animation: "fadeUp 0.3s ease",
            }}
          >
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h3 style={{ margin: 0, color: COLORS.dark, fontSize: 18 }}>
                {editId ? "✏️ Edytuj narzędzie" : "➕ Nowe narzędzie"}
              </h3>
              <button
                onClick={() => { setShowForm(false); setEditId(null); }}
                style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: COLORS.textMuted }}
              >
                ✕
              </button>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>
                  Nazwa *
                </label>
                <input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="np. Kalkulator ROI"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>
                  URL *
                </label>
                <input
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  placeholder="np. kalkulator-roi.vercel.app"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>
                  Kategoria
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  style={{ ...inputStyle, cursor: "pointer" }}
                >
                  {CATEGORIES.filter((c) => c !== "Wszystkie").map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: COLORS.textMuted, display: "block", marginBottom: 6 }}>
                  Opis
                </label>
                <input
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Krótki opis narzędzia..."
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = COLORS.blue)}
                  onBlur={(e) => (e.target.style.borderColor = "#ddd")}
                />
              </div>
            </div>

            <div style={{ display: "flex", gap: 10, marginTop: 20 }}>
              <button onClick={handleSubmit} style={primaryBtn}>
                {editId ? "Zapisz zmiany" : "Dodaj narzędzie"}
              </button>
              <button
                onClick={() => { setShowForm(false); setEditId(null); }}
                style={secondaryBtn}
              >
                Anuluj
              </button>
            </div>
          </div>
        )}

        {/* CARDS GRID */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: 18,
            paddingBottom: 60,
          }}
        >
          {filtered.length === 0 && (
            <div
              style={{
                gridColumn: "1 / -1",
                textAlign: "center",
                padding: 60,
                color: COLORS.textMuted,
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 12 }}>🔍</div>
              <div style={{ fontSize: 16 }}>Brak narzędzi w tej kategorii</div>
            </div>
          )}

          {filtered.map((tool, i) => (
            <div
              key={tool.id}
              style={{
                background: COLORS.white,
                borderRadius: 14,
                padding: 24,
                border: "1px solid #e8e8e8",
                position: "relative",
                transition: "all 0.25s ease",
                cursor: "default",
                animation: `fadeUp 0.4s ease ${i * 0.05}s both`,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-3px)";
                e.currentTarget.style.boxShadow = "0 8px 30px rgba(0,0,0,0.08)";
                e.currentTarget.style.borderColor = COLORS.blue + "44";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "none";
                e.currentTarget.style.borderColor = "#e8e8e8";
              }}
            >
              {/* Category badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 5,
                  padding: "4px 10px",
                  borderRadius: 6,
                  background: `${COLORS.blue}0D`,
                  border: `1px solid ${COLORS.blue}22`,
                  fontSize: 11,
                  fontWeight: 600,
                  color: COLORS.blue,
                  marginBottom: 14,
                }}
              >
                {CATEGORY_ICONS[tool.category]} {tool.category}
              </div>

              {/* Actions */}
              <div style={{ position: "absolute", top: 18, right: 18, display: "flex", gap: 4 }}>
                <button
                  onClick={() => startEdit(tool)}
                  title="Edytuj"
                  style={iconBtn}
                >
                  ✏️
                </button>
                <button
                  onClick={() => setConfirmDelete(tool.id)}
                  title="Usuń"
                  style={iconBtn}
                >
                  🗑️
                </button>
              </div>

              <h3 style={{ margin: "0 0 8px", fontSize: 18, fontWeight: 700, color: COLORS.dark }}>
                {tool.name}
              </h3>
              <p style={{ margin: "0 0 16px", fontSize: 13, color: COLORS.textCard, lineHeight: 1.5 }}>
                {tool.description}
              </p>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <a
                  href={tool.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    padding: "8px 18px",
                    borderRadius: 8,
                    background: COLORS.yellow,
                    color: COLORS.dark,
                    fontSize: 13,
                    fontWeight: 700,
                    textDecoration: "none",
                    transition: "all 0.15s",
                    boxShadow: `0 2px 8px ${COLORS.yellow}33`,
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.04)")}
                  onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1)")}
                >
                  Otwórz ↗
                </a>
                <span style={{ fontSize: 11, color: COLORS.textMuted, fontFamily: "'Space Mono', monospace" }}>
                  {tool.date}
                </span>
              </div>

              {/* URL preview */}
              <div
                style={{
                  marginTop: 12,
                  padding: "6px 10px",
                  background: COLORS.light,
                  borderRadius: 6,
                  fontSize: 11,
                  color: COLORS.textMuted,
                  fontFamily: "'Space Mono', monospace",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                  whiteSpace: "nowrap",
                }}
              >
                {tool.url}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DELETE CONFIRM MODAL */}
      {confirmDelete && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(0,0,0,0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 999,
          }}
          onClick={() => setConfirmDelete(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              background: COLORS.white,
              borderRadius: 16,
              padding: 32,
              maxWidth: 380,
              width: "90%",
              textAlign: "center",
              boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
            }}
          >
            <div style={{ fontSize: 36, marginBottom: 12 }}>⚠️</div>
            <h3 style={{ margin: "0 0 8px", color: COLORS.dark }}>Na pewno usunąć?</h3>
            <p style={{ color: COLORS.textMuted, fontSize: 14, marginBottom: 24 }}>
              Tego nie można cofnąć.
            </p>
            <div style={{ display: "flex", gap: 10, justifyContent: "center" }}>
              <button
                onClick={() => deleteTool(confirmDelete)}
                style={{ ...primaryBtn, background: "#e74c3c", boxShadow: "none" }}
              >
                Usuń
              </button>
              <button onClick={() => setConfirmDelete(null)} style={secondaryBtn}>
                Anuluj
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        * { box-sizing: border-box; }
        input:focus, select:focus { outline: none; }
        ::placeholder { color: #bbb; }
      `}</style>
    </div>
  );
}

const inputStyle = {
  width: "100%",
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #ddd",
  fontSize: 14,
  fontFamily: "'DM Sans', sans-serif",
  transition: "border 0.2s",
  background: "#fafafa",
};

const primaryBtn = {
  padding: "10px 24px",
  borderRadius: 8,
  border: "none",
  background: "#FCD23A",
  color: "#232323",
  fontSize: 14,
  fontWeight: 700,
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
  boxShadow: "0 2px 12px #FCD23A44",
};

const secondaryBtn = {
  padding: "10px 24px",
  borderRadius: 8,
  border: "1px solid #ddd",
  background: "#fff",
  color: "#555",
  fontSize: 14,
  fontWeight: 500,
  cursor: "pointer",
  fontFamily: "'DM Sans', sans-serif",
};

const iconBtn = {
  background: "none",
  border: "none",
  cursor: "pointer",
  fontSize: 14,
  padding: 4,
  borderRadius: 4,
  transition: "background 0.15s",
};

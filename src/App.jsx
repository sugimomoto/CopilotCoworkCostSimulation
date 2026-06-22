import { useState, useCallback } from "react";

const ROLES = [
  { id: "corp",    label: "コーポレート ナレッジワーカー", light: 22, med: 11, heavy: 5 },
  { id: "cx",      label: "顧客対応 ナレッジワーカー",    light: 17, med: 13, heavy: 5 },
  { id: "tech",    label: "テクニカルワーカー",            light: 12, med:  9, heavy: 14 },
  { id: "mgr",     label: "マネージャー / シニアリーダー", light: 13, med:  6, heavy:  3 },
];

const CREDIT_DEFAULTS = { light: 125, med: 500, heavy: 1200 };

const fmt = (n) => Math.round(n).toLocaleString("ja-JP");
const fmtUSD = (n) =>
  "$" + Math.round(n).toLocaleString("en-US");

function NumInput({ value, onChange, min = 0, style }) {
  return (
    <input
      type="number"
      value={value}
      min={min}
      onChange={(e) => onChange(Math.max(min, Number(e.target.value) || 0))}
      style={{
        width: "100%",
        textAlign: "center",
        fontSize: 13,
        padding: "4px 2px",
        border: "0.5px solid #ccc",
        borderRadius: 6,
        background: "transparent",
        color: "inherit",
        ...style,
      }}
    />
  );
}

function Tag({ type }) {
  const styles = {
    light:  { bg: "#E6F1FB", color: "#0C447C", label: "ライト" },
    med:    { bg: "#E1F5EE", color: "#085041", label: "ミディアム" },
    heavy:  { bg: "#FAEEDA", color: "#633806", label: "ヘビー" },
  };
  const s = styles[type];
  return (
    <span style={{
      fontSize: 11, padding: "2px 8px", borderRadius: 6,
      background: s.bg, color: s.color, fontWeight: 500,
    }}>{s.label}</span>
  );
}

function MetricCard({ label, value, sub }) {
  return (
    <div style={{
      background: "var(--color-background-secondary, #f5f5f5)",
      borderRadius: 8, padding: "1rem", textAlign: "center",
    }}>
      <p style={{ fontSize: 12, color: "var(--color-text-secondary, #666)", margin: "0 0 4px" }}>{label}</p>
      <p style={{ fontSize: 22, fontWeight: 500, margin: 0 }}>{value}</p>
      {sub && <p style={{ fontSize: 11, color: "var(--color-text-secondary, #888)", margin: "4px 0 0" }}>{sub}</p>}
    </div>
  );
}

function Section({ step, title, children }) {
  return (
    <div style={{
      background: "var(--color-background-primary, #fff)",
      border: "0.5px solid var(--color-border-tertiary, #ddd)",
      borderRadius: 12, padding: "1.25rem 1.5rem", marginBottom: "1rem",
    }}>
      <div style={{ display: "flex", alignItems: "baseline", gap: 10, marginBottom: "1rem" }}>
        <span style={{
          fontSize: 11, fontWeight: 500, padding: "2px 8px",
          background: "var(--color-background-info, #E6F1FB)",
          color: "var(--color-text-info, #185FA5)",
          borderRadius: 20,
        }}>Step {step}</span>
        <span style={{ fontSize: 13, fontWeight: 500, color: "var(--color-text-secondary, #555)" }}>{title}</span>
      </div>
      {children}
    </div>
  );
}

export default function App() {
  const [users, setUsers] = useState(ROLES.reduce((a, r) => ({ ...a, [r.id]: 0 }), {}));
  const [prompts, setPrompts] = useState(
    ROLES.reduce((a, r) => ({ ...a, [r.id]: { light: r.light, med: r.med, heavy: r.heavy } }), {})
  );
  const [credits, setCredits] = useState(CREDIT_DEFAULTS);

  const setUser = useCallback((id, v) => setUsers((u) => ({ ...u, [id]: v })), []);
  const setPrompt = useCallback((id, key, v) => setPrompts((p) => ({ ...p, [id]: { ...p[id], [key]: v } })), []);
  const setCredit = useCallback((key, v) => setCredits((c) => ({ ...c, [key]: v })), []);

  const perUser = (role) =>
    prompts[role.id].light * credits.light +
    prompts[role.id].med   * credits.med   +
    prompts[role.id].heavy * credits.heavy;

  const totalCredits = ROLES.reduce((sum, r) => sum + users[r.id] * perUser(r), 0);
  const totalUsers   = ROLES.reduce((sum, r) => sum + users[r.id], 0);
  const totalCost    = totalCredits / 100;
  const perUserCost  = totalUsers > 0 ? totalCost / totalUsers : null;

  const colHead = (label) => (
    <span style={{ fontSize: 11, color: "var(--color-text-secondary, #888)", textAlign: "center", display: "block" }}>
      {label}
    </span>
  );

  return (
    <div style={{ fontFamily: "var(--font-sans, sans-serif)", maxWidth: 720, margin: "0 auto", padding: "1rem 0" }}>

      {/* Step 1 */}
      <Section step={1} title="Coworkを利用するユーザー数を入力してください">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 120px", gap: 8, marginBottom: 6 }}>
          <span />
          {colHead("人数")}
          {colHead("月間クレジット/人")}
        </div>
        {ROLES.map((r) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 120px", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13 }}>{r.label}</span>
            <NumInput value={users[r.id]} onChange={(v) => setUser(r.id, v)} />
            <div style={{
              fontSize: 12, fontWeight: 500,
              color: "var(--color-text-info, #185FA5)",
              background: "var(--color-background-info, #E6F1FB)",
              borderRadius: 6, padding: "4px 8px", textAlign: "center",
            }}>
              {fmt(perUser(r))}
            </div>
          </div>
        ))}
      </Section>

      {/* Step 2 */}
      <Section step={2} title="ユーザー1人あたりの月間プロンプト数">
        <div style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 8, marginBottom: 6 }}>
          <span />
          <div style={{ textAlign: "center" }}><Tag type="light" /></div>
          <div style={{ textAlign: "center" }}><Tag type="med" /></div>
          <div style={{ textAlign: "center" }}><Tag type="heavy" /></div>
        </div>
        {ROLES.map((r) => (
          <div key={r.id} style={{ display: "grid", gridTemplateColumns: "1fr 80px 80px 80px", gap: 8, alignItems: "center", marginBottom: 8 }}>
            <span style={{ fontSize: 13 }}>{r.label}</span>
            <NumInput value={prompts[r.id].light} onChange={(v) => setPrompt(r.id, "light", v)} />
            <NumInput value={prompts[r.id].med}   onChange={(v) => setPrompt(r.id, "med",   v)} />
            <NumInput value={prompts[r.id].heavy} onChange={(v) => setPrompt(r.id, "heavy", v)} />
          </div>
        ))}
        <p style={{ fontSize: 11, color: "var(--color-text-secondary, #888)", margin: "8px 0 0" }}>
          ※ 初期値はMicrosoft Frontier顧客の実績値（2026年5月時点）
        </p>
      </Section>

      {/* Step 3 */}
      <Section step={3} title="プロンプト種別のクレジット単価">
        {[
          { key: "light", desc: "狭いコンテキスト・軽量モデル・ツール呼び出し0〜1回" },
          { key: "med",   desc: "適度なコンテキスト・複数ツール・中程度のランタイム" },
          { key: "heavy", desc: "広いコンテキスト・高品質モデル・多数のツール呼び出し" },
        ].map(({ key, desc }) => (
          <div key={key} style={{ display: "grid", gridTemplateColumns: "auto 1fr 80px", gap: 12, alignItems: "center", marginBottom: 10 }}>
            <Tag type={key} />
            <span style={{ fontSize: 12, color: "var(--color-text-secondary, #666)" }}>{desc}</span>
            <NumInput value={credits[key]} onChange={(v) => setCredit(key, v)} min={1} />
          </div>
        ))}
      </Section>

      {/* Step 4 */}
      <Section step={4} title="試算結果">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
          <MetricCard
            label="月間合計クレジット"
            value={fmt(totalCredits)}
            sub="Copilot Credits"
          />
          <MetricCard
            label="月間概算コスト"
            value={fmtUSD(totalCost)}
            sub="リスト価格ベース（USD）"
          />
          <MetricCard
            label="1ユーザーあたり / 月"
            value={perUserCost !== null ? fmtUSD(perUserCost) : "—"}
            sub="USD"
          />
        </div>
        <p style={{ fontSize: 11, color: "var(--color-text-secondary, #888)", margin: "12px 0 0" }}>
          ※ 1クレジット = $0.01（リスト価格）。本試算はAnthropic Opus 4.8を想定。実際のコストは契約内容により異なります。
        </p>
      </Section>

      {/* 免責 / 出典 / ライセンス */}
      <div style={{
        fontSize: 11, lineHeight: 1.7,
        color: "var(--color-text-secondary, #888)",
        padding: "0 0.5rem", marginTop: "0.5rem",
      }}>
        <p style={{ margin: "0 0 8px" }}>
          <strong>免責事項：</strong>
          本ツールは非公式の試算ツールです。算出される金額・クレジット数はあくまで概算であり、
          その正確性・完全性について一切保証せず、本ツールの利用により生じたいかなる損害についても作者は責任を負いません。
          正式な情報・価格については必ず下記の公式情報をご確認ください。
        </p>
        <p style={{ margin: "0 0 8px" }}>
          <strong>出典：</strong>
          価格・モデル・利用前提などの正式な情報は、Microsoft の公式発表を正とします。
          {" "}
          <a
            href="https://news.microsoft.com/source/asia/features/copilot-cowork-is-now-generally-available/?lang=ja"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-text-info, #185FA5)" }}
          >
            Copilot Cowork が一般提供開始（Microsoft News）
          </a>
        </p>
        <p style={{ margin: "0 0 8px" }}>
          一般提供時点で Copilot Cowork は Anthropic のモデル（Opus 4.8 および Sonnet 4.6 を含む）上で動作します。
          Frontier プログラムでは GPT 5.5 を利用でき、Cowork 1 も近日提供予定です。本試算は Anthropic Opus 4.8 の使用を前提としています。
        </p>
        <p style={{ margin: 0 }}>
          <strong>ライセンス：</strong>
          本ツールはオープンソース（MIT License）として公開されています。
          {" "}
          <a
            href="https://github.com/sugimomoto/CopilotCoworkCostSimulation"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: "var(--color-text-info, #185FA5)" }}
          >
            GitHub リポジトリ
          </a>
        </p>
      </div>
    </div>
  );
}

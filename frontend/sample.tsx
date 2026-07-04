import { createFileRoute, Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

export const Route = createFileRoute("/candidates/$candidateId")({
  component: CandidateDetail,
  head: ({ params }) => ({
    meta: [
      { title: `Candidate · ${params.candidateId}` },
      {
        name: "description",
        content: "Candidate profile, scores, AI summary, and internal notes.",
      },
    ],
  }),
});

type Role = "frontend" | "backend" | "fullstack" | "devops" | "mobile";
type Category =
  | "technical"
  | "communication"
  | "productivity"
  | "culture"
  | "problem_solving";

const CATEGORIES: { id: Category; label: string }[] = [
  { id: "technical", label: "Technical" },
  { id: "communication", label: "Communication" },
  { id: "productivity", label: "Productivity" },
  { id: "culture", label: "Culture" },
  { id: "problem_solving", label: "Problem solving" },
];

type Score = {
  id: string;
  category: Category;
  score: number;
  note: string;
  reviewer: { id: string; name: string };
  createdAt: string;
};

const CANDIDATE = {
  name: "Maya Okafor",
  email: "maya.okafor@example.com",
  role: "fullstack" as Role,
  skills: ["Go", "Python", "PostgreSQL", "React"],
  internal_note:
    "Referred by Priya (Eng). Interviewing at two other companies — timeline ~10 days.",
};

const CURRENT_REVIEWER = { id: "r_2", name: "You" };

const INITIAL_SCORES: Score[] = [
  {
    id: "s1",
    category: "technical",
    score: 4,
    note: "Solid on distributed systems; caching follow-up was shaky.",
    reviewer: { id: "r_1", name: "Ana Duarte" },
    createdAt: "2h ago",
  },
  {
    id: "s2",
    category: "communication",
    score: 5,
    note: "Explains tradeoffs clearly. Great clarifying questions.",
    reviewer: { id: "r_1", name: "Ana Duarte" },
    createdAt: "2h ago",
  },
  {
    id: "s3",
    category: "technical",
    score: 5,
    note: "Reasoned about backpressure without prompting.",
    reviewer: { id: "r_2", name: "You" },
    createdAt: "40m ago",
  },
  {
    id: "s4",
    category: "culture",
    score: 4,
    note: "Curious, low ego. Would pair well with platform team.",
    reviewer: { id: "r_3", name: "Jules Kim" },
    createdAt: "1d ago",
  },
];

function CandidateDetail() {
  const [viewAs, setViewAs] = useState<"reviewer" | "admin">("admin");
  const [scores, setScores] = useState<Score[]>(INITIAL_SCORES);
  const [category, setCategory] = useState<Category>("technical");
  const [scoreValue, setScoreValue] = useState<number>(4);
  const [note, setNote] = useState<string>("");
  const [aiState, setAiState] = useState<"idle" | "loading" | "done">("idle");
  const [aiSummary, setAiSummary] = useState<string>("");
  const [internalNote, setInternalNote] = useState<string>(
    CANDIDATE.internal_note,
  );
  const [editingInternal, setEditingInternal] = useState(false);

  const visibleScores = useMemo(
    () =>
      viewAs === "admin"
        ? scores
        : scores.filter((s) => s.reviewer.id === CURRENT_REVIEWER.id),
    [scores, viewAs],
  );

  const avgByCategory = useMemo(() => {
    const map: Record<string, { total: number; count: number }> = {};
    for (const s of scores) {
      map[s.category] ??= { total: 0, count: 0 };
      map[s.category].total += s.score;
      map[s.category].count += 1;
    }
    return map;
  }, [scores]);

  const overall = scores.length
    ? (scores.reduce((a, b) => a + b.score, 0) / scores.length).toFixed(1)
    : "—";

  function submitScore(e: React.FormEvent) {
    e.preventDefault();
    if (!note.trim()) return;
    setScores((prev) => [
      {
        id: `s_${Date.now()}`,
        category,
        score: scoreValue,
        note: note.trim(),
        reviewer: CURRENT_REVIEWER,
        createdAt: "just now",
      },
      ...prev,
    ]);
    setNote("");
  }

  function generateAiSummary() {
    setAiState("loading");
    setAiSummary("");
    setTimeout(() => {
      setAiSummary(
        `${CANDIDATE.name} is a strong ${CANDIDATE.role} candidate. Reviewers highlight depth in systems thinking and clear communication. Technical average is solid across sessions; culture signal is positive. Recommended next step: systems design round with the platform team, followed by a values conversation. Watch-out: limited consumer-facing product exposure — probe motivation for the role scope.`,
      );
      setAiState("done");
    }, 1200);
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-border bg-background">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <nav className="flex items-center gap-2 text-sm text-muted-foreground">
            <Link to="/" className="hover:text-foreground">
              Candidates
            </Link>
            <span>/</span>
            <span className="text-foreground">{CANDIDATE.name}</span>
          </nav>
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5 text-xs">
            <button
              onClick={() => setViewAs("reviewer")}
              className={`rounded px-2.5 py-1 ${viewAs === "reviewer" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Reviewer
            </button>
            <button
              onClick={() => setViewAs("admin")}
              className={`rounded px-2.5 py-1 ${viewAs === "admin" ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground"}`}
            >
              Admin
            </button>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-8">
        {/* Profile header */}
        <div className="flex flex-wrap items-start justify-between gap-4 pb-6 border-b border-border">
          <div>
            <h1 className="text-2xl font-semibold">{CANDIDATE.name}</h1>
            <p className="text-sm text-muted-foreground">{CANDIDATE.email}</p>
            <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
              <span>
                <span className="text-foreground capitalize">
                  {CANDIDATE.role}
                </span>{" "}
                role
              </span>
              <span>•</span>
              <span>{CANDIDATE.skills.join(", ")}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xs uppercase tracking-wider text-muted-foreground">
              Overall
            </div>
            <div className="mt-1 text-2xl font-semibold">
              {overall}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / 5
              </span>
            </div>
            <div className="text-xs text-muted-foreground">
              {scores.length} reviews
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
          {/* LEFT — main */}
          <section className="space-y-8">
            <AiSummary
              state={aiState}
              summary={aiSummary}
              onGenerate={generateAiSummary}
            />
            <ScoringForm
              category={category}
              setCategory={setCategory}
              scoreValue={scoreValue}
              setScoreValue={setScoreValue}
              note={note}
              setNote={setNote}
              onSubmit={submitScore}
            />
            <ScoresList
              viewAs={viewAs}
              scores={visibleScores}
              totalCount={scores.length}
            />
          </section>

          {/* RIGHT — meta */}
          <aside className="space-y-8">
            {viewAs === "admin" && (
              <CategoryAverages avgByCategory={avgByCategory} />
            )}
            {viewAs === "admin" && (
              <InternalNotes
                value={internalNote}
                onChange={setInternalNote}
                editing={editingInternal}
                setEditing={setEditingInternal}
              />
            )}
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ---------- pieces ---------- */

function SectionTitle({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-sm font-semibold">{children}</h2>
      {aside}
    </div>
  );
}

function AiSummary({
  state,
  summary,
  onGenerate,
}: {
  state: "idle" | "loading" | "done";
  summary: string;
  onGenerate: () => void;
}) {
  return (
    <div>
      <SectionTitle
        aside={
          <button
            onClick={onGenerate}
            disabled={state === "loading"}
            className="text-xs font-medium text-primary hover:underline disabled:opacity-60"
          >
            {state === "loading"
              ? "Generating…"
              : state === "done"
                ? "Regenerate"
                : "Generate summary"}
          </button>
        }
      >
        AI summary
      </SectionTitle>
      <div className="rounded-md border border-border bg-surface p-4 text-sm leading-relaxed">
        {state === "idle" && (
          <p className="text-muted-foreground">
            No summary yet. Generate one from the current scores and notes.
          </p>
        )}
        {state === "loading" && (
          <div className="space-y-2">
            <div className="h-3 w-11/12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-10/12 animate-pulse rounded bg-muted" />
            <div className="h-3 w-8/12 animate-pulse rounded bg-muted" />
          </div>
        )}
        {state === "done" && <p>{summary}</p>}
      </div>
    </div>
  );
}

function ScoringForm({
  category,
  setCategory,
  scoreValue,
  setScoreValue,
  note,
  setNote,
  onSubmit,
}: {
  category: Category;
  setCategory: (c: Category) => void;
  scoreValue: number;
  setScoreValue: (n: number) => void;
  note: string;
  setNote: (s: string) => void;
  onSubmit: (e: React.FormEvent) => void;
}) {
  return (
    <form onSubmit={onSubmit}>
      <SectionTitle>Add a score</SectionTitle>
      <div className="rounded-md border border-border bg-card p-4 space-y-4">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_auto]">
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:border-ring"
            >
              {CATEGORIES.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs text-muted-foreground mb-1.5">
              Score
            </label>
            <div className="flex overflow-hidden rounded-md border border-input">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  type="button"
                  key={n}
                  onClick={() => setScoreValue(n)}
                  className={`w-10 py-2 text-sm border-l border-input first:border-l-0 ${
                    scoreValue === n
                      ? "bg-primary text-primary-foreground"
                      : "bg-background text-foreground hover:bg-secondary"
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs text-muted-foreground mb-1.5">
            Note
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            placeholder="What did you observe? Specifics help other reviewers."
            className="w-full rounded-md border border-input bg-background p-3 text-sm outline-none focus:border-ring"
          />
        </div>

        <div className="flex items-center justify-end gap-2">
          <button
            type="button"
            onClick={() => {
              setNote("");
              setScoreValue(4);
            }}
            className="rounded-md px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            Reset
          </button>
          <button
            type="submit"
            disabled={!note.trim()}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Save score
          </button>
        </div>
      </div>
    </form>
  );
}

function ScoresList({
  viewAs,
  scores,
  totalCount,
}: {
  viewAs: "reviewer" | "admin";
  scores: Score[];
  totalCount: number;
}) {
  return (
    <div>
      <SectionTitle
        aside={
          <span className="text-xs text-muted-foreground">
            {viewAs === "admin"
              ? `${scores.length} of ${totalCount}`
              : `${scores.length} yours · others hidden`}
          </span>
        }
      >
        {viewAs === "admin" ? "All scores" : "Your scores"}
      </SectionTitle>

      <div className="divide-y divide-border rounded-md border border-border bg-card">
        {scores.length === 0 && (
          <div className="p-8 text-center text-sm text-muted-foreground">
            No scores yet.
          </div>
        )}
        {scores.map((s) => (
          <div key={s.id} className="p-4">
            <div className="flex items-baseline justify-between gap-4">
              <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1 text-sm">
                <span className="font-medium">{s.reviewer.name}</span>
                <span className="text-muted-foreground">·</span>
                <span className="capitalize text-muted-foreground">
                  {s.category.replace("_", " ")}
                </span>
                <span className="text-muted-foreground">·</span>
                <span className="text-xs text-muted-foreground">
                  {s.createdAt}
                </span>
              </div>
              <div className="text-sm font-semibold">
                {s.score}
                <span className="text-muted-foreground font-normal">/5</span>
              </div>
            </div>
            <p className="mt-1.5 text-sm text-foreground/90">{s.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function CategoryAverages({
  avgByCategory,
}: {
  avgByCategory: Record<string, { total: number; count: number }>;
}) {
  return (
    <div>
      <SectionTitle>Category averages</SectionTitle>
      <div className="rounded-md border border-border bg-card divide-y divide-border">
        {CATEGORIES.map((c) => {
          const a = avgByCategory[c.id];
          const val = a ? a.total / a.count : 0;
          return (
            <div
              key={c.id}
              className="flex items-center justify-between px-4 py-2.5 text-sm"
            >
              <span className="text-muted-foreground">{c.label}</span>
              <span className="font-medium tabular-nums">
                {a ? val.toFixed(1) : "—"}
                <span className="text-muted-foreground font-normal">/5</span>
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function InternalNotes({
  value,
  onChange,
  editing,
  setEditing,
}: {
  value: string;
  onChange: (v: string) => void;
  editing: boolean;
  setEditing: (b: boolean) => void;
}) {
  return (
    <div>
      <SectionTitle
        aside={
          <button
            onClick={() => setEditing(!editing)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {editing ? "Done" : "Edit"}
          </button>
        }
      >
        Internal notes{" "}
        <span className="ml-1 text-xs font-normal text-muted-foreground">
          (admin only)
        </span>
      </SectionTitle>
      <div className="rounded-md border border-border bg-card p-4">
        {editing ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={6}
            className="w-full rounded-md border border-input bg-background p-2 text-sm outline-none focus:border-ring"
          />
        ) : (
          <p className="whitespace-pre-wrap text-sm text-foreground/90">
            {value || (
              <span className="text-muted-foreground">No internal notes.</span>
            )}
          </p>
        )}
      </div>
    </div>
  );
}

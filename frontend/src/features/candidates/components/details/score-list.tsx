import { formatRelativeDate } from "@/lib/date";

import SectionTitle from "./section-title";

type ScoreItem = {
  id: number;
  reviewer: {
    name: string;
  };
  category: string;
  createdAt: string;
  score: number;
  note: string;
};

type ScoreListProps = {
  viewAs: "admin" | "reviewer";
  scores: ScoreItem[];
  totalCount: number;
  emptyMsg: string;
};

const ScoreList = ({ viewAs, scores, totalCount, emptyMsg }: ScoreListProps) => {
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
            {emptyMsg}
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
                  {formatRelativeDate(s.createdAt)}
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
};

export default ScoreList;

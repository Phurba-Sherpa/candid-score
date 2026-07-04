import { Skeleton } from "@/components/ui/skeleton";

import SectionTitle from "./section-title";

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
            Generate summary
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
            <Skeleton className="h-3 w-11/12" />
            <Skeleton className="h-3 w-10/12" />
            <Skeleton className="h-3 w-8/12" />
          </div>
        )}
        {state === "done" && <p>{summary}</p>}
      </div>
    </div>
  );
}
export default AiSummary;

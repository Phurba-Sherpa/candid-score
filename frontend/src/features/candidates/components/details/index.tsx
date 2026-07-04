import type { CandidateStatus } from "../../api/types";
import { ArrowLeftIcon } from "lucide-react";
import { getRole } from "@/features/auth/api/session";
import { useCandidateQuery } from "@/features/candidates/api/query";
import { useGenerateCandidateSummaryMutation } from "@/features/candidates/api/mutation";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { LogoutButton } from "@/components/logout-button";
import AiSummary from "./ai-summary";
import InternalNote from "./internal-note";
import Profile from "./profile";
import ScoreForm from "./score-form";
import ScoreList from "./score-list";

type ProfileProps = {
  name: string;
  role: string;
  status: CandidateStatus;
  email: string;
  appliedAt: string;
  skills: string[];
  avgScore: number;
};

const CandidateDetail = () => {
  const { candidateId } = useParams<{ candidateId: string }>();
  const numericCandidateId = candidateId ? Number(candidateId) : null;
  const resolvedCandidateId =
    numericCandidateId !== null && !Number.isNaN(numericCandidateId)
      ? numericCandidateId
      : null;

  const candidateQuery = useCandidateQuery(resolvedCandidateId);
  const summaryMutation = useGenerateCandidateSummaryMutation(
    resolvedCandidateId ?? 0,
  );
  const role = getRole();

  const handleGenerateSummary = async () => {
    if (resolvedCandidateId === null) {
      return;
    }

    try {
      await summaryMutation.mutateAsync();
      toast.success("Summary refreshed");
    } catch {
      toast.error("Unable to generate summary right now.");
    }
  };

  const summaryState = candidateQuery.isLoading || summaryMutation.isPending
    ? "loading"
    : candidateQuery.data?.summary
      ? "done"
      : "idle";

  const candidate = candidateQuery.data;

  const profileCandidate: ProfileProps = candidate
    ? {
        name: candidate.name,
        role: candidate.role_applied,
        status: candidate.status,
        email: candidate.email,
        appliedAt: candidate.created_at,
        skills: candidate.skills,
        avgScore: candidate.scores.length
          ? candidate.scores.reduce((sum, item) => sum + item.score, 0) /
            candidate.scores.length
          : 0,
      }
    : {
        name: "Candidate",
        role: "Role unavailable",
        status: "new",
        email: "",
        appliedAt: new Date().toISOString(),
        skills: [],
        avgScore: 0,
      };

  const scores = candidate
    ? candidate.scores.map((score) => ({
        id: score.id,
        reviewer: { name: `Reviewer #${score.reviewer_id}` },
        category: score.category,
        createdAt: score.created_at,
        score: score.score,
        note: score.note ?? "No note provided for this score.",
      }))
    : [];

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-4 flex items-center justify-between gap-3">
        <Button asChild variant="ghost" className="-ml-4 w-fit">
          <Link to="/candidates">
            <ArrowLeftIcon className="size-4" />
            Back
          </Link>
        </Button>
        <LogoutButton />
      </div>
      <Profile {...profileCandidate} />

      <div className="grid gap-8 lg:grid-cols-10">
        <div className="grid gap-4 lg:col-span-7">
          <AiSummary
            state={summaryState}
            summary={candidateQuery.data?.summary ?? ""}
            onGenerate={handleGenerateSummary}
          />
          {role !== "admin" && candidate?.status === "new" ? (
            <ScoreForm
              candidateId={resolvedCandidateId}
              category=""
              selectedScore={0}
              note=""
            />
          ) : null}
          <ScoreList
            viewAs={role === "admin" ? "admin" : "reviewer"}
            scores={scores}
            totalCount={scores.length}
            emptyMsg="No scores have been recorded yet for this candidate."
          />
        </div>
        <div className="lg:col-span-3">
          <InternalNote
            note={candidate?.internal_notes ?? "No internal notes have been added yet."}
          />
        </div>
      </div>
    </div>
  );
};

export default CandidateDetail;

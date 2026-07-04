import { Badge } from "@/components/ui/badge";
import {
  candidateStatus,
  type CandidateStatus,
} from "@/features/candidates/api/types";

type StatusBadgeProps = {
  status: CandidateStatus;
};

const statusLabelMap: Record<CandidateStatus, string> = {
  [candidateStatus.New]: "New",
  [candidateStatus.Reviewed]: "Reviewed",
  [candidateStatus.Hired]: "Hired",
  [candidateStatus.Rejected]: "Rejected",
};

const statusClassMap: Record<CandidateStatus, string> = {
  [candidateStatus.New]: "bg-secondary text-foreground",
  [candidateStatus.Reviewed]: "bg-amber-100 text-amber-900",
  [candidateStatus.Hired]: "bg-emerald-100 text-emerald-900",
  [candidateStatus.Rejected]: "bg-rose-100 text-rose-900",
};

export function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <Badge className={statusClassMap[status]}>{statusLabelMap[status]}</Badge>
  );
}

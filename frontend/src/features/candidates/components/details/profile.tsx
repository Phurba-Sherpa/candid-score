import { Badge } from "@/components/ui/badge";
import { StatusBadge } from "@/features/candidates/components/status-badge";
import { formatAppliedDate } from "@/lib/date";

import type { CandidateStatus } from "../../api/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

type ProfileProps = {
  name: string;
  role: string;
  status: CandidateStatus;
  email: string;
  appliedAt: string;
  skills: string[];
  avgScore: number;
};

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

const Profile = ({
  name,
  role,
  status,
  email,
  appliedAt,
  skills,
  avgScore,
}: ProfileProps) => {
  return (
    <main className="mb-8">
      <div className="border-b border-border pb-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div className="flex items-start gap-4">
            <Avatar size="xl" className="rounded-lg">
              <AvatarFallback className="bg-blue-100 text-blue-900 rounded-lg">
                {initials(name)}
              </AvatarFallback>
            </Avatar>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold">{name}</h1>
                <StatusBadge status={status} />
              </div>
              <p className="text-sm text-muted-foreground">
                <a href={`mailto:${email}`} className="hover:text-foreground">
                  {email}
                </a>
              </p>
              <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                <span className="text-foreground">{role}</span>
                <span>&bull;</span>
                <span>Applied {formatAppliedDate(appliedAt)}</span>
              </div>
              <div className="mt-3 flex flex-wrap gap-1.5">
                {skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>

          <div className="text-right">
            <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
              Overall
            </div>
            <div className="mt-1 text-3xl font-medium">
              {avgScore.toFixed(1)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}
                / 5
              </span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Profile;

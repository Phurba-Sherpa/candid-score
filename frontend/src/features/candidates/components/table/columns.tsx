import type { ColumnDef } from "@tanstack/react-table";
import { ArrowRightIcon } from "lucide-react";
import { Link } from "react-router-dom";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { getRole } from "@/features/auth/api/session";
import { StatusBadge } from "@/features/candidates/components/status-badge";
import { formatAppliedDate } from "@/lib/date";

import type { Candidate } from "../../api/types";
import { Badge } from "@/components/ui/badge";

const currentUserRole = getRole();

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export const columns: ColumnDef<Candidate>[] = [
  {
    accessorKey: "name",
    header: "Candidate",
    cell: ({ row }) => {
      const name = row.original.name;
      const email = row.original.email;

      return (
        <div className="flex items-center gap-2">
          <Avatar size="lg">
            <AvatarFallback>{getInitials(name)}</AvatarFallback>
          </Avatar>
          <div>
            <FieldLabel>{name}</FieldLabel>
            <p className="text-sm text-muted-foreground">{email}</p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "role_applied",
    header: "Role",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.original.status} />,
  },
  {
    accessorKey: "skills",
    header: "Skills",
    cell: ({ row }) => (
      <div className="flex max-w-md flex-wrap gap-1.5 whitespace-normal">
        {row.original.skills.map((skill) => (
          <Badge key={skill} variant="outline">
            {skill}
          </Badge>
        ))}
      </div>
    ),
  },
  ...(currentUserRole === "admin"
    ? [
        {
          accessorKey: "internal_notes",
          header: "Internal Notes",
          cell: ({ row }) => {
            const notes = row.original.internal_notes ?? "No internal notes.";

            return (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="max-w-[50ch] cursor-help whitespace-normal wrap-break-words line-clamp-2 text-sm text-muted-foreground">
                      {notes}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-[50ch] whitespace-normal wrap-break-words text-sm leading-5">
                    {notes}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            );
          },
        } satisfies ColumnDef<Candidate>,
      ]
    : []),
  {
    accessorKey: "created_at",
    header: "Applied",
    cell: ({ row }) => (
      <span className="text-sm text-muted-foreground">
        {formatAppliedDate(row.original.created_at)}
      </span>
    ),
  },
  {
    id: "actions",
    header: "",
    cell: ({ row }) => (
      <Button asChild variant="ghost" size="sm">
        <Link to={`/candidates/${row.original.id}`}>
          Open
          <ArrowRightIcon />
        </Link>
      </Button>
    ),
  },
];

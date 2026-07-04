import type { PaginationState } from "@tanstack/react-table";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryState } from "nuqs";

import { DataTable } from "@/components/partials/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { useCandidatesQuery } from "@/features/candidates/api/query";
import type { Candidate } from "@/features/candidates/api/types";
import { candidateStatus } from "@/features/candidates/api/types";

import { columns } from "./columns";

type CandidateTableProps = {
  data: Candidate[];
  pageCount: number;
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void | Promise<void>;
};

function CandidateTable({
  data,
  pageCount,
  pagination,
  onPaginationChange,
}: CandidateTableProps) {
  return (
    <DataTable
      columns={columns}
      data={data}
      pagination={pagination}
      onPaginationChange={onPaginationChange}
      manualPagination
      controlledPageCount={pageCount}
    />
  );
}

const CandidateList = () => {
  const [status] = useQueryState(
    "status",
    parseAsStringEnum(Object.values(candidateStatus)),
  );
  const [roleApplied] = useQueryState("role_applied", parseAsString);
  const [skill] = useQueryState("skill", parseAsString);
  const [keyword] = useQueryState("keyword", parseAsString);
  const [page, setPage] = useQueryState("page", parseAsInteger.withDefault(1));
  const [pageSize, setPageSize] = useQueryState(
    "page_size",
    parseAsInteger.withDefault(10),
  );

  const offset = Math.max(0, (page - 1) * pageSize);

  const candidatesQuery = useCandidatesQuery({
    status: status ?? undefined,
    role_applied: roleApplied ?? undefined,
    skill: skill ?? undefined,
    keyword: keyword ?? undefined,
    offset,
    limit: pageSize,
  });

  const total = candidatesQuery.data?.total ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  if (candidatesQuery.isLoading) {
    return (
      <div className="space-y-3 rounded-md border p-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (candidatesQuery.isError) {
    return (
      <div className="rounded-md border border-rose-100 bg-rose-50 p-6 text-sm text-rose-700">
        Unable to load candidates right now. Please refresh and try again.
      </div>
    );
  }

  return (
    <CandidateTable
      data={candidatesQuery.data?.items ?? []}
      pageCount={pageCount}
      pagination={{
        pageIndex: Math.max(0, page - 1),
        pageSize,
      }}
      onPaginationChange={async (pagination) => {
        await setPage(pagination.pageIndex + 1);
        await setPageSize(pagination.pageSize);
      }}
    />
  );
};

export default CandidateList;

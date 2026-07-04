import CandidateList from "@/features/candidates/components/table";
import { LogoutButton } from "@/components/logout-button";
import FilterAction from "@/features/candidates/components/table/filter-action";
import PageWrapper from "@/components/partials/page-wrapper";

export function CandidatesPage() {
  return (
    <div className="px-8 py-20">
      <PageWrapper
        title="Candidates"
        headerAction={
          <div className="flex items-center gap-2">
            <FilterAction />
            <LogoutButton />
          </div>
        }
      >
        <CandidateList />
      </PageWrapper>
    </div>
  );
}

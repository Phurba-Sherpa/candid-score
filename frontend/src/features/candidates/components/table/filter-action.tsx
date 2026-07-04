import { useState } from "react";
import { parseAsInteger, parseAsString, parseAsStringEnum, useQueryStates } from "nuqs";

import {
  CandidateFiltersSheet,
  type CandidateFilterValues,
} from "@/features/candidates/components/candidate-filters-sheet";
import { candidateStatus } from "@/features/candidates/api/types";

export function FilterAction() {
  const [open, setOpen] = useState(false);
  const [filters, setFilters] = useQueryStates({
    status: parseAsStringEnum(Object.values(candidateStatus)),
    role_applied: parseAsString,
    skill: parseAsString,
    keyword: parseAsString,
    page: parseAsInteger.withDefault(1),
  });

  const initialValues: CandidateFilterValues = {
    status: filters.status ?? "all",
    role_applied: filters.role_applied ?? "",
    skill: filters.skill ?? "",
    keyword: filters.keyword ?? "",
  };

  const activeFilters = [
    filters.status,
    filters.role_applied,
    filters.skill,
    filters.keyword,
  ].filter(
    (value) => (typeof value === "string" ? value.trim().length > 0 : Boolean(value)),
  ).length;

  const onApply = async (values: CandidateFilterValues) => {
    await setFilters({
      status: values.status === "all" ? null : values.status,
      role_applied: values.role_applied.trim() || null,
      skill: values.skill.trim() || null,
      keyword: values.keyword.trim() || null,
      page: 1,
    });
  };

  const onReset = async () => {
    await setFilters({
      status: null,
      role_applied: null,
      skill: null,
      keyword: null,
      page: 1,
    });
  };

  return (
    <CandidateFiltersSheet
      open={open}
      onOpenChange={setOpen}
      activeFilters={activeFilters}
      initialValues={initialValues}
      onApply={onApply}
      onReset={onReset}
    />
  );
}

export default FilterAction;

import { ListFilterIcon } from "lucide-react";
import { FormProvider, useForm } from "react-hook-form";
import { useEffect } from "react";

import FieldWrapper from "@/components/partials/field-wrapper";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  candidateStatus,
  type CandidateStatus,
} from "@/features/candidates/api/types";

export type CandidateFilterValues = {
  status: CandidateStatus | "all";
  role_applied: string;
  skill: string;
  keyword: string;
};

type CandidateFiltersSheetProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeFilters: number;
  initialValues: CandidateFilterValues;
  onApply: (values: CandidateFilterValues) => Promise<void>;
  onReset: () => Promise<void>;
};

const statusOptions = [
  { value: "all", label: "All statuses" },
  ...Object.values(candidateStatus).map((value) => ({
    value,
    label: value.charAt(0).toUpperCase() + value.slice(1),
  })),
];

export function CandidateFiltersSheet({
  open,
  onOpenChange,
  activeFilters,
  initialValues,
  onApply,
  onReset,
}: CandidateFiltersSheetProps) {
  const form = useForm<CandidateFilterValues>({
    defaultValues: initialValues,
  });

  useEffect(() => {
    form.reset(initialValues);
  }, [form, initialValues]);

  const handleApply = form.handleSubmit(async (values) => {
    await onApply(values);
    onOpenChange(false);
  });

  const handleReset = async () => {
    form.reset({
      status: "all",
      role_applied: "",
      skill: "",
      keyword: "",
    });
    await onReset();
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetTrigger asChild>
        <Button variant="ghost">
          <ListFilterIcon className="size-4" />
          Filters
          {activeFilters > 0 ? ` (${activeFilters})` : ""}
        </Button>
      </SheetTrigger>
      <SheetContent className="">
        <SheetHeader className="border-b border-[#e6e8ff] px-6 py-6">
          <SheetTitle className="text-xl text-[#00084d]">
            Refine the pipeline
          </SheetTitle>
          <SheetDescription className="text-sm leading-6 text-slate-500">
            Update filters here, then apply them to refresh the candidate list
            while keeping the state in the URL.
          </SheetDescription>
        </SheetHeader>

        <FormProvider {...form}>
          <form className="flex h-full flex-col" onSubmit={handleApply}>
            <div className="grid gap-5 px-6 py-6">
              <FieldWrapper<CandidateFilterValues>
                type="select"
                name="status"
                label="Status"
                placeholder="All statuses"
                options={statusOptions}
                required={false}
              />
              <FieldWrapper<CandidateFilterValues>
                type="text"
                name="role_applied"
                label="Role"
                placeholder="Backend Engineer"
                required={false}
              />
              <FieldWrapper<CandidateFilterValues>
                type="text"
                name="skill"
                label="Skill"
                placeholder="python"
                required={false}
              />
              <FieldWrapper<CandidateFilterValues>
                type="text"
                name="keyword"
                label="Keyword"
                placeholder="Search by candidate name or email"
                required={false}
              />
            </div>

            <SheetFooter>
              <Button type="button" variant="outline" onClick={handleReset}>
                Reset all
              </Button>
              <Button type="submit">Apply filters</Button>
            </SheetFooter>
          </form>
        </FormProvider>
      </SheetContent>
    </Sheet>
  );
}

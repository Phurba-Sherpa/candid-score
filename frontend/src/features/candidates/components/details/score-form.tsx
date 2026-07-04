import { useState } from "react";

import { ButtonGroup } from "@/components/ui/button-group";
import { Button } from "@/components/ui/button";
import { FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useCreateCandidateScoreMutation } from "@/features/candidates/api/mutation";
import { toast } from "sonner";

import SectionTitle from "./section-title";

type ScoreFormProps = {
  candidateId: number | null;
  category: string;
  selectedScore: number;
  note: string;
};

const categories = [
  "culture",
  "problem solving",
  "technical",
  "productivity",
  "communication",
  "inquisitive",
];

const ScoreForm = ({ candidateId, category, selectedScore, note }: ScoreFormProps) => {
  const [selectedCategory, setSelectedCategory] = useState(category);
  const [selectedValue, setSelectedValue] = useState(selectedScore);
  const [noteValue, setNoteValue] = useState(note);
  const mutation = useCreateCandidateScoreMutation(candidateId ?? 0);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (candidateId === null) {
      toast.error("Candidate id is required to save a score.");
      return;
    }

    if (!selectedCategory) {
      toast.error("Category is required.");
      return;
    }

    if (!selectedValue) {
      toast.error("Score is required.");
      return;
    }

    try {
      await mutation.mutateAsync({
        category: selectedCategory,
        score: selectedValue,
        note: noteValue.trim() ? noteValue.trim() : null,
      });
      toast.success("Score saved");
      setNoteValue("");
    } catch {
      toast.error("Unable to save score right now.");
    }
  };

  return (
    <div>
      <SectionTitle>Add a score</SectionTitle>
      <div className="rounded-md border border-border bg-surface p-4 text-sm leading-relaxed">
        <form className="grid gap-4" onSubmit={handleSubmit}>
          <div className="grid gap-4 md:grid-cols-[minmax(0,1fr)_auto] md:items-end">
            <div className="grid gap-2">
              <FieldLabel>Category</FieldLabel>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-full bg-background" aria-invalid={!selectedCategory}>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value.charAt(0).toUpperCase() + value.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <FieldLabel>Score</FieldLabel>
              <ButtonGroup>
                {[1, 2, 3, 4, 5].map((value) => (
                  <Button
                    key={value}
                    type="button"
                    variant={selectedValue === value ? "default" : "outline"}
                    onClick={() => setSelectedValue(value)}
                  >
                    {value}
                  </Button>
                ))}
              </ButtonGroup>
            </div>
          </div>

          <div className="grid gap-2">
            <FieldLabel>Note</FieldLabel>
            <Textarea
              value={noteValue}
              onChange={(event) => setNoteValue(event.target.value)}
              placeholder="What did you observe? Specifics help other reviewers."
              className="min-h-28 bg-background"
            />
          </div>

          <div className="flex justify-end">
            <Button type="submit" disabled={mutation.isPending}>
              {mutation.isPending ? "Saving score..." : "Save score"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
export default ScoreForm;

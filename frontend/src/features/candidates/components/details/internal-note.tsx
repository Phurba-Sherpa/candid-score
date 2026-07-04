import SectionTitle from "./section-title";

type InternalNoteProps = {
  note: string;
};

const InternalNote = ({ note }: InternalNoteProps) => {
  return (
    <div>
      <SectionTitle>Internal Notes</SectionTitle>
      <div className="rounded-md border border-border bg-surface p-4 text-sm leading-relaxed">
        <p>{note}</p>
      </div>
    </div>
  );
};
export default InternalNote;

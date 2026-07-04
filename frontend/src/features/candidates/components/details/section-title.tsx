function SectionTitle({
  children,
  aside,
}: {
  children: React.ReactNode;
  aside?: React.ReactNode;
}) {
  return (
    <div className="mb-3 flex items-baseline justify-between">
      <h2 className="text-sm font-semibold">{children}</h2>
      {aside}
    </div>
  );
}

export default SectionTitle;

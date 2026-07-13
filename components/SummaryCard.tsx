type SummaryCardProps = {
  title: string;
  children: React.ReactNode;
};

export default function SummaryCard({
  title,
  children,
}: SummaryCardProps) {
  return (
    <div className="rounded-2xl bg-gray-500 p-6 shadow-lg">
      <h2 className="mb-5 text-2xl font-bold">
        {title}
      </h2>

      {children}
    </div>
  );
}
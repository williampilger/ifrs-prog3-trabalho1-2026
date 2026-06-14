export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-2xl p-8 shadow-sm ${className}`}>
      {children}
    </div>
  );
}
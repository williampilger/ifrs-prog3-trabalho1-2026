export default function Card({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="mx-auto max-w-2xl rounded-2xl border border-border bg-white p-8 shadow-sm">
            {children}
        </div>
    );
}
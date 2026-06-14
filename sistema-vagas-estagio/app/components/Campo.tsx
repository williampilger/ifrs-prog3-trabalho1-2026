export default function Campo({
    label,
    type = "text",
    placeholder,
    value,
    onChange,
    erro,
    }:{
    label: string;
    type?: string;
    placeholder?: string;
    value: string;
    onChange: (v: string) => void;
    erro?: string;
    }) {
    return (
        <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-text-primary">{label}</label>
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="rounded-md border border-border px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        />
        {erro && <p className="text-xs text-red-600">{erro}</p>}
        </div>
    );
}
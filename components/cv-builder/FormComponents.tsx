import { X } from "lucide-react";
import React from "react";

interface FormInputProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
    error?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export function FormInput({
    label,
    description,
    error,
    icon: Icon,
    ...props
}: FormInputProps) {
    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                    <label className="block text-sm font-semibold text-gray-900">
                        {label}
                    </label>
                </div>
            )}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
            <input
                {...props}
                className={`w-full px-4 py-2 bg-white border rounded-lg outline-none shadow-sm transition-colors ${error
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-er-primary/30"
                    }`}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface FormSelectProps
    extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    description?: string;
    error?: string;
    options: Array<{ value: string | number; label: string }>;
    icon?: React.ComponentType<{ className?: string }>;
}

export function FormSelect({
    label,
    description,
    error,
    options,
    icon: Icon,
    ...props
}: FormSelectProps) {
    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                    <label className="block text-sm font-semibold text-gray-900">
                        {label}
                    </label>
                </div>
            )}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
            <select
                {...props}
                className={`w-full px-4 py-2 bg-white border rounded-lg outline-none transition-colors ${error
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-er-primary/30"
                    }`}
            >
                <option value="">Select an option</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface FormTextareaProps
    extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    description?: string;
    error?: string;
    icon?: React.ComponentType<{ className?: string }>;
}

export function FormTextarea({
    label,
    description,
    error,
    icon: Icon,
    ...props
}: FormTextareaProps) {
    return (
        <div className="space-y-2">
            {label && (
                <div className="flex items-center gap-2">
                    {Icon && <Icon className="w-4 h-4 text-gray-400" />}
                    <label className="block text-sm font-semibold text-gray-900">
                        {label}
                    </label>
                </div>
            )}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
            <textarea
                {...props}
                className={`w-full px-4 py-2 bg-white border rounded-lg outline-none transition-colors resize-vertical shadow-sm ${error
                    ? "border-red-300 focus:border-red-400"
                    : "border-gray-200 focus:border-er-primary/30"
                    }`}
            />
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
        </div>
    );
}

interface FormCheckboxProps
    extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    description?: string;
}

export function FormCheckbox({
    label,
    description,
    ...props
}: FormCheckboxProps) {
    return (
        <div className="flex items-start gap-3">
            <input
                type="checkbox"
                {...props}
                className="w-5 h-5 rounded border-gray-300 text-er-primary focus:ring-2 focus:ring-er-primary/50 mt-0.5"
            />
            <div className="flex-1">
                {label && (
                    <label className="block text-sm font-bold text-gray-900">
                        {label}
                    </label>
                )}
                {description && (
                    <p className="text-sm text-gray-500 mt-1">{description}</p>
                )}
            </div>
        </div>
    );
}

interface FormCardProps {
    children: React.ReactNode;
    onRemove?: () => void;
}

export function FormCard({ children, onRemove }: FormCardProps) {
    return (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 relative">
            {onRemove && (
                <button
                    onClick={onRemove}
                    className="absolute top-4 right-4 p-1 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition-colors"
                    aria-label="Remove"
                >
                    <X className="w-5 h-5" />
                </button>
            )}
            <div className="space-y-4">{children}</div>
        </div>
    );
}

interface FormButtonGroupProps {
    children: React.ReactNode;
    layout?: "horizontal" | "vertical";
}

export function FormButtonGroup({
    children,
    layout = "horizontal",
}: FormButtonGroupProps) {
    const layoutClass =
        layout === "vertical"
            ? "flex flex-col gap-3"
            : "flex flex-wrap gap-3";

    return <div className={layoutClass}>{children}</div>;
}

interface FormCheckboxGroupProps {
    label?: string;
    description?: string;
    options: Array<{ id: number | string; name: string }>;
    value: (number | string)[];
    onChange: (value: (number | string)[]) => void;
    columns?: number;
}

export function FormCheckboxGroup({
    label,
    description,
    options,
    value,
    onChange,
    columns = 2,
}: FormCheckboxGroupProps) {
    return (
        <div className="space-y-3">
            {label && (
                <label className="block text-sm font-bold text-gray-900">
                    {label}
                </label>
            )}
            {description && (
                <p className="text-sm text-gray-500">{description}</p>
            )}
            <div
                className="grid gap-3"
                style={{ gridTemplateColumns: `repeat(auto-fill, minmax(220px, 1fr))` }}
            >
                {options.map((opt) => {
                    const selected = value.includes(opt.id);
                    return (
                        <button
                            key={opt.id}
                            type="button"
                            onClick={() => {
                                if (!selected) onChange([...value, opt.id]);
                                else onChange(value.filter((v) => v !== opt.id));
                            }}
                            className={`flex items-center gap-3 p-3 rounded-lg transition-colors border ${selected ? 'bg-white border-er-primary/30 shadow-sm' : 'bg-gray-50 border-gray-200 hover:bg-white hover:border-gray-300'}`}
                        >
                            <input
                                type="checkbox"
                                checked={selected}
                                readOnly
                                className="hidden"
                            />
                            <span className={`w-6 h-6 rounded-full flex items-center justify-center ${selected ? 'bg-er-primary text-white' : 'bg-white text-gray-400 border border-gray-200'}`}>
                                {selected ? (
                                    <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <path d="M20 6L9 17l-5-5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                ) : (
                                    <svg className="w-3 h-3 text-gray-300" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                                        <circle cx="12" cy="12" r="6" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    </svg>
                                )}
                            </span>
                            <span className="text-sm font-medium text-gray-900">
                                {opt.name}
                            </span>
                        </button>
                    );
                })}
            </div>
        </div>
    );
}

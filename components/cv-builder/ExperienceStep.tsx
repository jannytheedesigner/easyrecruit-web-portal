import { Plus } from "lucide-react";
import { FormInput, FormSelect, FormTextarea, FormCard } from "./FormComponents";
import { WorkExperience } from "@/types/resume";

interface ExperienceStepProps {
    data: WorkExperience[];
    onChange: (experiences: WorkExperience[]) => void;
}

export function ExperienceStep({ data, onChange }: ExperienceStepProps) {
    const addExperience = () => {
        onChange([
            ...data,
            {
                organisation: "",
                role: "",
                start_date: "",
                end_date: null,
                contract_type: "full-time",
                description: "",
            },
        ]);
    };

    const updateExperience = (
        index: number,
        field: keyof WorkExperience,
        value: any
    ) => {
        const updated = [...data];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        onChange(updated);
    };

    const removeExperience = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-gray-600">
                    Add your professional work experience and employment history.
                </p>
                <button
                    onClick={addExperience}
                    className="flex items-center gap-2 px-4 py-2 bg-er-primary hover:bg-er-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Experience
                </button>
            </div>

            {data.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600">No work experience yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Click "Add Experience" to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((exp, idx) => (
                        <FormCard
                            key={idx}
                            onRemove={() => removeExperience(idx)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <FormInput
                                    label="Company / Organization"
                                    placeholder="e.g. Tech Company Ltd"
                                    value={exp.organisation}
                                    onChange={(e) =>
                                        updateExperience(idx, "organisation", e.target.value)
                                    }
                                />

                                <FormInput
                                    label="Job Title"
                                    placeholder="e.g. Senior Developer"
                                    value={exp.role}
                                    onChange={(e) =>
                                        updateExperience(idx, "role", e.target.value)
                                    }
                                />

                                <FormInput
                                    label="Start Date"
                                    type="date"
                                    value={exp.start_date}
                                    onChange={(e) =>
                                        updateExperience(idx, "start_date", e.target.value)
                                    }
                                />

                                <FormInput
                                    label="End Date (leave empty if current)"
                                    type="date"
                                    value={exp.end_date || ""}
                                    onChange={(e) =>
                                        updateExperience(
                                            idx,
                                            "end_date",
                                            e.target.value || null
                                        )
                                    }
                                />

                                <FormSelect
                                    label="Employment Type"
                                    value={exp.contract_type}
                                    onChange={(e) =>
                                        updateExperience(
                                            idx,
                                            "contract_type",
                                            e.target.value as any
                                        )
                                    }
                                    options={[
                                        { value: "full-time", label: "Full-time" },
                                        { value: "part-time", label: "Part-time" },
                                        { value: "contract", label: "Contract" },
                                        { value: "freelance", label: "Freelance" },
                                    ]}
                                />
                            </div>

                            <FormTextarea
                                label="Job Description"
                                placeholder="Describe your responsibilities, achievements, and key contributions..."
                                rows={4}
                                value={exp.description}
                                onChange={(e) =>
                                    updateExperience(idx, "description", e.target.value)
                                }
                            />
                        </FormCard>
                    ))}
                </div>
            )}
        </div>
    );
}

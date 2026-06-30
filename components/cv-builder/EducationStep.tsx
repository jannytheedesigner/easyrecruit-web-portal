import { Plus } from "lucide-react";
import { FormInput, FormCard } from "./FormComponents";
import { EducationHistory } from "@/types/resume";

interface EducationStepProps {
    data: EducationHistory[];
    onChange: (education: EducationHistory[]) => void;
}

export function EducationStep({ data, onChange }: EducationStepProps) {
    const addEducation = () => {
        onChange([
            ...data,
            {
                level: "",
                qualification: "",
                institution: "",
                year_completed: new Date().getFullYear(),
            },
        ]);
    };

    const updateEducation = (index: number, field: keyof EducationHistory, value: any) => {
        const updated = [...data];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        onChange(updated);
    };

    const removeEducation = (index: number) => {
        onChange(data.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-gray-600">
                    Add your educational qualifications and certifications.
                </p>
                <button
                    onClick={addEducation}
                    className="flex items-center gap-2 px-4 py-2 bg-er-primary hover:bg-er-primary/90 text-white font-medium rounded-lg transition-colors"
                >
                    <Plus className="w-4 h-4" />
                    Add Education
                </button>
            </div>

            {data.length === 0 ? (
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-12 text-center">
                    <p className="text-gray-600">No education entries yet.</p>
                    <p className="text-sm text-gray-500 mt-2">
                        Click "Add Education" to get started.
                    </p>
                </div>
            ) : (
                <div className="space-y-4">
                    {data.map((edu, idx) => (
                        <FormCard
                            key={idx}
                            onRemove={() => removeEducation(idx)}
                        >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                <FormInput
                                    label="Degree / Level"
                                    placeholder="e.g. Bachelor, Masters"
                                    value={edu.level}
                                    onChange={(e) =>
                                        updateEducation(idx, "level", e.target.value)
                                    }
                                />

                                <FormInput
                                    label="Field of Study"
                                    placeholder="e.g. Computer Science"
                                    value={edu.qualification}
                                    onChange={(e) =>
                                        updateEducation(idx, "qualification", e.target.value)
                                    }
                                />

                                <FormInput
                                    label="Year Completed"
                                    type="number"
                                    min="1950"
                                    max={new Date().getFullYear() + 5}
                                    value={edu.year_completed}
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        updateEducation(idx, "year_completed", val === "" ? "" : Number(val));
                                    }}
                                />
                            </div>

                            <FormInput
                                label="Institution / University"
                                placeholder="e.g. University of Malawi"
                                value={edu.institution}
                                onChange={(e) =>
                                    updateEducation(idx, "institution", e.target.value)
                                }
                            />
                        </FormCard>
                    ))}
                </div>
            )}
        </div>
    );
}

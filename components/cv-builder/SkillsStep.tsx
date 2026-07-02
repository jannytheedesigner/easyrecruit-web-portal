import { Plus, X, Zap } from "lucide-react";
import { FormSelect, FormCheckboxGroup } from "./FormComponents";
import { SkillProficiency } from "@/types/resume";

interface SkillsStepProps {
    skills: SkillProficiency[];
    interests: number[];
    categories: number[];
    availableSkills: any[];
    availableInterests: any[];
    availableCategories: any[];
    onSkillsChange: (skills: SkillProficiency[]) => void;
    onInterestsChange: (interests: number[]) => void;
    onCategoriesChange: (categories: number[]) => void;
}

export function SkillsStep({
    skills,
    interests,
    categories,
    availableSkills,
    availableInterests,
    availableCategories,
    onSkillsChange,
    onInterestsChange,
    onCategoriesChange,
}: SkillsStepProps) {
    const addSkill = (skillId: number) => {
        if (!skills.find((s) => s.id === skillId)) {
            onSkillsChange([
                ...skills,
                {
                    id: skillId,
                    proficiency_level: "intermediate",
                    years_of_experience: 1,
                },
            ]);
        }
    };

    const updateSkill = (
        index: number,
        field: keyof SkillProficiency,
        value: any
    ) => {
        const updated = [...skills];
        updated[index] = {
            ...updated[index],
            [field]: value,
        };
        onSkillsChange(updated);
    };

    const removeSkill = (index: number) => {
        onSkillsChange(skills.filter((_, i) => i !== index));
    };

    return (
        <div className="space-y-8">
            {/* Technical Skills */}

            <div className="space-y-4">
                <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-gray-600" />
                    <div>
                        <h3 className="text-lg font-bold text-gray-900 mb-0">Technical Skills</h3>
                        <p className="text-sm text-gray-600">Add the technical skills you have and your proficiency level.</p>
                    </div>
                </div>

                <div className="space-y-3 max-h-80 overflow-y-auto">
                    {skills.map((skill, idx) => {
                        const skillName = availableSkills.find(
                            (s) => s.id === skill.id
                        )?.name;
                        return (
                            <div
                                key={idx}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex gap-4 items-end"
                            >
                                <div className="flex-1">
                                    <p className="text-sm font-bold text-gray-900">
                                        {skillName || "Unknown Skill"}
                                    </p>
                                </div>

                                <FormSelect
                                    label="Proficiency"
                                    value={skill.proficiency_level}
                                    onChange={(e) =>
                                        updateSkill(
                                            idx,
                                            "proficiency_level",
                                            e.target.value as any
                                        )
                                    }
                                    options={[
                                        { value: "beginner", label: "Beginner" },
                                        { value: "intermediate", label: "Intermediate" },
                                        { value: "expert", label: "Expert" },
                                    ]}
                                />

                                <FormSelect
                                    label="Years"
                                    value={skill.years_of_experience}
                                    onChange={(e) =>
                                        updateSkill(
                                            idx,
                                            "years_of_experience",
                                            Number(e.target.value)
                                        )
                                    }
                                    options={Array.from({ length: 20 }, (_, i) => ({
                                        value: i + 1,
                                        label: `${i + 1} ${i === 0 ? "year" : "years"}`,
                                    }))}
                                />

                                <button
                                    onClick={() => removeSkill(idx)}
                                    className="p-2 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition-colors"
                                    aria-label="Remove skill"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                        );
                    })}
                </div>

                <FormSelect
                    label="Add Skill"
                    value=""
                    onChange={(e) => {
                        if (e.target.value) {
                            addSkill(Number(e.target.value));
                        }
                    }}
                    options={availableSkills
                        .filter((s) => !skills.find((sk) => sk.id === s.id))
                        .map((s) => ({
                            value: s.id,
                            label: s.name,
                        }))}
                />
            </div>

            {/* Interests */}
            <div className="pt-6 border-t border-gray-200">
                <FormCheckboxGroup
                    label="Job Interests"
                    description="Select the types of jobs you're interested in."
                    options={availableInterests}
                    value={interests}
                    onChange={(val) => onInterestsChange(val.map(Number))}
                />
            </div>

            {/* Job Categories */}
            <div className="pt-6 border-t border-gray-200">
                <FormCheckboxGroup
                    label="Preferred Job Categories"
                    description="Select the job categories you'd like to work in."
                    options={availableCategories}
                    value={categories}
                    onChange={(val) => onCategoriesChange(val.map(Number))}
                />
            </div>
        </div>
    );
}

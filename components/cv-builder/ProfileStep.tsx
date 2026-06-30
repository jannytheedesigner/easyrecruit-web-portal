import { FormInput, FormCheckbox } from "./FormComponents";
import { ProfileDetails } from "@/types/resume";

interface ProfileStepProps {
    data: ProfileDetails;
    onChange: (profile: Partial<ProfileDetails>) => void;
}

export function ProfileStep({ data, onChange }: ProfileStepProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormInput
                    label="Current Professional Title"
                    placeholder="e.g. Senior Software Engineer"
                    value={data.current_job_title}
                    onChange={(e) =>
                        onChange({ current_job_title: e.target.value })
                    }
                />

                <FormInput
                    label="Years of Experience"
                    type="number"
                    min="0"
                    value={data.experience_years}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange({ experience_years: val === "" ? "" : Number(val) } as any);
                    }}
                />

                <FormInput
                    label="Expected Annual Salary"
                    type="number"
                    min="0"
                    placeholder="e.g. 50000"
                    value={data.expected_salary}
                    onChange={(e) => {
                        const val = e.target.value;
                        onChange({ expected_salary: val === "" ? "" : Number(val) } as any);
                    }}
                />

                <FormInput
                    label="District"
                    placeholder="e.g. Lilongwe"
                    value={data.district}
                    onChange={(e) => onChange({ district: e.target.value })}
                />

                <FormInput
                    label="Town / Area"
                    placeholder="e.g. Area 47"
                    value={data.town}
                    onChange={(e) => onChange({ town: e.target.value })}
                />

                <div />
            </div>

            <div className="pt-4 border-t border-gray-200">
                <FormCheckbox
                    label="Willing to Relocate"
                    description="Let employers know if you're open to relocating for work opportunities"
                    checked={data.willing_to_relocate}
                    onChange={(e) =>
                        onChange({ willing_to_relocate: e.target.checked })
                    }
                />
            </div>
        </div>
    );
}

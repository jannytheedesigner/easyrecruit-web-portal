import { FormInput, FormSelect, FormCheckbox } from "./FormComponents";
import { ImageIcon } from "lucide-react";

interface ResumeSettingsStepProps {
    data: {
        title: string;
        template_name: string;
        is_default: boolean;
    };
    onChange: (data: any) => void;
}

export function ResumeSettingsStep({
    data,
    onChange,
}: ResumeSettingsStepProps) {
    return (
        <div className="space-y-6">
            <FormInput
                label="Resume Title"
                icon={ImageIcon}
                placeholder="e.g. Software Engineer Resume"
                description="Give your resume a memorable name so you can identify it later."
                value={data.title}
                onChange={(e) => onChange({ ...data, title: e.target.value })}
            />

            <FormSelect
                label="Template Style"
                description="Choose a professional template that best represents your style."
                value={data.template_name}
                onChange={(e) =>
                    onChange({ ...data, template_name: e.target.value })
                }
                options={[
                    { value: "modern", label: "Modern" },
                    { value: "executive", label: "Executive" },
                    { value: "minimal", label: "Minimal" },
                ]}
            />

            <div className="pt-4 border-t border-gray-200">
                <FormCheckbox
                    label="Set as Default Resume"
                    description="This resume will be used by default when applying to jobs."
                    checked={data.is_default}
                    onChange={(e) =>
                        onChange({ ...data, is_default: e.target.checked })
                    }
                />
            </div>

            <div className="bg-er-primary/5 border border-er-primary/20 rounded-lg p-6">
                <h4 className="font-bold text-er-primary-dark mb-2">What's Next?</h4>
                <p className="text-sm text-er-primary">
                    After completing these steps, we'll generate a professional PDF of
                    your resume that you can download and share with employers.
                </p>
            </div>
        </div>
    );
}

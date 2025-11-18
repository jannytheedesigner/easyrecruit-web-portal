"use client";
import { UserTypeCard } from "@/components/easycomponents/user-type-card";

interface UserTypeSelectorProps {
    selected: "jobseeker" | "employer" | null;
    onSelect: (type: "jobseeker" | "employer") => void;
}

export default function UserTypeSelector({
    selected,
    onSelect,
}: UserTypeSelectorProps) {
    return (
        <div className="grid grid-cols-2 gap-6 w-full mx-auto">
            <UserTypeCard
                type="jobseeker"
                title="I am a Job Seeker"
                details="Explore, Find Jobs, Get Hired Today"
                selected={selected === "jobseeker"}
                onSelect={() => onSelect("jobseeker")}
            />
            <UserTypeCard
                type="employer"
                title="I am an Employer"
                details="Find JobSeekers and Future Employees"
                selected={selected === "employer"}
                onSelect={() => onSelect("employer")}
            />
        </div>
    );
}

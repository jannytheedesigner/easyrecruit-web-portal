"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

/**
 * /jobseeker/cvs/[id]/edit  →  redirects to  /jobseeker/cvs/[id]
 * The preview page already has the full editor built in.
 */
export default function CVEditRedirect() {
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        router.replace(`/jobseeker/cvs/${params?.id}`);
    }, [params?.id, router]);

    return null;
}

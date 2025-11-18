"use client"

import Link from "next/link"
import { Logo } from "oxisverse-logo-system"

export function TopBar() {
    return (
        <div className="flex gap-2 container mx-auto p-6">
            <Link href="/" className="flex w-fit my-auto h-fit">
                <Logo
                    brandName="easyrecruit"
                    type="horizontal"
                    variant="main"
                    format="svg"
                    width={180}
                    height={40}
                    alt="EasyRecruit Logo"
                    className="flex w-[10em]"
                    priority
                />
            </Link>
            <div className="flex flex-row gap-2 w-fit ml-auto my-auto h-fit text-sm">
                <p className="text-sm">Having Trouble?</p>
                <Link href="/register" className="font-semibold text-er-primary">Get Help</Link>
            </div>
        </div>
    )
}

"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Logo } from "oxisverse-logo-system"

interface EmployerLogoProps {
    src?: string | null
    alt: string
    width?: number
    height?: number
    className?: string
    imageClassName?: string
    logoClassName?: string
    priority?: boolean
}

export function EmployerLogo({
    src,
    alt,
    width = 48,
    height = 48,
    className,
    imageClassName,
    logoClassName,
    priority = false,
}: EmployerLogoProps) {
    const [imgError, setImgError] = useState(false)

    // Reset error state if src changes
    useEffect(() => {
        setImgError(false);
    }, [src]);

    if (src && !imgError) {
        return (
            <Image
                src={src}
                alt={alt}
                width={width}
                height={height}
                className={`object-cover ${imageClassName || className || ""}`}
                onError={() => setImgError(true)}
                priority={priority}
            />
        )
    }

    // Fallback Logo
    return (
        <Logo
            brandName="easyrecruit"
            type="brandmark"
            variant="complimentary"
            format="svg"
            width={180}
            height={40}
            alt="EasyRecruit Logo"
            className={`flex bg-er-complimentary items-center justify-center ${logoClassName || className || ""}`}
            priority={priority}
        />
    )
}

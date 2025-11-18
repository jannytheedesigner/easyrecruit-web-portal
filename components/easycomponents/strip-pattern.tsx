import Image from "next/image";

export default function StripPattern() {
    return (
        <div>
            <Image
                src="/brand-assets/visual-assets/patterns/easyrecruit-strip-pattern.png"
                alt="Welcome Illustration"
                width={200}
                height={150}
                sizes="100vw"
                unoptimized
                className="w-full h-auto mt-auto opacity-100 select-none pointer-events-none"
            />
        </div>
    );
}
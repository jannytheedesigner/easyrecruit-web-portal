import { PublicHeader } from "@/components/layout/PublicHeader";
import { PublicFooter } from "@/components/layout/PublicFooter";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex flex-col min-h-screen bg-white">
            <PublicHeader />
            <main className="flex-grow lg:px-6 px-4 md:px-6 mx-auto lg:py-28">
                {children}
            </main>
            <PublicFooter />
        </div>
    );
}

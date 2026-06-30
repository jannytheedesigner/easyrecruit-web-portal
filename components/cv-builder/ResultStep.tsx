import { Download, Eye, CheckCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface ResultStepProps {
    resumeId: number;
    resumeTitle: string;
    pdfUrl?: string;
    isGenerating?: boolean;
}

export function ResultStep({
    resumeId,
    resumeTitle,
    pdfUrl,
    isGenerating = false,
}: ResultStepProps) {
    const handleDownload = async () => {
        if (!pdfUrl) return;

        try {
            const response = await fetch(pdfUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `${resumeTitle.replace(/\s+/g, "_")}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download PDF:", error);
        }
    };

    return (
        <div className="space-y-8">
            {/* Success Message */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-8 text-center">
                <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                <h3 className="text-2xl font-bold text-green-900 mb-2">
                    Resume Created Successfully!
                </h3>
                <p className="text-green-700">
                    Your professional resume is ready. You can now download it or view it
                    before sharing.
                </p>
            </div>

            {/* Resume Info */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <p className="text-sm text-gray-600">Resume Title</p>
                        <p className="text-lg font-bold text-gray-900">{resumeTitle}</p>
                    </div>
                    <div>
                        <p className="text-sm text-gray-600">Resume ID</p>
                        <p className="text-lg font-mono text-gray-900">{resumeId}</p>
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                    onClick={handleDownload}
                    disabled={!pdfUrl || isGenerating}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-er-primary hover:bg-er-primary/90 disabled:bg-gray-400 text-white font-bold rounded-lg transition-colors"
                >
                    <Download className="w-5 h-5" />
                    Download PDF
                </button>

                <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-colors"
                >
                    <Eye className="w-5 h-5" />
                    View Resume
                </a>
            </div>

            {/* Next Steps */}
            <div className="bg-er-primary/5 border border-er-primary/20 rounded-lg p-6 space-y-4">
                <h4 className="font-bold text-er-primary-dark">What You Can Do Now</h4>
                <ul className="space-y-2 text-sm text-er-primary">
                    <li className="flex gap-2">
                        <span>✓</span>
                        <span>Download your resume and save it locally</span>
                    </li>
                    <li className="flex gap-2">
                        <span>✓</span>
                        <span>Share your resume with employers</span>
                    </li>
                    <li className="flex gap-2">
                        <span>✓</span>
                        <span>Use it when applying for jobs on our platform</span>
                    </li>
                    <li className="flex gap-2">
                        <span>✓</span>
                        <span>Create additional resumes with different templates</span>
                    </li>
                </ul>
            </div>

            {/* Footer Actions */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <Link
                    href="/jobseeker/cvs"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-5 h-5" />
                    Back to My Resumes
                </Link>

                <Link
                    href="/jobseeker/cvs/create"
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-er-primary hover:bg-er-primary/90 text-white font-bold rounded-lg transition-colors"
                >
                    Create Another Resume
                </Link>
            </div>
        </div>
    );
}

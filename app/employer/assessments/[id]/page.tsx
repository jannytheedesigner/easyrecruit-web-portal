"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Edit, Trash2, FileQuestion, Clock, Award, CheckCircle, Users, Calendar } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Loader } from "@/components/Loader";
import { formatDate } from "@/lib/helpers";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Question {
    id: number;
    question: string;
    type: "multiple_choice" | "true_false" | "short_answer";
    options?: string[];
    correct_answer: string;
    points: number;
}

interface Assessment {
    id: number;
    title: string;
    description: string;
    type: "quiz" | "assignment" | "test";
    duration: number;
    passing_score: number;
    questions_count: number;
    status: "draft" | "published" | "archived";
    questions: Question[];
    created_at: string;
    updated_at: string;
}

export default function AssessmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [assessment, setAssessment] = useState<Assessment | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            fetchAssessment();
        }
    }, [params.id]);

    const fetchAssessment = async () => {
        try {
            const response = await axiosClient.get(`/assessments/${params.id}`);
            setAssessment(response.data?.data || response.data);
        } catch (error) {
            console.error("Failed to fetch assessment:", error);
        } finally {
            setLoading(false);
        }
    };

    const deleteAssessment = async () => {
        if (!confirm("Are you sure you want to delete this assessment?")) return;
        try {
            await axiosClient.delete(`/assessments/${params.id}`);
            router.push("/employer/assessments");
        } catch (error) {
            console.error("Failed to delete assessment:", error);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "published":
                return "bg-green-100 text-green-700 border-green-200";
            case "draft":
                return "bg-yellow-100 text-yellow-700 border-yellow-200";
            case "archived":
                return "bg-gray-100 text-gray-700 border-gray-200";
            default:
                return "bg-gray-100 text-gray-700 border-gray-200";
        }
    };

    const getTypeColor = (type: string) => {
        switch (type) {
            case "quiz":
                return "bg-blue-100 text-blue-700";
            case "assignment":
                return "bg-purple-100 text-purple-700";
            case "test":
                return "bg-orange-100 text-orange-700";
            default:
                return "bg-gray-100 text-gray-700";
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full py-20">
                <Loader size="lg" />
            </div>
        );
    }

    if (!assessment) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Assessment not found</h2>
                <Link href="/employer/assessments">
                    <Button>Back to Assessments</Button>
                </Link>
            </div>
        );
    }

    const totalPoints = assessment.questions?.reduce((sum, q) => sum + q.points, 0) || 0;

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Link href="/employer/assessments">
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="w-4 h-4" />
                                Back
                            </Button>
                        </Link>
                        <div className="p-3 bg-gradient-to-br from-primary to-blue-600 rounded-xl shadow-lg">
                            <FileQuestion className="w-6 h-6 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">{assessment.title}</h1>
                            <p className="text-gray-600 mt-1">Assessment Details</p>
                        </div>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Link href={`/employer/assessments/${assessment.id}/edit`}>
                        <Button variant="outline">
                            <Edit className="w-4 h-4" />
                            Edit
                        </Button>
                    </Link>
                    <Button onClick={deleteAssessment} variant="outline" className="text-red-600 hover:bg-red-50">
                        <Trash2 className="w-4 h-4" />
                        Delete
                    </Button>
                </div>
            </div>

            {/* Overview */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <div className="flex items-start justify-between mb-6">
                    <div>
                        <div className="flex items-center gap-2 mb-2">
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(assessment.type)}`}>
                                {assessment.type.toUpperCase()}
                            </span>
                            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(assessment.status)}`}>
                                {assessment.status.toUpperCase()}
                            </span>
                        </div>
                        <p className="text-gray-600 mt-2">{assessment.description}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500 text-white rounded-lg">
                                <FileQuestion className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-blue-700 font-medium">Questions</div>
                                <div className="text-2xl font-bold text-blue-900">{assessment.questions_count}</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 border border-purple-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-500 text-white rounded-lg">
                                <Clock className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-purple-700 font-medium">Duration</div>
                                <div className="text-2xl font-bold text-purple-900">{assessment.duration} min</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 border border-green-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-500 text-white rounded-lg">
                                <Award className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-green-700 font-medium">Passing Score</div>
                                <div className="text-2xl font-bold text-green-900">{assessment.passing_score}%</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200 rounded-xl p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-500 text-white rounded-lg">
                                <CheckCircle className="w-5 h-5" />
                            </div>
                            <div>
                                <div className="text-sm text-orange-700 font-medium">Total Points</div>
                                <div className="text-2xl font-bold text-orange-900">{totalPoints}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mt-6 pt-6 border-t border-gray-200 flex items-center gap-6 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Created: {formatDate(assessment.created_at)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Updated: {formatDate(assessment.updated_at)}</span>
                    </div>
                </div>
            </div>

            {/* Questions */}
            <div className="bg-white rounded-2xl border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-6">Questions</h2>
                <div className="space-y-6">
                    {assessment.questions?.map((question, index) => (
                        <div key={question.id} className="border border-gray-200 rounded-xl p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="px-3 py-1 bg-primary text-white rounded-full text-xs font-semibold">
                                            Question {index + 1}
                                        </span>
                                        <span className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-semibold">
                                            {question.type.replace("_", " ").toUpperCase()}
                                        </span>
                                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
                                            {question.points} {question.points === 1 ? "point" : "points"}
                                        </span>
                                    </div>
                                    <h3 className="text-lg font-medium text-gray-900">{question.question}</h3>
                                </div>
                            </div>

                            {question.type === "multiple_choice" && question.options && (
                                <div className="mt-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Options:</div>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                        {question.options.map((option, oIndex) => (
                                            <div
                                                key={oIndex}
                                                className={`p-3 rounded-lg border ${option === question.correct_answer
                                                        ? "bg-green-50 border-green-300 text-green-900"
                                                        : "bg-gray-50 border-gray-200 text-gray-700"
                                                    }`}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {option === question.correct_answer && (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    )}
                                                    <span>{option}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {question.type !== "multiple_choice" && (
                                <div className="mt-4">
                                    <div className="text-sm font-medium text-gray-700 mb-2">Correct Answer:</div>
                                    <div className="p-3 bg-green-50 border border-green-300 rounded-lg text-green-900">
                                        {question.correct_answer}
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}

                    {(!assessment.questions || assessment.questions.length === 0) && (
                        <div className="text-center py-12 text-gray-500">
                            No questions added yet. Edit this assessment to add questions.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

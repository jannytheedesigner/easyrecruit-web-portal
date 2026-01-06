"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Save, Plus, Trash2, ArrowLeft, FileQuestion } from "lucide-react";
import axiosClient from "@/lib/axiosClient";
import { Button } from "@/components/ui/button";
import Link from "next/link";

interface Question {
    id?: number;
    question: string;
    type: "multiple_choice" | "true_false" | "short_answer";
    options?: string[];
    correct_answer: string;
    points: number;
}

export default function CreateAssessmentPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        type: "quiz" as "quiz" | "assignment" | "test",
        duration: 30,
        passing_score: 70,
        status: "draft" as "draft" | "published",
    });
    const [questions, setQuestions] = useState<Question[]>([
        {
            question: "",
            type: "multiple_choice",
            options: ["", "", "", ""],
            correct_answer: "",
            points: 1,
        },
    ]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload = {
                ...formData,
                questions,
                questions_count: questions.length,
            };

            const response = await axiosClient.post("/assessments", payload);
            router.push("/employer/assessments");
        } catch (error) {
            console.error("Failed to create assessment:", error);
            alert("Failed to create assessment. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const addQuestion = () => {
        setQuestions([
            ...questions,
            {
                question: "",
                type: "multiple_choice",
                options: ["", "", "", ""],
                correct_answer: "",
                points: 1,
            },
        ]);
    };

    const removeQuestion = (index: number) => {
        setQuestions(questions.filter((_, i) => i !== index));
    };

    const updateQuestion = (index: number, field: string, value: any) => {
        const updated = [...questions];
        updated[index] = { ...updated[index], [field]: value };
        setQuestions(updated);
    };

    const updateOption = (questionIndex: number, optionIndex: number, value: string) => {
        const updated = [...questions];
        const options = [...(updated[questionIndex].options || [])];
        options[optionIndex] = value;
        updated[questionIndex] = { ...updated[questionIndex], options };
        setQuestions(updated);
    };

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
                            <h1 className="text-3xl font-bold text-gray-900">Create Assessment</h1>
                            <p className="text-gray-600 mt-1">Create a new quiz or assessment for candidates</p>
                        </div>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Basic Information */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <h2 className="text-xl font-semibold mb-6">Basic Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assessment Title *
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                required
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="e.g., JavaScript Fundamentals Quiz"
                            />
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Description *
                            </label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                required
                                rows={4}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                placeholder="Describe what this assessment covers..."
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Assessment Type *
                            </label>
                            <select
                                value={formData.type}
                                onChange={(e) => setFormData({ ...formData, type: e.target.value as any })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="quiz">Quiz</option>
                                <option value="assignment">Assignment</option>
                                <option value="test">Test</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes) *
                            </label>
                            <input
                                type="number"
                                value={formData.duration}
                                onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) })}
                                required
                                min="1"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Passing Score (%) *
                            </label>
                            <input
                                type="number"
                                value={formData.passing_score}
                                onChange={(e) => setFormData({ ...formData, passing_score: parseInt(e.target.value) })}
                                required
                                min="0"
                                max="100"
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Status *
                            </label>
                            <select
                                value={formData.status}
                                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                            >
                                <option value="draft">Draft</option>
                                <option value="published">Published</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Questions */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-semibold">Questions ({questions.length})</h2>
                        <Button type="button" onClick={addQuestion} variant="outline">
                            <Plus className="w-4 h-4" />
                            Add Question
                        </Button>
                    </div>

                    <div className="space-y-6">
                        {questions.map((question, qIndex) => (
                            <div key={qIndex} className="border border-gray-200 rounded-xl p-6 relative">
                                <div className="absolute top-4 right-4">
                                    <Button
                                        type="button"
                                        onClick={() => removeQuestion(qIndex)}
                                        variant="outline"
                                        size="sm"
                                        className="text-red-600 hover:bg-red-50"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </div>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Question {qIndex + 1} *
                                        </label>
                                        <input
                                            type="text"
                                            value={question.question}
                                            onChange={(e) => updateQuestion(qIndex, "question", e.target.value)}
                                            required
                                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            placeholder="Enter your question..."
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Question Type *
                                            </label>
                                            <select
                                                value={question.type}
                                                onChange={(e) => updateQuestion(qIndex, "type", e.target.value)}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            >
                                                <option value="multiple_choice">Multiple Choice</option>
                                                <option value="true_false">True/False</option>
                                                <option value="short_answer">Short Answer</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Points *
                                            </label>
                                            <input
                                                type="number"
                                                value={question.points}
                                                onChange={(e) => updateQuestion(qIndex, "points", parseInt(e.target.value))}
                                                required
                                                min="1"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Correct Answer *
                                            </label>
                                            <input
                                                type="text"
                                                value={question.correct_answer}
                                                onChange={(e) => updateQuestion(qIndex, "correct_answer", e.target.value)}
                                                required
                                                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                placeholder={question.type === "true_false" ? "true or false" : "Answer"}
                                            />
                                        </div>
                                    </div>

                                    {question.type === "multiple_choice" && (
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Options
                                            </label>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {question.options?.map((option, oIndex) => (
                                                    <input
                                                        key={oIndex}
                                                        type="text"
                                                        value={option}
                                                        onChange={(e) => updateOption(qIndex, oIndex, e.target.value)}
                                                        className="px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                                                        placeholder={`Option ${oIndex + 1}`}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-4">
                    <Link href="/employer/assessments">
                        <Button type="button" variant="outline">
                            Cancel
                        </Button>
                    </Link>
                    <Button type="submit" disabled={loading} className="bg-primary text-white">
                        <Save className="w-4 h-4" />
                        {loading ? "Saving..." : "Save Assessment"}
                    </Button>
                </div>
            </form>
        </div>
    );
}

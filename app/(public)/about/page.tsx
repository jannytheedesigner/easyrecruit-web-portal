import { Logo } from "oxisverse-logo-system";
import { Users, Globe, Award, Heart } from "lucide-react";

export default function AboutPage() {
    return (
        <div className="flex flex-col min-h-screen">
            {/* Hero */}
            <section className="bg-white py-20 lg:py-32">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
                        Empowering Africa's Workforce
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        We're on a mission to connect talent with opportunity, fostering economic growth and innovation across the continent.
                    </p>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="py-20 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-2 gap-16 items-center">
                        <div className="aspect-square bg-blue-100 rounded-2xl p-8 relative overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-er-primary opacity-90"></div>
                            <div className="relative z-10 h-full flex items-center justify-center text-white">
                                <Logo
                                    brandName="easyrecruit"
                                    type="brandmark"
                                    variant="main"
                                    format="svg"
                                    width={150}
                                    height={150}
                                    alt="EasyRecruit Icon"
                                    className="bg-white rounded-full p-4"
                                />
                            </div>
                        </div>
                        <div>
                            <h2 className="text-3xl font-bold mb-6">Our Vision</h2>
                            <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                                We envision a world where every individual has access to meaningful work and every company can find the talent they need to thrive, regardless of location.
                            </p>
                            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
                            <p className="text-lg text-gray-600 leading-relaxed">
                                To build the most trusted and efficient recruitment infrastructure in Africa, leveraging technology to remove barriers and create seamless connections.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-24 bg-white">
                <div className="container mx-auto px-4">
                    <div className="grid md:grid-cols-4 gap-8 text-center">
                        {[
                            { icon: <Globe className="w-10 h-10 text-blue-500" />, title: "Pan-African", desc: "Building specifically for the African context." },
                            { icon: <Award className="w-10 h-10 text-yellow-500" />, title: "Excellence", desc: "Committed to the highest quality standards." },
                            { icon: <Users className="w-10 h-10 text-green-500" />, title: "Community", desc: "People first, always." },
                            { icon: <Heart className="w-10 h-10 text-red-500" />, title: "Passion", desc: "Driven by a desire to make a difference." }
                        ].map((v, i) => (
                            <div key={i} className="p-6">
                                <div className="mx-auto w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                    {v.icon}
                                </div>
                                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                                <p className="text-gray-600">{v.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    );
}

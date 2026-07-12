import Link from "next/link";
import { ArrowRight, Code2, BookOpen, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 animated-gradient opacity-30" />
        
        <div className="relative container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-blue-500/10 border border-blue-500/20 rounded-full px-4 py-2 mb-8">
              <Sparkles className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-blue-300">44 Real-World Problems · Complete Implementations</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              Master Low-Level Design
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed">
              Complete 4-week curriculum with production-ready implementations, 
              comprehensive diagrams, and battle-tested design patterns.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/problems"
                className="inline-flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg hover:shadow-blue-500/50"
              >
                <span>Explore Problems</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
              
              <Link
                href="/docs"
                className="inline-flex items-center justify-center space-x-2 bg-gray-800 hover:bg-gray-700 text-white px-8 py-4 rounded-lg font-semibold transition-all border border-gray-700"
              >
                <BookOpen className="w-5 h-5" />
                <span>Read the Docs</span>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-900/50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            Everything You Need to Master LLD
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <FeatureCard
              icon={<Code2 className="w-8 h-8 text-blue-500" />}
              title="44 Real Problems"
              description="From Parking Lot to Uber. Each with complete working implementations in Java."
              link="/problems"
            />
            <FeatureCard
              icon={<BookOpen className="w-8 h-8 text-purple-500" />}
              title="4-Week Curriculum"
              description="Structured learning path from foundations to advanced system design with daily exercises."
              link="/curriculum"
            />
            <FeatureCard
              icon={<Sparkles className="w-8 h-8 text-pink-500" />}
              title="23 Design Patterns"
              description="Complete catalog of Gang of Four patterns with real-world examples and use cases."
              link="/patterns"
            />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 max-w-6xl mx-auto text-center">
            <StatCard number="44" label="LLD Problems" />
            <StatCard number="23" label="Design Patterns" />
            <StatCard number="20" label="Learning Days" />
            <StatCard number="540+" label="Java Files" />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600/10 to-purple-600/10 border-y border-gray-800">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Level Up Your Design Skills?
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Start with any problem and work your way through the curriculum.
            All implementations are production-ready and interview-tested.
          </p>
          <Link
            href="/problems"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-lg"
          >
            <span>Browse All Problems</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description, link }: { icon: React.ReactNode; title: string; description: string; link?: string }) {
  const content = (
    <>
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400">{description}</p>
      {link && (
        <div className="mt-4 text-blue-400 text-sm font-medium flex items-center">
          Explore →
        </div>
      )}
    </>
  );

  if (link) {
    return (
      <Link href={link} className="block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all hover:transform hover:scale-105">
        {content}
      </Link>
    );
  }

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all hover:transform hover:scale-105">
      {content}
    </div>
  );
}

function StatCard({ number, label }: { number: string; label: string }) {
  return (
    <div className="bg-gray-800/30 rounded-xl p-6 border border-gray-800">
      <div className="text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent mb-2">
        {number}
      </div>
      <div className="text-gray-400">{label}</div>
    </div>
  );
}

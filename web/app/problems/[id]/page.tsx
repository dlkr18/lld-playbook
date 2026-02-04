import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, BookOpen, Code2, FileText } from "lucide-react";
import { getProblemById, problems } from "@/lib/problems";

export const dynamic = "force-dynamic";

export async function generateStaticParams() {
  return problems.map((problem) => ({
    id: problem.id,
  }));
}

export default function ProblemPage({ params }: { params: { id: string } }) {
  const problem = getProblemById(params.id);

  if (!problem) {
    notFound();
  }

  const difficultyColors = {
    Easy: "text-green-400 bg-green-500/10 border-green-500/20",
    Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
    Hard: "text-red-400 bg-red-500/10 border-red-500/20",
  };

  const docsBaseUrl = "/docs/problems";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <Link
        href="/problems"
        className="inline-flex items-center space-x-2 text-gray-400 hover:text-white transition-colors mb-8"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Problems</span>
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-4 mb-4">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
            {problem.title}
          </h1>
          <span
            className={`px-4 py-2 rounded-full text-sm font-medium border ${
              difficultyColors[problem.difficulty]
            }`}
          >
            {problem.difficulty}
          </span>
        </div>

        <p className="text-xl text-gray-300 mb-6">{problem.description}</p>

        <div className="flex flex-wrap gap-2 mb-6">
          {problem.topics.map((topic) => (
            <span
              key={topic}
              className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm border border-gray-700"
            >
              {topic}
            </span>
          ))}
        </div>

        <div className="text-gray-500">Category: {problem.category}</div>
      </div>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-4 mb-12">
        <QuickLinkCard
          icon={<BookOpen className="w-6 h-6" />}
          title="Documentation"
          description="View detailed requirements and design"
          href={`${docsBaseUrl}/${problem.id}/README`}
        />
        <QuickLinkCard
          icon={<Code2 className="w-6 h-6" />}
          title="Implementation"
          description="Browse complete source code"
          href={`${docsBaseUrl}/${problem.id}/CODE`}
        />
        <QuickLinkCard
          icon={<FileText className="w-6 h-6" />}
          title="Diagrams"
          description="See class, sequence, and state diagrams"
          href={`${docsBaseUrl}/${problem.id}/README`}
        />
      </div>

      {/* Features Section */}
      <div className="bg-gray-800/50 rounded-xl p-8 border border-gray-700 mb-8">
        <h2 className="text-2xl font-bold mb-6">What's Included</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <FeatureItem
            title="Complete Implementation"
            description="Production-ready Java code with all classes and interfaces"
            available={problem.hasImplementation}
          />
          <FeatureItem
            title="Visual Diagrams"
            description="Class diagrams, sequence flows, and state machines"
            available={problem.hasDiagrams}
          />
          <FeatureItem
            title="SOLID Principles"
            description="Clean architecture following best practices"
            available={true}
          />
          <FeatureItem
            title="Design Patterns"
            description="Real-world application of Gang of Four patterns"
            available={true}
          />
        </div>
      </div>

      {/* Learning Outcomes */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl p-8 border border-gray-700">
        <h2 className="text-2xl font-bold mb-4">What You'll Learn</h2>
        <ul className="space-y-3 text-gray-300">
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span>How to break down complex requirements into manageable components</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span>Applying design patterns to solve real-world problems</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span>Writing clean, maintainable, and extensible code</span>
          </li>
          <li className="flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span>Understanding trade-offs in different design decisions</span>
          </li>
        </ul>
      </div>
    </div>
  );
}

function QuickLinkCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:transform hover:scale-105 group"
    >
      <div className="text-blue-400 mb-3 group-hover:scale-110 transition-transform">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2 group-hover:text-blue-400 transition-colors">
        {title}
      </h3>
      <p className="text-sm text-gray-400">{description}</p>
    </a>
  );
}

function FeatureItem({
  title,
  description,
  available,
}: {
  title: string;
  description: string;
  available: boolean;
}) {
  return (
    <div className="flex items-start space-x-3">
      <div
        className={`mt-1 w-5 h-5 rounded-full flex items-center justify-center ${
          available ? "bg-green-500/20 text-green-400" : "bg-gray-700 text-gray-500"
        }`}
      >
        {available && <span className="text-xs">✓</span>}
      </div>
      <div>
        <h3 className="font-semibold mb-1">{title}</h3>
        <p className="text-sm text-gray-400">{description}</p>
      </div>
    </div>
  );
}

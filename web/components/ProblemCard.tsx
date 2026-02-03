import Link from "next/link";
import { Code2, CheckCircle2, FileText } from "lucide-react";
import type { Problem } from "@/lib/problems";

const difficultyColors = {
  Easy: "text-green-400 bg-green-500/10 border-green-500/20",
  Medium: "text-yellow-400 bg-yellow-500/10 border-yellow-500/20",
  Hard: "text-red-400 bg-red-500/10 border-red-500/20",
};

export function ProblemCard({ problem }: { problem: Problem }) {
  return (
    <Link
      href={`/problems/${problem.id}`}
      className="block bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl p-6 hover:border-blue-500/50 transition-all hover:transform hover:scale-[1.02] group"
    >
      <div className="flex items-start justify-between mb-4">
        <h3 className="text-xl font-semibold group-hover:text-blue-400 transition-colors">
          {problem.title}
        </h3>
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium border ${
            difficultyColors[problem.difficulty]
          }`}
        >
          {problem.difficulty}
        </span>
      </div>

      <p className="text-gray-400 text-sm mb-4 line-clamp-2">
        {problem.description}
      </p>

      <div className="flex flex-wrap gap-2 mb-4">
        {problem.topics.slice(0, 3).map((topic) => (
          <span
            key={topic}
            className="text-xs bg-gray-700/50 text-gray-300 px-2 py-1 rounded"
          >
            {topic}
          </span>
        ))}
        {problem.topics.length > 3 && (
          <span className="text-xs text-gray-500 px-2 py-1">
            +{problem.topics.length - 3} more
          </span>
        )}
      </div>

      <div className="flex items-center gap-4 text-sm text-gray-500">
        {problem.hasImplementation && (
          <div className="flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-green-400" />
            <span>Implementation</span>
          </div>
        )}
        {problem.hasDiagrams && (
          <div className="flex items-center gap-1">
            <FileText className="w-4 h-4 text-blue-400" />
            <span>Diagrams</span>
          </div>
        )}
      </div>

      <div className="text-xs text-gray-600 mt-3 pt-3 border-t border-gray-700">
        {problem.category}
      </div>
    </Link>
  );
}

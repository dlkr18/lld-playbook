"use client";

import { useState, useMemo } from "react";
import { Search, Filter } from "lucide-react";
import { problems, type Difficulty } from "@/lib/problems";
import { ProblemCard } from "@/components/ProblemCard";

export default function ProblemsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty | "All">("All");

  const filteredProblems = useMemo(() => {
    let filtered = problems;

    // Filter by difficulty
    if (selectedDifficulty !== "All") {
      filtered = filtered.filter(p => p.difficulty === selectedDifficulty);
    }

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        p =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.topics.some(t => t.toLowerCase().includes(query)) ||
          p.category.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [searchQuery, selectedDifficulty]);

  const easyCount = problems.filter(p => p.difficulty === "Easy").length;
  const mediumCount = problems.filter(p => p.difficulty === "Medium").length;
  const hardCount = problems.filter(p => p.difficulty === "Hard").length;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          All Problems
        </h1>
        <p className="text-xl text-gray-400">
          {problems.length} real-world low-level design problems with complete implementations
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total" count={problems.length} color="blue" />
        <StatCard label="Easy" count={easyCount} color="green" />
        <StatCard label="Medium" count={mediumCount} color="yellow" />
        <StatCard label="Hard" count={hardCount} color="red" />
      </div>

      {/* Filters */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-col md:flex-row gap-4">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search problems, topics, or categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-gray-900 border border-gray-700 rounded-lg pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Difficulty Filter */}
          <div className="flex gap-2">
            <FilterButton
              label="All"
              active={selectedDifficulty === "All"}
              onClick={() => setSelectedDifficulty("All")}
              count={problems.length}
            />
            <FilterButton
              label="Easy"
              active={selectedDifficulty === "Easy"}
              onClick={() => setSelectedDifficulty("Easy")}
              count={easyCount}
              color="green"
            />
            <FilterButton
              label="Medium"
              active={selectedDifficulty === "Medium"}
              onClick={() => setSelectedDifficulty("Medium")}
              count={mediumCount}
              color="yellow"
            />
            <FilterButton
              label="Hard"
              active={selectedDifficulty === "Hard"}
              onClick={() => setSelectedDifficulty("Hard")}
              count={hardCount}
              color="red"
            />
          </div>
        </div>
      </div>

      {/* Results */}
      <div className="mb-4 text-gray-400">
        Showing {filteredProblems.length} of {problems.length} problems
      </div>

      {/* Problems Grid */}
      {filteredProblems.length > 0 ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProblems.map((problem) => (
            <ProblemCard key={problem.id} problem={problem} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20">
          <Filter className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-2xl font-semibold text-gray-400 mb-2">No problems found</h3>
          <p className="text-gray-500">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  const colorClasses = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    green: "from-green-500/20 to-green-600/20 border-green-500/30",
    yellow: "from-yellow-500/20 to-yellow-600/20 border-yellow-500/30",
    red: "from-red-500/20 to-red-600/20 border-red-500/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color as keyof typeof colorClasses]} border rounded-lg p-4`}>
      <div className="text-3xl font-bold text-white mb-1">{count}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
}

function FilterButton({
  label,
  active,
  onClick,
  count,
  color,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  count?: number;
  color?: string;
}) {
  const baseClasses = "px-4 py-2 rounded-lg font-medium transition-all";
  const activeClasses = active
    ? "bg-blue-600 text-white"
    : "bg-gray-700 text-gray-300 hover:bg-gray-600";

  return (
    <button onClick={onClick} className={`${baseClasses} ${activeClasses}`}>
      {label}
      {count !== undefined && <span className="ml-2 text-sm opacity-75">({count})</span>}
    </button>
  );
}

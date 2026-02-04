"use client";

import { useState } from "react";
import Link from "next/link";
import { designPatterns, getPatternsByCategory, type DesignPattern } from "@/lib/curriculum";
import { Sparkles, Box, Workflow, Zap } from "lucide-react";

const categories = ["All", "Creational", "Structural", "Behavioral"];

const categoryIcons = {
  Creational: <Sparkles className="w-5 h-5" />,
  Structural: <Box className="w-5 h-5" />,
  Behavioral: <Workflow className="w-5 h-5" />,
};

const categoryColors = {
  Creational: "from-blue-500/20 to-cyan-500/20 border-blue-500/30",
  Structural: "from-purple-500/20 to-pink-500/20 border-purple-500/30",
  Behavioral: "from-orange-500/20 to-red-500/20 border-orange-500/30",
};

export default function PatternsPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");

  const filteredPatterns =
    selectedCategory === "All"
      ? designPatterns
      : getPatternsByCategory(selectedCategory);

  const creationalCount = designPatterns.filter(p => p.category === "Creational").length;
  const structuralCount = designPatterns.filter(p => p.category === "Structural").length;
  const behavioralCount = designPatterns.filter(p => p.category === "Behavioral").length;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          Design Patterns Catalog
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          All 23 Gang of Four patterns with Java examples and real-world use cases
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total Patterns" count={23} color="blue" />
        <StatCard label="Creational" count={creationalCount} color="blue" />
        <StatCard label="Structural" count={structuralCount} color="purple" />
        <StatCard label="Behavioral" count={behavioralCount} color="orange" />
      </div>

      {/* Category Filter */}
      <div className="bg-gray-800/50 rounded-xl p-6 mb-8 border border-gray-700">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                selectedCategory === category
                  ? "bg-blue-600 text-white"
                  : "bg-gray-700 text-gray-300 hover:bg-gray-600"
              }`}
            >
              {category}
              {category !== "All" && (
                <span className="ml-2 text-sm opacity-75">
                  (
                  {category === "Creational"
                    ? creationalCount
                    : category === "Structural"
                    ? structuralCount
                    : behavioralCount}
                  )
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Pattern Categories Overview */}
      {selectedCategory === "All" && (
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          <CategoryCard
            title="Creational Patterns"
            description="Object creation mechanisms"
            count={creationalCount}
            icon={categoryIcons.Creational}
            color="blue"
          />
          <CategoryCard
            title="Structural Patterns"
            description="Object composition"
            count={structuralCount}
            icon={categoryIcons.Structural}
            color="purple"
          />
          <CategoryCard
            title="Behavioral Patterns"
            description="Object communication"
            count={behavioralCount}
            icon={categoryIcons.Behavioral}
            color="orange"
          />
        </div>
      )}

      {/* Results */}
      <div className="mb-4 text-gray-400">
        Showing {filteredPatterns.length} of {designPatterns.length} patterns
      </div>

      {/* Patterns Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredPatterns.map((pattern) => (
          <PatternCard key={pattern.name} pattern={pattern} />
        ))}
      </div>

      {/* Full Reference Link */}
      <div className="mt-12 text-center bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-700 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Want More Details?</h2>
        <p className="text-gray-300 mb-6">
          Access the complete design patterns catalog with code examples and implementations
        </p>
        <Link
          href="/docs/foundations/DESIGN_PATTERNS_CATALOG"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <Zap className="w-5 h-5" />
          <span>View Complete Catalog</span>
        </Link>
      </div>
    </div>
  );
}

function StatCard({ label, count, color }: { label: string; count: number; color: string }) {
  const colorClasses: Record<string, string> = {
    blue: "from-blue-500/20 to-blue-600/20 border-blue-500/30",
    purple: "from-purple-500/20 to-purple-600/20 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/20 border-orange-500/30",
  };

  return (
    <div className={`bg-gradient-to-br ${colorClasses[color]} border rounded-lg p-4`}>
      <div className="text-3xl font-bold text-white mb-1">{count}</div>
      <div className="text-sm text-gray-300">{label}</div>
    </div>
  );
}

function CategoryCard({
  title,
  description,
  count,
  icon,
  color,
}: {
  title: string;
  description: string;
  count: number;
  icon: React.ReactNode;
  color: string;
}) {
  const colorClasses: Record<string, string> = {
    blue: "text-blue-400 bg-blue-500/10",
    purple: "text-purple-400 bg-purple-500/10",
    orange: "text-orange-400 bg-orange-500/10",
  };

  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 hover:border-gray-600 transition-all">
      <div className={`${colorClasses[color]} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-gray-400 text-sm mb-3">{description}</p>
      <div className="text-2xl font-bold text-white">{count} patterns</div>
    </div>
  );
}

function PatternCard({ pattern }: { pattern: DesignPattern }) {
  return (
    <div
      className={`bg-gradient-to-br ${
        categoryColors[pattern.category]
      } border rounded-xl p-6 hover:transform hover:scale-[1.02] transition-all`}
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="text-xl font-bold">{pattern.name}</h3>
        <span className="text-xs bg-gray-900/50 px-2 py-1 rounded-full border border-gray-700">
          {pattern.category}
        </span>
      </div>

      <p className="text-sm text-gray-300 mb-4">{pattern.description}</p>

      <div className="mb-4">
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Use Cases:</h4>
        <p className="text-sm text-gray-300">{pattern.useCase}</p>
      </div>

      <div>
        <h4 className="text-xs font-semibold text-gray-400 mb-2">Examples:</h4>
        <div className="flex flex-wrap gap-2">
          {pattern.examples.slice(0, 3).map((example) => (
            <span
              key={example}
              className="text-xs bg-gray-900/50 text-gray-300 px-2 py-1 rounded border border-gray-700"
            >
              {example}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}

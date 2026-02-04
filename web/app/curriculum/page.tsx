import Link from "next/link";
import { Calendar, BookOpen, Code2, Target } from "lucide-react";
import { curriculum, getCurriculumByWeek } from "@/lib/curriculum";

export default function CurriculumPage() {
  const weeks = [1, 2, 3, 4];

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-12">
        <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
          4-Week LLD Curriculum
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Structured learning path from foundations to advanced system design
        </p>
        <div className="flex flex-wrap gap-4 text-sm">
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
            <Calendar className="w-4 h-4 text-blue-400" />
            <span>20 days + weekend projects</span>
          </div>
          <div className="flex items-center gap-2 bg-gray-800/50 px-4 py-2 rounded-lg border border-gray-700">
            <Target className="w-4 h-4 text-purple-400" />
            <span>2-3h weekdays, 4-5h weekends</span>
          </div>
        </div>
      </div>

      {/* Overview */}
      <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-gray-700 rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold mb-6">Learning Path Overview</h2>
        <div className="grid md:grid-cols-4 gap-6">
          <WeekOverview
            week={1}
            title="Foundations"
            topics={["SOLID Principles", "UML Diagrams", "Domain Modeling"]}
            project="Parking Lot"
          />
          <WeekOverview
            week={2}
            title="Design Patterns"
            topics={["Creational", "Structural", "Behavioral"]}
            project="Elevator System"
          />
          <WeekOverview
            week={3}
            title="Infrastructure"
            topics={["Rate Limiter", "KV Store", "Search"]}
            project="BookMyShow"
          />
          <WeekOverview
            week={4}
            title="Advanced Systems"
            topics={["Splitwise", "Game Design", "Logging"]}
            project="Capstone"
          />
        </div>
      </div>

      {/* Detailed Curriculum */}
      <div className="space-y-8">
        {weeks.map((week) => {
          const days = getCurriculumByWeek(week);
          return (
            <div key={week} className="bg-gray-800/30 border border-gray-700 rounded-xl p-6">
              <h2 className="text-3xl font-bold mb-6">
                Week {week}:{" "}
                {week === 1 && "Foundations & OO Modeling"}
                {week === 2 && "Patterns & Persistence"}
                {week === 3 && "Services & Infrastructure"}
                {week === 4 && "Advanced Cases & Interview Drills"}
              </h2>
              <div className="space-y-4">
                {days.map((day) => (
                  <DayCard key={`${day.week}-${day.day}`} day={day} />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* CTA */}
      <div className="mt-12 text-center bg-gray-800/50 border border-gray-700 rounded-xl p-8">
        <h2 className="text-2xl font-bold mb-4">Ready to Start Learning?</h2>
        <p className="text-gray-300 mb-6">
          Jump into any topic or follow the structured path from day 1
        </p>
        <Link
          href="/problems"
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-all"
        >
          <Code2 className="w-5 h-5" />
          <span>Browse All Problems</span>
        </Link>
      </div>
    </div>
  );
}

function WeekOverview({ week, title, topics, project }: {
  week: number;
  title: string;
  topics: string[];
  project: string;
}) {
  return (
    <div className="bg-gray-800/50 border border-gray-700 rounded-lg p-4">
      <div className="text-sm text-blue-400 font-semibold mb-2">Week {week}</div>
      <h3 className="text-lg font-bold mb-3">{title}</h3>
      <ul className="space-y-1 mb-4">
        {topics.map((topic) => (
          <li key={topic} className="text-sm text-gray-400 flex items-start">
            <span className="text-blue-400 mr-2">•</span>
            <span>{topic}</span>
          </li>
        ))}
      </ul>
      <div className="text-sm">
        <span className="text-gray-500">Project: </span>
        <span className="text-gray-300 font-medium">{project}</span>
      </div>
    </div>
  );
}

function DayCard({ day }: { day: any }) {
  return (
    <div className="bg-gray-900/50 border border-gray-700 rounded-lg p-5 hover:border-blue-500/50 transition-colors">
      <div className="flex items-start justify-between mb-3">
        <div>
          <div className="text-sm text-blue-400 font-semibold mb-1">
            Day {day.day}
          </div>
          <h3 className="text-xl font-bold">{day.title}</h3>
        </div>
        {day.day % 6 === 0 && (
          <span className="px-3 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full border border-purple-500/30">
            Weekend Project
          </span>
        )}
      </div>

      <div className="space-y-3">
        {/* Topics */}
        <div>
          <h4 className="text-sm font-semibold text-gray-400 mb-2">Topics Covered:</h4>
          <div className="flex flex-wrap gap-2">
            {day.topics.map((topic: string) => (
              <span
                key={topic}
                className="text-xs bg-gray-800 text-gray-300 px-2 py-1 rounded border border-gray-700"
              >
                {topic}
              </span>
            ))}
          </div>
        </div>

        {/* Problems */}
        {day.problems && day.problems.length > 0 && (
          <div>
            <h4 className="text-sm font-semibold text-gray-400 mb-2">Practice Problems:</h4>
            <div className="flex flex-wrap gap-2">
              {day.problems.map((problem: string) => (
                <Link
                  key={problem}
                  href={`/problems/${problem}`}
                  className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded border border-blue-500/30 hover:bg-blue-500/30 transition-colors"
                >
                  {problem}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Resources */}
        <div className="flex items-center gap-2 pt-2 border-t border-gray-800">
          <BookOpen className="w-4 h-4 text-gray-500" />
          <a
            href={`/docs${day.resources[0]}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-gray-400 hover:text-blue-400 transition-colors"
          >
            View Learning Materials →
          </a>
        </div>
      </div>
    </div>
  );
}

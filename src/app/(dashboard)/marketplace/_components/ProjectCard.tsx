import Image from "next/image";
import { Badge } from "@/components/ui/badge";

export function ProjectCard({ project }: { project: any }) {
  const statusColors: Record<string, string> = {
    approved: "bg-green-100 text-green-700 border-green-200",
    submitted: "bg-yellow-100 text-yellow-700 border-yellow-200",
    active: "bg-blue-100 text-blue-700 border-blue-200",
    verified: "bg-green-100 text-green-700 border-green-200",
    pending: "bg-yellow-100 text-yellow-700 border-yellow-200",
  };

  const displayStatus =
    project.status === "approved"
      ? "Verified"
      : project.status === "submitted"
        ? "Pending"
        : project.status === "active"
          ? "Pre-Verified"
          : project.status;

  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden group hover:shadow-xl hover:shadow-slate-200/50 transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          width={500}
          height={500}
          src={
            project.imageUrl ||
            "https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2000&auto=format&fit=crop"
          }
          alt={project.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute top-4 right-4">
          <Badge
            className={`${statusColors[project.status] || "bg-slate-100 text-slate-700"} border px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider`}
          >
            {displayStatus}
          </Badge>
        </div>
        <button
          type="button"
          className="absolute top-4 left-4 p-2 bg-white/20 backdrop-blur-md rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
            />
          </svg>
        </button>
      </div>

      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-slate-900 line-clamp-1">
            {project.name}
          </h3>
          <button
            type="button"
            className="text-slate-400 hover:text-primary transition-colors"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>

        <div className="flex items-center gap-3 text-xs text-slate-500 mb-4">
          <div className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{project.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <svg
              className="w-3.5 h-3.5 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span className="capitalize">
              {project.projectType?.replace("_", " ")}
            </span>
          </div>
        </div>

        <p className="text-xs text-slate-500 line-clamp-2 mb-5 leading-relaxed">
          {project.description ||
            "Transforming landscapes through sustainable community-driven interventions."}
        </p>

        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-50">
          <div>
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              Credits Available
            </p>
            <p className="font-bold text-slate-900">
              {Number(project.estimatedTotalTco2e || 0).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-[10px] uppercase tracking-wider text-slate-400 mb-1">
              Price per Tonne
            </p>
            <p className="font-bold text-primary">$52</p>
          </div>
        </div>

        <button
          type="button"
          className="w-full mt-5 py-3 bg-primary text-white rounded-xl font-medium text-sm hover:bg-primary/90 transition-colors"
        >
          View Details
        </button>
      </div>
    </div>
  );
}

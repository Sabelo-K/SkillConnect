import Link from "next/link";
import { Star, MapPin, Briefcase, CheckCircle } from "lucide-react";
import { Worker } from "@/lib/types";

const tierColors: Record<Worker["tier"], string> = {
  "New": "bg-gray-100 text-gray-600",
  "Verified": "bg-[#fffbea] text-[#b8860b]",
  "Top Rated": "bg-[#e8f5ef] text-[#007A4D]",
};

export default function WorkerCard({ worker }: { worker: Worker }) {
  return (
    <Link href={`/workers/${worker.id}`} className="block">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md hover:border-orange-200 transition-all cursor-pointer">
        <div className="flex items-start gap-4">
          <img
            src={worker.photoUrl}
            alt={worker.name}
            className="w-14 h-14 rounded-full bg-gray-100 flex-shrink-0"
          />
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-gray-900">{worker.name}</h3>
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tierColors[worker.tier]}`}>
                {worker.tier}
              </span>
              {worker.available && (
                <span className="text-xs px-2 py-0.5 rounded-full font-medium bg-[#e8f5ef] text-[#007A4D]">
                  Available
                </span>
              )}
            </div>
            <p className="text-sm font-medium text-orange-600 mt-0.5">{worker.trade}</p>
            <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {worker.area} · {worker.ward}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-3 h-3" />
                {worker.yearsExperience} yrs exp
              </span>
              {worker.reviewCount > 0 && (
                <span className="flex items-center gap-1">
                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                  {worker.rating.toFixed(1)} ({worker.reviewCount})
                </span>
              )}
            </div>
          </div>
        </div>
        <p className="text-sm text-gray-500 mt-3 line-clamp-2">{worker.bio}</p>
        <div className="mt-3 flex items-center gap-2 text-xs text-gray-400">
          <CheckCircle className="w-3.5 h-3.5 text-green-500" />
          {worker.jobsCompleted} jobs completed on SkillConnect
        </div>
      </div>
    </Link>
  );
}

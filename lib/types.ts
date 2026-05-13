export type Trade =
  | "Plumber"
  | "Electrician"
  | "Carpenter"
  | "Painter"
  | "Tiler"
  | "Builder"
  | "Welder"
  | "General Handyman";

export type WorkerTier = "New" | "Verified" | "Top Rated";

export interface Worker {
  id: string;
  name: string;
  phone: string;
  trade: Trade;
  ward: string;
  area: string;
  yearsExperience: number;
  bio: string;
  photoUrl: string;       // selfie — used as profile picture
  idDocumentUrl: string;  // copy of ID document
  workPhotos: string[];
  rating: number;
  reviewCount: number;
  tier: WorkerTier;
  jobsCompleted: number;
  available: boolean;
  registeredAt: string;
}

export interface JobRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  trade: Trade;
  ward: string;
  area: string;
  description: string;
  status: "pending" | "matched" | "completed";
  matchedWorkerId?: string;
  createdAt: string;
  completedAt?: string;
  jobValue?: number;          // rand value of the job, entered by admin on completion
  commissionRate: number;     // percentage, e.g. 10
  commissionAmount?: number;  // jobValue * commissionRate / 100
  commissionStatus: "none" | "awaiting" | "paid";
}

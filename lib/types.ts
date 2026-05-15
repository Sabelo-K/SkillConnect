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
  tiktokUrl?: string;
  rating: number;
  reviewCount: number;
  tier: WorkerTier;
  jobsCompleted: number;
  available: boolean;
  registeredAt: string;
  status: "pending" | "approved" | "rejected";
  // Banking details for EFT payout
  bankName?: string;
  accountNumber?: string;
  accountType?: "current" | "savings";
  branchCode?: string;
}

export interface Review {
  id: string;
  jobId: string;
  workerId: string;
  rating: number;       // 1–5
  comment: string;
  reviewerName: string;
  createdAt: string;
}

export interface TimelineEvent {
  at: string;       // ISO timestamp
  event: string;
  by: "client" | "worker" | "admin" | "system";
  note?: string;
}

export interface JobRequest {
  id: string;
  clientName: string;
  clientPhone: string;
  trade: Trade;
  ward: string;
  area: string;
  description: string;
  status: "pending" | "matched" | "quoted" | "accepted" | "completion_requested" | "payment_pending" | "completed" | "disputed" | "cancelled";
  matchedWorkerId?: string;
  createdAt: string;
  completedAt?: string;
  jobValue?: number;          // rand value of the job, entered by admin on completion
  commissionRate: number;     // percentage, e.g. 10
  commissionAmount?: number;  // jobValue * commissionRate / 100
  commissionStatus: "none" | "awaiting" | "paid";
  photoUrl?: string;
  quotedAmount?: number;
  scopeNotes?: string;
  completionNotes?: string;
  completionPhotos?: string[];
  disputeReason?: string;
  disputeResolution?: string;
  workerToken?: string;
  clientToken?: string;
  timeline?: TimelineEvent[];
  paymentStatus?: "none" | "pending" | "received" | "settled";
  paymentId?: string;
}

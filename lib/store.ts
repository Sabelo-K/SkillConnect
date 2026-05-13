import { Worker, JobRequest, Trade } from "./types";

const DEFAULT_COMMISSION_RATE = 10; // 10%

// In-memory store — resets on server restart (MVP phase)
const store: {
  workers: Worker[];
  jobs: JobRequest[];
} = {
  workers: [
    { id: "w1", name: "Thabo Nkosi", phone: "+27 82 345 6789", trade: "Plumber", ward: "Ward 4", area: "Chatsworth", yearsExperience: 8, bio: "Experienced plumber specialising in burst pipes, geyser installations, and full bathroom plumbing. Fast, reliable and clean work.", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=thabo", idDocumentUrl: "", workPhotos: [], rating: 4.8, reviewCount: 34, tier: "Top Rated", jobsCompleted: 47, available: true, registeredAt: "2024-11-01" },
    { id: "w2", name: "Praveen Pillay", phone: "+27 73 456 7890", trade: "Electrician", ward: "Ward 4", area: "Chatsworth", yearsExperience: 12, bio: "Qualified electrician with over a decade of experience in domestic and light commercial electrical work. COC certificates available.", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=praveen", idDocumentUrl: "", workPhotos: [], rating: 4.9, reviewCount: 52, tier: "Top Rated", jobsCompleted: 63, available: true, registeredAt: "2024-10-15" },
    { id: "w3", name: "Sipho Dlamini", phone: "+27 61 567 8901", trade: "Carpenter", ward: "Ward 5", area: "Chatsworth", yearsExperience: 6, bio: "Skilled carpenter for custom built-in cupboards, wooden decks, doors, and general woodwork. Quality craftsmanship guaranteed.", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=sipho", idDocumentUrl: "", workPhotos: [], rating: 4.7, reviewCount: 21, tier: "Verified", jobsCompleted: 29, available: true, registeredAt: "2024-11-20" },
    { id: "w4", name: "Ravi Govender", phone: "+27 84 678 9012", trade: "Painter", ward: "Ward 4", area: "Chatsworth", yearsExperience: 10, bio: "Professional painter offering interior and exterior painting services. Neat, on time, and affordable. Free quotes available.", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=ravi", idDocumentUrl: "", workPhotos: [], rating: 4.6, reviewCount: 18, tier: "Verified", jobsCompleted: 35, available: false, registeredAt: "2024-12-01" },
    { id: "w5", name: "Lungelo Zulu", phone: "+27 79 789 0123", trade: "Tiler", ward: "Ward 6", area: "Chatsworth", yearsExperience: 5, bio: "Expert tiler for floors, walls, and bathrooms. Specialises in large format tiles and complex patterns.", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=lungelo", idDocumentUrl: "", workPhotos: [], rating: 4.5, reviewCount: 14, tier: "Verified", jobsCompleted: 22, available: true, registeredAt: "2025-01-10" },
    { id: "w6", name: "Anil Maharaj", phone: "+27 66 890 1234", trade: "Builder", ward: "Ward 4", area: "Chatsworth", yearsExperience: 15, bio: "General builder with 15 years of experience in extensions, renovations, boundary walls, and new builds. Licensed and insured.", photoUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=anil", idDocumentUrl: "", workPhotos: [], rating: 4.9, reviewCount: 61, tier: "Top Rated", jobsCompleted: 78, available: true, registeredAt: "2024-09-05" },
  ],
  jobs: [
    {
      id: "j1",
      clientName: "Mrs Naidoo",
      clientPhone: "+27 82 111 2222",
      trade: "Plumber",
      ward: "Ward 4",
      area: "Chatsworth",
      description: "Burst pipe under the kitchen sink. Water is leaking onto the floor.",
      status: "completed",
      matchedWorkerId: "w1",
      createdAt: "2025-05-10",
      completedAt: "2025-05-10",
      jobValue: 850,
      commissionRate: DEFAULT_COMMISSION_RATE,
      commissionAmount: 85,
      commissionStatus: "paid",
    },
    {
      id: "j2",
      clientName: "Mr Sithole",
      clientPhone: "+27 73 333 4444",
      trade: "Painter",
      ward: "Ward 5",
      area: "Chatsworth",
      description: "Need to paint 3 bedrooms and the lounge. Interior walls only.",
      status: "matched",
      matchedWorkerId: "w4",
      createdAt: "2025-05-12",
      commissionRate: DEFAULT_COMMISSION_RATE,
      commissionStatus: "none",
    },
    {
      id: "j3",
      clientName: "Ms Govender",
      clientPhone: "+27 84 222 3333",
      trade: "Electrician",
      ward: "Ward 4",
      area: "Chatsworth",
      description: "Tripping circuit breaker in the DB board. Happens every evening.",
      status: "completed",
      matchedWorkerId: "w2",
      createdAt: "2025-05-08",
      completedAt: "2025-05-09",
      jobValue: 1200,
      commissionRate: DEFAULT_COMMISSION_RATE,
      commissionAmount: 120,
      commissionStatus: "awaiting",
    },
  ],
};

export function getWorkers(): Worker[] {
  return store.workers;
}

export function getWorkerById(id: string): Worker | undefined {
  return store.workers.find((w) => w.id === id);
}

export function addWorker(
  worker: Omit<Worker, "id" | "rating" | "reviewCount" | "tier" | "jobsCompleted" | "registeredAt">
): Worker {
  const newWorker: Worker = {
    ...worker,
    id: `w${Date.now()}`,
    rating: 0,
    reviewCount: 0,
    tier: "New",
    jobsCompleted: 0,
    registeredAt: new Date().toISOString().split("T")[0],
  };
  store.workers.push(newWorker);
  return newWorker;
}

export function getJobs(): JobRequest[] {
  return store.jobs;
}

export function addJob(
  job: Omit<JobRequest, "id" | "status" | "createdAt" | "commissionRate" | "commissionStatus">
): JobRequest {
  const newJob: JobRequest = {
    ...job,
    id: `j${Date.now()}`,
    status: "pending",
    createdAt: new Date().toISOString().split("T")[0],
    commissionRate: DEFAULT_COMMISSION_RATE,
    commissionStatus: "none",
  };
  store.jobs.push(newJob);
  return newJob;
}

export function completeJob(
  jobId: string,
  jobValue: number,
  commissionRate: number
): JobRequest | null {
  const job = store.jobs.find((j) => j.id === jobId);
  if (!job) return null;
  const commissionAmount = Math.round(jobValue * (commissionRate / 100));
  job.status = "completed";
  job.completedAt = new Date().toISOString().split("T")[0];
  job.jobValue = jobValue;
  job.commissionRate = commissionRate;
  job.commissionAmount = commissionAmount;
  job.commissionStatus = "awaiting";
  // Increment worker's job count
  if (job.matchedWorkerId) {
    const worker = store.workers.find((w) => w.id === job.matchedWorkerId);
    if (worker) worker.jobsCompleted += 1;
  }
  return job;
}

export function markCommissionPaid(jobId: string): JobRequest | null {
  const job = store.jobs.find((j) => j.id === jobId);
  if (!job) return null;
  job.commissionStatus = "paid";
  return job;
}

export function matchWorkerForJob(job: JobRequest): Worker | undefined {
  const sameWard = store.workers.filter(
    (w) => w.trade === job.trade && w.ward === job.ward && w.available
  );
  if (sameWard.length > 0) return sameWard.sort((a, b) => b.rating - a.rating)[0];
  const sameArea = store.workers.filter(
    (w) => w.trade === job.trade && w.area === job.area && w.available
  );
  return sameArea.sort((a, b) => b.rating - a.rating)[0];
}

export const TRADES: Trade[] = [
  "Plumber", "Electrician", "Carpenter", "Painter",
  "Tiler", "Builder", "Welder", "General Handyman",
];

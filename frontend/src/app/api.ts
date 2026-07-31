const API_BASE = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export function mediaUrl(path?: string | null) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://") || path.startsWith("data:")) return path;
  return `${API_BASE}${path}`;
}

async function request<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json", ...(options?.headers || {}) },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

/** 공개 사이트는 읽기 전용 API만 사용합니다. 수정은 moving-admin에서. */
export const api = {
  getProjects: () => request<Project[]>("/api/projects"),
  getMembers: () => request<Member[]>("/api/members"),
  getStartups: () => request<Org[]>("/api/startups"),
  getPartners: () => request<Org[]>("/api/partners"),
  getBanners: () => request<Banner[]>("/api/banners"),
  getNotices: () => request<Notice[]>("/api/notices"),
  getTimeline: () => request<TimelineGroup[]>("/api/timeline"),
};

export type Project = {
  id: string;
  title: string;
  subtitle: string;
  desc: string;
  tags: string[];
  metric: string | null;
  status: string;
  color: string;
  imageUrl?: string | null;
  videoUrl?: string | null;
  sortOrder?: number;
  detail: { period: string; result: string; process: string };
};

export type Member = {
  id: string;
  name: string;
  part: string;
  role: string;
  photoUrl?: string | null;
  sortOrder?: number;
};

export type Org = {
  id: string;
  name: string;
  desc: string;
  logoUrl?: string | null;
  linkUrl?: string | null;
  sortOrder?: number;
};

export type Banner = {
  id: string;
  title: string;
  imageUrl: string;
  linkUrl?: string | null;
  sortOrder?: number;
  active?: boolean;
};

export type Notice = {
  id: string;
  category: string;
  title: string;
  date: string;
  hot: boolean;
  sortOrder?: number;
};

export type TimelineItem = {
  id: string;
  title: string;
  desc: string;
  tags: string[];
  metric: string | null;
  sortOrder?: number;
  year?: string;
};

export type TimelineGroup = {
  year: string;
  items: TimelineItem[];
};

export const PARTS = ["기획 파트", "개발 파트", "디자인 파트", "마케팅 파트", "경영·재무 파트"] as const;

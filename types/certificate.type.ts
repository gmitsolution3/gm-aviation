export interface ICertificate {
  _id: string;
  enrollment: {
    _id: string;
    status: string; // "active" etc.
    enrolledAt: string;
  };
  user: {
    _id: string;
    name: string;
    email?: string;
  };
  course: {
    _id: string;
    title: string;
    slug?: string;
    duration?: string;
  };
  certificateNumber: string; // e.g., "GMA-2026-000001"
  issuedAt: string; // date string
  createdAt: string;
  updatedAt: string;
  certificateUrl?: string; // optional download link
}
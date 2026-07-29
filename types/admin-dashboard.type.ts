export interface IAdminDashboard {
  courses: {
    total: number;
    published: number;
    unpublished: number;
    admissionOpen: number;
  };
  admissions: {
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  enrollments: {
    total: number;
    active: number;
    completed: number;
    dropped: number;
    suspended: number;
  };
}
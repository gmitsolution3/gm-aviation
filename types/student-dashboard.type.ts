export interface IStudentDashboard {
  courses: {
    total: number;
    active: number;
    completed: number;
  };
  admissions: {
    total: number;
    submitted: number;
    underReview: number;
    approved: number;
    rejected: number;
  };
  certificates: {
    total: number;
  };
}
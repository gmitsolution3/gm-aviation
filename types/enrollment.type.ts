import { IAdmission, ICourse, IUser } from '@/types';

export interface IEnrollment {
  _id: string;
  user: IUser;
  course: ICourse;
  admission: IAdmission;
  status: "pending" | "completed" | "cancelled"; // adjust as needed
  enrolledAt: string;
  createdAt: string;
  updatedAt: string;
}
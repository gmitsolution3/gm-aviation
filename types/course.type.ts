import { ICategory } from "./category.type";

export interface ICourse {
  _id: string;
  title: string;
  slug: string;
  category: ICategory;
  description: string;
  image: string;
  duration: string;
  fee: number;
  checklists: string[];
  careerOpportunities: string[];
  availableShifts: string[];
  isAdmissionOpen: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

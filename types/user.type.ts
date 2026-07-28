export interface IUser {
  _id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image: string;
  imagePublicId: string;
  phone: string;
  role: string;
  isBanned: boolean;
  createdAt: string;
  updatedAt: string;
}
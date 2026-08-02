export interface ICertificate {
  _id: string;
  enrollment: {
    _id: string;
    user: {
      _id: string;
      name: string;
    };
    course: {
      _id: string;
      title: string;
    };
  };
  issuedAt?: string;
  createdAt: string;
  updatedAt: string;
  certificateUrl?: string; // optional download link
}
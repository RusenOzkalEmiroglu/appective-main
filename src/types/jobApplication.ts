export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  fullName: string;
  email: string;
  phone: string;
  message?: string;
  cvFilePath: string;
  createdAt: Date;
  status: 'pending' | 'reviewed' | 'contacted' | 'rejected';
}

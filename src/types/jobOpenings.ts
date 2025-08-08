// src/types/jobOpenings.ts
'use client';

export interface JobOpeningDetails {
  fullTitle: string;
  description: string;
  whatYouWillDo: string[];
  whatWereLookingFor: string[];
  whyJoinUs: string[];
  applyLink?: string;
}

export interface JobOpening {
  id: string;
  iconName: string; // Using Lucide icon names, e.g., 'Briefcase', 'Code', 'Megaphone'
  title: string;
  shortDescription: string;
  isRemote: boolean;
  isTr: boolean;
  slug: string;
  details: JobOpeningDetails;
}

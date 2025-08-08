import { NextRequest, NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs/promises';
import { JobApplication } from '@/types/jobApplication';
import { withAdminAuthSimple } from '@/lib/withAdminAuth';

// --- Configuration ---
const allowedFileTypes = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
];
const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'job-applications.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads', 'cv');

// --- Helper Functions ---
async function ensureDirectoriesExist() {
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (error) {
    console.error("Could not create directories:", error);
  }
}

async function loadApplications(): Promise<JobApplication[]> {
  try {
    const data = await fs.readFile(APPLICATIONS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

async function saveApplications(applications: JobApplication[]): Promise<void> {
  await fs.writeFile(APPLICATIONS_FILE, JSON.stringify(applications, null, 2), 'utf-8');
}

// --- Public API Handlers ---

// POST handler for creating a new job application (Publicly accessible)
export async function POST(request: NextRequest) {
  try {
    await ensureDirectoriesExist();
    const formData = await request.formData();
    
    const jobId = formData.get('jobId') as string;
    const jobTitle = formData.get('jobTitle') as string;
    const fullName = formData.get('fullName') as string;
    const email = formData.get('email') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string || '';
    const cvFile = formData.get('cv') as File;

    if (!jobId || !jobTitle || !fullName || !email || !phone || !cvFile) {
      return NextResponse.json({ error: 'Tüm zorunlu alanlar doldurulmalıdır.' }, { status: 400 });
    }
    if (!allowedFileTypes.includes(cvFile.type)) {
      return NextResponse.json({ error: 'Sadece PDF veya Word dosyaları kabul edilmektedir.' }, { status: 400 });
    }
    if (cvFile.size > 5 * 1024 * 1024) {
      return NextResponse.json({ error: 'Dosya boyutu 5MB\'dan küçük olmalıdır.' }, { status: 400 });
    }

    const applications = await loadApplications();
    const applicationsByThisUserForThisJob = applications.filter(
      (app) => app.email === email && app.jobId === jobId
    );
    if (applicationsByThisUserForThisJob.length >= 2) {
      return NextResponse.json({ message: 'Bu ilana bu e-posta adresi ile izin verilen maksimum başvuru sayısına (2) ulaştınız.' }, { status: 409 });
    }

    const fileExt = cvFile.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    const filePath = path.join(UPLOADS_DIR, fileName);
    const fileBuffer = Buffer.from(await cvFile.arrayBuffer());
    await fs.writeFile(filePath, fileBuffer);

    const application: JobApplication = {
      id: uuidv4(),
      jobId,
      jobTitle,
      fullName,
      email,
      phone,
      message,
      cvFilePath: `/uploads/cv/${fileName}`,
      createdAt: new Date(),
      status: 'pending'
    };

    applications.push(application);
    await saveApplications(applications);

    return NextResponse.json({ success: true, message: 'Başvurunuz başarıyla alındı.' }, { status: 201 });
  } catch (error) {
    console.error('Başvuru kaydedilirken hata oluştu:', error);
    return NextResponse.json({ error: 'Başvuru işlenirken bir hata oluştu.' }, { status: 500 });
  }
}

// --- Protected API Handlers ---

// Original GET handler logic to fetch all applications
async function getHandler(request: NextRequest) {
  try {
    const applications = await loadApplications();
    return NextResponse.json(applications);
  } catch (error) {
    console.error('Başvurular alınırken hata oluştu:', error);
    return NextResponse.json({ error: 'Başvurular alınırken bir hata oluştu.' }, { status: 500 });
  }
}

// Wrap the protected GET handler with authentication
export const GET = withAdminAuthSimple(getHandler);

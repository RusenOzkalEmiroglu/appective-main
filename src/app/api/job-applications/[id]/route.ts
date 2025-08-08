import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { JobApplication } from '@/types/jobApplication';
import { withAdminAuth } from '@/lib/withAdminAuth';

const DATA_DIR = path.join(process.cwd(), 'data');
const APPLICATIONS_FILE = path.join(DATA_DIR, 'job-applications.json');

// --- Helper Functions ---
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

// --- Protected Handlers ---

// Original GET handler logic
async function getHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applications = await loadApplications();
    const application = applications.find(app => app.id === params.id);
    if (!application) {
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }
    return NextResponse.json(application);
  } catch (error) {
    console.error('Başvuru alınırken hata oluştu:', error);
    return NextResponse.json({ error: 'Başvuru alınırken bir hata oluştu.' }, { status: 500 });
  }
}

// Original PATCH handler logic
async function patchHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status } = await request.json();
    if (!['pending', 'reviewed', 'contacted', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum değeri.' }, { status: 400 });
    }

    const applications = await loadApplications();
    const applicationIndex = applications.findIndex(app => app.id === params.id);
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    applications[applicationIndex].status = status;
    await saveApplications(applications);

    return NextResponse.json({ success: true, message: 'Başvuru durumu güncellendi.' }, { status: 200 });
  } catch (error) {
    console.error('Başvuru güncellenirken hata oluştu:', error);
    return NextResponse.json({ error: 'Başvuru güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

// Original DELETE handler logic
async function deleteHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const applications = await loadApplications();
    const applicationIndex = applications.findIndex(app => app.id === params.id);
    if (applicationIndex === -1) {
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    applications.splice(applicationIndex, 1);
    await saveApplications(applications);

    return NextResponse.json({ success: true, message: 'Başvuru silindi.' }, { status: 200 });
  } catch (error) {
    console.error('Başvuru silinirken hata oluştu:', error);
    return NextResponse.json({ error: 'Başvuru silinirken bir hata oluştu.' }, { status: 500 });
  }
}

// Wrap all handlers with authentication as they are sensitive
export const GET = withAdminAuth(getHandler);
export const PATCH = withAdminAuth(patchHandler);
export const DELETE = withAdminAuth(deleteHandler);

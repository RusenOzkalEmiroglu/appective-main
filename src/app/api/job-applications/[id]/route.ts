import { NextRequest, NextResponse } from 'next/server';
import { JobApplication } from '@/types/jobApplication';
import { withAdminAuth } from '@/lib/withAdminAuth';
import { supabase } from '@/lib/supabase';

// --- Helper Functions ---
// Bu fonksiyonlar artık gerekli değil, Supabase direkt kullanılacak

// --- Protected Handlers ---

// Original GET handler logic
async function getHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { data, error } = await supabase
      .from('job_applications')
      .select('*')
      .eq('id', params.id)
      .single();

    if (error) {
      console.error('Supabase hatası:', error);
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    // Map Supabase data to JobApplication format
    const application = {
      id: data.id.toString(),
      jobId: data.job_id,
      jobTitle: data.job_title,
      fullName: data.full_name,
      email: data.email,
      phone: data.phone,
      message: data.message,
      cvFilePath: data.cv_file_path,
      createdAt: data.created_at,
      status: data.status
    };

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
    if (!['pending', 'reviewed', 'rejected'].includes(status)) {
      return NextResponse.json({ error: 'Geçersiz durum değeri.' }, { status: 400 });
    }

    const { data, error } = await supabase
      .from('job_applications')
      .update({ 
        status
      })
      .eq('id', params.id)
      .select()
      .single();

    if (error) {
      console.error('Supabase güncelleme hatası:', error);
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Başvuru durumu güncellendi.' }, { status: 200 });
  } catch (error) {
    console.error('Başvuru güncellenirken hata oluştu:', error);
    return NextResponse.json({ error: 'Başvuru güncellenirken bir hata oluştu.' }, { status: 500 });
  }
}

// Original DELETE handler logic
async function deleteHandler(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error } = await supabase
      .from('job_applications')
      .delete()
      .eq('id', params.id);

    if (error) {
      console.error('Supabase silme hatası:', error);
      return NextResponse.json({ error: 'Başvuru bulunamadı.' }, { status: 404 });
    }

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

const { createClient } = require('@supabase/supabase-js');
const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-project.supabase.co';
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'your-anon-key';
const supabase = createClient(supabaseUrl, supabaseKey);

// MongoDB configuration
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/your-database';

// Newsletter schema (MongoDB)
const newsletterSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

const Newsletter = mongoose.model('Newsletter', newsletterSchema);

async function migrateNewsletterData() {
  try {
    console.log('🔄 Newsletter verilerini MongoDB\'den Supabase\'e aktarılıyor...');
    
    // MongoDB'ye bağlan
    await mongoose.connect(MONGODB_URI);
    console.log('✅ MongoDB\'ye bağlandı');
    
    // MongoDB'den aktif aboneleri al
    const subscribers = await Newsletter.find({ isActive: true });
    console.log(`📊 ${subscribers.length} aktif abone bulundu`);
    
    if (subscribers.length === 0) {
      console.log('ℹ️  Aktarılacak abone bulunamadı');
      return;
    }
    
    // Supabase'e aktar
    const supabaseData = subscribers.map(sub => ({
      email: sub.email,
      subscribed_at: sub.subscribedAt.toISOString()
    }));
    
    // Mevcut verileri kontrol et
    const { data: existingData } = await supabase
      .from('newsletter_subscribers')
      .select('email');
    
    const existingEmails = new Set((existingData || []).map(item => item.email));
    
    // Sadece yeni e-postaları ekle
    const newSubscribers = supabaseData.filter(sub => !existingEmails.has(sub.email));
    
    if (newSubscribers.length === 0) {
      console.log('ℹ️  Tüm aboneler zaten Supabase\'de mevcut');
      return;
    }
    
    console.log(`📝 ${newSubscribers.length} yeni abone Supabase\'e ekleniyor...`);
    
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert(newSubscribers);
    
    if (error) {
      throw error;
    }
    
    console.log('✅ Newsletter verileri başarıyla aktarıldı!');
    console.log(`📊 Toplam ${newSubscribers.length} yeni abone eklendi`);
    
  } catch (error) {
    console.error('❌ Migration hatası:', error);
  } finally {
    // MongoDB bağlantısını kapat
    await mongoose.disconnect();
    console.log('🔌 MongoDB bağlantısı kapatıldı');
  }
}

// Script'i çalıştır
migrateNewsletterData();

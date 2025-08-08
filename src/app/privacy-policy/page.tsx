import React from 'react';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Gizlilik Politikası</h1>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Genel Bilgiler</h2>
              <p className="mb-4">
                Bu gizlilik politikası, Appective olarak kişisel verilerinizi nasıl topladığımız, 
                kullandığımız ve koruduğumuz hakkında bilgi vermektedir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Toplanan Bilgiler</h2>
              <p className="mb-4">
                Web sitemizi ziyaret ettiğinizde aşağıdaki bilgileri toplayabiliriz:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>İletişim bilgileriniz (ad, e-posta, telefon)</li>
                <li>Web sitesi kullanım bilgileri</li>
                <li>Çerezler aracılığıyla toplanan teknik bilgiler</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Bilgilerin Kullanımı</h2>
              <p className="mb-4">
                Toplanan bilgiler aşağıdaki amaçlarla kullanılır:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Hizmetlerimizi sunmak ve geliştirmek</li>
                <li>İletişim taleplerini yanıtlamak</li>
                <li>Pazarlama faaliyetleri (izin vermeniz halinde)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. İletişim</h2>
              <p className="mb-4">
                Gizlilik politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

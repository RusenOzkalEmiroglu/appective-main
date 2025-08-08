import React from 'react';

export default function TermsOfService() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Hizmet Şartları</h1>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Genel Şartlar</h2>
              <p className="mb-4">
                Bu web sitesini kullanarak aşağıdaki hizmet şartlarını kabul etmiş sayılırsınız.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Hizmet Kapsamı</h2>
              <p className="mb-4">
                Appective olarak dijital pazarlama ve reklam hizmetleri sunmaktayız. 
                Hizmetlerimiz aşağıdaki alanları kapsamaktadır:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Dijital pazarlama stratejileri</li>
                <li>Web tasarım ve geliştirme</li>
                <li>Sosyal medya yönetimi</li>
                <li>Marka kimliği oluşturma</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Kullanıcı Sorumlulukları</h2>
              <p className="mb-4">
                Web sitemizi kullanırken aşağıdaki kurallara uymanız gerekmektedir:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li>Yasal olmayan içerik paylaşmamak</li>
                <li>Diğer kullanıcıların haklarına saygı göstermek</li>
                <li>Doğru ve güncel bilgiler sağlamak</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. İletişim</h2>
              <p className="mb-4">
                Hizmet şartlarımız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

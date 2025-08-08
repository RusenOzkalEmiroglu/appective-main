import React from 'react';

export default function CookiePolicy() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">Çerez Politikası</h1>
          
          <div className="prose prose-invert max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">1. Çerezler Nedir?</h2>
              <p className="mb-4">
                Çerezler, web sitelerinin kullanıcıların bilgisayarlarında veya mobil cihazlarında 
                sakladığı küçük metin dosyalarıdır.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">2. Çerez Türleri</h2>
              <p className="mb-4">
                Web sitemizde aşağıdaki çerez türlerini kullanmaktayız:
              </p>
              <ul className="list-disc list-inside mb-4">
                <li><strong>Zorunlu Çerezler:</strong> Web sitesinin temel işlevleri için gereklidir</li>
                <li><strong>Analitik Çerezler:</strong> Web sitesi performansını ölçmek için kullanılır</li>
                <li><strong>İşlevsel Çerezler:</strong> Kullanıcı deneyimini geliştirmek için kullanılır</li>
                <li><strong>Pazarlama Çerezleri:</strong> Kişiselleştirilmiş reklamlar için kullanılır</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">3. Çerez Yönetimi</h2>
              <p className="mb-4">
                Çerezleri tarayıcı ayarlarınızdan yönetebilir, devre dışı bırakabilir 
                veya silebilirsiniz. Ancak bu durumda web sitesinin bazı özellikleri 
                düzgün çalışmayabilir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">4. Üçüncü Taraf Çerezleri</h2>
              <p className="mb-4">
                Web sitemizde Google Analytics gibi üçüncü taraf hizmetlerin çerezleri 
                de kullanılabilir. Bu çerezler ilgili şirketlerin gizlilik politikalarına tabidir.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">5. İletişim</h2>
              <p className="mb-4">
                Çerez politikamız hakkında sorularınız için bizimle iletişime geçebilirsiniz.
              </p>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

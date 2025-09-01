document.addEventListener('DOMContentLoaded', () => {
    const cities = document.querySelectorAll('#svg-turkey g[data-city-name]');
    const sidePanel = document.getElementById('side-panel');
    const closePanelBtn = document.getElementById('close-panel-btn');
    const panelCityName = document.getElementById('panel-city-name');
    const campusListContainer = document.getElementById('campus-list');
    const tooltip = document.querySelector('.map-tooltip');
    const skipButton = document.querySelector('.skip-button');

    // Haritadaki tüm inline 'fill' stillerini temizleyerek kontrolü CSS'e devrediyoruz.
    // Bu, sayfa ilk yüklendiğinde doğru renklerin görünmesini sağlar.
    const allPaths = document.querySelectorAll('#svg-turkey g path');
    allPaths.forEach(path => {
        path.style.fill = '';
    });

    const campusData = {
      "ugur_okullari_kampusleri": [
        {
          "il": "Adıyaman",
          "kampusler": [
            {
              "kampus_adi": "Kahta Uğur Okulları Kampüsü",
              "adres": "Bağlar Mah. 1701 Sk. No: 6 Kahta / Adıyaman",
              "telefon": "0416 203 02 01"
            }
          ]
        },
        {
          "il": "Afyonkarahisar",
          "kampusler": [
            {
              "kampus_adi": "Afyonkarahisar Uğur Anadolu Lisesi",
              "adres": "Veysel Karani Mah. Tuna Cad. No:107/109 Sayipata Toki Konutları Karşısı Merkez / Afyon",
              "telefon": "0272 215 36 66"
            }
          ]
        },
        {
          "il": "Ankara",
          "kampusler": [
            {
              "kampus_adi": "Bağlıca Uğur Okulları Kampüsü",
              "adres": "Bağlıca Mah. Kuzupınar Cad. No:4 / A-B-C Etimesgut - Ankara",
              "telefon": "0312 502 10 00"
            },
            {
              "kampus_adi": "Balgat Uğur Okulları Kampüsü",
              "adres": "Ziyabey Cad. 1419 Sokak No:9 / 11 Balgat-Çankaya/Ankara",
              "telefon": "0312 285 28 02"
            },
            {
              "kampus_adi": "Batıkent Uğur Okulları Kampüsü",
              "adres": "Başkent Bulvarı Yeni batı Mah. 2372. Sok. No:2 Botanik Metro Arkası Batıkent - Yenimahalle/Ankara",
              "telefon": "0312 256 60 40"
            },
            {
              "kampus_adi": "Yaşamkent Uğur Okulları Kampüsü",
              "adres": "Alacaatlı Mah. 3381. Cad. Okul Blok No:51 Yaşamkent-Çankaya/Ankara",
              "telefon": "0312 222 66 41"
            }
          ]
        },
        {
          "il": "Antalya",
          "kampusler": [
            {
              "kampus_adi": "Çallı Uğur Okulları Kampüsü",
              "adres": "Sedir Mah. Vatan Bulvarı No:4 Muratpaşa/Antalya",
              "telefon": "0242 966 06 82"
            },
            {
              "kampus_adi": "Kemer Uğur Okulları Kampüsü",
              "adres": "Arslanbucak Mah. Kuzdere Cad. 248 Sk. No:5 Kemer/Antalya",
              "telefon": "0531 082 61 80"
            },
            {
              "kampus_adi": "Konyaaltı Uğur Okulları Kampüsü",
              "adres": "Sarısu Mah. 161 Sok. No:6 Konyaaltı - Antalya",
              "telefon": "0242 259 00 84"
            },
            {
              "kampus_adi": "Muratpaşa Uğur Okulları Kampüsü",
              "adres": "Doğuyaka Mah. Gazi Bulvarı No: 688/1 Muratpaşa/Antalya",
              "telefon": "0242 323 10 99"
            }
          ]
        },
        {
          "il": "Balıkesir",
          "kampusler": [
            {
              "kampus_adi": "Burhaniye Uğur Okulları Kampüsü",
              "adres": "Cumhuriyet Mah. 200 Evler Cad. No:16 Burhaniye/Balıkesir",
              "telefon": "0266 412 18 18"
            },
            {
              "kampus_adi": "Gönen Uğur Okulları Kampüsü",
              "adres": "Plevne Mah. Turgut Uyar Cad. No:6 Gönen/Balıkesir",
              "telefon": "0266 762 10 10"
            }
          ]
        },
        {
          "il": "Bursa",
          "kampusler": [
            {
              "kampus_adi": "Özlüce Uğur Okulları Kampüsü",
              "adres": "Altınşehir Mah. 336. Sok. No: 6 Nilüfer/Bursa",
              "telefon": "0224 245 44 44"
            }
          ]
        },
        {
          "il": "Denizli",
          "kampusler": [
            {
              "kampus_adi": "Bahçelievler Uğur Okulları Kampüsü",
              "adres": "Bahçelievler Mah. 3014 Sk. No:18 Merkezefendi/Denizli",
              "telefon": "0258 377 22 22"
            },
            {
              "kampus_adi": "Denizli Uğur Fen ve Anadolu Lisesi",
              "adres": "Yenişehir Mah. 19. Sok. No: 8 Merkezefendi/Denizli",
              "telefon": "0258 241 12 12"
            }
          ]
        },
        {
          "il": "Diyarbakır",
          "kampusler": [
            {
              "kampus_adi": "Ergani Uğur Okulları Kampüsü",
              "adres": "İstasyon Mah. Ahmet Kaya Cad. No: 12 Ergani/Diyarbakır",
              "telefon": "0412 611 00 00"
            }
          ]
        },
        {
          "il": "Erzurum",
          "kampusler": [
            {
              "kampus_adi": "Palandöken Uğur Okulları Kampüsü",
              "adres": "Palandöken Mah. Mimar Sinan Cad. No: 10 Palandöken/Erzurum",
              "telefon": "0442 342 02 02"
            }
          ]
        },
        {
          "il": "Eskişehir",
          "kampusler": [
            {
              "kampus_adi": "Odunpazarı Uğur Okulları Kampüsü",
              "adres": "Emek Mah. 4. Cadde No: 33 Odunpazarı/Eskişehir",
              "telefon": "0222 221 21 21"
            }
          ]
        },
        {
          "il": "Gaziantep",
          "kampusler": [
            {
              "kampus_adi": "Şehitkamil Uğur Okulları Kampüsü",
              "adres": "İbrahimli Mah. 136. Cad. No: 5 Şehitkamil/Gaziantep",
              "telefon": "0342 323 10 10"
            }
          ]
        },
        {
          "il": "İstanbul",
          "kampusler": [
            {
              "kampus_adi": "Ataşehir Uğur Okulları Kampüsü",
              "adres": "İçerenköy Mah. Erguvan Sk. No: 2 Ataşehir / İstanbul",
              "telefon": "0216 577 00 10"
            },
            {
              "kampus_adi": "Bakırköy Uğur Okulları Anadolu Lisesi Kampüsü",
              "adres": "İncirli Cad. No: 2 Bakırköy / İstanbul",
              "telefon": "0212 571 58 58"
            },
            {
              "kampus_adi": "Basın Ekspres Uğur Okulları Kampüsü",
              "adres": "Evren Mah. 1. Sok. No: 5 Bağcılar / İstanbul",
              "telefon": "0212 651 86 86"
            },
            {
              "kampus_adi": "Bolluca Uğur Okulları Kampüsü",
              "adres": "Bolluca Mah. Bağlar Cad. No: 15 Arnavutköy / İstanbul",
              "telefon": "0212 682 05 05"
            },
            {
              "kampus_adi": "Çamlıca Uğur Okulları Kampüsü",
              "adres": "Ferah Mah. Ferah Cad. No: 18 Üsküdar / İstanbul",
              "telefon": "0216 316 00 00"
            },
            {
              "kampus_adi": "Florya Uğur Koleji Kampüsleri",
              "adres": "Fabrikalar Cad. Akasya Sokak No:34 Beşyol - Küçükçekmece / İstanbul",
              "telefon": "0212 592 88 44"
            },
            {
              "kampus_adi": "Gaziosmanpaşa Uğur Anadolu Lisesi",
              "adres": "Hürriyet Mah. Cumhuriyet Cad. No: 20 Gaziosmanpaşa / İstanbul",
              "telefon": "0212 616 11 11"
            },
            {
              "kampus_adi": "Güngören Uğur Okulları Kampüsü",
              "adres": "Akıncılar Mah. Akıncılar Cad. No: 15 Güngören / İstanbul",
              "telefon": "0212 554 19 19"
            },
            {
              "kampus_adi": "Halkalı Uğur Okulları Kampüsü",
              "adres": "Atakent Mah. 4. Cad. No: 1 Küçükçekmece / İstanbul",
              "telefon": "0212 471 00 00"
            },
            {
              "kampus_adi": "Kartal Uğur Okulları Kampüsü",
              "adres": "Cumhuriyet Mh. Yakacık (D100) Kuzey yan yol No:31 Kartal / İstanbul",
              "telefon": "0216 504 48 07-08"
            },
            {
              "kampus_adi": "Kemerburgaz Uğur Anadolu Lisesi",
              "adres": "Göktürk Merkez Mah. Çamlık Cad. No: 1 Eyüpsultan / İstanbul",
              "telefon": "0212 322 00 00"
            },
            {
              "kampus_adi": "Kurtköy Uğur Okulları Kampüsü",
              "adres": "Yenişehir Mah. Millet Cad. No: 17 Pendik / İstanbul",
              "telefon": "0216 482 00 00"
            },
            {
              "kampus_adi": "Pendik Uğur Anadolu Lisesi",
              "adres": "Yenişehir Mah. Millet Cad. No: 17 Pendik / İstanbul",
              "telefon": "0216 482 00 00"
            },
            {
              "kampus_adi": "Sancaktepe Uğur Okulları Kampüsü",
              "adres": "Emek Mah. Ordu Cad. No: 22 Sancaktepe / İstanbul",
              "telefon": "0216 561 00 00"
            },
            {
              "kampus_adi": "Sefaköy Uğur Okulları Kampüsü",
              "adres": "Fevzi Çakmak Mah. Tevfik Fikret Cad. No: 3 Küçükçekmece / İstanbul",
              "telefon": "0212 580 00 00"
            },
            {
              "kampus_adi": "Sultanbeyli Uğur Okulları Kampüsü",
              "adres": "Necip Fazıl Mah. Fatih Bulvarı No: 15 Sultanbeyli / İstanbul",
              "telefon": "0216 398 00 00"
            },
            {
              "kampus_adi": "Topkapı Uğur Okulları Kampüsü",
              "adres": "Maltepe Mah. Topkapı Cad. No: 1 Zeytinburnu / İstanbul",
              "telefon": "0212 613 00 00"
            },
            {
              "kampus_adi": "Tuzla Uğur Okulları Kampüsü",
              "adres": "Evliya Çelebi Mahallesi Sahil Bulvarı No: 6/1-6/2 Tuzla / İstanbul",
              "telefon": "0216 446 16 33-34-35-36"
            },
            {
              "kampus_adi": "Ümraniye - Atakent Uğur Okulları Kampüsü",
              "adres": "Atakent Mah. Saray Cad. No: 5 Ümraniye / İstanbul",
              "telefon": "0216 577 00 10"
            }
          ]
        },
        {
          "il": "İzmir",
          "kampusler": [
            {
              "kampus_adi": "Aliağa Uğur Okulları Kampüsü",
              "adres": "Yeni Mah. Atatürk Cad. No: 80 Aliağa / İzmir",
              "telefon": "0232 616 10 10"
            },
            {
              "kampus_adi": "Bayraklı Uğur Okulları Kampüsü",
              "adres": "Mansuroğlu Mah. 165. Sok. No: 20 Bayraklı / İzmir",
              "telefon": "0232 461 40 40"
            },
            {
              "kampus_adi": "Bornova Uğur Okulları Kampüsü",
              "adres": "Kazımdirik Mah. Sanayi Cad. No: 10 Bornova / İzmir",
              "telefon": "0232 342 02 02"
            },
            {
              "kampus_adi": "Narlıdere Uğur Okulları Kampüsü",
              "adres": "Sahilevleri Mah. 22. Sok. No: 1 Narlıdere / İzmir",
              "telefon": "0232 238 00 00"
            },
            {
              "kampus_adi": "Örnekköy Uğur Okulları Kampüsü",
              "adres": "Örnekköy Mah. 6752. Sok. No: 1 Karşıyaka / İzmir",
              "telefon": "0232 368 00 00"
            },
            {
              "kampus_adi": "Şemikler Uğur Okulları Kampüsü",
              "adres": "Şemikler Mah. 6271. Sok. No: 3 Karşıyaka / İzmir",
              "telefon": "0232 322 00 00"
            },
            {
              "kampus_adi": "Tire Uğur Okulları Kampüsü",
              "adres": "Kurtuluş Mah. Adnan Menderes Bulvarı No: 50 Tire / İzmir",
              "telefon": "0232 512 00 00"
            }
          ]
        },
        {
          "il": "Kayseri",
          "kampusler": [
            {
              "kampus_adi": "Kayseri Uğur Okulları Kampüsü",
              "adres": "Gültepe Mah. Mustafa Şimşek Cad. No: 12 Melikgazi / Kayseri",
              "telefon": "0352 222 00 00"
            }
          ]
        },
        {
          "il": "Kocaeli",
          "kampusler": [
            {
              "kampus_adi": "Darıca Uğur Okulları Kampüsü",
              "adres": "Osmangazi Mah. İstasyon Cad. No: 13 Darıca / Kocaeli",
              "telefon": "0262 655 00 00"
            }
          ]
        },
        {
          "il": "Malatya",
          "kampusler": [
            {
              "kampus_adi": "Malatya Uğur Okulları Kampüsü",
              "adres": "Fırat Mah. Turgut Özal Bulvarı No: 20 Yeşilyurt / Malatya",
              "telefon": "0422 323 10 10"
            }
          ]
        },
        {
          "il": "Mardin",
          "kampusler": [
            {
              "kampus_adi": "Kızıltepe Uğur Okulları Kampüsü",
              "adres": "Koçhisar Mah. 10. Cad. No: 5 Kızıltepe / Mardin",
              "telefon": "0482 312 00 00"
            },
            {
              "kampus_adi": "Nusaybin Uğur Anadolu Lisesi",
              "adres": "Yenişehir Mah. Barış Bulvarı No: 10 Nusaybin / Mardin",
              "telefon": "0482 415 00 00"
            }
          ]
        },
        {
          "il": "Muğla",
          "kampusler": [
            {
              "kampus_adi": "Bodrum Uğur Anadolu Lisesi",
              "adres": "Ortakent Mah. Cumhuriyet Cad. No: 33 Bodrum / Muğla",
              "telefon": "0252 382 00 00"
            },
            {
              "kampus_adi": "Marmaris Uğur Okulları Kampüsü",
              "adres": "Armutalan Mah. Kenan Evren Bulvarı No: 15 Marmaris / Muğla",
              "telefon": "0252 413 00 00"
            }
          ]
        },
        {
          "il": "Sakarya",
          "kampusler": [
            {
              "kampus_adi": "Sakarya Uğur Okulları Kampüsü",
              "adres": "Serdivan Mah. 32 Evler Cad. No: 10 Serdivan / Sakarya",
              "telefon": "0264 278 00 00"
            }
          ]
        },
        {
          "il": "Samsun",
          "kampusler": [
            {
              "kampus_adi": "Canik Uğur Okulları Kampüsü",
              "adres": "Gaziosmanpaşa Mah. Bahçe Sk. No: 20 Canik / Samsun",
              "telefon": "0362 238 00 00"
            },
            {
              "kampus_adi": "İlkadım Uğur Okulları Kampüsü",
              "adres": "Kale Mah. Fuar Cad. No: 10 İlkadım / Samsun",
              "telefon": "0362 431 00 00"
            }
          ]
        },
        {
          "il": "Şanlıurfa",
          "kampusler": [
            {
              "kampus_adi": "Viranşehir Uğur Okulları Kampüsü",
              "adres": "Yeni Mah. Mardin Yolu Üzeri No: 1 Viranşehir / Şanlıurfa",
              "telefon": "0414 313 00 00"
            }
          ]
        },
        {
          "il": "Tekirdağ",
          "kampusler": [
            {
              "kampus_adi": "Çorlu Uğur Okulları Kampüsü",
              "adres": "Hıdırağa Mah. Çetin Emeç Cad. No: 1 Çorlu / Tekirdağ",
              "telefon": "0282 654 00 00"
            }
          ]
        },
        {
          "il": "Trabzon",
          "kampusler": [
            {
              "kampus_adi": "Trabzon Uğur Okulları Kampüsü",
              "adres": "Soğuksu Mah. Soğuksu Cad. No: 2 Ortahisar / Trabzon",
              "telefon": "0462 230 00 00"
            }
          ]
        },
        {
          "il": "Van",
          "kampusler": [
            {
              "kampus_adi": "Van Uğur Okulları Kampüsü",
              "adres": "İpekyolu Mah. 2. Cad. No: 5 İpekyolu / Van",
              "telefon": "0432 216 00 00"
            }
          ]
        },
        {
          "il": "Yalova",
          "kampusler": [
            {
              "kampus_adi": "Yalova Uğur Okulları Kampüsü",
              "adres": "Adnan Menderes Mah. 13. Sok. No: 1 Yalova Merkez / Yalova",
              "telefon": "0226 811 00 00"
            }
          ]
        }
      ]
    };

    const defaultFillColor = '#AFAFAF'; // Haritanın varsayılan rengi
    const highlightColor = '#FFC107';   // Vurgu rengi (sarı)

    // Başlangıçta kampüsü olan illeri renklendir
    const cityElements = document.querySelectorAll('#turkey-map-interactive g[data-city-name]');
    // Doğrudan kampüs verisinden şehir isimlerini alıyoruz
    const campusCities = campusData.ugur_okullari_kampusleri.map(item => item.il);

    cityElements.forEach(cityEl => {
        const cityName = cityEl.getAttribute('data-city-name');
        // Eğer şehrin kampüsü varsa, ilgili CSS sınıfını ekliyoruz
        if (campusCities.includes(cityName)) {
            cityEl.classList.add('has-campus');
        }
    });

    // Paneli kapatma
    closePanelBtn.addEventListener('click', () => {
        sidePanel.classList.remove('active');
    });

    cities.forEach(city => {
        const cityName = city.dataset.cityName;

        // Şehre tıklanınca paneli aç ve kampüsleri listele
        city.addEventListener('click', () => {
            panelCityName.textContent = cityName;
            const cityData = campusData.ugur_okullari_kampusleri.find(item => item.il.toLowerCase() === cityName.toLowerCase());

            campusListContainer.innerHTML = ''; // Önceki listeyi temizle

            if (cityData && cityData.kampusler.length > 0) {
                cityData.kampusler.forEach(campus => {
                    const campusElement = document.createElement('div');
                    campusElement.className = 'campus-item';
                    campusElement.innerHTML = `
                        <h4>${campus.kampus_adi}</h4>
                        <p>${campus.adres}</p>
                        <p class="phone">Tel: ${campus.telefon}</p>
                    `;
                    campusListContainer.appendChild(campusElement);
                });
            } else {
                campusListContainer.innerHTML = `<p class="no-campus">Bu ilde henüz kampüsümüz bulunmamaktadır.</p>`;
            }

            sidePanel.classList.add('active');
        });

        // Mouseover to show tooltip and highlight city
        city.addEventListener('mouseover', () => {
            const paths = city.querySelectorAll('path');
            if (cityName && paths.length > 0) {
                tooltip.textContent = cityName;
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'scale(1)';
                paths.forEach(path => { path.style.fill = '#FDB913'; });
            }
        });

        // Tooltip'i fare imleciyle hareket ettirme
        city.addEventListener('mousemove', (e) => {
            tooltip.style.left = `${e.pageX + 10}px`;
            tooltip.style.top = `${e.pageY + 15}px`;
        });

        // Mouseout to hide tooltip and remove highlight
        city.addEventListener('mouseout', () => {
            const paths = city.querySelectorAll('path');
            if (paths.length > 0) {
                // Rengi CSS'in yönetmesi için inline stili temizliyoruz.
                // Bu sayede .has-campus sınıfı olanlar soluk sarıya geri döner.
                paths.forEach(path => { path.style.fill = ''; });
            }
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'scale(0.9)';
        });
    });

    // Reklamı Geç Butonu
    if (skipButton) {
        skipButton.addEventListener('click', () => {
            // Reklamı geçme işlevi buraya eklenebilir.
            // Örneğin: document.querySelector('.ad-container').style.display = 'none';
        });
    }
});

document.addEventListener('DOMContentLoaded', () => {
    const holidays = [
        {
            name: 'Yılbaşı',
            date: '2025-01-01',
            duration: '1 Gün',
            month: 'Ocak',
            hotels: [
                'https://images.unsplash.com/photo-1516572349143-815493418672?q=80&w=2070&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1566073771259-6a8506099945?q=80&w=2070&auto=format&fit=crop'
            ]
        },
        {
            name: 'Ramazan Bayramı',
            date: '2025-03-30',
            duration: '3 Gün',
            month: 'Mart',
            hotels: [
                'https://images.unsplash.com/photo-1582619672895-357551ed1651?q=80&w=1974&auto=format&fit=crop',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDQ3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Ulusal Egemenlik ve Çocuk Bayramı',
            date: '2025-04-23',
            duration: '1 Gün',
            month: 'Nisan',
            hotels: [
                'https://images.unsplash.com/photo-1571896349842-33c89424de2d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDEwfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1611892440504-42a792e24d32?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDE1fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Emek ve Dayanışma Günü',
            date: '2025-05-01',
            duration: '1 Gün',
            month: 'Mayıs',
            hotels: [
                'https://images.unsplash.com/photo-1596436889106-be35e843f974?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDIyfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1445019980597-93e87ba0a690?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDI3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Gençlik ve Spor Bayramı',
            date: '2025-05-19',
            duration: '1 Gün',
            month: 'Mayıs',
            hotels: [
                'https://images.unsplash.com/photo-1568084680786-a84f91d1153c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDMxfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1590447158031-335a45558236?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDM3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Kurban Bayramı',
            date: '2025-06-06',
            duration: '4 Gün',
            month: 'Haziran',
            hotels: [
                'https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDQyfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDQ3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Demokrasi ve Milli Birlik Günü',
            date: '2025-07-15',
            duration: '1 Gün',
            month: 'Temmuz',
            hotels: [
                'https://images.unsplash.com/photo-1578683010236-d716f9a3f461?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDUyfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1621293954908-76f82638a24a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDU3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Zafer Bayramı',
            date: '2025-08-30',
            duration: '1 Gün',
            month: 'Ağustos',
            hotels: [
                'https://images.unsplash.com/photo-1564501049412-61c2a3083791?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDYyfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1631049307264-da0ec9d70304?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDY3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        },
        {
            name: 'Cumhuriyet Bayramı',
            date: '2025-10-29',
            duration: '1.5 Gün',
            month: 'Ekim',
            hotels: [
                'https://images.unsplash.com/photo-1598546723484-7b64375435ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDcyfHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400',
                'https://images.unsplash.com/photo-1618773928121-c32242e63f39?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzNjUyOXwwfDF8c2VhcmNofDc3fHxob3RlbHxlbnwwfHx8fDE2Mjk3NzM1NTI&ixlib=rb-1.2.1&q=80&w=400'
            ]
        }
    ];

    const timelineGrid = document.getElementById('timeline-grid');
    const monthNames = ['OCAK', 'ŞUBAT', 'MART', 'NİSAN', 'MAYIS', 'HAZİRAN', 'TEMMUZ', 'AĞUSTOS', 'EYLÜL', 'EKİM', 'KASIM', 'ARALIK'];
    const monthShortNames = ['Oca', 'Şub', 'Mar', 'Nis', 'May', 'Haz', 'Tem', 'Ağu', 'Eyl', 'Eki', 'Kas', 'Ara'];

    // Group holidays by month index
    const holidaysByMonth = holidays.reduce((acc, holiday) => {
        const monthIndex = new Date(holiday.date).getMonth();
        if (!acc[monthIndex]) {
            acc[monthIndex] = [];
        }
        acc[monthIndex].push(holiday);
        return acc;
    }, {});

    // Create the timeline grid
    monthNames.forEach((name, index) => {
        const monthContainer = document.createElement('div');
        monthContainer.className = 'month-container';

        const monthNameDiv = document.createElement('div');
        monthNameDiv.className = 'month-name';
        monthNameDiv.innerText = name;

        const monthHolidaysDiv = document.createElement('div');
        monthHolidaysDiv.className = 'month-holidays';

        if (holidaysByMonth[index]) {
            holidaysByMonth[index].forEach(holiday => {
                const holidayDate = new Date(holiday.date);
                const dayOfMonth = holidayDate.getDate();
                const monthShortName = monthShortNames[index];

                const marker = document.createElement('div');
                marker.className = 'holiday-marker';
                marker.setAttribute('data-tooltip', holiday.name);

                marker.innerHTML = `
                    <div class="icon"></div>
                    <div class="name">${dayOfMonth}<br>${monthShortName}</div>
                `;

                marker.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    openPopup(holiday);
                });
                monthHolidaysDiv.appendChild(marker);
            });
        }

        monthContainer.appendChild(monthNameDiv);
        monthContainer.appendChild(monthHolidaysDiv);
        timelineGrid.appendChild(monthContainer);
    });

    function startCountdown() {
        function updateCountdown() {
            const now = new Date();
            const upcomingHolidays = holidays.filter(h => new Date(h.date) > now);
            
            if (upcomingHolidays.length === 0) {
                document.getElementById('days').innerText = '0';
                document.getElementById('hours').innerText = '00';
                document.getElementById('minutes').innerText = '00';
                document.getElementById('seconds').innerText = '00';
                return;
            }

            const nextHoliday = upcomingHolidays[0];
            const holidayDate = new Date(nextHoliday.date);
            const currentTime = now.getTime();
            const distance = holidayDate - currentTime;

            if (distance < 0) {
                // Geçmiş tatil, bir sonraki tatile geç
                setTimeout(updateCountdown, 1000);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            document.getElementById('days').innerText = days;
            document.getElementById('hours').innerText = String(hours).padStart(2, '0');
            document.getElementById('minutes').innerText = String(minutes).padStart(2, '0');
            document.getElementById('seconds').innerText = String(seconds).padStart(2, '0');
            
            setTimeout(updateCountdown, 1000);
        }
        
        // İlk çağrı
        updateCountdown();
    }

    const popup = document.getElementById('popup');
    const closeBtn = document.querySelector('.close-button');

    function openPopup(holiday) {
        document.getElementById('popup-title').innerText = holiday.name;
        document.getElementById('popup-duration').innerText = `Tatil Süresi: ${holiday.duration}`;
        document.getElementById('popup-image').src = holiday.hotels[0];
        popup.style.display = 'flex';
    }

    function closePopup() {
        popup.style.display = 'none';
    }

    closeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        closePopup();
    });
    popup.addEventListener('click', (e) => {
        if (e.target === popup) {
             e.preventDefault();
             e.stopPropagation();
            closePopup();
        }
    });

    startCountdown();

    // --- Arka Plan Değiştirme Kodu Başlangıcı ---
    const container = document.querySelector('.container');
    const btnYurtici = document.getElementById('btn-yurtici');
    const btnKultur = document.getElementById('btn-kultur');
    const btnKibris = document.getElementById('btn-kibris');
    const btnYurtdisi = document.getElementById('btn-yurtdisi');

    const backgrounds = {
        yurtici: 'yurtici.jpg',
        kultur: 'arkaplan.png',
        kibris: 'kibris.jpg',
        yurtdisi: 'yurtdisi.jpg'
    };

    function changeBackground(imageName) {
        // Buton tıklamalarının linkin varsayılan davranışını engellemesi
        event.preventDefault();
        container.style.transition = 'background-image 0.5s ease-in-out';
        container.style.backgroundImage = `url('${imageName}')`;
    }

    btnYurtici.addEventListener('click', () => changeBackground(backgrounds.yurtici));
    btnKultur.addEventListener('click', () => changeBackground(backgrounds.kultur));
    btnKibris.addEventListener('click', () => changeBackground(backgrounds.kibris));
    btnYurtdisi.addEventListener('click', () => changeBackground(backgrounds.yurtdisi));
    // --- Arka Plan Değiştirme Kodu Sonu ---
});

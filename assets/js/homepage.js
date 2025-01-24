document.addEventListener('DOMContentLoaded', async () => {
    // Ürün filtreleme
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Aktif filtre butonunu güncelle
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filterValue = button.dataset.filter;

            // Ürünleri filtrele
            products.forEach(product => {
                if (filterValue === 'all' || product.dataset.category === filterValue) {
                    product.style.display = 'flex';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // SSS Akordiyon
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');
        
        header.addEventListener('click', () => {
            const currentlyActive = document.querySelector('.faq-item.active');
            
            if (currentlyActive && currentlyActive !== item) {
                currentlyActive.classList.remove('active');
            }
            
            item.classList.toggle('active');
        });
    });

    // Stats Counter
    const stats = document.querySelectorAll('.stat-number');
    const statsSection = document.querySelector('.hero-stats');
    let started = false;

    function startCounter(el) {
        const target = parseInt(el.textContent);
        const increment = target / 50; // Animasyon hızı
        let currentNumber = 0;

        const counter = setInterval(() => {
            currentNumber += increment;
            
            if (currentNumber >= target) {
                el.textContent = target.toString().includes('K') ? 
                    Math.floor(target) + 'K+' : 
                    Math.floor(target) + '+';
                clearInterval(counter);
            } else {
                el.textContent = Math.floor(currentNumber);
            }
        }, 30);
    }

    function checkScroll() {
        const triggerBottom = window.innerHeight * 0.8;
        const statsSectionTop = statsSection.getBoundingClientRect().top;

        if (statsSectionTop < triggerBottom && !started) {
            stats.forEach(stat => {
                const value = stat.textContent;
                stat.textContent = value.replace(/[K+]/g, ''); // K+ ve + işaretlerini kaldır
                startCounter(stat);
            });
            started = true;
        }
    }

    // Sayfa yüklendiğinde ve scroll olduğunda kontrol et
    checkScroll();
    window.addEventListener('scroll', checkScroll);

    // Dil değiştirme fonksiyonları
    let translations = {};
    const currentLang = localStorage.getItem('language') || 'tr';
    
    async function loadTranslations(lang) {
        try {
            const response = await fetch(`/projects/eTutorsNativeS/assets/translations/${lang}.json`);
            if (!response.ok) throw new Error('Translation file not found');
            translations[lang] = await response.json();
        } catch (error) {
            console.error('Translation loading error:', error);
        }
    }
    
    function setLanguage(lang) {
        localStorage.setItem('language', lang);
        document.documentElement.setAttribute('lang', lang);
        
        // Önce çevirileri yükle, sonra içeriği güncelle
        loadTranslations(lang).then(() => {
            updateContent(lang);
            updateLangButton(lang);
        });
    }

    function updateContent(lang) {
        if (!translations[lang]) {
            console.error(`No translations found for ${lang}`);
            return;
        }

        document.querySelectorAll('[data-translate]').forEach(element => {
            const path = element.getAttribute('data-translate').split('.');
            let value = translations[lang];
            
            for (const key of path) {
                if (value && value[key]) {
                    value = value[key];
                } else {
                    console.warn(`Translation not found for: ${path.join('.')} in ${lang}`);
                    value = null;
                    break;
                }
            }

            if (value) {
                element.textContent = value;
            }
        });
    }

    function updateLangButton(lang) {
        const langBtn = document.querySelector('.lang-btn');
        const img = langBtn.querySelector('img');
        const span = langBtn.querySelector('span');
        
        img.src = `/projects/eTutorsNativeS/assets/images/flags/${lang}.svg`;
        span.textContent = lang.toUpperCase();
    }

    // Dil seçici olayları
    const langBtn = document.querySelector('.lang-btn');
    const langDropdown = document.querySelector('.lang-dropdown');
    const langOptions = document.querySelectorAll('.lang-option');

    langBtn.addEventListener('click', () => {
        langDropdown.classList.toggle('show');
    });

    langOptions.forEach(option => {
        option.addEventListener('click', () => {
            const lang = option.getAttribute('data-lang');
            setLanguage(lang);
            langDropdown.classList.remove('show');
        });
    });

    // Sayfa dışına tıklandığında dropdown'ı kapat
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.language-selector')) {
            langDropdown.classList.remove('show');
        }
    });

    // İlk yüklemede çevirileri al ve uygula
    await Promise.all([
        loadTranslations('tr'),
        loadTranslations('en')
    ]);
    
    setLanguage(currentLang);

    // Cookie yönetimi
    function initCookieConsent() {
        const cookiePopup = document.getElementById('cookiePopup');
        const cookieModal = document.getElementById('cookieModal');
        const floatingBtn = document.getElementById('floatingCookieBtn');
        const acceptAllBtn = document.getElementById('acceptAllCookies');
        const settingsBtn = document.getElementById('cookieSettings');
        const saveSettingsBtn = document.getElementById('saveCookieSettings');
        const closeModalBtn = document.querySelector('.close-modal');
        
        const cookieConsent = localStorage.getItem('cookieConsent');
        
        if (!cookieConsent) {
            cookiePopup.style.display = 'block';
        } else {
            floatingBtn.style.display = 'flex';
        }
        
        function saveCookieSettings(settings) {
            localStorage.setItem('cookieConsent', JSON.stringify(settings));
            cookiePopup.style.display = 'none';
            floatingBtn.style.display = 'flex';
            cookieModal.style.display = 'none';
        }
        
        acceptAllBtn.addEventListener('click', () => {
            saveCookieSettings({
                necessary: true,
                analytics: true,
                marketing: true
            });
        });
        
        settingsBtn.addEventListener('click', () => {
            cookieModal.style.display = 'flex';
        });
        
        floatingBtn.addEventListener('click', () => {
            cookieModal.style.display = 'flex';
        });
        
        closeModalBtn.addEventListener('click', () => {
            cookieModal.style.display = 'none';
        });
        
        saveSettingsBtn.addEventListener('click', () => {
            const settings = {
                necessary: true,
                analytics: document.getElementById('analyticsCookies').checked,
                marketing: document.getElementById('marketingCookies').checked
            };
            saveCookieSettings(settings);
        });
        
        // Modal dışına tıklandığında kapat
        cookieModal.addEventListener('click', (e) => {
            if (e.target === cookieModal) {
                cookieModal.style.display = 'none';
            }
        });
    }

    // Sayfa yüklendiğinde cookie yönetimini başlat
    initCookieConsent();
}); 
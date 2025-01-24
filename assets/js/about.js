document.addEventListener('DOMContentLoaded', async () => {
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
}); 
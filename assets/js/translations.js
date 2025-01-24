let translations = {};

// Çevirileri yükle
async function loadTranslations() {
    try {
        // TR çevirilerini yükle
        const trResponse = await fetch('/projects/eTutorsNativeS/assets/translations/tr.json');
        const trData = await trResponse.json();
        
        // EN çevirilerini yükle
        const enResponse = await fetch('/projects/eTutorsNativeS/assets/translations/en.json');
        const enData = await enResponse.json();
        
        // Çevirileri global objeye kaydet
        translations = {
            tr: trData,
            en: enData
        };
        
        // Sayfa yüklendiğinde son seçilen dili uygula
        const savedLang = localStorage.getItem('language') || 'tr';
        changeLanguage(savedLang);
    } catch (error) {
        console.error('Çeviriler yüklenirken hata oluştu:', error);
    }
}

// Dil değiştirme fonksiyonu
function changeLanguage(lang) {
    // Çeviriler yüklenmediyse bekle
    if (!translations[lang]) {
        console.warn('Çeviriler henüz yüklenmedi, tekrar deneniyor...');
        setTimeout(() => changeLanguage(lang), 100);
        return;
    }

    // Tüm çeviri elementlerini bul
    const elements = document.querySelectorAll('[data-translate]');
    
    // Her element için
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        
        // Çeviriyi bul
        let translation = translations[lang];
        const keys = key.split('.');
        
        // Nested objelerde dolaş
        for (const k of keys) {
            if (translation) {
                translation = translation[k];
            }
        }
        
        // Çeviri varsa uygula
        if (translation) {
            if (element.tagName === 'INPUT' && element.type === 'placeholder') {
                element.placeholder = translation;
            } else {
                element.textContent = translation;
            }
        }
    });
    
    // Dil tercihini localStorage'a kaydet
    localStorage.setItem('language', lang);
    
    // HTML lang attribute'unu güncelle
    document.documentElement.lang = lang;
    
    // Dil butonunu güncelle
    const langBtn = document.querySelector('.lang-btn');
    if (langBtn) {
        langBtn.innerHTML = `
            <img src="/projects/eTutorsNativeS/assets/images/flags/${lang}.svg" alt="${lang.toUpperCase()}">
            <span>${lang.toUpperCase()}</span>
        `;
    }
}

// Sayfa yüklendiğinde çevirileri yükle
document.addEventListener('DOMContentLoaded', loadTranslations); 
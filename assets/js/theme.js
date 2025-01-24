document.addEventListener('DOMContentLoaded', () => {
    const themeToggle = document.getElementById('themeToggle');
    const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');
    
    // Kullanıcının tercih ettiği temayı kontrol et
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.innerHTML = '<i class="ti ti-moon"></i>';
    } else if (currentTheme === 'light') {
        document.body.classList.remove('dark-theme');
        themeToggle.innerHTML = '<i class="ti ti-sun"></i>';
    }

    // Tema değiştirme butonu
    themeToggle.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="ti ti-sun"></i>';
        } else {
            document.body.classList.add('dark-theme');
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="ti ti-moon"></i>';
        }
    });
}); 
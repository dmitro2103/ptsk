// Оптимизированный скрипт с мгновенной загрузкой
document.addEventListener('DOMContentLoaded', function() {
    // Минимальный экран загрузки
    
    const loading = document.createElement('div');
    loading.className = 'page-loading';
    loading.innerHTML = '<div class="loader"></div>';
    document.body.appendChild(loading);
    
    // Мгновенное скрытие загрузки
    setTimeout(() => {
        loading.classList.add('hidden');
        setTimeout(() => loading.remove(), 300);
    }, 100);
    
    // Мобильное меню
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
            document.body.style.overflow = nav.classList.contains('active') ? 'hidden' : '';
        });
        
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    // Плавный скролл
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') === '#') return;
            
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Кнопка "Наверх"
    const scrollTopBtn = document.createElement('button');
    scrollTopBtn.className = 'scroll-top-btn';
    scrollTopBtn.innerHTML = '<i class="fas fa-arrow-up"></i>';
    document.body.appendChild(scrollTopBtn);
    
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    
    // Показ/скрытие кнопки "Наверх" и эффект шапки
    window.addEventListener('scroll', function() {
        const currentScroll = window.pageYOffset;
        
        scrollTopBtn.classList.toggle('show', currentScroll > 500);
        
        const header = document.querySelector('.header');
        if (header) {
            header.classList.toggle('scrolled', currentScroll > 50);
        }
    });
    
    // Переключение темы
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        const currentTheme = localStorage.getItem('theme') || 'light';
        document.documentElement.setAttribute('data-theme', currentTheme);
        
        themeToggle.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'light' ? 'dark' : 'light';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            themeToggle.style.transform = 'scale(1.1)';
            setTimeout(() => themeToggle.style.transform = '', 200);
        });
    }
    
    // Анимация статистики
    const statNumbers = document.querySelectorAll('.stat-number[data-count]');
    
    function animateValue(element, start, end, duration) {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value;
            
            if (progress < 1) {
                window.requestAnimationFrame(step);
            } else if (element.dataset.count.includes('+')) {
                element.textContent = end + '+';
            }
        };
        window.requestAnimationFrame(step);
    }
    
    // Анимация элементов при скролле
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
                
                if (entry.target.classList.contains('stat-number')) {
                    const count = entry.target.dataset.count;
                    if (count && !entry.target.classList.contains('counted')) {
                        const target = parseInt(count);
                        animateValue(entry.target, 0, target, 1500);
                        entry.target.classList.add('counted');
                    }
                }
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
});

window.addEventListener('load', function() {
    document.body.classList.add('page-loaded');
    
    // Анимация появления контента
    setTimeout(() => {
        document.querySelectorAll('.hero-text, .mission-card').forEach(el => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
        });
    }, 300);
});// Исправленный счетчик для всех страниц
function animateCounter(element, start, end, duration) {
    if (!element || element.classList.contains('counted')) return;
    
    element.classList.add('counted');
    
    let startTime = null;
    const step = (timestamp) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        if (element.dataset.count && element.dataset.count.includes('+')) {
            element.textContent = value + '+';
        } else {
            element.textContent = value;
        }
        
        if (progress < 1) {
            window.requestAnimationFrame(step);
        }
    };
    
    window.requestAnimationFrame(step);
}

// Улучшенный observer для счетчиков
const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const element = entry.target;
            
            if (element.classList.contains('stat-number') || 
                element.classList.contains('stat-number-counter')) {
                
                const count = element.dataset.count;
                if (count) {
                    let target = parseInt(count);
                    if (count.includes('+')) {
                        target = parseInt(count.replace('+', ''));
                    }
                    
                    animateCounter(element, 0, target, 1500);
                }
            }
        }
    });
}, { threshold: 0.5 });

// Инициализация счетчиков при загрузке
document.addEventListener('DOMContentLoaded', function() {
    // Находим все счетчики
    const counters = document.querySelectorAll('.stat-number[data-count], .event-stats .stat-number[data-count]');
    counters.forEach(counter => {
        counterObserver.observe(counter);
    });
    
    // Анимация появления элементов
    setTimeout(() => {
        const animatedElements = document.querySelectorAll('.animate-on-scroll, .mission-card, .info-card, .step, .feature');
        animatedElements.forEach((el, index) => {
            setTimeout(() => {
                el.style.opacity = '1';
                el.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 300);
});

// Экстренный фикс для логотипа - принудительное обновление цветов
function fixLogoColors() {
    const isDarkTheme = document.documentElement.getAttribute('data-theme') === 'dark';
    const logoHeadings = document.querySelectorAll('.logo-text h1');
    const logoParagraphs = document.querySelectorAll('.logo-text p');
    
    // Принудительно устанавливаем цвета
    logoHeadings.forEach(h1 => {
        h1.style.color = isDarkTheme ? '#FFFFFF' : '#000000';
        h1.style.webkitTextFillColor = isDarkTheme ? '#FFFFFF' : '#000000';
        h1.style.background = 'none';
        h1.style.textShadow = 'none';
    });
    
    logoParagraphs.forEach(p => {
        p.style.color = isDarkTheme ? '#CCCCCC' : '#333333';
    });
}

// Вызываем при загрузке и при изменении темы
document.addEventListener('DOMContentLoaded', function() {
    setTimeout(fixLogoColors, 100);
    
    // При изменении темы тоже обновляем цвета
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            setTimeout(fixLogoColors, 200);
        });
    }
});

// Также обновляем при каждом изменении темы через медиазапрос
const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
mediaQuery.addEventListener('change', fixLogoColors);
document.addEventListener('DOMContentLoaded', function() {
    const domElements = {
        accountBtn: document.querySelector('.account-btn'),
        dropdownContent: document.querySelector('.dropdown-content'),
        lightThemeBtn: document.getElementById('lightThemeBtn'),
        darkThemeBtn: document.getElementById('darkThemeBtn'),
        usernameDisplay: document.getElementById('username-display'),
        galleryImages: document.querySelectorAll('.product-gallery img'),
        fullscreenGallery: document.querySelector('.fullscreen-gallery'),
        fullscreenImage: document.querySelector('.fullscreen-image'),
        closeGalleryBtn: document.querySelector('.close-gallery'),
        prevBtn: document.querySelector('.prev-btn'),
        nextBtn: document.querySelector('.next-btn'),
        galleryCounter: document.querySelector('.gallery-counter'),
        contactSellerBtn: document.querySelector('.contact-seller'),
        contactModal: document.querySelector('.contact-modal'),
        closeModalBtn: document.querySelector('.close-modal'),
        sellerPhone: document.getElementById('seller-phone'),
        copyNotification: document.getElementById('copy-notification')
    };

    function redirectToHome() {
        window.location.href = '../AutoMarket.html';
    }

    function updateAccountMenu() {
        if (!domElements.dropdownContent) return;

        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const existingLinks = domElements.dropdownContent.querySelectorAll('a:not([href="../favorites.html"])');

        existingLinks.forEach(el => el.remove());

        if (currentUser) {
            const logoutLink = document.createElement('a');
            logoutLink.href = '#';
            logoutLink.className = 'logout-btn';
            logoutLink.textContent = 'Выйти';
            logoutLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('currentUser');
                redirectToHome();
            });
            domElements.dropdownContent.prepend(logoutLink);
        } else {
            const loginLink = document.createElement('a');
            loginLink.href = '../login.html';
            loginLink.textContent = 'Войти';
            domElements.dropdownContent.prepend(loginLink);

            const registerLink = document.createElement('a');
            registerLink.href = '../register.html';
            registerLink.textContent = 'Зарегистрироваться';
            loginLink.insertAdjacentElement('afterend', registerLink);
        }
    }

    function updateUserDisplay() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));

        if (domElements.usernameDisplay) {
            domElements.usernameDisplay.textContent = currentUser ? currentUser.username : '';
        }
    }

    function initAccountDropdown() {
        if (!domElements.accountBtn || !domElements.dropdownContent) return;

        domElements.accountBtn.addEventListener('click', function(e) {
            e.stopPropagation();
            domElements.dropdownContent.classList.toggle('show');
        });

        document.addEventListener('click', function(e) {
            if (!e.target.closest('.account-dropdown')) {
                domElements.dropdownContent.classList.remove('show');
            }
        });
    }

    function initThemeSwitcher() {
        if (domElements.lightThemeBtn && domElements.darkThemeBtn) {
            const savedTheme = localStorage.getItem('theme') || 'light';
            setTheme(savedTheme);

            domElements.lightThemeBtn.addEventListener('click', () => setTheme('light'));
            domElements.darkThemeBtn.addEventListener('click', () => setTheme('dark'));
        }
    }

    function setTheme(theme) {
        document.body.classList.remove('light-theme', 'dark-theme');
        document.body.classList.add(`${theme}-theme`);
        localStorage.setItem('theme', theme);
        
        if (domElements.lightThemeBtn && domElements.darkThemeBtn) {
            domElements.lightThemeBtn.style.fontWeight = theme === 'light' ? 'bold' : 'normal';
            domElements.darkThemeBtn.style.fontWeight = theme === 'dark' ? 'bold' : 'normal';
        }
    }

    function checkAuthAndRedirect() {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        const isAuthPage = window.location.pathname.includes('login.html') || 
                          window.location.pathname.includes('register.html');
        
        if (currentUser && isAuthPage) {
            redirectToHome();
        }
    }

    function initGallery() {
        if (!domElements.galleryImages.length || !domElements.fullscreenGallery) return;

        let currentImageIndex = 0;

        domElements.galleryImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                currentImageIndex = index;
                updateFullscreenImage();
                domElements.fullscreenGallery.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });
        });

        domElements.closeGalleryBtn.addEventListener('click', () => {
            domElements.fullscreenGallery.style.display = 'none';
            document.body.style.overflow = '';
        });

        domElements.prevBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex - 1 + domElements.galleryImages.length) % domElements.galleryImages.length;
            updateFullscreenImage();
        });

        domElements.nextBtn.addEventListener('click', () => {
            currentImageIndex = (currentImageIndex + 1) % domElements.galleryImages.length;
            updateFullscreenImage();
        });

        domElements.fullscreenGallery.addEventListener('click', (e) => {
            if (e.target === domElements.fullscreenGallery) {
                domElements.fullscreenGallery.style.display = 'none';
                document.body.style.overflow = '';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (domElements.fullscreenGallery.style.display === 'flex') {
                if (e.key === 'Escape') {
                    domElements.fullscreenGallery.style.display = 'none';
                    document.body.style.overflow = '';
                } else if (e.key === 'ArrowLeft') {
                    domElements.prevBtn.click();
                } else if (e.key === 'ArrowRight') {
                    domElements.nextBtn.click();
                }
            }
        });

        function updateFullscreenImage() {
            const imgSrc = domElements.galleryImages[currentImageIndex].src;
            domElements.fullscreenImage.src = imgSrc;
            domElements.galleryCounter.textContent = `${currentImageIndex + 1} / ${domElements.galleryImages.length}`;
        }
    }

    function initContactModal() {
        if (domElements.contactSellerBtn && domElements.contactModal) {
            domElements.contactSellerBtn.addEventListener('click', function() {
                domElements.contactModal.style.display = 'flex';
                document.body.style.overflow = 'hidden';
            });

            domElements.closeModalBtn.addEventListener('click', function() {
                domElements.contactModal.style.display = 'none';
                document.body.style.overflow = '';
            });

            domElements.contactModal.addEventListener('click', function(e) {
                if (e.target === domElements.contactModal) {
                    domElements.contactModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });

            domElements.sellerPhone.addEventListener('click', function() {
                const phoneNumber = this.textContent.trim().replace(/\s+/g, ' ');
                const textarea = document.createElement('textarea');
                textarea.value = phoneNumber;
                document.body.appendChild(textarea);
                textarea.select();
                
                try {
                    const successful = document.execCommand('copy');
                    document.body.removeChild(textarea);
                    
                    if (successful) {
                        domElements.copyNotification.style.display = 'block';
                        setTimeout(() => {
                            domElements.copyNotification.style.display = 'none';
                        }, 2500);
                    } else {
                        alert('Не удалось скопировать номер. Скопируйте вручную: ' + phoneNumber);
                    }
                } catch (err) {
                    document.body.removeChild(textarea);
                    alert('Не удалось скопировать номер. Скопируйте вручную: ' + phoneNumber);
                }
            });

            document.addEventListener('keydown', function(e) {
                if (e.key === 'Escape' && domElements.contactModal.style.display === 'flex') {
                    domElements.contactModal.style.display = 'none';
                    document.body.style.overflow = '';
                }
            });
        }
    }

    // Инициализация всех функций
    function init() {
        updateUserDisplay();
        initAccountDropdown();
        updateAccountMenu();
        initThemeSwitcher();
        checkAuthAndRedirect();
        initGallery();
        initContactModal();
    }

    init();
});
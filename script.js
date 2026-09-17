const topBar = document.getElementById('topBar');
const themeToggle = document.getElementById('themeToggle');
const themeIcon = document.getElementById('themeIcon');

window.addEventListener('scroll', () => {
    topBar.classList.toggle('scrolled', window.scrollY > 0);
});

function setTheme(dark) {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light');
    themeIcon.textContent = dark ? 'light_mode' : 'dark_mode';
    localStorage.setItem('theme', dark ? 'dark' : 'light');
}

const saved = localStorage.getItem('theme');
if (saved) {
    setTheme(saved === 'dark');
} else {
    setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches);
}

themeToggle.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    setTheme(!isDark);
});

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// Download dialog animation
const DOWNLOAD_URL = 'https://github.com/kloperaingolator-commits/zvonilka/releases/download/Zvon/Zvonilka3.exe';
const downloadButton = document.querySelector('.download-button');
const overlay = document.getElementById('downloadOverlay');
const ringWrap = document.getElementById('progressRingWrap');
const ringFill = document.getElementById('progressFill');
const percentText = document.getElementById('progressPercent');
const dialogText = document.getElementById('downloadDialogText');
const centerIcon = document.getElementById('progressCenterIcon');
const CIRC = 339.292;
let isDownloading = false;

function closeDialog() {
    setTimeout(() => {
        overlay.classList.remove('show');
        isDownloading = false;
        ringWrap.classList.remove('done');
        centerIcon.classList.remove('spinning');
        centerIcon.textContent = 'download';
        percentText.classList.remove('done');
    }, 1800);
}

downloadButton.addEventListener('click', (e) => {
    e.preventDefault();
    if (isDownloading) return;
    isDownloading = true;

    const btnIcon = downloadButton.querySelector('.material-symbols-rounded');
    btnIcon.classList.add('spinning');

    ringWrap.classList.remove('done');
    percentText.classList.remove('done');
    centerIcon.textContent = 'download';
    centerIcon.classList.add('spinning');
    ringFill.style.strokeDashoffset = CIRC;
    percentText.textContent = '0%';
    dialogText.textContent = 'Загрузка…';
    overlay.classList.add('show');

    let progress = 0;
    const interval = setInterval(() => {
        progress += Math.random() * 7 + 3;

        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            btnIcon.classList.remove('spinning');

            ringWrap.classList.add('done');
            ringFill.style.strokeDashoffset = 0;
            centerIcon.classList.remove('spinning');
            centerIcon.textContent = 'check_circle';
            percentText.textContent = '100%';
            percentText.classList.add('done');
            dialogText.textContent = 'Готово!';

            if (DOWNLOAD_URL.startsWith('http')) {
                window.open(DOWNLOAD_URL, '_blank', 'noopener');
            } else {
                const a = document.createElement('a');
                a.href = DOWNLOAD_URL;
                a.download = '';
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
            }

            closeDialog();
        } else {
            ringFill.style.strokeDashoffset = CIRC * (1 - progress / 100);
            percentText.textContent = Math.floor(progress) + '%';
        }
    }, 100);
});

// Material ripple effect
document.querySelectorAll('.download-button, .icon-button, .theme-toggle').forEach(btn => {
    btn.addEventListener('pointerdown', (e) => {
        const rect = btn.getBoundingClientRect();
        const ripple = document.createElement('span');
        const size = Math.max(rect.width, rect.height) * 2;
        ripple.className = 'ripple';
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
        ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';
        btn.appendChild(ripple);
        ripple.addEventListener('animationend', () => ripple.remove());
    });
});

// Studio dialog
const studioCard = document.getElementById('studioCard');
const studioOverlay = document.getElementById('studioOverlay');
const studioClose = document.getElementById('studioClose');
const studioCloseBtn = document.getElementById('studioCloseBtn');

function openStudio() {
    studioOverlay.classList.add('show');
    document.body.style.overflow = 'hidden';
}

function closeStudio() {
    studioOverlay.classList.remove('show');
    document.body.style.overflow = '';
}

studioCard.addEventListener('click', openStudio);

studioClose.addEventListener('click', closeStudio);
studioCloseBtn.addEventListener('click', closeStudio);

studioOverlay.addEventListener('click', (e) => {
    if (e.target === studioOverlay) closeStudio();
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && studioOverlay.classList.contains('show')) {
        closeStudio();
    }
});

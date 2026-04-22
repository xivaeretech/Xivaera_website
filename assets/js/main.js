document.addEventListener('DOMContentLoaded', () => {
    initFadeUpAnimations();
    initMobileMenu();
    initSmoothScroll();
    initHoursBadge();
    initCounters();
    initPortfolioFilter();
    initContactForm();
    initScrollTopButton();
    initToastClose();
});

/* ─────────────────────────────────────────
   Fade-up animation
───────────────────────────────────────── */
function initFadeUpAnimations() {
    const fades = document.querySelectorAll('.fade-up');
    if (!fades.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    fades.forEach((el) => observer.observe(el));

    const heroFade = document.querySelector('.hero .fade-up');
    if (heroFade) heroFade.classList.add('visible');
}

/* ─────────────────────────────────────────
   Mobile menu
───────────────────────────────────────── */
function initMobileMenu() {
    const mobileMenuBtn = document.querySelector('.mob-menu-btn');
    const mobileMenu = document.querySelector('.mobile-menu');

    if (!mobileMenuBtn || !mobileMenu) return;

    const icon = mobileMenuBtn.querySelector('i');

    mobileMenuBtn.addEventListener('click', () => {
        const isOpen = mobileMenu.classList.toggle('show');

        if (icon) {
            icon.classList.toggle('fa-bars', !isOpen);
            icon.classList.toggle('fa-times', isOpen);
        }
    });

    mobileMenu.querySelectorAll('a').forEach((link) => {
        link.addEventListener('click', () => {
            mobileMenu.classList.remove('show');

            if (icon) {
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-times');
            }
        });
    });
}

/* ─────────────────────────────────────────
   Smooth anchor scroll
───────────────────────────────────────── */
function initSmoothScroll() {
    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach((link) => {
        link.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (!href || href === '#') return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        });
    });
}

/* ─────────────────────────────────────────
   Hours badge for contact page
───────────────────────────────────────── */
function initHoursBadge() {
    const badge = document.getElementById('hours-badge');
    if (!badge) return;

    const now = new Date();
    const day = now.getDay(); // 0=Sun, 1=Mon ... 6=Sat
    const hour = now.getHours();

    let open = false;

    if (day >= 1 && day <= 5 && hour >= 10 && hour < 18) {
        open = true;
    }

    if (day === 6 && hour >= 10 && hour < 16) {
        open = true;
    }

    badge.className = `hours-status ${open ? 'open' : 'closed'}`;
    badge.textContent = open ? 'Currently open' : 'Currently closed';
}

/* ─────────────────────────────────────────
   Counter animation
───────────────────────────────────────── */
function initCounters() {
    const counters = document.querySelectorAll('.counter');
    if (!counters.length) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;

            const el = entry.target;
            const target = parseInt(el.dataset.target || '0', 10);
            const suffix = el.dataset.suffix || '';
            const duration = 1600;
            const startTime = performance.now();

            function updateCounter(now) {
                const progress = Math.min((now - startTime) / duration, 1);
                const value = Math.floor(progress * target);
                el.textContent = `${value}${suffix}`;

                if (progress < 1) {
                    requestAnimationFrame(updateCounter);
                } else {
                    el.textContent = `${target}${suffix}`;
                }
            }

            requestAnimationFrame(updateCounter);
            observer.unobserve(el);
        });
    }, { threshold: 0.3 });

    counters.forEach((counter) => observer.observe(counter));
}

/* ─────────────────────────────────────────
   Portfolio filter
───────────────────────────────────────── */
function initPortfolioFilter() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    const portfolioItems = document.querySelectorAll('.portfolio-item');

    if (!filterBtns.length || !portfolioItems.length) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;

            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');

            portfolioItems.forEach((item) => {
                const show = filter === 'all' || item.classList.contains(filter);
                item.style.display = show ? 'block' : 'none';
            });
        });
    });
}

/* ─────────────────────────────────────────
   Contact form logic
───────────────────────────────────────── */
function initContactForm() {
    const form = document.getElementById('contact-form');
    if (!form) return;

    const msgArea = document.getElementById('message');
    const charCount = document.getElementById('char-count');

    if (msgArea && charCount) {
        msgArea.addEventListener('input', () => {
            charCount.textContent = msgArea.value.length;
            charCount.style.color = msgArea.value.length > 900 ? '#e05252' : '';
        });
    }

    document.querySelectorAll('#service-chips .service-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#service-chips .service-chip').forEach((c) => c.classList.remove('selected'));
            chip.classList.add('selected');

            const serviceInput = document.getElementById('service');
            const serviceHint = document.getElementById('service-hint');
            const serviceError = document.getElementById('err-service');

            if (serviceInput) serviceInput.value = chip.dataset.value || '';
            if (serviceHint) serviceHint.textContent = '✓ Selected';
            if (serviceError) serviceError.classList.remove('show');
        });
    });

    document.querySelectorAll('#budget-chips .budget-chip').forEach((chip) => {
        chip.addEventListener('click', () => {
            document.querySelectorAll('#budget-chips .budget-chip').forEach((c) => c.classList.remove('selected'));
            chip.classList.add('selected');

            const budgetInput = document.getElementById('budget');
            const budgetError = document.getElementById('err-budget');

            if (budgetInput) budgetInput.value = chip.dataset.value || '';
            if (budgetError) budgetError.classList.remove('show');
        });
    });

    ['firstName', 'lastName', 'email', 'message'].forEach((id) => {
        const el = document.getElementById(id);
        if (el) {
            el.addEventListener('input', () => setError(id, false));
        }
    });

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        const fd = new FormData(this);
        const data = Object.fromEntries(fd.entries());

        if (!validateContactForm(data)) {
            const firstErr = this.querySelector('.error, .field-error.show');
            if (firstErr) {
                firstErr.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return;
        }

        const btn = document.getElementById('submit-btn');
        const btnText = document.getElementById('btn-text');
        const btnIcon = document.getElementById('btn-icon');

        if (btn) btn.disabled = true;
        if (btnText) btnText.textContent = 'Sending…';
        if (btnIcon) btnIcon.outerHTML = '<div class="spinner" id="btn-icon"></div>';

        try {
            const res = await fetch('https://formspree.io/f/xgorldbv', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    name: `${data.firstName} ${data.lastName}`,
                    email: data.email,
                    phone: data.phone || '',
                    company: data.company || '',
                    service: data.service,
                    budget: data.budget,
                    message: data.message
                })
            });

            if (res.ok) {
                this.reset();

                document.querySelectorAll('.service-chip, .budget-chip').forEach((c) => c.classList.remove('selected'));

                const serviceInput = document.getElementById('service');
                const budgetInput = document.getElementById('budget');
                const serviceHint = document.getElementById('service-hint');

                if (serviceInput) serviceInput.value = '';
                if (budgetInput) budgetInput.value = '';
                if (charCount) charCount.textContent = '0';
                if (serviceHint) serviceHint.textContent = 'Select one';

                showToast(true, 'Message sent!', "We'll get back to you within 24 hours.");
            } else {
                const json = await res.json().catch(() => ({}));
                const errMsg = json.errors
                    ? json.errors.map((err) => err.message).join(', ')
                    : 'Submission failed. Please try again.';

                showToast(false, 'Something went wrong', errMsg);
            }
        } catch (error) {
            showToast(false, 'Network error', 'Please check your connection and try again.');
        } finally {
            if (btn) btn.disabled = false;
            const spinner = document.getElementById('btn-icon');
            if (spinner) spinner.remove();

            if (btn) {
                btn.innerHTML = '<span id="btn-text">Send Message</span><i class="fas fa-arrow-right" id="btn-icon"></i>';
            }
        }
    });
}

function setError(fieldId, show) {
    const input = document.getElementById(fieldId);
    const err = document.getElementById(`err-${fieldId}`);

    if (!input || !err) return;

    if (show) {
        input.classList.add('error');
        err.classList.add('show');
    } else {
        input.classList.remove('error');
        err.classList.remove('show');
    }
}

function validateContactForm(data) {
    let valid = true;
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    ['firstName', 'lastName'].forEach((field) => {
        const value = (data[field] || '').trim();
        const invalid = !value;
        setError(field, invalid);
        if (invalid) valid = false;
    });

    const emailInvalid = !emailRe.test((data.email || '').trim());
    setError('email', emailInvalid);
    if (emailInvalid) valid = false;

    if (!data.service) {
        const el = document.getElementById('err-service');
        if (el) el.classList.add('show');
        valid = false;
    }

    if (!data.budget) {
        const el = document.getElementById('err-budget');
        if (el) el.classList.add('show');
        valid = false;
    }

    const messageInvalid = !(data.message || '').trim();
    setError('message', messageInvalid);
    if (messageInvalid) valid = false;

    return valid;
}

/* ─────────────────────────────────────────
   Toast
───────────────────────────────────────── */
function showToast(success, title, msg) {
    const toast = document.getElementById('toast');
    const icon = document.getElementById('toast-icon');
    const titleEl = document.getElementById('toast-title');
    const msgEl = document.getElementById('toast-msg');

    if (!toast || !icon || !titleEl || !msgEl) return;

    titleEl.textContent = title;
    msgEl.textContent = msg;
    toast.className = `toast ${success ? 'success' : 'error'}`;
    icon.innerHTML = success
        ? '<i class="fas fa-check"></i>'
        : '<i class="fas fa-exclamation"></i>';

    toast.classList.add('show');

    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
        toast.classList.remove('show');
    }, 5500);
}

function initToastClose() {
    const closeBtn = document.getElementById('toast-close');
    const toast = document.getElementById('toast');

    if (!closeBtn || !toast) return;

    closeBtn.addEventListener('click', () => {
        toast.classList.remove('show');
    });
}

/* ─────────────────────────────────────────
   Scroll to top button
───────────────────────────────────────── */
function initScrollTopButton() {
    const btn = document.createElement('button');
    btn.className = 'scroll-top-btn';
    btn.setAttribute('aria-label', 'Scroll to top');
    btn.innerHTML = '<i class="fas fa-arrow-up"></i>';

    document.body.appendChild(btn);

    btn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            btn.classList.add('show');
        } else {
            btn.classList.remove('show');
        }
    });
}
const PAYPAL_CONFIG = {
    business: "vivi45275@gmail.com",
    currency: "EUR"
};

// Scroll morbido per il menu
document.querySelectorAll('.main-nav a[href^="#"]').forEach(link => {
    link.addEventListener('click', e => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const target = document.querySelector(targetId);
        if (!target) return;

        window.scrollTo({
            top: target.offsetTop - 70,
            behavior: 'smooth'
        });
    });
});

// Gestione del form di iscrizione

const form = document.getElementById('subscribe-form');
const feedback = document.getElementById('form-feedback');
const submitButton = form?.querySelector('button[type="submit"]');
const nameInput = document.getElementById('nome');
const emailInput = document.getElementById('email');
const fromNameAlias = document.getElementById('from-name-alias');
const replyToAlias = document.getElementById('reply-to-alias');

function updateFormFeedback(message, color) {
    if (!feedback) return;
    feedback.textContent = message;
    feedback.style.color = color;
}

if (form) {
    form.addEventListener('submit', async function(e) {
        e.preventDefault();

        if (fromNameAlias && nameInput) {
            fromNameAlias.value = nameInput.value.trim();
        }

        if (replyToAlias && emailInput) {
            replyToAlias.value = emailInput.value.trim();
        }

        if (!window.emailjs || typeof window.emailjs.sendForm !== 'function') {
            updateFormFeedback("Servizio email non disponibile. Scrivi direttamente a vivi45275@gmail.com", "red");
            return;
        }

        if (submitButton) {
            submitButton.disabled = true;
        }

        updateFormFeedback("Invio in corso...", "#333");

        try {
            await window.emailjs.sendForm("service_n52kqpl", "template_10xgxrd", this);
            updateFormFeedback("Messaggio inviato! Ti risponderemo presto.", "green");
            form.reset();
        } catch (error) {
            const errorText = error?.text || error?.message || "Controlla la configurazione EmailJS.";
            updateFormFeedback(`Invio non riuscito: ${errorText}`, "red");
            console.error("EmailJS error:", error);
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
            }
        }
    });
}

// Carosello hero nella home
const carouselSlides = Array.from(document.querySelectorAll('.carousel-slide'));
const carouselDots = Array.from(document.querySelectorAll('.carousel-dot'));
const prevArrow = document.querySelector('.carousel-arrow.prev');
const nextArrow = document.querySelector('.carousel-arrow.next');
let activeSlideIndex = 0;
let carouselIntervalId = null;

function updateCarousel(index) {
    carouselSlides.forEach((slide, slideIndex) => {
        slide.classList.toggle('is-active', slideIndex === index);
    });

    carouselDots.forEach((dot, dotIndex) => {
        dot.classList.toggle('is-active', dotIndex === index);
    });

    activeSlideIndex = index;
}

function showNextSlide() {
    if (!carouselSlides.length) return;
    updateCarousel((activeSlideIndex + 1) % carouselSlides.length);
}

function showPrevSlide() {
    if (!carouselSlides.length) return;
    updateCarousel((activeSlideIndex - 1 + carouselSlides.length) % carouselSlides.length);
}

function startCarouselAutoplay() {
    if (!carouselSlides.length) return;
    stopCarouselAutoplay();
    carouselIntervalId = window.setInterval(showNextSlide, 4500);
}

function stopCarouselAutoplay() {
    if (carouselIntervalId) {
        window.clearInterval(carouselIntervalId);
        carouselIntervalId = null;
    }
}

if (carouselSlides.length) {
    updateCarousel(0);
    startCarouselAutoplay();

    if (nextArrow) {
        nextArrow.addEventListener('click', () => {
            showNextSlide();
            startCarouselAutoplay();
        });
    }

    if (prevArrow) {
        prevArrow.addEventListener('click', () => {
            showPrevSlide();
            startCarouselAutoplay();
        });
    }

    carouselDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            updateCarousel(index);
            startCarouselAutoplay();
        });
    });
}

// Slider immagini per i prodotti nello shop
const productSliders = Array.from(document.querySelectorAll('[data-product-slider]'));

productSliders.forEach(slider => {
    const slides = Array.from(slider.querySelectorAll('[data-product-slide]'));
    const prevButton = slider.querySelector('.product-slider-arrow.prev');
    const nextButton = slider.querySelector('.product-slider-arrow.next');
    let activeProductSlide = slides.findIndex(slide => slide.classList.contains('is-active'));

    if (!slides.length) return;
    if (activeProductSlide < 0) activeProductSlide = 0;

    function updateProductSlider(index) {
        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle('is-active', slideIndex === index);
        });

        activeProductSlide = index;
    }

    prevButton?.addEventListener('click', () => {
        updateProductSlider((activeProductSlide - 1 + slides.length) % slides.length);
    });

    nextButton?.addEventListener('click', () => {
        updateProductSlider((activeProductSlide + 1) % slides.length);
    });

    updateProductSlider(activeProductSlide);
});

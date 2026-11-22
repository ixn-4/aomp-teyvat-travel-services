document.addEventListener("DOMContentLoaded", () => {
    initFeaturedItinerariesCarousel();
});

function initFeaturedItinerariesCarousel() {
    const carousel = document.getElementById("itineraryCarousel");
    const track = document.getElementById("carouselTrack");
    const slides = document.querySelectorAll(".itinerary-slide");
    const dots = document.querySelectorAll(".carousel-dot");

    if (!track || !slides.length || !dots.length) return;

    let currentIndex = 0;
    let autoPlayTimer = null;
    const AUTO_PLAY_MS = 4000;

    function setActiveDot(idx) {
        currentIndex = idx;
        dots.forEach((dot, i) => {
            dot.classList.toggle("active", i === idx);
        });
    }

    function goToSlide(idx) {
        const wrappedIndex = ((idx % slides.length) + slides.length) % slides.length;
        setActiveDot(wrappedIndex);
        track.scrollTo({
            left: slides[wrappedIndex].offsetLeft,
            behavior: "smooth"
        });
    }

    function startAutoPlay() {
        stopAutoPlay();
        autoPlayTimer = setInterval(() => {
            if (!document.hidden) {
                goToSlide(currentIndex + 1);
            }
        }, AUTO_PLAY_MS);
    }

    function stopAutoPlay() {
        if (autoPlayTimer) {
            clearInterval(autoPlayTimer);
            autoPlayTimer = null;
        }
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const idx = Number(dot.dataset.target);
            if (!Number.isNaN(idx)) {
                goToSlide(idx);
                startAutoPlay();
            }
        });
    });

    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    setActiveDot(Number(entry.target.dataset.slide));
                }
            });
        },
        { root: track, threshold: 0.6 }
    );

    slides.forEach((slide) => observer.observe(slide));

    if (carousel) {
        carousel.addEventListener("mouseenter", stopAutoPlay);
        carousel.addEventListener("mouseleave", startAutoPlay);
    }

    startAutoPlay();
}
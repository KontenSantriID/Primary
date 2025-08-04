document.addEventListener('DOMContentLoaded', function () {
    
    // Inisialisasi Testimoni Carousel (Swiper JS)
    var testimoniSwiper = new Swiper('.testimoni-carousel', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        grabCursor: true,
        slidesPerView: 1,
        spaceBetween: 30,
        pagination: {
            el: '.swiper-pagination',
            clickable: true,
        },
    });

    // Animasi Timeline saat Scroll (Intersection Observer)
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });
        timelineItems.forEach(item => {
            observer.observe(item);
        });
    }

    // AJAX Form Submission untuk Kontak (Formspree)
    const contactForm = document.getElementById("contact-form");
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("form-status");
        const form = event.target;
        const data = new FormData(form);

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "Terima kasih! Pesan Anda telah terkirim.";
                status.className = 'sukses';
                form.reset();
            } else {
                response.json().then(data => {
                    status.innerHTML = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! Terjadi kesalahan.";
                    status.className = 'gagal';
                })
            }
        }).catch(error => {
            status.innerHTML = "Oops! Terjadi kesalahan koneksi.";
            status.className = 'gagal';
        });
    }
    if (contactForm) {
        contactForm.addEventListener("submit", handleSubmit);
    }
});
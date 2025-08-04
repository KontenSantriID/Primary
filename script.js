document.addEventListener('DOMContentLoaded', function () {

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });


    // Header Carousel
    var headerSwiper = new Swiper('.header-carousel', {
        loop: true,
        effect: 'fade',
        autoplay: {
            delay: 4000,
            disableOnInteraction: false,
        },
        speed: 1000,
        allowTouchMove: false,
    });

    // Testimoni Carousel
    var testimoniSwiper = new Swiper('.testimoni-carousel', {
        loop: true,
        autoplay: {
            delay: 5000,
            disableOnInteraction: false,
        },
        spaceBetween: 20,
        grabCursor: true,
        speed: 800,
    });

});

// Tambahkan kode ini di dalam file script.js Anda

// AJAX Form Submission untuk Formspree
async function handleSubmit(event) {
    event.preventDefault(); // Mencegah form refresh halaman
    
    var status = document.getElementById("form-status");
    var form = event.target;
    var data = new FormData(form);
    
    fetch(form.action, {
        method: form.method,
        body: data,
        headers: {
            'Accept': 'application/json'
        }
    }).then(response => {
        if (response.ok) {
            status.innerHTML = "Terima kasih! Pesan Anda telah terkirim.";
            status.className = 'sukses'; // Terapkan style .sukses
            form.reset(); // Kosongkan form setelah berhasil
        } else {
            response.json().then(data => {
                if (Object.hasOwn(data, 'errors')) {
                    status.innerHTML = data["errors"].map(error => error["message"]).join(", ");
                } else {
                    status.innerHTML = "Oops! Terjadi kesalahan saat mengirim pesan.";
                }
                status.className = 'gagal'; // Terapkan style .gagal
            })
        }
    }).catch(error => {
        status.innerHTML = "Oops! Terjadi kesalahan saat mengirim pesan.";
        status.className = 'gagal';
    });
}

var form = document.getElementById("contact-form");
form.addEventListener("submit", handleSubmit);
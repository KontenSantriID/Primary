document.addEventListener('DOMContentLoaded', function () {
    
    // =======================================================
    // PUSAT KODE PROMO (Edit daftar promo di sini)
    // =======================================================
    const daftarPromo = {
        "HEMAT10": { type: 'percentage', value: 10 },    // Diskon 10%
        "AGUSTUSMERDEKA2025": { type: 'percentage', value: 15 }, // Diskon 15%
        "DISKON50K": { type: 'fixed', value: 50000 },    // Potongan Rp 50.000
        "KONTENSPESIAL": { type: 'fixed', value: 100000 } // Potongan Rp 100.000
    };
    // =======================================================

    // Variabel global untuk menyimpan state
    let hargaAsli = 0;
    let hargaSetelahDiskon = 0;
    let promoTerpakai = null;

    // Ambil elemen dari DOM
    const urlParams = new URLSearchParams(window.location.search);
    const paket = urlParams.get('paket');
    const layanan = urlParams.get('layanan');
    const harga = urlParams.get('harga');

    const paketDipilihEl = document.getElementById('paket-dipilih');
    const hargaPaketEl = document.getElementById('harga-paket');
    const amountInput = document.getElementById('amount');
    const invoiceNumberInput = document.getElementById('invoiceNumber');

    const promoInput = document.getElementById('promo-code');
    const applyPromoBtn = document.getElementById('apply-promo-btn');
    const promoStatus = document.getElementById('promo-status');
    const diskonInfoEl = document.getElementById('diskon-info');
    const kodePromoInfoEl = document.getElementById('kode-promo-info');
    const jumlahDiskonEl = document.getElementById('jumlah-diskon');


    // Fungsi untuk memformat angka menjadi Rupiah
    function formatRupiah(angka) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }

    // Fungsi untuk memperbarui tampilan harga
    function updateTampilanHarga() {
        hargaPaketEl.textContent = formatRupiah(hargaSetelahDiskon);
        if (amountInput) {
            amountInput.value = hargaSetelahDiskon;
        }
    }

    // Fungsi untuk menerapkan promo
    function applyPromo() {
        const kode = promoInput.value.toUpperCase().trim();
        
        if (!kode) {
            promoStatus.textContent = 'Silakan masukkan kode promo.';
            promoStatus.className = 'promo-gagal';
            return;
        }

        if (daftarPromo[kode]) {
            const promo = daftarPromo[kode];
            promoTerpakai = promo;
            
            let nilaiDiskon = 0;
            if (promo.type === 'percentage') {
                nilaiDiskon = (hargaAsli * promo.value) / 100;
            } else if (promo.type === 'fixed') {
                nilaiDiskon = promo.value;
            }

            // Pastikan diskon tidak lebih besar dari harga asli
            if (nilaiDiskon > hargaAsli) {
                nilaiDiskon = hargaAsli;
            }

            hargaSetelahDiskon = hargaAsli - nilaiDiskon;

            // Update tampilan
            diskonInfoEl.style.display = 'flex';
            kodePromoInfoEl.textContent = kode;
            jumlahDiskonEl.textContent = `- ${formatRupiah(nilaiDiskon)}`;
            
            promoStatus.textContent = `Promo "${kode}" berhasil digunakan!`;
            promoStatus.className = 'promo-sukses';

            updateTampilanHarga();
        } else {
            promoStatus.textContent = 'Kode promo tidak valid.';
            promoStatus.className = 'promo-gagal';
        }
    }

    // Inisialisasi halaman saat pertama kali dimuat
    if (paket && layanan && harga) {
        hargaAsli = parseInt(harga);
        hargaSetelahDiskon = hargaAsli;

        paketDipilihEl.textContent = `Paket ${paket} - ${layanan}`;
        updateTampilanHarga();

        if(invoiceNumberInput) {
            invoiceNumberInput.value = `Paket ${paket} - ${layanan}`;
        }
    } else {
        paketDipilihEl.textContent = 'Paket tidak ditemukan';
        hargaPaketEl.textContent = 'Rp 0';
        document.querySelector('.promo-section').style.display = 'none'; // Sembunyikan kolom promo jika paket tidak ada
    }

    // Event listener untuk tombol "Gunakan"
    if (applyPromoBtn) {
        applyPromoBtn.addEventListener('click', applyPromo);
    }

    
    // =======================================================
    // Fungsionalitas Tombol Salin & Form Submission (Tetap Sama)
    // =======================================================
    const copyButtons = document.querySelectorAll('.btn-copy');
    copyButtons.forEach(button => {
        button.addEventListener('click', () => {
            const textToCopy = button.getAttribute('data-clipboard-text');
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = button.querySelector('span').textContent;
                button.querySelector('span').textContent = 'Disalin!';
                button.classList.add('copied');
                setTimeout(() => {
                    button.querySelector('span').textContent = originalText;
                    button.classList.remove('copied');
                }, 2000);
            });
        });
    });

    const paymentForm = document.getElementById("payment-form");
    async function handleSubmit(event) {
        event.preventDefault();
        const status = document.getElementById("form-status");
        const form = event.target;
        const data = new FormData(form);
        
        // Tambahkan info promo yang digunakan ke data form
        if (promoTerpakai) {
            data.append('promo_digunakan', promoInput.value.toUpperCase().trim());
        }

        fetch(form.action, {
            method: form.method,
            body: data,
            headers: { 'Accept': 'application/json' }
        }).then(response => {
            if (response.ok) {
                status.innerHTML = "<strong>Konfirmasi Terkirim!</strong><br>Terima kasih. Kami akan segera memverifikasi pembayaran Anda.";
                status.className = 'sukses text-center';
                form.reset();
            } else {
                response.json().then(data => {
                    status.innerHTML = data.errors ? data.errors.map(error => error.message).join(", ") : "Oops! Terjadi kesalahan.";
                    status.className = 'gagal text-center';
                })
            }
        });
    }

    if (paymentForm) {
        paymentForm.addEventListener("submit", handleSubmit);
    }
});
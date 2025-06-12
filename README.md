# WeatherKu

Website cuaca sederhana berbasis web yang dibuat oleh mahasiswa TI23B. WeatherKu menampilkan informasi cuaca terkini untuk berbagai kota dengan memanfaatkan API dari OpenWeatherMap. Proyek ini memiliki tampilan modern, fitur tema terang/gelap, notifikasi cuaca ekstrem, serta ekspor data cuaca.

---

## Daftar Isi
- [Deskripsi Proyek](#deskripsi-proyek)
- [Fitur](#fitur)
- [Struktur File](#struktur-file)
- [Instalasi & Menjalankan](#instalasi--menjalankan)
- [Pengaturan API Key](#pengaturan-api-key)
- [Dependensi Eksternal](#dependensi-eksternal)
- [Kustomisasi](#kustomisasi)
- [Catatan Tambahan](#catatan-tambahan)

---

## Deskripsi Proyek
WeatherKu adalah aplikasi web yang menampilkan data cuaca real-time untuk berbagai kota. Data diambil dari OpenWeatherMap API dan ditampilkan secara interaktif dengan suhu visual serta animasi latar yang berubah sesuai tema.

---

## Fitur
- Pencarian cuaca berdasarkan nama kota
- Penyimpanan kota favorit di localStorage
- Tema terang/gelap (light/dark mode)
- Notifikasi cuaca ekstrem (misal suhu ekstrem, hujan deras)
- Ekspor data cuaca
- Tampilan modern dengan animasi dan visual suhu

---

## Struktur File
- `index.html` — Struktur utama halaman web
- `style.css` — Pengaturan tampilan, tema, dan animasi
- `script.js` — Logika aplikasi: pengambilan data, pengelolaan tema, notifikasi, ekspor data, dsb

---

## Instalasi & Menjalankan
### Prasyarat
- Tidak membutuhkan backend/server khusus
- Hanya perlu browser modern (Chrome, Edge, Firefox, dsb)
- Koneksi internet untuk mengambil data cuaca dari API

### Langkah Instalasi
1. **Download atau Clone Proyek**
   - Download ZIP dari repository atau clone ke komputer Anda.
2. **Struktur Folder**
   - Pastikan file `index.html`, `style.css`, dan `script.js` berada dalam satu folder.
3. **Buka di Browser**
   - Klik dua kali `index.html` atau buka melalui browser dengan drag & drop.

---

## Pengaturan API Key
API key default sudah tersedia di `script.js`:
```js
const API_KEY = '05eded6cdde92c6796e23fef2cd448c7';
```
Jika ingin menggunakan API key sendiri, ganti nilai variabel `API_KEY` di bagian atas `script.js`.

---

## Dependensi Eksternal
- **OpenWeatherMap API** — Sumber data cuaca
- **Chart.js** — Untuk visual suhu cuaca
- **Font Awesome** — Untuk ikon
- **Google Fonts** — Untuk font modern

---

## Kustomisasi
- **Ganti API Key:** Edit di `script.js`
- **Ubah Tampilan:** Edit di `style.css`
- **Tambah Fitur:** Modifikasi atau tambahkan fungsi di `script.js`

---

## Catatan Tambahan
- Website ini sepenuhnya berjalan di sisi client (browser)
- Data kota dan notifikasi disimpan di localStorage, sehingga tidak hilang saat browser ditutup
- Tidak ada proses instalasi library tambahan, semua dependensi di-load via CDN

---

> Proyek ini dibuat oleh mahasiswa TI23B.

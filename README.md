# Pakan Cerdas (Smart Feed Calculator) - Feed Friend Farm

## Anggota Kelompok

- **Dhirendra Abisatya Arundaya** — M0405241009
- **Athaya Nasywa** — M0405241011
- **Akiko Ahmaddinejad** — M0405241012

## Apa itu Pakan Cerdas?

Pakan Cerdas adalah aplikasi berbasis web yang dirancang untuk membantu peternak dan petani dalam menghitung kebutuhan pakan harian hewan ternak secara otomatis dan akurat. Aplikasi ini dapat menganalisis berbagai faktor seperti jenis hewan, berat badan, jumlah ekor, dan kondisi kesehatan untuk memberikan rekomendasi pakan yang optimal. Melalui Pakan Cerdas, proses penghitungan kebutuhan nutrisi yang sebelumnya dilakukan secara manual kini dapat diselesaikan dalam hitungan detik dengan tingkat akurasi tinggi.

Aplikasi ini mendukung berbagai jenis ternak populer di Indonesia seperti sapi potong, sapi perah, kambing, domba, ayam petelur, ayam pedaging, kerbau, dan kelinci. Setiap jenis hewan memiliki parameter nutrisi spesifik yang telah divalidasi, sehingga rekomendasi pakan yang dihasilkan lebih relevan dan sesuai dengan kebutuhan nyata. Dengan fitur kalkulasi yang intuitif, pengguna dapat dengan mudah menentukan takaran hijauan dan konsentrat yang tepat berdasarkan kondisi kesehatan hewan (sehat, bunting, menyusui, sakit/pemulihan, dan anakan).

Pakan Cerdas juga menyediakan fitur riwayat perhitungan yang tersimpan secara lokal, memungkinkan pengguna untuk melacak dan mengelola data pemberian pakan mereka dari waktu ke waktu. Aplikasi ini dirancang dengan antarmuka modern, responsif, dan mudah digunakan di berbagai perangkat, sehingga dapat diakses kapan saja dan di mana saja.

## Fitur Utama

- **Kalkulator Pakan Otomatis** — Hitung kebutuhan pakan harian berdasarkan jenis hewan, berat badan, jumlah ekor, dan kondisi kesehatan.
- **Rekomendasi Nutrisi Real-Time** — Dapatkan saran porsi hijauan dan konsentrat secara instan.
- **Riwayat Perhitungan** — Simpan dan kelola riwayat perhitungan pakan untuk analisis berkelanjutan.
- **Dukungan Multi-Ternak** — Kalkulasi untuk 8 jenis ternak dengan parameter nutrisi tervalidasi.
- **Desain Responsif** — Tampilan optimal di desktop, tablet, dan ponsel.

## Tech Stack

- **React** + **TypeScript** + **Vite**
- **Tailwind CSS** — Utility-first CSS framework
- **shadcn/ui** — Komponen UI modern dan konsisten
- **TanStack Query** — Manajemen data server-side
- **Supabase** — Backend dan autentikasi
- **GitHub Pages** — Hosting dan deployment

## Live Demo

🔗 [https://athayansyathaya.github.io/feed-friend-farm/](https://athayansyathaya.github.io/feed-friend-farm/)

## Cara Menjalankan Secara Lokal

```bash
# 1. Clone repositori
git clone https://github.com/athayansyathaya/feed-friend-farm.git
cd feed-friend-farm

# 2. Install dependencies
npm install

# 3. Jalankan server development
npm run dev
```

Aplikasi akan berjalan di `http://localhost:8084`.

## Deploy ke GitHub Pages

```bash
# Push ke branch main akan otomatis trigger workflow deploy
git add .
git commit -m "update"
git push origin main
```

## Lisensi

Proyek ini dibuat untuk keperluan akademik dan dapat dikembangkan lebih lanjut.

© 2025 Pakan Cerdas — Feed Friend Farm

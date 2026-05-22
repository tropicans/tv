import { useState, useEffect } from 'react';

export const useCompanyAnnouncements = () => {
  const [announcementText, setAnnouncementText] = useState<string>("Memuat pengumuman perusahaan...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setLoading(true);
        // FIXME:
        // 1. Buat Google Sheets baru, isi kolom A dengan teks pengumuman tiap barisnya.
        // 2. Klik File -> Share -> Publish to web -> Opsi: Entire Document + Comma-separated values (.csv) -> Klik Publish.
        // 3. Pasang Link CSV yang didapat ke dalam variabel di bawah ini:
        const SHEET_CSV_URL = ""; 
        
        if (!SHEET_CSV_URL) {
          // Fallback ke Mockup Data jika link masih kosong
          const mocks = [
            "INFO INTERNAL: Pendaftaran program pelatihan kepemimpinan (Leadership Program) angkatan V telah dibuka. Silakan daftar via portal HR.",
            "INFO INTERNAL: Pemeliharaan server TI akan berlangsung minggu ini pada hari Sabtu, jam 22.00 - 02.00 WIB. Sistem mungkin tidak dapat diakses.",
            "INFO INTERNAL: Selamat kepada Tim Product yang telah sukses merilis aplikasi versi terbaru!"
          ];
          setAnnouncementText(mocks[Math.floor(Math.random() * mocks.length)]);
          return;
        }

        const response = await fetch(SHEET_CSV_URL);
        
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari Google Sheets");
        }

        const csvText = await response.text();
        
        // Memisahkan CSV berdasarkan baris baru
        // Kita juga membersihkan quotes (' atau ") yang mungkin dihasilkan otomatis oleh CSV
        const rows = csvText.split('\n')
          .map(row => row.replace(/['"]+/g, '').trim())
          .filter(row => row.length > 0 && row.toLowerCase() !== 'pengumuman' && row.toLowerCase() !== 'header'); // Filter header atau baris kosong

        if (rows.length > 0) {
          // Menggabungkan semua pengumuman yang ada dengan pembatas titik (bullet point)
          const combinedText = `INFO INTERNAL: ${rows.join('  •  ')}`;
          setAnnouncementText(combinedText);
        } else {
          setAnnouncementText("INFO INTERNAL: Belum ada pengumuman hari ini.");
        }
        
        setError(null);
      } catch (err) {
        console.error("Announcement Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat pengumuman");
        setAnnouncementText("INFO INTERNAL: Informasi pengumuman internal tidak tersedia saat ini.");
      } finally {
        setLoading(false);
      }
    };

    fetchAnnouncements();

    // Fetch every 15 menit agar update di GSheets cepat masuk
    const intervalId = setInterval(fetchAnnouncements, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { announcementText, loading, error };
};

import { useState, useEffect } from 'react';

export const useNews = () => {
  const [newsText, setNewsText] = useState<string>("Sedang memuat berita terkini...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        setLoading(true);
        // FIXME: Masukkan News API Key Anda di sini
        // Dapatkan di: https://newsapi.org/ atau layanan sejenis
        const NEWS_API_KEY = ""; 
        
        if (!NEWS_API_KEY) {
          // Fallback ke Mockup Data jika API Key belum diisi
          const mocks = [
            "BERITA UTAMA: Pertumbuhan ekonomi Indonesia stabil di kuartal terakhir 2026.",
            "INFO PERUSAHAAN: Townhall kuartal kedua akan segera dilaksanakan, harap seluruh karyawan bersiap.",
            "TEKNOLOGI: Adopsi AI di sektor publik meningkat pesat tahun ini."
          ];
          setNewsText(mocks[Math.floor(Math.random() * mocks.length)]);
          return;
        }

        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=id&apiKey=${NEWS_API_KEY}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data Berita API");
        }

        const data = await response.json();
        
        if (data.articles && data.articles.length > 0) {
          const topArticle = data.articles[0];
          setNewsText(`BERITA UTAMA: ${topArticle.title}`);
        } else {
          setNewsText("BERITA UTAMA: Belum ada berita hari ini.");
        }
        
        setError(null);
      } catch (err) {
        console.error("News Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat berita");
        setNewsText("INFO: Sistem informasi berita sedang dalam pemeliharaan.");
      } finally {
        setLoading(false);
      }
    };

    fetchNews();

    // Fetch every 30 minutes
    const intervalId = setInterval(fetchNews, 30 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { newsText, loading, error };
};

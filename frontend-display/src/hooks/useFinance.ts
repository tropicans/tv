import { useState, useEffect } from 'react';

export const useFinance = () => {
  const [financeText, setFinanceText] = useState<string>("Memuat info pasar terkini...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinanceInfo = async () => {
      try {
        setLoading(true);
        // FIXME: Anda dapat memasukkan endpoint API keuangan (seperti Alpha Vantage, Yahoo Finance dsb)
        const FINANCE_API_URL = ""; 
        
        if (!FINANCE_API_URL) {
          // Fallback ke Mockup Data
          const mocks = [
            "PASAR KEUANGAN: IHSG ditutup menguat 0.45% di level 7,234.12. Nilai tukar Rupiah terhadap USD berada di Rp15,650.",
            "PASAR KEUANGAN: Rupiah menguat 10 poin, perdagangan hari ini berada di posisi Rp15,640 per USD.",
            "PASAR KEUANGAN: Harga EMAS Antam stabil di Rp1.120.000 per gram. Minyak Mentah WTI naik tipis ke $78/barel."
          ];
          setFinanceText(mocks[Math.floor(Math.random() * mocks.length)]);
          return;
        }

        // Logic valid untuk fetch API
        // const response = await fetch(FINANCE_API_URL);
        // ...
      } catch (err) {
        console.error("Finance Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data keuangan");
        setFinanceText("INFO PASAR: Informasi keuangan tidak dapat dimuat saat ini.");
      } finally {
        setLoading(false);
      }
    };

    fetchFinanceInfo();

    // Fetch every 1 hour
    const intervalId = setInterval(fetchFinanceInfo, 60 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { financeText, loading, error };
};

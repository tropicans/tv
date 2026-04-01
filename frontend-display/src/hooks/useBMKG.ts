import { useState, useEffect } from 'react';

export const useBMKG = () => {
  const [bmkgText, setBmkgText] = useState<string>("Sedang mengambil update BMKG terbaru...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBMKG = async () => {
      try {
        setLoading(true);
        // BMKG provides public XML data that usually supports CORS
        const response = await fetch("https://data.bmkg.go.id/DataMKG/TEWS/autogempa.xml");
        
        if (!response.ok) {
          throw new Error(`Failed to fetch BMKG data: ${response.status}`);
        }

        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const q = (tag: string) => xmlDoc.getElementsByTagName(tag)[0]?.textContent || "";

        const tanggal = q("Tanggal");
        const jam = q("Jam");
        const mag = q("Magnitude");
        const kedalaman = q("Kedalaman");
        const wilayah = q("Wilayah");
        const potensi = q("Potensi");

        // Format: "INFO GEMPA BMKG: Mag 5.1, 31 Mar 2026 11:55:21 WIB. Lokasi: 120 km Tenggara ..., Kedalaman 10 km. Tidak berpotensi tsunami."
        const formattedText = `INFO GEMPA BMKG: Mag ${mag}, ${tanggal} ${jam}. Lokasi: ${wilayah}, Kedalaman ${kedalaman}. ${potensi}.`;

        setBmkgText(formattedText);
        setError(null);
      } catch (err) {
        console.error("BMKG Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data BMKG");
        // Fallback text if fetch fails (e.g. CORS issues occasionally)
        setBmkgText("INFO Cuaca BMKG: Prakiraan cuaca wilayah Jabodetabek hari ini cerah dengan potensi berawan.");
      } finally {
        setLoading(false);
      }
    };

    fetchBMKG();

    // Fetch every 10 minutes
    const intervalId = setInterval(fetchBMKG, 10 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { bmkgText, loading, error };
};

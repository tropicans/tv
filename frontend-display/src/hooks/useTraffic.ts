import { useState, useEffect } from 'react';

export const useTraffic = () => {
  const [trafficText, setTrafficText] = useState<string>("Sedang memeriksa status lalu lintas Jakarta...");
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTraffic = async () => {
      try {
        setLoading(true);
        // FIXME: Masukkan API Key TomTom Traffic API Anda di sini
        // Dapatkan di: https://developer.tomtom.com/
        const TOMTOM_API_KEY = ""; 
        
        // Titik pantau: Bundaran HI (-6.19491, 106.82305)
        const lat = -6.19491;
        const lon = 106.82305;

        if (!TOMTOM_API_KEY) {
          // Fallback ke Mockup Data jika API Key belum diisi
          const mocks = [
            "PANTUAN LALIN: Arus lalu lintas sekitar Bundaran HI terpantau padat merayap (Kecepatan rata-rata 18 km/jam).",
            "PANTUAN LALIN: Jl. MH Thamrin arah Monas terpantau ramai lancar di kedua arah.",
            "PANTUAN LALIN: Sudirman arah Blok M mengalami perlambatan akibat volume kendaraan."
          ];
          // Ganti teks acak untuk menimbulkan efek dinamis
          setTrafficText(mocks[Math.floor(Math.random() * mocks.length)]);
          return;
        }

        const response = await fetch(
          `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${TOMTOM_API_KEY}&point=${lat},${lon}`
        );

        if (!response.ok) {
          throw new Error("Gagal mengambil data Traffic API");
        }

        const data = await response.json();
        const flow = data.flowSegmentData;
        const currentSpeed = flow.currentSpeed;
        const freeFlowSpeed = flow.freeFlowSpeed;
        
        // Logika sederhana untuk menentukan status kepadatan
        let status = "Ramai Lancar";
        if (currentSpeed < freeFlowSpeed * 0.4) {
          status = "Macet Parah";
        } else if (currentSpeed < freeFlowSpeed * 0.7) {
          status = "Padat Merayap";
        }

        const formatted = `PANTUAN LALIN PUSAT (Bundaran HI): Arus kendaraan terpantau ${status} dengan kecepatan rata-rata ${currentSpeed} km/jam.`;
        
        setTrafficText(formatted);
        setError(null);
      } catch (err) {
        console.error("Traffic Fetch Error:", err);
        setError(err instanceof Error ? err.message : "Terjadi kesalahan saat memuat data Lalu Lintas");
        setTrafficText("PANTUAN LALIN: Informasi lalu lintas sementara tidak dapat diakses.");
      } finally {
        setLoading(false);
      }
    };

    fetchTraffic();

    // Fetch every 15 minutes
    const intervalId = setInterval(fetchTraffic, 15 * 60 * 1000);
    return () => clearInterval(intervalId);
  }, []);

  return { trafficText, loading, error };
};

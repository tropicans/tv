import React, { useState, useEffect } from "react";
import { 
  fetchAgendaEvents, 
  createAgendaEvent, 
  deleteAgendaEvent,
  fetchEmployeeLeaves,
  createEmployeeLeave,
  deleteEmployeeLeave,
  restoreEmployeeLeave,
  fetchCurrentUser,
  loginWithGoogle,
  fetchAuthConfig,
  logout
} from "../api";
import { useClock } from "../hooks/useClock";
import { 
  LayoutDashboard,
  Calendar, 
  Users, 
  Plus, 
  Trash2, 
  Check, 
  AlertCircle, 
  ArrowLeft,
  LogOut,
  UserCheck,
  Info,
  BookOpen,
  Menu,
  X,
  Archive,
  RotateCcw
} from "lucide-react";

interface AgendaItem {
  id: string;
  title: string;
  timeText: string;
  location: string;
  dateText: string;
  date: string;
}

interface LeaveItem {
  id: string;
  employeeName: string;
  dateRange: string;
  monthText: string;
}

const EMPLOYEE_LIST = [
  "Danang Mukhtar Hafid",
  "Sri Prastiwi Utami",
  "Djoko Suntoro",
  "Yudhi Ardinal",
  "Nur Rahmi Pangesti",
  "Mohammad Harris Pratama",
  "Lina Marselya",
  "Anggun Jayanti Niandani",
  "Azhari Kurniawan",
  "Amelia Noviyanti",
  "Hilma Yulis",
  "Lisa Mariska",
  "Tita Asfarandita Istirahati",
  "Ratna Nurwitasari",
  "Hermawan Setiaji",
  "Satria Adi Putra",
  "Butet Tobing",
  "Novi Muryanto",
  "Isna Irawati Hidayah",
  "Henny Indriani",
  "Fetty Hardiyanti",
  "Handi Sucipto",
  "Rr. Eva Mahardika Sri Handayani",
  "Widy Hastuti",
  "Dhian Deliani",
  "Suryani Melawati",
  "Lestari Purwaningsih",
  "Ihsanira Dhevina E.",
  "Maria Emilia Tyas Wulan Wahyu Dhati",
  "Kukuh Pamuji",
  "Meiryzka Widyarini",
  "Muhammad Farid Zeno",
  "Miladiyatu Tsania Zulfa",
  "Dwi Ayu Lestari",
  "Safira Arum Nisa",
  "Ariel Matius Surbakti",
  "Eka Aprilia Saraswati",
  "Wahidya Difta Sunanda",
  "Najlaa Syarif",
  "Ulfina Yusman",
  "Bayu Prabowo",
  "Soehendra",
  "Esha Rahmanshah Abrar",
  "Syahrul Maliki",
  "Adi Suparman",
  "Anita Susilowati"
];

const formatIndonesianDateText = (dateString: string): string => {
  if (!dateString) return "";
  const parts = dateString.split("-"); // "YYYY-MM-DD"
  if (parts.length !== 3) return "";
  
  const year = parseInt(parts[0], 10);
  const month = parseInt(parts[1], 10) - 1; // 0-indexed
  const day = parseInt(parts[2], 10);
  
  const dateObj = new Date(year, month, day);
  if (isNaN(dateObj.getTime())) return "";

  const dayName = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"][dateObj.getDay()];
  const dayNum = day.toString().padStart(2, "0");
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  const monthName = months[month];

  return `${dayName}, ${dayNum} ${monthName} ${year}`;
};

export const CmsDashboard: React.FC = () => {
  // Authentication States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [adminEmail, setAdminEmail] = useState("");
  const [googleClientId, setGoogleClientId] = useState<string | null>(null);
  
  // Login Form States
  const [loginError, setLoginError] = useState<string | null>(null);
  const [loginLoading, setLoginLoading] = useState(false);

  // Tab State
  const [activeTab, setActiveTab] = useState<"dashboard" | "agenda" | "cuti">("dashboard");
  const [cutiFilter, setCutiFilter] = useState<"active" | "archived">("active");
  const [cutiToArchive, setCutiToArchive] = useState<LeaveItem | null>(null);
  const [cutiToRestore, setCutiToRestore] = useState<LeaveItem | null>(null);
  
  // Data States
  const [agendaEvents, setAgendaEvents] = useState<AgendaItem[]>([]);
  const [cutiList, setCutiList] = useState<LeaveItem[]>([]);
  
  // Form States (Agenda)
  const [agendaTitle, setAgendaTitle] = useState("");
  const [agendaTime, setAgendaTime] = useState("");
  const [agendaLocation, setAgendaLocation] = useState("");
  const [agendaDateValue, setAgendaDateValue] = useState("");

  // Form States (Cuti)
  const [cutiName, setCutiName] = useState("");
  const [cutiRange, setCutiRange] = useState("");
  const [cutiMonth, setCutiMonth] = useState("Juli 2026");
  const [showEmployeeDropdown, setShowEmployeeDropdown] = useState(false);

  // Feedback States
  const [notif, setNotif] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [loadingData, setLoadingData] = useState(false);

  // Clock Hook
  const { time, dateStr } = useClock();

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const showNotif = (text: string, type: "success" | "error" = "success") => {
    setNotif({ text, type });
    setTimeout(() => setNotif(null), 5000);
  };

  // Check authentication status on mount
  const checkAuthStatus = async () => {
    const token = localStorage.getItem("auth_token");
    if (!token) {
      setIsAuthenticated(false);
      setCheckingAuth(false);
      return;
    }

    try {
      const user = await fetchCurrentUser();
      setAdminEmail(user.email);
      setIsAuthenticated(true);
    } catch (e) {
      console.warn("Session invalid, clearing token");
      logout();
      setIsAuthenticated(false);
    } finally {
      setCheckingAuth(false);
    }
  };

  // Load Google Auth configuration on boot
  const loadAuthConfig = async () => {
    try {
      const config = await fetchAuthConfig();
      setGoogleClientId(config.googleClientId);
    } catch (e) {
      console.error("Failed to load auth config:", e);
    }
  };

  useEffect(() => {
    checkAuthStatus();
    loadAuthConfig();
  }, []);

  // Initialize Google Sign-In when Client ID is loaded
  useEffect(() => {
    if (checkingAuth || isAuthenticated || !googleClientId) return;

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if ((window as any).google) {
        (window as any).google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleLoginCallback
        });
        (window as any).google.accounts.id.renderButton(
          document.getElementById("google-signin-button"),
          { theme: "outline", size: "large", width: 280 }
        );
      }
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [checkingAuth, isAuthenticated, googleClientId]);

  const handleGoogleLoginCallback = async (response: any) => {
    setLoginLoading(true);
    setLoginError(null);
    try {
      const res = await loginWithGoogle(response.credential);
      showNotif("Berhasil masuk dengan akun Google!");
      setAdminEmail(res.email || "");
      setIsAuthenticated(true);
    } catch (e: any) {
      setLoginError(e.message || "Gagal masuk menggunakan Google.");
    } finally {
      setLoginLoading(false);
    }
  };



  const handleLogout = () => {
    logout();
    setIsAuthenticated(false);
    showNotif("Berhasil keluar dari sesi Admin.");
  };

  const loadAgendaData = async () => {
    setLoadingData(true);
    try {
      const res = await fetchAgendaEvents();
      setAgendaEvents(res);
    } catch (e: any) {
      showNotif("Gagal memuat daftar agenda: " + e.message, "error");
    } finally {
      setLoadingData(false);
    }
  };

  const loadCutiData = async (filter?: "active" | "archived" | "all") => {
    setLoadingData(true);
    try {
      const res = await fetchEmployeeLeaves(filter || cutiFilter);
      setCutiList(res);
    } catch (e: any) {
      showNotif("Gagal memuat daftar cuti: " + e.message, "error");
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) return;
    
    if (activeTab === "dashboard") {
      loadAgendaData();
      loadCutiData("active");
    } else if (activeTab === "agenda") {
      loadAgendaData();
    } else if (activeTab === "cuti") {
      loadCutiData(cutiFilter);
    }
  }, [activeTab, isAuthenticated, cutiFilter]);

  const handleAddAgenda = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!agendaTitle || !agendaDateValue) {
      showNotif("Judul dan tanggal kalender wajib diisi!", "error");
      return;
    }

    try {
      const computedDateText = formatIndonesianDateText(agendaDateValue);
      await createAgendaEvent({
        title: agendaTitle,
        timeText: agendaTime,
        location: agendaLocation,
        dateText: computedDateText,
        date: agendaDateValue
      });
      showNotif("Agenda baru berhasil ditambahkan!");
      setAgendaTitle("");
      setAgendaTime("");
      setAgendaLocation("");
      setAgendaDateValue("");
      loadAgendaData();
    } catch (e: any) {
      showNotif("Gagal menambahkan agenda: " + e.message, "error");
    }
  };

  const handleDeleteAgendaItem = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus agenda ini?")) return;
    try {
      await deleteAgendaEvent(id);
      showNotif("Agenda berhasil dihapus!");
      loadAgendaData();
    } catch (e: any) {
      showNotif("Gagal menghapus agenda: " + e.message, "error");
    }
  };

  const handleAddCuti = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cutiName || !cutiRange) {
      showNotif("Nama pegawai dan rentang tanggal wajib diisi!", "error");
      return;
    }

    try {
      await createEmployeeLeave({
        employeeName: cutiName,
        dateRange: cutiRange,
        monthText: cutiMonth
      });
      showNotif("Cuti pegawai berhasil ditambahkan!");
      setCutiName("");
      setCutiRange("");
      setCutiFilter("active");
      loadCutiData("active");
    } catch (e: any) {
      showNotif("Gagal menambahkan cuti: " + e.message, "error");
    }
  };

  const handleDeleteCutiItem = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus catatan cuti ini?")) return;
    try {
      await deleteEmployeeLeave(id);
      showNotif("Catatan cuti berhasil dihapus!");
      loadCutiData();
    } catch (e: any) {
      showNotif("Gagal menghapus cuti: " + e.message, "error");
    }
  };

  if (checkingAuth) {
    return (
      <div className="h-screen w-screen bg-background flex items-center justify-center font-body">
        <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/20 z-[-1]"></div>
        <div className="text-center bg-white/75 backdrop-blur-md p-10 rounded-3xl border border-white/50 shadow-xl">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-on-surface-variant font-label text-xs font-black tracking-widest uppercase">Memeriksa Sesi Admin...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen bg-[#081e27] flex items-center justify-center font-body relative overflow-hidden">
        <div className="absolute w-[600px] h-[600px] rounded-full bg-cyan-900/30 blur-[120px] -top-52 -left-52 animate-slowpan"></div>
        <div className="absolute w-[500px] h-[500px] rounded-full bg-[#00677f]/20 blur-[100px] -bottom-52 -right-52 animate-float"></div>

        {notif && (
          <div className="fixed top-8 left-1/2 -translate-x-1/2 flex items-center gap-2 px-5 py-3 rounded-2xl shadow-xl border text-sm font-semibold bg-red-50 text-red-800 border-red-200 z-50">
            <AlertCircle size={16} />
            <span>{notif.text}</span>
          </div>
        )}

        <div className="w-[450px] bg-white/10 backdrop-blur-xl border border-white/10 p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Logo_Setneg_RI.svg/960px-Logo_Setneg_RI.svg.png"
            alt="Logo Setneg"
            className="h-16 w-auto mb-6 drop-shadow-md"
          />
          <h2 className="font-headline font-black text-xl text-white tracking-wider uppercase text-center">
            Agenda CMS Admin
          </h2>
          <p className="font-label text-[10px] font-black text-cyan-400 tracking-[0.2em] uppercase mt-1 mb-8 text-center">
            Security Gateway
          </p>

          {loginError && (
            <div className="w-full bg-red-950/40 border border-red-800/50 p-4 rounded-2xl flex items-start gap-2.5 text-xs text-red-300 font-semibold mb-6">
              <AlertCircle size={16} className="shrink-0 mt-0.5" />
              <span>{loginError}</span>
            </div>
          )}

          {googleClientId ? (
            loginLoading ? (
              <div className="w-full flex flex-col items-center mt-4 text-white/50 font-label text-[10px] tracking-widest uppercase">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2 mx-auto"></div>
                <span>Menghubungkan ke Google...</span>
              </div>
            ) : (
              <div className="w-full flex flex-col items-center mt-4">
                <div id="google-signin-button"></div>
              </div>
            )
          ) : (
            <div className="w-full flex flex-col items-center mt-4 text-white/50 font-label text-[10px] tracking-widest uppercase">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mb-2 mx-auto"></div>
              <span>Memuat Google Login...</span>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background font-body text-on-background h-screen w-screen flex overflow-hidden">
      {/* Global Background Gradient */}
      <div className="fixed inset-0 bg-gradient-to-br from-surface-bright via-secondary-fixed to-primary-fixed/10 z-[-1]"></div>

      {/* Backdrop for mobile */}
      {isSidebarOpen && (
        <div 
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
        />
      )}

      {/* Sidebar Navigation */}
      <aside 
        role="complementary"
        className={`w-80 bg-white/90 backdrop-blur-xl border-r border-slate-200/50 flex flex-col p-6 shrink-0 h-full fixed inset-y-0 left-0 z-50 transition-transform duration-300 ease-in-out lg:static lg:translate-x-0 lg:bg-white/50 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Branding header */}
        <div className="flex items-center justify-between pb-6 mb-6 border-b border-slate-200/60">
          <div className="flex items-center gap-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/Logo_Setneg_RI.svg/960px-Logo_Setneg_RI.svg.png"
              alt="Logo Setneg"
              className="h-10 w-auto"
            />
            <div>
              <h1 className="font-headline font-black text-sm text-cyan-900 tracking-wider uppercase">
                Agenda CMS
              </h1>
              <p className="font-label text-[8px] font-black text-cyan-700 tracking-[0.2em] uppercase mt-0.5">
                Ether Director Dashboard
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden p-2 text-slate-500 hover:text-slate-800 hover:bg-slate-200/40 rounded-xl transition-all min-h-[44px] min-w-[44px] flex items-center justify-center"
            aria-label="Tutup menu sidebar"
          >
            <X size={18} />
          </button>
        </div>

        {/* Current Active User Profile */}
        <div className="bg-white/60 border border-slate-200/40 p-4 rounded-[1.2rem] mb-6 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-cyan-100 flex items-center justify-center text-cyan-800 shrink-0">
            <UserCheck size={18} />
          </div>
          <div className="overflow-hidden">
            <span className="font-label text-[8px] font-black text-slate-400 uppercase tracking-widest block">
              Logged in as
            </span>
            <span className="font-headline font-bold text-xs text-slate-700 block truncate">
              {adminEmail}
            </span>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="flex-grow space-y-2">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-headline font-bold text-sm transition-all duration-300 min-h-[44px] ${
              activeTab === "dashboard"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-800"
            }`}
          >
            <LayoutDashboard size={18} />
            <span>Dashboard Ringkasan</span>
          </button>
          
          <button
            onClick={() => {
              setActiveTab("agenda");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-headline font-bold text-sm transition-all duration-300 min-h-[44px] ${
              activeTab === "agenda"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-800"
            }`}
          >
            <Calendar size={18} />
            <span>Kelola Agenda</span>
          </button>

          <button
            onClick={() => {
              setActiveTab("cuti");
              setIsSidebarOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl font-headline font-bold text-sm transition-all duration-300 min-h-[44px] ${
              activeTab === "cuti"
                ? "bg-primary text-white shadow-md shadow-primary/20"
                : "text-slate-600 hover:bg-slate-200/40 hover:text-slate-800"
            }`}
          >
            <Users size={18} />
            <span>Kelola Cuti</span>
          </button>
        </nav>

        {/* Action buttons */}
        <div className="pt-6 border-t border-slate-200/60 shrink-0 space-y-3">
          <a
            href="/agenda"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/80 border border-slate-200 rounded-2xl font-headline font-bold text-xs text-slate-700 hover:bg-white hover:text-primary hover:border-primary/40 hover:shadow-lg transition-all duration-300 min-h-[44px]"
          >
            <ArrowLeft size={14} />
            <span>Buka TV Agenda</span>
          </a>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-50/50 hover:bg-red-50 text-red-600 border border-red-100 rounded-2xl font-headline font-bold text-xs hover:shadow-md transition-all duration-300 min-h-[44px]"
          >
            <LogOut size={14} />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-grow h-full flex flex-col p-4 md:p-10 overflow-y-auto">
        
        {/* Top bar with clock and date */}
        <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-6 border-b border-slate-200/50 shrink-0 gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="lg:hidden p-2 text-slate-650 hover:text-slate-900 bg-white/60 border border-slate-200 rounded-xl shadow-sm hover:shadow transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center"
              aria-label="Buka menu sidebar"
            >
              <Menu size={20} />
            </button>
            <div>
              <h2 className="font-headline font-black text-2xl text-slate-800 tracking-tight capitalize">
                {activeTab === "dashboard" ? "Dashboard Ringkasan" : activeTab === "agenda" ? "Kelola Jadwal Kegiatan" : "Kelola Cuti Pegawai"}
              </h2>
              <p className="text-xs text-slate-500 font-medium mt-1">
                {activeTab === "dashboard" 
                  ? "Selamat datang di CMS Direktorat PPKASN. Kelola jadwal TV Agenda secara langsung."
                  : activeTab === "agenda"
                    ? "Menambah atau menghapus jadwal kegiatan agenda mingguan PPKASN."
                    : "Mengelola daftar cuti pegawai yang ditampilkan di panel samping TV."}
              </p>
            </div>
          </div>

          {/* Clock & Date Header Widget */}
          <div className="flex flex-wrap items-center justify-between md:justify-end gap-4 w-full md:w-auto">
            {notif && (
              <div className={`flex items-center gap-2 px-5 py-3 rounded-2xl shadow-lg border text-sm font-semibold animate-float ${
                notif.type === "success" 
                  ? "bg-emerald-50 text-emerald-800 border-emerald-200" 
                  : "bg-red-50 text-red-800 border-red-200"
              }`}>
                {notif.type === "success" ? <Check size={16} /> : <AlertCircle size={16} />}
                <span>{notif.text}</span>
              </div>
            )}

            <div className="bg-white/60 border border-slate-200/40 px-5 py-3 rounded-2xl flex items-center gap-4 shadow-sm min-h-[44px]">
              <span className="font-headline font-black text-xl text-slate-800 tracking-tight">{time}</span>
              <div className="h-6 w-px bg-slate-300"></div>
              <span className="font-label text-[10px] font-black text-cyan-800 uppercase tracking-widest">{dateStr}</span>
            </div>
          </div>
        </div>

        {/* Tab Contents */}
        <div className="flex-grow">
          {activeTab === "dashboard" && (
            <div className="space-y-8">
              {/* Statistics Overview Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Agenda Stat Card */}
                <div className="bg-white/65 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-100 flex items-center justify-center text-cyan-800 shadow-sm shrink-0">
                    <Calendar size={28} />
                  </div>
                  <div>
                    <span className="font-label text-xs font-black text-slate-400 uppercase tracking-widest block">
                      Total Agenda Terdaftar
                    </span>
                    <span className="font-headline font-black text-3xl text-slate-850 mt-1 block">
                      {agendaEvents.length} Kegiatan
                    </span>
                  </div>
                </div>

                {/* Leaves Stat Card */}
                <div className="bg-white/65 backdrop-blur-xl border border-white/60 p-6 rounded-[2rem] shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow duration-300">
                  <div className="w-14 h-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-800 shadow-sm shrink-0">
                    <Users size={28} />
                  </div>
                  <div>
                    <span className="font-label text-xs font-black text-slate-400 uppercase tracking-widest block">
                      Total Pegawai Cuti
                    </span>
                    <span className="font-headline font-black text-3xl text-slate-850 mt-1 block">
                      {cutiList.length} Orang
                    </span>
                  </div>
                </div>
              </div>

              {/* Instructions Panel */}
              <div className="bg-white/40 border border-slate-200/40 p-8 rounded-[2rem] shadow-sm space-y-6">
                <h3 className="font-headline font-black text-lg text-slate-800 flex items-center gap-2">
                  <Info size={20} className="text-primary" />
                  <span>Panduan Pengelolaan Layar TV Agenda</span>
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-sm leading-relaxed text-slate-650 font-medium">
                  {/* Agenda Columns instructions */}
                  <div className="bg-white/50 p-6 rounded-2xl border border-slate-200/20 space-y-3">
                    <h4 className="font-headline font-bold text-slate-800 flex items-center gap-2">
                      <BookOpen size={16} className="text-cyan-800" />
                      <span>Pengelompokan 2-Minggu Otomatis</span>
                    </h4>
                    <p className="text-xs">
                      Layar TV akan mengelompokkan kegiatan secara otomatis menjadi <strong>Minggu Ini</strong> dan <strong>Minggu Depan</strong> berdasarkan kolom <strong>Tanggal Kalender</strong> yang Anda input.
                    </p>
                    <ul className="list-disc pl-5 text-[11px] space-y-1.5">
                      <li><strong>Tanggal Kalender</strong> menentukan urutan hari dan posisi minggu.</li>
                      <li><strong>Teks Hari</strong> adalah teks judul kolom yang tampil di TV (Contoh: <em>Senin, 06 Juli 2026</em>).</li>
                      <li>Agenda yang dimasukkan akan tampil di TV dengan transisi slide otomatis setiap 15 detik.</li>
                    </ul>
                  </div>

                  {/* Cuti sidebar instructions */}
                  <div className="bg-white/50 p-6 rounded-2xl border border-slate-200/20 space-y-3">
                    <h4 className="font-headline font-bold text-slate-800 flex items-center gap-2">
                      <Users size={16} className="text-cyan-800" />
                      <span>Daftar Cuti Pegawai & Weather</span>
                    </h4>
                    <p className="text-xs">
                      Daftar pegawai yang sedang cuti akan tampil di panel samping kanan TV Agenda secara statis mendampingi kolom kegiatan.
                    </p>
                    <ul className="list-disc pl-5 text-[11px] space-y-1.5">
                      <li>Pastikan menulis <strong>Rentang Tanggal Cuti</strong> dengan format yang rapi (Contoh: <em>29 Juni s.d. 9 Juli 2026</em>).</li>
                      <li>Panel cuti ini akan scroll otomatis ke bawah di TV jika jumlah pegawai yang cuti melebihi kapasitas layar.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "agenda" && (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 h-full">
              {/* Form Tambah Agenda */}
              <div className="col-span-12 lg:col-span-4 bg-white/50 backdrop-blur-xl border border-white/60 p-6 rounded-[1.8rem] shadow-sm flex flex-col gap-5 shrink-0 h-max">
                <h3 className="font-headline font-black text-lg text-slate-800 flex items-center gap-2">
                  <Plus size={18} className="text-primary" />
                  <span>Tambah Agenda Manual</span>
                </h3>

                <form onSubmit={handleAddAgenda} className="space-y-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Judul Kegiatan
                    </label>
                    <input
                      type="text"
                      value={agendaTitle}
                      onChange={(e) => setAgendaTitle(e.target.value)}
                      placeholder="Contoh: Rakor Pengembangan Kompetensi"
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white min-h-[44px]"
                      required
                    />
                  </div>



                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Tanggal Kalender (Penentu Urutan)
                    </label>
                    <input
                      type="date"
                      value={agendaDateValue}
                      onChange={(e) => setAgendaDateValue(e.target.value)}
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white min-h-[44px]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Waktu Kegiatan (Time Text)
                    </label>
                    <input
                      type="text"
                      value={agendaTime}
                      onChange={(e) => setAgendaTime(e.target.value)}
                      placeholder="Contoh: Pkl. 09.00 s.d. 10.30"
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Lokasi Rapat
                    </label>
                    <input
                      type="text"
                      value={agendaLocation}
                      onChange={(e) => setAgendaLocation(e.target.value)}
                      placeholder="Contoh: R. Rapat Lt. 1, PPKASN"
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl font-headline font-bold text-sm hover:bg-primary/95 hover:shadow-md transition-all duration-300 min-h-[44px] flex items-center justify-center"
                  >
                    Tambah Agenda
                  </button>
                </form>
              </div>

              {/* Tabel Agenda List */}
              <div className="col-span-12 lg:col-span-8 bg-white/50 backdrop-blur-xl border border-white/60 p-6 rounded-[1.8rem] shadow-sm flex flex-col gap-4 overflow-hidden h-[600px]">
                <h3 className="font-headline font-black text-lg text-slate-800">Daftar Agenda Terdaftar</h3>
                
                <div className="flex-grow overflow-y-auto pr-1">
                  {loadingData ? (
                    <div className="h-full flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : agendaEvents.length === 0 ? (
                    <div className="text-center opacity-40 py-20">
                      <span>Belum ada agenda terdaftar. Silakan tambah kegiatan manual.</span>
                    </div>
                  ) : (
                    <>
                      {/* Tablet and Desktop View: Table */}
                      <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-left border-collapse text-sm hidden md:table">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-label font-bold text-xs uppercase tracking-wider">
                              <th className="pb-3">Hari & Tanggal</th>
                              <th className="pb-3">Kegiatan</th>
                              <th className="pb-3">Waktu</th>
                              <th className="pb-3">Lokasi</th>
                              <th className="pb-3 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {agendaEvents.map((event) => (
                              <tr key={event.id} className="border-b border-slate-200/50 hover:bg-white/20 transition-colors">
                                <td className="py-4 font-semibold text-slate-800">{event.dateText}</td>
                                <td className="py-4 font-bold text-slate-900 max-w-[200px] truncate">{event.title}</td>
                                <td className="py-4 text-cyan-800 font-label font-bold text-xs">{event.timeText || "-"}</td>
                                <td className="py-4 text-slate-500 text-xs">{event.location || "-"}</td>
                                <td className="py-4 text-right">
                                  <button
                                    onClick={() => handleDeleteAgendaItem(event.id)}
                                    className="text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center inline-flex"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>

                      {/* Mobile View: Card List */}
                      <div data-testid="agenda-mobile-list" className="block md:hidden space-y-4">
                        {agendaEvents.map((event) => (
                          <div key={event.id} className="bg-white/60 border border-slate-200/50 p-4 rounded-2xl flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block">{event.dateText}</span>
                              <h4 className="font-bold text-slate-900 text-sm leading-snug">{event.title}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1">
                                {event.timeText && (
                                  <span className="text-cyan-800 font-bold font-label">{event.timeText}</span>
                                )}
                                {event.location && (
                                  <span className="text-slate-500">{event.location}</span>
                                )}
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteAgendaItem(event.id)}
                              className="min-h-[44px] min-w-[44px] flex items-center justify-center text-red-500 hover:bg-red-50 hover:text-red-700 rounded-xl transition-all duration-300"
                              aria-label="Hapus agenda"
                            >
                              <Trash2 size={16} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "cuti" && (
            <div className="flex flex-col lg:grid lg:grid-cols-12 gap-8 h-full">
              {/* Form Tambah Cuti */}
              <div className="col-span-12 lg:col-span-4 bg-white/50 backdrop-blur-xl border border-white/60 p-6 rounded-[1.8rem] shadow-sm flex flex-col gap-5 shrink-0 h-max">
                <h3 className="font-headline font-black text-lg text-slate-800 flex items-center gap-2">
                  <Plus size={18} className="text-primary" />
                  <span>Tambah Cuti Manual</span>
                </h3>

                <form onSubmit={handleAddCuti} className="space-y-4">
                  <div className="flex flex-col gap-1.5 relative">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Nama Pegawai
                    </label>
                    <input
                      type="text"
                      value={cutiName}
                      onChange={(e) => {
                        setCutiName(e.target.value);
                        setShowEmployeeDropdown(true);
                      }}
                      onFocus={() => setShowEmployeeDropdown(true)}
                      onBlur={() => {
                        setTimeout(() => setShowEmployeeDropdown(false), 200);
                      }}
                      placeholder="Ketik atau pilih nama pegawai..."
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white w-full min-h-[44px]"
                      required
                    />
                    
                    {/* Search Dropdown Overlay */}
                    {showEmployeeDropdown && (
                      <div className="absolute top-[100%] left-0 w-full bg-white border border-slate-200 rounded-2xl shadow-xl mt-1.5 max-h-60 overflow-y-auto z-[999] scrollbar-thin">
                        {EMPLOYEE_LIST.filter(name =>
                          name.toLowerCase().includes(cutiName.toLowerCase())
                        ).map((name, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => {
                              setCutiName(name);
                              setShowEmployeeDropdown(false);
                            }}
                            className="w-full text-left px-4 py-3 text-xs text-slate-700 font-bold hover:bg-slate-50 hover:text-primary transition-colors focus:bg-slate-50 focus:text-primary focus:outline-none border-b border-slate-100 last:border-b-0 min-h-[44px] flex items-center"
                          >
                            {name}
                          </button>
                        ))}
                        {EMPLOYEE_LIST.filter(name =>
                          name.toLowerCase().includes(cutiName.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-3 text-xs text-slate-400 font-bold text-center">
                            Tidak menemukan kecocokan nama, Anda tetap dapat mengetik bebas.
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Rentang Tanggal Cuti
                    </label>
                    <input
                      type="text"
                      value={cutiRange}
                      onChange={(e) => setCutiRange(e.target.value)}
                      placeholder="Contoh: 29 Juni s.d. 9 Juli 2026"
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white min-h-[44px]"
                      required
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="font-label text-[10px] font-black text-slate-500 uppercase tracking-widest">
                      Bulan Cuti (Teks)
                    </label>
                    <input
                      type="text"
                      value={cutiMonth}
                      onChange={(e) => setCutiMonth(e.target.value)}
                      placeholder="Contoh: Juli 2026"
                      className="px-4 py-2.5 bg-white/80 border border-slate-200 rounded-xl font-body text-sm text-slate-800 focus:outline-none focus:border-primary/50 focus:bg-white min-h-[44px]"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 bg-primary text-white rounded-xl font-headline font-bold text-sm hover:bg-primary/95 hover:shadow-md transition-all duration-300 min-h-[44px] flex items-center justify-center"
                  >
                    Tambah Catatan Cuti
                  </button>
                </form>
              </div>

              {/* Tabel Cuti List */}
              <div className="col-span-12 lg:col-span-8 bg-white/50 backdrop-blur-xl border border-white/60 p-6 rounded-[1.8rem] shadow-sm flex flex-col gap-4 overflow-hidden h-[600px]">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/50 pb-3">
                  <h3 className="font-headline font-black text-lg text-slate-800">Daftar Cuti Terdaftar</h3>
                  <div className="flex bg-slate-100 p-1 rounded-xl w-max">
                    <button
                      onClick={() => setCutiFilter("active")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                        cutiFilter === "active"
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Cuti Aktif
                    </button>
                    <button
                      onClick={() => setCutiFilter("archived")}
                      className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all min-h-[36px] ${
                        cutiFilter === "archived"
                          ? "bg-white text-primary shadow-sm"
                          : "text-slate-500 hover:text-slate-800"
                      }`}
                    >
                      Cuti Terarsip
                    </button>
                  </div>
                </div>
                
                <div className="flex-grow overflow-y-auto pr-1">
                  {loadingData ? (
                    <div className="h-full flex items-center justify-center py-20">
                      <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  ) : cutiList.length === 0 ? (
                    <div className="text-center opacity-40 py-20">
                      <span>
                        {cutiFilter === "active" 
                          ? "Belum ada catatan cuti terdaftar. Silakan tambah data manual." 
                          : "Tidak ada catatan cuti terarsip."}
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Tablet and Desktop View: Table */}
                      <div className="overflow-x-auto hidden md:block">
                        <table className="w-full text-left border-collapse text-sm hidden md:table">
                          <thead>
                            <tr className="border-b border-slate-200 text-slate-500 font-label font-bold text-xs uppercase tracking-wider">
                              <th className="pb-3">Nama Pegawai</th>
                              <th className="pb-3">Rentang Tanggal Cuti</th>
                              <th className="pb-3">Bulan</th>
                              <th className="pb-3 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody>
                            {cutiList.map((cuti) => (
                              <tr key={cuti.id} className="border-b border-slate-200/50 hover:bg-white/20 transition-colors">
                                <td className="py-4 font-bold text-slate-800">{cuti.employeeName}</td>
                                <td className="py-4 text-cyan-800 font-label font-bold text-xs uppercase tracking-wider">{cuti.dateRange}</td>
                                <td className="py-4 text-slate-500 text-xs">{cuti.monthText}</td>
                                <td className="py-4 text-right">
                                  {cutiFilter === "active" ? (
                                    <button
                                      onClick={() => setCutiToArchive(cuti)}
                                      className="text-amber-500 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center inline-flex"
                                      title="Arsipkan"
                                    >
                                      <Archive size={16} />
                                    </button>
                                  ) : (
                                    <button
                                      onClick={() => setCutiToRestore(cuti)}
                                      className="text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all duration-300 min-h-[44px] min-w-[44px] flex items-center justify-center inline-flex"
                                      title="Pulihkan"
                                    >
                                      <RotateCcw size={16} />
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
 
                      {/* Mobile View: Card List */}
                      <div data-testid="cuti-mobile-list" className="block md:hidden space-y-4">
                        {cutiList.map((cuti) => (
                          <div key={cuti.id} className="bg-white/60 border border-slate-200/50 p-4 rounded-2xl flex items-center justify-between gap-4">
                            <div className="space-y-1">
                              <h4 className="font-bold text-slate-900 text-sm leading-snug">{cuti.employeeName}</h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs mt-1">
                                <span className="text-cyan-800 font-bold font-label uppercase">{cuti.dateRange}</span>
                                {cuti.monthText && (
                                  <span className="text-slate-500">{cuti.monthText}</span>
                                )}
                              </div>
                            </div>
                            {cutiFilter === "active" ? (
                              <button
                                onClick={() => setCutiToArchive(cuti)}
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-amber-500 hover:bg-amber-50 hover:text-amber-700 rounded-xl transition-all duration-300"
                                aria-label="Arsipkan cuti"
                              >
                                <Archive size={16} />
                              </button>
                            ) : (
                              <button
                                onClick={() => setCutiToRestore(cuti)}
                                className="min-h-[44px] min-w-[44px] flex items-center justify-center text-emerald-500 hover:bg-emerald-50 hover:text-emerald-700 rounded-xl transition-all duration-300"
                                aria-label="Pulihkan cuti"
                              >
                                <RotateCcw size={16} />
                              </button>
                            )}
                          </div>
                        ))}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Modal Konfirmasi Arsipkan */}
      {cutiToArchive && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-200/50 max-w-md w-full mx-4">
            <h3 className="font-headline font-black text-lg text-slate-800 mb-2 flex items-center gap-2">
              <Archive className="text-amber-500" size={20} />
              <span>Arsipkan Catatan Cuti</span>
            </h3>
            <p className="text-sm text-slate-600 font-medium mb-6">
              Apakah Anda yakin ingin mengarsipkan catatan cuti untuk <strong>{cutiToArchive.employeeName}</strong>? Catatan ini akan dipindahkan ke tab "Cuti Terarsip".
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCutiToArchive(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs min-h-[44px]"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const id = cutiToArchive.id;
                  setCutiToArchive(null);
                  try {
                    await deleteEmployeeLeave(id);
                    showNotif("Catatan cuti berhasil diarsipkan!");
                    loadCutiData();
                  } catch (e: any) {
                    showNotif("Gagal mengarsipkan cuti: " + e.message, "error");
                  }
                }}
                className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-xl text-xs min-h-[44px]"
              >
                Arsipkan
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Konfirmasi Pulihkan */}
      {cutiToRestore && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white p-6 rounded-[2rem] shadow-xl border border-slate-200/50 max-w-md w-full mx-4">
            <h3 className="font-headline font-black text-lg text-slate-800 mb-2 flex items-center gap-2">
              <RotateCcw className="text-emerald-500" size={20} />
              <span>Pulihkan Catatan Cuti</span>
            </h3>
            <p className="text-sm text-slate-655 font-medium mb-6">
              Apakah Anda yakin ingin memulihkan catatan cuti untuk <strong>{cutiToRestore.employeeName}</strong>? Catatan ini akan kembali ke tab "Cuti Aktif".
            </p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setCutiToRestore(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs min-h-[44px]"
              >
                Batal
              </button>
              <button
                onClick={async () => {
                  const id = cutiToRestore.id;
                  setCutiToRestore(null);
                  try {
                    await restoreEmployeeLeave(id);
                    showNotif("Catatan cuti berhasil dipulihkan!");
                    loadCutiData();
                  } catch (e: any) {
                    showNotif("Gagal memulihkan cuti: " + e.message, "error");
                  }
                }}
                className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs min-h-[44px]"
              >
                Pulihkan
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

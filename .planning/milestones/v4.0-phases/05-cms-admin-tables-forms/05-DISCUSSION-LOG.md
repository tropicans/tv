# Phase 5: CMS Admin Tables & Forms - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-07-02
**Phase:** 5-CMS Admin Tables & Forms
**Areas discussed:** Layout Kartu Ringkasan, Layout Grid Form & Tabel, Format Responsif Tabel Data, Touch Target Sizing

---

## Layout Kartu Ringkasan (Stats Card Layout)

### Breakpoint Stacking

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked under 768px (md) | Tetap 2 kolom di tablet/landscape, bertumpuk di HP agar teks tidak terpotong. | ✓ |
| Stacked under 1024px (lg) | Bertumpuk vertikal di bawah 1024px, seragam dengan breakpoint sidebar. | |
| You decide | Tentukan yang terbaik secara estetika. | |

**User's choice:** Stacked under 768px (md)
**Notes:** Kept 2 columns on tablet/landscape screen widths and vertical stack on phone screens to prevent text wrapping.

### Padding and Spacing

| Option | Description | Selected |
|--------|-------------|----------|
| Pertahankan ukuran teks & padding standar | Desain modern dengan ruang bernapas yang cukup dan sentuhan nyaman. | ✓ |
| Kurangi padding & ukuran teks sedikit | Agar hemat ruang dan muat di layar HP kecil tanpa scroll berlebih. | |
| You decide | Sesuaikan secara dinamis agar terlihat premium. | |

**User's choice:** Pertahankan ukuran teks & padding standar
**Notes:** Decided to keep stats cards with generous/standard padding and text sizes to ensure standard MD3/premium spacing.

---

## Layout Grid Form & Tabel (Form & Table Grid Layout)

### Stacking Order

| Option | Description | Selected |
|--------|-------------|----------|
| Form di atas, Tabel di bawah | Alur CRUD standar: pengguna mengisi input di bagian atas dan melihat daftar yang diperbarui di bawah. | ✓ |
| Tabel di atas, Form di bawah | Memprioritaskan peninjauan data (viewing) terlebih dahulu saat halaman dimuat. | |
| You decide | Sesuaikan demi UX terbaik. | |

**User's choice:** Form di atas, Tabel di bawah
**Notes:** The standard CRUD layout of placing the input form above the list tables was selected to simplify mobile data creation.

### Breakpoint Stacking

| Option | Description | Selected |
|--------|-------------|----------|
| Stacked under 1024px (lg) | Mengikuti breakpoint sidebar. Sangat disarankan karena sidebar menyembul di <1024px, menyisakan ruang sempit untuk grid horizontal. | ✓ |
| Stacked under 768px (md) | Tetap berdampingan hingga layar tablet kecil. | |
| You decide | Pilih breakpoint yang paling pas agar layout tetap rapi. | |

**User's choice:** Stacked under 1024px (lg)
**Notes:** We stack form and table vertically below 1024px (lg) as the sidebar drawer toggling at this width otherwise squeezes the main horizontal layout.

---

## Format Responsif Tabel Data (Data Table Responsive View)

### Mobile Table Representation

| Option | Description | Selected |
|--------|-------------|----------|
| Gabungan Dinamis | Tetap berupa tabel dengan scroll horizontal di tablet (768px s.d. 1023px), namun di HP (<768px) baris diubah menjadi daftar kartu (card list) bertumpuk. | ✓ |
| Scroll Horizontal Penuh | Membungkus tabel dalam container 'overflow-x-auto'. Bentuk tabel tetap sama di semua ukuran layar, pengguna menggeser ke samping untuk melihat detail. | |
| You decide | Implementasikan desain responsif yang paling modern dan rapi. | |

**User's choice:** Gabungan Dinamis
**Notes:** Dynamic combination of using scrollable tables on tablets and refactoring table rows into vertical stacked card list items on mobile viewports (< 768px) was selected.

---

## Touch Target Sizing (Ukuran Target Sentuh)

### Minimum Sizing Application

| Option | Description | Selected |
|--------|-------------|----------|
| Penerapan Universal | Terapkan minimal 44x44px pada SEMUA tombol hapus, input form, item dropdown, dan tombol tab di layar HP. | ✓ |
| Penerapan Terseleksi | Hanya perbesar tombol aksi (Hapus & Tab) dan pertahankan ukuran input form standar agar form tidak terlihat terlalu besar. | |
| You decide | Terapkan penyesuaian ukuran sentuh yang paling seimbang antara estetika dan aksesibilitas. | |

**User's choice:** Penerapan Universal
**Notes:** We apply 44x44px minimum sizing universally to all mobile elements including delete buttons, form inputs, autocomplete lists, and tabs to ensure a touch-friendly UI.

---

## the agent's Discretion

- Mobile card visual design implementation (shadows, background colors, and detailed borders) is left to the developer.

## Deferred Ideas

- None.

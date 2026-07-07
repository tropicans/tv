# Requirements: PPKASN Corporate TV Display

**Defined:** 2026-07-07
**Core Value:** Continuous, reliable, and highly legible information broadcast on TV displays across different physical locations, manageable directly via a secure CMS admin panel (Single Source of Truth).

## v1 Requirements

Requirements for Milestone v5.0 Cuti Archiving.

### Database & Backend API

- [ ] **LVARCH-01**: Modifikasi skema Prisma database untuk menambahkan field `isArchived` Boolean (default false) ke model `EmployeeLeave`.
- [ ] **LVARCH-02**: Perbarui Backend API GET `/api/agenda/cuti` untuk mendukung query parameter `filter` (`active`, `archived`, atau `all`) agar admin bisa mengambil data sesuai status pengarsipan.
- [ ] **LVARCH-03**: Modifikasi Backend API DELETE `/api/agenda/cuti/:id` untuk melakukan soft delete (mengubah `isArchived` menjadi `true`) alih-alih menghapus baris data secara permanen.
- [ ] **LVARCH-04**: Tambahkan Backend API POST/PUT `/api/agenda/cuti/:id/restore` (atau unarchive) untuk memulihkan status cuti terarsip menjadi aktif kembali (`isArchived: false`).
- [ ] **LVARCH-05**: Pastikan API display `/api/display/agenda` secara otomatis memfilter data cuti pegawai agar hanya menyertakan data cuti aktif (`isArchived: false`) dan menyembunyikan cuti yang terarsip.

### Frontend API & CMS UI

- [ ] **LVARCH-06**: Ubah Frontend API client helper `deleteLeaveItem` untuk melakukan aksi pengarsipan (soft-delete), serta tambahkan helper `restoreLeaveItem` untuk pemulihan.
- [ ] **LVARCH-07**: Perbarui CMS Admin UI tab "Kelola Cuti" agar membagi tampilan daftar cuti menjadi dua tab/tampilan terpisah: "Cuti Aktif" dan "Cuti Terarsip".
- [ ] **LVARCH-08**: Pada CMS Admin UI, ganti tombol/ikon aksi "Hapus" menjadi aksi "Arsipkan" dengan konfirmasi dialog yang sesuai.
- [ ] **LVARCH-09**: Pada CMS Admin UI daftar "Cuti Terarsip", tambahkan tombol aksi "Pulihkan" (Restore) untuk mengaktifkan kembali data cuti tersebut ke status aktif.

## v2 Requirements

### Automation & Cleanup

- **LVARCH-10**: Sistem otomatisasi (scheduler/cron) untuk mendeteksi dan mengarsipkan otomatis data cuti pegawai yang rentang tanggalnya sudah terlewati (passed leaves) lebih dari 30 hari.

## Out of Scope

| Feature | Reason |
|---------|--------|
| Hard delete dari UI | Tombol untuk menghapus permanen catatan cuti ditiadakan dari antarmuka CMS guna menjaga integritas history log pegawai di PPKASN. |

## Traceability

Which phases cover which requirements. Updated during roadmap creation.

| Requirement | Phase | Status |
|-------------|-------|--------|
| LVARCH-01 | Pending | Pending |
| LVARCH-02 | Pending | Pending |
| LVARCH-03 | Pending | Pending |
| LVARCH-04 | Pending | Pending |
| LVARCH-05 | Pending | Pending |
| LVARCH-06 | Pending | Pending |
| LVARCH-07 | Pending | Pending |
| LVARCH-08 | Pending | Pending |
| LVARCH-09 | Pending | Pending |

**Coverage:**
- v1 requirements: 9 total
- Mapped to phases: 0
- Unmapped: 9 ⚠️

---
*Requirements defined: 2026-07-07*
*Last updated: 2026-07-07 after starting Milestone v5.0*

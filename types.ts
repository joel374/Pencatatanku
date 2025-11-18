// PENCATATANKU/types.ts

export type TipeTransaksi = 'Pemasukan' | 'Pengeluaran';

export interface Transaksi {
  id: string;
  jumlah: number;
  deskripsi: string;
  tipe: TipeTransaksi;
  tanggal: string; // Tanggal dalam format string, misalnya '18/11/2025'
}
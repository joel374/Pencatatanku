// PENCATATANKU/StorageHelper.ts

import AsyncStorage from '@react-native-async-storage/async-storage';
import { Transaksi, TipeTransaksi } from './types'; 

const STORAGE_KEY = '@SemuaTransaksi';

// --- FUNGSI READ (Ambil Semua) ---
export const getTransaksi = async (): Promise<Transaksi[]> => {
  try {
    const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
    return jsonValue != null ? JSON.parse(jsonValue) as Transaksi[] : [];
  } catch (e) {
    console.error("Gagal mengambil data:", e);
    return [];
  }
};

// --- FUNGSI CREATE (Simpan Baru) ---
export const saveTransaksi = async (newTransaction: Omit<Transaksi, 'id'>): Promise<Transaksi[]> => {
  try {
    const existingTransaksi = await getTransaksi();

    const newFullTransaction: Transaksi = {
      ...newTransaction,
      id: Date.now().toString() // Buat ID unik
    };

    const newTransaksiList: Transaksi[] = [
      ...existingTransaksi,
      newFullTransaction
    ];

    const jsonValue = JSON.stringify(newTransaksiList);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);
    
    return newTransaksiList;
  } catch (e) {
    console.error("Gagal menyimpan data:", e);
    return [];
  }
};

// --- FUNGSI UPDATE (Ubah Transaksi) ---
export const updateTransaksi = async (updatedTransaction: Transaksi): Promise<Transaksi[]> => {
  try {
    const existingTransaksi = await getTransaksi();

    const newTransaksiList: Transaksi[] = existingTransaksi.map(t => {
      // Jika ID cocok, ganti dengan data yang sudah diupdate
      if (t.id === updatedTransaction.id) {
        return updatedTransaction;
      }
      // Jika ID tidak cocok, kembalikan transaksi lama
      return t;
    });

    const jsonValue = JSON.stringify(newTransaksiList);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

    return newTransaksiList;
  } catch (e) {
    console.error("Gagal mengupdate data:", e);
    return await getTransaksi();
  }
};

// --- FUNGSI DELETE (Hapus) ---
export const deleteTransaksi = async (idToDelete: string): Promise<Transaksi[]> => {
  try {
    const existingTransaksi = await getTransaksi();

    // Filter: hanya simpan yang ID-nya TIDAK sama dengan idToDelete
    const newTransaksiList: Transaksi[] = existingTransaksi.filter(t => t.id !== idToDelete);

    const jsonValue = JSON.stringify(newTransaksiList);
    await AsyncStorage.setItem(STORAGE_KEY, jsonValue);

    return newTransaksiList;
  } catch (e) {
    console.error("Gagal menghapus data:", e);
    return await getTransaksi();
  }
};

// --- FUNGSI HELPER (Hitung Saldo) ---
export const calculateSaldo = (transaksiList: Transaksi[]): number => {
    let saldo: number = 0;
    transaksiList.forEach(t => {
        if (t.tipe === 'Pemasukan') {
            saldo += t.jumlah;
        } else if (t.tipe === 'Pengeluaran') {
            saldo -= t.jumlah;
        }
    });
    return saldo;
};
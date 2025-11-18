import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  TextInput,
  StyleSheet,
  Alert,
  TouchableOpacity,
  Modal,
} from "react-native";
// Pastikan path import ini benar. Jika index.tsx berada di root app/, ganti dengan '../../'
// Jika masih di app/(tabs)/, path ini mungkin sudah benar relatif terhadap folder PENCATATANKU
import {
  getTransaksi,
  saveTransaksi,
  calculateSaldo,
  deleteTransaksi,
  updateTransaksi,
} from "../StorageHelper";
import { Transaksi, TipeTransaksi } from "../types";
import { useTheme } from "../useTheme";

export default function HomeScreen() {
  // --- TEMA ---
  const { colors, themeName, toggleTheme } = useTheme();

  // --- STATE UTAMA ---
  const [transaksi, setTransaksi] = useState<Transaksi[]>([]);
  const saldo: number = calculateSaldo(transaksi);

  // --- STATE UNTUK FORM TAMBAH ---
  const [jumlah, setJumlah] = useState<string>("");
  const [deskripsi, setDeskripsi] = useState<string>("");
  const [tipe, setTipe] = useState<TipeTransaksi>("Pengeluaran");

  // --- STATE UNTUK MODAL EDIT ---
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [editingTransaction, setEditingTransaction] =
    useState<Transaksi | null>(null);
  const [editJumlah, setEditJumlah] = useState<string>("");
  const [editDeskripsi, setEditDeskripsi] = useState<string>("");
  const [editTipe, setEditTipe] = useState<TipeTransaksi>("Pengeluaran");

  // --- STATE UNTUK KONFIRMASI HAPUS ---
  const [isDeleteConfirmVisible, setIsDeleteConfirmVisible] =
    useState<boolean>(false);
  const [idToDelete, setIdToDelete] = useState<string | null>(null);

  // --- LOGIC ---
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const loadedTransaksi = await getTransaksi();
    setTransaksi(loadedTransaksi);
  };

  const handleSimpan = async () => {
    const parsedJumlah = parseFloat(jumlah);

    if (isNaN(parsedJumlah) || parsedJumlah <= 0 || !deskripsi) {
      Alert.alert(
        "Error",
        "Jumlah harus angka positif dan Deskripsi wajib diisi."
      );
      return;
    }

    const newTransaction = {
      jumlah: parsedJumlah,
      deskripsi: deskripsi,
      tipe: tipe,
      tanggal: new Date().toLocaleDateString("id-ID"),
    };

    const updatedList = await saveTransaksi(newTransaction);
    setTransaksi(updatedList);

    setJumlah("");
    setDeskripsi("");
    setTipe("Pengeluaran");
  };

  const handleDelete = async (id: string) => {
    setIdToDelete(id);
    setIsDeleteConfirmVisible(true);
  };

  const confirmDelete = async () => {
    if (!idToDelete) return;

    const updatedList = await deleteTransaksi(idToDelete);
    setTransaksi(updatedList);

    setIdToDelete(null);
    setIsDeleteConfirmVisible(false);
  };

  const handleEditPress = (transaction: Transaksi) => {
    setEditingTransaction(transaction);
    setEditJumlah(transaction.jumlah.toString());
    setEditDeskripsi(transaction.deskripsi);
    setEditTipe(transaction.tipe);
    setIsModalVisible(true);
  };

  const handleUpdate = async () => {
    if (!editingTransaction) return;

    const parsedJumlah = parseFloat(editJumlah);

    if (isNaN(parsedJumlah) || parsedJumlah <= 0 || !editDeskripsi) {
      Alert.alert(
        "Error",
        "Jumlah harus angka positif dan Deskripsi wajib diisi."
      );
      return;
    }

    const updatedData: Transaksi = {
      ...editingTransaction,
      jumlah: parsedJumlah,
      deskripsi: editDeskripsi,
      tipe: editTipe,
    };

    const updatedList = await updateTransaksi(updatedData);
    setTransaksi(updatedList);

    setIsModalVisible(false);
    setEditingTransaction(null);
  };

  // --- RENDER ITEM ---
  const renderItem = ({ item }: { item: Transaksi }) => (
    <View
      style={[
        styles.item,
        {
          backgroundColor: colors.cardBackground,
          borderLeftColor: colors.secondary,
        },
      ]}
    >
      <View style={styles.itemDetails}>
        <Text style={[styles.desc, { color: colors.text }]}>
          {item.deskripsi}
        </Text>
        <Text style={[styles.date, { color: colors.subText }]}>
          {item.tanggal} ({item.tipe})
        </Text>
      </View>

      <View style={styles.itemActions}>
        <Text
          style={[
            item.tipe === "Pemasukan" ? styles.pemasukan : styles.pengeluaran,
            {
              color: item.tipe === "Pemasukan" ? colors.income : colors.expense,
            },
          ]}
        >
          {item.tipe === "Pemasukan" ? "+" : "-"} Rp{" "}
          {item.jumlah.toLocaleString("id-ID")}
        </Text>

        <TouchableOpacity
          onPress={() => handleEditPress(item)}
          style={[styles.editButton, { backgroundColor: "#ffc107" }]}
        >
          <Text style={styles.editText}>E</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => handleDelete(item.id)}
          style={[styles.deleteButton, { backgroundColor: colors.expense }]}
        >
          <Text style={styles.deleteText}>X</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  // --- UI TAMPILAN ---
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Tombol Toggle Dark Mode */}
      <Button
        title={themeName === "dark" ? "Mode Terang ☀️" : "Mode Gelap 🌙"}
        onPress={toggleTheme}
        color={colors.secondary}
      />

      {/* Saldo Saat Ini */}
      <View
        style={[
          styles.saldoBox,
          {
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <Text style={[styles.saldoLabel, { color: colors.subText }]}>
          💰 Total Saldo
        </Text>
        <Text style={[styles.saldoAmount, { color: colors.text }]}>
          Rp {saldo.toLocaleString("id-ID")}
        </Text>
      </View>

      {/* Form Input Tambah Transaksi */}
      <View
        style={[
          styles.inputForm,
          {
            backgroundColor: colors.cardBackground,
            shadowColor: colors.shadow,
          },
        ]}
      >
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.secondary,
              color: colors.text,
              backgroundColor: colors.cardBackground,
            },
          ]}
          placeholder="Jumlah (misal: 50000)"
          placeholderTextColor={colors.subText}
          keyboardType="numeric"
          value={jumlah}
          onChangeText={setJumlah}
        />
        <TextInput
          style={[
            styles.input,
            {
              borderColor: colors.secondary,
              color: colors.text,
              backgroundColor: colors.cardBackground,
            },
          ]}
          placeholder="Deskripsi (misal: Beli makan siang)"
          placeholderTextColor={colors.subText}
          value={deskripsi}
          onChangeText={setDeskripsi}
        />

        {/* Pilihan Tipe Transaksi */}
        <View style={styles.typeSelector}>
          {/* Tombol Pemasukan */}
          <TouchableOpacity
            style={[
              styles.typeButton,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.secondary,
              },
              tipe === "Pemasukan" && {
                backgroundColor: colors.income,
                borderColor: colors.income,
              },
            ]}
            onPress={() => setTipe("Pemasukan")}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color:
                    tipe === "Pemasukan" ? colors.cardBackground : colors.text,
                },
              ]}
            >
              Pemasukan
            </Text>
          </TouchableOpacity>
          {/* Tombol Pengeluaran */}
          <TouchableOpacity
            style={[
              styles.typeButton,
              {
                backgroundColor: colors.cardBackground,
                borderColor: colors.secondary,
              },
              tipe === "Pengeluaran" && {
                backgroundColor: colors.expense,
                borderColor: colors.expense,
              },
            ]}
            onPress={() => setTipe("Pengeluaran")}
          >
            <Text
              style={[
                styles.typeText,
                {
                  color:
                    tipe === "Pengeluaran"
                      ? colors.cardBackground
                      : colors.text,
                },
              ]}
            >
              Pengeluaran
            </Text>
          </TouchableOpacity>
        </View>

        <Button
          title={`Tambahkan ${tipe}`}
          onPress={handleSimpan}
          color={colors.primary}
        />
      </View>
      <Text style={[styles.listHeader, { color: colors.text }]}>
        Daftar Transaksi Terbaru
      </Text>

      {/* Daftar Transaksi */}
      <FlatList
        data={transaksi.slice().reverse()}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
      />

      {/* --- Modal Edit Transaksi --- */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={styles.modalCenteredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Ubah Transaksi
            </Text>

            <TextInput
              style={[
                styles.modalInput,
                {
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.background, // Background sedikit berbeda dari cardBackground
                },
              ]}
              placeholder="Jumlah (Rp)"
              placeholderTextColor={colors.subText}
              keyboardType="numeric"
              value={editJumlah}
              onChangeText={setEditJumlah}
            />
            <TextInput
              style={[
                styles.modalInput,
                {
                  borderColor: colors.secondary,
                  color: colors.text,
                  backgroundColor: colors.background,
                },
              ]}
              placeholder="Deskripsi"
              placeholderTextColor={colors.subText}
              value={editDeskripsi}
              onChangeText={setEditDeskripsi}
            />

            {/* Pilihan Tipe Transaksi dalam Modal */}
            <View style={styles.typeSelector}>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.secondary,
                  },
                  editTipe === "Pemasukan" && {
                    backgroundColor: colors.income,
                    borderColor: colors.income,
                  },
                ]}
                onPress={() => setEditTipe("Pemasukan")}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color:
                        editTipe === "Pemasukan"
                          ? colors.cardBackground
                          : colors.text,
                    },
                  ]}
                >
                  Pemasukan
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.typeButton,
                  {
                    backgroundColor: colors.background,
                    borderColor: colors.secondary,
                  },
                  editTipe === "Pengeluaran" && {
                    backgroundColor: colors.expense,
                    borderColor: colors.expense,
                  },
                ]}
                onPress={() => setEditTipe("Pengeluaran")}
              >
                <Text
                  style={[
                    styles.typeText,
                    {
                      color:
                        editTipe === "Pengeluaran"
                          ? colors.cardBackground
                          : colors.text,
                    },
                  ]}
                >
                  Pengeluaran
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.modalButtonContainer}>
              <Button
                title="Simpan Perubahan"
                onPress={handleUpdate}
                color={colors.income}
              />
              <Button
                title="Batal"
                onPress={() => setIsModalVisible(false)}
                color={colors.secondary}
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* --- Modal Konfirmasi Hapus BARU --- */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isDeleteConfirmVisible}
        onRequestClose={() => setIsDeleteConfirmVisible(false)}
      >
        <View style={styles.modalCenteredView}>
          <View
            style={[
              styles.modalView,
              { backgroundColor: colors.cardBackground },
            ]}
          >
            <Text style={[styles.modalTitle, { color: colors.text }]}>
              Konfirmasi Hapus
            </Text>
            <Text
              style={[
                {
                  marginBottom: 20,
                  textAlign: "center",
                  color: colors.subText,
                },
              ]}
            >
              Apakah Anda yakin ingin menghapus transaksi ini secara permanen?
            </Text>

            <View style={styles.modalButtonContainer}>
              <Button
                title="Hapus Permanen"
                onPress={confirmDelete}
                color={colors.expense}
              />
              <Button
                title="Batal"
                onPress={() => setIsDeleteConfirmVisible(false)}
                color={colors.secondary}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// --- STYLING ---

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // Background color sekarang diambil dari props
    paddingTop: 10,
    paddingHorizontal: 20,
  },
  saldoBox: {
    // Background color sekarang diambil dari props
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    alignItems: "center",
    elevation: 2,
    // shadowColor sekarang diambil dari props
  },
  saldoLabel: {
    fontSize: 16,
    // Text color sekarang diambil dari props
  },
  saldoAmount: {
    fontSize: 32,
    fontWeight: "bold",
    // Text color sekarang diambil dari props
    marginTop: 5,
  },
  inputForm: {
    // Background color sekarang diambil dari props
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    elevation: 2,
    // shadowColor sekarang diambil dari props
  },
  input: {
    borderWidth: 1,
    // borderColor, color, backgroundColor sekarang diambil dari props
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  typeSelector: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  typeButton: {
    paddingVertical: 10,
    paddingHorizontal: 10,
    minWidth: "48%", // Ganti dari 50% agar ada sedikit jarak
    alignItems: "center",
    borderRadius: 6,
    borderWidth: 1, // Tambahkan border agar terlihat di Dark Mode jika tidak aktif
  },
  typeText: {
    fontWeight: "bold",
  },
  listHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    // Text color sekarang diambil dari props
  },
  item: {
    flexDirection: "row",
    justifyContent: "space-between",
    // Background color sekarang diambil dari props
    padding: 15,
    marginBottom: 8,
    borderRadius: 6,
    borderLeftWidth: 5,
    // borderLeftColor sekarang diambil dari props
  },
  itemDetails: {
    flex: 1,
  },
  itemActions: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  desc: {
    fontSize: 16,
    fontWeight: "bold",
    // Text color sekarang diambil dari props
  },
  date: {
    fontSize: 12,
    // Text color sekarang diambil dari props
  },
  pemasukan: {
    // Color diambil dari props
    fontWeight: "bold",
  },
  pengeluaran: {
    // Color diambil dari props
    fontWeight: "bold",
  },
  // Tombol EDIT
  editButton: {
    marginLeft: 10,
    // Background color tetap kuning (Warna Warning)
    padding: 5,
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  editText: {
    color: "#000",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Tombol HAPUS
  deleteButton: {
    marginLeft: 10,
    // Background color diambil dari props
    padding: 5,
    borderRadius: 50,
    width: 25,
    height: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 12,
  },
  // Gaya Modal
  modalCenteredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalView: {
    margin: 20,
    // Background color diambil dari props
    borderRadius: 10,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: "80%",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
    // Text color diambil dari props
  },
  modalInput: {
    borderWidth: 1,
    // borderColor, color, backgroundColor diambil dari props
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    width: "100%",
  },
  modalButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
    marginTop: 15,
  },
});

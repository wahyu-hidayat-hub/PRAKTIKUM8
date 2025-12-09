<?php
// --- BAGIAN 1: PAKSA MUNCULKAN SEMUA ERROR ---
error_reporting(E_ALL);
ini_set('display_errors', 1);

header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");

// --- BAGIAN 2: CEK KONEKSI DATABASE ---
// Gunakan 'require' agar jika file tidak ketemu, langsung error fatal (bukan lanjut diam-diam)
require 'db.php'; 

if (!$koneksi) {
    die("FATAL: Variabel \$koneksi tidak ditemukan atau gagal terhubung.");
}

// --- BAGIAN 3: CEK APAKAH ADA DATA YANG DIKIRIM? ---
// Kita cek isi $_POST. Jika kosong, berarti HTML tidak mengirim apa-apa.
if (empty($_POST)) {
    echo "DEBUG INFO: \$_POST kosong. ";
    
    // Cek apakah data dikirim sebagai JSON Raw (kadang terjadi di fetch API)
    $rawInput = file_get_contents("php://input");
    if (!empty($rawInput)) {
        echo "Tapi ada data RAW JSON: " . $rawInput;
    } else {
        echo "Browser tidak mengirim data apa pun.";
    }
    exit; // Stop proses di sini
}

// Ambil data
$nama = isset($_POST['nama']) ? $_POST['nama'] : '';
$nim  = isset($_POST['nim']) ? $_POST['nim'] : '';

// Tampilkan apa yang diterima PHP (Akan muncul di tab Response)
echo "DEBUG DATA: Nama = [$nama], NIM = [$nim] || ";

// --- BAGIAN 4: EKSEKUSI QUERY ---
if(empty($nama) || empty($nim)) {
    echo "GAGAL: Data nama atau nim kosong.";
    exit;
}

$query = "INSERT INTO mahasiswa (nama, nim) VALUES ('$nama', '$nim')";

if (mysqli_query($koneksi, $query)) {
    echo "STATUS: SUKSES (Data berhasil disimpan)";
} else {
    // Tampilkan error SQL spesifik
    echo "STATUS: ERROR SQL -> " . mysqli_error($koneksi);
}
?>
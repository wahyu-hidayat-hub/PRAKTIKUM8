<?php
include 'db.php';

$query = "SELECT * FROM mahasiswa ORDER BY id DESC";
$result = mysqli_query($koneksi, $query);

$data = array();

while ($row = mysqli_fetch_assoc($result)) {
    $data[] = $row;
}

echo json_encode($data);
?>
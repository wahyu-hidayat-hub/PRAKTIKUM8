const apiUrl = 'http://localhost/praktikum_fullstack/backend/';

// Cek apakah script berjalan
console.log("Script.js berhasil dimuat!");

document.addEventListener('DOMContentLoaded', () => {
    console.log("Halaman siap, mencoba load data...");
    loadData();
});

function loadData() {
    fetch(apiUrl + 'read.php?v=' + new Date().getTime())
    .then(response => {
        if (!response.ok) {
            throw new Error("Gagal akses read.php. Status: " + response.status);
        }
        return response.json();
    })
    .then(data => {
        console.log("Data diterima:", data); 
        let rows = '';
        if (data.length === 0) {
            rows = '<tr><td colspan="4" style="text-align:center;">Data Kosong</td></tr>';
        } else {
            data.forEach((mhs, index) => {
                rows += `
                    <tr>
                        <td>${index + 1}</td>
                        <td>${mhs.nama}</td>
                        <td>${mhs.nim}</td>
                        <td>
                            <button onclick="editData('${mhs.id}', '${mhs.nama}', '${mhs.nim}')">Edit</button>
                            <button onclick="hapusData('${mhs.id}')">Hapus</button>
                        </td>
                    </tr>
                `;
            });
        }
        document.getElementById('tabelData').innerHTML = rows;
    })
    .catch(error => {
        console.error("Error Load Data:", error);
        document.getElementById('tabelData').innerHTML = '<tr><td colspan="4" style="color:red; text-align:center;">Gagal memuat data: ' + error.message + '</td></tr>';
    });
}

const form = document.getElementById('formMahasiswa');
if (form) {
    form.addEventListener('submit', function(e) {
        e.preventDefault(); 
        
        console.log("Tombol Simpan ditekan!");

        let id = document.getElementById('id').value;
        let nama = document.getElementById('nama').value;
        let nim = document.getElementById('nim').value;

        if (!nama || !nim) {
            alert("Nama dan NIM wajib diisi!");
            return;
        }
        
        let formData = new FormData();
        formData.append('nama', nama);
        formData.append('nim', nim);
        
        let url = apiUrl + 'create.php';
        if(id) {
            formData.append('id', id);
            url = apiUrl + 'update.php';
        }

        console.log("Mengirim data ke:", url);

        fetch(url, {
            method: 'POST',
            body: formData
        })
        .then(response => response.text())
        .then(data => {
            console.log("Respon Server:", data);
            alert("Status Server: " + data); 
            
            document.getElementById('formMahasiswa').reset();
            document.getElementById('id').value = '';
            document.getElementById('btnSimpan').innerText = 'Simpan';
            
            loadData();
        })
        .catch(error => {
            console.error("Error Kirim Data:", error);
            alert("Gagal mengirim data: " + error.message);
        });
    });
} else {
    alert("FATAL ERROR: Form tidak ditemukan! Cek ID 'formMahasiswa' di HTML.");
}

function editData(id, nama, nim) {
    document.getElementById('id').value = id;
    document.getElementById('nama').value = nama;
    document.getElementById('nim').value = nim;
    document.getElementById('btnSimpan').innerText = 'Update';
}

function hapusData(id) {
    if(confirm('Hapus data ini?')) {
        let formData = new FormData();
        formData.append('id', id);
        fetch(apiUrl + 'delete.php', { method: 'POST', body: formData })
        .then(res => res.text())
        .then(data => {
            alert(data);
            loadData();
        });
    }
}
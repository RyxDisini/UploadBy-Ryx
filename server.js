const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// Buat folder uploads jika belum ada
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Konfigurasi multer untuk menangani upload gambar dan video
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder tujuan menyimpan file yang diunggah
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); // nama file unik dengan ekstensi yang sama
  }
});

// Filter untuk jenis file yang diizinkan (gambar atau video)
const fileFilter = function (req, file, cb) {
  const allowedTypes = /image|video/;
  const extname = path.extname(file.originalname).toLowerCase();
  const mimetype = file.mimetype.split('/')[0];
  if (allowedTypes.test(mimetype) && allowedTypes.test(extname)) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar atau video yang diizinkan!'));
  }
};

const upload = multer({ 
  storage: storage, 
  fileFilter: fileFilter,
  limits: {
    fileSize: 1024 * 1024 * 100 // Maksimal 100 MB
  }
});

// Endpoint untuk mengunggah gambar atau video
app.post('/upload', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'File tidak ditemukan' });
    }
    res.status(200).json({
      status: 200,
      message: 'File berhasil diunggah',
      data: {
        filename: req.file.filename,
        path: `/uploads/${req.file.filename}`
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});

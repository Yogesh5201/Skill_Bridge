const path = require('path');
const fs = require('fs');
const multer = require('multer');
const pool = require('../db/pool');

const uploadDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${unique}${path.extname(file.originalname)}`);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 20 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowed = [
      'image/jpeg', 'image/png', 'image/gif', 'image/webp',
      'application/pdf', 'text/plain', 'application/zip',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    ];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error('File type not allowed'));
  },
});

exports.uploadMiddleware = upload.single('file');

exports.uploadDocument = async (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No file uploaded.' });

  try {
    const { recipientId, swapRequestId } = req.body;

    const result = await pool.query(
      `INSERT INTO documents (id, name, original_name, file_path, size, mime_type, uploader_id, recipient_id, swap_request_id, created_at)
       VALUES (gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, NOW())
       RETURNING *`,
      [
        req.file.filename,
        req.file.originalname,
        req.file.path,
        req.file.size,
        req.file.mimetype,
        req.user.id,
        recipientId || null,
        swapRequestId || null,
      ]
    );

    const doc = result.rows[0];
    res.status(201).json({ ...doc, url: `/api/documents/file/${doc.name}` });
  } catch (err) {
    console.error('uploadDocument error:', err.message);
    res.status(500).json({ error: 'Failed to save document.' });
  }
};

// Get docs shared between current user and another user
exports.getDocuments = async (req, res) => {
  const { recipientId } = req.query;
  const userId = req.user.id;

  try {
    let query, params;

    if (recipientId) {
      // Get all docs shared between these two users (both directions)
      query = `
        SELECT d.*, u.name as "uploaderName", u.avatar as "uploaderAvatar"
        FROM documents d
        JOIN "User" u ON u.id = d.uploader_id
        WHERE (d.uploader_id = $1 AND d.recipient_id = $2)
           OR (d.uploader_id = $2 AND d.recipient_id = $1)
        ORDER BY d.created_at ASC
      `;
      params = [userId, recipientId];
    } else {
      // All my docs
      query = `
        SELECT d.*, u.name as "uploaderName", u.avatar as "uploaderAvatar"
        FROM documents d
        JOIN "User" u ON u.id = d.uploader_id
        WHERE d.uploader_id = $1 OR d.recipient_id = $1
        ORDER BY d.created_at DESC
      `;
      params = [userId];
    }

    const result = await pool.query(query, params);
    const docs = result.rows.map(d => ({
      ...d,
      url: `/api/documents/file/${d.name}`,
      uploader: { id: d.uploader_id, name: d.uploaderName, avatar: d.uploaderAvatar },
    }));
    res.json(docs);
  } catch (err) {
    console.error('getDocuments error:', err.message);
    res.status(500).json({ error: 'Failed to fetch documents.' });
  }
};

exports.serveFile = (req, res) => {
  const filePath = path.join(uploadDir, req.params.filename);
  if (!fs.existsSync(filePath)) return res.status(404).json({ error: 'File not found.' });
  res.sendFile(filePath);
};

exports.deleteDocument = async (req, res) => {
  try {
    const result = await pool.query(
      `DELETE FROM documents WHERE id=$1 AND uploader_id=$2 RETURNING *`,
      [req.params.id, req.user.id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Document not found.' });

    const filePath = path.join(uploadDir, result.rows[0].name);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    res.json({ message: 'Document deleted.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete document.' });
  }
};

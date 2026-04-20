const bcrypt = require('bcrypt');
const db = require('./config/db');

// ── Admin Login ────────────────────────────
const adminLogin = async (req, res) => {
  const { email, password, accessCode } = req.body;

  // Validate access code (hardcoded for simplicity)
  if (accessCode !== '123456') {
    return res.status(401).json({ success: false, message: 'Invalid access code.' });
  }

  try {
    const [rows] = await db.execute('SELECT * FROM users WHERE email = ? AND role = "admin"', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Admin not found.' });
    }

    const admin = rows[0];
    const isPasswordValid = await bcrypt.compare(password, admin.password);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Invalid password.' });
    }

    res.json({
      success: true,
      message: 'Admin login successful.',
      admin: { id: admin.id, name: admin.name, email: admin.email, role: admin.role }
    });
  } catch (error) {
    console.error('Admin login error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Get All Drivers ────────────────────────
const getAllDrivers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, first_name, last_name, email, phone, license_number, vehicle_type, vehicle_number, status, created_at FROM drivers');
    res.json({ success: true, drivers: rows });
  } catch (error) {
    console.error('Get drivers error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Update Driver Status ───────────────────
const updateDriverStatus = async (req, res) => {
  console.log('params:', req.params, 'body:', req.body);
  const { id } = req.params;
  const { status } = req.body;
  console.log('id:', id, 'status:', status);

  if (!['approved', 'rejected'].includes(status)) {
    return res.status(400).json({ success: false, message: 'Invalid status.' });
  }

  try {
    await db.execute('UPDATE drivers SET status = ? WHERE id = ?', [status, id]);
    res.json({ success: true, message: `Driver ${status}.` });
  } catch (error) {
    console.error('Update driver status error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Get All Users ──────────────────────────
const getAllUsers = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT id, name, email, phone, role, created_at FROM users');
    res.json({ success: true, users: rows });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Get All Bookings ───────────────────────
const getAllBookings = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT * FROM bookings ORDER BY created_at DESC');
    res.json({ success: true, bookings: rows });
  } catch (error) {
    console.error('Get bookings error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// ── Get All Vehicles ───────────────────────
const getAllVehicles = async (req, res) => {
  try {
    const [rows] = await db.execute('SELECT v.*, d.first_name, d.last_name FROM vehicles v JOIN drivers d ON v.driver_id = d.id');
    res.json({ success: true, vehicles: rows });
  } catch (error) {
    console.error('Get vehicles error:', error);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = {
  adminLogin,
  getAllDrivers,
  updateDriverStatus,
  getAllUsers,
  getAllBookings,
  getAllVehicles
};
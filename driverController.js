const bcrypt = require('bcrypt');
const db = require('./config/db');

const normalizeDriver = (row) => ({
  id: row.id,
  first_name: row.first_name,
  last_name: row.last_name,
  email: row.email,
  phone: row.phone,
  license_number: row.license_number,
  vehicle_type: row.vehicle_type,
  vehicle_number: row.vehicle_number,
  status: row.status,
  created_at: row.created_at,
});

// ── POST /api/driver/signup ─────────────────
const registerDriver = async (req, res) => {
  try {
    const { first_name, last_name, email, phone, password, license_number, vehicle_type, vehicle_number } = req.body;

    if (!first_name || !last_name || !email || !phone || !password || !license_number || !vehicle_type || !vehicle_number) {
      return res.status(400).json({ success: false, message: 'All fields are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });
    }

    const [existingEmail] = await db.query('SELECT id FROM drivers WHERE email = ?', [email]);
    if (existingEmail.length > 0) {
      return res.status(409).json({ success: false, message: 'Email already registered. Please login or use a different email.' });
    }

    const [existingLicense] = await db.query('SELECT id FROM drivers WHERE license_number = ?', [license_number]);
    if (existingLicense.length > 0) {
      return res.status(409).json({ success: false, message: 'Driver license already registered.' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const [result] = await db.query(
      `INSERT INTO drivers (first_name, last_name, email, phone, password, license_number, vehicle_type, vehicle_number)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [first_name, last_name, email, phone, hashedPassword, license_number, vehicle_type, vehicle_number]
    );

    res.status(201).json({
      success: true,
      message: 'Driver application submitted successfully! Please wait for approval.',
      driverId: result.insertId,
    });
  } catch (err) {
    console.error('Driver signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── POST /api/driver/login ─────────────────
const loginDriver = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [rows] = await db.query('SELECT * FROM drivers WHERE email = ?', [email]);
    if (rows.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    const driver = rows[0];
    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });
    }

    res.status(200).json({ success: true, message: 'Login successful!', driver: normalizeDriver(driver) });
  } catch (err) {
    console.error('Driver login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── GET /api/driver/profile ─────────────────
const getDriverProfile = async (req, res) => {
  try {
    const { id, email } = req.query;
    if (!id && !email) {
      return res.status(400).json({ success: false, message: 'Driver id or email is required.' });
    }

    const query = id ? 'SELECT * FROM drivers WHERE id = ?' : 'SELECT * FROM drivers WHERE email = ?';
    const [rows] = await db.query(query, [id || email]);
    if (rows.length === 0) {
      return res.status(404).json({ success: false, message: 'Driver not found.' });
    }

    res.status(200).json({ success: true, driver: normalizeDriver(rows[0]) });
  } catch (err) {
    console.error('Get driver profile error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── POST /api/driver/vehicle ─────────────────
const addVehicle = async (req, res) => {
  try {
    const { driver_id, make_model, vehicle_type, vehicle_number, seating_capacity } = req.body;
    if (!driver_id || !make_model || !vehicle_type || !vehicle_number || !seating_capacity) {
      return res.status(400).json({ success: false, message: 'All vehicle fields are required.' });
    }

    const [result] = await db.query(
      `INSERT INTO vehicles (driver_id, make_model, vehicle_type, vehicle_number, seating_capacity)
       VALUES (?, ?, ?, ?, ?)`,
      [driver_id, make_model, vehicle_type, vehicle_number, seating_capacity]
    );

    res.status(201).json({ success: true, message: 'Vehicle added successfully.', vehicleId: result.insertId });
  } catch (err) {
    console.error('Add vehicle error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── GET /api/driver/vehicles ─────────────────
const getVehicles = async (req, res) => {
  try {
    const { driver_id } = req.query;
    if (!driver_id) {
      return res.status(400).json({ success: false, message: 'Driver id is required.' });
    }

    const [vehicles] = await db.query('SELECT * FROM vehicles WHERE driver_id = ?', [driver_id]);
    res.status(200).json({ success: true, vehicles });
  } catch (err) {
    console.error('Get vehicles error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = { registerDriver, loginDriver, getDriverProfile, addVehicle, getVehicles };
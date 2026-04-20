const bcrypt = require('bcrypt');
const db     = require('./config/db');

// ── POST /api/auth/signup ──────────────────
const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    // Validation
    if (!name || !email || !password || !phone)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters.' });

    // Check if email already exists
    const [existing] = await db.query('SELECT id FROM users WHERE email = ?', [email]);
    if (existing.length > 0)
      return res.status(409).json({ success: false, message: 'Email already registered. Please login.' });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const [result] = await db.query(
      'INSERT INTO users (name, email, password, phone) VALUES (?, ?, ?, ?)',
      [name, email, hashedPassword, phone]
    );

    res.status(201).json({
      success: true,
      message: 'Account created successfully! Please login.',
      userId: result.insertId,
    });

  } catch (err) {
    console.error('Signup error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── POST /api/auth/login ───────────────────
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required.' });

    // Find user
    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);
    if (rows.length === 0)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    const user = rows[0];

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password.' });

    res.status(200).json({
      success: true,
      message: 'Login successful! Welcome back.',
      user: {
        id:    user.id,
        name:  user.name,
        email: user.email,
        phone: user.phone || '',
      },
    });

  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = { signup, login };

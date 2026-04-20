const db = require('./config/db');

// ── POST /api/booking/create ───────────────
const createBooking = async (req, res) => {
  try {
    const { pickup, drop_location, date, time, vehicle_type, passengers } = req.body;

    // Validation
    if (!pickup || !drop_location || !date || !time || !vehicle_type)
      return res.status(400).json({ success: false, message: 'All fields are required.' });

    // Price estimation
    const rates = { car: 12, tt: 18, tempo: 22, minibus: 28 };
    const km    = Math.floor(Math.random() * 30) + 10; // demo estimate
    const rate  = rates[vehicle_type] || 14;
    const price = km * rate;

    const [result] = await db.query(
      `INSERT INTO bookings (pickup, drop_location, date, time, vehicle_type, passengers, estimated_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [pickup, drop_location, date, time, vehicle_type, passengers || 1, price]
    );

    res.status(201).json({
      success:    true,
      message:    'Booking created successfully!',
      bookingId:  result.insertId,
      bookingRef: `#RW-${result.insertId.toString().padStart(4, '0')}`,
      estimated:  { km, rate, price: `₹${price}` },
    });

  } catch (err) {
    console.error('Create booking error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── GET /api/booking/all ───────────────────
const getAllBookings = async (req, res) => {
  try {
    const [bookings] = await db.query(
      'SELECT * FROM bookings ORDER BY created_at DESC'
    );

    res.status(200).json({
      success:  true,
      count:    bookings.length,
      bookings,
    });

  } catch (err) {
    console.error('Get bookings error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── GET /api/booking/:id ───────────────────
const getBookingById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await db.query('SELECT * FROM bookings WHERE id = ?', [id]);

    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Booking not found.' });

    res.status(200).json({ success: true, booking: rows[0] });

  } catch (err) {
    console.error('Get booking error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// ── PATCH /api/booking/:id/status ─────────
const updateStatus = async (req, res) => {
  try {
    const { id }     = req.params;
    const { status } = req.body;
    const allowed    = ['pending', 'confirmed', 'ongoing', 'completed', 'cancelled'];

    if (!allowed.includes(status))
      return res.status(400).json({ success: false, message: 'Invalid status value.' });

    const [result] = await db.query(
      'UPDATE bookings SET status = ? WHERE id = ?', [status, id]
    );

    if (result.affectedRows === 0)
      return res.status(404).json({ success: false, message: 'Booking not found.' });

    res.status(200).json({ success: true, message: `Booking status updated to "${status}".` });

  } catch (err) {
    console.error('Update status error:', err.message);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

module.exports = { createBooking, getAllBookings, getBookingById, updateStatus };

const pool = require('../db');

// GET /api/customers?page=1&limit=10
const getAllCustomers = async (req, res) => {
  let page = parseInt(req.query.page) || 1;
  let limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    // Fetch total count
    const [countResult] = await pool.query('SELECT COUNT(*) AS total FROM users');
    const total = countResult[0].total;
    const totalPages = Math.ceil(total / limit);

    // Fetch paginated results
    const [users] = await pool.query(
      'SELECT id, first_name, last_name, email FROM users LIMIT ? OFFSET ?',
      [limit, offset]
    );

    res.json({
      page,
      limit,
      total_users: total,
      total_pages: totalPages,
      data: users
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};


// GET /api/customers/:id
const getCustomerById = async (req, res) => {
  const customerId = req.params.id;

  if (isNaN(customerId)) {
    return res.status(400).json({ error: 'Invalid customer ID' });
  }

  try {
    const [user] = await pool.query(
      'SELECT id, first_name, last_name, email, age, gender, state, city FROM users WHERE id = ?',
      [customerId]
    );

    if (user.length === 0) {
      return res.status(404).json({ error: 'Customer not found' });
    }

    const [orders] = await pool.query(
      'SELECT COUNT(*) AS order_count FROM orders WHERE user_id = ?',
      [customerId]
    );

    const result = {
      ...user[0],
      order_count: orders[0].order_count
    };

    res.json(result);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'Server Error' });
  }
};

module.exports = {
  getAllCustomers,
  getCustomerById
};

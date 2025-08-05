const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const pool = require('../db');

// Load Users
const uploadUsers = async (req, res) => {
  const users = [];

  fs.createReadStream(path.join(__dirname, '..', 'datasets', 'users.csv'))
    .pipe(csv())
    .on('data', (row) => users.push(row))
    .on('end', async () => {
      try {
        for (let user of users) {
          await pool.query(`
            INSERT INTO users (
              id, first_name, last_name, email, age, gender, state,
              street_address, postal_code, city, country, latitude, longitude,
              traffic_source, created_at
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE id = id
          `,
            [
              user.id, user.first_name, user.last_name, user.email, user.age, user.gender, user.state,
              user.street_address, user.postal_code, user.city, user.country,
              user.latitude, user.longitude, user.traffic_source, user.created_at
            ]);
        }
        res.send('✅ Users data uploaded to MySQL');
      } catch (err) {
        console.error('❌ DB Error:', err.message);
        res.status(500).send('❌ Error uploading users');
      }
    })
    .on('error', (err) => {
      console.error('❌ File Read Error:', err.message);
      res.status(500).send('❌ users.csv file not found');
    });
};

// Load Orders
const uploadOrders = async (req, res) => {
  const orders = [];

  fs.createReadStream(path.join(__dirname, '..', 'datasets', 'orders.csv'))
    .pipe(csv())
    .on('data', (row) => orders.push(row))
    .on('end', async () => {
      try {
        for (let order of orders) {
          await pool.query(`
            INSERT INTO orders (
              order_id, user_id, status, gender, created_at,
              returned_at, shipped_at, delivered_at, num_of_item
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE order_id = order_id
          `,
            [
              order.order_id, order.user_id, order.status, order.gender, order.created_at,
              order.returned_at || null, order.shipped_at || null, order.delivered_at || null,
              order.num_of_item
            ]);
        }
        res.send('✅ Orders data uploaded to MySQL');
      } catch (err) {
        console.error('❌ DB Error:', err.message);
        res.status(500).send('❌ Error uploading orders');
      }
    })
    .on('error', (err) => {
      console.error('❌ File Read Error:', err.message);
      res.status(500).send('❌ orders.csv file not found');
    });
};

module.exports = { uploadUsers, uploadOrders };

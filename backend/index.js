const express = require('express');
const app = express();
const uploadRoutes = require('./routes/upload');
require('dotenv').config();

app.use('/api', uploadRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

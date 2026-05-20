const express = require('express');
const app = express();
app.use(express.json());
app.post('/notify', (req, res) => {
  console.log(`[NOTIFICATION] ${req.body.message}`);
  res.json({ received: true });
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 3004;
if (require.main === module) app.listen(PORT, () => console.log(`Notification service on ${PORT}`));
module.exports = app;

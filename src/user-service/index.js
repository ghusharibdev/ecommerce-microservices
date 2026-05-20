const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const app = express();
app.use(express.json());
const JWT_SECRET = 'your-secret-key';
const users = [];
app.post('/register', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (users.find(u => u.email === email)) return res.status(409).json({ error: 'User exists' });
  const hashed = await bcrypt.hash(password, 10);
  const id = users.length + 1;
  users.push({ id, email, password: hashed });
  res.status(201).json({ id, email });
});
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email);
  if (!user) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await bcrypt.compare(password, user.password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ userId: user.id, email }, JWT_SECRET, { expiresIn: '1h' });
  res.json({ token });
});
app.get('/profile', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ error: 'No token' });
  try {
    const decoded = jwt.verify(auth.split(' ')[1], JWT_SECRET);
    const user = users.find(u => u.id === decoded.userId);
    user ? res.json({ id: user.id, email: user.email }) : res.status(404).json({ error: 'User not found' });
  } catch { res.status(401).json({ error: 'Invalid token' }); }
});
app.get('/health', (req, res) => res.json({ status: 'ok' }));
const PORT = process.env.PORT || 3001;
if (require.main === module) app.listen(PORT, () => console.log(`User service on ${PORT}`));
module.exports = app;

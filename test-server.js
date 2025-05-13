import express from 'express';
import cors from 'cors';

const app = express();

// In-memory user storage
const users = [];

// Middleware
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  console.log('Request body:', req.body);
  next();
});

// Register route
app.post('/auth/register', (req, res) => {
  try {
    const { name, email, password } = req.body;
    
    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Check if user already exists
    if (users.find(u => u.email === email.toLowerCase())) {
      return res.status(400).json({ message: 'Email is already registered' });
    }

    // Create new user
    const newUser = {
      id: Date.now().toString(),
      name,
      email: email.toLowerCase(),
      password // In a real app, this would be hashed
    };

    users.push(newUser);
    console.log('New user registered:', { name, email });

    res.status(201).json({ message: 'Registration successful' });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Error registering user' });
  }
});

// Login route
app.post('/auth/login', (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email });

    // Find user
    const user = users.find(u => u.email === email.toLowerCase());
    
    // For testing purposes, also allow the test account
    if (email === 'test@test.com' && password === 'password') {
      return res.json({
        token: 'test-token',
        user: {
          id: 'test-id',
          name: 'Test User',
          email: 'test@test.com'
        }
      });
    }

    // Check credentials
    if (!user || user.password !== password) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create response
    const response = {
      token: 'user-token-' + user.id,
      user: {
        id: user.id,
        name: user.name,
        email: user.email
      }
    };

    console.log('Login successful:', response);
    res.json(response);
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Error logging in' });
  }
});

// Basic route for testing
app.get('/', (req, res) => {
  res.json({ message: 'Test server is running' });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    message: 'Internal server error',
    error: err.message 
  });
});

const PORT = 5001;
app.listen(PORT, () => {
  console.log('='.repeat(50));
  console.log(`Test server is running on port ${PORT}`);
  console.log('Test credentials:');
  console.log('Email: test@test.com');
  console.log('Password: password');
  console.log('='.repeat(50));
}); 
const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/user');

const MONGO_URI = process.env.MONGO_URI;

const testAdmin = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const admin = await User.findOne({ email: 'admin@puthankada.com' });
    
    if (!admin) {
      console.log('❌ Admin not found!');
      process.exit(1);
    }

    console.log('\n✅ Admin found:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('Has Password:', !!admin.password);
    console.log('Password Hash:', admin.password.substring(0, 20) + '...');
    
    // Test password
    const bcrypt = require('bcryptjs');
    const isMatch = await bcrypt.compare('puthankada123', admin.password);
    console.log('Password Match:', isMatch ? '✅ YES' : '❌ NO');
    
    process.exit(0);
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

testAdmin();
const db = require('../config/db');
const bcrypt = require('bcryptjs');

const User = {
  create: (name, email, password, role, callback) => {
    bcrypt.hash(password, 10, (err, hash) => {
      if (err) return callback(err);
      db.run(
        'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)',
        [name, email, hash, role],
        function(err) {
          callback(err, this);
        }
      );
    });
  },
  findByEmail: (email, callback) => {
    db.get('SELECT * FROM users WHERE email = ?', [email], callback);
  },
  findById: (id, callback) => {
    db.get('SELECT * FROM users WHERE id = ?', [id], callback);
  },
  comparePassword: (plainPassword, hashedPassword, callback) => {
    bcrypt.compare(plainPassword, hashedPassword, callback);
  },
  findAll: (callback) => {
    db.all('SELECT * FROM users ORDER BY created_at DESC', callback);
  }
};

module.exports = User;

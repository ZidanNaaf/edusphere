const User = require('../models/User');

const authController = {
  showLogin: (req, res) => {
    res.render('auth/login');
  },
  showRegister: (req, res) => {
    res.render('auth/register');
  },
  register: (req, res) => {
    const { name, email, password, role } = req.body;
    if (!name || !email || !password || !role) {
      req.flash('error_msg', 'Semua field harus diisi.');
      return res.redirect('/register');
    }
    User.findByEmail(email, (err, user) => {
      if (user) {
        req.flash('error_msg', 'Email sudah terdaftar.');
        return res.redirect('/register');
      }
      User.create(name, email, password, role, (err) => {
        if (err) {
          req.flash('error_msg', 'Gagal mendaftar.');
          return res.redirect('/register');
        }
        req.flash('success_msg', 'Pendaftaran berhasil. Silakan login.');
        res.redirect('/login');
      });
    });
  },
  login: (req, res) => {
    const { email, password } = req.body;
    User.findByEmail(email, (err, user) => {
      if (!user) {
        req.flash('error_msg', 'Email atau password salah.');
        return res.redirect('/login');
      }
      User.comparePassword(password, user.password, (err, isMatch) => {
        if (!isMatch) {
          req.flash('error_msg', 'Email atau password salah.');
          return res.redirect('/login');
        }
        req.session.user = {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        req.flash('success_msg', `Selamat datang, ${user.name}!`);
        if (user.role === 'teacher') {
          res.redirect('/dashboard/teacher');
        } else {
          res.redirect('/dashboard/student');
        }
      });
    });
  },
  logout: (req, res) => {
    req.session.destroy((err) => {
      res.clearCookie('connect.sid');
      res.redirect('/login');
    });
  }
};

module.exports = authController;

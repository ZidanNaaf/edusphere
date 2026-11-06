const authMiddleware = {
  guest: (req, res, next) => {
    if (req.session.user) {
      return res.redirect(req.session.user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
    }
    next();
  },
  auth: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Anda harus login untuk mengakses halaman ini.');
      return res.redirect('/login');
    }
    next();
  },
  teacher: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Anda harus login terlebih dahulu.');
      return res.redirect('/login');
    }
    if (req.session.user.role !== 'teacher') {
      req.flash('error_msg', 'Halaman ini hanya dapat diakses oleh Guru.');
      return res.redirect('/dashboard/student');
    }
    next();
  },
  student: (req, res, next) => {
    if (!req.session.user) {
      req.flash('error_msg', 'Anda harus login terlebih dahulu.');
      return res.redirect('/login');
    }
    if (req.session.user.role !== 'student') {
      req.flash('error_msg', 'Halaman ini hanya dapat diakses oleh Siswa.');
      return res.redirect('/dashboard/teacher');
    }
    next();
  }
};

module.exports = authMiddleware;

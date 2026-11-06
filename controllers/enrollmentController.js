const Enrollment = require('../models/Enrollment');

const enrollmentController = {
  enroll: (req, res) => {
    const courseId = req.params.courseId;
    const studentId = req.session.user.id;
    Enrollment.isEnrolled(studentId, courseId, (err, existing) => {
      if (existing) {
        req.flash('error_msg', 'Anda sudah terdaftar di kelas ini.');
        return res.redirect('/courses');
      }
      Enrollment.enroll(studentId, courseId, (err) => {
        if (err) {
          req.flash('error_msg', 'Gagal mendaftar kelas.');
          return res.redirect('/courses');
        }
        req.flash('success_msg', 'Berhasil mendaftar kelas.');
        res.redirect('/dashboard/student');
      });
    });
  },
  index: (req, res) => {
    const studentId = req.session.user.id;
    Enrollment.findByStudent(studentId, (err, courses) => {
      if (err) {
        req.flash('error_msg', 'Gagal memuat enrollments.');
        return res.redirect('/dashboard/student');
      }
      res.render('enrollments/index', { courses });
    });
  }
};

module.exports = enrollmentController;

const Course = require('../models/Course');
const Enrollment = require('../models/Enrollment');

const courseController = {
  index: (req, res) => {
    Course.findAll((err, courses) => {
      if (err) {
        req.flash('error_msg', 'Gagal memuat daftar kelas.');
        return res.redirect('/dashboard/student');
      }
      res.render('courses/index', { courses });
    });
  },
  showCreate: (req, res) => {
    res.render('courses/create');
  },
  create: (req, res) => {
    const { title, description } = req.body;
    Course.create(title, description, req.session.user.id, (err) => {
      if (err) {
        req.flash('error_msg', 'Gagal membuat kelas.');
        return res.redirect('/courses/create');
      }
      req.flash('success_msg', 'Kelas berhasil dibuat.');
      res.redirect('/dashboard/teacher');
    });
  },
  showEdit: (req, res) => {
    const id = req.params.id;
    Course.isOwner(id, req.session.user.id, (err, course) => {
      if (!course) {
        req.flash('error_msg', 'Kelas tidak ditemukan atau Anda bukan pemilik.');
        return res.redirect('/dashboard/teacher');
      }
      res.render('courses/edit', { course });
    });
  },
  update: (req, res) => {
    const id = req.params.id;
    const { title, description } = req.body;
    Course.isOwner(id, req.session.user.id, (err, course) => {
      if (!course) {
        req.flash('error_msg', 'Kelas tidak ditemukan atau Anda bukan pemilik.');
        return res.redirect('/dashboard/teacher');
      }
      Course.update(id, title, description, (err) => {
        if (err) {
          req.flash('error_msg', 'Gagal memperbarui kelas.');
          return res.redirect(`/courses/${id}/edit`);
        }
        req.flash('success_msg', 'Kelas berhasil diperbarui.');
        res.redirect('/dashboard/teacher');
      });
    });
  },
  delete: (req, res) => {
    const id = req.params.id;
    Course.isOwner(id, req.session.user.id, (err, course) => {
      if (!course) {
        req.flash('error_msg', 'Kelas tidak ditemukan atau Anda bukan pemilik.');
        return res.redirect('/dashboard/teacher');
      }
      Course.delete(id, (err) => {
        if (err) {
          req.flash('error_msg', 'Gagal menghapus kelas.');
          return res.redirect('/dashboard/teacher');
        }
        req.flash('success_msg', 'Kelas berhasil dihapus.');
        res.redirect('/dashboard/teacher');
      });
    });
  },
  show: (req, res) => {
    const id = req.params.id;
    Course.findById(id, (err, course) => {
      if (!course) {
        req.flash('error_msg', 'Kelas tidak ditemukan.');
        return res.redirect('/courses');
      }
      Enrollment.countByCourse(id, (err, count) => {
        Enrollment.findStudentsByCourse(id, (err, students) => {
          let enrolled = false;
          if (req.session.user && req.session.user.role === 'student') {
            Enrollment.isEnrolled(req.session.user.id, id, (err, enrollment) => {
              enrolled = !!enrollment;
              res.render('courses/show', {
                course,
                studentCount: count ? count.total : 0,
                students,
                enrolled,
                isStudent: true
              });
            });
          } else {
            res.render('courses/show', {
              course,
              studentCount: count ? count.total : 0,
              students,
              enrolled: false,
              isStudent: false
            });
          }
        });
      });
    });
  }
};

module.exports = courseController;

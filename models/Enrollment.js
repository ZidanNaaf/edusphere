const db = require('../config/db');

const Enrollment = {
  enroll: (studentId, courseId, callback) => {
    db.run(
      'INSERT INTO enrollments (student_id, course_id) VALUES (?, ?)',
      [studentId, courseId],
      function(err) {
        callback(err, this);
      }
    );
  },
  findByStudent: (studentId, callback) => {
    db.all(`SELECT c.*, u.name as teacher_name FROM enrollments e JOIN courses c ON e.course_id = c.id JOIN users u ON c.teacher_id = u.id WHERE e.student_id = ? ORDER BY e.enrolled_at DESC`, [studentId], callback);
  },
  isEnrolled: (studentId, courseId, callback) => {
    db.get('SELECT * FROM enrollments WHERE student_id = ? AND course_id = ?', [studentId, courseId], callback);
  },
  findStudentsByCourse: (courseId, callback) => {
    db.all(`SELECT u.name, u.email, e.enrolled_at FROM enrollments e JOIN users u ON e.student_id = u.id WHERE e.course_id = ? ORDER BY e.enrolled_at DESC`, [courseId], callback);
  },
  countByCourse: (courseId, callback) => {
    db.get('SELECT COUNT(*) as total FROM enrollments WHERE course_id = ?', [courseId], callback);
  }
};

module.exports = Enrollment;

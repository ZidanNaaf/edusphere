const db = require('../config/db');

const Course = {
  create: (title, description, teacherId, callback) => {
    db.run(
      'INSERT INTO courses (title, description, teacher_id) VALUES (?, ?, ?)',
      [title, description, teacherId],
      function(err) {
        callback(err, this);
      }
    );
  },
  findAll: (callback) => {
    db.all(`SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id ORDER BY c.created_at DESC`, callback);
  },
  findById: (id, callback) => {
    db.get(`SELECT c.*, u.name as teacher_name FROM courses c JOIN users u ON c.teacher_id = u.id WHERE c.id = ?`, [id], callback);
  },
  findByTeacher: (teacherId, callback) => {
    db.all('SELECT * FROM courses WHERE teacher_id = ? ORDER BY created_at DESC', [teacherId], callback);
  },
  update: (id, title, description, callback) => {
    db.run('UPDATE courses SET title = ?, description = ? WHERE id = ?', [title, description, id], function(err) {
      callback(err, this);
    });
  },
  delete: (id, callback) => {
    db.run('DELETE FROM courses WHERE id = ?', [id], function(err) {
      callback(err, this);
    });
  },
  isOwner: (courseId, teacherId, callback) => {
    db.get('SELECT * FROM courses WHERE id = ? AND teacher_id = ?', [courseId, teacherId], callback);
  }
};

module.exports = Course;

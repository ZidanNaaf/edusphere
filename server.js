const express = require('express');
const path = require('path');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');

const db = require('./config/db');
const initDatabase = require('./database/init');

const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const enrollmentRoutes = require('./routes/enrollmentRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

initDatabase();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride('_method'));
app.use(session({
  secret: process.env.SESSION_SECRET || 'edusphere-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 24 * 60 * 60 * 1000 }
}));
app.use(flash());

app.use((req, res, next) => {
  res.locals.user = req.session.user || null;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

app.use('/', authRoutes);
app.use('/courses', courseRoutes);
app.use('/enrollments', enrollmentRoutes);

app.get('/', (req, res) => {
  if (req.session.user) {
    return res.redirect(req.session.user.role === 'teacher' ? '/dashboard/teacher' : '/dashboard/student');
  }
  res.redirect('/login');
});

app.listen(PORT, () => {
  console.log(`EduSphere Server berjalan di http://localhost:${PORT}`);
  console.log('Tekan Ctrl + C untuk mematikan server.');
});

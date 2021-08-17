const router = require('express').Router();

router.get('/hello', (req, res) => {
  res.render('hello', {
    title: 'Hello World',
  });
});

router.get('/', (req, res) => {
  res.render('home', {
    title: 'Home',
  });
});

router.get('/login', (req, res) => {
  res.render('login', {
    title: 'Login',
  });
});

router.get('/register', (req, res) => {
  res.render('register', {
    title: 'Create New Account',
  });
});

module.exports = router;

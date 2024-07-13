const express = require('express');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(session({
    secret: 'secret-key',
    resave: false,
    saveUninitialized: true
}));

// View Engine
app.set('view engine', 'ejs');
app.use(express.static('views'));

// Predefined Username and Password
const predefinedUser = {
    username: 'user1',
    password: 'password123'
};

// Routes
app.get('/', (req, res) => {
    res.set('Cache-Control', 'no-store');
    if (req.session.loggedin) {
        res.redirect('/home');
    } else {
        res.render('login', { message: '' });
    }
});

app.post('/auth', (req, res) => {
    const { username, password } = req.body;
    if (username === predefinedUser.username && password === predefinedUser.password) {
        req.session.loggedin = true;
        req.session.username = username;
        res.redirect('/home');
    } else {
        res.render('login', { message: 'Incorrect Username or Password!' });
    }
});

app.get('/home', (req, res) => {
    if (req.session.loggedin) {
        res.set('Cache-Control', 'no-store');
        res.render('home', { username: req.session.username });
    } else {
        res.redirect('/');
    }
});


app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/home');
        }
        res.redirect('/');
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

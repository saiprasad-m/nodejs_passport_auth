const express = require('express');

const router = express.Router();
const {ensureAuthenticated} = require('../config/auth')
router.get('/', (req, res) => res.render('welcome'));
router.get('/dashboard', ensureAuthenticated, (req, res) => {
    if(req.user) {
        res.render('dashboard', {
            name: req.user.name
        });
    }
    else {
        res.render('login');
    }
    }
);

module.exports = router;
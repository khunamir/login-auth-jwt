const router = require('express').Router();
const verify = require('./verifyToken');

router.get('/', verify, (req, res) => {
    res.json({
        post: {
            title: 'Hello World', 
            description: 'how are you doing'
        }
    });
});

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const UserController = require("../controllers/user");

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './api/public/Profiles/');
    },
    filename: function(req, file, cb){
        cb(null,(new Date()).getTime() + file.originalname);
    }
});
const fileFilter = (req, file, cb) =>{
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null, true); //Save the file
    } else {
        cb(null, false); // Reject the file
    }
};
const upload = multer({storage: storage,limits: {
    fileSize: 1024 * 1024 *10 
    },
    fileFilter: fileFilter
});


router.get('/details/:email', UserController.user_get_details);

router.get('/signup',UserController.user_get_signup);

router.post('/signup',upload.single('photo'), UserController.user_post_signup);

router.get('/login',UserController.user_get_login);

router.post('/login',UserController.user_post_login);

router.delete('/:userId', checkAuth, UserController.user_delete);

module.exports = router;
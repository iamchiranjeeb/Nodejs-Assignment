const express = require('express')
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getSignupPage,
    userSignup,
    getLoginPage,
    userLogin,
    getUserDetails,
    getPasswordUpdatePage,
    updatePassword,
    getUserUpdateDetailsPage,
    updateUserDetails,
    deleteUser,
    logOut,
    logOutAll
} = require('../controllers/user')

/**
 * @desc To Create User
 */
router.get("/register",getSignupPage);

router.post('/register',userSignup);

/**
 * @desc User Login
*/
router.get("/login",getLoginPage);

router.post("/login",userLogin);

/**
 * @desc User Details
*/
router.get("/user",auth,getUserDetails)

/**
 * @desc To Update User Details
*/
router.get('/update/details',auth,getUserUpdateDetailsPage)

router.post('/update/details',auth,updateUserDetails)

/**
 * @desc To Update User Password
*/
router.get('/update/password',auth,getPasswordUpdatePage)

router.post('/update/password',auth,updatePassword)

/**
 * @desc To Delete User
*/
router.get("/delete/user",auth,deleteUser);

/**
 * @desc To Logout From Single Device
*/
router.get("/logout",auth,logOut);

/**
 * @desc To Logout From All Devices
*/
router.get("/logoutall",auth,logOutAll);

module.exports = router
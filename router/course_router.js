const express = require('express');
const User = require('../model/user');
const shelljs = require('shelljs');
const Student = require('../model/student');
const Payment = require('../model/payment');
const Enroll = require('../model/enroll');
const EducationYear = require('../model/educationYear');
const bcrypt = require('bcrypt');
const News = require('../model/news');
const uniqid = require('uniqid');
const auth = require('../middleWare/auth');
const upload = require('../middleWare/upload');
const PreEnroll = require('../model/preEnroll');
const TrezSmsClient = require("trez-sms-client");
const AboutUs = require('../model/aboutUs');
const TeamMembers = require('../model/teamMembers');
const Teacher = require('../model/teacher');
const Course = require('../model/course')
const path = require('path');
const persianDate = require('persian-date');
const router = new express.Router();

let bodyParser = require('body-parser');

router.use(express.json());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
//-----------add new teacher -----------------------
router.post('/admin/addCourse', auth, async (req, res) => {
    const course = new Course({
        name: req.body.name, 
        grade: req.body.grade, 
    });
    await course.save();
    res.send('saved');
});
module.exports = router;
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
 
const path = require('path');
const persianDate = require('persian-date');
const router = new express.Router();

let bodyParser = require('body-parser');

router.use(express.json());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())

//--------------------------*******************----------
router.post('/admin/addNewYear', auth, async (req, res) => {
    const educationYear = new EducationYear({
        year: req.body.year,
        tuition: req.body.tuition,
        isActive: req.body.isActive
    });
    await educationYear.save();
    res.send('saved');
})
//--------------------------------
router.get('/admin/educationYear', auth, async (req, res) => {
    const items = await EducationYear.find();
    res.send(items);
})
//------------------------delete educationYear line(item)---------------
router.post('/admin/delEducationYear/', auth, async (req, res) => {
    const _id = req.query.id;
    const item = await EducationYear.findByIdAndDelete(_id);
    res.send('deleted');
})
//------------------------remove educationYears ---------------
router.post('/admin/removeEducationYear', auth, async (req, res) => {
    const educations = req.body.data;
    educations.forEach(async el=>{
        const teamMem = await EducationYear.findByIdAndDelete({_id: el.id});
    })
      res.send('removed');
  });

//-------------------- get educationYear item by id ------------------------
router.get('/admin/getEducationYear/', auth, async (req, res) => {
    const id = req.query.id;
    const item = await EducationYear.findById(id);
    res.send(item);
})
//-------------------- get educationYears for admin charts ------------------------
router.get('/admin/getEducationYears/', auth, async (req, res) => {
    const item = await EducationYear.find();
    res.send(item);
})
//--------------------- update educationYear ---------------------
router.patch('/admin/updateEducationYear/', auth, async (req, res) => {
  
    const _id = req.query.id;
    const changes = {
        year: req.body.year,
        tuition: req.body.tuition,
        isActive: req.body.isActive
    }
    if (req.body.isActive){
        const activeYear = await EducationYear.findOne({isActive: true});
        if (activeYear) return res.send('exist')
    }
    const item = await EducationYear.findByIdAndUpdate(_id, changes, {new: true});
    res.send(item);
})
module.exports = router;
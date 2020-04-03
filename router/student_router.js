const express = require('express');
const stAuth = require('../middleWare/stAuth')
const stAuthUpload = require('../middleWare/stAuthUpload')
const studentPaymentUpload = require('../middleWare/studentPaymentUpload');
const shelljs = require('shelljs')
const path = require('path');
const studentDocsUpload = require('../middleWare/studentDocsUpload');
const Student = require('../model/student');
const EducationYear = require('../model/educationYear')
const PreEnroll = require('../model/preEnroll');
const Enroll = require('../model/enroll');
const Question = require('../model/question');
const Course = require('../model/course');
const Payment = require('../model/payment');
const persianDate = require('persian-date');
const router = new express.Router();
let bodyParser = require('body-parser');

router.use(express.json());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
//------------------show register page--------------------
router.get('/register', async(req, res)=>{
    res.render('preEnroll');
})

//------------------------student login page---------------------

router.get('/student/login', (req, res) => {
    res.render('studentLogin')
})
//-----------------student check login -------------------------
router.post('/student/login', async (req, res) => {
    try{
        const student = await Student.findByUser(req.body.username, req.body.password);
        const token = await student.generateAuthToken();  
        res.send({token, find: true}); 
    }
    catch(e){
        res.send({find: false});
    }
})

//---------------------stdent home page ----------------------
router.get('/student/home', (req, res) => {
    
    res.render('studentHome')
})    

//-------------------- get student ---------------------

router.get('/student/getStudent', stAuth, async (req, res) => {
    const student = await Student.findById(req.student._id)
    const year = await Enroll.find({studentID: req.student.nationalID})
    const result = {
        student,
        year
    }    
    res.send(result)
})    


//-------------------logout student----------------------

router.get('/student/logout', stAuth, async (req, res) => {
    req.student.tokens = [];
    await req.student.save();
    res.send({logout: true});
})    
//---------------upload profile --------------------------
var cpUpload = studentDocsUpload.fields([{ name: 'picture', maxCount: 1 }, { name: 'passport', maxCount: 1 },{ name: 'nationalIDPic', maxCount: 1 } ])
router.post('/student/uploadProfile', stAuthUpload, cpUpload, async(req, res)=>{
    
    req.student.firstName = req.body.firstName;
    req.student.lastName = req.body.lastName;
    req.student.nationalID = req.body.nationalID;
    req.student.mobileNumber = req.body.mobileNumber;
    req.student.parentName = req.body.parentName;
    req.student.address = req.body.address;
    req.student.yearOfBirth = req.body.yearOfBirth;
    req.student.zipCode = req.body.zipCode;

    req.student.pictureURL = req.files.picture[0].filename;
    req.student.passportURL = req.files.passport[0].filename;
    req.student.nationalIDURL = req.files.nationalIDPic[0].filename;
    req.student.status = 1;
     await req.student.save();
     const status = shelljs.mkdir(path.join(__dirname,`../public/img/docs/${req.body.nationalID}/payments`))

    res.send('saved'); 

})    

//---------------------students PreEnroll ----------------

router.post('/preEnroll', async (req, res) => {
    const data = req.body.data;
    const check = await PreEnroll.findOne({nationalID: data.nationalId});
    if (check) return res.send('repeat');
    const preEnroll = new PreEnroll({
        firstName: data.name,
        lastName: data.family,
        nationalID: data.nationalId,
        mobileNumber: data.mobile,
        lastSchool: data.lastSchool,
        fatherJob: data.fatherJob,
        fatherLicense: data.fatherLicense,
        motherJob: data.motherJob,
        level: data.level,
        motherLicense: data.motherLicense,
        childNum: data.childNum,
        isSacrifice: data.isSacrifice,
        lastYearMark: data.lastYearMark,
        status: 2
    });    
    const save = await preEnroll.save();
    if(save){
        res.send('saved')
    }    
})    
//------------------------ get current education year -----------------
router.get('/student/getEducationYear', stAuth, async (req, res)=>{
    const current = await EducationYear.find({isActive: true});
    if (current.length === 0) return res.send('error')
    const enroll = await Enroll.find({thisYear: current[0].year, studentID: req.student.nationalID})
    const result = {
        current
    }
    if (enroll[0]) {
        
        result.isEnrolled = true;
        result.grade = enroll[0].grade;
    }
    else {
        current.isEnrolled = false

    }
    
    res.send(result);
})
//------------------------ set student grade ---------------------
router.post('/student/setStudentGrade', stAuth, async (req, res)=>{
    const data = req.body;

    const enroll = new Enroll({
        studentID: data.studentID,
        thisYear: data.thisYear,
        grade: data.grade
    })
    await enroll.save();
    res.send('saved');
})
//--------------------- student payment ----------------------
router.post('/student/payment', stAuthUpload, studentPaymentUpload.single('image'), async (req, res)=>{
    let payment = req.body;
    let newData = {
        studentID: payment.studentID,
        thisYear: payment.currentYear,
        bill: payment.bill,
        billUrl: req.file.filename,
        paymentType: 'کارت به کارت',
        isDiscount: false,
        approve: false,
        payDate: new persianDate().format()
        };
    const newPayment = new Payment(newData);
    await newPayment.save()
    res.send('saved');
} )
// --------------------------- payments per student ------------------------
router.get('/student/getPayments', stAuth, async (req, res)=>{
    const ID = req.student.nationalID;
    const student = await Student.findOne({nationalID: ID}); 
    await student.populate('payments').execPopulate()
    const year = await EducationYear.findOne({isActive: true});
    const currentStudent = student.payments;
    const data = {
        currentStudent,
        year
    }
    res.send(data);

})
//--------------------- student change password ----------------------
router.post('/student/changePassword', stAuth, async (req, res)=>{
    const data = req.body;
    const result = await Student.findByUserforChangePass(req.student.userName, data.formValues[0])
    if (result){
        req.student.password = data.formValues[1];
        await req.student.save();
        res.send('changed')
    }
    else{

        res.send('error');
    }
})
//--------------------- student forget password ----------------------
router.post('/student/forgetPassword',  async (req, res)=>{
    const data = req.body;
    const result = await Student.findOne({nationalID: data.formValues[0], mobileNumber: data.formValues[1]})
    if (result){
        result.password = result.yearOfBirth;
        await result.save();
        res.send('changed')
    }
    else{

        res.send('error');
    }
})
//-------------------- student courses in this year ----------------
router.get('/student/getCourses', stAuth, async (req, res)=>{
    const currentYear = await EducationYear.findOne({isActive: true});
    const grade = await Enroll.findOne({thisYear: currentYear.year, studentID: req.student.nationalID});
    if (!grade)
        return res.send('not found');
    const courses = await Course.find({grade: grade.grade});
    res.send(courses);
})
//-------------------- get questions of selected course in this year ----------------
router.post('/student/getCoursesQuestion', stAuth, async (req, res)=>{
    const questions = await Question.find({courseID: req.body.courseID, shairing: true});
    if (!questions)
        return res.send('not found');
    res.send(questions);
})
module.exports = router;
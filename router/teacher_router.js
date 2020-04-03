const express = require('express');
const User = require('../model/user');
const shelljs = require('shelljs');
const Student = require('../model/student');
const Payment = require('../model/payment');
const Enroll = require('../model/enroll');
const EducationYear = require('../model/educationYear');
const bcrypt = require('bcrypt');
const News = require('../model/news');
const Question = require('../model/question');
const uniqid = require('uniqid');
const auth = require('../middleWare/auth');
const teacherAuth = require('../middleWare/teacherAuth');
const upload = require('../middleWare/upload');
const PreEnroll = require('../model/preEnroll');
const TrezSmsClient = require("trez-sms-client");
const AboutUs = require('../model/aboutUs');
const TeamMembers = require('../model/teamMembers');
const Teacher = require('../model/teacher');
const Course = require('../model/course')
const TeacherCourse = require('../model/teacherCourse')
const path = require('path');
const persianDate = require('persian-date');
const router = new express.Router();

let bodyParser = require('body-parser');

router.use(express.json());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
//------------------------teacher login page---------------------

router.get('/teacher/login', (req, res) => {
    res.render('teacherLogin')
})
//-----------------teacher check login -------------------------
router.post('/teacher/login', async (req, res) => {
    try{
        const teacher = await Teacher.findByUser(req.body.username, req.body.password);
        const token = await teacher.generateAuthToken();  
        res.send({token, find: true}); 
    }
    catch(e){
        res.send({find: false});
    }
})
//---------------------teacher home page ----------------------
router.get('/teacher/home', (req, res) => {
    
    res.render('teacherHome')
})  
//-------------------logout teacher----------------------

router.get('/teacher/logout', teacherAuth, async (req, res) => {
    req.teacher.tokens = [];
    await req.teacher.save();
    res.send({logout: true});
}) 
//-------------------get teacher information ----------------------

router.get('/teacher/getInfo', teacherAuth, async (req, res) => {
    const year = await EducationYear.findOne({isActive: true});
    const myCourse = await TeacherCourse.find({educationYearID: year._id, teacherID: req.teacher._id});
    const courses = await Course.find({});
    let teacherCourses = []
    let teacherCourse = []
    myCourse.forEach(el=>{
        teacherCourse.push(el.courseID)
    })
    const data = {
        teacher: req.teacher,
        teacherCourse,
        courses
    }
    res.send(data);
}) 
//--------------------- teacher forget password ----------------------
router.post('/teacher/forgetPassword',  async (req, res)=>{
    const data = req.body;
    const result = await Teacher.findOne({nationalID: data.formValues[0], mobileNumber: data.formValues[1]})
    const newPass = uniqid();
    if (result){
        result.password = newPass;
        await result.save();
        res.send(newPass)
    }
    else{

        res.send('error');
    }
})
//-------------------------------------
router.post('/admin/getTeacherInfo', auth, async(req, res) => {
    const id = req.body.id;
    const teacher = await Teacher.findById(id);
    const course = await Course.find({});
    const educationYear = await EducationYear.findOne({isActive: true});
    const teacherCourse = await TeacherCourse.find({teacherID: teacher._id})
    let teacherCourses = []
    teacherCourse.forEach(el=>{
        teacherCourses.push(el.courseID)
    })
    const data = {
        teacher,
        course,
        educationYear,
        teacherCourses
    }
    res.send(data)
})
//-------------------------------------
router.post('/admin/getCourses', auth, async(req, res) => {
    const grade = req.body.grade;
    const course = await Course.find({grade: grade});
    
    const data = {
        course
        
    }
    res.send(data)
})
//--------------------assign course to teacher -----------------
router.post('/admin/assignCourseToTeacher', auth, async(req, res) => {
    const teacherID = req.body.teacherID;
    const educationYearID = req.body.educationYearID;
    let add;
    req.body.courseID.forEach(async el => {
        add = new TeacherCourse({
            teacherID,
            courseID: el,
            educationYearID
        });
        await add.save();
    });
    res.send('saved');
})

//------------------ delete teacher's courses -----------------------------
router.post('/admin/deleteTeacherCourse', auth, async(req, res) => {
    const teacherID = req.body.teacherID;
    
    req.body.courseID.forEach(async el => {
        await TeacherCourse.deleteOne({
             teacherID,
            courseID: el
        });
    });
    
    res.send('deleted');
})
//-----------add new teacher -----------------------
router.post('/admin/addNewTeacher', auth, upload.single('image'), async (req, res) => {
    const teacher = new Teacher({
        firstName: req.body.firstName, 
        lastName: req.body.lastName, 
        nationalID: req.body.nationalID, 
        mobileNumber: req.body.mobileNumber,
        userName: req.body.nationalID,
        password: req.body.nationalID,
    });
    if (req.file){
        let status =  shelljs.mkdir(path.join(__dirname,`../public/img/teachers/${req.body.nationalID}`))
        status =  shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/teachers/${req.body.nationalID}/`));
        teacher.profileImageUrl = req.file.filename;
    }

    await teacher.save();
    res.send('saved');
});

//----------------------custom search to get teacess--------------------------------------

router.post('/admin/getTeachers', auth, async(req, res) => {
    const title = req.body.title;
    const select = req.body.select;
    const limit = req.body.limit;
    const skip = req.body.skip;
    const titleReg = new RegExp(`${title}`, "g");
    let teacher;
    switch (select){
        case 'nationalID':
            teacher = await Teacher.find({nationalID: titleReg},{},{skip, limit, sort:{createdAt: -1}});
            break;
        case 'lastName':
            teacher = await Teacher.find({lastName: titleReg},{},{skip, limit, sort:{createdAt: -1}});
            break;
        case '':
            teacher = await Teacher.find({},{},{ skip, limit, sort:{createdAt: -1}});
            break;
    }
    const teacherCount =  await Teacher.find();     
    const data ={
        len: teacherCount.length,
        teacher
    }
    res.send(data)
})

//----------------- change teacher password -------------------------
router.post('/admin/changeTeacherPassword', auth, async (req, res) => {
    const data = req.body;
    const result = await Teacher.findById(data.id)
    if (result){
        result.password = data.formValues[1];
        await result.save();
        res.send('changed')
    }
    else{
        res.send('error');
    }
})
//--------------------- change teacher profile ----------------------
router.post('/teacher/changePRofileImage', teacherAuth, upload.single('image'), async (req, res)=>{
    let status
    if (req.teacher.profileImageUrl){
        status =  shelljs.rm(path.join(__dirname,`../public/img/teachers/${req.teacher.nationalID}/${req.teacher.profileImageUrl}`));

    }
    else {

        let status =  shelljs.mkdir(path.join(__dirname,`../public/img/teachers/${req.teacher.nationalID}`))
    }
    if (req.file){
        status =  shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/teachers/${req.teacher.nationalID}/`));
        req.teacher.profileImageUrl = req.file.filename;
    }
    await req.teacher.save();
    res.send(req.teacher);
} )
//--------------------- teacher change password ----------------------
router.post('/teacher/changePassword', teacherAuth, async (req, res)=>{
    const data = req.body;
    const result = await Teacher.findByUserforChangePass(req.teacher.userName, data.formValues[0])
    if (result){
        req.teacher.password = data.formValues[1];
        await req.teacher.save();
        res.send('changed')
    }
    else{

        res.send('error');
    }
})
//---------------- get teacher courses ---------------------
router.post('/teacher/getTeacherCourses', teacherAuth, async(req, res) => {
    const course = await Course.find({});
    const educationYear = await EducationYear.findOne({isActive: true});
    const result = await TeacherCourse.find({teacherID: req.teacher._id})
    let teacherCourse = []
    result.forEach(el=>{
        teacherCourse.push(el.courseID)
    })
    const data = {
        course,
        educationYear,
        teacherCourse
    }
    res.send(data)
})
//---------------- add question ---------------------
router.post('/teacher/addQuestion', teacherAuth, async(req, res) => {
    let question;
    if (req.body.type === '1'){
        question = new Question({
            questionTitle: req.body.question,
            questionType: req.body.type,
            discriptive: req.body.desciptive,
            difficulty: req.body.difficulty,
            courseID: req.body.courseID,
            teacherID: req.teacher._id

        })

    }else if (req.body.type === '2'){
        question = new Question({
            questionTitle: req.body.question,
            questionType: req.body.type,
            difficulty: req.body.difficulty,
            courseID: req.body.courseID,
            teacherID: req.teacher._id
        })
        question. multipleChoice.push({
            choice1: req.body.choice1,
            choice2: req.body.choice2,
            choice3: req.body.choice3,
            choice4: req.body.choice4,
            answer: req.body.multiChoiceAnswer
        })

    }else{
        question = new Question({
            questionTitle: req.body.question,
            questionType: req.body.type,
            yesNoQuestion: req.body.yesNoAnswer,
            difficulty: req.body.difficulty,
            courseID: req.body.courseID,
            teacherID: req.teacher._id
        })

    }
    question.shairing = false;
    await question.save();
    res.send('saved');
})
//------------------- get questions per course and teacher ------------------
router.post('/teacher/getCourseQuestion', teacherAuth, async(req, res) => {
    const courseID = req.body.courseID;
    const teacherID = req.teacher._id;
    const questions = await Question.find({teacherID, courseID});
    res.send(questions)
})
//------------------- publish or unPublish questions  ------------------
router.post('/teacher/publishQuestions', teacherAuth, async(req, res) => {
    const questionID = req.body.questionID;
    let question;
    questionID.forEach(async el=>{
        question = await Question.findById(el);
        if (req.body.id === 'pub')
            question.shairing = true;
        else
            question.shairing = false;
        await question.save();
    })
    if (id === 'pub')
        res.send('pub');
    else
        res.send('unpub')
})
//------------------- delete questions  ------------------
router.post('/teacher/deleteQuestions', teacherAuth, async(req, res) => {
    const questionID = req.body.questionID;
    let question;
    questionID.forEach(async el=>{
        question = await Question.findByIdAndDelete(el);
    })
    res.send('saved');
})
//------------------- get question  ------------------
router.post('/teacher/getQuestion', teacherAuth, async(req, res) => {
    const questionID = req.body.questionID;
    let question;
        question = await Question.findById(questionID);
    res.send(question);
})
//---------------- update question ---------------------
router.post('/teacher/editQuestion', teacherAuth, async(req, res) => {
    let question;
    console.log(req.body.questionID)
    const q = await Question.findById(req.body.questionID);
    if (req.body.type === '1'){
        question = new Question({
            questionTitle: req.body.question,
            questionType: req.body.type,
            discriptive: req.body.desciptive,
            difficulty: req.body.difficulty,
            courseID: q.courseID,
            teacherID: req.teacher._id

        })

    }else if (req.body.type === '2'){
        question = new Question({
            questionTitle: req.body.question,
            questionType: req.body.type,
            difficulty: req.body.difficulty,
            courseID: q.courseID,
            teacherID: req.teacher._id
        })
        question. multipleChoice.push({
            choice1: req.body.choice1,
            choice2: req.body.choice2,
            choice3: req.body.choice3,
            choice4: req.body.choice4,
            answer: req.body.multiChoiceAnswer
        })

    }else{
        question = new Question({
            questionTitle: req.body.question,
            questionType: req.body.type,
            yesNoQuestion: req.body.yesNoAnswer,
            difficulty: req.body.difficulty,
            courseID: q.courseID,
            teacherID: req.teacher._id
        })

    }
    await Question.findByIdAndDelete(req.body.questionID);
    question.shairing = q.shairing;
    await question.save();
    res.send('saved');
})
module.exports = router;
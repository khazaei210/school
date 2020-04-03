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

//------------------------------------------------------
router.get('', async (req, res)=> {
    
    // const user = new User ({
    //     userName: 'admin',
    //     password: '123',
    //     nationalID: '3521350861',
    //     mobileNumber: '09179299474'
    // })
    // await user.save();
    res.render('main');
});
//------------------show news in index page--------------------
router.get('/news/getNews', async (req, res) => {
    const news = await News.find();
    
    res.send(news);
});


//------------show one news description by id---------------
router.get('/news/more/', async (req, res) => {
    const _id = req.query.id;
    const news = await News.findById(_id);
    res.send(news);
});
//------------------------------------------------------
router.get('/admin/login',  (req, res) => {
     res.render('adminLogin')
});
//------------------------------------------------------
router.get('/admin/checkLogin', auth, (req, res) => {
    res.render('admin')
});
//------------------------------------------------------
router.post('/admin/login', async (req, res)=>{
    let user;
    try{
        user = await User.findByUser(req.body.username, req.body.password);
        
        const token = await user.generateAuthToken();
        
        res.send({token, find: true});
        
    }catch(e){
        
        res.send({find: false});
    }
})
//------------------------------------------------------
router.get('/admin/news', auth, async (req,res)=>{
    
    const news = await News.find({});
    res.send(news);
})
//------------------------------------------------------
router.get('/admin', async (req, res) => {
    res.render('adminHome');
   
});
//------------------------------------------------------

router.post('/admin/addNews', auth, upload.single('image'), async (req, res) => {
    const createDate = new persianDate(Date.now()).format();
    const news = new News({
        title: req.body.title, 
        fullDescription: req.body.fullDescription, 
        shortDescription: req.body.shortDescription, 
         
        createDate,
        expireDate: req.body.expireDate,
        isPublish: req.body.isPublish

    });
    if (req.file){
        const status = shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/news`));
        news.image = req.file.filename;
    }

    await news.save();
    res.send('saved');
});
//------------------------------------------------------
router.post('/admin/removeNews', auth, async (req, res) => {
    const news = req.body.data;
    news.forEach(async el=>{
        const news = await News.findById(el.id);
        const status = shelljs.rm(path.join(__dirname,`../public/img/news/${news.image}`))
        await News.findByIdAndDelete({_id: el.id});
    })
    res.send('removed');
});
//------------------------------------------------------
router.get('/admin/getNews/', auth, async (req, res)=>{
    const _id = req.query.id;
    const news = await News.findById(_id);
    res.send(news);
})
//------------------------------------------------------
router.post('/admin/getNews', auth, async (req, res)=>{
    const title1 = req.body;
    
    const reg = new RegExp(`${title1.title}`, "g");
    const news = await News.find({title: reg});
    res.send(news)
})
//------------------------------------------------------
router.patch('/admin/updateNews', auth, upload.single('image'), async (req, res)=>{
    let news = req.body;
    let newData = {title: news.title,
        shortDescription: news.shortDescription,
        fullDescription: news.fullDescription,
        expireDate: news.expireDate,
        isPublish: news.isPublish
        };
    if (req.file){
        newData.image = req.file.filename;
        news = await News.findById(news._id);
        const status = shelljs.rm(path.join(__dirname,`../public/img/news/${news.image}`))
        const status1 = shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/news`));

    }
    try{
        news = await News.findByIdAndUpdate(news._id, newData, {new: true});

    }catch(e){console.log(e)}
    res.send(news)
})
//------------------------------------------------------
router.post('/admin/logout', auth, async (req, res)=>{
    req.user.tokens = [];
    await req.user.save();
    res.send({login: true});
})

//------------------get preEnroll students--------------------
router.get('/admin/getEnrolledStudent', auth, async (req, res) => {
    const preEnroll = await PreEnroll.find();
    
    res.send(preEnroll);
});
//------------------------------------------------------
router.get('/admin/getEnrolled/', auth, async (req, res)=>{
    const _id = req.query.id;
    const preEnroll = await PreEnroll.findById(_id);
    res.send(preEnroll);
})
//------------------------------------------------------
router.patch('/admin/changeStatus', auth , async (req, res)=>{
    let preEnroll;
    const _id = req.body._id;
    const newstatus = {status: req.body.status} ;
    try{
        preEnroll = await PreEnroll.findByIdAndUpdate(_id, newstatus, {new: true});
        if (preEnroll.status === 1){
            // const client = new TrezSmsClient("khazaei210", "asad3521350861");
            // client.sendMessage('50002210003000', [`${preEnroll.mobileNumber}`], `خانم/آقای ${preEnroll.lastName} با درخواست ثبت نام شما در دبستان سینا موافقت گردید لطفا جهت نهایی شدن ثبت نام؛ شهریه را پرداخت کنید`, `${uniqid()}`)
            // .then((receipt) => {
            //     console.log("Receipt: " + receipt);
            // })
            // .catch((error) => {
            //     // If there is an error, we'll catch that
            //     console.log(error.isHttpException, error.code, error.message);
            // });
            let student = await Student.find({nationalID: preEnroll.nationalID});
            if(!student[0]){
                student = new Student({
                    firstName: preEnroll.firstName,
                    lastName: preEnroll.lastName,
                    nationalID: preEnroll.nationalID,
                    mobileNumber: preEnroll.mobileNumber,
                    userName: preEnroll.nationalID,
                    password: preEnroll.nationalID,
                    status: '0'
                })
                await student.save();   
            }
        }
        // if (preEnroll.status === 0){
        //     const client = new TrezSmsClient("khazaei210", "asad3521350861");
        //     client.sendMessage('50002210003000', [`${preEnroll.mobileNumber}`], `خانم/آقای ${preEnroll.lastName} با درخواست ثبت نام شما در مدرسه سینا موافقت نشد`, `${uniqid()}`)
        //     .then((receipt) => {
        //         console.log("Receipt: " + receipt);
        //     })
        //     .catch((error) => {
        //         // If there is an error, we'll catch that
        //         console.log(error.isHttpException, error.code, error.message);
        //     });

        // }
    }catch(e){console.log(e)}
    res.send(preEnroll)
})
//-------------------- get student list based on status ----------------------------------
router.post('/admin/getList', auth, async (req, res) => {
    let studentsList
    if (req.body.status === 'all'){
        studentsList = await PreEnroll.find();
    }else
    studentsList = await PreEnroll.find({status: req.body.status}); 
    res.send(studentsList);
})

//-----------------delete student ---------------------
router.post('/admin/delStudent', auth, async (req, res) => {
    const deletedSt = await PreEnroll.findByIdAndDelete(req.body._id);
    res.send(deletedSt)
})

//-------------------------------------------------------
//--------------------------------------------
//??????????????????????????name of route
router.get('/admin/getNumber', auth, async(req, res) => {
    const st = await PreEnroll.find({status: 2});
    res.send(st);
})

//------------------------------------------------------------

router.post('/admin/searchStudent', auth, async(req, res) => {
    const lastName = req.body.lastName;

    const lastReg = new RegExp(`${lastName}`, "g");
     
     const student = await PreEnroll.find({lastName: lastReg});
     
     res.send(student)
})

//------------------------------------

router.get('/admin/getAcceptEnrollList', auth, async (req, res) => {
    
    const status = {status: '1'};
    const items = await Student.find(status);
    res.send(items);
    
})
//------------------------------------

router.get('/admin/getAcceptEnrolled/', auth, async (req, res)=>{
    const _id = req.query.id;
    const item = await Student.findById(_id);
    
    res.send(item);
})
//------------------------------------

router.patch('/admin/finalEnroll/', auth, async (req, res)=>{
    const _id = req.query.id;
    const item = await Student.findByIdAndUpdate(_id, {status: 2}, {new: true});
    res.send(item);
})


//----------------------- get waiting approve list ------------------
router.get('/admin/getWaitingApprove', auth, async (req, res)=>{
    const payments = await Payment.find({approve: false});
    res.send(payments)
})

//--------------------- change admin password route --------------------
router.post('/admin/changePassword', auth, async (req, res)=>{
    const data = req.body;
    console.log(req.user)
    const result = await User.findByUserforChangePass(req.user.userName, data.formValues[0])
    console.log( result)
    if (result){
        req.user.password = data.formValues[1];
        await req.user.save();
        res.send('changed')
    }
    else{

        res.send('error');
    }
})
//-------------------delete one news by id -----------------
router.post('/admin/deleteNews/', auth, async (req, res) => {
    const _id = req.query.id;
    const news = await News.findById(_id);
    const status = shelljs.rm(path.join(__dirname,`../public/img/news/${news.image}`))
    const item = await News.findByIdAndDelete(_id);
    res.send('deleted');
  })
//--------------------- admin forget password ----------------------
router.post('/admin/forgetPassword',  async (req, res)=>{
    const data = req.body;
    const result = await User.findOne({nationalID: data.formValues[0], mobileNumber: data.formValues[1]})
    let newPass;
    if (result){
        newPass = uniqid().substring(0,5);
        result.password = newPass;
        await result.save();
        // const client = new TrezSmsClient("khazaei210", "asad3521350861");
        //     client.sendMessage('50002210003000', [`${result.mobileNumber}`], `رمز عبور جدید شما ${newPass}  می باشد.`, `${uniqid()}` )
        //     .then((receipt) => {
        //         console.log("Receipt: " + receipt);
        //     })
        //     .catch((error) => {
        //         // If there is an error, we'll catch that
        //         console.log(error.isHttpException, error.code, error.message);
        //     });
        res.send('changed')
    }
    else{

        res.send('error');
    }
})
//----------------------custom search to get stdents--------------------------------------

router.post('/admin/getStudents', auth, async(req, res) => {
    const title = req.body.title;
    const select = req.body.select;
    const limit = req.body.limit;
    const skip = req.body.skip;
    const titleReg = new RegExp(`${title}`, "g");
    let student;
    switch (select){
        case 'nationalID':
            student = await Student.find({nationalID: titleReg},{},{skip, limit, sort:{createdAt: -1}});
            break;
        case 'lastName':
            student = await Student.find({lastName: titleReg},{},{skip, limit, sort:{createdAt: -1}});
            break;
        case 'mobileNumber':
            student = await Student.find({mobileNumber: titleReg},{},{skip, limit, sort:{createdAt: -1}});
            break;
        case '':
            student = await Student.find({},{},{ skip, limit, sort:{createdAt: -1}});
            break;
    }
    const studentCount =  await Student.find();     
    const data ={
        len: studentCount.length,
        student
    }
    res.send(data)
})
//-------------------- get compelte students information ------------------------
router.post('/admin/getStudentInfo', auth, async (req, res)=>{
    const _id = req.body.id;
    const student = await Student.findById(_id);
    const year = await Enroll.find({studentID: student.nationalID});
    await student.populate('payments').execPopulate()
    const currentYear = await EducationYear.findOne({isActive: true});
    const currentPayments = student.payments;
    const data = {
        student,
        year,
        currentPayments,
        currentYear
    }
    res.send(data);
})
//--------------------- admin payment ----------------------
router.post('/admin/adminPayment', auth, async (req, res)=>{
    let payment = req.body;
    let newData = {
        studentID: payment.studentID,
        thisYear: payment.year,
        bill: payment.cost,
        billUrl: '',
        paymentType: payment.paymentType,
        isDiscount: payment.isDiscount,
        approve: true,
        payDate: new persianDate().format()
        };
    const newPayment = new Payment(newData);
    await newPayment.save()
    const student = await Student.findOne({nationalID: newPayment.studentID})
    res.send(student);
} )
//--------------------- change student password bu admin route --------------------
router.post('/admin/changeStudentPassword', auth, async (req, res)=>{
    const data = req.body;
    const result = await Student.findById(data.id)
    if (result){
        result.password = data.formValues[1];
        await result.save();
        res.send('changed')
    }
    else{

        res.send('error');
    }
})
module.exports = router;
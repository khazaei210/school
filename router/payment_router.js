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
//---------------------------- get payments status for chart ----------------------------------
router.post('/admin/getPaymentStatus', auth, async (req, res)=> {
    var notPaid = 0; 
    var paid = 0; 
    var remain = 0;
    let year;
    if (req.body.thisYear === 'thisyear')
        year = await EducationYear.findOne({isActive: true});
    else
        year = await EducationYear.findOne({year: req.body.thisYear});
    if (!year) return res.send('error');
    const enrolls = await Enroll.find({thisYear: year.year});

    // let data =  enrolls.map(async (item)=>{
        for (let j=0; j<enrolls.length; j++){
        let student = await Student.findOne({nationalID: enrolls[j].studentID}); 
        await student.populate('payments').execPopulate()
        if (!student.payments[0]){

            notPaid  = notPaid + 1;
        }
        else {
            let sum = 0;
            for (let i=0; i<student.payments.length; i++){
            // student.payments.forEach(item=>{
                sum += student.payments[i].bill;
            }
            if (sum === year.tuition){

                paid = paid + 1;
            }
            else {

                remain = remain + 1;
            }
        }
        // return ({paid, notPaid, remain})
    }
    
    const data = {
        paid,
        notPaid,
        remain
    }
    res.send(data);
})
//-------------------- get total payments for chart -----------------------

router.post('/admin/getTotalPayments', auth, async (req, res) => {
    let year;
    if (req.body.thisYear === 'thisyear')
        year = await EducationYear.findOne({isActive: true});
    else
        year = await EducationYear.findOne({year: req.body.thisYear});
    if (!year) return res.send('error')
    const payments = await Payment.find({thisYear: year.year});
    const enroll = await Enroll.find({thisYear: year.year});
    let sum = 0;
    let discount = 0;
    if (payments.length === 0) return res.send('error')
    payments.forEach(el => {
        if (el.isDiscount)
            discount += el.bill
        else
            sum += el.bill;
    })
    const remain = (enroll.length  * year.tuition) - sum - discount;
    const data = {
        sum,
        remain,
        discount
    }
    res.send(data);
})
//--------------------- accept payment ------------------------------
router.get('/admin/acceptPayment', auth, async (req, res)=>{
    const _id = req.query.id;
    const status = {approve: true}
    const payment = await Payment.findByIdAndUpdate(_id, status, {new: true});
    const student = await Student.findOne({nationalID: payment.studentID});
    // const client = new TrezSmsClient("khazaei210", "asad3521350861");
    //         client.sendMessage('50002210003000', [`${student.mobileNumber}`], `خانم/آقای ${student.lastName}  پرداخت شما به مبلغ ${payment.bill} تایید شد.`, `${uniqid()}`)
    //         .then((receipt) => {
    //             console.log("Receipt: " + receipt);
    //         })
    //         .catch((error) => {
    //             // If there is an error, we'll catch that
    //             console.log(error.isHttpException, error.code, error.message);
    //         });
    res.send(payment);
})

//--------------------- get payment info ------------------------------
router.get('/admin/getPaymentInfo', auth, async (req, res)=>{
    const _id = req.query.id;
    const payment = await Payment.findById(_id);
    const student = await Student.findOne({nationalID: payment.studentID});
    const data ={
        payment,
        student
    }
    res.send(data);
})
//-------------------- get number of payments that are waiting for accept ----------------------
router.get('/admin/getPaymentNum', auth, async (req, res)=>{
    const payment = await Payment.find({approve: false});
    res.send(payment);

})

module.exports = router;
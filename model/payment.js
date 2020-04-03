const mongoose = require('mongoose');
const PaymentSchema = new mongoose.Schema({
    studentID: {
        type: String,
        ref: 'Student'
    },
    thisYear: {
        type: String,
        ref: 'EducationYear'
    },
    bill: {
        type: Number
    },
    billUrl: {
        type: String
    },
    paymentType:{
        type: String
    },
    isDiscount:{
        type: Boolean
    },
    approve: {
        type: Boolean
    },
    payDate: {
        type: String
    }
},
{
    timestamps: true
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
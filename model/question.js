const mongoose = require('mongoose');
const questionSchema = new mongoose.Schema({
    questionTitle: {
        type: String
    },
    questionType: {
        type: String
    },
    yesNoQuestion: {
        type: Boolean
    },
    multipleChoice: [{
        choice1: {
            type: String
        },
        choice2: {
            type: String
        },
        choice3: {
            type: String
        },
        choice4: {
            type: String
        },
        answer: {
            type: Number
        }
    }],
    discriptive: {
        type: String
    },
    difficulty: {
        type: String
    },
    courseID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course'
    },
    teacherID: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Teacher'
    },
    courseSection: {
        type: String
    },
    shairing: {
        type: Boolean
    }
},
    {
        timestamps: true
    }
);

const Question = mongoose.model('Question', questionSchema);
module.exports = Question;

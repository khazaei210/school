const express = require('express');
const path = require('path');

const hbs = require('hbs');
const newsRouter = require('../router/admin_router');
const studentRouter = require('../router/student_router')
const aboutUsRouter = require('../router/aboutUs_router')
const teamMembersRouter = require('../router/teamMembers_router')
const educationYearRouter = require('../router/educationYear_router')
const teacherRouter = require('../router/teacher_router')
const paymentRouter = require('../router/payment_router')
const courseRouter = require('../router/course_router')
require('../mongoose/connectDB');
const publicDirectoryPath = path.join(__dirname, '../public');

const partials = path.join(__dirname, './template/partials');
const viewPath = path.join(__dirname, '../template/views');
hbs.registerPartials(partials);
const port = process.env.PORT;

const app = express();
app.use(express.static(publicDirectoryPath));
app.use(courseRouter);
app.use(newsRouter);
app.use(studentRouter);
app.use(aboutUsRouter);
app.use(teamMembersRouter);
app.use(educationYearRouter);
app.use(teacherRouter);
app.use(paymentRouter);
app.set('views', viewPath);
app.set('view engine', 'hbs');
app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
});
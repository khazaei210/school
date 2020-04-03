const mongoose = require('mongoose');

// mongoose.connect('mongodb://127.0.0.1:27017/school', {
mongoose.connect(process.env.CONENCTIONSTRING, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
});
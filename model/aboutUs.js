const mongoose = require('mongoose');
const AboutUsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    description: {
        type: String
    },
    image: {
        type: String
    }
});

const AboutUs = mongoose.model('AboutUs', AboutUsSchema);
module.exports = AboutUs;

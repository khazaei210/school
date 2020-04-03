const mongoose = require('mongoose');
const newsSchema = new mongoose.Schema({
    title: {
        type: String
    },
    fullDescription: {
        type: String
    },
    shortDescription: {
        type: String
    },
    // },
    // author: {
    //     type: //mongoose.Schema.Types.ObjectId,
    //     required: true,
    //     ref: 'User'
    // }

    image:{
        type: String
    },
    createDate:{
        type: String
    },
    expireDate: {
        type: String
    },
    isPublish: {
        type: Boolean
    }
},
    {
        timestamps: true
    }
);

const News = mongoose.model('News', newsSchema);
module.exports = News;

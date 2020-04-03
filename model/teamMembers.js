const mongoose = require('mongoose');
const TeamMembersSchema = new mongoose.Schema({
    name: {
        type: String
    },
    resume: {
        type: String
    },
    image: {
        type: String
    }
});

const TeamMembers = mongoose.model('TeamMembers', TeamMembersSchema);
module.exports = TeamMembers;
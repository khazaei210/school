const express = require('express');
const upload = require('../middleWare/upload')
const shelljs = require('shelljs');
const auth = require('../middleWare/auth');
const TeamMembers = require('../model/teamMembers');
const router = new express.Router();
let bodyParser = require('body-parser');
const path = require('path');
router.use(express.json());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
//------------------Add Member item--------------------
router.post('/admin/members', auth, upload.single('image'),  async(req, res)=>{
    const teamMembers = new TeamMembers({name: req.body.name, resume: req.body.resume, image: req.file.filename});
    await teamMembers.save();
    const status = shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/teamMembers`));
    res.send('saved');
})
//------------------get teamMembers items--------------------
router.get('/get/teamMembers', async (req, res) => {
  
  const teamMembers = await TeamMembers.find();
  res.send(teamMembers);
});
//------------------get teamMembers items--------------------
router.get('/admin/getTeamMembers', auth, async (req, res) => {
  
  const teamMembers = await TeamMembers.find();
  res.send(teamMembers);
});
//-------------------------remove team members ----------------------

router.post('/admin/removeTeamMembers', auth, async (req, res) => {
  const teamMembers = req.body.data;
  teamMembers.forEach(async el=>{
      const teamMem = await TeamMembers.findById(el.id);
      const status = shelljs.rm(path.join(__dirname,`../public/img/teamMembers/${teamMem.image}`))
      await TeamMembers.findByIdAndDelete({_id: el.id});
  })
    res.send('removed');
});
//---------------------------------- find one team member -----------------
router.get('/admin/getTeamMember/', auth, async (req, res)=>{
  const _id = req.query.id;
  const item = await TeamMembers.findById(_id);
  
  res.send(item);
})
//------------------------------------update team member-------------------

router.patch('/admin/changeTeamMember', auth, upload.single('image'), async (req, res) => {
  
  let team = req.body;
  let newData = {name: team.name,
    resume: team.resume
    };
  if (req.file){
    newData.image = req.file.filename;
    team = await TeamMembers.findById(team._id);
    const status = shelljs.rm(path.join(__dirname,`../public/img/teamMembers/${team.image}`))
    const status1 = shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/teamMembers`));
  }
  try{
    team = await TeamMembers.findByIdAndUpdate(team._id, newData, {new: true});

  }catch(e){console.log(e)}
  res.send(team)

})
//------------------------------------ delete one item--------

router.post('/admin/delTeamMember/', auth, async (req, res) => {
  const _id = req.query.id;
  const member = await TeamMembers.findById(_id);
  const status = shelljs.rm(path.join(__dirname,`../public/img/teamMembers/${member.image}`))
  const item = await TeamMembers.findByIdAndDelete(_id);
  res.send('deleted');
})

module.exports = router;
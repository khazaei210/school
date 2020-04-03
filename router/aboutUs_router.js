const express = require('express');
const upload = require('../middleWare/upload')
const shelljs = require('shelljs');
const path = require('path');
const auth = require('../middleWare/auth');
const AboutUs = require('../model/aboutUs');
const router = new express.Router();
let bodyParser = require('body-parser');
router.use(express.json());
router.use(bodyParser.json())
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
//------------------Add aboutUs item--------------------
router.post('/admin/aboutUs', auth, upload.single('image'),  async(req, res)=>{
    const aboutUs = new AboutUs({title: req.body.title, description: req.body.description, image: req.file.filename});
    await aboutUs.save();
    const status = shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/aboutUs`));

    res.send('saved');
})
//------------------get aboutUs items--------------------
router.get('/admin/aboutUs', async (req, res) => {
  
  const aboutUs = await AboutUs.find();
  res.send(aboutUs);
});

//-------------------------remove about us ----------------------

router.post('/admin/removeAbouUs', auth, async (req, res) => {
  const aboutUs = req.body.data;
    aboutUs.forEach(async el=>{
        const aboutUs = await AboutUs.findById(el.id);
        const status = shelljs.rm(path.join(__dirname,`../public/img/aboutUs/${aboutUs.image}`))
        await AboutUs.findByIdAndDelete({_id: el.id});
    })
    res.send('removed');
});
//------------change aboutUs --------------------------
router.patch('/admin/changeAboutUs', auth, upload.single('image'), async (req, res) => {
    let aboutUs = req.body;
    let newData = {title: aboutUs.title,
      description: aboutUs.description
      };
    if (req.file){
      newData.image = req.file.filename;
      aboutUs = await AboutUs.findById(aboutUs._id);
      const status = shelljs.rm(path.join(__dirname,`../public/img/aboutUs/${aboutUs.image}`))
      const status1 = shelljs.mv(path.join(__dirname,`../public/img/temp/${req.file.filename}`), path.join(__dirname,`../public/img/aboutUs`));
    }
    try{
      aboutUs = await AboutUs.findByIdAndUpdate(aboutUs._id, newData, {new: true});

    }catch(e){console.log(e)}
    res.send(aboutUs)
})
//----------get about us -------------
router.post('/admin/getAboutUsList', auth, async (req, res) => {
  const aboutUs = await AboutUs.find();
  res.send(aboutUs);
})
//----------------- get item for update about us -----------------------------
router.get('/admin/getAboutUs/', auth, async (req, res) => {
  const id = req.query.id;
  const item = await AboutUs.findById(id);
  res.send(item);

})

//------------------delete about us item --------------------
router.post('/admin/deleteAboutUs/', auth, async (req, res) => {
  const id = req.query.id;
  const aboutUs = await AboutUs.findById(id);
  const status = shelljs.rm(path.join(__dirname,`../public/img/aboutUs/${aboutUs.image}`))
  await AboutUs.findByIdAndDelete({_id: id});
  res.send('deleted')
})
module.exports = router;
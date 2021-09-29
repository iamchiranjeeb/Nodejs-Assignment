const express = require("express");
const fs = require("fs");
const router = express.Router();
const auth = require("../middleware/auth");
const userFiles = require("../models/files");
const upload = require("../helpers/files");
const secretCode = require("../helpers/secretGenerator");

/**
 * @explain I hade to Write File Routes Here
 * @explain Because if i was seprating Route & Controller I Was Getting Error Not in Proper Format
*/



/**
 * @desc To Upload a File
*/
router.get('/upload/file',auth,async (req, res)=>{
    res.status(200).render('uploadfile')
})

router.post('/upload/file',auth,upload.single('file'),async (req, res)=>{
   
    const {fileName} = req.body;
    console.log(req.file)
    if(!req.file || !fileName){
        return res.status(400).render('uploadfile',{error:"All Fields are Required"});
    }
    const NewFile = new userFiles({
        fileUrl:`http://localhost:4005/usersfile/${req.file.filename}`,
        fileName,
        secretCode:secretCode(),
        owner:req.user.id,
    })
    const savedFiles = await NewFile.save();
    res.status(200).redirect('/files')
   
},(err, req, res, next) => {
    return res.status(400).render('uploadfile',{ success: 0, error: err.message });
});

/**
 * @desc To View Files
*/
router.get("/files",auth,async(req,res)=>{
    try {
        const findFiles = await userFiles.find({owner: req.user.id})
        if(!findFiles || findFiles.length === 0) {
            return res.status(404).render('files',{error: "No File Found"})
        }
        res.status(200).render('files',{files:findFiles})
    } catch (e) {
        res.status(500).json({error:e.message});
    }
})

/**
 * @desc To View Or Download a File
*/
router.get('/download/file',auth,async (req, res)=>{
    res.status(200).render('downloadfile')
})

router.post('/download/file',auth,async (req, res)=>{
    try {
        const {fileName,code} = req.body;
        if(!fileName || !code) {
            return res.status(400).render("downloadfile",{error:'All Field Required.'});
        }
        const findFile = await userFiles.findOne({fileName,secretCode:code,owner:req.user.id})
        if(!findFile){
            return res.status(400).render("downloadfile",{error:"No Such File Found"});

        }
        const fileLink = findFile.fileUrl;
        var fields = fileLink.split("/");
        const file = fields[fields.length - 1];

        res.status(200).render('downloadfile',{message:findFile.fileUrl,file})

    } catch (e) {
        res.status(200).render("downloadfile",{error:e.message});
    }
})


/**
 * @desc To Update File
*/

router.get('/update/files/:id', auth, async(req, res)=>{
    const files = await userFiles.findOne({_id:req.params.id,owner:req.user._id})

    res.status(200).render("updatefile",{file:files})
})

router.post("/update/files/:id",auth,upload.single("file"),async (req, res) =>{
    try {
        const _id = req.params.id;
        const findFile = await userFiles.findOne({_id,owner:req.user.id})

        if(!req.file){
            return res.status(400).render("updatefile",{error:"File Required"});    
        }
       
        if(!findFile) {
            return res.status(400).render("updatefile",{error:"File not available"});    
        }

        if(!findFile.fileUrl || findFile.fileUrl === null){
            return res.status(400).render("updatefile",{error:"File Not Found."});    
        }
        const filesUser = findFile.fileUrl
        var fields = filesUser.split("/");
        const usersFiles = fields[fields.length - 1];

        fs.unlink(`./uploads/files/${usersFiles}`,async (err)=>{
            if(err) {
                return res.status(200).render("updatefile",{error:err.message});    
            }
        })
        findFile.fileUrl = `http://localhost:4005/usersfile/${req.file.filename}`
        await findFile.save()
        res.status(201).redirect('/files')

    } catch (e) {
        res.status(200).render("updatefile",{error:e.message});    
    }
})

/**
 * @desc To Update File Name
*/
router.get('/update/file/name/:id', auth, async(req, res)=>{
    const files = await userFiles.findOne({_id:req.params.id,owner:req.user._id})

    res.status(200).render("updatefiledetails",{file:files})
})


router.post("/update/file/name/:id",auth,async (req, res)=>{
    try {

        const {fileName} = req.body;
        if(!fileName) {
            return res.status(400).render("updatefiledetails",{error:"File Name Required"})
        }
        const findFile = await userFiles.findOne({ _id:req.params.id})
        if(!findFile){
            return res.status(404).json({error:"file Not Found"})
        }
        let query = {
            $set: req.body,
        }
        const updateFileDetails = await userFiles.findOneAndUpdate({_id:req.params.id},query,{ new: true })
        res.status(201).redirect('/files')
    } catch (e) {
        res.status(200).render("updatefiledetails",{error:e.message});
    }
})


/**
 * @desc To Delete File
*/
router.get('/delete/file/:id',auth ,async (req, res)=>{
    try {
        const findFile = await userFiles.findOne({_id:req.params.id})
        if(!findFile) {
            return res.status(404).render("files",{error:"File Not Found"})
        }
        const filesUser = findFile.fileUrl
        var fields = filesUser.split("/");
        const usersFiles = fields[fields.length - 1];

        fs.unlink(`./uploads/files/${usersFiles}`,async (err)=>{
            if(err) {
                return res.status(200).render("files",{error:err.message});    
            }
        })

        await findFile.remove()
        res.status(200).redirect("/files")
    } catch (e) {
        res.status(500).render("files",{error:e.message});
    }
})

module.exports = router;
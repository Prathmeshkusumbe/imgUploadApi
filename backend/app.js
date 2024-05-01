const express = require('express');
const cors = require('cors');
const app = express();
const fs = require('fs');

const corsOptions = {
  origin: 'http://localhost:3000'
};
app.use(cors(corsOptions));
const path = require('path');
const multer = require('multer');


const storage = multer.diskStorage({
  destination: './upload/images',
  filename: (req, file, cb) => {
      return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
  }
})
const upload = multer({
  storage
})

app.use('/img', express.static('upload/images'));



app.post('/upload', upload.array('img', 5), (req, res)=>{
  if(req.files){
    const urls = req.files.map(f=>`http://localhost:4000/img/${f.filename}`)
    res.json({
      status : 1,
      urls
    })
  } else {
    res.status(400).json({
      status: 0,
      message: 'No files uploaded'
    });
  }
})


// app.get('/images', (req, res) => {
//   const directoryPath = path.join(__dirname, 'upload/images');
//   fs.readdir(directoryPath, (err, files) => {
//     if (err) {
//       return res.status(500).send({
//         message: "Unable to scan files!",
//       });
//     }
//     let fileList = files.map(file => {
//       return { name: file, url: `http://localhost:4000/img/${file}` };
//     });
//     res.json(fileList);
//   });
// });


app.get('/images', async (req, res) => {
  const directoryPath = path.join(__dirname, 'upload/images');
  try {
    const dir = await fs.promises.opendir(directoryPath);
    const files = [];
    for await (const dirent of dir) {
      if (dirent.isFile()) {
        files.push(dirent.name);
        if (files.length === 5) break; // Stop after adding 5 files
      }
    }
    const fileList = files.map(file => ({
      name: file,
      url: `http://localhost:4000/img/${file}`
    }));
    res.json(fileList);
  } catch (err) {
    res.status(500).send({ message: "Unable to read directory: " + err.message });
  }
});

app.listen(4000, () => {
  console.log('Server running on port 4000');
});

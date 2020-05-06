const express = require('express')
const fs = require('fs')
const multer = require('multer');

const csvParse = require('csv-parse');

const path = require('path');
const crypto = require('crypto');


const tempFolder = path.resolve(__dirname, 'tmp');

const app = express()
const upload = multer({
  directory: tempFolder,
  storage: multer.diskStorage({
    destination: tempFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(10).toString('HEX');
      // const fileName = `${fileHash}-${file.originalname}`;
       const fileName = `${file.originalname}`;

      return callback(null, fileName);
    },
  }),
});


app.post('/file', upload.single('csv'), async (req, res) => {
    const file = req.file;

    const contactReadStream = fs.createReadStream('./tmp/123.csv');

    const parsers = csvParse({
      delimiter: ',',
      skip_empty_lines: true,
      from_line: 2,
    });

    const parseCSV = contactReadStream.pipe(parsers);

    parseCSV.on('data', async line => {
      
      console.log(line);
      
    });

    await new Promise(resolve => parseCSV.on('end', resolve));

    return res.json({ok: true})
    
})


app.listen(3000, () => {
  console.log("run")
})




const express = require('express');
const multer = require('multer');
const excelToJson = require('convert-excel-to-json');
const fs = require('fs-extra');
const cors = require('cors');

const app = express();
const port = 3000;

let upload = multer({ dest: "uploads/" });

app.use(cors());

app.post('/read', upload.single('file'), (req, res) => {
  try {
    if (req.file.filename == null || req.file?.filename == 'undefined') {
      res.status(400).json("No File");
    } else {
      let filePath = 'uploads/' + req.file.filename;

      const excelData = excelToJson({
        sourceFile: filePath,
        header: {
          rows: 1,
        },
        columnToKey: {
          "*": "{{columnHeader}}",
        },
      });
      fs.remove(filePath);

      res.json({ success: true, data: excelData });
    }
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

app.get('/view', (req, res) => {
  try {
    const filename = 'uploads/file.xlsx';

    if (!filename) {
      res.status(400).json({ success: false, error: 'Filename parameter is required' });
      return;
    }

    const filePath = filename;
    const excelData = excelToJson({
      sourceFile: filePath,
      header: {
        rows: 1,
      },
      columnToKey: {
        "*": "{{columnHeader}}",
      },
    });

    // Assume 'Day' is the key for the date field in your excelData
    const formattedData = excelData.Sheet3.map(row => {
      if (row.Day) {
        row.Day = formatDate(row.Day);
      }
      return row;
    });

    res.json({ success: true, data: formattedData });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

function formatDate(dateString) {
  const date = new Date(dateString);
  const month = date.getMonth() + 1; 
  const day = date.getDate();
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
}

app.listen(port, () => {
  console.log(`Node.js app listening on PORT ${port}`);
});

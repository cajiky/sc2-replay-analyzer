require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { spawn } = require('child_process');
const path = require('path');
const { sequelize, Replay } = require('./models');

const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

app.post('/api/upload', async (req, res) => {
  if (!req.files || !req.files.replay) {
    console.error('No file uploaded.');
    return res.status(400).send('No file uploaded.');
  }

  const replayFile = req.files.replay;
  const replayFilePath = path.join(__dirname, 'uploads', replayFile.name);

  console.log('Received file:', replayFile.name);

  replayFile.mv(replayFilePath, async (err) => {
    if (err) {
      console.error('Error saving file:', err);
      return res.status(500).send(err);
    }

    try {
      console.log('File saved, running Python script...');

      const pythonProcess = spawn('python3', [path.join(__dirname, 'scripts', 'parse_replay.py'), replayFilePath]);

      pythonProcess.stdout.on('data', async (data) => {
        console.log('Python script output:', data.toString());

        const parsedData = JSON.parse(data.toString());
        const replay = await Replay.create({ data: parsedData });
        res.send(replay);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error('Python script error:', data.toString());
        res.status(500).send('Error parsing replay.');
      });

      pythonProcess.on('exit', (code) => {
        console.log('Python script exited with code', code);
      });

    } catch (error) {
      console.error('Error parsing replay:', error);
      res.status(500).send('Error parsing replay.');
    }
  });
});

app.get('/api/replays', async (req, res) => {
  try {
    console.log('Fetching replays from database...');
    const replays = await Replay.findAll();
    console.log('Replays fetched successfully:', replays);
    res.send(replays);
  } catch (error) {
    console.error('Error fetching replays:', error);
    res.status(500).send('Error fetching replays.');
  }
});

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Error syncing database:', err));

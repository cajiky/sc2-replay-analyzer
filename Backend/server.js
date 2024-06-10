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
    return res.status(400).send('No file uploaded.');
  }

  const replayFile = req.files.replay;
  const replayFilePath = path.join(__dirname, 'uploads', replayFile.name);

  // Save the replay file to the server
  replayFile.mv(replayFilePath, async (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    try {
      // Spawn a new Python process to parse the replay
      const pythonProcess = spawn('python3', [path.join(__dirname, 'scripts', 'parse_replay.py'), replayFilePath]);

      pythonProcess.stdout.on('data', async (data) => {
        const parsedData = JSON.parse(data.toString());
        const replay = await Replay.create({ data: parsedData });
        res.send(replay);
      });

      pythonProcess.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
        res.status(500).send('Error parsing replay.');
      });
    } catch (error) {
      console.error('Error parsing replay:', error);
      res.status(500).send('Error parsing replay.');
    }
  });
});

app.get('/api/replays', async (req, res) => {
  try {
    const replays = await Replay.findAll();
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

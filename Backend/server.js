require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');
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

  try {
    const parsedData = await parseReplay(replayFile.data);
    const replay = await Replay.create({ data: parsedData });
    res.send(replay);
  } catch (error) {
    console.error('Error parsing replay:', error);
    res.status(500).send('Error parsing replay.');
  }
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

const parseReplay = async (replayFileBuffer) => {
  // Placeholder for the parseReplay function
  return {
    playerName: 'Player1',
    opponentName: 'Player2',
    result: 'Win',
    duration: '20:34',
    apm: [150, 160, 170, 180],
    timestamps: ['00:01', '00:02', '00:03', '00:04'],
  };
};

sequelize.sync()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch(err => console.error('Error syncing database:', err));

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ReplayUpload from './components/ReplayUpload';
import ReplayList from './components/ReplayList';
import ReplayVisualization from './components/ReplayVisualization';

const App = () => {
  const [replays, setReplays] = useState([]);
  const [selectedReplay, setSelectedReplay] = useState(null);

  const fetchReplays = async () => {
    try {
      const response = await axios.get('/api/replays');
      setReplays(response.data);
    } catch (error) {
      console.error('Error fetching replays:', error);
    }
  };

  useEffect(() => {
    fetchReplays();
  }, []);

  const handleReplayClick = (replay) => {
    setSelectedReplay(replay);
  };

  return (
    <div>
      <h1>SC2 Replay Analyzer</h1>
      <ReplayUpload onUploadSuccess={fetchReplays} />
      <ReplayList replays={replays} onReplayClick={handleReplayClick} />
      {selectedReplay && <ReplayVisualization data={selectedReplay.data} />}
    </div>
  );
};

export default App;

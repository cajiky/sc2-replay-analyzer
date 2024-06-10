import React from 'react';

const ReplayList = ({ replays, onReplayClick }) => {
  return (
    <div>
      <h2>Uploaded Replays</h2>
      <ul>
        {replays.map((replay) => (
          <li key={replay.id} onClick={() => onReplayClick(replay)}>
            {replay.data.playerName} vs {replay.data.opponentName} - {replay.data.result} ({replay.data.duration})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReplayList;

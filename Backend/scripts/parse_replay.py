import sys
import json
import sc2reader

def parse_replay(file_path):
    try:
        replay = sc2reader.load_replay(file_path)
        player1 = replay.players[0]
        player2 = replay.players[1]

        result = {
            "playerName": player1.name,
            "opponentName": player2.name,
            "result": "Win" if player1.team.result == "Win" else "Loss",
            "duration": str(replay.length),
            "apm": [event.second for event in replay.events if event.name == 'PlayerStatsEvent' and event.pid == player1.pid],
            "timestamps": [str(event.second) for event in replay.events if event.name == 'PlayerStatsEvent' and event.pid == player1.pid]
        }

        return result
    except Exception as e:
        print(f"Error parsing replay: {e}", file=sys.stderr)
        sys.exit(1)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python parse_replay.py <path_to_replay_file>", file=sys.stderr)
        sys.exit(1)

    file_path = sys.argv[1]
    print(f"Parsing replay file: {file_path}")
    parsed_data = parse_replay(file_path)
    print(json.dumps(parsed_data))

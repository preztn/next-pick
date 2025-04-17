from flask import Flask, jsonify, request
from flask_cors import CORS
import csv

app = Flask(__name__)
CORS(app)

# Load player data with projections
def load_players():
    players = []
    with open("data/players.csv", newline='') as f:
        reader = csv.DictReader(f)
        for row in reader:
            try:
                players.append({
                    "name": row["name"],
                    "team": row["team"],
                    "pos": row["pos"],
                    "adp": float(row["adp"]),
                    "proj_points": float(row["proj_points"])
                })
            except ValueError:
                continue
    return players

player_pool = load_players()

@app.route("/api/recommendation")
def recommend():
    pick_num = request.args.get("pick", type=int)
    format_type = request.args.get("format", type=str)

    # Allow a range of ADPs around the current pick (e.g., +/- 5 picks)
    available_players = [p for p in player_pool if abs(p["adp"] - pick_num) <= 5 and p["proj_points"] > 0]

    # Sort by projected points, descending
    top_players = sorted(available_players, key=lambda x: x["proj_points"], reverse=True)[:5]

    return jsonify({
        "pick": pick_num,
        "format": format_type,
        "recommendations": top_players
    })


if __name__ == "__main__":
    app.run(debug=True)

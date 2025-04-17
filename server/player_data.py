import csv

def load_players():
    players = []
    with open("data/players.csv", newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            try:
                adp = float(row["adp"])
                proj_points = float(row["proj_points"])
                players.append({
                    "name": row["name"],
                    "team": row["team"],
                    "pos": row["pos"],
                    "adp": adp,
                    "proj_points": proj_points
                    })
            except (ValueError, KeyError):
                continue
    return players

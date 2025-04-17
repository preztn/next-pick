import React, { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [pick, setPick] = useState("");
  const [format, setFormat] = useState("ppr");
  const [recommendations, setRecommendations] = useState([]);
  const [myTeam, setMyTeam] = useState(() => {
    const stored = localStorage.getItem("myTeam");
    return stored ? JSON.parse(stored) : [];
  });
  const [positionFilter, setPositionFilter] = useState("all");

  useEffect(() => {
    localStorage.setItem("myTeam", JSON.stringify(myTeam));
  }, [myTeam]);

  const getRecommendation = async () => {
    try {
      const res = await axios.get(`http://localhost:5000/api/recommendation`, {
        params: { pick, format },
      });
      setRecommendations(res.data.recommendations || []);
    } catch (err) {
      console.error("API error:", err);
    }
  };

  const draftPlayer = (player) => {
    setMyTeam((prev) => [...prev, player]);
    setRecommendations((prev) => prev.filter((p) => p.name !== player.name));
  };

  const removePlayer = (player) => {
    setMyTeam((prev) => prev.filter((p) => p.name !== player.name));
    setRecommendations((prev) => [...prev, player]);
  };

  const filteredRecommendations = recommendations.filter((p) => {
    const basePos = p.pos.toUpperCase().replace(/[0-9]/g, "");
    return positionFilter === "all" ? true : basePos === positionFilter;
  });

  const getPositionColor = (pos) => {
    const base = pos.toUpperCase().replace(/[0-9]/g, "");
    switch (base) {
      case "QB":
        return "#ffe082";
      case "RB":
        return "#c8e6c9";
      case "WR":
        return "#bbdefb";
      case "TE":
        return "#f8bbd0";
      default:
        return "#eeeeee";
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Next Pick</h1>

        <div style={styles.inputGroup}>
          <input
            type="number"
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            style={styles.input}
            placeholder="Draft Pick Number"
          />

          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={styles.select}
          >
            <option value="ppr">PPR</option>
            <option value="standard">Standard</option>
          </select>

          <button style={styles.button} onClick={getRecommendation}>
            Get My Pick
          </button>
        </div>

        {recommendations.length > 0 && (
          <div style={styles.result}>
            <div style={styles.resultHeader}>
              <h2>Top Recommended Players</h2>
              <select
                value={positionFilter}
                onChange={(e) => setPositionFilter(e.target.value)}
                style={styles.selectMini}
              >
                <option value="all">All</option>
                <option value="QB">QB</option>
                <option value="RB">RB</option>
                <option value="WR">WR</option>
                <option value="TE">TE</option>
              </select>
            </div>

            <div style={styles.cardList}>
              {filteredRecommendations.map((player, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.playerCard,
                    backgroundColor: getPositionColor(player.pos),
                  }}
                >
                  <div>
                    <strong>{player.name}</strong>
                    <br />
                    <span>
                      {player.pos}, {player.team}
                    </span>
                    <br />
                    <small>{player.proj_points} pts</small>
                  </div>
                  <button
                    onClick={() => draftPlayer(player)}
                    style={styles.draftBtn}
                  >
                    Draft
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {myTeam.length > 0 && (
          <div style={styles.result}>
            <h2>🧠 My Team</h2>
            <div style={styles.cardList}>
              {myTeam.map((player, index) => (
                <div
                  key={index}
                  style={{
                    ...styles.playerCard,
                    backgroundColor: getPositionColor(player.pos),
                  }}
                >
                  <div>
                    <strong>{player.name}</strong>
                    <br />
                    <span>
                      {player.pos}, {player.team}
                    </span>
                    <br />
                    <small>{player.proj_points} pts</small>
                  </div>
                  <button
                    onClick={() => removePlayer(player)}
                    style={styles.removeBtn}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f0f2f5",
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "center",
    padding: "2rem",
    fontFamily: "Inter, sans-serif",
  },
  card: {
    backgroundColor: "#fff",
    padding: "2rem",
    borderRadius: "16px",
    width: "100%",
    maxWidth: "800px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "2.25rem",
    marginBottom: "1.5rem",
    textAlign: "center",
    color: "#1a1a1a",
  },
  inputGroup: {
    display: "flex",
    gap: "1rem",
    marginBottom: "1.5rem",
    flexWrap: "wrap",
  },
  input: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  select: {
    flex: 1,
    padding: "0.75rem",
    borderRadius: "8px",
    border: "1px solid #ccc",
  },
  selectMini: {
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "0.9rem",
  },
  button: {
    flex: "1 1 100%",
    padding: "0.9rem",
    backgroundColor: "#1e88e5",
    color: "#fff",
    fontWeight: "bold",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  result: {
    marginTop: "2rem",
  },
  resultHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "1rem",
  },
  cardList: {
    display: "grid",
    gap: "1rem",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
  },
  playerCard: {
    borderRadius: "12px",
    padding: "1rem",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
  },
  draftBtn: {
    backgroundColor: "#43a047",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
  removeBtn: {
    backgroundColor: "#e53935",
    color: "white",
    border: "none",
    borderRadius: "6px",
    padding: "0.5rem 1rem",
    cursor: "pointer",
  },
};

export default App;

import React from "react";

import { useState } from "react";

import axios from "axios";

function App() {
  const [pick, setPick] = useState("");
  const [format, setFormat] = useState("ppr");
  const [recommendations, setRecommendations] = useState([]);
  const [myTeam, setMyTeam] = useState([]);

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

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.heading}>Next Pick</h1>

        <div style={styles.inputGroup}>
          <label style={styles.label}>Draft Pick Number:</label>
          <input
            type="number"
            value={pick}
            onChange={(e) => setPick(e.target.value)}
            style={styles.input}
            placeholder="e.g. 5"
          />
        </div>

        <div style={styles.inputGroup}>
          <label style={styles.label}>League Format:</label>
          <select
            value={format}
            onChange={(e) => setFormat(e.target.value)}
            style={styles.select}
          >
            <option value="ppr">PPR</option>
            <option value="standard">Standard</option>
          </select>
        </div>

        <button style={styles.button} onClick={getRecommendation}>
          Get My Pick
        </button>

        {recommendations.length > 0 && (
          <div style={styles.result}>
            <h2 style={styles.resultHeading}>Top Recommended Players</h2>
            <ul>
              {recommendations.map((player, index) => (
                <li key={index} style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <strong>{player.name}</strong> — {player.pos},{" "}
                      {player.team}
                      <br />
                      <small>{player.proj_points} pts</small>
                    </div>
                    <button
                      onClick={() => draftPlayer(player)}
                      style={{
                        backgroundColor: "#4caf50",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Draft
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}

        {myTeam.length > 0 && (
          <div style={styles.result}>
            <h2 style={styles.resultHeading}>🧠 My Team</h2>
            <ul>
              {myTeam.map((player, index) => (
                <li key={index} style={{ marginBottom: "1rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      {player.name} — {player.pos}, {player.team} (
                      {player.proj_points} pts)
                    </div>
                    <button
                      onClick={() => removePlayer(player)}
                      style={{
                        backgroundColor: "#e53935",
                        color: "white",
                        border: "none",
                        borderRadius: "6px",
                        padding: "0.5rem 1rem",
                        cursor: "pointer",
                      }}
                    >
                      Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#f2f2f2",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
  },
  card: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "500px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
  },
  heading: {
    textAlign: "center",
    fontSize: "2rem",
    marginBottom: "1.5rem",
    color: "#333",
  },
  inputGroup: {
    marginBottom: "1rem",
  },
  label: {
    display: "block",
    fontWeight: "bold",
    marginBottom: "0.5rem",
    color: "#444",
  },
  input: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  select: {
    width: "100%",
    padding: "0.5rem",
    borderRadius: "6px",
    border: "1px solid #ccc",
  },
  button: {
    width: "100%",
    padding: "0.75rem",
    backgroundColor: "#1e90ff",
    color: "white",
    fontWeight: "bold",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    marginTop: "1rem",
  },
  result: {
    marginTop: "2rem",
    padding: "1rem",
    backgroundColor: "#f9f9f9",
    borderRadius: "8px",
    border: "1px solid #ddd",
  },
  resultHeading: {
    fontSize: "1.2rem",
    marginBottom: "0.5rem",
    color: "#2e7d32",
  },
};

export default App;

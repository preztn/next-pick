from flask import Flask, jsonify, request
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route("/api/recommendation")
def recommend():
    return jsonify({
        "pick": 24,
        "recommendation": "Garrett Wilson",
        "reason": "Projected WR1 volume in a pass-heavy offense"
    })

if __name__ == "__main__":
    app.run(debug=True)

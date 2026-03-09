"""
Flask API for sentiment analysis and complaint ingestion.

Endpoints:
 - POST /analyze-complaint  : Accepts JSON { "complaint_text": "..." } and returns { sentiment_label, sentiment_score }
 - POST /complaints         : Accepts JSON complaint payload (title, description, ...), analyzes sentiment, stores in DB, and returns stored record.

Config via env vars:
 - FLASK_ENV=development
 - PORT (optional, default 5000)
 - DATABASE_URL or PG_* variables (see db.py)
"""
from flask import Flask, request, jsonify
from flask_cors import CORS
from sentiment import analyze_sentiment
import db
import os

app = Flask(__name__)
# Enable CORS so the frontend (vite dev server) can call this API
CORS(app)


@app.route('/analyze-complaint', methods=['POST'])
def analyze_complaint():
    """Analyze complaint text and return sentiment label and score.

    Input JSON: { "complaint_text": "..." }
    Output JSON: { "success": true, "sentiment_label": "Positive", "sentiment_score": 0.7 }
    """
    payload = request.get_json(silent=True) or {}
    text = payload.get('complaint_text')
    if text is None:
        return jsonify({'success': False, 'message': 'Missing `complaint_text` in request body'}), 400

    try:
        res = analyze_sentiment(text)
        return jsonify({
            'success': True,
            'sentiment_label': res['label'],
            'sentiment_score': res['score'],
            'raw': res.get('raw')
        })
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


@app.route('/complaints', methods=['POST'])
def create_complaint():
    """Create a complaint, analyze sentiment and persist to DB.

    Expected JSON body (partial):
      { "title": "...", "description": "...", "category": "academics", "severity": "low", "submitted_by": "Anonymous" }
    """
    payload = request.get_json(silent=True) or {}
    title = payload.get('title')
    description = payload.get('description')
    category = payload.get('category', 'other')
    severity = payload.get('severity', 'low')
    submitted_by = payload.get('submitted_by')

    if not title or not description:
        return jsonify({'success': False, 'message': 'Missing title or description'}), 400

    try:
        sentiment = analyze_sentiment(description)
        score = sentiment['score']
        label = sentiment['label']

        # Determine priority: mark high priority if very negative
        priority = 'normal'
        if label == 'Negative' and score <= -0.5:
            priority = 'high'

        try:
            row = db.insert_complaint(
                title=title,
                description=description,
                category=category,
                severity=severity,
                submitted_by=submitted_by,
                sentiment_score=score,
                sentiment_label=label,
                priority=priority,
            )
            return jsonify({'success': True, 'data': row}), 201
        except Exception as db_err:
            # If DB is unavailable, still return sentiment so frontend can show it.
            app.logger.error('DB insert failed: %s', db_err)
            return jsonify({
                'success': True,
                'data': {
                    'sentiment_label': label,
                    'sentiment_score': score,
                    'stored': False,
                },
                'message': 'DB unavailable, complaint not persisted'
            }), 200
    except Exception as e:
        return jsonify({'success': False, 'message': str(e)}), 500


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=(os.environ.get('FLASK_ENV') == 'development'))

"""
Sentiment analysis helper using NLTK's VADER.

Provides `analyze_sentiment(text)` which returns a dict with:
 - `score`: compound score (-1..1)
 - `label`: 'Positive'|'Neutral'|'Negative'

If VADER resources are missing, the module downloads the required lexicon on first run.
"""
from nltk.sentiment import SentimentIntensityAnalyzer
import nltk


def _ensure_vader():
    try:
        _ = SentimentIntensityAnalyzer()
    except Exception:
        # download the vader lexicon if not present
        nltk.download('vader_lexicon')


def analyze_sentiment(text: str) -> dict:
    """Analyze `text` and return a compound score and label.

    Uses VADER's compound score and the common thresholds:
      compound >= 0.05  => Positive
      compound <= -0.05 => Negative
      otherwise         => Neutral

    Additionally, callers can treat a compound <= -0.5 as "strongly negative".
    """
    if text is None:
        text = ""

    _ensure_vader()
    sia = SentimentIntensityAnalyzer()
    scores = sia.polarity_scores(text)
    compound = float(scores.get('compound', 0.0))

    if compound >= 0.05:
        label = 'Positive'
    elif compound <= -0.05:
        label = 'Negative'
    else:
        label = 'Neutral'

    return {
        'score': compound,
        'label': label,
        'raw': scores,
    }


if __name__ == '__main__':
    # quick manual test
    print(analyze_sentiment("I love this campus, great experience!"))
    print(analyze_sentiment("This is terrible and unacceptable."))

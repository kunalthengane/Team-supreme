import Sentiment from 'sentiment';

const sentiment = new Sentiment();

export function analyzeSentiment(text) {
  const result = sentiment.analyze(text || '');
  const score = typeof result.score === 'number' ? result.score : 0;
  let label = 'Neutral';
  if (score > 1) label = 'Positive';
  else if (score < -1) label = 'Negative';
  return { score, label };
}

export default analyzeSentiment;

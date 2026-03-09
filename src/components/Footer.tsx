import { Heart, Shield } from 'lucide-react';

interface SentimentCounts {
  positive: number;
  neutral: number;
  negative: number;
}

const Footer = ({ positive = 0, neutral = 0, negative = 0 }: Partial<SentimentCounts>) => {
  return (
    <footer className="border-t border-border/50 bg-card py-8">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4 text-accent" />
            <span>Your privacy is our priority</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>Made with</span>
            <Heart className="h-4 w-4 text-destructive fill-destructive" />
            <span>for students</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-sm">
              <div className="text-xs text-muted-foreground">Sentiment summary</div>
              <div className="mt-1 flex gap-3 text-sm font-medium">
                <span className="text-green-600">Positive: {positive}</span>
                <span className="text-gray-600">Neutral: {neutral}</span>
                <span className="text-red-600">Negative: {negative}</span>
              </div>
            </div>

            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} CampusVoice
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Label } from './ui/label';
import { ComplaintCategory, categoryLabels, categoryIcons } from '@/types/complaint';

interface ComplaintFormProps {
  // onSubmit should return the API response (used to show sentiment result)
  onSubmit: (title: string, description: string, category: ComplaintCategory) => Promise<any>;
}

const ComplaintForm = ({ onSubmit }: ComplaintFormProps) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<ComplaintCategory>('academics');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [submissionSentiment, setSubmissionSentiment] = useState<{ label: string; score: number } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      const response = await onSubmit(title.trim(), description.trim(), category);

      // Expecting API to return { success: true, data: { sentiment_label, sentiment_score } }
      const sentimentLabel = response?.data?.sentiment_label ?? response?.sentimentLabel ?? null;
      const sentimentScore = response?.data?.sentiment_score ?? response?.sentimentScore ?? null;
      if (sentimentLabel != null && sentimentScore != null) {
        setSubmissionSentiment({ label: sentimentLabel, score: Number(sentimentScore) });
      } else {
        setSubmissionSentiment(null);
      }

      setTitle('');
      setDescription('');
      setCategory('classroom');
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setSubmissionSentiment(null);
      }, 5000);
    } catch (err) {
      // swallow — the page handler will show toast; keep existing behavior
      setIsSubmitted(false);
      setSubmissionSentiment(null);
      console.error('Submission failed', err);
    }
  };

  const categories = Object.entries(categoryLabels) as [ComplaintCategory, string][];

  return (
    <section id="complaint-form" className="py-16 lg:py-24">
      <div className="container">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl font-bold sm:text-4xl">
              Submit Your <span className="text-gradient">Complaint</span>
            </h2>
            <p className="mt-4 text-muted-foreground">
              Share your concerns anonymously. We don't collect any personal information.
            </p>
          </div>

          {isSubmitted ? (
            <div className="animate-scale-in rounded-2xl border border-accent/30 bg-accent/10 p-8 text-center">
              <CheckCircle className="mx-auto h-16 w-16 text-accent" />
              <h3 className="mt-4 font-heading text-xl font-semibold text-accent">
                Complaint Submitted Successfully!
              </h3>
              <p className="mt-2 text-muted-foreground">
                Your anonymous complaint has been posted for the community to see.
              </p>
              {submissionSentiment && (
                <div className="mt-4 inline-flex items-center gap-3 rounded-lg border px-4 py-2 text-sm">
                  <strong>Sentiment:</strong>
                  <span className="font-medium">{submissionSentiment.label}</span>
                  <span className="text-xs text-muted-foreground">(score: {submissionSentiment.score.toFixed(2)})</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6 rounded-2xl border border-border/50 bg-card p-8 shadow-elevated">
              {/* Category Selection */}
              <div className="space-y-3">
                <Label className="text-base font-semibold">Category</Label>
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {categories.map(([key, label]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setCategory(key)}
                      className={`flex items-center gap-2 rounded-xl border-2 p-3 text-left transition-all duration-200 hover:shadow-md ${
                        category === key
                          ? 'border-primary bg-primary/5 shadow-card'
                          : 'border-border hover:border-primary/50'
                      }`}
                    >
                      <span className="text-xl">{categoryIcons[key]}</span>
                      <span className="text-sm font-medium">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title" className="text-base font-semibold">
                  Title
                </Label>
                <Input
                  id="title"
                  placeholder="Brief summary of your complaint..."
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="h-12 rounded-xl border-2 transition-colors focus:border-primary"
                  required
                  maxLength={100}
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description" className="text-base font-semibold">
                  Description
                </Label>
                <Textarea
                  id="description"
                  placeholder="Provide more details about your concern..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="min-h-[150px] rounded-xl border-2 transition-colors focus:border-primary resize-none"
                  required
                  maxLength={1000}
                />
                <p className="text-xs text-muted-foreground text-right">
                  {description.length}/1000 characters
                </p>
              </div>

              {/* Privacy Notice */}
              <div className="rounded-xl bg-secondary/50 p-4 text-sm text-muted-foreground">
                <p className="flex items-start gap-2">
                  <span className="text-accent">🔒</span>
                  <span>
                    Your privacy is guaranteed. We do not collect your name, email, college ID, or any identifying information.
                  </span>
                </p>
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full"
                disabled={!title.trim() || !description.trim()}
              >
                <Send className="mr-2 h-5 w-5" />
                Submit Anonymously
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ComplaintForm;

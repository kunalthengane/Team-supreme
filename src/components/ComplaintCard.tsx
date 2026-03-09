import { useState } from 'react';
import { ThumbsUp, Clock } from 'lucide-react';
import { Complaint, categoryLabels, categoryIcons, categoryColors, sentimentColors } from '@/types/complaint';
import { formatDistanceToNow } from 'date-fns';

interface ComplaintCardProps {
  complaint: Complaint;
  onSupport: (id: string) => void;
}

const ComplaintCard = ({ complaint, onSupport }: ComplaintCardProps) => {
  const [hasSupported, setHasSupported] = useState(false);

  const handleSupport = () => {
    if (!hasSupported) {
      onSupport(complaint.id);
      setHasSupported(true);
    }
  };

  return (
    <article className="group rounded-2xl border border-border/50 bg-card p-6 shadow-card transition-all duration-300 hover:shadow-elevated hover:-translate-y-1">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium ${categoryColors[complaint.category]}`}>
            <span>{categoryIcons[complaint.category]}</span>
            {categoryLabels[complaint.category]}
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          {complaint.sentimentLabel && (
            <span className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium ${sentimentColors[complaint.sentimentLabel]}`}>
              {complaint.sentimentLabel}
            </span>
          )}
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(complaint.createdAt, { addSuffix: true })}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mt-4">
        <h3 className="font-heading text-lg font-semibold text-foreground line-clamp-2">
          {complaint.title}
        </h3>
        <p className="mt-2 text-muted-foreground leading-relaxed line-clamp-3">
          {complaint.description}
        </p>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between border-t border-border/50 pt-4">
        <div className="text-xs text-muted-foreground">
          Posted anonymously
        </div>
        <button
          onClick={handleSupport}
          disabled={hasSupported}
          className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
            hasSupported
              ? 'bg-accent/10 text-accent cursor-default'
              : 'bg-secondary hover:bg-primary hover:text-primary-foreground'
          }`}
        >
          <ThumbsUp className={`h-4 w-4 ${hasSupported ? 'fill-current' : ''}`} />
          <span>{complaint.supportCount + (hasSupported ? 1 : 0)}</span>
        </button>
      </div>
    </article>
  );
};

export default ComplaintCard;

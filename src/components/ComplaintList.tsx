import { useState } from 'react';
import { Filter, MessageSquare } from 'lucide-react';
import { Complaint, ComplaintCategory, categoryLabels, categoryIcons } from '@/types/complaint';
import ComplaintCard from './ComplaintCard';

interface ComplaintListProps {
  complaints: Complaint[];
  onSupport: (id: string) => void;
  isLoading?: boolean;
}

const ComplaintList = ({ complaints, onSupport, isLoading = false }: ComplaintListProps) => {
  const [selectedCategory, setSelectedCategory] = useState<ComplaintCategory | 'all'>('all');

  const categories = ['all', ...Object.keys(categoryLabels)] as (ComplaintCategory | 'all')[];

  const filteredComplaints = selectedCategory === 'all'
    ? complaints
    : complaints.filter(c => c.category === selectedCategory);

  return (
    <section className="py-16 lg:py-24 bg-secondary/30">
      <div className="container">
        <div className="text-center mb-10">
          <h2 className="font-heading text-3xl font-bold sm:text-4xl">
            Recent <span className="text-gradient">Complaints</span>
          </h2>
          <p className="mt-4 text-muted-foreground">
            Browse through complaints submitted by your fellow students
          </p>
        </div>

        {/* Filter */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Filter className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-muted-foreground">Filter by category:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 ${
                  selectedCategory === cat
                    ? 'bg-primary text-primary-foreground shadow-card'
                    : 'bg-card border border-border hover:border-primary/50'
                }`}
              >
                {cat !== 'all' && <span>{categoryIcons[cat as ComplaintCategory]}</span>}
                {cat === 'all' ? 'All Categories' : categoryLabels[cat as ComplaintCategory]}
              </button>
            ))}
          </div>
        </div>

        {/* Complaints Grid */}
        {isLoading ? (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading complaints...</p>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-16">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-muted">
              <MessageSquare className="h-10 w-10 text-muted-foreground" />
            </div>
            <h3 className="mt-4 font-heading text-lg font-semibold">No complaints yet</h3>
            <p className="mt-2 text-muted-foreground">
              {selectedCategory === 'all' 
                ? 'Be the first to submit a complaint!'
                : `No complaints in the ${categoryLabels[selectedCategory as ComplaintCategory]} category yet.`
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredComplaints.map((complaint, index) => (
              <div 
                key={complaint.id} 
                className="animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <ComplaintCard complaint={complaint} onSupport={onSupport} />
              </div>
            ))}
          </div>
        )}

        {/* Stats */}
        <div className="mt-12 flex justify-center">
          <div className="inline-flex items-center gap-6 rounded-2xl border border-border/50 bg-card px-8 py-4 shadow-card">
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-primary">{complaints.length}</p>
              <p className="text-xs text-muted-foreground">Total Complaints</p>
            </div>
            <div className="h-10 w-px bg-border" />
            <div className="text-center">
              <p className="font-heading text-2xl font-bold text-accent">
                {complaints.reduce((acc, c) => acc + (c.supportCount || 0), 0)}
              </p>
              <p className="text-xs text-muted-foreground">Total Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ComplaintList;

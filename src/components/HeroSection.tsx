import { ArrowDown, Lock, Eye, Users } from 'lucide-react';
import { Button } from './ui/button';

interface HeroSectionProps {
  onScrollToForm: () => void;
}

const HeroSection = ({ onScrollToForm }: HeroSectionProps) => {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background decoration */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 right-1/4 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      </div>
      
      <div className="container">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up">
            <span className="inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-4 py-2 text-sm font-medium text-accent">
              <Lock className="h-4 w-4" />
              Your Identity Stays Protected
            </span>
          </div>
          
          <h1 className="mt-8 font-heading text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl animate-fade-up" style={{ animationDelay: '0.1s' }}>
            Your Voice Matters,{' '}
            <span className="text-gradient">Speak Freely</span>
          </h1>
          
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl animate-fade-up" style={{ animationDelay: '0.2s' }}>
            Report any college-related concerns anonymously. No names, no IDs, no emails shown—just your voice being heard.
          </p>
          
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4 animate-fade-up" style={{ animationDelay: '0.3s' }}>
            <Button variant="hero" size="xl" onClick={onScrollToForm}>
              Submit a Complaint
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-16 grid grid-cols-1 gap-6 sm:grid-cols-3 animate-fade-up" style={{ animationDelay: '0.4s' }}>
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Lock className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">100% Anonymous</h3>
              <p className="text-sm text-muted-foreground">Your identity is never stored or revealed</p>
            </div>
            
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10">
                <Eye className="h-6 w-6 text-accent" />
              </div>
              <h3 className="font-heading font-semibold">Transparent</h3>
              <p className="text-sm text-muted-foreground">All complaints are publicly visible</p>
            </div>
            
            <div className="flex flex-col items-center gap-2 rounded-2xl border border-border/50 bg-card p-6 shadow-card">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-heading font-semibold">Community Driven</h3>
              <p className="text-sm text-muted-foreground">Support complaints that matter to you</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

import { MessageSquare, Shield } from 'lucide-react';

const Header = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl gradient-hero shadow-card">
            <MessageSquare className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-heading text-xl font-bold text-foreground">
              Campus<span className="text-gradient">Voice</span>
            </h1>
            <p className="text-xs text-muted-foreground">Anonymous Complaint Portal</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Shield className="h-4 w-4 text-accent" />
          <span className="hidden sm:inline">100% Anonymous & Secure</span>
        </div>
      </div>
    </header>
  );
};

export default Header;

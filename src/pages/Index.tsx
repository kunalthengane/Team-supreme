import { useState, useRef, useEffect } from 'react';
import Header from '@/components/Header';
import HeroSection from '@/components/HeroSection';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintList from '@/components/ComplaintList';
import Footer from '@/components/Footer';
import { Complaint, ComplaintCategory } from '@/types/complaint';
import { apiService, ApiComplaint } from '@/services/api';
import { useToast } from '@/hooks/use-toast';

// Sample data for fallback/demo
const initialComplaints: Complaint[] = [
  {
    id: '1',
    title: 'AC not working in Block B classrooms',
    description: 'The air conditioning system in Block B has been malfunctioning for the past two weeks. Students are finding it difficult to concentrate during afternoon lectures due to the heat.',
    category: 'facilities',
    severity: 'high',
    status: 'open',
    submittedBy: 'Anonymous',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    supportCount: 24,
  },
  {
    id: '2',
    title: 'Library closes too early on weekends',
    description: 'The library hours on weekends are insufficient. It closes at 5 PM which doesn\'t give students enough time to study, especially during exam season.',
    category: 'administration',
    severity: 'medium',
    status: 'open',
    submittedBy: 'Anonymous',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000),
    supportCount: 45,
  },
  {
    id: '3',
    title: 'Safety concerns near parking lot',
    description: 'The parking lot area is poorly lit at night and several incidents have been reported. Request for improved lighting and security measures.',
    category: 'safety',
    severity: 'critical',
    status: 'open',
    submittedBy: 'Anonymous',
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
    supportCount: 32,
  },
  {
    id: '4',
    title: 'Need more office hours for Math department',
    description: 'The current office hours for Math faculty are very limited and clash with other classes. Request for extended and flexible office hours.',
    category: 'academics',
    severity: 'medium',
    status: 'open',
    submittedBy: 'Anonymous',
    createdAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
    supportCount: 31,
  },
  {
    id: '5',
    title: 'Water cooler not working near cafeteria',
    description: 'The water cooler near the main cafeteria has been out of order for a week now. Students have to walk far to get drinking water.',
    category: 'facilities',
    severity: 'low',
    status: 'open',
    submittedBy: 'Anonymous',
    createdAt: new Date(Date.now() - 72 * 60 * 60 * 1000),
    supportCount: 18,
  },
];

const Index = () => {
  const [complaints, setComplaints] = useState<Complaint[]>(initialComplaints);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const formRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  // Fetch complaints from API on mount
  useEffect(() => {
    fetchComplaints();
  }, []);

  const fetchComplaints = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await apiService.getComplaints();
      
      if (response.success && response.data) {
        // Convert API response to frontend format
        const apiComplaints = response.data as ApiComplaint[];
        const convertedComplaints: Complaint[] = apiComplaints.map(c => ({
          id: c._id,
          title: c.title,
          description: c.description,
          category: c.category as ComplaintCategory,
          severity: c.severity,
          status: c.status,
          submittedBy: c.submittedBy,
          createdAt: new Date(c.submittedAt),
            sentimentScore: c.sentimentScore,
            sentimentLabel: c.sentimentLabel as any,
          submittedAt: new Date(c.submittedAt),
          resolvedAt: c.resolvedAt ? new Date(c.resolvedAt) : undefined,
          resolution: c.resolution,
          attachments: c.attachments,
        }));
        setComplaints(convertedComplaints);
      }
    } catch (err) {
      console.error('Backend not available, using demo data', err);
      // Use demo data if backend is not available
      setComplaints(initialComplaints);
    } finally {
      setIsLoading(false);
    }
  };

  const handleScrollToForm = () => {
    formRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSubmitComplaint = async (
    title: string, 
    description: string, 
    category: ComplaintCategory
  ) => {
    try {
      const response = await apiService.createComplaint({
        title,
        description,
        category,
        severity: 'medium',
        submittedBy: 'Anonymous',
      });

      console.log('createComplaint response:', response);
      if (response && response.success) {
        const respData = response.data || {};
        const newComplaint: Complaint = {
          id: respData._id ?? respData.id ?? Date.now().toString(),
          title: respData.title ?? title,
          description: respData.description ?? description,
          category: (respData.category ?? category) as ComplaintCategory,
          severity: respData.severity ?? 'medium',
          status: respData.status ?? 'open',
          submittedBy: respData.submitted_by ?? respData.submittedBy ?? 'Anonymous',
          createdAt: respData.submitted_at ? new Date(respData.submitted_at) : new Date(),
          sentimentScore: Number(respData.sentiment_score ?? respData.sentimentScore ?? 0),
          sentimentLabel: (respData.sentiment_label ?? respData.sentimentLabel) as any,
          supportCount: respData.support_count ?? respData.supportCount ?? 0,
        };
        setComplaints([newComplaint, ...complaints]);
        toast({
          title: 'Success',
          description: 'Your complaint has been submitted.',
        });
      }

      // Return full response so the form can display sentiment
      return response;
    } catch (err) {
      console.error('Failed to submit to backend, saving locally', err);
      // Fallback to local state management
      const newComplaint: Complaint = {
        id: Date.now().toString(),
        title,
        description,
        category,
        severity: 'medium',
        status: 'open',
        submittedBy: 'Anonymous',
        createdAt: new Date(),
        supportCount: 0,
      };
      setComplaints([newComplaint, ...complaints]);
      toast({
        title: 'Submitted',
        description: 'Your complaint has been saved locally.',
      });

      return null;
    }
  };

  const handleSupportComplaint = async (id: string) => {
    // optimistic update
    setComplaints(complaints.map(c => 
      c.id === id ? { ...c, supportCount: (c.supportCount || 0) + 1 } : c
    ));

    try {
      const resp = await apiService.supportComplaint(id);
      if (resp.success && resp.data) {
        setComplaints(prev => prev.map(c => c.id === id ? { ...c, supportCount: resp.data.supportCount ?? (c.supportCount || 0) } : c));
      }
    } catch (err) {
      console.error('Failed to persist support to backend, keeping optimistic value.', err);
    }
  };

  // Compute sentiment totals from loaded complaints
  const sentimentTotals = complaints.reduce(
    (acc, c) => {
      const label = (c.sentimentLabel ?? c.sentiment_label ?? 'Neutral') as string;
      if (label === 'Positive') acc.positive += 1;
      else if (label === 'Negative') acc.negative += 1;
      else acc.neutral += 1;
      return acc;
    },
    { positive: 0, neutral: 0, negative: 0 }
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <HeroSection onScrollToForm={handleScrollToForm} />
        <div ref={formRef}>
          <ComplaintForm onSubmit={handleSubmitComplaint} />
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}
        <ComplaintList 
          complaints={complaints} 
          onSupport={handleSupportComplaint}
          isLoading={isLoading}
        />
      </main>
      <Footer positive={sentimentTotals.positive} neutral={sentimentTotals.neutral} negative={sentimentTotals.negative} />
    </div>
  );
};

export default Index;

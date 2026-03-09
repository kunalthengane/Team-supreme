export type ComplaintCategory = 'academics' | 'facilities' | 'safety' | 'administration' | 'other';
export type ComplaintSeverity = 'low' | 'medium' | 'high' | 'critical';
export type ComplaintStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface Complaint {
  id: string;
  title: string;
  description: string;
  category: ComplaintCategory;
  severity: ComplaintSeverity;
  status: ComplaintStatus;
  submittedBy: string;
  createdAt: Date;
  supportCount?: number;
  submittedAt?: Date;
  resolvedAt?: Date;
  resolution?: string;
  attachments?: string[];
  sentimentScore?: number;
  sentimentLabel?: 'Positive' | 'Neutral' | 'Negative';
}

export const categoryLabels: Record<ComplaintCategory, string> = {
  academics: 'Academics',
  facilities: 'Facilities',
  safety: 'Safety',
  administration: 'Administration',
  other: 'Other',
};

export const categoryIcons: Record<ComplaintCategory, string> = {
  academics: '📚',
  facilities: '🏛️',
  safety: '🛡️',
  administration: '📋',
  other: '💬',
};

export const categoryColors: Record<ComplaintCategory, string> = {
  academics: 'bg-blue-100 text-blue-700 border-blue-200',
  facilities: 'bg-green-100 text-green-700 border-green-200',
  safety: 'bg-red-100 text-red-700 border-red-200',
  administration: 'bg-purple-100 text-purple-700 border-purple-200',
  other: 'bg-gray-100 text-gray-700 border-gray-200',
};

export const severityLabels: Record<ComplaintSeverity, string> = {
  low: 'Low',
  medium: 'Medium',
  high: 'High',
  critical: 'Critical',
};

export const severityColors: Record<ComplaintSeverity, string> = {
  low: 'bg-blue-100 text-blue-700',
  medium: 'bg-yellow-100 text-yellow-700',
  high: 'bg-orange-100 text-orange-700',
  critical: 'bg-red-100 text-red-700',
};

export const statusLabels: Record<ComplaintStatus, string> = {
  open: 'Open',
  'in-progress': 'In Progress',
  resolved: 'Resolved',
  closed: 'Closed',
};

export const statusColors: Record<ComplaintStatus, string> = {
  open: 'bg-gray-100 text-gray-700',
  'in-progress': 'bg-blue-100 text-blue-700',
  resolved: 'bg-green-100 text-green-700',
  closed: 'bg-gray-500 text-gray-100',
};

export const sentimentColors: Record<'Positive' | 'Neutral' | 'Negative', string> = {
  Positive: 'bg-green-100 text-green-700 border-green-200',
  Neutral: 'bg-gray-100 text-gray-700 border-gray-200',
  Negative: 'bg-red-100 text-red-700 border-red-200',
};

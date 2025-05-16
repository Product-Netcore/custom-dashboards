export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  data: any;
  // Add other relevant properties if needed, e.g., steps
}

export const mockFunnelTemplates: FunnelTemplate[] = [
  {
    id: 'funnel-template-1',
    name: 'Standard Signup Funnel',
    description: 'Tracks user progress from visit to signup completion.',
    data: {},
  },
  {
    id: 'funnel-template-2',
    name: 'E-commerce Checkout Funnel',
    description: 'Monitors steps from adding to cart to purchase.',
    data: {},
  },
  {
    id: 'funnel-template-3',
    name: 'Lead Generation Funnel',
    description: 'Analyzes conversion from landing page view to form submission.',
    data: {},
  },
  {
    id: 'funnel-template-4',
    name: 'Onboarding Flow Funnel',
    description: 'Tracks user completion of key onboarding steps.',
    data: {},
  },
]; 
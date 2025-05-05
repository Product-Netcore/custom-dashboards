export interface FunnelTemplate {
  id: string;
  name: string;
  description: string;
  // Add other relevant properties if needed, e.g., steps
}

export const mockFunnelTemplates: FunnelTemplate[] = [
  {
    id: 'funnel-template-1',
    name: 'Standard Signup Funnel',
    description: 'Tracks user progress from visit to signup completion.',
  },
  {
    id: 'funnel-template-2',
    name: 'E-commerce Checkout Funnel',
    description: 'Monitors steps from adding to cart to purchase.',
  },
  {
    id: 'funnel-template-3',
    name: 'Lead Generation Funnel',
    description: 'Analyzes conversion from landing page view to form submission.',
  },
  {
    id: 'funnel-template-4',
    name: 'Onboarding Flow Funnel',
    description: 'Tracks user completion of key onboarding steps.',
  },
]; 
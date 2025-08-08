export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  client: string;
  description: string;
  url: string;
}

export const categories = [
  { id: 'interactive_masthead', name: 'Rich Media' },
  { id: 'web_portal', name: 'Web Portal' },
  { id: 'digital_marketing', name: 'Branding' },
  { id: 'game', name: 'Game' },
  { id: 'application', name: 'Application' },
];

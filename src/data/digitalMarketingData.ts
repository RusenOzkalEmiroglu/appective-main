export interface DigitalMarketingItem {
  id: number;
  title: string;
  client: string;
  description: string;
  image: string;
  services: string[];
  projectUrl?: string;
}

export const initialDigitalMarketingItems: DigitalMarketingItem[] = [
  {
    "title": "Digital Marketing Projects",
    "client": "Digital Marketing Projects",
    "description": "Digital Marketing Projects-Digital Marketing Projects",
    "image": "/images/interactive-mastheads/digital-marketing/digital-marketing-projects/preview-f8cecc9b56f56a6b.jpg",
    "services": [
      "servis"
    ],
    "projectUrl": "https://garanti.com.tr",
    "id": 4
  }
];

import fs from 'fs';
import path from 'path';

export interface Project {
  id: number;
  title: string;
  category: string;
  image: string;
  client: string;
  description: string;
  url: string;
}

interface CategoryConfig {
  path: string;
  category: string;
  titlePrefix: string;
  description: string;
}

const categories: CategoryConfig[] = [
  {
    path: 'web_portal',
    category: 'web_portal',
    titlePrefix: 'Web Portal',
    description: 'Web portal project with advanced features and modern design.'
  },
  {
    path: 'game',
    category: 'game',
    titlePrefix: 'Game',
    description: 'Interactive gaming experience with cutting-edge technology.'
  },
  {
    path: 'interactive_masthead',
    category: 'interactive_masthead',
    titlePrefix: 'Interactive Masthead',
    description: 'Engaging interactive masthead campaigns with stunning visuals.'
  },
  {
    path: 'digital_marketing',
    category: 'digital_marketing',
    titlePrefix: 'Digital Marketing',
    description: 'Strategic digital marketing solutions for brand growth.'
  }
];

export function getProjects(): Project[] {
  let allProjects: Project[] = [];
  let currentId = 1;

  for (const cat of categories) {
    const dirPath = path.join(process.cwd(), `public/images/our_works/${cat.path}`);
    
    if (fs.existsSync(dirPath)) {
      const files = fs.readdirSync(dirPath)
        .filter(file => file.toLowerCase().endsWith('.png') || file.toLowerCase().endsWith('.jpg') || file.toLowerCase().endsWith('.jpeg'))
        .sort();

      const projects = files.map((file, index) => ({
        id: currentId++,
        title: `${cat.titlePrefix} ${index + 1}`,
        category: cat.category,
        image: `/images/our_works/${cat.path}/${file}`,
        client: `Client ${index + 1}`,
        description: cat.description,
        url: `https://example.com/projects/${cat.path}-${index + 1}`
      }));

      allProjects = [...allProjects, ...projects];
    }
  }

  return allProjects;
}

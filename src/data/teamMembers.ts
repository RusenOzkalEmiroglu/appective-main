export interface TeamMember {
  id: number;
  name: string;
  position: string;
  image: string;
  bio?: string;
}

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'Turgay',
    position: 'Founder & Sales',
    image: '/images/persons/01.jpg',
    bio: 'With over 15 years of experience in digital marketing and creative direction, Turgay leads our team with vision and innovation.'
  },
  {
    id: 2,
    name: 'Özkal',
    position: 'Founder & Software / Artificial Intelligence',
    image: '/images/persons/02.jpg',
    bio: 'Özkal is our software and artificial intelligence expert, with deep knowledge in software and artificial intelligence digital marketing strategies.'
  },
  {
    id: 3,
    name: 'Turgut',
    position: 'Founder & Operation',
    image: '/images/persons/03.jpg',
    bio: 'Turgut brings operational excellence to every project, with expertise in business management and strategic planning.'
  },
  {
    id: 4,
    name: 'Mithat',
    position: 'Founder & Administrative',
    image: '/images/persons/04.jpg',
    bio: 'Mithat is our administrative director, with deep knowledge in digital marketing strategies, with expertise in SEO, content marketing, and social media campaigns.'
  },
  {
    id: 5,
    name: 'Yusuf',
    position: 'Performance Marketing',
    image: '/images/persons/05.jpg',
    bio: 'Yusuf is our marketing expert, with deep knowledge in performance marketing, analytics, and digital advertising strategies.'
  },
  {
    id: 6,
    name: 'Emre',
    position: 'Rich Media & Interactive Masthead',
    image: '/images/persons/06.jpg',
    bio: 'Emre is our rich media and interactive masthead expert, with deep knowledge in rich media and interactive masthead digital marketing strategies.'
  },
  {
    id: 7,
    name: 'Ceylin',
    position: 'Branding',
    image: '/images/persons/07.jpg',
    bio: 'Ceylin is our branding expert, with deep knowledge in digital marketing strategies, with expertise in SEO, content marketing, and social media campaigns.'
  }


];

export default teamMembers;

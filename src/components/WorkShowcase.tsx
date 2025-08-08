"use client";

import { useEffect, useRef, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useInView } from 'framer-motion';
import gsap from 'gsap';
import Image from 'next/image';
import { Project } from '@/utils/getProjects';
import { categories } from '@/data/projects';
import MastheadPopup from '@/components/MastheadPopup';
import ApplicationPopup from '@/components/ApplicationPopup';
// import GamePopup from '@/components/GamePopup'; // Placeholder for future GamePopup
import { MastheadItem } from '@/data/interactiveMastheadsData';

import { GameItem } from '@/data/gamesData';
import { DigitalMarketingItem } from '@/data/digitalMarketingData';
import { WebPortalItem } from '@/data/webPortalsData';

// Project interface is now imported from @/data/projects

const WorkShowcase = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: false, amount: 0.2 });
  const controls = useAnimation();
  // Set the default category to the first available real category
  const firstCategoryId = categories[0]?.id || '';
  const [activeCategory, setActiveCategory] = useState(firstCategoryId);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [selectedMasthead, setSelectedMasthead] = useState<MastheadItem | null>(null);
  const [selectedApplication, setSelectedApplication] = useState<any>(null);
  const [selectedGame, setSelectedGame] = useState<GameItem | null>(null); // Added state for selected game
  const [selectedDigitalMarketingItem, setSelectedDigitalMarketingItem] = useState<DigitalMarketingItem | null>(null);
  const [selectedWebPortalItem, setSelectedWebPortalItem] = useState<WebPortalItem | null>(null);
  const projectsContainerRef = useRef<HTMLDivElement>(null);

  // Categories are now imported from @/data/projects

  // Projects are now imported from @/data/projects

  const [projects, setProjects] = useState<Project[]>([]);
  const [mastheads, setMastheads] = useState<MastheadItem[]>([]);
  const [applications, setApplications] = useState<any[]>([]);
  const [games, setGames] = useState<GameItem[]>([]); // Added state for games
  const [digitalMarketingItems, setDigitalMarketingItems] = useState<DigitalMarketingItem[]>([]);
  const [webPortalItems, setWebPortalItems] = useState<WebPortalItem[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      const response = await fetch('/api/projects');
      const data = await response.json();
      setProjects(data);
    };
    fetchProjects();
    
    // Also fetch mastheads for the interactive masthead category
    const fetchMastheads = async () => {
      const response = await fetch('/api/mastheads');
      if (response.ok) {
        const data = await response.json();
        setMastheads(data);
      }
    };
    fetchMastheads();
    
    // Fetch applications data
    const fetchApplications = async () => {
      const response = await fetch('/api/applications');
      if (response.ok) {
        const data = await response.json();
        setApplications(data);
      }
    };
    fetchApplications();

    // Fetch games data
    const fetchGames = async () => {
      const response = await fetch('/api/games');
      if (response.ok) {
        const data = await response.json();
        setGames(data);
      }
    };
    fetchGames();

    // Fetch digital marketing items data
    const fetchDigitalMarketingItems = async () => {
      const response = await fetch('/api/digital-marketing');
      if (response.ok) {
        const data = await response.json();
        setDigitalMarketingItems(data);
      }
    };
    fetchDigitalMarketingItems();

    const fetchWebPortals = async () => {
      const response = await fetch('/api/web-portals');
      if (response.ok) {
        const data = await response.json();
        setWebPortalItems(data);
      }
    };
    fetchWebPortals();
  }, []);

  // If the active category is interactive_masthead or application, use appropriate data
  const filteredProjects = activeCategory === 'interactive_masthead' 
    ? mastheads.slice(0, 6).map((masthead, index) => ({
        id: index + 1000, // Use a different ID range to avoid conflicts
        title: masthead.title,
        category: 'interactive_masthead',
        image: masthead.image,
        client: masthead.brand,
        description: masthead.popupDescription,
        url: masthead.popupHtmlPath
    }))
    : activeCategory === 'application'
    ? applications.map((app) => ({
        id: app.id + 2000, // Use a different ID range to avoid conflicts
        title: app.title,
        category: 'application',
        image: app.image,
        client: 'Various',
        description: app.description,
        url: '' // Or a link to the game if available
      }))
    : activeCategory === 'game' // Assuming 'game' is the category ID
    ? games.map((game) => ({
        id: game.id + 3000, // Use a different ID range
        title: game.title,
        category: 'game',
        image: game.image,
        client: 'In-house', // Or derive from game data if available
        description: game.description,
        url: game.projectUrl || '' // Use game.projectUrl for the project's URL
      }))
    : activeCategory === 'digital_marketing'
    ? digitalMarketingItems.map((item) => ({
        id: item.id + 4000, // Use a different ID range
        title: item.title,
        category: 'digital_marketing',
        image: item.image,
        client: item.client,
        description: item.description,
        url: item.projectUrl || ''
      }))
    : activeCategory === 'web_portal'
    ? webPortalItems.map((item) => ({
        id: item.id + 5000, // Use a different ID range
        title: item.title,
        category: 'web_portal',
        image: item.image,
        client: item.client,
        description: item.description,
        url: item.projectUrl || ''
      }))
    : projects.filter(project => project.category === activeCategory);

  useEffect(() => {
    if (isInView) {
      controls.start('visible');
    }
  }, [isInView, controls]);

  useEffect(() => {
    if (!projectsContainerRef.current) return;
    
    // Wait for DOM elements to be available
    const timer = setTimeout(() => {
      const projectCards = projectsContainerRef.current?.querySelectorAll('.project-card');
      
      if (projectCards && projectCards.length > 0) {
        const tl = gsap.timeline();
        
        tl.fromTo(
          projectCards,
          { 
            y: 50,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power3.out',
          }
        );
      }
    }, 100);
    
    return () => clearTimeout(timer);
  }, [activeCategory]);

  const openProjectDetails = (project: Project) => {
    setActiveProject(project);
    document.body.style.overflow = 'hidden';
  };

  const closeProjectDetails = () => {
    setActiveProject(null);
    document.body.style.overflow = 'auto';
  };

  return (
    <section id="work" ref={sectionRef} className="section py-24 relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-[#07081e]/70 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-64 bg-gradient-to-t from-[#07081e]/70 to-transparent"></div>
      </div>
      <div className="container mx-auto px-4 md:px-6 relative z-10">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 30 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6 gradient-text">
            Our Work
          </h2>
          <p className="text-white/70 max-w-2xl mx-auto text-lg">
            Discover how we help brands stand out in the digital world with our creative solutions.
          </p>
        </motion.div>
        
        <motion.div
          className="flex flex-wrap justify-center gap-4 mb-12"
          initial="hidden"
          animate={controls}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.6,
                delay: 0.2,
                ease: [0.22, 1, 0.36, 1]
              }
            }
          }}
        >
          {categories.filter(category => category.id !== 'all').map((category) => (
            <motion.button
              key={category.id}
              className={`px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                activeCategory === category.id
                  ? 'bg-primary text-white'
                  : 'bg-white/10 text-white/70 hover:bg-white/20'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setActiveCategory(category.id)}
            >
              {category.name}
            </motion.button>
          ))}
        </motion.div>
        
        <div className="space-y-16">
          <div ref={projectsContainerRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.map((project) => (
            <motion.div
              key={project.id}
              className="project-card group relative overflow-hidden rounded-xl cursor-pointer"
              whileHover={{ y: -10 }}
              onClick={() => {
                if (activeCategory === 'interactive_masthead') {
                  const originalMasthead = mastheads.find(m => m.popupHtmlPath === project.url);
                  if (originalMasthead) {
                    setSelectedMasthead(originalMasthead);
                    document.body.style.overflow = 'hidden';
                  }
                } else if (activeCategory === 'application') {
                  const originalApp = applications.find(app => app.id === project.id - 2000);
                  if (originalApp) {
                    setSelectedApplication(originalApp);
                    document.body.style.overflow = 'hidden';
                  }
                } else if (activeCategory === 'game') {
                  const originalGame = games.find(g => g.id === project.id - 3000);
                  if (originalGame) {
                    setSelectedGame(originalGame);
                    // Potentially open a GamePopup here
                    document.body.style.overflow = 'hidden';
                  }
                } else if (activeCategory === 'digital_marketing') {
                  const originalDMItem = digitalMarketingItems.find(dm => dm.id === project.id - 4000);
                  if (originalDMItem) {
                    setSelectedDigitalMarketingItem(originalDMItem);
                    document.body.style.overflow = 'hidden';
                  }
                } else if (activeCategory === 'web_portal') {
                  const originalWPItem = webPortalItems.find(wp => wp.id === project.id - 5000);
                  if (originalWPItem) {
                    setSelectedWebPortalItem(originalWPItem);
                    document.body.style.overflow = 'hidden';
                  }
                } else {
                  openProjectDetails(project);
                }
              }}
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110"
                  style={{ backgroundImage: `url(${project.image})` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent opacity-70" />
              </div>
              
              <div className="absolute bottom-0 left-0 w-full p-6 transform translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs rounded-full mb-3">
                  {categories.find(cat => cat.id === project.category)?.name}
                </span>
                <h3 className="text-xl font-bold text-white mb-1">{project.title}</h3>
                <p className="text-white/80 text-sm">{project.client}</p>
              </div>
            </motion.div>
          ))}
          </div>
          
          {/* Interactive Mastheads Button */}
          {activeCategory === 'interactive_masthead' && (
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <motion.button
                onClick={() => window.open('/interactive-mastheads', '_blank')}
                className="magnetic interactive-btn bg-gradient-to-r from-purple-600 via-pink-600 to-red-500 text-white px-8 py-4 rounded-full text-lg font-medium transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-purple-500/20 flex items-center gap-2 group"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Let's Look All Interactive Mastheads
                <svg
                  className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 7l5 5m0 0l-5 5m5-5H6"
                  />
                </svg>
              </motion.button>
            </motion.div>
          )}
        </div>
        
        {/* Removed the "View All Our Interactive Mastheads" button as requested */}
      </div>
      
      {/* Project Details Modal */}
      {activeProject && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative bg-dark/80 border border-white/10 rounded-2xl w-full max-w-4xl overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 30 }}
          >
            <button
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-dark/50 flex items-center justify-center text-white/80 hover:text-white transition-colors"
              onClick={closeProjectDetails}
            >
              ✕
            </button>
            
            <div className="grid grid-cols-1 md:grid-cols-2">
              <div className="relative aspect-square md:aspect-auto">
                <div 
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${activeProject.image})` }}
                />
              </div>
              <div className="p-8">
                <span className="inline-block px-3 py-1 bg-primary/80 text-white text-xs rounded-full mb-3">
                  {categories.find(cat => cat.id === activeProject.category)?.name}
                </span>
                <h3 className="text-2xl font-bold text-white mb-2">{activeProject.title}</h3>
                <p className="text-primary font-medium mb-6">{activeProject.client}</p>
                <p className="text-white/80 mb-8">{activeProject.description}</p>
                <a 
                  href={activeProject.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="magnetic interactive-btn bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 inline-block"
                >
                  Visit Project
                </a>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      <MastheadPopup 
        masthead={selectedMasthead} 
        onClose={() => {
          setSelectedMasthead(null);
          document.body.style.overflow = 'auto';
        }} 
      />
      
      {selectedApplication && (
        <ApplicationPopup application={selectedApplication} onClose={() => { setSelectedApplication(null); document.body.style.overflow = 'auto'; }} />
      )}
      
      {selectedWebPortalItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-lg" onClick={() => { setSelectedWebPortalItem(null); document.body.style.overflow = 'auto'; }}>
          <div 
            className="relative bg-dark/80 border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setSelectedWebPortalItem(null); document.body.style.overflow = 'auto'; }}
              className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-dark/50 flex items-center justify-center text-white/80 hover:text-white transition-colors"
            >
              ✕
            </button>
            <div className="flex-shrink-0">
              <Image src={selectedWebPortalItem.image} alt={selectedWebPortalItem.title} width={800} height={600} className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="text-2xl font-bold">{selectedWebPortalItem.title}</h3>
              <p className="text-lg text-gray-300 mb-4">{selectedWebPortalItem.client}</p>
            </div>
            <div className="overflow-y-auto flex-grow scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-800 pr-2">
              <p className="text-gray-400">{selectedWebPortalItem.description}</p>
            </div>
            {selectedWebPortalItem.projectUrl && (
              <div className="mt-6 flex-shrink-0">
                <a href={selectedWebPortalItem.projectUrl} target="_blank" rel="noopener noreferrer" className={`magnetic interactive-btn bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-full text-sm font-medium transition-all duration-300 inline-block w-full text-center`}>
                  Visit Project
                </a>
              </div>
            )}
          </div>
        </div>
      )}

      {selectedGame && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-lg" onClick={() => { setSelectedGame(null); document.body.style.overflow = 'auto'; }}>
          {/* Popup container with max height and flex column layout */}
          <div 
            className="relative bg-dark/80 border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setSelectedGame(null); document.body.style.overflow = 'auto'; }} 
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 text-white/70 hover:text-white flex items-center justify-center text-xl transition-colors"
              aria-label="Close popup"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-4 flex-shrink-0 pr-8">{selectedGame.title}</h3> {/* Added pr-8 to title to avoid overlap with X button */}
            
            {/* Image container with max height */}
            <div className="mb-4 overflow-hidden rounded-md flex-shrink-0 max-h-[40vh]">
              <Image src={selectedGame.image} alt={selectedGame.title} width={800} height={600} className="w-full h-full object-contain" />
            </div>
            
            {/* Scrollable content area for text details */}
            <div className="overflow-y-auto flex-grow pr-2">
              <p className="mb-2 whitespace-pre-wrap">{selectedGame.description}</p>
              <p className="text-sm text-gray-400">Platforms: {selectedGame.platforms}</p>
              <p className="text-sm text-gray-400 mb-4">Features: {selectedGame.features.join(', ')}</p>
            </div>
            
            <div className="mt-4 flex space-x-3 flex-shrink-0">
              {/* Removed the bottom Close button */}
              {selectedGame.projectUrl && (
                <button 
                  onClick={() => {
                    if (selectedGame.projectUrl) {
                      window.open(selectedGame.projectUrl, '_blank', 'noopener,noreferrer');
                    }
                  }} 
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex-grow"
                >
                  Visit Project
                </button>
              )}
              {!selectedGame.projectUrl && (
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded opacity-50 cursor-not-allowed flex-grow"
                  disabled
                >
                  Visit Project (No URL)
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Digital Marketing Item Popup */}
      {selectedDigitalMarketingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-dark/90 backdrop-blur-lg" onClick={() => { setSelectedDigitalMarketingItem(null); document.body.style.overflow = 'auto'; }}>
          <div 
            className="relative bg-dark/80 border border-white/10 rounded-2xl w-full max-w-md p-6 text-white flex flex-col max-h-[90vh]" 
            onClick={(e) => e.stopPropagation()}
          >
            <button 
              onClick={() => { setSelectedDigitalMarketingItem(null); document.body.style.overflow = 'auto'; }} 
              className="absolute top-4 right-4 z-10 w-8 h-8 rounded-full bg-black/30 text-white/70 hover:text-white flex items-center justify-center text-xl transition-colors"
              aria-label="Close popup"
            >
              ✕
            </button>
            <h3 className="text-2xl font-bold mb-1 flex-shrink-0 pr-8">{selectedDigitalMarketingItem.title}</h3>
            <p className="text-sm text-purple-400 mb-3 flex-shrink-0">Client: {selectedDigitalMarketingItem.client}</p>
            
            <div className="mb-4 overflow-hidden rounded-md flex-shrink-0 max-h-[40vh]">
              <Image src={selectedDigitalMarketingItem.image} alt={selectedDigitalMarketingItem.title} width={800} height={600} className="w-full h-full object-contain" />
            </div>
            
            <div className="overflow-y-auto flex-grow pr-2 text-sm">
              <p className="mb-3 whitespace-pre-wrap">{selectedDigitalMarketingItem.description}</p>
              <p className="text-gray-400 mb-3">Services: {selectedDigitalMarketingItem.services.join(', ')}</p>
            </div>
            
            <div className="mt-4 flex space-x-3 flex-shrink-0">
              {selectedDigitalMarketingItem.projectUrl && (
                <button 
                  onClick={() => {
                    if (selectedDigitalMarketingItem.projectUrl) {
                      window.open(selectedDigitalMarketingItem.projectUrl, '_blank', 'noopener,noreferrer');
                    }
                  }} 
                  className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700 transition-colors flex-grow"
                >
                  Visit Project
                </button>
              )}
              {!selectedDigitalMarketingItem.projectUrl && (
                <button 
                  className="px-4 py-2 bg-purple-600 text-white rounded opacity-50 cursor-not-allowed flex-grow"
                  disabled
                >
                  Visit Project (No URL)
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default WorkShowcase;

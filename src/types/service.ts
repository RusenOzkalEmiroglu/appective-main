export interface ServiceCategory {
  id: string; // Unique identifier (e.g., "cpi", "rich-media")
  name: string; // Display name (e.g., "CPI", "Rich Media")
  description: string; // Short description shown on the card
  icon?: string; // Emoji or SVG icon string
  folderName: string; // Folder name in /public/images/services/ for pop-up images
  imageUrl?: string; // URL for the main service image
  // Optional: Add fields for more complex pop-up content if needed later
  // popupTitle?: string;
  // popupRichContent?: string;
  // popupVideoUrl?: string;
}

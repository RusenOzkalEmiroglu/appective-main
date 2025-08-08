// Appective Theme Colors and Styles

export const primaryTextColor = 'text-white';
export const secondaryTextColor = 'text-gray-300';
export const accentColor = 'text-purple-400'; // For links or highlights
export const highlightColor = 'text-purple-500'; // For more prominent highlights

export const primaryBgColor = 'bg-black'; // Main background
export const secondaryBgColor = 'bg-gray-800'; // Cards, inputs, modals
export const tertiaryBgColor = 'bg-gray-700'; // Hover states, borders

export const accentBgColor = 'bg-purple-600'; // Buttons, active states
export const hoverAccentBgColor = 'hover:bg-purple-700';

export const buttonStyles = "px-4 py-2 rounded-md font-semibold text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500";

export const inputBg = 'bg-gray-800'; // Consistent with secondaryBgColor
export const inputBorder = 'border-gray-600'; // Slightly darker than tertiary for contrast

export const buttonClasses = `${accentBgColor} ${primaryTextColor} py-2 px-4 rounded-md ${hoverAccentBgColor} transition-colors`;
export const secondaryButtonClasses = `${tertiaryBgColor} ${primaryTextColor} py-2 px-4 rounded-md hover:bg-gray-600 transition-colors`;

// You can add more shared constants here as needed
// e.g., for font sizes, spacing, border radius, etc.

// Page Structure & Typography
export const pageTitleClasses = `text-2xl md:text-3xl font-bold ${primaryTextColor}`;

// Card Styling
export const cardClasses = `${secondaryBgColor} rounded-xl shadow-xl border border-gray-700/50`; // Added some more common card styles

// Button Aliases and Specifics
export const primaryButtonClasses = buttonClasses; // Alias for consistency if imported directly
export const iconButtonClasses = `p-2 rounded-full ${secondaryTextColor} hover:bg-gray-700 hover:text-white transition-colors`;

// Input Field Styling
export const inputBorderClasses = inputBorder; // Alias for consistency
export const inputBaseClasses = `w-full ${inputBg} border ${inputBorderClasses} rounded-lg ${primaryTextColor} focus:outline-none focus:ring-2 focus:ring-purple-500 transition-shadow shadow-sm`;

// Table Styling
export const tableHeaderClasses = `py-3 px-4 text-left text-xs font-medium ${secondaryTextColor} uppercase tracking-wider bg-gray-700/30`;
export const tableCellClasses = `py-3 px-4 whitespace-nowrap text-sm ${primaryTextColor}`;

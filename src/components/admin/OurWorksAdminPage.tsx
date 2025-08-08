"use client";

import React from 'react';

const OurWorksAdminPage = ({ onSectionChange }: { onSectionChange: (section: string) => void }) => {
  const primaryTextColor = 'text-white';
  const secondaryTextColor = 'text-gray-300';
  const accentBgColor = 'bg-purple-600';
  const hoverAccentBgColor = 'hover:bg-purple-700';
  const inputBg = 'bg-gray-800';

  const workSections = [
    { key: 'mastheads', title: 'Rich Media', description: 'Manage your rich media and interactive masthead banners' },
    { key: 'web-portals', title: 'Applications', description: 'Manage your application entries' },
    { key: 'games', title: 'Games', description: 'Manage your game entries' },
    { key: 'digital-marketing', title: 'Digital Marketing', description: 'Manage your digital marketing projects' },
    { key: 'web-portal', title: 'Web Portal', description: 'Manage your company web portals' },
  ];

  return (
    <div>
      <h1 className={`text-2xl font-bold ${primaryTextColor} mb-6`}>Our Works</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {workSections.map(section => (
          <div key={section.key} className={`${inputBg} p-6 rounded-lg shadow-md`}>
            <h2 className={`text-xl font-semibold ${primaryTextColor} mb-2`}>{section.title}</h2>
            <p className={secondaryTextColor}>{section.description}</p>
            <div className="mt-4">
              <button 
                onClick={() => onSectionChange(section.key)}
                className={`inline-block ${accentBgColor} ${primaryTextColor} py-2 px-4 rounded-md ${hoverAccentBgColor} transition-colors text-sm`}
              >
                Manage
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OurWorksAdminPage;

"use client";

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface TopBannerProps {
  imageUrl: string;
  width: number;
  height: number;
  targetUrl?: string;
}

const TopBanner: React.FC<TopBannerProps> = ({ imageUrl, width, height, targetUrl }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!isVisible) {
    return null;
  }

  // The banner image content, which will be centered.
  const imageContent = (
    <div className="w-full" style={{ maxWidth: `${width}px` }}>
      <Image
        src={imageUrl}
        alt="Promotional Banner"
        width={width}
        height={height}
        className="w-full h-auto"
        priority
        unoptimized
      />
    </div>
  );

  return (
    // The main container is relative, providing the positioning context for the close button.
    <div className="relative w-full flex justify-center items-center p-2">
      {targetUrl ? (
        <Link href={targetUrl} passHref legacyBehavior>
          <a target="_blank" rel="noopener noreferrer" className="flex justify-center w-full">
            {imageContent}
          </a>
        </Link>
      ) : (
        imageContent
      )}

      {/* The button is now a direct child of the full-width relative container. */}
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black bg-opacity-30 text-white rounded-full w-7 h-7 flex items-center justify-center text-base font-bold hover:bg-opacity-60 transition-all z-10"
        aria-label="Close banner"
      >
        &times;
      </button>
    </div>
  );
};

export default TopBanner;

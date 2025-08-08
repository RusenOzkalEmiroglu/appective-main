'use client';

import { useState, useEffect } from 'react';
import { IoPhonePortraitOutline, IoTabletPortraitOutline, IoDesktopOutline, IoCloseOutline } from 'react-icons/io5';

const devices = [
  { name: 'Mobil (Küçük)', width: 320, height: 568, icon: IoPhonePortraitOutline },
  { name: 'Mobil (Orta)', width: 375, height: 667, icon: IoPhonePortraitOutline },
  { name: 'Mobil (Büyük)', width: 425, height: 812, icon: IoPhonePortraitOutline },
  { name: 'Tablet', width: 768, height: 1024, icon: IoTabletPortraitOutline },
  { name: 'Laptop', width: 1024, height: 768, icon: IoDesktopOutline },
  { name: 'Tam Ekran', width: '100%', height: '100%', icon: IoDesktopOutline },
];

export default function ResponsiveTester() {
  const [selectedDevice, setSelectedDevice] = useState(devices[0]);
  const [isOpen, setIsOpen] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    // Sayfanın URL'sini al
    setCurrentUrl(window.location.href);
  }, []);

  return (
    <>
      <div className="fixed bottom-4 right-4 z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-blue-600 text-white p-2 rounded-full shadow-lg hover:bg-blue-700 transition-all"
        >
          <IoPhonePortraitOutline size={24} />
        </button>

        {isOpen && (
          <div className="absolute bottom-12 right-0 bg-white rounded-lg shadow-xl p-4 w-64">
            <h3 className="text-lg font-bold mb-2">Responsive Test</h3>
            <div className="space-y-2">
              {devices.map((device) => (
                <button
                  key={device.name}
                  onClick={() => {
                    setSelectedDevice(device);
                    setShowPreview(true);
                  }}
                  className={`flex items-center w-full p-2 rounded ${
                    selectedDevice.name === device.name ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
                  }`}
                >
                  <device.icon className="mr-2" size={18} />
                  <span>{device.name}</span>
                  <span className="ml-auto text-xs text-gray-500">
                    {device.width === '100%' ? 'Tam' : `${device.width}x${device.height}`}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {showPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
          <div className="bg-white p-4 rounded-lg shadow-lg max-w-full max-h-full flex flex-col">
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-lg font-bold">
                {selectedDevice.name} ({selectedDevice.width === '100%' ? 'Tam Ekran' : `${selectedDevice.width}x${selectedDevice.height}`})
              </h3>
              <button 
                onClick={() => setShowPreview(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <IoCloseOutline size={24} />
              </button>
            </div>
            
            <div className="overflow-auto border border-gray-300 rounded flex items-center justify-center bg-gray-100">
              <div 
                className="relative bg-white shadow-lg overflow-hidden transition-all duration-300"
                style={{
                  width: typeof selectedDevice.width === 'string' ? selectedDevice.width : `${selectedDevice.width}px`,
                  height: typeof selectedDevice.height === 'string' ? selectedDevice.height : `${selectedDevice.height}px`,
                  maxHeight: '80vh',
                  maxWidth: '100%'
                }}
              >
                <iframe
                  id="responsive-iframe"
                  src={currentUrl}
                  className="w-full h-full border-0"
                  title="Responsive Preview"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

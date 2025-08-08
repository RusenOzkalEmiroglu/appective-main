import React, { useEffect, useState } from "react";
import { Facebook, Linkedin, Instagram, Twitter } from "lucide-react";

const SOCIAL_ICON_MAP: Record<string, any> = {
  facebook: Facebook,
  linkedin: Linkedin,
  instagram: Instagram,
  twitter: Twitter,
};

export default function SocialLinksDashboardWidget() {
  const [socialLinks, setSocialLinks] = useState<{ platform: string; url: string }[]>([]);
  useEffect(() => {
    fetch("/data/socialLinks.json")
      .then((res) => res.json())
      .then((data) => setSocialLinks(Array.isArray(data) ? data : []))
      .catch(() => setSocialLinks([]));
  }, []);

  return (
    <div className="bg-gray-900 rounded-xl shadow-md p-5 mb-6">
      <h3 className="text-lg font-bold text-white mb-3">Sosyal Medya Hesapları</h3>
      <div className="flex space-x-4">
        {socialLinks.length === 0 && (
          <span className="text-gray-400 text-sm">Hiç sosyal medya bağlantısı eklenmemiş.</span>
        )}
        {socialLinks.filter(s => SOCIAL_ICON_MAP[s.platform]).map((social) => {
          const Icon = SOCIAL_ICON_MAP[social.platform];
          return (
            <a
              key={social.platform}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-purple-400 hover:bg-purple-600 hover:text-white transition-colors"
              title={social.platform.charAt(0).toUpperCase() + social.platform.slice(1)}
            >
              <Icon size={22} />
            </a>
          );
        })}
      </div>
      <a
        href="/admin/social-links"
        className="mt-4 inline-block text-xs text-purple-400 hover:underline hover:text-purple-300"
      >
        Sosyal medya hesaplarını yönet
      </a>
    </div>
  );
}

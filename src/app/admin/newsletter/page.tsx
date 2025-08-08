"use client";

import { useState, useEffect } from 'react';
import NewsletterSubscribers from '@/components/admin/NewsletterSubscribers';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function NewsletterManagementPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Link 
          href="/admin" 
          className="inline-flex items-center text-sm text-gray-600 hover:text-purple-600 transition-colors"
        >
          <ArrowLeft size={16} className="mr-1" />
          Back to Admin Dashboard
        </Link>
      </div>
      
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Newsletter Management</h1>
      
      <div className="mb-8">
        <NewsletterSubscribers />
      </div>
    </div>
  );
}

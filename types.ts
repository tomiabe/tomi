import React from 'react';

export interface Section {
  id: string;
  title: string;
  content: React.ReactNode;
}

export type IconProps = {
  className?: string;
};

// --- Data Types for CMS ---

export type SocialPlatform = 'twitter' | 'instagram' | 'linkedin' | 'envelope' | 'medium' | 'substack' | 'generic';

export interface SocialLink {
  id: string;
  platform: SocialPlatform;
  url: string;
  label?: string; // For Connect section
  sublabel?: string; // For Connect section
}

export interface Project {
  id: string;
  title: string;
  description: string;
  linkText: string;
  linkUrl: string;
  // Studio specific fields
  category?: string; 
  logoUrl?: string; // Replaced initials with image URL
  tags?: string[];
}

export interface Publication {
  id: string;
  title: string;
  category: string;
  description: string;
  linkText: string;
  linkUrl: string;
}

export interface ImageItem {
  id: string;
  thumb: string;
  full: string;
}

export interface SiteSettings {
  siteTitle: string;
  favicon: string;
  accentColor: string; // Hex code
  fontFamily: 'sans' | 'manrope' | 'serif' | 'mono';
  maxWidth: 'max-w-5xl' | 'max-w-6xl' | 'max-w-7xl' | 'max-w-full';
  darkModeTheme: 'black' | 'grey' | 'navy' | 'maroon';
  lightModeTheme: 'white' | 'ash' | 'ivory' | 'sky';
}

export interface SiteContent {
  settings: SiteSettings;
  intro: {
    name: string;          // Sidebar Name
    subtitle: string;      // Sidebar Subtitle
    avatar: string;        // Sidebar Avatar
    welcomeText: string;   // Main Content Typewriter Text
    description: string;   // Main Content Description
    socials: SocialLink[]; // Sidebar Socials
  };
  who: {
    bio: { text: string }[]; 
    shapesMe: {
      title: string;
      content: { text: string }[]; 
      quote: string;
      quoteRef: string;
    }
  };
  build: {
    description: string;
    projects: Project[];
    footer: string;
  };
  learning: {
    description: string;
    publications: Publication[];
    notesTitle: string;
    notesDescription: string;
    notesLinks: { label: string; url: string }[];
  };
  share: {
    description: string;
    highlights: { text: string }[];
    mentorshipTitle: string;
    mentorshipContent: string;
    topics: { text: string }[];
    collabTitle: string;
    collabDescription: string;
    buttons: { label: string; url: string; primary: boolean }[];
  };
  see: {
    description: string;
    images: ImageItem[];
    links: { label: string; url: string }[];
  };
  connect: {
    title: string;
    description: string;
    links: SocialLink[];
    bookingLink?: string; // Added separate booking link
  };
}

// --- Studio Specific Types ---

export interface StudioContent {
  hero: {
    headline: string;
    subheadline: string;
    description: string;
    ctaPrimary: string;
    ctaSecondary: string;
  };
  problem: {
    title: string;
    subtitle: string;
    items: { title: string; description: string }[];
  };
  approach: {
    title: string;
    subtitle: string;
    description: string;
    systems: { title: string; description: string }[];
  };
  services: {
    description: string;
    items: {
      title: string;
      description: string;
      subItems: string[];
    }[];
  };
  workModels: {
    items: {
      title: string;
      role: string;
      description: string;
    }[];
  };
  selectedWork: {
    tags: string[];
    projects: Project[];
  };
  about: {
    bio: string;
    description: string;
    avatar: string;
    name: string;
    role: string;
    mentorshipItems: string[];
  };
  contact: {
    title: string;
    description: string;
    email: string;
    location: string;
    footerText: string;
  };
}
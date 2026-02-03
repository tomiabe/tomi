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
  image: string; // Changed from thumb and full to single image
}

export interface SiteSettings {
  siteTitle: string;
  favicon: string;
  accentColor: string; // Hex code
  fontFamily: 'sans' | 'manrope' | 'serif' | 'mono' | 'apple' | 'dmsans' | 'figtree' | 'ibmplex' | 'plusjakarta' | 'librefranklin' | 'publicsans';
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
    avatarLinkToHome?: boolean; // Optional home link toggle
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
      closing?: string; // Added closing statement
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

export interface StudioHero {
  title: string;
  subtitle: string;
  cta_primary: string;
  cta_primary_link: string;
  cta_secondary: string;
  cta_secondary_link: string;
  footer_text: string;
}

export interface StudioProblem {
  section_title: string;
  main_heading: string;
  description: string;
  items: { title: string; description: string; icon: string }[];
}

export interface StudioApproach {
  section_title: string;
  main_heading: string;
  intro_text: string;
  cards: { title: string; description: string; icon: string; color?: string }[];
  footer_text: string;
}

export interface StudioServices {
  section_title: string;
  description: string;
  items: { title: string; description: string; list: string[] }[];
}

export interface StudioWorkModels {
  section_title: string;
  models: { title: string; role: string; description: string }[];
  footer_text: string;
}

export interface StudioSelectedWork {
  section_title: string;
  main_heading: string;
  tags: string[];
  projects: {
    title: string;
    category: string;
    location: string;
    description: string;
    linkText: string;
    linkUrl: string;
    imageUrl: string;
    logoUrl: string;
  }[];
  footer_text: string;
}

export interface StudioAbout {
  section_title: string;
  main_heading: string;
  intro_paragraphs: string[];
  speaking_title: string;
  speaking_items: string[];
  image_url: string;
  name: string;
  role: string;
}

export interface StudioContact {
  title: string;
  description: string;
  button_text: string;
  booking_link: string;
  email: string;
  location: string;
  socials: { platform: string; url: string }[];
  footer_copyright: string;
  footer_tagline: string;
}

export interface StudioContent {
  navigation: { label: string; url: string }[];
  hero: StudioHero;
  problem: StudioProblem;
  approach: StudioApproach;
  services: StudioServices;
  workModels: StudioWorkModels;
  selectedWork: StudioSelectedWork;
  about: StudioAbout;
  contact: StudioContact;
}
export interface Project {
    title: string;
    category: string;
    description: string;
    location: string;
    linkText: string;
    linkUrl: string;
    imageUrl: string;
    logoUrl: string;
}

export interface ServiceItem {
    title: string;
    description: string;
    list: string[];
}

export interface Model {
    title: string;
    role: string;
    description: string;
}

export enum Theme {
    LIGHT = 'light',
    DARK = 'dark',
}

export interface NavLink {
    label: string;
    url: string;
}

export interface HeroData {
    title: string;
    subtitle: string;
    cta_primary: string;
    cta_primary_link: string;
    cta_secondary: string;
    cta_secondary_link: string;
    footer_text: string;
}

export interface ProblemItem {
    title: string;
    description: string;
    icon: string;
}

export interface ProblemData {
    section_title: string;
    main_heading: string;
    description: string;
    items: ProblemItem[];
}

export interface ApproachCard {
    title: string;
    description: string;
    icon: string;
    color?: string;
}

export interface ApproachData {
    section_title: string;
    main_heading: string;
    intro_text: string;
    cards: ApproachCard[];
    footer_text: string;
}

export interface ServicesData {
    section_title: string;
    description: string;
    items: ServiceItem[];
}

export interface WorkModelsData {
    section_title: string;
    models: Model[];
    footer_text: string;
}

export interface SelectedWorkData {
    section_title: string;
    main_heading: string;
    tags: string[];
    projects: Project[];
    footer_text: string;
}

export interface AboutData {
    section_title: string;
    main_heading: string;
    intro_paragraphs: string[];
    speaking_title: string;
    speaking_items: string[];
    image_url: string;
    name: string;
    role: string;
}

export interface SocialLink {
    platform: string;
    url: string;
}

export interface ContactData {
    title: string;
    description: string;
    button_text: string;
    booking_link: string;
    email: string;
    location: string;
    socials: SocialLink[];
    footer_copyright: string;
    footer_tagline: string;
}

export interface SiteContent {
    navigation: NavLink[];
    hero: HeroData;
    problem: ProblemData;
    approach: ApproachData;
    services: ServicesData;
    workModels: WorkModelsData;
    selectedWork: SelectedWorkData;
    about: AboutData;
    contact: ContactData;
}

import CMS from 'decap-cms-app';

// Import main site styles so they are available
import '../../index.css';

import HomePreview from './previews/HomePreview';
import StudioPreview from './previews/StudioPreview';

// Register preview templates
CMS.registerPreviewTemplate('home', HomePreview);
CMS.registerPreviewTemplate('studio', StudioPreview);

// Ensure Tailwind + typography styles are available in the preview iframe
CMS.registerPreviewStyle('/admin/preview.css');

// Initialize the CMS
CMS.init();

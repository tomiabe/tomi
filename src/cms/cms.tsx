import CMS from 'decap-cms-app';

// Import main site styles so they are available
import '../../index.css';

import HomePreview from './previews/HomePreview';
import StudioPreview from './previews/StudioPreview';

// Initialize the CMS
CMS.init();

// Register preview templates
CMS.registerPreviewTemplate('home', HomePreview);
CMS.registerPreviewTemplate('studio', StudioPreview);

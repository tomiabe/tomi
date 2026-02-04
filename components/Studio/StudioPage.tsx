import React, { useEffect, useState } from 'react';
import StudioNavigation from './components/StudioNavigation';
import Hero from './components/Hero';
import Problem from './components/Problem';
import Approach from './components/Approach';
import Services from './components/Services';
import WorkModels from './components/WorkModels';
import SelectedWork from './components/SelectedWork';
import About from './components/About';
import Contact from './components/Contact';
import StudioInteractiveBackground from './components/StudioInteractiveBackground';
import { Theme } from './types';
import { StudioContent } from '../../types';
import { useEditor } from '../Editor/EditorContext';

// We ignore props passed from App.tsx as we use our own data/settings
interface StudioPageProps {
   // Keeping these optional to avoid breaking App.tsx if it passes them
   content?: any;
   settings?: any;
}

const StudioPage: React.FC<StudioPageProps> = (props) => {
   const { studioContent } = useEditor();
   const [theme, setTheme] = useState<Theme>(Theme.DARK);
   const [isManual, setIsManual] = useState(false);

   const content = (props.content || studioContent) as StudioContent;

   // Auto theme logic: 7pm (19) to 7am (7) is dark
   useEffect(() => {
      const checkTime = () => {
         if (isManual) return; // Skip if user manually toggled

         const hour = new Date().getHours();
         if (hour >= 19 || hour < 7) {
            setTheme(Theme.DARK);
         } else {
            setTheme(Theme.LIGHT);
         }
      };

      checkTime(); // Initial check
      const interval = setInterval(checkTime, 60000); // Check every minute
      return () => clearInterval(interval);
   }, [isManual]);

   // Apply class to HTML element
   useEffect(() => {
      const root = window.document.documentElement;
      if (theme === Theme.DARK) {
         root.classList.add('dark');
      } else {
         root.classList.remove('dark');
      }
   }, [theme]);

   const toggleTheme = () => {
      setIsManual(true);
      setTheme((prev: Theme) => prev === Theme.DARK ? Theme.LIGHT : Theme.DARK);
   };

   if (!content) return <div className="min-h-screen bg-black" />;

   return (
      <div className="min-h-screen bg-white dark:bg-[#000000] transition-colors duration-500 font-sans">
         <StudioNavigation theme={theme} toggleTheme={toggleTheme} links={content.navigation} />

         {/* Dynamic Background */}
         <StudioInteractiveBackground theme={theme} />

         <main className="relative z-10">
            <Hero data={content.hero} />
            <Problem data={content.problem} />
            <Approach data={content.approach} />
            <Services data={content.services} />
            <WorkModels data={content.workModels} />
            <SelectedWork data={content.selectedWork} />
            <About data={content.about} />
         </main>

         <Contact data={content.contact} />
      </div>
   );
};

export default StudioPage;
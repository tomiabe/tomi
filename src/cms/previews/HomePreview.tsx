import { useMemo } from 'react';
import { BrowserRouter } from 'react-router-dom';
import HomePage from '../../../components/Home/HomePage';
import PreviewWrapper from './PreviewWrapper';

const HomePreview = ({ entry }: { entry: any }) => {
    // Convert Immutable.js entry to plain object
    const data = useMemo(() => {
        return entry.getIn(['data']).toJS();
    }, [entry]);

    // Ensure we have minimal structure to prevent crashes if data is incomplete
    const safeData = {
        settings: data.settings || {},
        intro: data.intro || { name: '', subtitle: '', socials: [] },
        who: data.who || { bio: [], shapesMe: { content: [] } },
        build: data.build || { projects: [] },
        learning: data.learning || { publications: [], notesLinks: [] },
        share: data.share || { highlights: [], topics: [], buttons: [] },
        see: data.see || { images: [], links: [] },
        connect: data.connect || { links: [] }
    };

    return (
        <PreviewWrapper data={safeData}>
            <BrowserRouter>
                <div className="bg-white dark:bg-zinc-950 min-h-screen text-zinc-900 dark:text-zinc-100 font-sans transition-colors duration-300">
                    <HomePage
                        content={safeData}
                        theme="dark"
                        toggleTheme={() => { }}
                        openSettings={() => { }}
                    />
                </div>
            </BrowserRouter>
        </PreviewWrapper>
    );
};

export default HomePreview;

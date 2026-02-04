import React, { useMemo } from 'react';
import StudioPage from '../../../components/Studio/StudioPage';
import PreviewWrapper from './PreviewWrapper';

const StudioPreview = ({ entry }: { entry: any }) => {
    const data = useMemo(() => {
        return entry.getIn(['data']).toJS();
    }, [entry]);

    // Construct mock settings if needed, or rely on defaults
    const safeData = {
        navigation: data.navigation || [],
        hero: data.hero || {},
        problem: data.problem || {},
        approach: data.approach || {},
        services: data.services || {},
        workModels: data.workModels || {},
        selectedWork: data.selectedWork || {},
        about: data.about || {},
        contact: data.contact || {}
    };

    return (
        <PreviewWrapper data={safeData} isStudio={true}>
            <StudioPage content={safeData} />
        </PreviewWrapper>
    );
};

export default StudioPreview;

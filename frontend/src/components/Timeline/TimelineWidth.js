import { useState, useEffect, useRef } from 'react';

export const TimelineWidth = () => {

    const timelineRef = useRef(null);
    const [barWidth, setBarWidth] = useState(0);

    useEffect(() => {

        const updateBarWidth = () => {
            if (timelineRef.current) {
                const width = timelineRef.current.getBoundingClientRect().width;

                setBarWidth(width);
            }
        };

        updateBarWidth();

        window.addEventListener('resize', updateBarWidth);
        return () => window.removeEventListener('resize', updateBarWidth);
    }, []);

    return { timelineRef, barWidth };
};

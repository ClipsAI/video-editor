// React
import { ReactNode, createContext, useState, useRef, MutableRefObject } from 'react'

// Data
import { crops as crops_data } from '@/data/crops'

// Hooks
import { useVideoContext } from '@/hooks/video'

// Utils
import { getSegmentIndex } from '@/utils/crops'

// Third-party Libraries
import { useImmer, Updater } from 'use-immer'


type ResizerContextType = {
    crops: Crops,
    setCrops: Updater<Crops>,
    resizeLeft: number,
    setResizeLeft: SetState<number>,
    resizeMode: ResizeMode,
    setResizeMode: SetState<ResizeMode>,
    segments: Segment[],
    setSegments: Updater<Segment[]>,
    currentSegment: MutableRefObject<Segment>,
}

export const ResizerContext = createContext<ResizerContextType>({
    crops: crops_data,
    setCrops: async () => undefined,
    resizeLeft: 0,
    setResizeLeft: () => { },
    resizeMode: "9:16",
    setResizeMode: () => { },
    segments: [],
    setSegments: () => { },
    currentSegment: { current: crops_data.segments[0] },
});

export function ResizerProvider({ children }: { children: ReactNode }) {
    const { clip } = useVideoContext();

    const i = getSegmentIndex(clip.start_time, crops_data.segments);
    const currentSegment = useRef<Segment>(crops_data.segments[i]);

    const [crops, setCrops] = useImmer<Crops>(crops_data);
    const [segments, setSegments] = useImmer<Segment[]>(crops_data.segments);


    const [resizeLeft, setResizeLeft] = useState<number>(
        (crops_data.segments[i].x / crops_data.original_width) * 100
    );
    const [resizeMode, setResizeMode] = useState<ResizeMode>("9:16");
    
    const resizeContext = {
        crops, setCrops,
        resizeMode, setResizeMode,
        resizeLeft, setResizeLeft,
        currentSegment, segments, setSegments,
    };

    return (
        <ResizerContext.Provider value={resizeContext}>
            {children}
        </ResizerContext.Provider>
    )
}

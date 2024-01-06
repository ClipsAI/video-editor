// React
import { ReactNode, createContext, useState, useRef, MutableRefObject } from 'react'

// Data
import { crops as crops_data } from '@/data/crops'

// Third-party Libraries
import { useImmer, Updater } from 'use-immer'


type ResizerContextType = {
    crops: Crops,
    setCrops: Updater<Crops>,
    resizeLeft: number,
    setResizeLeft: Dispatch<SetStateAction<number>>,
    resizeMode: ResizeMode,
    setResizeMode: Dispatch<SetStateAction<ResizeMode>>,
    segments: Segment[],
    setSegments: Updater<Segment[]>,
    currSegment: MutableRefObject<Segment>,
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
    currSegment: { current: crops_data.segments[0] },
});

export function ResizerProvider({ children }: { children: ReactNode }) {
    const [crops, setCrops] = useImmer<Crops>(crops_data);
    const currSegment = useRef<Segment>(crops_data.segments[0]);
    const [segments, setSegments] = useImmer<Segment[]>(crops_data.segments);

    const [resizeLeft, setResizeLeft] = useState<number>(0);
    const [resizeMode, setResizeMode] = useState<ResizeMode>("9:16");
    
    const resizeContext = {
        crops, setCrops,
        resizeMode, setResizeMode,
        resizeLeft, setResizeLeft,
        currSegment, segments, setSegments,
    };

    return (
        <ResizerContext.Provider value={resizeContext}>
            {children}
        </ResizerContext.Provider>
    )
}
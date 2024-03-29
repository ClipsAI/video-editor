// React
import { createContext, useState, ReactNode } from 'react'

// Hooks
import { useVideoContext } from '@/hooks/video'


type TrimmerContextType = {
    startTime: number,
    setStartTime: SetState<number>,
    endTime: number,
    setEndTime: SetState<number>,
    trimStartTime: number,
    setTrimStartTime: SetState<number>,
    trimEndTime: number,
    setTrimEndTime: SetState<number>,
    startRange: number,
    setStartRange: SetState<number>,
    endRange: number,
    setEndRange: SetState<number>,
    trimming: boolean,
    setTrimming: SetState<boolean>,
}

export const TrimmerContext = createContext<TrimmerContextType>({
    startTime: 0,
    setStartTime: () => { },
    endTime: 0,
    setEndTime: () => { },
    trimStartTime: 0,
    setTrimStartTime: () => { },
    trimEndTime: 0,
    setTrimEndTime: () => { },
    startRange: 0,
    setStartRange: () => { },
    endRange: 0,
    setEndRange: () => { },
    trimming: false,
    setTrimming: () => { },
});

export function TrimmerProvider({ children }: { children: ReactNode }) {
    const { clip } = useVideoContext();

    const [startTime, setStartTime] = useState<number>(clip.start_time);
    const [endTime, setEndTime] = useState<number>(clip.end_time);
    const [trimStartTime, setTrimStartTime] = useState<number>(clip.start_time);
    const [trimEndTime, setTrimEndTime] = useState<number>(clip.end_time);
    const [startRange, setStartRange] = useState<number>(0);
    const [endRange, setEndRange] = useState<number>(100);
    const [trimming, setTrimming] = useState<boolean>(false);

    const trimContext = {
        startTime, setStartTime,
        endTime, setEndTime,
        trimStartTime, setTrimStartTime,
        trimEndTime, setTrimEndTime,
        startRange, setStartRange,
        endRange, setEndRange,
        trimming, setTrimming,
    };

    return (
        <TrimmerContext.Provider value={trimContext}>
            {children}
        </TrimmerContext.Provider>
    )
}

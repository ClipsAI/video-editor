'use client'

// Data
import { intervals } from '@/data/clips'
import { video as video_data } from '@/data/video'
import { transcript } from '@/data/transcript'

// React
import { ReactNode, createContext, useState, useRef, MutableRefObject, useEffect } from 'react'

// Utils
import { filterClips } from '@/utils/clips'

// Third-party Libraries
import { useImmer, Updater } from 'use-immer'
import { init } from 'next/dist/compiled/webpack/webpack'


type VideoContextType = {
    videoPlayer: MutableRefObject<HTMLVideoElement | null>,
    clip: Clip,
    setClip: Updater<Clip>,
    clips: Clip[],
    setClips: Updater<Clip[]>,
    video: Video,
    setVideo: Updater<Video>,
    muted: boolean,
    setMuted: SetState<boolean>,
    paused: boolean,
    setPaused: SetState<boolean>,
    currentTime: number,
    setTime: SetState<number>,
}

export const VideoContext = createContext<VideoContextType>({
    videoPlayer: { current: null },
    clip: video_data.clips[0],
    setClip: async () => undefined,
    clips: video_data.clips,
    setClips: async () => undefined,
    video: video_data,
    setVideo: async () => undefined,
    muted: false,
    setMuted: () => { },
    paused: true,
    setPaused: () => { },
    currentTime: 0,
    setTime: () => { },
});

export function VideoProvider({ children }: { children: ReactNode }) {
    const videoPlayer = useRef<HTMLVideoElement | null>(null);

    const initClip = filterClips(video_data.clips, intervals[0], transcript)[0];

    const [clip, setClip] = useImmer<Clip>(initClip);
    const [video, setVideo] = useImmer<Video>(video_data);
    const [clips, setClips] = useImmer<Clip[]>(video_data.clips);

    const [muted, setMuted] = useState<boolean>(false);
    const [paused, setPaused] = useState<boolean>(true);
    const [currentTime, setTime] = useState<number>(initClip.start_time);

    useEffect(() => {
        if (videoPlayer.current) {
            videoPlayer.current.currentTime = currentTime;
        }
    }, []);

    const clipInfo = {
        videoPlayer,
        clip, setClip,
        clips, setClips,
        video, setVideo,
        muted, setMuted,
        paused, setPaused,
        currentTime, setTime,
    };

    return (
        <VideoContext.Provider value={clipInfo}>
            {children}
        </VideoContext.Provider>
    )
}
'use client'

// React
import { useContext, useEffect, useRef, SyntheticEvent } from 'react'

// Context
import { VideoContext } from '@/context/video'

// Hooks
import { useResizer } from '@/hooks/resizer'
import { useTranscript } from '@/hooks/transcript'
import { useTrimmerContext } from '@/hooks/trimmer'


export const useVideoContext = () => useContext(VideoContext);

export function useVideo() {
    const { 
        videoPlayer,
        video, setVideo,
        clip, setClip,
        clips, setClips,
        currentTime, setTime, 
        paused, setPaused, 
        muted, setMuted 
    } = useContext(VideoContext);
    const { setFrame, crops, resizeMode } = useResizer();
    const { trimEndTime, trimStartTime } = useTrimmerContext();
    const { updateCurrentWord } = useTranscript();
    
    const extendedWidth = (crops.original_width / crops.crop_width) * 100;

    const intervalId = useRef<number | null>(null);

    const loop = () => {
        if (resizeMode !== "Editing" && videoPlayer.current) {
            setFrame(videoPlayer.current.currentTime);
        }
    };

    const handlePlay = () => {
        if (resizeMode !== "16:9" && intervalId.current === null) {
            intervalId.current = window.setInterval(loop, 0.01);
        }
    };

    const handlePause = () => {
        if (resizeMode !== "16:9" && intervalId.current !== null) {
            clearInterval(intervalId.current);
            intervalId.current = null;
        }
    };

    function handleOnTimeUpdate(event: SyntheticEvent<HTMLVideoElement>) {
        if (!videoPlayer.current) return;

        const currentTime = event.currentTarget.currentTime;
        setTime(currentTime);

        if (currentTime > trimEndTime || currentTime < trimStartTime) {
            pause();
            videoPlayer.current.currentTime = trimStartTime;
        } else {
            updateCurrentWord(clip.start_time, currentTime);
        }

        if (videoPlayer.current.paused) {
            setFrame(currentTime);
        }
    }

    const setCurrentTime = (time: number) => {
        if (videoPlayer.current) {
            videoPlayer.current.currentTime = time;
            setTime(time);
        }
    }

    const play = async () => {
        if (videoPlayer.current && paused) {
            await videoPlayer.current.play();
            setPaused(false);
        }
    }

    const pause = () => {
        if (videoPlayer.current && !paused) {
            videoPlayer.current.pause();
            setPaused(true);
        }
    }

    const mute = () => {
        if (videoPlayer.current && !muted) {
            videoPlayer.current.muted = true;
            setMuted(true);
        }
    }

    const unmute = () => {
        if (videoPlayer.current && muted) {
            videoPlayer.current.muted = false;
            setMuted(false);
        }
    }

    useEffect(() => {
        return () => {
            if (intervalId.current !== null) {
                window.clearInterval(intervalId.current);
            }
        };
    }, []);

    return {
        videoPlayer,
        extendedWidth,
        video, setVideo,
        clip, setClip,
        clips, setClips,
        currentTime, setCurrentTime,
        muted, mute, unmute,
        paused, play, pause,
        handlePlay, handlePause,
        handleOnTimeUpdate,
    }
}

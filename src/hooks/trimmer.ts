// React
import { useContext, RefObject } from 'react' 

// Context
import { TrimmerContext } from '@/context/trimmer'

// Hooks
import { useThrottle } from '@/hooks/throttle'
import { useVideo } from '@/hooks/video'
import { useResizer } from '@/hooks/resizer'
import { useTranscript } from '@/hooks/transcript'

// Utils
import { computeDuration } from '@/utils/time'
import { getWordIndex } from '@/utils/transcript'


const THROTTLE_DELAY = 50;
const RANGE_MAX = 100;

export const useTrimmerContext = () => useContext(TrimmerContext);

export function useTrimmer() {
     const { 
        startTime, setStartTime, 
        endTime, setEndTime,
        trimming, setTrimming,
        startRange, setStartRange,
        endRange, setEndRange,
        trimStartTime, setTrimStartTime, 
        trimEndTime, setTrimEndTime,
    } = useContext(TrimmerContext);
    const { resizeMode } = useResizer();
    const { videoPlayer, clip, setCurrentTime } = useVideo();
    const { transcript, setCurrentWordIndex } = useTranscript();
   

    const { updateTranscript } = useTranscript();

    const clipDuration = computeDuration(startTime, endTime);

    const resetTrim = (startTime: number, endTime: number) => {
        setStartRange(0);
        setEndRange(100);
        setTrimming(false);
        setStartTime(startTime);
        setEndTime(endTime);
        setTrimStartTime(startTime);
        setTrimEndTime(endTime);
    }

    const initTrim = (startTime: number, endTime: number) => {
        setStartTime(startTime);
        setEndTime(endTime);
        setTrimStartTime(startTime);
        setTrimEndTime(endTime);
    }

    const onChangeStart = useThrottle((range: number) => {
        if (!videoPlayer.current || resizeMode === 'Edit') return;

        setTrimming(true);
        setStartRange(range);

        const updatedTime = ((range / RANGE_MAX) * clipDuration) + startTime;
        setTrimStartTime(updatedTime);

        updateTranscript(clip, startTime, endTime, updatedTime, trimEndTime);

        const videoPlayerPaused = videoPlayer.current.paused
        if (videoPlayerPaused && videoPlayer.current.currentTime < updatedTime) {
            setCurrentTime(updatedTime);

            const wordIndex = getWordIndex(
                clip.start_char,
                clip.start_time,
                updatedTime,
                transcript.words
            );
            setCurrentWordIndex(wordIndex);
        }
    }, THROTTLE_DELAY);

    const onChangeEnd = useThrottle((range: number) => {
        if (!videoPlayer.current || resizeMode === 'Edit') return;

        setTrimming(true);

        setEndRange(range);

        const updatedTime = ((range / RANGE_MAX) * clipDuration) + startTime;
        setTrimEndTime(updatedTime);

        updateTranscript(clip, startTime, endTime, trimStartTime, updatedTime);

        const videoPlayerPaused = videoPlayer.current && videoPlayer.current.paused
        if (videoPlayerPaused && videoPlayer.current.currentTime > updatedTime) {
            setCurrentTime(trimStartTime);

            const wordIndex = getWordIndex(
                clip.start_char,
                clip.start_time,
                trimStartTime,
                transcript.words
            );
            setCurrentWordIndex(wordIndex);
        }
    }, THROTTLE_DELAY);

    const sliderProps = {
        start: startRange,
        end: endRange,
        onChangeStart,
        onChangeEnd,
        resetTrim,
        initTrim,
        startTime, setStartTime, 
        endTime, setEndTime,
        trimming, setTrimming,
        startRange, setStartRange,
        endRange, setEndRange,
        trimStartTime, setTrimStartTime, 
        trimEndTime, setTrimEndTime,
    };

    return sliderProps;
};

export function useExtendRange() {
    const { 
        trimStartTime,
        trimEndTime,
        startTime, setStartTime,
        endTime, setEndTime,
        startRange, setStartRange,
        endRange, setEndRange,
    } = useTrimmer();
    const { video, clip } = useVideo();
    const { updateTranscript } = useTranscript();

    const DURATION_INCREMENT = 5; // Consider moving this to a constants file if used across files

    const clipDuration = computeDuration(startTime, endTime);
    const localStartTime = ((startRange / RANGE_MAX) * clipDuration);
    const localEndTime = ((endRange / RANGE_MAX) * clipDuration);

    const extendStart = () => {
        const duration = Math.min(clipDuration + DURATION_INCREMENT, video.metadata.duration);

        const updatedStartTime = Math.max(startTime - DURATION_INCREMENT, 0);
        setStartTime(updatedStartTime);

        updateTranscript(clip, updatedStartTime, endTime, trimStartTime, trimEndTime);

        const value = (updatedStartTime === 0) ? localStartTime + startTime : localStartTime + DURATION_INCREMENT;
        const updatedStartRange = (value / duration) * RANGE_MAX;
        setStartRange(updatedStartRange);

        const updatedEndRange = ((localEndTime + DURATION_INCREMENT) / duration) * RANGE_MAX;
        setEndRange(updatedEndRange);
    }

    const extendEnd = () => {
        const duration = Math.min(clipDuration + DURATION_INCREMENT, video.metadata.duration);

        const newEndTime = Math.min(endTime + DURATION_INCREMENT, video.metadata.duration);
        setEndTime(newEndTime);

        updateTranscript(clip, startTime, newEndTime, trimStartTime, trimEndTime);

        const updatedStartRange = (localStartTime / duration) * RANGE_MAX;
        setStartRange(updatedStartRange);

        const updatedEndRange = (localEndTime / duration) * RANGE_MAX;
        setEndRange(updatedEndRange);
    }

    return { extendStart, extendEnd };
};


export function getCursorRange(
    rangeBox: RefObject<HTMLDivElement>,
    mousePosition: number,
    RANGE_MAX: number
): number {
    let cursorRange = 0;

    if (rangeBox.current) {
        const rangeBoxRect = rangeBox.current.getBoundingClientRect();
        const rangeBoxLeft = rangeBoxRect.left;
        const rangeBoxWidth = rangeBoxRect.width;

        cursorRange = (((mousePosition - rangeBoxLeft) / rangeBoxWidth) * RANGE_MAX);
        cursorRange = Math.max(0, cursorRange);
        cursorRange = Math.min(cursorRange, RANGE_MAX);
    }

    return cursorRange;
}

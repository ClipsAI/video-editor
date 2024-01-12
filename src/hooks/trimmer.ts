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
    const { videoPlayer, setCurrentTime } = useVideo();
    const { updateCurrentWord } = useTranscript();


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

        updateTranscript(startTime, endTime, updatedTime, trimEndTime);

        const videoPlayerPaused = videoPlayer.current.paused
        if (videoPlayerPaused && videoPlayer.current.currentTime < updatedTime) {
            setCurrentTime(updatedTime);
            updateCurrentWord(updatedTime);
        }
    }, THROTTLE_DELAY);

    const onChangeEnd = useThrottle((range: number) => {
        if (!videoPlayer.current || resizeMode === 'Edit') return;

        setTrimming(true);

        setEndRange(range);

        const updatedTime = ((range / RANGE_MAX) * clipDuration) + startTime;
        setTrimEndTime(updatedTime);

        updateTranscript(startTime, endTime, trimStartTime, updatedTime);

        const videoPlayerPaused = videoPlayer.current && videoPlayer.current.paused
        if (videoPlayerPaused && videoPlayer.current.currentTime > updatedTime) {
            setCurrentTime(trimStartTime);
            updateCurrentWord(trimStartTime);
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
        setTrimming,
        startTime, setStartTime,
        endTime, setEndTime,
        startRange, setStartRange,
        endRange, setEndRange,
    } = useTrimmer();
    const { video } = useVideo();
    const { resizeMode } = useResizer();
    const { updateTranscript } = useTranscript();

    const INCREMENT = 5;

    const clipDuration = computeDuration(startTime, endTime);
    const localStartTime = ((startRange / RANGE_MAX) * clipDuration);
    const localEndTime = ((endRange / RANGE_MAX) * clipDuration);

    const extendStart = () => {
        if (["Edit", "Editing"].includes(resizeMode) || Math.round(startTime) === 0) {
            return;
        }

        setTrimming(true);

        const duration = Math.min(
            clipDuration + INCREMENT,
            video.metadata.duration
        );

        const updatedStartTime = Math.max(startTime - INCREMENT, 0);
        setStartTime(updatedStartTime);

        updateTranscript(updatedStartTime, endTime, trimStartTime, trimEndTime);

        const value = (updatedStartTime === 0)
            ? localStartTime + startTime
            : localStartTime + INCREMENT;

        const updatedStartRange = (value / duration) * RANGE_MAX;
        setStartRange(updatedStartRange);

        const updatedEndRange = ((localEndTime + INCREMENT) / duration) * RANGE_MAX;
        setEndRange(updatedEndRange);
    }

    const extendEnd = () => {
        if (Math.round(endTime) === Math.round(video.metadata.duration)
            || ["Edit", "Editing"].includes(resizeMode)) {
            return;
        }

        setTrimming(true);

        const duration = Math.min(clipDuration + INCREMENT, video.metadata.duration);

        const newEndTime = Math.min(endTime + INCREMENT, video.metadata.duration);
        setEndTime(newEndTime);

        updateTranscript(startTime, newEndTime, trimStartTime, trimEndTime);

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
): number {
    let cursorRange = 0;

    if (rangeBox.current) {
        const rangeBoxRect = rangeBox.current.getBoundingClientRect();
        const rangeBoxLeft = rangeBoxRect.left;
        const rangeBoxWidth = rangeBoxRect.width;

        cursorRange = (((mousePosition - rangeBoxLeft) / rangeBoxWidth) * 100);
        cursorRange = Math.max(0, cursorRange);
        cursorRange = Math.min(cursorRange, 100);
    }

    return cursorRange;
}

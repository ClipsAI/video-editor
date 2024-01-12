// React
import { useMemo } from 'react'

// Components
import { ThemeToggle } from '@/components/Theme'
import { ToolTipButton } from '@/components/ToolTip'

// Hooks
import { useVideo } from '@/hooks/video'
import { useResizer } from '@/hooks/resizer'
import { useTranscript } from '@/hooks/transcript'
import { useTrimmer } from '@/hooks/trimmer'

// Utils
import { convertToTime } from "@/utils/time"
import { getWordIndexByTime } from '@/utils/transcript'
import { getSegmentIndex, areSegmentsEqual, isTimeInRange } from '@/utils/crops'

// Icons
import {
    CheckCircleIcon as SaveIcon,
    XCircleIcon as CancelIcon
} from "@heroicons/react/24/solid"
import {
    VolumeUp,
    VolumeMute,
    PlayCircleOutline,
    PauseCircleOutline,
    ContentCut as SplitIcon,
} from "@mui/icons-material"


export function VideoControls({
    currentTime,
    duration
}: {
    currentTime: number,
    duration: number
}) {

    return (
        <div className="grid grid-cols-3 mt-3 mb-1">
            <div className="flex place-self-start">
                <PlayButton />
                <VolumeButton />
            </div>
            <PlaybackTimer
                time={convertToTime(Math.max(0, currentTime))}
                duration={convertToTime(Math.round(duration))}
                className="place-self-center font-semibold"
            />
            <div className="flex place-self-end">
                <EditingControls />
            </div>
        </div>
    )
}

function EditingControls() {
    const { trimming } = useTrimmer();
    const { crops, resizeMode, segments } = useResizer();

    const segmentsEqual = useMemo(() => {
        return areSegmentsEqual(crops.segments, segments)
    }, [crops.segments, segments]);

    return (
        <>
            {(trimming || resizeMode == "Editing" || !segmentsEqual) ? (
                <SaveCancelButtons />
            ) : (
                <div className="flex space-x-3">
                    {(resizeMode === "Edit") && <SplitButton />}
                    <ThemeToggle />
                </div>
            )}
        </>
    )
}

function SplitButton() {
    const { currentTime } = useVideo();
    const { currentSegment, segments, setSegments } = useResizer();

    const handleSplit = () => {
        const segmentIndex = getSegmentIndex(currentSegment.current.end_time, segments);
        if (isTimeInRange(currentTime, segmentIndex, segments)) {
            const newSegment: Segment = {
                start_time: currentTime,
                end_time: currentSegment.current.end_time,
                speakers: currentSegment.current.speakers,
                x: currentSegment.current.x,
                y: currentSegment.current.y,
            };
            const newSegmentIndex = segmentIndex + 1;

            setSegments((draft: Segment[]) => {
                draft[segmentIndex].end_time = currentTime;
                draft.splice(newSegmentIndex, 0, newSegment);
            });
        }
    }

    return (
        <ToolTipButton
            tooltipText="Split"
            buttonClass="rounded hover:bg-gray-200"
            tooltipClass="w-10 bottom-9 bg-blue-600"
            OnClick={handleSplit}
        >
            <SplitIcon
                sx={{ fontSize: 24 }}
                className="text-blue-600 hover:text-blue-700
                dark:text-white/90 dark:hover:text-white/80"
            />
        </ToolTipButton>
    )
}

function PlayButton() {
    const { paused, play, pause } = useVideo();

    async function handlePlay() {
        if (paused) {
            play();
        } else {
            pause();
        }
    }

    return (
        <button className="mr-2" onClick={handlePlay}>
            {paused ? (
                <PlayCircleOutline
                    sx={{ fontSize: 28 }}
                    className="text-blue-600 dark:text-white/90"
                />
            ) : (
                <PauseCircleOutline
                    sx={{ fontSize: 28 }}
                    className="text-blue-600 dark:text-white/90"
                />
            )}
        </button>
    )
}

function VolumeButton() {
    const { muted, mute, unmute } = useVideo();

    function handleMute() {
        if (muted) {
            unmute();
        } else {
            mute();
        }
    }

    return (
        <button onClick={handleMute}>
            {muted ? (
                <VolumeMute
                    sx={{ fontSize: 28 }}
                    className="text-blue-600 dark:text-white/90"
                />
            ) : (
                <VolumeUp
                    sx={{ fontSize: 28 }}
                    className="text-blue-600 dark:text-white/90"
                />
            )}
        </button>
    )
}

function SaveCancelButtons() {
    const { transcript, setTranscriptState } = useTranscript();
    const { clip, setClip, setClips } = useVideo();
    const { setFrame } = useResizer();
    const { segments, setSegments, crops, setCrops, setResizeMode } = useResizer();
    const {
        trimming,
        setTrimming,
        setStartRange,
        setEndRange,
        endTime,
        setEndTime,
        setStartTime,
        trimStartTime,
        trimEndTime,
        resetTrim
    } = useTrimmer();

    const handleSave = () => {
        if (trimming) {
            let index = getWordIndexByTime(trimStartTime, transcript.words);
            console.log("Trim: ", trimStartTime);
            const startWord = transcript.words[index];

            index = getWordIndexByTime(trimEndTime, transcript.words);
            const endWord = transcript.words[index];

            setTrimming(false);
            setStartTime(startWord.start_time);
            setEndTime(endWord.end_time);
            setStartRange(0);
            setEndRange(100);

            setClip((draft: Clip) => {
                draft.start_time = startWord.start_time;
                draft.end_time = endWord.end_time;
                draft.start_char = startWord.start_char;
                draft.end_char = endWord.end_char;
            });
            setClips((drafts: Clip[]) => {
                const index = drafts.findIndex((draft: Clip) => draft.id === clip.id);
                drafts[index].start_time = startWord.start_time;
                drafts[index].end_time = endWord.end_time;
                drafts[index].start_char = startWord.start_char;
                drafts[index].end_char = endWord.end_char;
            });
            setTranscriptState(
                startWord.start_char,
                startWord.start_char,
                endWord.end_char,
                endWord.end_char
            )
        } else {
            setResizeMode("Edit");
            setCrops((draft: Crops) => { draft.segments = segments });
        }
    }

    const handleCancel = () => {
        if (trimming) {
            resetTrim(clip.start_time, clip.end_time);
            setTranscriptState(
                clip.start_char,
                clip.start_char,
                clip.end_char,
                clip.end_char
            );
        } else {
            setResizeMode("Edit");
            setFrame(clip.start_time);
            setSegments(crops.segments);
        }
    }

    return (
        <div className="space-x-1.5 -mb-2">
            <button onClick={handleSave}>
                <SaveIcon 
                    className="h-7 w-7 text-blue-600 hover:text-blue-800
                    dark:text-white/90 dark:hover:text-white/80" 
                />
            </button>
            <button onClick={handleCancel}>
                <CancelIcon
                    className="h-7 w-7 text-blue-600 hover:text-blue-800
                    dark:text-white/90 dark:hover:text-white/80"
                />
            </button>
        </div>
    )
}

function PlaybackTimer({
    time,
    duration,
    className
}: {
    time: string,
    duration: string,
    className: string
}) {
    return (
        <h1 className={className}>
            {time} / {duration}
        </h1>
    )
}
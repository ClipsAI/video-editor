// Components
import { Cursor, Slider, TimeMarker } from '@/components/Trimmer'

// Hooks
import { useResizer } from '@/hooks/resizer'
import { useThrottle } from "@/hooks/throttle"
import { getCursorRange, useTrimmer } from "@/hooks/trimmer"
import { useVideo } from '@/hooks/video'

// Icons
import { MdDelete } from 'react-icons/md'
import {
    CropLandscape as HorizontalVideo,
    CropPortrait as VerticalVideo,
    CropFree as EditVideo
} from '@mui/icons-material'

// React
import { useMemo, useRef, useState, ReactNode } from 'react'

// Third-party Libraries
import { Tab } from '@headlessui/react'

// Utils
import { getSegmentsInRange, getSegmentIndex, getResizeIndex } from '@/utils/crops'
import { round } from '@/utils/math'
import { classNames } from '@/utils/styling'
import { convertToTime, computeDuration } from '@/utils/time'



export function ResizeToggle() {
    const tabs = [
        {
            id: 1,
            name: "16:9",
            icon: HorizontalVideo,
        },
        {
            id: 2,
            name: "9:16",
            icon: VerticalVideo,
        },
        {
            id: 3,
            name: "Edit",
            icon: EditVideo,
        },
    ]

    return (
        <TabContainer>
            {tabs.map((tab) => (
                <Tab
                    key={tab.id}
                    className={({ selected }) => classNames(
                        "relative w-full rounded-md p-1.5 text-sm font-medium",
                        "leading-5 text-blue-700 focus:outline-none",
                        selected
                            ? 'bg-white shadow'
                            : 'hover:bg-white/[0.12] hover:text-white'
                    )}
                >
                    <div className="flex items-center justify-center">
                        <tab.icon className="h-6 w-6" />
                    </div>
                </Tab>
            ))}
        </TabContainer>
    )
}

function TabContainer({ children }: { children: ReactNode }) {
    const { clip } = useVideo();
    const { resetTrim } = useTrimmer();
    const { segments, resizeMode, setResizeMode } = useResizer();

    const selectedIndex = getResizeIndex(resizeMode, segments);

    const handleChange = (index: number) => {
        if (segments.length === 0) {
            return;
        }

        if (index === 0) {
            setResizeMode("16:9");
        } else if (index === 1) {
            setResizeMode("9:16");
        } else if (index === 2) {
            setResizeMode("Edit");
        }

        if (resizeMode === "Editing") {
            resetTrim(clip.start_time, clip.end_time);
        }
    }

    return (
        <div className="w-32 max-w-lg">
            <Tab.Group selectedIndex={selectedIndex} onChange={handleChange}>
                <Tab.List
                    className="flex space-x-1 rounded-lg bg-blue-900/20 p-[0.30rem]"
                >
                    {children}
                </Tab.List>
            </Tab.Group>
        </div>
    )
}

export function Segments() {
    const { segments } = useResizer();
    const { startTime, endTime } = useTrimmer();

    const clipSegments = useMemo(() => {
        return getSegmentsInRange(startTime, endTime, segments)
    }, [segments, startTime, endTime]);

    return (
        <div className="flex flex-col">
            <div className="basis-0 grow rounded-xl overflow-scroll scrollbar-hide">
                <ul>
                    {clipSegments.map((segment, index) => (
                        <SegmentCard
                            key={index}
                            segment={segment}
                        />
                    ))}
                </ul>
            </div>
        </div>
    );
}

type SpeakerColorMapping = {
    [key: number]: string;
}

function SegmentCard({ segment }: { segment: Segment }) {
    const { setCurrentTime } = useVideo();
    const { currentSegment } = useResizer();
    const { startTime, endTime } = useTrimmer();

    const adjustedSegmentStartTime = (segment.start_time < startTime) ? startTime : segment.start_time;
    const adjustedSegmentEndTime = (segment.end_time > endTime) ? endTime : segment.end_time;

    const clipSegmentStartTime = adjustedSegmentStartTime - startTime;
    const roundedSegmentStartTime = Math.round(clipSegmentStartTime);

    const clipSegmentEndTime = adjustedSegmentEndTime - startTime;
    const roundedSegmentEndTime = Math.round(clipSegmentEndTime);

    const selectedSegment = currentSegment.current.end_time === segment.end_time;
    const border = (selectedSegment) ? "border-4 border-indigo-800" : "border";

    const speakerToColor: SpeakerColorMapping = {
        0: 'bg-blue-600/70',
        1: 'bg-blue-600/50',
        2: 'bg-blue-600/30',
        3: 'bg-blue-600/10',
    };
    const bgColor = speakerToColor[segment.speakers[0]] || 'bg-blue-600';

    function handleCardClick() {
        setCurrentTime(adjustedSegmentStartTime);
    }

    return (
        <li className="mb-4">
            <div
                onClick={handleCardClick}
                className={
                    `flex flex-row justify-between items-center space-x-8 p-4
                    cursor-pointer ${border} shadow-sm rounded-xl ${bgColor}`
                }
            >
                <SegmentInfo
                    speaker={segment.speakers[0]}
                    startTime={roundedSegmentStartTime}
                    endTime={roundedSegmentEndTime}
                />
                <DeleteButton segment={segment} />
            </div>
        </li>
    );
}

function SegmentInfo({ speaker, startTime, endTime }: { speaker: number, startTime: number, endTime: number }) {
    return (
        <div className="flex-1 min-w-0 truncate text-[0.825rem] select-none">
            <span className="font-bold">Speaker: {speaker}</span>
            {'  '}<span aria-hidden="true">|</span>{'  '}
            {convertToTime(startTime)} - {convertToTime(endTime)}
        </div>
    )
}

function DeleteButton({ segment }: { segment: Segment }) {
    const { startTime, endTime } = useTrimmer();
    const { segments, setSegments } = useResizer();

    const handleDeleteSegment = () => {
        const clipSegments = getSegmentsInRange(startTime, endTime, segments);
        if (clipSegments.length === 1) return;

        const segmentIndex = getSegmentIndex(segment.end_time, segments);

        setSegments((draft: Segment[]) => {
            if (segmentIndex !== 0 && clipSegments[0].end_time !== segment.end_time) {
                draft[segmentIndex - 1].end_time = segment.end_time;
            }
            draft.splice(segmentIndex, 1);
        });
    }

    return (
        <button
            title="Delete"
            onClick={handleDeleteSegment}
            className="p-1 rounded-full hover:bg-blue-200 focus:outline-none"
        >
            <MdDelete className="h-[1.1rem] w-[1.1rem]" />
        </button>
    )
}

export function ResizeTrimmer() {
    const { startTime, endTime } = useTrimmer();
    const { resizeMode, segments } = useResizer();
    const { currentTime, setCurrentTime } = useVideo();

    const clipSegments = getSegmentsInRange(startTime, endTime, segments);

    const rangeBox = useRef<HTMLDivElement | null>(null);
    const [visibleCursor, setVisibleCursor] = useState(false);
    const [mousePosition, setMousePosition] = useState(0)
    const [hoveringOverSliders, setHoveringOverSliders] = useState(false);

    const RANGE_MAX = 100;

    const clipDuration = computeDuration(startTime, endTime);
    const currentRange = ((currentTime - startTime) / clipDuration) * RANGE_MAX;
    const cursorRange = getCursorRange(rangeBox, mousePosition, RANGE_MAX);
    const cursorTime = visibleCursor ? ((cursorRange / RANGE_MAX) * clipDuration) + startTime : 0;

    const handleMouseClick = () => {
        if (cursorTime >= startTime && cursorTime <= endTime) {
            setCurrentTime(cursorTime);
        }
    }

    return (
        <div
            ref={rangeBox}
            onClick={handleMouseClick}
            onPointerMove={(event) => setMousePosition(event.clientX)}
            onPointerEnter={() => setVisibleCursor(true)}
            onPointerLeave={() => setVisibleCursor(false)}
            className={classNames(
                "range_pack w-full",
                ["16:9", "9:16"].includes(resizeMode) ? "mx-1" : "mx-0"
            )}
        >
            <div 
                className="flex items-start relative border
                border-blue-300 h-11 w-full rounded-xl"
            >
                <TimeMarker currentRange={currentRange} />
                <Cursor
                    visible={visibleCursor}
                    cursorTime={cursorTime}
                    startTime={startTime}
                    cursorRange={cursorRange}
                    hoveringOverSliders={hoveringOverSliders}
                />
                {clipSegments.map((segment, index) => (
                    <TrimInterval
                        key={index}
                        index={index}
                        segment={segment}
                        numSegments={clipSegments.length}
                        setHoveringOverSliders={setHoveringOverSliders}
                    />
                ))}
            </div>
        </div>
    );
};

type TrimSlidersProps = {
    segment: Segment,
    numSegments: number,
    index: number,
    setHoveringOverSliders: SetState<boolean>
};

export function TrimInterval({
    index, segment, numSegments, setHoveringOverSliders,
}: TrimSlidersProps) {
    const { startTime, endTime } = useTrimmer();
    const { currentSegment, segments, setSegments } = useResizer();

    const adjustedSegmentStartTime = Math.max(segment.start_time, startTime);
    const adjustedSegmentEndTime = Math.min(segment.end_time, endTime);

    const segmentStartTime = adjustedSegmentStartTime - startTime;
    const segmentEndTime = adjustedSegmentEndTime - startTime;

    const duration = computeDuration(startTime, endTime);

    const start = (segmentStartTime / duration) * 100;
    const end = (segmentEndTime / duration) * 100;

    const onChangeEnd = useThrottle((range: number) => {
        if (index === numSegments - 1) return;

        const segmentIndex = getSegmentIndex(segment.end_time, segments);
        const nextSegment = segments[segmentIndex + 1];
        const nextSegmentEndTime = (nextSegment.end_time > endTime) ? endTime : nextSegment.end_time;
        const nextSegmentDuration = nextSegmentEndTime - adjustedSegmentEndTime;

        const newEndTime = round((range / 100) * duration + startTime);

        const currentSegmentDuration = newEndTime - adjustedSegmentStartTime;

        if ((range > end && nextSegmentDuration < 1.25) || (range < end && currentSegmentDuration < 1)) return;

        currentSegment.current = segment;

        setSegments((draft: Segment[]) => {
            const segmentIndex = getSegmentIndex(segment.end_time, draft);
            draft[segmentIndex].end_time = newEndTime;
        });
    }, 50)

    return (
        <>
            <SliderBox start={start} end={end} />
            {(index < numSegments - 1) && (
                <Slider
                    id="end-slider"
                    value={end}
                    onChange={onChangeEnd}
                    onPointerEnter={() => setHoveringOverSliders(true)}
                    onPointerLeave={() => setHoveringOverSliders(false)}
                    className="range_right"
                />
            )}

        </>
    )
}

export function SliderBox({ start, end }: { start: number, end: number }) {
    const widthStyle = {
        width: `calc(${(end - start) + 0.2}%)`,
        left: `${start - 0.1}%`,
    };

    return (
        <div
            id="clip_box"
            className="clip_box relative bg-blue-400/80"
            style={widthStyle}
        />
    );
}

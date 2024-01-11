// React
import { useRef, useState, useCallback, ReactNode } from 'react'

// Hooks
import { useResizer } from '@/hooks/resizer'
import { useVideo } from '@/hooks/video'
import { useTrimmer, useExtendRange, getCursorRange } from '@/hooks/trimmer'

// Utilities
import { classNames } from "@/utils/styling"
import { convertToTime, computeDuration } from '@/utils/time'

// Icons
import { AddCircleOutline as PlusIcon } from '@mui/icons-material'

const RANGE_MAX = 100;
const STEP = 0.0001;

export function Trimmer() {
    const { resizeMode } = useResizer();
    const canExtendRange = ['16:9', '9:16'].includes(resizeMode);

    return (
        <div className="flex">
            <ExtendRangeButton direction="start" />
            <DurationTrimmer />
            <ExtendRangeButton direction="end" />
        </div>
    );
}


function DurationTrimmer() {
    const { resizeMode } = useResizer();
    const { currentTime, setCurrentTime } = useVideo();
    const { startTime, endTime, trimStartTime, trimEndTime } = useTrimmer();

    const rangeBox = useRef<HTMLDivElement | null>(null);
    const [visibleCursor, setVisibleCursor] = useState(false);
    const [mousePosition, setMousePosition] = useState(0)
    const [hoveringOverSliders, setHoveringOverSliders] = useState(false);

    const clipDuration = computeDuration(startTime, endTime);
    const currentRange = ((currentTime - startTime) / clipDuration) * RANGE_MAX;
    const cursorRange = getCursorRange(rangeBox, mousePosition, RANGE_MAX);
    const cursorTime = visibleCursor ? ((cursorRange / RANGE_MAX) * clipDuration) + startTime : 0;

    const handleMouseClick = () => {
        if (cursorTime >= trimStartTime && cursorTime <= trimEndTime) {
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
                "relative w-full flex justify-center mt-2 mb-0",
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
                <TrimInterval setHoveringOverSliders={setHoveringOverSliders} />
            </div>
        </div>
    );
};


export function TrimInterval({ 
    setHoveringOverSliders 
}: { 
    setHoveringOverSliders: SetState<boolean> 
}) {
    const { start, end, onChangeStart, onChangeEnd } = useTrimmer();

    return (
        <>
            <SliderBox start={start} end={end} />
            <Slider
                id="start-slider"
                value={start}
                onChange={onChangeStart}
                onPointerEnter={() => setHoveringOverSliders(true)}
                onPointerLeave={() => setHoveringOverSliders(false)}
                className="range_left"
            />
            <Slider
                id="end-slider"
                value={end}
                onChange={onChangeEnd}
                onPointerEnter={() => setHoveringOverSliders(true)}
                onPointerLeave={() => setHoveringOverSliders(false)}
                className="range_right"
            />
        </>
    )
}


export function Slider({ 
    id,
    value,
    className,
    onChange,
    onPointerEnter,
    onPointerLeave
}: {
    id: string,
    value: number,
    className: string,
    onChange: (newValue: number) => void,
    onPointerEnter: () => void,
    onPointerLeave: () => void
}) {
    return (
        <input
            id={id}
            type="range"
            min={0}
            max={RANGE_MAX}
            step={STEP}
            value={value}
            onChange={(event) => onChange(event.currentTarget.valueAsNumber)}
            onPointerEnter={onPointerEnter}
            onPointerLeave={onPointerLeave}
            onClick={(event) => event.stopPropagation()}
            className={classNames(
                className, "pointer-events-none absolute appearance-none opacity-0",
                "z-50 left-0 right-0 -translate-y-1/2 top-1/2 bg-transparent"
            )}
        />
    );
}

export function SliderBox({ start, end }: { start: number, end: number }) {
    const widthStyle = {
        width: `calc(${(end - start) + 0.2}%)`,
        left: `${start - 0.1}%`,
    };

    return (
        <div
            className="absolute h-[110%] rounded-xl transform -translate-y-[4%]
            shadow-2xl border-2 border-blue-800 bg-blue-400/80 dark:bg-blue-500"
            style={widthStyle}
        >
            <SliderThumb position="left" />
            <SliderThumb position="right" />
        </div>
    );
}

function SliderThumb({ position }: { position: "left" | "right" }) {
    return (
        <div
            id={`${position}-slider-thumb`}
            className={classNames(
                (position === 'left') ? "left-0 ml-[1px]" : "right-0 mr-[1px]",
                "absolute top-[20%] w-1 h-[60%] rounded-xl bg-blue-800"
            )}
        />
    );
};

export function Cursor({ 
    visible,
    hoveringOverSliders,
    cursorTime,
    startTime,
    cursorRange
}: {
    visible: boolean,
    hoveringOverSliders: boolean,
    cursorTime: number,
    startTime: number,
    cursorRange: number,
}) {
    const time = convertToTime(cursorTime - startTime, true);

    return (
        <div
            className={
                `relative h-full z-30 rounded-lg bg-blue-800
                ${hoveringOverSliders ? 'w-0' : 'w-[0.15rem]'} 
                ${visible ? 'visible' : 'invisible'}`
            }
            style={{ left: `${cursorRange - 0.3}%` }}
        >
            {visible && (
                <div
                    className="absolute whitespace-nowrap bg-white py-1 px-2 border-2
                    border-current rounded-2xl text-blue-600 text-sm font-semibold
                    top-[105%] transform -translate-x-1/2 -translate-y-[250%]"
                >
                    {time}
                </div>
            )}
        </div>
    );
}

export function TimeMarker({ currentRange }: { currentRange: number }) {
    return (
        <div
            id="time-marker"
            className="relative h-full w-[0.15rem] z-30 rounded-lg bg-blue-800"
            style={{ left: `${currentRange - 0.3}%` }}
        />
    );
}

function ExtendRangeButton({ direction }: { direction: "start" | "end" }) {
    const { setTrimming } = useTrimmer();
    const { extendStart, extendEnd } = useExtendRange();

    const handleExtendRange = useCallback(() => {
        setTrimming(true);
        if (direction === "start") {
            extendStart();
        } else {
            extendEnd();
        }
    }, [direction, extendStart, extendEnd, setTrimming]);

    return (
        <TooltipButton
            tooltipText="Add 5s"
            className="mt-4"
            onClick={handleExtendRange}
        >
            <PlusIcon
                sx={{ fontSize: 26 }}
                className="text-blue-600 dark:text-white/90"
            />
        </TooltipButton>
    );
}

type TooltipButtonProps = {
    tooltipText: string,
    className: string,
    children: ReactNode,
    onClick: () => void
};

function TooltipButton({ tooltipText, children, ...buttonProps }: TooltipButtonProps) {
    return (
        <div className="relative group inline-block">
            <button {...buttonProps}>
                {children}
            </button>
            <span
                className="absolute left-1/2 top-14 z-10 transform -translate-x-1/2 w-14
                bg-blue-600 text-white text-xs rounded py-1 px-2 opacity-0
                group-hover:opacity-100 transition-opacity pointer-events-none"
            >
                {tooltipText}
            </span>
        </div>
    );
};

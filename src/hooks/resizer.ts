// React
import { useRef, useState, useContext, PointerEvent } from 'react'

// Context
import { ResizerContext } from '@/context/resizer'

// Utils
import { getSegmentIndex, findSegmentByTime } from '@/utils/crops'


export function useResizer() {
    const { 
        crops, setCrops,
        currentSegment,  segments, setSegments,
        resizeLeft, setResizeLeft,
        resizeMode, setResizeMode, 
    } = useContext(ResizerContext);

    const [drag, setDrag] = useState<boolean>(false);

    const delta = useRef<number>(0);
    const pointerPosition = useRef<number>(0);
    const resizeFrame = useRef<HTMLDivElement | null>(null);
    const resizeContainer = useRef<HTMLDivElement | null>(null);

    const MAX_WIDTH = 100;

    const resizeWidth = (crops.crop_width / crops.original_width) * 100;

    const inFrame = (pointerX: number) => {
        if (!resizeFrame.current) return false;

        const boundingRect = resizeFrame.current.getBoundingClientRect();
        const resizeMinX = boundingRect.x;
        const resizeMaxX = resizeMinX + boundingRect.width;
        return pointerX >= resizeMinX && pointerX <= resizeMaxX;
    };


    const getPointerPosition = (pointerX: number) => {
        if (!resizeContainer.current) return 0;

        const videoX = resizeContainer.current.getBoundingClientRect().x;
        const videoWidth = resizeContainer.current.getBoundingClientRect().width;
        const pointerXWithinVideo = pointerX - videoX;
        return (pointerXWithinVideo / videoWidth) * MAX_WIDTH;
    };


    const handleDown = (event: PointerEvent<HTMLDivElement>) => {
        if (!resizeContainer.current || !inFrame(event.clientX) || resizeMode !== "Edit") {
            return;
        }

        setDrag(true);
        setResizeMode("Editing");

        pointerPosition.current = getPointerPosition(event.clientX);
        delta.current = pointerPosition.current - resizeLeft;
    };


    const handleMove = (event: PointerEvent<HTMLDivElement>) => {
        if (!resizeContainer.current || !inFrame(event.clientX) || resizeMode !== "Editing") {
            return;
        }

        if (drag) {
            pointerPosition.current = getPointerPosition(event.clientX);
            let newResizeLeft = pointerPosition.current - delta.current;

            if (newResizeLeft < 0) {
                newResizeLeft = 0;
            } else if (newResizeLeft > MAX_WIDTH - resizeWidth) {
                newResizeLeft = MAX_WIDTH - resizeWidth;
            }

            setResizeLeft(newResizeLeft);
        }
    };


    const handleUp = (event: PointerEvent<HTMLDivElement>) => {
        if (!resizeContainer.current || !inFrame(event.clientX) || resizeMode !== "Editing") {
            return;
        }

        setDrag(false);
        
        setSegments((draft: Segment[]) => {
            const segmentIndex = getSegmentIndex(currentSegment.current.end_time, draft);
            const newResizeX = (resizeLeft / 100) * crops.original_width;
            draft[segmentIndex].x = Math.round(newResizeX);
        });

        setResizeMode("Edit");
    };

    const setFrame = (time: number) => {
        if (segments.length === 0) return;

        const { segment } = findSegmentByTime(time, segments);
        if (currentSegment.current && currentSegment.current.x !== segment.x) {
            const relativePosition = (segment.x / crops.original_width) * 100;
            setResizeLeft(relativePosition);
        }
        currentSegment.current = segment;
    }

    return {
        resizeFrame,
        resizeWidth,
        currentSegment,
        resizeContainer,
        handleDown,
        handleMove,
        handleUp,
        setFrame,
        crops, setCrops,
        segments, setSegments,
        resizeLeft, setResizeLeft,
        resizeMode, setResizeMode,
    }
}

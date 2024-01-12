// React
import { useState, useEffect } from 'react'

// Components
import { Slider, SliderBox, TrimmerLayout } from '@/components/Trimmer'

// Hooks
import { useResizer } from '@/hooks/resizer'
import { useThrottle } from '@/hooks/throttle'
import { useTrimmer } from '@/hooks/trimmer'

// Utils
import { getSegmentsInRange, getSegmentIndex } from '@/utils/crops'
import { round } from '@/utils/math'
import { computeDuration } from '@/utils/time'


export function SegmentTrimmer() {
    const { segments } = useResizer();
    const { trimStartTime, trimEndTime } = useTrimmer();
    const [hoveringOverSliders, setHoveringOverSliders] = useState(false);

    const clipSegments = getSegmentsInRange(trimStartTime, trimEndTime, segments);

    return (
        <TrimmerLayout hoveringOverSliders={hoveringOverSliders}>
            {clipSegments.map((segment, index) => (
                <Segment
                    key={index}
                    index={index}
                    segment={segment}
                    numSegments={clipSegments.length}
                    setHoveringOverSliders={setHoveringOverSliders}
                />
            ))}
        </TrimmerLayout>
    );
}

export function Segment({
    index,
    segment,
    numSegments,
    setHoveringOverSliders
}: {
    index: number,
    segment: Segment,
    numSegments: number,
    setHoveringOverSliders: SetState<boolean>
}) {
    const { startTime, endTime } = useTrimmer();
    const { currentSegment, segments, setSegments } = useResizer();

    const adjustedSegmentStartTime = Math.max(segment.start_time, startTime);
    const adjustedSegmentEndTime = Math.min(segment.end_time, endTime);

    const segmentStartTime = adjustedSegmentStartTime - startTime;
    const segmentEndTime = adjustedSegmentEndTime - startTime;

    const duration = computeDuration(startTime, endTime);

    const [start, setStart] = useState((segmentStartTime / duration) * 100);
    const [end, setEnd] = useState((segmentEndTime / duration) * 100);

    useEffect(() => {
        setStart((segmentStartTime / duration) * 100);
        setEnd((segmentEndTime / duration) * 100);
    }, [segments, segmentStartTime, segmentEndTime, duration]);


    const onChangeEnd = useThrottle((range: number) => {
        if (index === numSegments - 1) return;

        const segmentIndex = getSegmentIndex(segment.end_time, segments);
        const nextSegment = segments[segmentIndex + 1];
        const nextSegmentEndTime = (nextSegment.end_time > endTime) ? endTime : nextSegment.end_time;
        const nextSegmentDuration = nextSegmentEndTime - adjustedSegmentEndTime;

        const newEndTime = round((range / 100) * duration + startTime);

        const currentSegmentDuration = newEndTime - adjustedSegmentStartTime;

        if ((range > end && nextSegmentDuration < 1.25)
            || (range < end && currentSegmentDuration < 1)) {
            return;
        }

        currentSegment.current = segment;

        setSegments((draft: Segment[]) => {
            const segmentIndex = getSegmentIndex(segment.end_time, draft);
            draft[segmentIndex].end_time = newEndTime;
            draft[segmentIndex + 1].start_time = newEndTime;
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

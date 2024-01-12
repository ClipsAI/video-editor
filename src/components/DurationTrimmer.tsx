// React
import { useState } from 'react'

// Components
import { TrimmerLayout, Slider, SliderBox } from '@/components/Trimmer'

import { useTrimmer } from '@/hooks/trimmer'


export function DurationTrimmer() {
    const [hoveringOverSliders, setHoveringOverSliders] = useState(false);

    return (
        <TrimmerLayout hoveringOverSliders={hoveringOverSliders}>
            <Segment setHoveringOverSliders={setHoveringOverSliders} />
        </TrimmerLayout>
    );
};

export function Segment({
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

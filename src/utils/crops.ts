

export function getSegmentIndex(time: number, segments: Segment[]): number {
    let low = 0;
    let high = segments.length - 1;

    while (low <= high) {
        const mid = Math.floor((low + high) / 2);
        if (segments[mid].end_time === time) {
            return mid;
        } else if (segments[mid].end_time < time) {
            low = mid + 1;
        } else {
            high = mid - 1;
        }
    }

    return low;
}

export function findSegmentByTime(time: number, segments: Segment[]) {
    const index = getSegmentIndex(time, segments);
    const segment = segments[index];
    return { segment, index };
}

/**
 * Helper function to get the start time of a segment.
 * @param index - The index of the segment in the array.
 * @param segments - The array of segments.
 * @returns The start time of the segment.
 */
export function getSegmentStartTime(index: number, segments: Segment[]): number {
    if (index === 0) {
        return 0;
    }

    const delta = 0.001;
    return segments[index - 1].end_time + delta;
};

/**
 * Get a list of segments that are within a specified time range.
 * @param startTime - The start time of the range.
 * @param end_time - The end time of the range.
 * @param resizedSegments - The object containing resized segments data.
 * @returns An array of segments within the time range.
 */
export function getSegmentsInRange(startTime: number, end_time: number, segments: Segment[]): SegmentExtended[] {

    const segmentsExtended: SegmentExtended[] = segments.map((segment, index) => {
        const segmentStartTime = getSegmentStartTime(index, segments);
        return { ...segment, start_time: segmentStartTime };
    });

    return segmentsExtended.filter((segment) => {


        const clipStartTimeWithinSegment = startTime >= segment.start_time && startTime < segment.end_time;
        const segmentWithinClipRange = segment.start_time >= startTime && segment.end_time <= end_time;
        const clipend_timeWithinSegment = end_time >= segment.start_time && end_time <= segment.end_time;

        return clipStartTimeWithinSegment || segmentWithinClipRange || clipend_timeWithinSegment;

    });
}

export function areSegmentsEqual(resizedSegments: Segment[], editedSegments: Segment[]): boolean {
    // First check the lengths of the segment arrays
    if (resizedSegments.length !== editedSegments.length) {
        return false;
    }

    // Then compare each segment object
    for (let i = 0; i < resizedSegments.length; i++) {
        if (
            resizedSegments[i].speakers !== editedSegments[i].speakers ||
            resizedSegments[i].end_time !== editedSegments[i].end_time ||
            resizedSegments[i].x !== editedSegments[i].x
        ) {
            return false;
        }
    }

    // If all checks pass, the objects are considered equal
    return true;
}

/**
 * Helper function to check if a given time is within the range of a segment.
 * @param time - The time to check.
 * @param index - The index of the segment in the array.
 * @param segments - The array of segments.
 * @returns boolean - Whether the time is within the segment's range.
 */
export function isTimeInRange(time: number, index: number, segments: Segment[]): boolean {
    const startTime = getSegmentStartTime(index, segments);
    const end_time = segments[index].end_time;

    return time > startTime && time < end_time;
}

/**
 * Calculates the index based on the current resize mode and the number of segments.
 * 
 * @param {ResizeMode} mode - The current mode of the resize operation.
 * @param {Segment[]} segments - Array of segments used in the resize operation.
 * 
 * @returns {number} The index representing the resize mode:
 *                    - Returns 0 for "16:9" mode.
 *                    - Returns 1 for "9:16", "Edit", or "Editing" modes if there are segments.
 *                    - Defaults to 0 for any other cases.
 */
export function getResizeIndex(mode: ResizeMode, segments: Segment[]): number {
    switch (mode) {
        case "16:9":
            return 0;
        case "9:16":
        case "Edit":
        case "Editing":
            if (segments.length > 0) {
                return 1;
            };
        default:
            return 0;
    }
}

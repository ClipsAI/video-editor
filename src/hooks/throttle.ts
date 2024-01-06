import { useRef } from 'react'

/**
 * A custom hook that returns a throttled version of the given callback function.
 *
 * @param callback - The function to be throttled.
 * @param delay - The minimum time (in milliseconds) between consecutive calls to the callback.
 * @returns A throttled version of the `callback` function.
 *
 * @example
 * const throttledCallback = useThrottle(myCallback, 200);
 * // Now, `throttledCallback` will not be executed more than once every 200ms.
 */
export function useThrottle(callback: (...args: any[]) => void, delay: number) {
    const lastCall = useRef<number>(0);

    return function (...args: any[]) {
        const now = new Date().getTime();
        if (now - lastCall.current < delay) {
            return;
        }
        lastCall.current = now;
        return callback(...args);
    };
}
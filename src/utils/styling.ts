/**
 * Concatenates multiple class names into a single string, filtering out any falsy values.
 * 
 * @param classes - The class names to concatenate.
 * @returns The concatenated class names.
 */
export function classNames(...classes: string[]) {
    return classes.filter(Boolean).join(' ')
}
// Icons
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'


export function Search({ 
    placeholder,
    setQuery
}: { 
    placeholder: string,
    setQuery: SetState<string>
}) {
    return (
        <form className="w-full">
            <label htmlFor="search" className="sr-only">
                Search for Clips
            </label>
            <div className="relative">
                <div
                    className="absolute inset-y-0 left-0 flex
                    items-center pl-3 pointer-events-none"
                >
                    <MagnifyingGlassIcon 
                        className="w-5 h-5 text-gray-400"
                        aria-hidden="true"
                    />
                </div>
                <input
                    type="search"
                    id="search"
                    placeholder={placeholder}
                    onChange={(event) => setQuery(event.target.value)}
                    className="block w-full px-2.5 py-3 pl-10 text-sm text-gray-900
                    border border-gray-300 dark:border-white/20 rounded-lg
                    bg-gray-50 dark:bg-zinc-900 focus:ring-blue-500
                    focus:border-blue-500"
                />
                <button
                    type="submit"
                    className="text-white absolute right-1.5 bottom-1.5 top-1.5
                    bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:outline-none
                    focus:ring-blue-300 font-medium rounded-md text-sm px-2 py-1"
                >
                    <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
                </button>
            </div>
        </form>
    )
}
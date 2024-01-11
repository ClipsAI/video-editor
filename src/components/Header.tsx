// Components
import { IntervalDropdown } from '@/components/Dropdown'

// Hooks
import { useVideo } from '@/hooks/video'

// Next
import Link from 'next/link'

// Icons
import { GitHub } from "@mui/icons-material"


export function Header({ setInterval }: { setInterval: SetState<Interval> }) {
    const { clip } = useVideo();

    return (
        <div 
            className="p-4 sm:py-3 sm:px-6 border-b
            border-gray-300 dark:border-white/20"
        >
            <span className="flex flex-row justify-between items-center">
                <div className='w-36'>
                    <IntervalDropdown setInterval={setInterval} />
                </div>
                <div className="flex w-full justify-center items-center mx-4">
                    <h1 className="text-2xl font-bold text-center">
                        {clip.title}
                    </h1>
                </div>
                <div className="relative flex justify-center items-center">
                    <Link 
                        href="https://github.com/ClipsAI/editor"
                        target="_blank"
                        className="bg-blue-600 hover:bg-blue-700 w-auto h-auto flex
                        items-center justify-center px-8 py-2 border border-transparent
                        text-base font-medium rounded text-white md:py-1 md:text-lg
                        md:px-2"
                    >
                        <GitHub />
                    </Link>
                </div>
            </span>
        </div>
    )
}
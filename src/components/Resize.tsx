// Hooks
import { useResizer } from '@/hooks/resizer'
import { useTrimmer } from "@/hooks/trimmer"
import { useVideo } from '@/hooks/video'

// Icons
import {
    CropLandscape as HorizontalVideo,
    CropPortrait as VerticalVideo,
    CropFree as EditVideo
} from '@mui/icons-material'

// React
import { MutableRefObject, ReactNode } from 'react'

// Third-party Libraries
import { Tab } from '@headlessui/react'

// Utils
import { getResizeIndex } from '@/utils/crops'
import { classNames } from '@/utils/styling'



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
                            ? 'bg-white/90 dark:bg-blue-600 shadow'
                            : 'hover:bg-white/[0.12] hover:text-white/90'
                    )}
                >
                    <div className="flex items-center justify-center">
                        <tab.icon 
                            className="h-6 w-6 text-blue-600 dark:text-white/90"
                        />
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

export function ResizeContainer({ children }: { children: ReactNode }) {
    const {
        resizeContainer,
        resizeFrame,
        resizeWidth,
        resizeLeft,
        resizeMode,
        handleDown,
        handleUp,
        handleMove
    } = useResizer();

    return (
        <div className="flex justify-center w-full rounded-xl ">
            <div
                ref={resizeContainer}
                onPointerUp={handleUp}
                onPointerDown={handleDown}
                onPointerMove={handleMove}
                className=" relative h-full pt-[56.25%]
                rounded-xl overflow-hidden bg-transparent"
                style={{ width: (resizeMode === "9:16") ? `${resizeWidth}%` : "100%" }}
            >
                {["Edit", "Editing"].includes(resizeMode) && (
                    <ResizeFrame
                        resizeFrame={resizeFrame}
                        resizeLeft={resizeLeft}
                        resizeWidth={resizeWidth}
                    />
                )}
                {children}
            </div>
        </div>
    )
}

function ResizeFrame({
    resizeFrame,
    resizeLeft,
    resizeWidth
}: {
    resizeFrame: MutableRefObject<HTMLDivElement | null>,
    resizeLeft: number,
    resizeWidth: number,
}) {
    return (
        <div
            ref={resizeFrame}
            className="absolute z-30 inset-y-0 border-2 border-dashed
            rounded-xl overflow-hidden cursor-move bg-opacity-0"
            style={{
                left: `${resizeLeft}%`,
                width: `${resizeWidth}%`,
                boxShadow: "0 0 2000px 2000px rgb(0 0 0 / 70%)",
            }}
        />
    )
}

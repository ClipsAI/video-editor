// React
import { MutableRefObject, ReactNode } from 'react'

// Hooks
import { useResizer } from '@/hooks/resizer'
import { useVideo } from '@/hooks/video'


export function Video() {
    const { 
        video,
        videoPlayer,
        extendedWidth,
        handlePlay,
        handlePause,
        handleOnTimeUpdate
    } = useVideo();
    const { resizeMode, resizeLeft } = useResizer();

    return (
        <ResizeContainer>
            <video
                ref={videoPlayer}
                onPlay={handlePlay}
                onPause={handlePause}
                onTimeUpdate={handleOnTimeUpdate}
                className="absolute rounded-xl h-full top-0 left-0 object-cover"
                src={video.source}
                style={{
                    minWidth: (resizeMode === "9:16") 
                        ? `${extendedWidth}%` 
                        : "100%",
                    transform: (resizeMode === "9:16") 
                        ? `translateX(${-resizeLeft}%)` 
                        : undefined,
                }}
            />
        </ResizeContainer>
    )
}

function ResizeContainer({ children }: { children: ReactNode }) {
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


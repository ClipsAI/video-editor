// React
import { MutableRefObject, ReactNode } from 'react'

// Components
import { Trimmer } from '@/components/Trimmer'
import { ResizeContainer } from '@/components/Resize'
import { VideoControls } from '@/components/VideoControls'

// Hooks
import { useResizer } from '@/hooks/resizer'
import { useTrimmer } from '@/hooks/trimmer'
import { useVideo } from '@/hooks/video'


export function VideoPlayer() {
    const { currentTime } = useVideo();
    const { trimStartTime, trimEndTime } = useTrimmer();

    return (
        <div className="flex flex-col justify-between">
            <Video />
            <VideoControls
                duration={trimEndTime - trimStartTime}
                currentTime={currentTime - trimStartTime}
            />
            <Trimmer />
        </div >
    )
}

function Video() {
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

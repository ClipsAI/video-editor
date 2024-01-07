// Components
import { Trimming } from '@/components/Trimmer'
import { VideoControls } from '@/components/VideoControls'
import { ResizeTrimmer } from '@/components/Resize'
import { Video } from '@/components/Video'

// Hooks
import { useVideo } from '@/hooks/video'
import { useResizer } from '@/hooks/resizer'
import { useTrimmer } from '@/hooks/trimmer'


export function VideoPlayer() {
    const { currentTime } = useVideo();
    const { resizeMode } = useResizer();
    const { trimStartTime, trimEndTime } = useTrimmer();

    const view = ["16:9", "9:16"].includes(resizeMode);

    return (
        <div className="flex flex-col justify-between">
            <Video />
            <VideoControls
                duration={trimEndTime - trimStartTime}
                currentTime={currentTime - trimStartTime}
            />
            {view ? (
                <Trimming />
            ) : (
                <ResizeTrimmer />
            )}
        </div >
    )
}

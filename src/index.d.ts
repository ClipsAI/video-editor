// Import Types
type Dispatch<A> = import("react").Dispatch<A>;
type SetStateAction<S> = import("react").SetStateAction<S>;
type SetState<T> = Dispatch<SetStateAction<T>>;


// Clips
type Clip = {
    id: string,
    object: "clip",
    created: number,
    start_time: number,
    end_time: number,
    start_char: number,
    end_char: number,
    video_id: string,
    favorited: boolean,
    deleted: boolean,
    scores: {
        embedding_norm: number
    },
    title: string,
}

type Interval = {
    id: string,
    min: number,
    max: number,
}


// Video
type Video = {
	id: string,
	object: "video",
	clips: Clip[],
	created: number,
	metadata: {
		duration: number,
		file_size: number,
		mime_type: string,
	},
	source: string,
	status: string,
	title: string
}


// Transcript
type Transcript = {
    id: string,
    object: "transcript",
    created: number,
    word_infos: WordInfo[],
    transcription: string
}

type WordInfo = {
    start_char: number,
    end_char: number,
    start_time: number,
    end_time: number,
}

type ClipTranscript = {
    startChar: number,
    endChar: number,
    text: string,
}


// Crops
type Crops = {
    original_width: number,
    original_height: number,
    crop_width: number,
    crop_height: number,
    segments: Segment[],
}

type Segment = {
    speakers: number[],
    start_time: number,
    end_time: number,
    x: number,
    y: number,
}

type ResizeMode = "16:9" | "9:16" | "Edit" | "Editing"

// Import Types
type Timestamp = import("firebase/firestore").Timestamp;
type User = import("firebase/auth").User;
type Dispatch<A> = import("react").Dispatch<A>;
type SetStateAction<S> = import("react").SetStateAction<S>;

type SetState<T> = Dispatch<SetStateAction<T>>;

type Environement = "local" | "dev" | "staging" | "prod";

type CloudStorage = {
    bucket: string,
    id: string,
    path: string[],
    url: string,
};

type UploadMethod = "File" | "YouTube";

type CreateProjectAPIRequest = {
    googleCloudProject: string,
    userId: string,
    projectId: string,
    parentFolderId: string,
    title: string,
    mimeType: string,
    youTubeLink: string,
    uploadMethod: UploadMethod,
    source: string,
    duration: number,
    whisperModelSize: "base" | "small" | "medium",
    computeDevice: "cpu" | "cuda",
    k: number,
    blockComparisonPoolMethod: string,
    tensorAggregationPoolMethod: string,
    smoothingWidth: number,
    cutoffPolicy: string,
    minClipTime: number,
    maxClipTime: number,
    iso_6391_lang_code?: string,
    timeTracking?: boolean,
}

type FirebaseConfig = {
    apiKey: string,
    authDomain: string,
    projectId: string,
    storageBucket: string,
    messagingSenderId: string,
    appId: string,
};

type APIResponse = {
    message: string,
    status: number,
    success: boolean,
    stackTraceInfo: string[],
};

type TranscriptAPIResponse = APIResponse & TranscriptInfo;

type CreateCheckoutAPIResponse = APIResponse & { checkoutSessionUrl: string };
type CreateCustomerPortalResponse = APIResponse & { customerPortalUrl: string };
type DownloadClipsAPIResponse = APIResponse & { downloadableUrl: string };


type ClipTime = {
    start: number,
    end: number,
};

type ClipTranscript = {
    startChar: number,
    endChar: number,
    text: string,
}

type TimeBucket = {
    min: number,
    max: number,
}

type TranscriptInfo = {
    text: string,
    charInfo: CharInfo[],
    wordInfo: WordInfo[],
}



type CharInfo = {
    readonly wordIdx: number,
    readonly startTime: number,
    readonly endTime: number,
}

type SelectMenuOptions = {
    id: number,
    name: string,
    value: any,
};

type Crops = {
    original_width: number,
    original_height: number,
    crop_width: number,
    crop_height: number,
    segments: Segment[],
}

type CropsAPIResponse = { crops: Crops } & APIResponse;

type Segment = {
    speakers: number[],
    end_time: number,
    x: number,
    y: number,
}

type DownloadableClip = {
    id: string,
    resize: boolean,
}

type SegmentExtended = Segment & { start_time: number };

type ResizeMode = "16:9" | "9:16" | "Edit" | "Editing"

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
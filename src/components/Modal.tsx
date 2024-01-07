'use client'

// React
import {
    Fragment,
    ReactNode,
    MutableRefObject,
    useState,
    useRef,
    useEffect,
    KeyboardEvent
} from 'react'

// Utils
import { classNames } from '@/utils/styling'

// Icons
import { Edit, Delete } from "@mui/icons-material"

// Third-party Libraries
import { Dialog, Transition } from '@headlessui/react'


export function Modal({
    open,
    setOpen,
    cancelButtonRef,
    children
}: {
    open: boolean,
    setOpen: Dispatch<SetStateAction<boolean>>,
    cancelButtonRef: MutableRefObject<null>,
    children: ReactNode,
}) {
    return (
        <Transition.Root show={open} as={Fragment}>
            <Dialog
                as="div"
                className="relative z-20"
                initialFocus={cancelButtonRef}
                onClose={setOpen}
            >
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div
                        className="fixed inset-0 bg-gray-500
                        bg-opacity-75 transition-opacity"
                    />
                </Transition.Child>

                <div className="fixed inset-0 z-10 overflow-y-auto">
                    <div
                        className="flex min-h-full items-end justify-center p-4
                        text-center sm:items-center sm:p-0"
                    >
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 translate-y-4
                            sm:translate-y-0 sm:scale-95"
                            enterTo="opacity-100 translate-y-0 sm:scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                            leaveTo="opacity-0 translate-y-4
                            sm:translate-y-0 sm:scale-95"
                        >
                            <Dialog.Panel
                                className="relative transform overflow-hidden rounded-lg
                                bg-white text-left shadow-xl transition-all sm:my-8
                                sm:w-full sm:max-w-lg"
                            >
                                {children}
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition.Root>
    )
}


function ModalContent({
    handleKeyDown,
    children
}: {
    handleKeyDown?: (event: KeyboardEvent<HTMLDivElement>) => void,
    children: ReactNode
}) {
    return (
        <div
            onKeyDown={handleKeyDown}
            className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4"
        >
            <div className="sm:flex sm:items-start">
                {children}
            </div>
        </div>
    );
}


function ModalIcon({ children }: { children: ReactNode }) {
    return (
        <div
            className="mx-auto flex h-12 w-12 flex-shrink-0 items-center
            justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10"
        >
            {children}
        </div>
    )
}


function ModalButtons({
    onClick,
    onCancel,
    className,
    buttonName,
    cancelButtonRef,
}: {
    className: string,
    buttonName: string,
    onClick: () => void,
    onCancel: () => void,
    cancelButtonRef: MutableRefObject<null>
}) {
    return (
        <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
                type="button"
                className={classNames(
                    className, "inline-flex w-full justify-center rounded-md px-3 py-2",
                    "text-sm font-semibold text-white shadow-sm sm:ml-3 sm:w-auto"
                )}
                onClick={onClick}
            >
                {buttonName}
            </button>
            <button
                type="button"
                className="mt-3 inline-flex w-full justify-center rounded-md bg-white
                px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1
                ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto"
                onClick={onCancel}
                ref={cancelButtonRef}
            >
                Cancel
            </button>
        </div>
    )
}


export function RenameModal({
    open,
    setOpen,
    prevName,
    rename
}: {
    open: boolean,
    setOpen: SetState<boolean>,
    prevName: string,
    rename: (newName: string) => void
}) {
    const [name, setName] = useState<string>("");
    const cancelButtonRef = useRef(null);

    useEffect(() => {
        setName(prevName);
    }, [prevName])

    const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
        const { key } = event;
        const enterKey = ["Enter"];

        if (enterKey.includes(key)) {
            rename(name)
        }
    };

    return (
        <Modal open={open} setOpen={setOpen} cancelButtonRef={cancelButtonRef}>
            <ModalContent handleKeyDown={handleKeyDown}>
                <ModalIcon>
                    <Edit className="h-6 w-6 text-blue-600" aria-hidden="true" />
                </ModalIcon>
                <RenameInput name={name} setName={setName} />
            </ModalContent>
            <ModalButtons
                buttonName="Save"
                onClick={() => rename(name)}
                onCancel={() => setOpen(false)}
                cancelButtonRef={cancelButtonRef}
                className="bg-blue-600 hover:bg-blue-500"
            />
        </Modal>
    )
}


function RenameInput({ name, setName }: { name: string, setName: SetState<string> }) {
    return (
        <div className="w-full mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <Dialog.Title
                as="h3"
                className="mt-2 text-lg font-semibold leading-6 text-gray-900"
            >
                Rename Clip
            </Dialog.Title>
            <div className="mt-2 w-full">
                <input
                    type="text"
                    name="rename-clip"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    onFocus={(event) => event.target.select()}
                    className="block w-full rounded-lg border-0 px-4 py-1.5
                    text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300
                    placeholder:text-gray-400 focus:ring-2 focus:ring-inset
                    focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    placeholder={name}
                />
            </div>
        </div>
    );
}


export function DeleteModal({
    title,
    open,
    setOpen,
    deleteClip
}: {
    title: string,
    open: boolean,
    setOpen: SetState<boolean>,
    deleteClip: () => void
}) {
    const [loading, setLoading] = useState<boolean>(false);
    const cancelButtonRef = useRef(null);

    const handleDelete = () => {
        setLoading(true);
        deleteClip();
        setLoading(false);
    }

    return (
        <Modal open={open} setOpen={setOpen} cancelButtonRef={cancelButtonRef}>
            <ModalContent>
                <ModalIcon>
                    <Delete className="h-6 w-6 text-red-600" aria-hidden="true" />
                </ModalIcon>
                <DeleteLabel title={title} />
            </ModalContent>
            <ModalButtons
                buttonName="Delete"
                onClick={handleDelete}
                onCancel={() => setOpen(false)}
                cancelButtonRef={cancelButtonRef}
                className={
                    loading
                        ? "cursor-not-allowed bg-red-300"
                        : "bg-red-600 hover:bg-red-500"
                }
            />
        </Modal>
    )
}


function DeleteLabel({ title }: { title: string }) {
    return (
        <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
            <Dialog.Title as="h3" className="text-base font-semibold leading-6 text-gray-900">
                Delete Clip
            </Dialog.Title>
            <div className="mt-2">
                <p className="text-sm text-gray-500">
                    Are you sure you want to delete the clip {" "}
                    <span className="font-semibold text-gray-600">
                        {title}
                    </span>?
                </p>
            </div>
        </div>
    )
}


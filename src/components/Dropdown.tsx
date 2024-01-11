// Data
import { intervals } from '@/data/clips'

// Icons
import { CheckIcon, ChevronDownIcon } from '@heroicons/react/24/solid'

// React
import { useState, Fragment, ReactNode  } from 'react'

// Third-party Libraries
import { Listbox, Transition } from '@headlessui/react'

// Utils
import { classNames } from '@/utils/styling'


export function IntervalDropdown({ setInterval }: { setInterval: SetState<Interval> }) {
    const [selected, setSelected] = useState<Interval>(intervals[0])

    const handleChange = (value: Interval) => {
        setSelected(value)
        setInterval(value)
    }

    return (
        <div>
            <Listbox value={selected} onChange={handleChange}>
                {({ open }) => (
                    <>
                        <div className="relative">
                            <ListboxButton selected={selected} />
                            <ListboxContainer open={open}>
                                <ListboxOptions options={intervals} />
                            </ListboxContainer>
                        </div>
                    </>
                )}
            </Listbox>
        </div>
    )
}

function ListboxButton({ selected }: { selected: Interval }) {
    return (
        <Listbox.Button
            className="relative w-full cursor-default rounded-md border shadow-sm py-2 
            pl-3 pr-10 border-gray-300 dark:border-white/20 bg-white
            dark:bg-zinc-900 text-left sm:text-sm focus:ring-1
            focus:border-indigo-500 focus:outline-none focus:ring-indigo-500"
        >
            <span className="block truncate">
                {selected.id}
            </span>
            <span
                className="pointer-events-none absolute
                inset-y-0 right-0 flex items-center pr-2"
            >
                <ChevronDownIcon
                    aria-hidden="true"
                    className="h-5 w-5 text-gray-400"
                />
            </span>
        </Listbox.Button>
    )
}

function ListboxContainer({ open, children }: { open: boolean, children: ReactNode }) {
    return (
        <Transition
            show={open}
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
        >
            <Listbox.Options
                className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md
                bg-white dark:bg-zinc-900 py-1 text-base shadow-lg ring-1
                ring-black ring-opacity-5 focus:outline-none sm:text-sm"
            >
                {children}
            </Listbox.Options>
        </Transition>
    )
}


function ListboxOptions({ options }: { options: Interval[] }) {
    return (
        <>
            {options.map((option) => (
                <Listbox.Option
                    key={option.id}
                    className={({ active }) =>
                        classNames(
                            active
                                ? 'text-white bg-indigo-600'
                                : 'text-gray-900 dark:text-white',
                            'relative cursor-default select-none py-2 pl-8 pr-4'
                        )
                    }
                    value={option}
                >
                    {({ selected, active }) => (
                        <>
                            <span
                                className={classNames(
                                    selected
                                        ? 'font-semibold'
                                        : 'font-normal', 'block truncate'
                                )}
                            >
                                {option.id}
                            </span>

                            {selected && (
                                <span
                                    className={classNames(
                                        active ? 'text-white' : 'text-indigo-600',
                                        'absolute inset-y-0 left-0',
                                        'flex items-center pl-1.5'
                                    )}
                                >
                                    <CheckIcon className="h-5 w-5" aria-hidden="true" />
                                </span>
                            )}
                        </>
                    )}
                </Listbox.Option>
            ))}
        </>
    );
} 

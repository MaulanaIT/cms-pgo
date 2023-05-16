// Import Library
import React from 'react';

export default function Popup({
    children = <></>,
    classNameContainer = 'bg-night-400 p-6 relative rounded-2xl z-10',
    classNameContainerAdditional = '',
    onClose = () => { },
    showPopup = false,
}) {

    if (!showPopup) return null;

    return (
        <div className='bg-black/40 fixed flex h-screen items-center justify-center left-0 p-6 top-0 w-screen z-50'>
            <div className='absolute h-screen left-0 top-0 w-screen z-0' onClick={onClose}></div>
            <div className={`${classNameContainer} ${classNameContainerAdditional}`}>
                {children}
            </div>
        </div>
    )
}

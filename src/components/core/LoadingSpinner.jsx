// Import Library
import React from 'react';

export default function LoadingSpinner({
    size = 24,
    theme = 'light',
}) {
    return (
        <div className='flex items-center justify-center w-full'>
            <div className={`spinner`} style={{ height: size, width: size }}>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
            </div>
        </div>
    )
}

// Import Library
import React, { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useDispatch, useSelector } from 'react-redux';

// Import Custom Library
import { getShowLoadingScreen, setShowLoadingScreen } from '@/config/store/reducer/userSlice';

export default function LoadingScreen({
    size = 64,
    theme = 'light',
}) {

    const dispatch = useDispatch();
    const router = useRouter();
    const showLoadingScreen = useSelector(getShowLoadingScreen);

    useEffect(() => {
        if (showLoadingScreen) dispatch(setShowLoadingScreen(false));
    }, [router]);

    if (!showLoadingScreen) return null;

    return (
        <div className='bg-black fixed flex h-screen items-center justify-center left-0 top-0 w-screen z-50'>
            <div className={`spinner`} style={{ height: size, width: size }}>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
                <div className={`${theme === 'dark' ? 'border-powder' : 'border-night-100'}`} style={{ height: size, width: size }}></div>
            </div>
        </div>
    )
}

// Import Library
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

// Import Custom Library
import { getToastMessage, setToastMessage } from '@/config/store/reducer/userSlice';

export default function ToastMessage() {

    const [getValueToastMessage, setValueToastMessage] = useState('');

    const dispatch = useDispatch();

    const toastMessage = useSelector(getToastMessage);

    useEffect(() => {
        let timeoutPopup;

        setValueToastMessage(toastMessage?.message);

        if (toastMessage?.active) {

            timeoutPopup = setTimeout(() => {
                dispatch(setToastMessage({
                    active: false,
                    background: null,
                    message: null
                }));
            }, 3000);
        }

        return () => {
            clearTimeout(timeoutPopup);
            setValueToastMessage('');
        }
    }, [toastMessage]);

    return (
        <div className={`duration-300 fixed left-1/2 p-2 px-4 rounded-md -translate-x-1/2 transition-all ${getValueToastMessage ? 'opacity-100 top-10' : 'opacity-0 pointer-events-none top-0'}`} style={{ backgroundColor: toastMessage?.background }}>
            {getValueToastMessage}
        </div>
    )
}

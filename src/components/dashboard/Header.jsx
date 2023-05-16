// Import Library
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { IoChevronDown, IoClose, IoLogOutOutline, IoMenu, IoPerson, IoPersonCircle } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

// Import Custom Library
import { clearAuthData, getAuthData } from '@/config/store/reducer/authSlice';
import { setShowLoadingScreen } from '@/config/store/reducer/userSlice';

export default function Header({
    getShowSidebar = false,
    setShowSidebar = () => { }
}) {

    const [getShowPopupProfile, setShowPopupProfile] = useState(false);

    const dispatch = useDispatch();

    const authData = useSelector(getAuthData);
    const router = useRouter();

    useEffect(() => {
        let timeout;

        if (!authData) {
            timeout = setTimeout(() => {
                router?.push('/');
            }, 1000);
        }

        return () => {
            clearTimeout(timeout);
        }
    }, [authData]);

    useEffect(() => {
        setShowPopupProfile(false);
    }, [router]);

    const Logout = () => {
        dispatch(clearAuthData());
        dispatch(setShowLoadingScreen(true));
    }

    return (
        <div className='bg-night-400 flex items-center h-12 justify-between px-4 py-2 relative w-full'>
            <div className='flex items-center gap-4'>
                <button type='button' className='block h-6 relative w-6 lg:hidden' onClick={() => setShowSidebar(!getShowSidebar)}>
                    {getShowSidebar ?
                        <IoClose size={24} />
                        :
                        <IoMenu size={24} />
                    }
                </button>
                <p className='font-bold text-lg'>PGO</p>
            </div>
            <div className='flex items-center'>
                <div className='relative'>
                    <button type='button' className={`flex items-center gap-2`} onClick={() => setShowPopupProfile(prevState => !prevState)}>
                        <div className='h-6 relative w-6'>
                            <IoPersonCircle size={24} />
                        </div>
                        <p className='font-semibold text-xs'>Admin</p>
                        <div className={`duration-300 h-4 relative ${getShowPopupProfile ? 'rotate-180' : 'rotate-0'} transition-transform w-4`}>
                            <IoChevronDown size={16} />
                        </div>
                    </button>
                    {getShowPopupProfile ?
                        <ul className='absolute bg-night-400 overflow-hidden right-0 rounded-md top-[calc(100%+14px)] w-[140px] z-[10]'>
                            <Link href={'/profile'}>
                                <li className='bg-night-400 cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-night-200'>
                                    <div className='h-3 relative w-3'>
                                        <IoPerson size={12} />
                                    </div>
                                    <p className='text-xs'>Profile</p>
                                </li>
                            </Link>
                            <li className='bg-night-400 cursor-pointer flex items-center gap-2 px-3 py-2 hover:bg-night-200' onClick={Logout}>
                                <div className='h-3 relative w-3'>
                                    <IoLogOutOutline size={12} />
                                </div>
                                <p className='text-xs'>Logout</p>
                            </li>
                        </ul>
                        : null
                    }
                </div>
            </div>
        </div>
    )
}

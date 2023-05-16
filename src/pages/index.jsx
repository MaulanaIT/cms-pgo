// Import Library
import axios from 'axios';
import React, { useState } from 'react';
import { useRouter } from 'next/router';
import { IoEyeOutline, IoEyeOffOutline } from 'react-icons/io5';
import { useDispatch } from 'react-redux';
// import { useSelector } from 'react-redux';

// Import Custom Library
// import { getAuthData } from '@/config/store/reducer/authSlice';

// Import Components
import Footer from '@/components/Footer';
import LoadingSpinner from '@/components/core/LoadingSpinner';
import { setAuthData } from '@/config/store/reducer/authSlice';
import { setToastMessage } from '@/config/store/reducer/userSlice';

export default function Login() {

    const [getLoadingSubmit, setLoadingSubmit] = useState(false);
    const [getShowPassword, setShowPassword] = useState(false);

    const [getValueEmail, setValueEmail] = useState('');
    const [getValuePassword, setValuePassword] = useState('');

    const dispatch = useDispatch();

    const router = useRouter();

    const Submit = () => {
        setLoadingSubmit(true);

        axios.post('/api/v1/dashboard/login', {
            admin_email: getValueEmail,
            admin_password: getValuePassword,
        }).then(res => {
            if (res?.data?.ok) {
                dispatch(setAuthData({
                    ...res?.data?.data,
                    token: res?.data?.token
                }));
                dispatch(setToastMessage({
                    active: true,
                    background: 'success',
                    message: res?.data?.message
                }));

                setTimeout(() => {
                    router.push('/dashboard');
                }, 500);
            } else {
                dispatch(setToastMessage({
                    active: true,
                    background: 'error',
                    message: res?.data?.message
                }));
                setLoadingSubmit(false);
            }

        });
    }

    return (
        <div className='flex flex-col min-h-screen w-screen'>
            <section className='flex items-center justify-center p-10 relative w-full'>
                <div className='max-w-[504px] p-8 relative w-full'>
                    <p className='font-bold pl-4 text-4xl'>PGO</p>
                    <form onSubmit={e => {
                        e.preventDefault();

                        Submit();
                    }} className='bg-night-300 mt-2 p-8 rounded-2xl shadow-2xl w-full'>
                        <p className='font-semibold text-2xl'>Sign in to your account</p>
                        <div className='mt-6 relative'>
                            <p className='text-base'>Email</p>
                            <div className='border-[1px] border-erie-100 flex items-center gap-2 mt-3 overflow-hidden px-3 py-2 rounded w-full'>
                                <input type="text" className='w-full' placeholder='Email' value={getValueEmail} onChange={e => setValueEmail(e?.target?.value)} />
                            </div>
                        </div>
                        <div className='mt-6 relative'>
                            <p className='text-base'>Password</p>
                            <div className='border-[1px] border-erie-100 flex items-center gap-2 mt-3 overflow-hidden px-3 py-2 rounded w-full'>
                                <input type={getShowPassword ? 'text' : 'password'} className='w-full' placeholder='Password' value={getValuePassword} onChange={e => setValuePassword(e?.target?.value)} />
                                <button type='button' className='flex h-6 items-center justify-center relative w-6' onClick={() => setShowPassword(prevState => !prevState)}>
                                    {getShowPassword ?
                                        <IoEyeOutline size={24} />
                                        :
                                        <IoEyeOffOutline size={24} />
                                    }
                                </button>
                            </div>
                        </div>
                        <div className='[&>*]:cursor-pointer flex gap-2 items-center mt-8 text-sm'>
                            <input type="checkbox" id='checkbox-signin' />
                            <label htmlFor="checkbox-signin">Stay signed in for a week</label>
                        </div>
                        <button type='submit' className='bg-periwinkle-400 duration-300 mt-8 px-8 py-2 rounded-full text-white transition-colors w-full hover:bg-periwinkle-200' disabled={getLoadingSubmit}>
                            {getLoadingSubmit ?
                                <LoadingSpinner theme='dark' />
                                :
                                'Sign In'
                            }
                        </button>
                        <button type='button' className='mt-2 text-xs w-full'>Forgot your password?</button>
                    </form>
                    <div className='mt-6 pl-4 text-xs'>
                        <p>Don&apos;t have any account? <span className='cursor-pointer text-periwinkle-400'>Sign Up</span></p>
                    </div>
                </div>
            </section>
            <Footer />
        </div>
    )
}

Login.title = 'PGO Dashboard - Login';
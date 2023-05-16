// Import Library
import React, { Fragment } from 'react'

// Import Component
import BreadCrumb from '@/components/core/BreadCrumb';

export default function Profile() {
    return (
        <Fragment>
            <BreadCrumb
                list={[
                    { label: 'My Profile' }
                ]}
            />
            <div className='bg-night-300 border-b-8 border-night-400/70 px-6 py-8 relative w-full'>
                <p className='font-bold text-2xl'>My Profile</p>
            </div>
            <div className='p-6 relative'>
                <div className='bg-night-300 p-6 relative rounded-lg'>
                    <div className='gap-10 grid grid-cols-2 relative'>
                        <div className='gap-4 grid relative w-full'>
                            <div className='relative w-full'>
                                <p className='text-sm'>Email</p>
                                <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                                    <input type="email" className='w-full' placeholder='Email...' />
                                </div>
                            </div>
                            <div className='relative w-full'>
                                <p className='text-sm'>Full Name</p>
                                <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                                    <input type="text" className='w-full' placeholder='Full Name...' />
                                </div>
                            </div>
                            <div className='relative w-full'>
                                <p className='text-sm'>Phone</p>
                                <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                                    <input type="tel" className='w-full' placeholder='+62 xxx xxx xxx...' pattern="[0-9]{3}-[0-9]{2}-[0-9]{3}" />
                                </div>
                            </div>
                            <div className='relative w-full'>
                                <p className='text-sm'>Gender</p>
                                <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden pr-2 rounded w-full'>
                                    <select className='[&>option]:bg-night-200 px-3 py-2 w-full'>
                                        <option value="Male">Male</option>
                                        <option value="Female">Female</option>
                                    </select>
                                </div>
                            </div>
                        </div>
                        <div className='gap-4 grid relative w-full'>
                            <div className='relative w-full'>
                                <p className='text-sm'>Role Name(s)</p>
                                <div className='mt-2 relative'>
                                    <p className='text-xs'>Partner</p>
                                    <p className='text-xs'>Marchant Branch</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='relative w-full'>
                        <button type='submit' className='bg-info/70 duration-300 flex items-center justify-center gap-1 mt-8 px-8 py-[6px] rounded text-white transition-colors w-full hover:bg-info'>
                            Save
                        </button>
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

Profile.guard = true;
Profile.layout = 'Sidebar';
Profile.title = 'PGO Dashboard - Profile';
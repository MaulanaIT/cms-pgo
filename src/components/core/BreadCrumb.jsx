// Import Library
import Link from 'next/link';
import React, { Fragment } from 'react';
import { useRouter } from 'next/router';
import { IoHome } from 'react-icons/io5';

export default function BreadCrumb({
    list = [],
}) {

    const router = useRouter();

    return (
        <div className='bg-night-300 flex items-start gap-2 px-6 py-4 w-full'>
            <Link href={'/dashboard'}>
                <button type='button' className='flex gap-2 items-center relative'>
                    <div className='h-3 relative w-3'>
                        <IoHome size={12} />
                    </div>
                    <p className='text-xs'>Home</p>
                </button>
            </Link>
            {(list && list.length > 0) ? list?.map((item, index) => {
                return (
                    <Fragment key={index}>
                        <p className={`${item?.url ? '' : 'text-powder/80'} text-xs`}>/</p>
                        <p className={`${item?.url ? 'cursor-pointer' : 'text-powder/80'} text-xs`} onClick={(e) => item?.url ? router.push(item?.url) : e.preventDefault()}>{item?.label}</p>
                    </Fragment>
                )
            })
                : null
            }
        </div>
    )
}

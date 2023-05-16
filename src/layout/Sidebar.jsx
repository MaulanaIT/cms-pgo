// Import Library
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { IoBarcodeOutline, IoDocumentText, IoGrid, IoPlayBack, IoReceipt } from 'react-icons/io5';

// Import Components
import Header from '@/components/dashboard/Header';
import Footer from '@/components/Footer';

export default function Sidebar({
    children = null
}) {

    const router = useRouter();

    const [getShowSidebar, setShowSidebar] = useState(true);

    useEffect(() => {
        if (window.innerWidth < 1024) {
            setShowSidebar(false);
        }
    }, [router]);

    return (
        <main className='h-[100svh] overflow-hidden relative w-full'>
            <Header getShowSidebar={getShowSidebar} setShowSidebar={state => setShowSidebar(state)} />
            <section className='flex h-[calc(100svh-48px)] relative w-full'>
                <aside className={`bg-night-400 border-r-4 border-night-400/20 duration-300 fixed flex flex-col h-full ${getShowSidebar ? 'left-0 sm:max-w-[240px]' : '-left-full sm:left-[-240px] sm:max-w-[240px] lg:left-0 lg:max-w-[56px]'} overflow-auto transition-width w-full z-20 lg:bg-night-400/80 lg:relative`}>
                    <button type='button' className={`absolute duration-300 h-4 hidden right-2 ${getShowSidebar ? 'rotate-0' : 'rotate-180'} transition-transform top-2 w-4 z-[1] lg:block`} onClick={() => setShowSidebar(prevState => !prevState)}>
                        <IoPlayBack size={16} />
                    </button>
                    <div title="Admin" className={`flex items-start gap-4 mt-4 ${getShowSidebar ? 'p-6' : 'p-4'} relative w-full`}>
                        <div className={`bg-powder duration-100 flex ${getShowSidebar ? 'h-8 w-8' : 'h-6 w-6'} items-center justify-center relative rounded-full transition-width`}>
                            <p className={`${getShowSidebar ? 'text-base' : 'text-xs'} px-3 py-1 text-night-400`}>A</p>
                        </div>
                        {getShowSidebar ?
                            <div className='relative'>
                                <p className='text-sm'>Admin</p>
                                <p className='text-powder/50 text-xs'>admin@gmail.com</p>
                            </div>
                            : null
                        }
                    </div>
                    <div className='pb-10 relative'>
                        <Link href={'/dashboard'}>
                            <button type='button' title='Dashboard' className={`duration-200 flex gap-4 items-center ${getShowSidebar ? 'px-6' : 'px-[18px]'} py-3 relative transition-colors w-full hover:bg-night-300`}>
                                <div className='h-5 relative w-5'>
                                    <IoGrid size={20} />
                                </div>
                                {getShowSidebar ?
                                    <p className='text-sm'>Dashboard</p>
                                    : null
                                }
                            </button>
                        </Link>
                        {getShowSidebar ?
                            <p className='font-bold my-3 px-6 text-powder/50 text-xs'>PARTNER</p>
                            : null
                        }
                        {getShowSidebar ?
                            <p className='mb-1 px-6 text-xs'>Sandbox</p>
                            : null
                        }
                        <Link href={'/transaction'}>
                            <button type='button' title='Transaction' className={`duration-200 flex gap-4 items-center ${getShowSidebar ? 'px-6' : 'px-[18px]'} py-3 relative transition-colors w-full hover:bg-night-300`}>
                                <div className='h-5 relative w-5'>
                                    <IoReceipt size={20} />
                                </div>
                                {getShowSidebar ?
                                    <p className='text-sm'>Transaction</p>
                                    : null
                                }
                            </button>
                        </Link>
                        <Link href={'/credentials'}>
                            <button type='button' title='Transaction' className={`duration-200 flex gap-4 items-center ${getShowSidebar ? 'px-6' : 'px-[18px]'} py-3 relative transition-colors w-full hover:bg-night-300`}>
                                <div className='h-5 relative w-5'>
                                    <IoDocumentText size={20} />
                                </div>
                                {getShowSidebar ?
                                    <p className='text-sm'>Credentials</p>
                                    : null
                                }
                            </button>
                        </Link>
                        <Link href={'/qris'}>
                            <button type='button' title='Transaction' className={`duration-200 flex gap-4 items-center ${getShowSidebar ? 'px-6' : 'px-[18px]'} py-3 relative transition-colors w-full hover:bg-night-300`}>
                                <div className='h-5 relative w-5'>
                                    <IoBarcodeOutline size={20} />
                                </div>
                                {getShowSidebar ?
                                    <p className='text-sm'>QRIS</p>
                                    : null
                                }
                            </button>
                        </Link>
                    </div>
                </aside>
                <section className='flex flex-col min-h-full overflow-auto w-full'>
                    <div className='relative'>
                        {children}
                    </div>
                    <Footer />
                </section>
            </section>
        </main>
    )
}

// Import Library
import React, { Fragment } from 'react';

// Import Components
import BreadCrumb from '@/components/core/BreadCrumb';

export default function Dashboard() {

    return (
        <Fragment>
            <BreadCrumb />
            <div className='bg-night-300 border-b-8 border-night-400/70 px-6 py-8 relative w-full'>
                <p className='font-bold text-2xl'>Dashboard</p>
            </div>
        </Fragment>
    )
}

Dashboard.guard = true;
Dashboard.layout = 'Sidebar';
Dashboard.title = 'PGO Dashboard - Home';
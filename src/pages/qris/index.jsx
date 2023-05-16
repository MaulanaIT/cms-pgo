// Import Library
import axios from 'axios';
import Image from 'next/image';
import moment from 'moment';
import QRCode from 'react-qr-code';
import { NumericFormat } from 'react-number-format';
// import { io } from "socket.io-client";
import React, { Fragment, useEffect, useState } from 'react';

// Import Custom Library
import { generate_signature_pgo } from '@/lib/helper/hash';
import { useDispatch, useSelector } from 'react-redux';
import { getAuthData } from '@/config/store/reducer/authSlice';
import { setToastMessage } from '@/config/store/reducer/userSlice';

// Import Component
import BreadCrumb from '@/components/core/BreadCrumb';
import LoadingSpinner from '@/components/core/LoadingSpinner';

// Import Assets
import IconQRIS from '@/icons/ic-qris.png';
export default function QRIS() {

    const [getLoadingGenerateQRIS, setLoadingGenerateQRIS] = useState(false);

    const [getValueCountdown, setValueCountdown] = useState(0);
    const [getValueNominal, setValueNominal] = useState(0);
    const [getValueOrderID, setValueOrderID] = useState('');
    const [getValueQRIS, setValueQRIS] = useState({});

    const dispatch = useDispatch();

    const authData = useSelector(getAuthData);

    useEffect(() => {
        let countdown;

        if (getValueQRIS?.timeout_in_seconds > 0 && getValueCountdown > 0) {
            countdown = setTimeout(() => {
                setValueCountdown(prevState => prevState - 1);
            }, 1000);
        } else if (getValueQRIS?.timeout_in_seconds > 0 && getValueCountdown <= 0) {
            setValueCountdown(getValueQRIS?.timeout_in_seconds);
        }

        return () => {
            clearTimeout(countdown);
        }
    }, [getValueCountdown, getValueQRIS]);

    const GenerateQRIS = (e) => {
        e?.preventDefault();

        setLoadingGenerateQRIS(true);

        const clientSecret = authData?.client?.client_is_development ? authData?.client?.client_secret_development : authData?.client?.client_secret_production;

        const params = {
            nominal: +getValueNominal,
            order_id: getValueOrderID,
            client_code: authData?.client?.client_code
        }

        const signaturePGO = generate_signature_pgo(params?.order_id, params?.nominal, params?.client_code, clientSecret);

        axios.post('/api/v1/qris/request', params, {
            headers: {
                'signature-pgo': signaturePGO
            }
        }).then(res => {
            if (res?.data?.ok) {
                setValueOrderID('');
                setValueNominal('');

                setValueQRIS(res?.data?.data?.result);
                dispatch(setToastMessage({
                    active: true,
                    background: 'success',
                    message: res?.data?.data?.status_message
                }))
            } else {
                dispatch(setToastMessage({
                    active: true,
                    background: 'error',
                    message: res?.data?.message
                }))
            }
        }).finally(() => {
            setLoadingGenerateQRIS(false);
        });
    }

    return (
        <Fragment>
            <BreadCrumb
                list={[
                    { label: 'QRIS' }
                ]}
            />
            <div className='bg-night-300 border-b-8 border-night-400/70 px-6 py-8 relative w-full'>
                <p className='font-bold text-2xl'>QRIS</p>
            </div>
            <div className='p-6 relative'>
                <div className='bg-night-300 p-6 relative rounded-lg'>
                    <div className='gap-10 grid grid-cols-1 relative md:grid-cols-5'>
                        <form className='flex flex-col gap-4 items-start relative w-full md:col-span-2' onSubmit={GenerateQRIS}>
                            <div className='relative w-full'>
                                <p className='text-sm'>Order ID</p>
                                <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                                    <input type="text" className='w-full' placeholder='Order ID' value={getValueOrderID} onChange={e => setValueOrderID(e?.target?.value)} required={true} />
                                </div>
                            </div>
                            <div className='relative w-full'>
                                <p className='text-sm'>Nominal</p>
                                <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                                    <input type="number" className='w-full' placeholder='2' min={2} value={getValueNominal} onChange={e => setValueNominal(e?.target?.value)} required={true} />
                                </div>
                            </div>
                            <div className='relative w-full'>
                                <button type='submit' className='bg-info/70 duration-300 flex items-center justify-center gap-1 mt-4 px-8 py-[6px] rounded text-white transition-colors w-full hover:bg-info'>
                                    {getLoadingGenerateQRIS ?
                                        <LoadingSpinner />
                                        :
                                        'Generate QRIS'
                                    }
                                </button>
                            </div>
                        </form>
                        {getValueQRIS?.qris_string ?
                            <div className='grid justify-center md:col-span-3'>
                                <div className='bg-night-400 border-4 border-night-200 p-8 rounded-2xl'>
                                    <div className='flex justify-center w-full'>
                                        <div className='relative w-20'>
                                            <Image src={IconQRIS} height={32} width={82} className='invert' alt='Icon QRIS' />
                                        </div>
                                    </div>
                                    <div className='border gap-4 grid items-center h-66 justify-center mt-4 relative w-full'>
                                        <div style={{ height: "auto", margin: "0 auto", maxWidth: 256, width: "100%" }}>
                                            <QRCode
                                                size={256}
                                                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                                                value={getValueQRIS?.qris_string ?? ''}
                                                viewBox={`0 0 256 256`}
                                            />
                                        </div>
                                    </div>
                                    <div className='grid grid-cols-5 mt-4 relative'>
                                        <div className='col-span-2'>
                                            <p className='font-bold'>Order ID</p>
                                            <p className='font-bold'>Nominal</p>
                                        </div>
                                        <div className='col-span-2'>
                                            <p>: {getValueOrderID}</p>
                                            <p>: <NumericFormat
                                                type='text'
                                                displayType='text'
                                                value={getValueQRIS?.nominal ?? '-'}
                                                prefix='Rp '
                                                thousandsGroupStyle='thousand'
                                                thousandSeparator=','
                                            /></p>
                                        </div>
                                    </div>
                                    <div className='mt-4 text-center'>
                                        <p className='font-bold text-base'>Time left</p>
                                        <p className='font-bold text-4xl'>{moment.utc(getValueCountdown * 1000).format('mm:ss')}</p>
                                    </div>
                                </div>
                            </div>
                            : getLoadingGenerateQRIS ?
                                <div className='col-span-3 gap-4 grid items-center h-64 justify-center relative w-full'>
                                    <LoadingSpinner size={48} />
                                </div>
                                : null
                        }
                    </div>
                </div>
            </div>
        </Fragment>
    )
}

QRIS.layout = 'Sidebar';
QRIS.title = 'PGO Dashboard - QRIS';
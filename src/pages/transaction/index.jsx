// Import Library
import moment from 'moment';
import React, { Fragment, useEffect, useRef, useState } from 'react';
import { DateRange } from 'react-date-range';
import { IoChevronBackOutline, IoChevronForwardOutline, IoCloseCircle, IoPencil, IoSearch } from 'react-icons/io5';
import { useDispatch, useSelector } from 'react-redux';

// Import Custom Library
import useRequest from '@/config/api/request';
import { listRowPerPage } from '@/config/constant';
import { getAuthData } from '@/config/store/reducer/authSlice';
import { setToastMessage } from '@/config/store/reducer/userSlice';

// Import Components
import BreadCrumb from '@/components/core/BreadCrumb';
import { NumericFormat } from 'react-number-format';
import LoadingSpinner from '@/components/core/LoadingSpinner';
import Popup from '@/components/core/popup/Popup';

export default function Transaction() {

    const [getDataListTransaction, setDataListTransaction] = useState([]);

    const [getDateRange, setDateRange] = useState([{
        startDate: new Date(),
        key: 'dateRange'
    }]);

    const [getLoadingApproval, setLoadingApproval] = useState(false);
    const [getLoadingListTransaction, setLoadingListTransaction] = useState(false);

    const [getPaidDateRange, setPaidDateRange] = useState([{
        startDate: new Date(),
        key: 'paidDateRange'
    }]);

    const [getOpenDateRange, setOpenDateRange] = useState(false);
    const [getOpenPaidDateRange, setOpenPaidDateRange] = useState(false);

    const [getValueApprovalUsername, setValueApprovalUsername] = useState('');
    const [getValueApprovalTransactionID, setValueApprovalTransactionID] = useState('');

    const [getShowEditTransaction, setShowEditTransaction] = useState({
        active: false,
        id: ''
    });

    const [getPage, setPage] = useState(1);
    const [getRowPerPage, setRowPerPage] = useState(10);

    const [getTotalSum, setDataSum] = useState({
        sum: 0,
        fee: 0,
        fee_percentage: 0,
        total_transaction: 0
    });
    const [getTotalData, setTotalData] = useState(0);
    const [getTotalPage, setTotalPage] = useState(0);

    const [getValueSearch, setValueSearch] = useState('');

    const dispatch = useDispatch();
    const { requestPost } = useRequest();

    const refTimeoutSearch = useRef(null);

    const authData = useSelector(getAuthData);

    const listPaymentChannel = [
        'All', 'QRIS Dynamic', 'QRIS Statis'
    ]

    useEffect(() => {
        setValueApprovalUsername('');
        setValueApprovalTransactionID('');
    }, [getShowEditTransaction]);

    useEffect(() => {
        GetDataTransaction();
    }, [getPage]);

    useEffect(() => {
        ResetData();
    }, [getRowPerPage]);

    useEffect(() => {
        refTimeoutSearch.current = setTimeout(() => {
            ResetData();
        }, 500)
    }, [getValueSearch]);

    const GetDataTransaction = () => {
        const params = {
            client_code: authData?.client?.client_code,
            current_page: getPage,
            row_per_page: getRowPerPage,
            search: getValueSearch,
        }

        setLoadingListTransaction(true);

        requestPost('/api/v1/dashboard/transaction', params).then(res => {
            if (res?.data?.ok) {
                setDataSum(res?.data?.total);
                setDataListTransaction(res?.data?.data);
                setTotalPage(res?.data?.pagination?.total_pages);
                setTotalData(res?.data?.pagination?.total_rows);
            } else {
                dispatch(setToastMessage({
                    active: true,
                    background: 'error',
                    message: res?.data?.message
                }))
            }
        }).finally(() => {
            setTimeout(() => {
                setLoadingListTransaction(false);
            }, 500);
        });
    }

    const ResetData = () => {
        if (getPage <= 1) GetDataTransaction();
        else setPage(1);
    }

    const SearchFilter = (setState, value) => {
        clearTimeout(refTimeoutSearch.current);
        setState(value);

        setLoadingListTransaction(true)
    }

    const UpdateTransaction = (e) => {
        e?.preventDefault();

        const params = {
            _id: getShowEditTransaction?.id,
            editedBy: authData?.admin?.admin_name,
            approve_manual_username: getValueApprovalUsername,
            approve_manual_transaction_id: getValueApprovalTransactionID,
        }

        setLoadingApproval(true);

        requestPost('/api/v1/dashboard/update_transaction', params).then(res => {
            if (res?.data?.ok) {
                dispatch(setToastMessage({
                    active: true,
                    background: 'success',
                    message: res?.data?.message
                }))

                ResetData();

                setShowEditTransaction(null);
            } else {
                dispatch(setToastMessage({
                    active: true,
                    background: 'error',
                    message: res?.data?.message
                }))
            }
        }).finally(() => {
            setTimeout(() => {
                setLoadingApproval(false);
            }, 500);
        });
    }

    return (
        <Fragment>
            <BreadCrumb
                list={[
                    { label: 'Transaction' }
                ]}
            />
            <div className='bg-night-300 border-b-8 border-night-400/70 px-6 py-8 relative w-full'>
                <p className='font-bold text-2xl'>Transaction</p>
            </div>
            <div className='p-6 relative w-full'>
                <p className='text-xl'>Transaction List</p>
                <div className='border-[1px] border-powder inline-block max-w-[400px] mt-4 p-4 rounded-lg relative w-full'>
                    <p className='text-2xl'>SUM: <NumericFormat
                        type='text'
                        displayType='text'
                        value={getTotalSum.sum}
                        prefix='Rp '
                        thousandsGroupStyle='thousand'
                        thousandSeparator=','
                    /></p>
                    <p className='text-2xl'>FEE ({getTotalSum.fee_percentage * 100}%): <NumericFormat
                        type='text'
                        displayType='text'
                        value={getTotalSum.fee}
                        prefix='Rp '
                        thousandsGroupStyle='thousand'
                        thousandSeparator=','
                    /></p>
                    <p className='text-lg'>Total Transaction: <NumericFormat
                        type='text'
                        displayType='text'
                        value={getTotalData}
                        prefix=''
                        thousandsGroupStyle='thousand'
                        thousandSeparator=','
                    /></p>
                </div>
                <div className='grid grid-cols-[repeat(auto-fit,_minmax(300px,_1fr))] gap-3 items-center mt-8 relative rounded-lg'>
                    <div className='relative'>
                        <p className='text-sm'>Order ID</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                            <input type="text" className='w-full' placeholder='Search Order ID' />
                        </div>
                    </div>
                    <div className='relative'>
                        <p className='text-sm'>Payment Channel</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden pr-2 rounded w-full'>
                            <select className='[&>option]:bg-night-200 px-3 py-2 w-full'>
                                {(listPaymentChannel && listPaymentChannel?.length > 0) ? listPaymentChannel?.map((item, index) => {
                                    return (
                                        <option key={index} value={item}>{item}</option>
                                    )
                                })
                                    : null
                                }
                            </select>
                        </div>
                    </div>
                    <div className='relative'>
                        <p className='text-sm'>Status QRIS</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden pr-2 rounded w-full'>
                            <select className='[&>option]:bg-night-200 px-3 py-2 w-full'>
                                <option value="All">All</option>
                                <option value="1">Success</option>
                                <option value="0">Pending</option>
                            </select>
                        </div>
                    </div>
                    <div className='relative'>
                        <p className='text-sm'>Status Settlement</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden pr-2 rounded w-full'>
                            <select className='[&>option]:bg-night-200 px-3 py-2 w-full'>
                                <option value="All">All</option>
                                <option value="1">SETTLED</option>
                                <option value="0">NOT-SETTLED</option>
                            </select>
                        </div>
                    </div>
                    <div className='relative'>
                        <p className='text-sm'>Created Date</p>
                        <div className='relative'>
                            <div className='border-[1px] border-night-100 bg-night-200 cursor-pointer flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full' onClick={() => setOpenDateRange(prevState => !prevState)}>
                                <input type="text" className='pointer-events-none w-full' value={getDateRange[0]?.startDate ? `${moment(getDateRange[0]?.startDate).format('DD MMMM YYYY')} - ${moment(getDateRange[0]?.endDate).format('DD MMMM YYYY')}` : 'All'} readOnly={true} />
                            </div>
                            {getOpenDateRange ?
                                <DateRange
                                    className='absolute left-0 top-full z-10'
                                    editableDateInputs={true}
                                    onChange={item => setDateRange([item.dateRange])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={getDateRange}
                                />
                                : null
                            }
                        </div>
                    </div>
                    <div className='relative'>
                        <p className='text-sm'>Date Settlement</p>
                        <div className='relative'>
                            <div className='border-[1px] border-night-100 bg-night-200 cursor-pointer flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full' onClick={() => setOpenPaidDateRange(prevState => !prevState)}>
                                <input type="text" className='pointer-events-none w-full' value={getPaidDateRange[0]?.startDate ? `${moment(getPaidDateRange[0]?.startDate).format('DD MMMM YYYY')} - ${moment(getPaidDateRange[0]?.endDate).format('DD MMMM YYYY')}` : 'All'} readOnly={true} />
                            </div>
                            {getOpenPaidDateRange ?
                                <DateRange
                                    className='absolute left-0 top-full z-10'
                                    editableDateInputs={true}
                                    onChange={item => setPaidDateRange([item.paidDateRange])}
                                    moveRangeOnFirstSelection={false}
                                    ranges={getPaidDateRange}
                                />
                                : null
                            }
                        </div>
                    </div>
                    <div className='relative'>
                        <button type='submit' className='bg-info/70 duration-300 flex items-center justify-center gap-1 mt-8 px-8 py-[6px] rounded text-white transition-colors w-full hover:bg-info'>
                            <IoSearch />
                            Search
                        </button>
                    </div>
                </div>
                <div className='bg-night-300 mt-8 p-4 relative rounded-lg'>
                    <div className='inline-block max-w-[360px] relative w-full'>
                        <p className='text-sm'>Search</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                            <input type="text" className='w-full' placeholder='Search...' value={getValueSearch} onChange={e => SearchFilter(setValueSearch, e?.target?.value)} />
                        </div>
                    </div>
                    <div className='overflow-auto relative w-full'>
                        <table className='mt-4 table'>
                            <thead>
                                <tr>
                                    <th>Created Date</th>
                                    <th>Client TID</th>
                                    <th>Paid By</th>
                                    <th>Using</th>
                                    <th>Amount</th>
                                    <th>Date QRIS</th>
                                    <th>Status QRIS</th>
                                    <th>RRN</th>
                                    <th>Date Settlement</th>
                                    <th>Status Settlement</th>
                                    <th>Amount Settlement</th>
                                    <th>Additional Field</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {getLoadingListTransaction ?
                                    <tr>
                                        <td colSpan={13} className='text-center'><LoadingSpinner /></td>
                                    </tr>
                                    : (getDataListTransaction && getDataListTransaction?.length > 0) ? getDataListTransaction?.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td className='text-start whitespace-nowrap'>{moment(item?.createdAt).format('DD MMMM YYYY')} {moment(item?.createdAt).format('hh:mm:ss')}</td>
                                                <td className='text-center'>{item?.client_transaction_id}<input type="hidden" value="{item?._id}" /></td>
                                                <td className='text-center'>{item?.paid_by}</td>
                                                <td className='text-center'>{item?.payment_method}</td>
                                                <td className='text-end'>
                                                    <NumericFormat
                                                        type='text'
                                                        displayType='text'
                                                        value={item?.transaction_amount ?? '-'}
                                                        prefix=''
                                                        thousandsGroupStyle='thousand'
                                                        thousandSeparator=','
                                                    />
                                                </td>
                                                <td className='text-start whitespace-nowrap'>{moment(item?.transaction_date).format('DD MMMM YYYY')} {moment(item?.transaction_date).format('hh:mm:ss')}</td>
                                                <td className='text-center'>{(item?.transaction_status == 1) ? "SUCCESS" : "PENDING"}</td>
                                                <td className='text-center'>{item?.rrn}</td>
                                                <td className='text-center'>{(item?.transaction_settlement_status == 1) ? "SETTLED" : ""}</td>
                                                <td className='text-center'>{item?.transaction_settlement_date}</td>
                                                <td className='text-center'>{item?.transaction_settlement_amount}</td>
                                                <td className='text-center'>{JSON.stringify(item?.additional_field)}</td>
                                                <td>
                                                    {item?.approve_manual_status ?
                                                        <p className='font-bold text-center text-success'>Approved</p>
                                                        :
                                                        <button type='button' className='bg-periwinkle-400 duration-300 flex gap-2 items-center px-8 py-2 rounded-full text-white transition-colors w-full hover:bg-periwinkle-200' onClick={() => setShowEditTransaction({
                                                            active: true,
                                                            id: item?._id
                                                        })}>
                                                            <IoPencil />
                                                            Edit
                                                        </button>
                                                    }
                                                </td>
                                            </tr>
                                        )
                                    })
                                        :
                                        <tr>
                                            <td colSpan={13} className='text-center'>No data available in table</td>
                                        </tr>
                                }
                            </tbody>
                        </table>
                    </div>
                    <div className='flex flex-wrap gap-3 items-center justify-between mt-4 relative w-full'>
                        <div className='flex gap-2 items-center relative'>
                            <p className='text-xs whitespace-nowrap'>Rows per page</p>
                            <div className='border-[1px] border-night-100 bg-night-200 flex items-center overflow-hidden pr-2 rounded w-full'>
                                <select className='[&>option]:bg-night-200 px-2 py-1 w-full' onChange={(e) => setRowPerPage(e?.target?.value)}>
                                    {listRowPerPage?.map((item, index) => {
                                        return (
                                            <option key={index} value={item}>{item}</option>
                                        )
                                    })}
                                </select>
                            </div>
                        </div>
                        <div className='flex items-center gap-4 relative'>
                            <div className='relative'>
                                <p className='text-xs'>Total count: {getTotalData}</p>
                            </div>
                            <div className='flex items-center gap-2 relative'>
                                <button type='button' className={`h-3 relative w-3 text-white disabled:text-night-100`} disabled={getPage <= 1} onClick={() => setPage(prevState => prevState > 1 ? prevState - 1 : 1)}>
                                    <IoChevronBackOutline size={12} />
                                </button>
                                <p className='text-xs'>{getPage}</p>
                                <button type='button' className={`h-3 relative w-3 text-white disabled:text-night-100`} disabled={getPage >= getTotalPage} onClick={() => setPage(prevState => prevState + 1)}>
                                    <IoChevronForwardOutline size={12} />
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Popup classNameContainerAdditional='max-w-[375px] w-full' onClose={() => setShowEditTransaction(null)} showPopup={getShowEditTransaction?.active}>
                <div className='absolute cursor-pointer -right-[10px] -top-[10px] z-[1]' onClick={() => setShowEditTransaction(null)}><IoCloseCircle size={24} /></div>
                <form onSubmit={UpdateTransaction}>
                    <div className='relative w-full'>
                        <p className='text-sm'>Transaction ID</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                            <input type="text" className='w-full' placeholder='Transaction ID' value={getValueApprovalTransactionID} onChange={e => setValueApprovalTransactionID(e?.target?.value)} required={true} />
                        </div>
                    </div>
                    <div className='mt-4 relative w-full'>
                        <p className='text-sm'>Username</p>
                        <div className='border-[1px] border-night-100 bg-night-200 flex items-center gap-2 mt-2 overflow-hidden px-3 py-2 rounded w-full'>
                            <input type="text" className='w-full' placeholder='Username' value={getValueApprovalUsername} onChange={e => setValueApprovalUsername(e?.target?.value)} required={true} />
                        </div>
                    </div>
                    {getLoadingApproval ?
                        <div className='mt-8'>
                            <LoadingSpinner />
                        </div>
                        :
                        <button type='submit' className='bg-periwinkle-400 duration-300 mt-8 px-8 py-2 rounded-full text-white transition-colors w-full hover:bg-periwinkle-200'>
                            Update
                        </button>
                    }
                </form>
            </Popup>
        </Fragment >
    )
}

Transaction.guard = true;
Transaction.layout = 'Sidebar';
Transaction.title = 'PGO Dashboard - Transaction';
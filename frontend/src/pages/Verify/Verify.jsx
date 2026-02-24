import React, { useContext, useEffect, useCallback } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../context/StoreContext'
import axios from 'axios';

const Verify = () => {

    const [searchParams] = useSearchParams();
    const success = searchParams.get("success");
    const orderId = searchParams.get("orderId");
    const { url } = useContext(StoreContext);
    const navigate = useNavigate();

    const verifyPayment = useCallback(async () => {
        const response = await axios.post(url + "/api/order/verify", {
            success,
            orderId,
        });
        if (response.data.success) {
            navigate("/my-orders");
        }
        else {
            navigate("/");
        }
    }, [url, success, orderId, navigate]);

    useEffect(() => {
        verifyPayment();
    }, [verifyPayment])

    return (
        <div className='min-h-[60vh] grid place-items-center'>
            <div className='w-[100px] h-[100px] border-[5px] border-[#bdbdbd] border-t-[tomato] rounded-full animate-spin'>
            </div>

        </div>
    )
}

export default Verify   
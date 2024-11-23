import { buildClient } from '@/api';
import { AxiosResponse } from 'axios';
import { GetServerSideProps } from 'next';
import React, { useEffect, useState } from 'react'
import { ICurrentUser } from '../_app';

interface Order {
    id: string;
    userId: string;
    status: "created" | "completed" | "cancelled" | "expired";
    expiresAt: string;
    ticket: {
        id: string;
        title: string;
        price: number;
        __v: number;
    };
    createdAt: string;
    updatedAt: string;
    __v: number;
};

interface IShowOrder extends ICurrentUser {
    order: Order;
}

const ShowOrder = (props: React.PropsWithoutRef<IShowOrder>) => {
    const expiresAt = new Date(props.order.expiresAt);
    const leftTime = (expiresAt.getTime() - Date.now()) / (1000 * 60);

    const [expiresInMin, setExpiresInMin] = useState(leftTime);

    useEffect(() => {
        if (expiresInMin <= 0) return;

        const interval = setInterval(() => {
            setExpiresInMin(prev => prev - 1);
        }, (1000 * 60));

        return () => {
            clearInterval(interval);
        }
    }, [expiresInMin <= 0]);

    return (
        <section className='py-8 flex flex-col gap-4'>
            <div className='flex flex-col gap-4 text-stone-800'>
                <h1 className="text-xl">Time left to pay: <span className='font-medium'>{expiresInMin <= 0 ? "Has expired" : `${expiresInMin.toFixed(0)} minutes`}</span></h1>
            </div>
            <div>
                <button className='py-2 px-4 bg-blue-500 text-white rounded font-medium'>Pay ${props.order.ticket.price.toFixed(2)}</button>
            </div>
        </section>
    )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { orderId } = context.query;
    const client = buildClient(context);
    const response: AxiosResponse<Order> = await client.get(`/api/orders/${orderId}`);

    return {
        props: {
            order: response.data
        }
    }
}

export default ShowOrder
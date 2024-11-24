import { buildClient } from "@/api";
import { AxiosResponse } from "axios";
import { GetServerSideProps } from "next"
import { ICurrentUser } from "../_app";

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

interface IOrders extends ICurrentUser {
    orders: Order[];
}

const orders = (props: React.PropsWithoutRef<IOrders>) => {
    return (
        <section className="py-8">
            <h1 className="text-center text-5xl font-semibold text-stone-800">My Orders</h1>
            {props.orders.length
                ? <ul className="flex flex-col gap-8">
                    {props.orders.map(order => {
                        const expiredAt = new Date(order.expiresAt).toLocaleString();
                        return (
                            <li key={order.id} className="border-b pb-4 last:border-b-0">
                                <strong className={order.status === "completed" ? "bg-green-200/50 text-green-500/80 py-1 px-2 rounded uppercase" : "bg-stone-200/50 text-stone-500 py-1 px-2 rounded uppercase"} title={order.status === "expired" ? expiredAt : undefined}>{order.status}</strong>
                                <h3 className="mt-1">Ticket: {order.ticket.title}</h3>
                                <span>${order.ticket.price.toFixed(2)}</span>
                            </li>
                        )
                    })}
                </ul>
                : null
            }
        </section>
    )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
    const client = buildClient(context);
    const response: AxiosResponse<IOrders> = await client.get(`/api/orders`);

    return {
        props: {
            orders: response.data.orders
        }
    }
};

export default orders
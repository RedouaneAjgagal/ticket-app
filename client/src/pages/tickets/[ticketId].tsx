import { GetServerSideProps } from "next";
import { ICurrentUser } from "../_app"
import { buildClient } from "@/api";
import { AxiosResponse } from "axios";

interface Ticket {
    id: string;
    title: string;
    price: number;
    userId: string;
    orders: string[];
    createdAt: string;
    updatedAt: string;
    __v: number;
};

interface ITicketShow extends ICurrentUser {
    ticket: Ticket;
}

const TicketShow = (props: React.PropsWithoutRef<ITicketShow>) => {
    const orderTicketHandler = () => {
        console.log({ ticketId: props.ticket.id });
    }

    return (
        <section className="py-8">
            <div className="flex flex-col gap-4 text-stone-800">
                <h1 className="text-4xl font-semibold">{props.ticket.title}</h1>
                <span className="text-xl font-medium">Price: ${props.ticket.price.toFixed(2)}</span>
                <button onClick={orderTicketHandler} className="self-start py-2 px-3 bg-blue-500 font-medium text-white rounded">Purchase</button>
            </div>
        </section>
    )
};

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { ticketId } = context.query;
    const client = buildClient(context);
    const response: AxiosResponse<Ticket> = await client.get(`/api/tickets/${ticketId}`);

    return {
        props: {
            ticket: response.data
        }
    }
}

export default TicketShow
import mongoose from "mongoose";
import Order from "./order";
import { OrderStatus } from "@redagtickets/common";

interface TicketAttrs {
    __v: number;
    title: string;
    price: number;
    orders: string[];
};

interface BuildTicketAttrsWithId extends TicketAttrs {
    id?: string;
};

export interface TicketDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    __v: number;
    title: string;
    price: number;
    orders: string[];
    isReserved: () => Promise<boolean>;
};

interface TicketStatics extends mongoose.Model<TicketDoc> {
    build(attrs: BuildTicketAttrsWithId): Promise<TicketDoc>;
    findByEvent(attrs: { id: string; __v: number }): Promise<TicketDoc | string>;
};

const ticketSchema = new mongoose.Schema<TicketAttrs>({
    title: {
        type: String,
        required: [true, "Ticket title is required"]
    },
    price: {
        type: Number,
        min: 0,
        required: [true, "Ticket price is required"]
    },
    orders: {
        type: []
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

// statics
ticketSchema.statics.build = async (attrs: BuildTicketAttrsWithId) => {
    const ticketDetails: TicketAttrs & { _id?: string } = {
        __v: attrs.__v,
        title: attrs.title,
        price: attrs.price,
        orders: attrs.orders
    };

    if (attrs.id) {
        ticketDetails._id = attrs.id;
    };

    const ticket = new Ticket(ticketDetails);
    await ticket.save();

    return ticket;
};

ticketSchema.statics.findByEvent = async (event: { id: string; __v: number }) => {
    const ticket = await Ticket.findById(event.id);
    if (!ticket) {
        return "Found no ticket";
    };

    const isNextUpdate = ticket.__v + 1 === event.__v;
    if (!isNextUpdate) {
        return "Updating is out of order";
    };

    return ticket;
}

// methods
ticketSchema.methods.isReserved = async function () {
    const existingOrder = await Order.findOne({
        ticket: this,
        status: {
            $in: [
                OrderStatus.Created,
                OrderStatus.AwaitingPayment,
                OrderStatus.Completed
            ]
        }
    });

    return existingOrder ? true : false;
};

const Ticket = mongoose.model<TicketAttrs, TicketStatics>("Ticket", ticketSchema);

export default Ticket;
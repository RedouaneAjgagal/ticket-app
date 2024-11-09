import mongoose from "mongoose";
import Order from "./order";
import { OrderStatus } from "@redagtickets/common";

interface TicketAttrs {
    title: string;
    price: number;
};

interface BuildTicketAttrsWithId extends TicketAttrs {
    id?: string;
};

export interface TicketDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    title: string;
    price: number;
    __v: number;
    isReserved: () => Promise<boolean>;
};

interface TicketStatics extends mongoose.Model<TicketDoc> {
    build(attrs: BuildTicketAttrsWithId): Promise<TicketDoc>;
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
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    },
    optimisticConcurrency: true
});

// statics
ticketSchema.statics.build = async (attrs: BuildTicketAttrsWithId) => {
    const ticketDetails: TicketAttrs & { _id?: string } = {
        title: attrs.title,
        price: attrs.price
    };

    if (attrs.id) {
        ticketDetails._id = attrs.id;
    };

    const ticket = new Ticket(ticketDetails);
    await ticket.save();

    return ticket;
};

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
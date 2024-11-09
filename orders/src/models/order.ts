import { OrderStatus } from "@redagtickets/common";
import mongoose from "mongoose";
import { TicketDoc } from "./ticket";

interface OrderAttrs {
    userId: string;
    status: OrderStatus;
    ticket: TicketDoc;
};

interface OrderDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    userId: string;
    status: OrderStatus;
    expiresAt: Date;
    ticket: TicketDoc;
    createdAt: string;
    updatedAt: string;
};

interface OrderStatics extends mongoose.Model<OrderDoc> {
    build(atts: OrderAttrs): Promise<OrderDoc>;
};

interface OrderSchema extends OrderAttrs {
    expiresAt: Date;
}

const orderSchema = new mongoose.Schema<OrderSchema>({
    userId: {
        type: String,
        required: [true, "User ID is required"]
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        default: OrderStatus.Created,
        required: [true, "Status is required"]
    },
    expiresAt: {
        type: mongoose.Schema.Types.Date,
        required: [true, "Expiration date is required"]
    },
    ticket: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Ticket",
        required: [true, "Ticket ID is required"]
    }
}, {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = async (atts: OrderAttrs) => {
    const expiresInMs = 15 * 60 * 1000; // 15min
    const expiresAt = new Date(Date.now() + expiresInMs);
    const order = new Order({
        ...atts,
        expiresAt
    });

    await order.save();

    return order;
};

const Order = mongoose.model<OrderSchema, OrderStatics>("Order", orderSchema);

export default Order;
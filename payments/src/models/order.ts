import { OrderStatus } from "@redagtickets/common";
import mongoose from "mongoose";

interface OrderAttrs {
    id: string;
    __v: number;
    userId: string;
    status: OrderStatus;
    ticket: {
        id: string;
        price: number;
    };
    createdAt: Date;
};

interface OrderDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    __v: number;
    userId: string;
    status: OrderStatus;
    ticket: {
        id: string;
        price: number;
    };
};

interface OrderStatics extends mongoose.Model<OrderDoc> {
    build(attrs: OrderAttrs): Promise<OrderDoc>;
};

const orderSchema = new mongoose.Schema<OrderAttrs>({
    userId: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: Object.values(OrderStatus),
        required: true
    },
    ticket: {
        id: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    },
    createdAt: {
        type: mongoose.Schema.Types.Date,
        required: true
    }
}, {
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        }
    }
});

orderSchema.statics.build = async (attrs: OrderAttrs) => {
    const order = new Order({
        ...attrs,
        _id: attrs.id
    });
    await order.save();

    return order;
};

const Order = mongoose.model<OrderAttrs, OrderStatics>("Order", orderSchema);

export default Order;
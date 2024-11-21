import mongoose from "mongoose";
import { OrderDoc } from "./order";

interface PaymentAttrs {
    order: OrderDoc;
    chargeId: string;
};

interface PaymentDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    __v: number;
    order: OrderDoc;
    chargeId: string;
    createdAt: string;
    updatedAt: string;
};

interface PaymentStatics extends mongoose.Model<PaymentDoc> {
    build(attrs: PaymentAttrs): Promise<PaymentDoc>;
};

const paymentSchema = new mongoose.Schema<PaymentAttrs>({
    order: {
        type: mongoose.Types.ObjectId,
        ref: "Order",
        required: true
    },
    chargeId: {
        type: String,
        required: [true, "ChargeId ID is required"]
    }
}, {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = doc.id;
            delete ret._id;
        },
    }
});

paymentSchema.statics.build = async (attrs: PaymentAttrs) => {
    const payment = new Payment(attrs);
    await payment.save();

    return payment;
}

const Payment = mongoose.model<PaymentAttrs, PaymentStatics>("Payment", paymentSchema);

export default Payment;
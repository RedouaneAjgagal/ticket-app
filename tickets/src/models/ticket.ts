import mongoose from "mongoose";

interface TicketAttrs {
    title: string;
    price: number;
    userId: string;
};

interface TicketDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    __v: number;
    title: string;
    price: number;
    userId: string;
    createdAt: string;
    updatedAt: string;
};

interface TicketStatics extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): Promise<TicketDoc>;

};

const ticketSchema = new mongoose.Schema<TicketAttrs>({
    title: {
        type: String,
        required: [true, "Must provide a ticket title"]
    },
    price: {
        type: Number,
        required: [true, "Must provide a ticket price"],
        min: 0
    },
    userId: {
        type: String,
        required: [true, "Must provide the user ID"]
    }
}, {
    timestamps: true,
    optimisticConcurrency: true,
    toJSON: {
        transform(doc, ret) {
            ret.id = ret._id;
            delete ret._id;
        },
    }
});

ticketSchema.statics.build = async (attrs: TicketAttrs) => {
    const ticket = new Ticket(attrs);
    await ticket.save();

    return ticket;
};

const Ticket = mongoose.model<TicketAttrs, TicketStatics>("ticket", ticketSchema);

export default Ticket;
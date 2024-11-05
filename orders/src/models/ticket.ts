import mongoose from "mongoose";

interface TicketAttrs {
    title: string;
    price: number;
};

export interface TicketDoc extends mongoose.Document<mongoose.Types.ObjectId> {
    title: string;
    price: number;
};

interface TicketStatics extends mongoose.Model<TicketDoc> {
    build(attrs: TicketAttrs): Promise<TicketDoc>;
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
        versionKey: false
    }
});

ticketSchema.statics.build = async (attrs: TicketAttrs) => {
    const ticket = new Ticket(attrs);
    await ticket.save();
};

const Ticket = mongoose.model<TicketAttrs, TicketStatics>("Ticket", ticketSchema);

export default Ticket;
import Ticket from "../ticket";

it("should implements optimistic Concurrency control", async () => {
    const ticket = await Ticket.build({
        title: "a ticket",
        price: 10
    });

    const firstInstance = await Ticket.findById(ticket.id);
    const secondInstance = await Ticket.findById(ticket.id);
    
    firstInstance!.set("price", 20);
    await firstInstance!.save();
    
    secondInstance!.set("price", 30);
    try {
        await secondInstance!.save();
    } catch (error) {
        return;
    };

    throw new Error("Doesn't implement optimistic concurrency control");
});
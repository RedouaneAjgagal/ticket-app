function generateFakeStripeIntentId() {
    const randomString = (length: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    return `pi_${randomString(24)}`;
};

const stripe = {
    paymentIntents: {
        capture: jest.fn().mockResolvedValue({ id: generateFakeStripeIntentId(), status: "succeeded" }),
        create: jest.fn().mockResolvedValue({ client_secret: `${generateFakeStripeIntentId()}_secret_${generateFakeStripeIntentId().split("_")[1]}` })
    }
};

export default stripe;
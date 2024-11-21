function generateFakeStripeChargeId() {
    const randomString = (length: number) => {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        for (let i = 0; i < length; i++) {
            result += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return result;
    };

    return `ch_${randomString(24)}`;
};

const stripe = {
    charges: {
        create: jest.fn().mockResolvedValue({ id: generateFakeStripeChargeId() })
    }
};

export default stripe;
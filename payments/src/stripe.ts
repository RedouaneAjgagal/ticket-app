import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_KEY!, {
    apiVersion: "2024-10-28.acacia",
    typescript: true
});

export default stripe;
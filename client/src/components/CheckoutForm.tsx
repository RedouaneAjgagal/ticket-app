import { useRequest } from "@/hooks";
import { useStripe, PaymentElement, useElements } from "@stripe/react-stripe-js"
import { useRouter } from "next/router";
import { useState } from "react";

interface ICheckForm {
    orderId: string;
    price: number;
    clientSecret: string;
}

const CheckoutForm = (props: React.PropsWithoutRef<ICheckForm>) => {
    const [isLoading, setIsloading] = useState(false);
    const [isSuccess, setIsSucces] = useState(false);

    const router = useRouter();

    const stripe = useStripe();
    const elements = useElements();

    const request = useRequest<{ id: string }>({
        method: "post",
        url: "/api/payments",
        payload: {
            orderId: props.orderId
        }
    })

    const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();


        if (!stripe || !elements || isLoading || isSuccess) return;

        setIsloading(true);

        elements.submit();

        const { error, paymentIntent } = await stripe.confirmPayment({
            clientSecret: props.clientSecret,
            elements,
            redirect: "if_required"
        });

        if (error) {
            setIsloading(false);
            return;
        };

        if (paymentIntent.status === "requires_capture") {
            await request.fetchData({
                paymentIntentId: paymentIntent.id
            });

            if (!request.errors.length) {
                setIsSucces(true);

                setTimeout(() => {
                    setIsSucces(false);
                    router.push("/");
                }, 3000);
            }
        };

        setIsloading(false);
    };

    return (
        <div>
            <form className="max-w-[30rem]" id="payment-form" onSubmit={handleSubmit}>
                <PaymentElement id="payment-element" />
                <div className="py-4">
                    <button disabled={!stripe || !elements || isLoading || isSuccess} id="submit" className={`py-2 px-4 text-white rounded font-medium ${isSuccess ? "bg-green-500" : "bg-blue-500"}`}>{isSuccess ? "Success!" : isLoading ? `Paying..` : `Pay ${props.price.toFixed(2)}`}</button>
                </div>
            </form>
        </div>
    )
}

export default CheckoutForm
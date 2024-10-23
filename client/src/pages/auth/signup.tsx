import { useRequest } from "@/hooks";
import { useRouter } from "next/router";
import React, { useState } from "react";

const signup = () => {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const router = useRouter();

    const { fetchData, isLoading, errors } = useRequest({
        url: "/api/users/signup",
        method: "post",
        payload: {
            email,
            password
        },
        onSuccess: () => {
            router.push("/");
        }
    });

    const signUpHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
        e.preventDefault();
        await fetchData();
    }

    return (
        <section>
            <h1 className="text-center text-5xl font-semibold text-stone-800">Sign Up</h1>
            <form onSubmit={signUpHandler} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                    <label htmlFor="email">Email Address</label>
                    <input onChange={(e) => setEmail(e.target.value)} type="email" name="email" id="email" className="border-2 border-slate-300 rounded py-1 px-2" />
                </div>
                <div className="flex flex-col gap-1">
                    <label htmlFor="password">Password</label>
                    <input onChange={(e) => setPassword(e.target.value)} type="password" name="password" id="password" className="border-2 border-slate-300 rounded py-1 px-2" />
                </div>
                <div>
                    <button disabled={isLoading} type="submit" className="py-2 px-4 rounded bg-amber-600 font-medium text-white">Sign Up</button>
                </div>
                {errors.length
                    ? <div className="px-8 py-6 bg-red-500/30 rounded text-red-700 flex flex-col gap-4">
                        <h3 className="font-semibold text-2xl">Ooops...</h3>
                        <ul className="px-12 font-medium">
                            {errors.map((err, index) => (
                                <li key={index} className="list-disc">{err.message}</li>
                            ))}
                        </ul>
                    </div>
                    : null
                }
            </form>
        </section>
    )
}

export default signup
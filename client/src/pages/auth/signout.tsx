import { useRequest } from "@/hooks"
import { useRouter } from "next/router"
import { useEffect } from "react"

const signout = () => {
    const router = useRouter();

    const { fetchData } = useRequest({
        method: "post",
        url: "/api/users/signout",
        payload: {},
        onSuccess: () => router.push("/")
    });

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div>signout</div>
    )
}

export default signout
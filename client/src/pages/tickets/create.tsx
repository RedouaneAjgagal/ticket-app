import { Errors } from "@/components";
import { useRequest } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { ICurrentUser } from "../_app";

interface ICreateTicket extends ICurrentUser { };

const create = (props: React.PropsWithoutRef<ICreateTicket>) => {
  const [title, setTitle] = useState<string>("");
  const [price, setPrice] = useState<string>("");

  const router = useRouter();

  const { fetchData, errors } = useRequest({
    method: "post",
    url: "/api/tickets",
    payload: {
      title,
      price
    },
    onSuccess: () => {
      router.push("/");
    }
  });

  const createTicketHandler: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await fetchData();
  };

  return (
    <section className="py-8">
      <h1 className="text-center text-5xl font-semibold text-stone-800">Create a Ticket</h1>
      <form onSubmit={createTicketHandler} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title">Title</label>
          <input onChange={(e) => setTitle(e.target.value)} value={title} type="text" name="title" id="title" className="border-2 border-slate-300 rounded py-1 px-2" />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="price">Price</label>
          <input onChange={(e) => setPrice(e.target.value)} value={price} type="number" name="price" id="price" className="border-2 border-slate-300 rounded py-1 px-2" />
        </div>
        <div>
          <button type="submit" className="py-2 px-4 rounded bg-blue-500 font-medium text-white">Submit</button>
        </div>
        <Errors errors={errors} />
      </form>
    </section>
  )
}

export default create
import Link from "next/link";
import { ICurrentUser } from "./_app";
import { GetServerSideProps } from "next";
import { buildClient } from "@/api";
import { AxiosResponse } from "axios";

interface Ticket {
  id: string;
  title: string;
  price: number;
  userId: string;
  orders: string[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

interface IHome extends ICurrentUser {
  tickets: Ticket[];
}

function Home(props: React.PropsWithoutRef<IHome>) {

  return (
    <div className="py-8 flex flex-col gap-8">
      <div className="flex justify-end">
        <Link className="py-2 px-3 bg-blue-500 font-medium text-white rounded" href="/tickets/create">Create a Ticket</Link>
      </div>
      {props.tickets.length
        ? <div>
          <table className="table-auto border border-slate-400 w-full text-left text-lg">
            <thead>
              <tr>
                <th className="border-y border-slate-400 py-1 px-3">Title</th>
                <th className="border-y border-slate-400 py-1 px-3">Price</th>
                <th className="border-y border-slate-400 py-1 px-3">Created At</th>
                <th className="border-y border-slate-400 py-1 px-3">Link</th>
              </tr>
            </thead>
            <tbody>
              {props.tickets.map(ticket => (
                <tr key={ticket.id}>
                  <td className="border-y border-slate-400 py-1 px-3">{ticket.title}</td>
                  <td className="border-y border-slate-400 py-1 px-3">${ticket.price.toFixed(2)}</td>
                  <td className="border-y border-slate-400 py-1 px-3">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  <td className="border-y border-slate-400 py-1 px-3"><Link className="text-blue-500" href="/tickets/[ticketId]" as={`/tickets/${ticket.id}`}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        : null
      }
    </div>
  );
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context);
  const response: AxiosResponse<{ tickets: Ticket[] }> = await client.get("/api/tickets");

  return {
    props: {
      tickets: response.data.tickets
    }
  };
}

export default Home;
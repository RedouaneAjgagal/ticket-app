import Link from "next/link";
import { ICurrentUser } from "./_app";

function Home(props: React.PropsWithoutRef<ICurrentUser>) {

  return (
    <div className="py-8 flex flex-col gap-8">
      <div className="flex justify-end">
        <Link className="py-2 px-3 bg-blue-500 font-medium text-white rounded" href="/tickets/create">Create a Ticket</Link>
      </div>
    </div>
  );
}

export default Home;
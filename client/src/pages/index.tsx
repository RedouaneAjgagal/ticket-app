import { ICurrentUser } from "./_app";

function Home(props: React.PropsWithoutRef<ICurrentUser>) {

  return (
    <div>
      {props.user
        ? (
          <div className="flex flex-col gap-2">
            <h1 className="text-3xl">You are signed in</h1>
            <p>email: {props.user.email}</p>
          </div>
        )
        : (
          <div>
            <h1 className="text-3xl">You are NOT signed in</h1>
          </div>
        )
      }
    </div>
  );
}

export default Home;
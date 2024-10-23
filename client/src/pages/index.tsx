import axios, { AxiosResponse } from "axios";
import { GetServerSideProps } from "next";
import { buildClient } from "../../api";

interface CurrentUserResponse {
  user: null | {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }
}

function Home(props: React.PropsWithoutRef<CurrentUserResponse>) {
  console.log(props.user);

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

export const getServerSideProps: GetServerSideProps = async (context) => {
  const client = buildClient(context);
  const response: AxiosResponse<CurrentUserResponse> = await client.get("/api/users/current-user");
  return {
    props: response.data
  };
}

export default Home;
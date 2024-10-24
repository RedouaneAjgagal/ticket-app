import "@/styles/globals.css";
import App, { AppContext, AppInitialProps, AppProps } from "next/app";
import { buildClient } from "../api";
import { AxiosResponse } from "axios";

export interface ICurrentUser {
  user: null | {
    id: string;
    email: string;
    iat: number;
    exp: number;
  }
}

const AppComponent = ({ Component, pageProps, user }: AppProps & ICurrentUser) => {
  return (
    <div>
      <main className="max-w-[70rem] mx-auto">
        <Component {...{ ...pageProps, user }} />
      </main>
    </div>
  )
}

AppComponent.getInitialProps = async (appContext: AppContext): Promise<ICurrentUser & AppInitialProps> => {
  const client = buildClient(appContext.ctx);
  const response: AxiosResponse<ICurrentUser> = await client.get("/api/users/current-user");

  const ctx = await App.getInitialProps(appContext);
  return { ...ctx, user: response.data.user }
}

export default AppComponent
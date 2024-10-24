import axios from "axios";
import { GetServerSidePropsContext, NextPageContext } from "next";

const buildClient = ({ req }: GetServerSidePropsContext | NextPageContext) => {
    if (typeof window === "undefined") {
        return axios.create({
            baseURL: "http://ingress-nginx-controller.ingress-nginx.svc.cluster.local",
            headers: req?.headers
        });
    } else {
        return axios.create({
            baseURL: "/"
        });
    }
}

export default buildClient;
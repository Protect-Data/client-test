import { API_URL } from "@/utils/keys";
import axios from "axios";
import { getSession } from "next-auth/react";
import { cookies } from "next/headers";

export const httpClient = axios.create({
  baseURL: API_URL
});

httpClient.interceptors.request.use(async (request: any) => {
  const session: any = await getSession();
  const cookie: any = cookies().get("protectdata.session");
  if (session) {
    console.log("tokenS", session.token);
    request.headers.Authorization = `Bearer ${session.token}`;
  } else if (cookie) {
    console.log("tokenC", cookie.value);
    request.headers.Authorization = `Bearer ${cookie.value}`;
  }
  return request;
});

httpClient.interceptors.response.use(
  (response: any) => Promise.resolve(response.data),
  (error: { response: any }) => {
    // console.log("error.response.data", error.response);
    return Promise.reject(error.response.data);
  }
);

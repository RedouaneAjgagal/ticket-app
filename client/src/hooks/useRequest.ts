import axios, { AxiosError } from 'axios';
import { useState } from 'react';

interface UseRequestWithoutPayload {
  method: "get"
  url: string;
  onSuccess: () => void;
}

interface UseRequestWithPayload {
  method: "post" | "patch" | "put" | "delete";
  url: string;
  payload: Object;
  onSuccess?: (data: unknown) => void;
}

type UseRequestPayload = UseRequestWithoutPayload | UseRequestWithPayload;


interface ErrorResponse { message: string; field?: string };


const useRequest = <T>(payload: UseRequestPayload) => {
  const [data, setData] = useState<T | null>(null);
  const [errors, setErrors] = useState<ErrorResponse[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const response = payload.method === "get"
        ? await axios.get(payload.url)
        : await axios[payload.method](
          payload.url,
          payload.payload
        );
      setData(response.data);
      if (payload.onSuccess) {
        payload.onSuccess(response.data);
      }
      if (errors.length) {
        setErrors([]);
      }
    } catch (error) {
      const getError = error as AxiosError<{ errors: ErrorResponse[] }>;
      setErrors(getError.response?.data.errors || [{ message: "Something went wrong" }]);
    } finally {
      setIsLoading(false);
    }
  }

  return {
    fetchData,
    isLoading,
    errors,
    data
  }
}

export default useRequest
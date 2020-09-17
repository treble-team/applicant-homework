import { useEffect, useState } from "react";

export interface CoronaObject {
  date: string;
  deaths: number;
  confirmed: number;
  active: number;
  recovered: number;
}

interface ServiceInit {
  status: "init";
}
interface ServiceLoading {
  status: "loading";
}
interface ServiceLoaded<T> {
  status: "loaded";
  payload: T;
}
interface ServiceError {
  status: "error";
  error: Error;
}
export type Service<T> =
  | ServiceInit
  | ServiceLoading
  | ServiceLoaded<T>
  | ServiceError;

const useApiService = () => {
  const [result, setResult] = useState<Service<CoronaObject[]>>({
    status: "loading",
  });

  useEffect(() => {
    fetch("https://localhost:44397/corona")
      .then((response) => response.json())
      .then((response) => setResult({ status: "loaded", payload: response }))
      .catch((error) => setResult({ status: "error", error }));
  }, []);

  return result;
};

export default useApiService;

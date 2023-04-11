// 1ファイルで行ってしまいますね

import { Suspense } from "react";
import useSWR from "swr";
import axios from "axios";

async function sleep(ms: number) {
  return await new Promise((resolve) => setTimeout(resolve, ms));
}

const fetcher = (url: string) => axios.get(url).then((res) => res.data);

const useFetch = (url: string) => {
  if (Math.random() < 0.5) {
    throw sleep(1000); // 無理やりPromiseをthrowする
  }
  const { data, error } = useSWR(url, fetcher, { suspense: true });
  return { data, error };
};

const UserEmail = () => {
  const { data, error } = useFetch(
    "https://jsonplaceholder.typicode.com/users/1"
  );

  if (error) return <p>取得失敗</p>;
  return <div>Data is {data.email}</div>;
};

export const RenderAsYouFetch = () => {
  return (
    <div className="text-center">
      <Suspense fallback={<p>Loading...userEmail</p>}>
        <UserEmail />
      </Suspense>
    </div>
  );
};

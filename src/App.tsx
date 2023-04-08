import "./App.css";
import { Suspense, useState, FC, useMemo } from "react";
import { RenderAsYouFetch } from "./Components/RenderAsYouFetch";
function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const AlwaysSuspend: React.VFC = () => {
  console.log("AlwaysSuspend is rendered");
  if (Math.random() < 0.5) {
    throw sleep(1000); // Promiseが解決されるまで、何度も呼び出す
  }
  return <p>hello,world</p>;
};

type Props = {
  name: string;
};

export const RenderingNotifier: FC<Props> = ({ name }) => {
  console.log(`${name} is rendered`);
  return null;
};

type Data = {
  [key: string]: string;
};
const fetchData = async (): Promise<Data> => {
  //await sleep(2000);
  //return `hello world`;
  const data = await fetch("https://jsonplaceholder.typicode.com/users/1").then(
    (res) => res.json()
  );
  return data;
};

const DataLoader: FC = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<string | null>(null);

  // Suspense内のmemoは、Promiseがthrowされると破棄される。そして新たに発火する
  const _ = useMemo(() => {
    if (loading) {
      console.log("loading is true");
    }
    return 1;
  }, [loading]);

  if (loading && data === null) {
    throw fetchData().then(setData);
  }
  return (
    <div>
      Data is {data}
      {/*Promise解決による再レンダリング」より前にsetDataによる再レンダリングが起こっている */}
      <button className="border p-1" onClick={() => setLoading(true)}>
        load
      </button>
    </div>
  );
};

const dataMap: Map<string, unknown> = new Map();

export function useData<T>(cacheKey: string, fetch: () => Promise<T>): T {
  const cachedData = dataMap.get(cacheKey) as T | undefined;
  if (cachedData === undefined) {
    throw fetch().then((d) => dataMap.set(cacheKey, d));
  }
  return cachedData;
}

//let globalData: string | undefined;

const DataLoader2: FC = () => {
  const data: Data = useData("data1", fetchData);
  return <div>Data is {data.username}</div>;
};
const DataLoader3: FC = () => {
  const data = useData("data2", fetchData);
  return <div>Data is {data.email}</div>;
};

function App() {
  const [count, setCount] = useState<number>(0);
  return (
    <div className="text-center">
      <h1 className="text-2xl">React App!</h1>
      {/* <RenderingNotifier name="out" />
      <Suspense fallback={<p>Loading...</p>}>
        <RenderingNotifier name="in" />
        <p>ここは表示される？</p>
        <AlwaysSuspend />
      </Suspense>
      <button
        onClick={() => setCount((count) => count + 1)}
        className="shadow-lg bg-sky-500 shadow-sky-500/50 text-white rounded px-2 py-1"
      >
        click me! {count}+1
      </button>
      <br />
      <br />
      <Suspense fallback={<p>Loading...DataLoader...</p>}>
        <DataLoader />
      </Suspense>
      <br />
      <br /> */}
      {/* <Suspense fallback={<p>Loading...</p>}>
        <DataLoader2 />
      </Suspense>
      <Suspense fallback={<p>Loading...DataLoader2...</p>}>
        <DataLoader3 />
      </Suspense> */}

      <RenderAsYouFetch />
    </div>
  );
}

export default App;

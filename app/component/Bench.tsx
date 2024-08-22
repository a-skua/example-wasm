import { useState } from "react";
import * as js from "~/lib/fib";
import * as wasm from "~/asbuild/release";
import { bench } from "~/lib/bench";

type Time<R> = {
  result: R;
  time: number;
};

type Result<R extends number | bigint> = {
  js: Time<R>;
  wasm: Time<R>;
};

type Results = {
  count?: Result<number>;
  a?: Result<number>;
  b?: Result<bigint>;
  c: Result<number>;
  d: Result<bigint>;
};

function jsFibB(n: bigint): bigint {
  if (n <= 1n) {
    return n;
  }
  return jsFibB(n - 1n) + jsFibB(n - 2n);
}

function jsFibD(n: bigint): bigint {
  let a = 0n;
  let b = 1n;
  for (let i = 0n; i < n; i++) {
    let tmp = a;
    a = b;
    b = tmp + b;
  }
  return a;
}

async function fibFnCallCount(n: number): Promise<Result<number>> {
  return {
    js: { result: 0, time: 0 },
    wasm: bench(wasm.fibFnCallCount, n),
  };
}

async function fibA(n: number): Promise<Result<number>> {
  return {
    js: bench(js.fibA, n),
    wasm: bench(wasm.fibA, n),
  };
}

async function fibB(n: bigint): Promise<Result<bigint>> {
  return {
    js: bench(jsFibB, n),
    wasm: bench(wasm.fibB, n),
  };
}

async function fibC(n: number): Promise<Result<number>> {
  return {
    js: bench(js.fibC, n),
    wasm: bench(wasm.fibC, n),
  };
}

async function fibD(n: bigint): Promise<Result<bigint>> {
  return {
    js: bench(jsFibD, n),
    wasm: bench(wasm.fibD, n),
  };
}

const test = [
  ...Array.from({ length: 90 }, (_, i) => i + 1),
  100,
  200,
  300,
  400,
  500,
  1000,
];

async function run(): Promise<Results[]> {
  const results: Results[] = [];
  for (const n of test) {
    const count = n <= 40 ? await fibFnCallCount(n) : undefined;
    const a = n <= 40 ? await fibA(n) : undefined;
    const b = n <= 40 ? await fibB(BigInt(n)) : undefined;
    const c = await fibC(n);
    const d = await fibD(BigInt(n));
    results.push({ count, a, b, c, d });
  }
  return results;
}

export function Bench() {
  const [results, setResults] = useState<Results[]>([]);

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded"
        onClick={async () => {
          setResults(await run());
        }}
      >
        ベンチマーク: fib(n)
      </button>
      <table className="table-auto">
        <thead>
          <tr>
            <th>n</th>
            <th>count</th>
            <th>result</th>
            <th>パターンA ms (JS)</th>
            <th>パターンA ms (Wasm)</th>
            <th>パターンB ms (JS)</th>
            <th>パターンB ms (Wasm)</th>
            <th>パターンC ms (JS)</th>
            <th>パターンC ms (Wasm)</th>
            <th>パターンD ms (JS)</th>
            <th>パターンD ms (Wasm)</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, i) => (
            <tr key={i}>
              <td>{test[i]}</td>
              <td>{result.count?.wasm.result.toLocaleString() ?? "-"}</td>
              <td>
                {result.a?.js.result ?? "-"} (JS) ,{" "}
                {result.a?.wasm.result ?? "-"} (Wasm)
              </td>
              <td>{result.a?.js.time.toFixed(2) ?? "-"}</td>
              <td>{result.a?.wasm.time.toFixed(2) ?? "-"}</td>
              <td>{result.b?.js.time.toFixed(2) ?? "-"}</td>
              <td>{result.b?.wasm.time.toFixed(2) ?? "-"}</td>
              <td>{result.c.js.time.toFixed(2)}</td>
              <td>{result.c.wasm.time.toFixed(2)}</td>
              <td>{result.d.js.time.toFixed(2)}</td>
              <td>{result.d.wasm.time.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}

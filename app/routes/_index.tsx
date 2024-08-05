import { type MetaFunction, json } from "@remix-run/node";
import { useState, useRef } from "react";
import * as wasm from "~/asbuild/release";
import { fib, fibWithMemo } from "~/lib/calc";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export function loader() {

  return json({ fib: fib(10) });
}

type Result = {
    value: number;
    time: number;
    timeWasm: number;
    timeWithMemo: number;
    timeWasmWithMemo: number;
};

export default function Index() {
    const inputNumber = useRef<HTMLInputElement>(null);
    const [result, setResult] = useState<Result>({value: 0, time: 0, timeWasm: 0, timeWithMemo: 0, timeWasmWithMemo: 0});

  return (
    <div className="font-sans p-4">
      <h1 className="text-3xl">Welcome to Remix</h1>
      <ul className="list-disc mt-4 pl-6 space-y-2">
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/quickstart"
            rel="noreferrer"
          >
            5m Quick Start
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/start/tutorial"
            rel="noreferrer"
          >
            30m Tutorial
          </a>
        </li>
        <li>
          <a
            className="text-blue-700 underline visited:text-purple-900"
            target="_blank"
            href="https://remix.run/docs"
            rel="noreferrer"
          >
            Remix Docs
          </a>
        </li>
        <li>
            <input className="border-2" ref={inputNumber} type="number" defaultValue="0" />
            <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded" onClick={() => {
                const n = Number(inputNumber.current?.value);
                let start = 0;
                let end = 0;

                let time = 0;
                let timeWasm = 0;
                if (n <= 40) {
                    start = performance.now();
                    const value = fib(n);
                    end = performance.now();
                    time = end - start;
                    console.debug(`calc fib(${n}) = ${value}, time: ${time}ms (js)`);

                    start = performance.now();
                    const resultWasm = wasm.fib(n);
                    end = performance.now();
                    timeWasm = end - start;
                    console.debug(`calc fib(${n}) = ${resultWasm}, time: ${timeWasm}ms (wasm)`);
                }

                start = performance.now();
                const resultWithMemo = fibWithMemo(n);
                end = performance.now();
                const timeWithMemo = end - start;
                console.debug(`calc fib(${n}) = ${resultWithMemo}, time: ${timeWithMemo}ms (js with memo)`);

                start = performance.now();
                const resultWasmWithMemo = wasm.fibWithMemo(n);
                end = performance.now();
                const timeWasmWithMemo = end - start;
                console.debug(`calc fib(${n}) = ${resultWasmWithMemo}, time: ${timeWasmWithMemo}ms (wasm with memo)`);

                setResult({
                    value: resultWithMemo,
                    time,
                    timeWasm,
                    timeWithMemo,
                    timeWasmWithMemo
                });
            }}>calc</button>
            <ul>
                <li>fib({inputNumber.current?.value}) = {result.value}</li>
                <li>js: {result.time}ms</li>
                <li>wasm: {result.timeWasm}ms</li>
                <li>js with memo: {result.timeWithMemo}ms</li>
                <li>wasm with memo: {result.timeWasmWithMemo}ms</li>
            </ul>
        </li>
      </ul>
    </div>
  );
}

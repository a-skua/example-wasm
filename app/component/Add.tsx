import { useState, useRef } from "react";
import * as wasm from "~/asbuild/release";
import * as js from "~/lib/calc";

type Result = {
  js: number,
  wasm: number,
}

export function Add() {
  const inputA = useRef<HTMLInputElement>(null);
  const inputB = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<Result | null>(null);

  return (
    <>
      <input className="border-2 p-1 rounded" ref={inputA} type="number" min="0" defaultValue="0" placeholder="a" />
      <span> + </span>
      <input className="border-2 p-1 rounded" ref={inputB} type="number" min="0" defaultValue="0" placeholder="b" />
      <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded ml-2" onClick={() => {
        const a = Number(inputA.current?.value || 0);
        const b = Number(inputB.current?.value || 0);
        setResult({
          js: js.add(a, b),
          wasm: wasm.add(a, b),
        });
      }}> = </button>
      {result && (
        <>
          <span className="px-2">{result.js} (JS)</span>
          ,
          <span className="px-2">{result.wasm} (Wasm)</span>
        </>
      )}
    </>
  );
}

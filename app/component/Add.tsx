import { useState, useRef } from "react";
import { add as jsAdd } from "~/lib/calc";
import * as wasm from "~/asbuild/release";
import * as js from "~/lib/add";

type Result<T> = {
  js: T,
  wasm: T,
}

type Add<T> = (a: T, b: T) => Result<T>;

function add(a: number, b: number): Result<number> {
  return {
    js: jsAdd(a, b),
    wasm: wasm.add(a, b),
  };
}

function addU8(a: number, b: number): Result<number> {
  return {
    js: js.addU8(a, b),
    wasm: wasm.addU8(a, b),
  };
}

function addI8(a: number, b: number): Result<number> {
  return {
    js: js.addI8(a, b),
    wasm: wasm.addI8(a, b),
  };
}

type _AddProps = {
  add: Add<number>;
};

function _Add({ add }: _AddProps) {
  const inputA = useRef<HTMLInputElement>(null);
  const inputB = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<Result<number> | null>(null);

  return (
    <>
      <input className="border-2 p-1 rounded" ref={inputA} type="number" defaultValue="0" placeholder="a" />
      <span> + </span>
      <input className="border-2 p-1 rounded" ref={inputB} type="number" defaultValue="0" placeholder="b" />
      <button className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded ml-2" onClick={() => {
        const a = Number(inputA.current?.value || 0);
        const b = Number(inputB.current?.value || 0);
        setResult(add(a, b));
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

export function Add() {
  return (
    <div className="table border-spacing-2">
      <div className="table-row">
        <span className="table-cell">add(a, b) :</span>
        <span className="table-cell"><_Add add={add} /></span>
      </div>
      <div className="table-row">
        <span className="table-cell">add(a: u8, b: u8) :</span>
        <span className="table-cell"><_Add add={addU8} /></span>
      </div>
      <div className="table-row">
        <span className="table-cell">add(a: i8, b: i8) :</span>
        <span className="table-cell"><_Add add={addI8} /></span>
      </div>
  </div>
  );
}

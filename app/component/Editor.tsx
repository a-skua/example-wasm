import { useEffect, useRef, useState } from "react";
import "highlight.js/styles/github.css";
import hljs from "highlight.js";
import asc from "assemblyscript/asc";

const initialCode = `export function calc(a: number, b: number): number {
  return a + b;
}`;

export function Editor() {
  const [results, setResults] = useState<Result[]>([]);

  const preRef = useRef<HTMLPreElement>(null);

  const applyHighlight = () => {
    if (preRef.current) {
      hljs.highlightBlock(preRef.current);
    }
  };

  useEffect(() => {
    applyHighlight();
  }, []);

  return (
    <>
      <pre
        ref={preRef}
        className="border p-1 m-2"
        onInput={applyHighlight}
        onBlur={applyHighlight}
        contentEditable="true"
      >
        {initialCode}
      </pre>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded ml-2"
        onClick={async () => {
          try {
            const results = await build(preRef.current?.innerText || "");
            setResults(results);
          } catch (error) {
            console.error(error);
            window.alert(`${error}`);
          }
        }}
      >
        asbuild
      </button>
      {results.length > 0 && (
        <span className="ml-2">
          <Calc buildFiles={results} />
        </span>
      )}
      <ul>
        {results.map((result, i) => (
          <li key={i}>
            {result.filename}
          </li>
        ))}
      </ul>
    </>
  );
}

type CalcProps = {
  buildFiles: Result[];
};

function Calc({ buildFiles }: CalcProps) {
  const inputA = useRef<HTMLInputElement>(null);
  const inputB = useRef<HTMLInputElement>(null);
  const [result, setResult] = useState<number | null>(null);

  return (
    <>
      <span className="mr-2">calc(a, b) :</span>
      <input
        className="border-2 p-1 rounded"
        ref={inputA}
        type="number"
        defaultValue="0"
        placeholder="a"
      />
      <span className="mx-2">+</span>
      <input
        className="border-2 p-1 rounded"
        ref={inputB}
        type="number"
        defaultValue="0"
        placeholder="b"
      />
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white px-2 py-1 rounded mx-2"
        onClick={async () => {
          const a = Number(inputA.current?.value || 0);
          const b = Number(inputB.current?.value || 0);

          try {
            setResult(await run(buildFiles, a, b));
          } catch (error) {
            console.error(error);
            window.alert(`${error}`);
          }
        }}
      >
        =
      </button>
      {result && <span className="px-2">{result}</span>}
    </>
  );
}

const asconfig = {
  targets: {},
  options: {
    bindings: "esm",
  },
};

// ビルド結果
export type Result = {
  filename: string;
  contents: string | Uint8Array;
};

export async function build(index: string): Promise<Result[]> {
  const results: Result[] = [];
  const { error, stdout, stderr, stats } = await asc.main([
    // Command line options
    "assembly/index.ts",
    "--outFile",
    "build/index.wasm",
    "--optimize",
    "--sourceMap",
    "--stats",
  ], {
    // Additional API options
    readFile: (filename) => {
      console.debug(filename);
      switch (filename) {
        case "asconfig.json": {
          return Promise.resolve(JSON.stringify(asconfig));
        }
        case "assembly/index.ts": {
          return Promise.resolve(index);
        }
        default:
          throw new Error(`Not Found ${filename}`);
      }
    },
    writeFile: (filename, contents) => {
      results.push({ filename, contents });
    },
    listFiles: () => {
      throw new Error("Not Implemented");
    },
  });

  if (error) {
    console.error(error.message);
    console.error(stderr.toString());
    throw error;
  }

  const output = stdout.toString();
  if (output) {
    console.warn("stdout", output);
  }

  console.info("stats", stats);

  return results;
}

type ImportObject = {
  app: {
    random(): number;
    result(n: number): void;
  };
};

export async function run(
  results: Result[],
  a: number,
  b: number,
): Promise<number> {
  const wasm = results.find(({ filename }) => filename === "build/index.wasm")!;
  const { instance: { exports } } = await WebAssembly.instantiate(
    wasm.contents,
    {},
  );

  const instance = exports as { calc?: (a: number, b: number) => number };
  if (!instance.calc) {
    throw new Error("Not Found calc");
  }

  return instance.calc(a, b);
}

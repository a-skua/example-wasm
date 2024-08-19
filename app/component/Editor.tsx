const initialCode = `export function calc(a: number, b: number): number {
  return a + b;
}`;

function highlight(e: HTMLElement) {
  console.debug(e.textContent);
}

export function Editor() {
  return (
    <>
      <pre className="border p-1 m-2" onInput={(e) => highlight(e.target as HTMLElement)} contentEditable="true">
        {initialCode}
      </pre>
    </>
  );
}

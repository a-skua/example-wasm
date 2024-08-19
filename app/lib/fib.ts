export function fibFnCallCount(n: number): number {
  if (n <= 1) {
    return 1;
  }
  return fibFnCallCount(n - 1) + fibFnCallCount(n - 2) + 1;
}

export function fibA(n: number): number {
  if (n <= 1.0) {
    return n;
  }
  return fibA(n - 1.0) + fibA(n - 2.0);
}

export function fibB(n: i64): i64 {
  if (n <= 1) {
    return n;
  }
  return fibB(n - 1) + fibB(n - 2);
}

export function fibC(n: f64): f64 {
  let a = 0.0;
  let b = 1.0;
  for (let i = 0.0; i < n; i++) {
    let tmp = a;
    a = b;
    b = tmp + b;
  }
  return a;
}

export function fibD(n: i64): i64 {
  let a = 0;
  let b = 1;
  for (let i = 0; i < n; i++) {
    let tmp = a;
    a = b;
    b = tmp + b;
  }
  return a;
}

function foo(v: v128): v128 {
  v = i32x4(1, 2, 3, 4);
  return v;
}

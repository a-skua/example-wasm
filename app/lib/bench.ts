type Time<R> = {
  result: R,
  time: number,
};

type FuncFib<N extends number | bigint, R> = (n: N) => R;

export function bench<N extends number | bigint, R>(fib: FuncFib<N, R>, n: N): Time<R> {
    const result = { result: undefined as R, time: 0};
    const start = performance.now();
    result.result = fib(n);
    result.time = performance.now() - start;
    return result;
}

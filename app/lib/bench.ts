export function bench<R>(fib: (n: number) => R, n: number) {
    const result = { value: undefined as R, time: 0};
    const start = performance.now();
    result.value = fib(n);
    result.time = performance.now() - start;
    return result;
}

export function add(a: i32, b: i32): i32 {
    return a + b;
}

export function fib(n: i32): i32 {
    if (n <= 1) {
        return n;
    }
    return fib(n - 1) + fib(n - 2);
}

let memo = new Map<i32, i32>();

export function fibWithMemo(n: i32, init: boolean = true): i32 {
    if (init) {
        memo = new Map<i32, i32>();
    }

    if (n <= 1) {
        return n;
    }
    if (memo.has(n)) {
        return memo.get(n);
    }
    const result = fibWithMemo(n - 1, false) + fibWithMemo(n - 2, false);
    memo.set(n, result);
    return result;
}

export type PlainObject<T = unknown> = {
    [k in string]: T;
};

export type StringObject = {
    [k in string]: string;
}

export type Callback = (...args: unknown[]) => void;

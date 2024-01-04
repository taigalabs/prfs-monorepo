export declare class Profiler {
    private enabled;
    constructor(options: {
        enabled?: boolean;
    });
    time(label: string): void;
    timeEnd(label: string): void;
}

// Type definitions for drawille 1.1.1
// Project: https://github.com/madbence/node-drawille
// Definitions by: UweStolz <https://github.com/UweStolz>
declare module 'drawille' {
    interface Canvas {
        width: number;
        height: number;
         /**
         * @description Draw point on canvas at the given position.
         */
        set(x: number, y: number): void;
        /**
         * @description Delete point on canvas at the given position.
         */
        unset(x: number, y: number): void;
         /**
         * @description Toggle point on canvas at the given position.
         */
        toggle(x: number, y: number): void;
         /**
         * @description Clear the whole canvas (delete every point).
         */
        clear(): void;
        /**
         * @returns The current content of canvas, as a delimiter-delimited string. delimiter defaults to \n.
         * @description It uses braille characters to represent points, so every line has length of w/2, and the string contains h/4 lines.
         */
        frame(delimiter?: string): string;
    }

    var Canvas: {
        /**
         * @param width must be multiple of 2.
         * @param height must be multiple of 4.
         * @description Uses columns & rows from process.stdout as default values for w and h.
         */
        new(width: number, height: number): Canvas
    };
    export default Canvas;
}

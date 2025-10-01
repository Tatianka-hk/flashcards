import { defineNuxtPlugin } from "nuxt/app";
import * as pdfjsLib from "pdfjs-dist";
import workerSrc from "pdfjs-dist/build/pdf.worker.min.mjs?url";

export default defineNuxtPlugin(() => {
    pdfjsLib.GlobalWorkerOptions.workerSrc = workerSrc;
    return {
        provide: {
            pdfjs: pdfjsLib,
        },
    };
});

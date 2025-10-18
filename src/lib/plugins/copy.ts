import type { BytemdPlugin } from "bytemd";

export default function copyPlugin(): BytemdPlugin {
    return {
        actions: [
            {
                title: "Copy to Clipboard",
                icon: '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1"/></svg>',
                handler: {
                    type: "action",
                    click(ctx) {
                        const md = ctx.editor.getValue();
                        navigator.clipboard.writeText(md).then(() => {

                        });
                    }
                }
            }
        ]
    }
}
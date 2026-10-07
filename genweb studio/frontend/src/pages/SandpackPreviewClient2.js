import {
    SandpackPreview,
    useSandpack
} from "@codesandbox/sandpack-react";

import React, { useContext, useEffect, useRef } from "react";
import { ActionContext } from './ActionContext'; // Updated import path

function SandpackPreviewClient2() {

    const previewRef = useRef();
    const { sandpack } = useSandpack();
    const { action, setAction } = useContext(ActionContext);

    useEffect(() => {
        GetSandpackClient();
    }, [sandpack && action]);

    const GetSandpackClient = async () => {
        const client = previewRef.current?.getClient();
        console.log(client);
        console.log("hihojjfn");
        

        if (client) {
            console.log(client);
            const result = await client.getCodeSandboxURL();
            // console.log(result);
            if (action?.actionType === "deploy") {
                if (result?.sandboxId) {
                    const link = 'https://' + result.sandboxId + '.csb.app';
                    window.open(link, '_blank', 'noopener,noreferrer');
                } else if (result?.editorUrl) {
                    window.open(result.editorUrl, '_blank', 'noopener,noreferrer');
                }
            } else if (action?.actionType === "export") {
                if (result?.editorUrl) {
                    window.open(result.editorUrl, '_blank', 'noopener,noreferrer');
                }
            }
        }
    }
    return (
        <SandpackPreview ref={previewRef} style={{ height: '6px' }} showNavigator={true} />
    )
}

export default SandpackPreviewClient2;
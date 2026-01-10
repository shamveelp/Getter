declare module '*.svg' {
    import React from 'react';
    const ReactComponent: React.ComponentType<React.SVGProps<SVGSVGElement>>;
    export default ReactComponent;
}

declare module '*.svg?url' {
    const content: string;
    export default content;
}

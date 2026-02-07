import React, { useEffect } from 'react';

export default function BrowserTitle({ title }) {
    useEffect(() => {
        document.title = title;
    }, [title]);

    return null;
}
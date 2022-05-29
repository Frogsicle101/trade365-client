/**
 * Taken from https://overreacted.io/making-setinterval-declarative-with-react-hooks/
 */

import React, { useState, useEffect, useRef } from 'react';

export function useInterval(callback: any, delay: any) {
    const savedCallback = useRef();

    // Remember the latest callback.
    useEffect(() => {
        savedCallback.current = callback;
    }, [callback]);

    // Set up the interval.
    useEffect(() => {
        function tick() {
            // @ts-ignore
            savedCallback.current();
        }
        if (delay !== null) {
            let id = setInterval(tick, delay);
            return () => clearInterval(id);
        }
    }, [delay]);
}
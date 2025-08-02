"use no memo";
import { use, useEffect } from "react";
import { KeybindContext } from "../components/providers/keybind.provider";
import type { Keybind } from "../components/providers/keybind.types";


export function useRegisterKeybind(keybind: Keybind) {
    const ctx = use(KeybindContext);
    if (!ctx) {
        throw new Error("useKeybind must be used within a KeybindProvider");
    }

    useEffect(() => {
        ctx.registerKeybind(keybind);
    }, [ctx.registerKeybind, keybind.callback, JSON.stringify(keybind)]);
}


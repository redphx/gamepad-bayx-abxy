// ==UserScript==
// @name         BAYX to ABXY
// @namespace    https://github.com/redphx
// @version      1.0
// @description  Switch gamepad's BAYX layout (Nintendo) to ABXY layout (Xbox)
// @author       redphx
// @match        *://*/*
// @grant        none
// @run-at       document-start
// ==/UserScript==
'use strict';

// ID of gamepads you want to swap the buttons
// Can be full name or just a part of it
let GAMEPAD_IDS = [
    '8BitDo SN30', // Just an example
].map(name => name.toLowerCase());


function isValidGamepad(gamepad) {
    const gamepadId = gamepad.id.toLowerCase();
    for (let sub of GAMEPAD_IDS) {
        if (gamepadId.includes(sub)) {
            return true;
        }
    }

    return false;
}


function cloneGamepad(gamepad) {
    return {
        timestamp: 0,
        id: gamepad.id,
        index: gamepad.index,
        connected: gamepad.connected,
        mapping: gamepad.mapping,
    };
}


function cloneButtons(buttons) {
    const tmp = [];
    buttons.forEach(button => {
        tmp.push({
            pressed: button.pressed,
            value: button.value,
        });
    });
    return tmp;
}


function swapButtons(buttons, indexA, indexB) {
    const tmp = buttons[indexA];
    buttons[indexA] = buttons[indexB];
    buttons[indexB] = tmp;

    return buttons;
}


let EMULATED_GAMEPADS = [null, null, null, null];
window.addEventListener('gamepadconnected', e => {
    const gamepad = e.gamepad;
    if (isValidGamepad(gamepad)) {
        EMULATED_GAMEPADS[gamepad.index] = cloneGamepad(gamepad);
    }
});


window.addEventListener('gamepaddisconnected', e => {
    const gamepad = e.gamepad;
    if (isValidGamepad(gamepad)) {
        EMULATED_GAMEPADS[gamepad.index] = null;
    }
});


const originalGetGamepads = navigator.getGamepads;
navigator.getGamepads = function() {
    const gamepads = originalGetGamepads.apply(this);

    EMULATED_GAMEPADS.forEach((emulated, index) => {
        if (!emulated) {
            return;
        }

        const orgGamepad = gamepads[index];
        if (emulated.timestamp !== 0 && emulated.timestamp === orgGamepad.timestamp) {
            return;
        }

        let buttons = cloneButtons(orgGamepad.buttons);
        buttons = swapButtons(buttons, 0, 1);
        buttons = swapButtons(buttons, 2, 3);
        emulated.buttons = buttons;

        emulated.axes = orgGamepad.axes;
        emulated.timestamp = orgGamepad.timestamp;
        emulated.hapticActuators = orgGamepad.hapticActuators;

        // Override native gamepad
        gamepads[emulated.index] = emulated;
    });

    return gamepads;
}

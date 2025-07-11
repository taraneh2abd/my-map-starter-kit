/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

const CORRECT_PASSWORD = "1234"; // رمز صحیح را اینجا تعیین کنید

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags);

    // Listen for messages from the password popup
    window.addEventListener('message', (event) => {
        // We only listen for messages of the correct type
        if (event.data && event.data.type === 'passwordSubmission') {
            const enteredPassword = event.data.password;

            if (enteredPassword === CORRECT_PASSWORD) {
                // Password is correct, close the popup and teleport the player
                if (currentPopup) {
                    currentPopup.close();
                }
                WA.player.teleport("spawn_room2"); // "spawn_room2" نامی است که در Tiled برای نقطه مقصد گذاشتیم
            } else {
                // Password is wrong
                if (currentPopup) {
                    currentPopup.close();
                }
                WA.ui.displayActionMessage({
                    message: "Wrong password!",
                    callback: () => {
                      // You can add what happens after the user closes the message
                    }
                });
            }
        }
    });

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    });

    WA.room.area.onLeave('clock').subscribe(() => {
        if (currentPopup !== undefined) {
            currentPopup.close();
            currentPopup = undefined;
        }
    });

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

export {};

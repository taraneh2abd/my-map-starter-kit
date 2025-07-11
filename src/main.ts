/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

import { bootstrap } from "@workadventure/scripting-api-extra";

const CORRECT_PASSWORD = "1234"; // رمز صحیح را اینجا تعیین کنید

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');

    // Listen for messages from the password popup
    window.addEventListener('message', (event) => {
        // We only listen for messages of the correct type
        if (event.data && event.data.type === 'passwordSubmission') {
            const enteredPassword = event.data.password;

            if (enteredPassword === CORRECT_PASSWORD) {
                // Password is correct, close the popup and teleport the player
                WA.ui.closePopup();
                WA.player.teleport("spawn_room2"); // "spawn_room2" نامی است که در Tiled برای نقطه مقصد گذاشتیم
            } else {
                // Password is wrong
                WA.ui.closePopup();
                WA.ui.displayActionMessage({
                    message: "Wrong password!",
                    callback: () => {
                      // You can add what happens after the user closes the message
                    }
                });
            }
        }
    });

}).catch(e => console.error(e));
console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ',WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup(){
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export {};

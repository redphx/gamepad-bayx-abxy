# Gamepad BAYX to ABXY
Userscript to switch gamepad's BAYX layout (Nintendo) to ABXY layout (Xbox)  

I use this script for playing Xbox Cloud Gaming (xCloud) with the 8BitDo SN30 Pro controller. Without it the layout buttons are swapped and it's unplayable.  

## How to use
Use it with [Tampermonkey](https://tampermonkey.net). It will affect all websites inside the browser.  

## How to add your own gamepad
![image](https://github.com/redphx/gamepad-bayx-abxy/assets/96280/929645be-ceef-4af6-8d27-9c35798d7713)

1. Connect the gamepad to your device.
2. Go to [Gamepad Tester](https://hardwaretester.com/gamepad).
3. Press any button on the gamepad.
4. Copy the ID of your gamepad (the highlighted part in the screenshot).
5. Open the userscript in Tampermonkey.
6. Add your gamepad ID to the list:  
   From:
   ```js
   let GAMEPAD_IDS = [
       '8BitDo SN30', // Just an example
   ].map(name => name.toLowerCase());
   ```

   To:
   ```js
   let GAMEPAD_IDS = [
       '8BitDo SN30', // Just an example
       '8BitDo Lite gamepad',
   ].map(name => name.toLowerCase());
   ```
7. Save the script.

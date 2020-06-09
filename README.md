# YouTube terminal music player

## How to

### Release build

Download the latest release
LINK TO "LATEST" RELEASE

execute the `.appImage` file from a maximized terminal window

### Dev build

Install dependencies  
    `yarn install`  

Build  
    `yarn build`  

Install dependencies for the build  
    `cd dist && yarn install`  

Execute  
    `yarn electron index.js`  


### Configuration

It looks for an API-Key in the variable `YT_API_KEY` in your `process.env. You can either export one or depending on your setup, put a `.env` file with the key:
-   into the `dist` folder
- or next to the `.appImage` file
The  key will then be loaded automatically on start

You can generate an API-Key at the
[Google Developers Console](https://console.developers.google.com/) it just needs to have access to the **YouTube Data API v3**.

## Built with

[Howler.Js](https://howlerjs.com/)  
[Electron](https://www.electronjs.org/)  
[Blessed](https://github.com/chjj/blessed)  

## License

[MIT](LICENSE.md)
# YouTube terminal music player

## How to

### Release build

Download the [latest](https://github.com/UweStolz/yut/releases/latest) release

Make sure the AppImage is executable  
`chmod +x x.AppImage`  

execute the `.AppImage` file from a maximized terminal window

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

It looks for an API-Key in the variable `YT_API_KEY` in your `process.env.` You can either export one or depending on your setup, put a `.env` file with the key:
-   into the `dist` folder
- or next to the `.AppImage` file
The  key will then be loaded automatically on start

You can generate an API-Key at the
[Google Developers Console](https://console.developers.google.com/) it just needs to have access to the **YouTube Data API v3**.

## Built with

[Howler.Js](https://howlerjs.com/)  
[Electron](https://www.electronjs.org/)  
[Blessed](https://github.com/chjj/blessed)  

## License

This application is just a little hobby project, so fork it, hack it have fun with it 🙂

[MIT](LICENSE.md)

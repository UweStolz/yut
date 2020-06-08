# YouTube terminal music player

## How to build

Make a production build  
`yarn build:prod`

## Configuration

It looks for an API-Key with the variable `YT_API_KEY` in `process.env`, either export one or put a `.env` file with the key into the `dist` folder and it will be loaded automatically on start.

You can generate an API-Key at the
[Google Developers Console](https://console.developers.google.com/) it just needs to have access to the **YouTube Data API v3**.

## Start

Change into the build directory  
`cd dist`

Execute the programm  
`yarn electron index.js`

## Built with

[Howler.Js](https://howlerjs.com/)  
[Electron](https://www.electronjs.org/)  
[Blessed](https://github.com/chjj/blessed)  

## License

[MIT](LICENSE.md)
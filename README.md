# Lie-Fi
A command line util to locally test NodeJS web apps with Lie-Fi and bad connection quality!
This utility comes in handy when developing offline-first web applications!

![Install and using Lie-Fi](https://raw.githubusercontent.com/mattiamanzati/lie-fi/master/docs/sample-install.gif)

## Usage
First install the package globally using `npm install lie-fi -g` in the terminal and then browse your application folder and type in the terminal:

`lie-fi app.js`

You can also specify directly a connection type and a port for the host using:

`lie-fi app.js -c lie-fi -p 3000`

A server on the port 3000 will start with your express/NodeJS http server and will emulate a Lie-Fi connection.

**IMPORTANT:**
app.js (or any file at your choice) must not call `app.listen(...)`, but instead must export the app object that should start listening.
So you can replace `app.listen(...)` with `module.exports = app`.

The command line format is the following:

`lie-fi [js_file_exporting_server_without_listening].js -c [offline|lie-fi|slow|perfect] -p [port]`

## Thanks
Thanks to [jakearchibald](https://github.com/jakearchibald), who gave the idea and the basic code to setup this easily reusable library!
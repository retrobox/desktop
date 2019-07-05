const {
  app,
  BrowserWindow
} = require('electron')

//   console.log(process.argv[0])

// process.env.SOURCE_ARGV = process.argv[0]

// console.log(process.env.SOURCE_ARGV)

app.commandLine.appendSwitch('remote-debugging-port', '8315');
/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\')
}

/* 

if (process.env.NODE_ENV !== 'development') {
  process.env.WEB_ENDPOINT = process.env.WEB_ENDPOINT === undefined ? 'https://retrobox.tech' : process.env.WEB_ENDPOINT
  process.env.API_ENDPOINT = process.env.API_ENDPOINT === undefined ? 'https://api.retrobox.tech' : process.env.API_ENDPOINT
  process.env.WEB_SOCKET_ENDPOINT = process.env.WEB_SOCKET_ENDPOINT === undefined ? 'https://ws.retrobox.tech' : process.env.WEB_SOCKET_ENDPOINT
} else {
  let localIp  = require('network-address')()
  process.env.WEB_ENDPOINT = process.env.WEB_ENDPOINT === undefined ? localIp + ':3000' : process.env.WEB_ENDPOINT
  process.env.API_ENDPOINT = process.env.API_ENDPOINT === undefined ? localIp + ':8000' : process.env.API_ENDPOINT
  process.env.WEB_SOCKET_ENDPOINT = process.env.WEB_SOCKET_ENDPOINT === undefined ? localIp + ':3008' : process.env.WEB_SOCKET_ENDPOINT
}

*/

let mainWindow
const winURL = process.env.NODE_ENV === 'development' ?
  `http://localhost:9080` :
  `file://${__dirname}/index.html`

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000
  })

  mainWindow.loadURL(winURL)

  mainWindow.on('closed', () => {
    mainWindow = null
  })
}

app.on('ready', createWindow)

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow()
  }
})

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
  */

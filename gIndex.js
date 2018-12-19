const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const { listSites, newSite, removeSite } = require('./lib.js');
let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({width: 400, height: 600});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on('closed', () => app.quit() );
});
ipcMain.on('sites:list', () =>  {
	mainWindow.webContents.send('sites:list', listSites());

});

ipcMain.on('site:add', (e, site) =>  {
  newSite(site);
});
ipcMain.on('site:delete', (e, site) =>  {
	removeSite(site);
});

const electron = require('electron');
const {app, BrowserWindow, ipcMain} = electron;
const { listSites, newSite, removeSite } = require('./lib.js');
let mainWindow;

app.on('ready', () => {
	mainWindow = new BrowserWindow({width: 440,});
	mainWindow.loadURL(`file://${__dirname}/index.html`);
	mainWindow.on('closed', () => app.quit() );
	mainWindow.setMenu(null);
	mainWindow.setResizable(false);
});
ipcMain.on('sites:list', () =>  {
	mainWindow.webContents.send('sites:list', listSites());

});

ipcMain.on('site:add', (e, site) =>  {
	if (site !== '') {
		  newSite(site);
	}else {
		console.log('cannot create empty site');
	}
});
ipcMain.on('site:delete', (e, site) =>  {
	removeSite(site);
});

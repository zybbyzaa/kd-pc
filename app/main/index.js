'use strict';

import { app, BrowserWindow, Menu, ipcMain, dialog } from 'electron';

import * as util from './util';

if (process.env.NODE_ENV === 'development') {
  require('electron-debug')({ showDevTools: true });

  require('electron').app.on('ready', () => {
    let installExtension = require('electron-devtools-installer');
    installExtension
      .default(installExtension.REACT_DEVELOPER_TOOLS)
      .then(name => console.log(`Added Extension:  ${name}`))
      .catch(err => {
        console.log('Unable to install `react-devtools`: \n', err);
      });
  });
}

let mainWindow;

app.on('ready', initApp);

function initApp() {
  //注册菜单
  const menu = Menu.buildFromTemplate(getMenuData());
  Menu.setApplicationMenu(menu);

  //创建主窗口
  createMainWindow();
}

function createMainWindow() {
  mainWindow = new BrowserWindow({
    height: 725,
    width: 391,
    titleBarStyle: 'hidden',
    webPreferences: {
      webSecurity: false
    }
  });

  mainWindow.loadURL(util.winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('window-all-closed', () => {
  if (!util.isMac()) {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createMainWindow();
  }
});

function getMenuData() {
  const template = [
    {
      label: '修改',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'pasteandmatchstyle' },
        { role: 'delete' },
        { role: 'selectall' }
      ]
    },
    {
      label: '视图',
      submenu: [
        {
          label: '重新加载',
          click() {
            if (mainWindow) {
              mainWindow.loadURL(util.winURL);
            }
          }
        },
        { role: 'forcereload' },
        { role: 'toggledevtools' },
        { type: 'separator' },
        { role: 'resetzoom' },
        { role: 'zoomin' },
        { role: 'zoomout' },
        { type: 'separator' },
        { role: 'togglefullscreen' }
      ]
    },
    {
      label: '窗口',
      submenu: [{ role: 'minimize' }, { role: 'close' }]
    },
    {
      label: '帮助',
      submenu: [
        {
          label: '关于项目',
          click() {
            require('electron').shell.openExternal(
              'https://github.com/zybbyzaa/kd-pc'
            );
          }
        },
        {
          label: '提交异常或需求',
          click() {
            require('electron').shell.openExternal(
              'https://github.com/zybbyzaa/kd-pc/issues'
            );
          }
        }
      ]
    }
  ];

  if (process.platform === 'darwin') {
    template.unshift({
      label: app.getName(),
      submenu: [
        { role: 'about' },
        { type: 'separator' },
        { role: 'services', submenu: [] },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideothers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' }
      ]
    });

    // Window menu
    template[3].submenu = [
      { role: 'close' },
      { role: 'minimize' },
      { role: 'zoom' },
      { type: 'separator' },
      { role: 'front' }
    ];
  }
  return template;
}

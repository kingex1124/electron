const { ipcMain } = require('electron');
const electron = require('electron');

const { app, BrowserWindow, Menu } = electron;

let mainWindow;
let addWindow = [];

app.on('ready', () => {
    mainWindow = new BrowserWindow({
        // 要設定這段 index.html 才可以使用 require('electron')
        webPreferences: {
            nodeIntegration: true // 預設是false 要設成true
        }
    });
    mainWindow.loadURL(`file://${__dirname}/main.html`);

    mainWindow.on('closed', () => app.quit());

    const mainMenu = Menu.buildFromTemplate(menuTemplate);
    Menu.setApplicationMenu(mainMenu);
});

function createAddWindow(obj) {
    let newAddwindow = new BrowserWindow({
        width: 300,
        height: 200,
        title: 'Add New Todo',
        // 要設定這段 index.html 才可以使用 require('electron')
        webPreferences: {
            nodeIntegration: true // 預設是false 要設成true
        }
    });
    newAddwindow.loadURL(`file://${__dirname}/add.html`);
    // addWindow.on('closed',()=>{
    //     console.log(obj);
    //     obj = null;
    // });
   // newAddwindow.on('closed',()=>addWindow = null);
   newAddwindow.on('closed',()=>{
    addWindow.forEach(function(item,index,array){
        if(item===newAddwindow)
        {
            item=null;
            addWindow.splice(index,1);
        }
    });
    });
   addWindow.push(newAddwindow);
}

ipcMain.on('todo:add',(event,todo)=>{
    mainWindow.webContents.send('todo:add',todo);

    addWindow.forEach(function(item,index,array){
        if(item.id === event.sender.id)
        {
            item.close();
        }
    });
    //addWindow.close(); // 只有關閉顯示 並非清空記憶體
    // addWindow = null;
});

const menuTemplate = [
    {
        label: 'File',
        submenu: [
            {
                label: 'New Todo',
                click() { createAddWindow(this); }
            },
            {
                label: 'Quit',
                //accelerator:'Ctrl+Q',
                // accelerator: (() => {
                //     if (process.platform === 'darwin') {
                //         return 'Command+Q';
                //     } else {
                //         return 'Ctrl+Q';
                //     }
                // })(),
                accelerator: process.platform === 'darwin' ? 'Command+Q' : 'Ctrl+Q',
                click() {
                    app.quit();
                }
            }
        ]
    }
];

if (process.env.NODE_ENV !== 'production') {
    menuTemplate.push({
        label: 'View',
        submenu: [
            {
                role:'reload'
            },
            {
                label: 'Toggle Developer Tools',
                accelerator:  process.platform === 'darwin' ? 'Command+Alt+I' : 'Ctrl+Shift+I',
                click(item, focusedWindow) {
                    focusedWindow.toggleDevTools();
                }
            }
        ]
    });
}
// 'production'
// 'development'
// 'staging'
// 'test'
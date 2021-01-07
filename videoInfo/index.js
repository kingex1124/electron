// 使用 electron 的元件 主要用來electron 與 主要window溝通所使用
const electron = require('electron');
const ffmpeg = require('fluent-ffmpeg');

// running processes
const { app, BrowserWindow, ipcMain } = electron;

let mainWindow;
// 正在觀看基於事件的編程
// app 想要監聽(東西)事件
// 監聽 ready 這個事件
// ()=>{ 觸發事件時所執行的內容} 
app.on('ready', () => {
    // console.log('App is now ready');
     mainWindow = new BrowserWindow({
        // 要設定這段 index.html 才可以使用 require('electron')
        webPreferences: {
            nodeIntegration: true // 預設是false 要設成true
        }
    });
    // 裡面可以輸入網址 'http://google.com'
    // 輸入專案頁面的話，前後要使用` 符號
    // __dirname 表示在全域變數
    mainWindow.loadURL(`file://${__dirname}/index.html`);
});

ipcMain.on('video:submit', (event, path) => {
    // console.log(path);
    ffmpeg.ffprobe(path, (err,metadata)=>{
        // console.log('File duration is:', metadata.format.duration);
        mainWindow.webContents.send('video:metadata',metadata.format.duration);
    });
});
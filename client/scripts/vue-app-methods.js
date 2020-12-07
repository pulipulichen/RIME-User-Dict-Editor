/* global postMessageAPI, XLSX, GameMaster, appMethodsUI, appMethodsIV, appMethodsInit, appMethodsQuery, appMethodsUtils, appMethodsSearch, domtoimage, hotkeys */

electron = require('electron');
ipcRenderer = electron.ipcRenderer;

var appMethods = {
  load () {
    let callbackID = "load_dict_file_" + (new Date()).getTime();
    ipcRenderer.on(callbackID, (event, content) => {
      this.dictRaw = content
    });
    ipcRenderer.send('load_dict_file', callbackID);
  },
  save () {
    ipcRenderer.send('save_dict_file', (new Date()).getTime() );
  }
}
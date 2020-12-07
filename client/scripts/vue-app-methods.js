/* global postMessageAPI, XLSX, GameMaster, appMethodsUI, appMethodsIV, appMethodsInit, appMethodsQuery, appMethodsUtils, appMethodsSearch, domtoimage, hotkeys */

electron = require('electron');
ipcRenderer = electron.ipcRenderer;

var appMethods = {
  load () {
    let callbackID = "load_dict_file_" + (new Date()).getTime();
    ipcRenderer.on(callbackID, (event, content) => {
      //this.dictRaw = content
      this.dicts = this.parseDictRaw(content)
      this.dictsBeforeSave = [].concat(this.dicts)
    });
    ipcRenderer.send('load_dict_file', callbackID);
  },
  parseDictRaw (content) {
    let dictRaw = content
    
    if (dictRaw === '') {
      return []
    }
    
    let splitor = '####'
    let splitorPos = dictRaw.indexOf(splitor)
    splitorPos = dictRaw.indexOf('\n', splitorPos) + 1  // 的下一行才是開始
    
    let dictText = dictRaw.slice(splitorPos).trim()
    let dicts = []
    
    dictText.split('\n').forEach((line) => {
      line = line.trim()
      if (line.startsWith('#') 
              || line.indexOf('\t') === -1) {
        return false
      }
      
      let parts = line.split('\t')
      dicts.push({
        term: parts[0],
        pinyin: parts[1],
      })
    })
    
    dicts.reverse()
    
    return dicts
  },
  save () {
    let className = 'loading'
    $('body').addClass(className)
    console.log(this.dictToSave)
    let callbackID = "save_dict_file_" + (new Date()).getTime();
    ipcRenderer.on(callbackID, (event, content) => {
      $('body').removeClass(className)
    });
    //ipcRenderer.send('save_dict_file', this.dictToSave, callbackID );
  }
}
/* global postMessageAPI, XLSX, GameMaster, appMethodsUI, appMethodsIV, appMethodsInit, appMethodsQuery, appMethodsUtils, appMethodsSearch, domtoimage, hotkeys */

electron = require('electron');
ipcRenderer = electron.ipcRenderer;

var appMethods = {
  validateDict ({term, pinyin}) {
    
    term = term.trim()
    pinyin = pinyin.trim()
    
    if (term === '' && pinyin === '') {
      return true
    }
    
    if (term === '' || pinyin === '') {
      return false
    }
    
    //if (term.length !== pinyin.split(' ').length) {
    //  console.log(term, pinyin, term.length, pinyin.split(' ').length)
    //}
    return term.length === pinyin.split(' ').length
  },
  load () {
    let callbackID = "load_dict_file_" + (new Date()).getTime();
    ipcRenderer.on(callbackID, (event, content) => {
      //this.dictRaw = content
      this.dicts = this.parseDictRaw(content)
      //this.dicts = [{term: '', pinyin: ''}].concat(this.parseDictRaw(content))
      this.dictsBeforeSave = [].concat(this.dicts)
      this.dicts = [{term: '', pinyin: ''}].concat(this.dicts)
      
      $('body').removeClass('loading')
    });
    ipcRenderer.send('load_dict_file', callbackID);
  },
  isEndsWithNumber (yin) {
    let lastChar = yin.slice(yin.length - 1)
    if (isNaN(lastChar)) {
      return false
    }
    
    lastChar = Number(lastChar)
    return (lastChar >=1 && lastChar <= 5)
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
      let term = parts[0].trim()
      let pinyin = [] 
      parts[1].trim().split(' ').forEach(yin => {
        yin = yin.trim()
        if (yin === '') {
          return false
        }
        
        if (parts.join(' ') === '') {
          return false
        }
        
        if (yin.length < 2
                || !this.isEndsWithNumber(yin)) {
          window.alert('[PINYIN ERROR] ' + parts.join(' '))
        }
        
        pinyin.push(yin)
      })
      pinyin = pinyin.join(' ')
      
      dicts.push({
        term,
        pinyin
      })
    })
    
    dicts.reverse()
    
    return dicts
  },
  save () {
    return new Promise((resolve) => {
      let className = 'loading'
      $('body').addClass(className)
      //console.log(this.dictToSave)
      let callbackID = "save_dict_file_" + (new Date()).getTime();
      ipcRenderer.on(callbackID, (event, content) => {
        this.dictsBeforeSave = [].concat(this.dicts).filter(({term, pinyin}) => (term !== '' && pinyin !== ''))
        $('body').removeClass(className)

        if (this.dicts[0].term !== '' && this.dicts[0].pinyin !== '') {
            this.dicts = [{
                term: '',
                pinyin: ''
            }].concat(this.dicts)
        }
      
        resolve(true)
      });
      ipcRenderer.send('save_dict_file', this.dictToSave, callbackID );
    })
      
  },
  openDictFile () {
    ipcRenderer.send('open_dict_file');
  }
}
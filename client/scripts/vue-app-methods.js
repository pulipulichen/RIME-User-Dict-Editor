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
    let loaded = false
    ipcRenderer.on(callbackID, (event, content) => {
      //console.log(content)
      //console.log(loaded)
      if (loaded === true || content === null) {
        return false
      }
      //this.dictRaw = content
      //console.log(content)
      this.dicts = this.parseDictRaw(content)
      //this.dicts = [{term: '', pinyin: ''}].concat(this.parseDictRaw(content))
      this.dictsBeforeSave = [].concat(this.dicts)
      this.dicts = [{term: '', pinyin: ''}].concat(this.dicts)
      
      $('body').removeClass('loading')
      this.setupTermFromClipboard()
      loaded = true
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
    //console.log(content)
    if (!dictRaw || dictRaw === '') {
      return []
    }
    //console.log(dictRaw)
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
  },
  setupTermFromClipboard () {
    
    let callbackID = "setupTermFromClipboard" + (new Date()).getTime();
    let loaded = false
    
    let addToFirst = (content) => {
      if (this.dicts.length === 0) {
        return setTimeout(() => {
          addToFirst(content)
        }, 3000)
      }
      
      // 20220402-0140 Pulipuli Chen
      // 確認看看這是不是已經加入過的單字
      for (let i = 0; i < this.dicts.length; i++) {

        if (this.dicts[i].term === content) {
          return false
        }
      }

      this.dicts[0].term = content
      setTimeout(() => {
        this.$refs.EditorForm.queryMoeDict(content, 0)
      }, 1000)
    }
    
    ipcRenderer.on(callbackID, (event, content) => {
      if (loaded === true) {
        return false
      }
      
      // -------------
      
      // 移除英文和數字與特殊符號
      //content = content.replace(/[0-9a-zA-Z ]/g, "")
      // str.replace(/[^\x00-\x7F]/g, "")
      content = content.replace(/[!^\x00-\x7F]/g, "")
      
      if (content.length > 7 || content === '') {
        // 太長了我不要
        return false
      }
      
      addToFirst(content)
      
      // ------------
      loaded = true
    });
    ipcRenderer.send('get_text_from_clipboard', callbackID);
  }
}
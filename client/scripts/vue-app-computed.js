var appComputed = {
  dicts () {
    let dictRaw = this.dictRaw.trim()
    
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
  isModified () {
    console.log(JSON.stringify(this.dictsCleared))
    console.log(JSON.stringify(this.dictsBeforeSave))
    return (JSON.stringify(this.dictsCleared) !== JSON.stringify(this.dictsBeforeSave))
  },
  dictsCleared () {
    let dicts = []
    this.dicts.forEach(({term, pinyin}) => {
      if (term.trim() === '' 
              || pinyin.trim() === '') {
        return false
      }
      
      dicts.push({term, pinyin})
    })
    console.log(dicts)
    return dicts
  },
  dictToSave () {
    let header = `# Rime dictionary
# encoding: utf-8

---
name: terra_pinyin.mine
version: "2014.08.04"
sort: by_weight變
# 萌典查拼音：https://www.moedict.tw/
# 發問區：http://code.google.com/p/rimeime/wiki/Downloads
# 導入預設詞彙
use_preset_vocabulary: true
# 從 terra_pinyin.dict.yaml 導入包含單字註音的碼表
import_tables:
  - terra_pinyin
...

# 自定義的字詞
####
`
    let dicts = []
    this.dicts.forEach(({term, pinyin}) => {
      if (term.trim() === '' 
              || pinyin.trim() === '') {
        return false
      }
      
      dicts.push(term + '\t' + pinyin)
    })
    dicts = dicts.join('\n')
    //let dicts = this.dicts.map(({term, pinyin}) => term + '\t' + pinyin).join('\n')
    
    return header + dicts
  }
}

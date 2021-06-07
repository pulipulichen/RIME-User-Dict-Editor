
module.exports = {
  data () {
    return {
      cache: {},
      query: [],
      queryQueue: [],
      lastQueryString: '',
      queryIndex: -1,
      focusTimer: null,
      addTimer: null,
      pinyinHasMultipleOptions: false,
      toneNumber: {
        'ˊ': 2,
        'ˇ': 3,
        'ˋ': 4,
        '˙': 5
      },
      preferPinyin: {
        '頁': 'ye4'
      }
    }
  },
  async mounted () {
    //console.log(this.$refs)
    //console.log(await this.getPinyin('測'))
    //console.log(slugify('cè'))
  },
  watch: {
    query () {
      if (this.lastQueryString === this.query.join('')) {
        return false
      }
      
      $('body').addClass('loading')
      this.focusPinyin(1000)
      this.lastQueryString = this.query.join('')
      
      if (this.$refs.MoeIframes) {
        this.$refs.MoeIframes.scrollTop = 0
        this.$refs.MoeIframes.scrollLeft = 0
      }
    },
  },
  methods: {
    addTerm (i) {
      this.$parent.dicts.splice(i, 0, {
        term: '',
        pinyin: ''
      })
    },
    deleteTerm (dict, i) {
      let {term, pinyin} = dict
      let forceRemove = false
      if (term.trim() === ''
              && pinyin.trim() === '') {
        forceRemove = true
      }
      
      if (forceRemove || window.confirm(`確定刪除「${term}」？`)) {
        this.$parent.dicts.splice(i, 1)
        $(this.$el).find(`.warning`).removeClass('warning')
      }
    },
    queryMoeDict: async function (term, i) {
      if (this.$parent.dicts[i].pinyin !== '') {
        return false
      }
      
      term = term.trim()
      if (term === '') {
        return false
      }
      
      this.query = []
      this.queryQueue = []
      term.trim().split('').forEach(char => {
        if (char === '') {
          return false
        }
        this.query.push(char)
        this.queryQueue.push({
          char,
          pinyin: null
        })
      })
      this.queryIndex = i
      this.pinyinHasMultipleOptions = false
      $(this.$el).find(`.warning`).removeClass('warning')
      
      for (let i = 0; i < this.queryQueue.length; i++) {
        this.queryQueue[i].pinyin = await this.getPinyin(this.queryQueue[i].char)
      }
    },
    queryMoeURL (q) {
      let url = "https://www.moedict.tw/" + q
      return url
    },
    focusPinyin (time = 3000) {
      // 檢查拼音是否都查完了
      //let hasLoaded = true
      for (let i = 0; i < this.queryQueue.length; i++) {
        if (this.queryQueue[i].pinyin === null) {
          return false
        }
      }
      
      if ($(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).val() !== '') {
        return false
      }
      
      clearTimeout(this.focusTimer)
      this.focusTimer = setTimeout(() => {
        this.$parent.dicts.splice(this.queryIndex, 0, {
          term: "",
          pinyin: ""
        })
        this.queryIndex++
        
        this.setupPinyin()
        
        $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).focus()
        $('body').removeClass('loading')
        
        if (this.pinyinHasMultipleOptions === true) {
          $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).addClass('warning')
        }
        
        //console.log(this.queryIndex, `[data-dict-index="${this.queryIndex}"]`, $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).length)
      }, time)
    },
    getPinyin: async function (char) {
      if (this.cache[char]) {
        return this.cache[char]
      }
      
      if (this.preferPinyin[char]) {
        return this.preferPinyin[char]
      }
      
      return new Promise((resolve) => {
        
        let url = "https://www.moedict.tw/" + char
        $.get(url, html => {
          //console.log(url)
          //console.log(html)
          
          // 只取頭尾
          let header = 'window.PRERENDER_JSON '
          let footer = 'React.View.result'
          
          let jsonText = html.slice(html.lastIndexOf(header), html.lastIndexOf(footer))
          jsonText = jsonText.slice(jsonText.indexOf('{'), jsonText.lastIndexOf('}') + 1)
          
          //console.log(jsonText)
          let json = JSON.parse(jsonText)
          //console.log(json)
          
          // 給我拼音
          if (json.heteronyms.length > 1) {
            this.pinyinHasMultipleOptions = true
          }
          
          let pinyinConfig = json.heteronyms[0]
          let tone = pinyinConfig.bopomofo.slice(-1)
          let toneNumber = this.getToneNumber(tone)
          
          let pinyinEnglish = this.slugify(pinyinConfig.pinyin)
          //console.log(pinyinConfig.pinyin, pinyinEnglish)
          
          console.log(pinyinEnglish, toneNumber)
          //return pinyinEnglish + toneNumber
          let result = pinyinEnglish + toneNumber
          
          this.cache[char] = result
          resolve(result)
        })
      })
    },
    slugify (pinyin) {
      let original = pinyin
      
      if (pinyin.lastIndexOf('）​') > -1) {
        pinyin = pinyin.slice(pinyin.lastIndexOf('）​') + 1)
      }
      
      pinyin = pinyin.replace(/ǎ/g, 'a')
      pinyin = pinyin.replace(/ǐ/g, 'i')
      pinyin = pinyin.replace(/ǔ/g, 'u')
      pinyin = pinyin.replace(/ǜ/g, 'u')
      pinyin = pinyin.replace(/ǒ/g, 'o')
      
      pinyin = slugify(pinyin)
      
      console.log('[DEBUG]', original, pinyin)
      if (pinyin.length === 1 && original.length !== pinyin.length) {
        window.alert(`[WARNING] ${original} -> ${pinyin}`)
      }
      
      if (pinyin.length > 10) {
        window.alert('Pinyin is too large: ' + original)
      }
      
      return pinyin
    },
    getToneNumber (tone) {
      let toneNumber = this.toneNumber[tone]
      if (toneNumber) {
        return toneNumber
      }
      else {
        return 1
      }
    },
    setupPinyin () {
      //console.log(this.queryQueue)
      for (let i = 0; i < this.queryQueue.length; i++) {
        if (this.queryQueue[i].pinyin === null) {
          return false
        }
      }

      let result = this.queryQueue.map(({pinyin}) => pinyin).join(' ')
      //console.log(result)
      this.$parent.dicts[this.queryIndex].pinyin = result
      //$(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).
      //queryIndex () {
        //$('body').addClass('loading')
        //this.focusPinyin(1000)
      //}
    },
    save: async function () {
      await this.$parent.save()
      this.lastQueryString = ''
      this.query = []
      $(this.$el).find(`.warning`).removeClass('warning')
      this.$refs.TypeTestInput.focus()
    },
  }
}
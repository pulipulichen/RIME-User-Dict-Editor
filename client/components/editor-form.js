module.exports = {
  data () {
    return {
      query: [],
      lastQueryString: '',
      queryIndex: -1,
      focusTimer: null,
    }
  },
  watch: {
    query () {
      if (this.lastQueryString === this.query.join('')) {
        return false
      }
      
      $('body').addClass('loading')
      this.focusPinyin(1000)
      this.lastQueryString = this.query.join('')
      this.$refs.MoeIframes.scrollTop = 0
      this.$refs.MoeIframes.scrollLeft = 0
    },
    //queryIndex () {
      //$('body').addClass('loading')
      //this.focusPinyin(1000)
    //}
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
      }
    },
    queryMoeDict (term, i) {
      term = term.trim()
      if (term === '') {
        return false
      }
      
      this.query = []
      term.trim().split('').forEach(char => {
        if (char === '') {
          return false
        }
        this.query.push(char)
      })
      this.queryIndex = i
    },
    queryMoeURL (q) {
      return "https://www.moedict.tw/" + q
    },
    focusPinyin (time = 300) {
      clearTimeout(this.focusTimer)
      this.focusTimer = setTimeout(() => {
        $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).focus()
        $('body').removeClass('loading')
        //console.log(this.queryIndex, `[data-dict-index="${this.queryIndex}"]`, $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).length)
      }, time)
    }
  }
}
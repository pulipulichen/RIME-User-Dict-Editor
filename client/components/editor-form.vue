<template>

  <form class="file-process-framework ui form" method="post" action="save.php">

    <div class="ui two column doubling grid">
      <div class="column">
        <div class="ui segment">


          <h1 class="ui horizontal divider header">
            小狼毫字典
          </h1>

          <!-- --------------------------------- -->

          <div class="ui bottom attached active tab segment" data-tab="textarea">
            <div class="instruction">
              <strong>悉</strong>: xi1 一聲 1</strong> / <strong>夾</strong>: jia2 <strong>二聲 2</strong> / <strong>什</strong>: shen3 <strong>三聲 3</strong> /
              <br /> <strong>砲</strong>: pao4 <strong>四聲 4</strong> / <strong>子</strong>: zi5 <strong>輕聲 5</strong>
            </div>
            <div class="table-wrapper" style="overflow-y: auto;
                 max-height: calc(100vh - 230px);
                 margin-bottom: 1em;">
              <table class="ui table">
                <thead>
                  <tr>
                    <th>字詞</th>
                    <th>發音</th>
                    <th style="min-width: 100px;">管理</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(dict, i) in $parent.dicts"
                      v-bind:class="{negative: !$parent.validateDict(dict)}">
                    <td>
                      <input type="text" 
                             name="dict_key" 
                             v-model="dict.term"
                             v-on:change="queryMoeDict(dict.term, i)" />
                    </td>
                    <td>
                      <input type="text" 
                             name="dict_value" 
                             v-model="dict.pinyin"
                             v-bind:data-dict-index="i" />
                    </td>
                    <td>
                      <button type="button" class="add-button tiny ui icon button"
                              v-on:click="addTerm(i)">
                        <i class="right plus icon"></i>
                      </button>
                      <button type="button" class="delete-button tiny ui icon button"
                              v-on:click="deleteTerm(dict, i)">
                        <i class="right remove icon"></i>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="field">
              <button type="button"  
                      class="fluid ui large right labeled icon button download-file" 
                      id="save_button"
                      v-bind:class="{'positive': $parent.isModified, 'disabled': !$parent.isModified}"
                      v-on:click="$parent.save">
                <i class="right save icon"></i>
                儲存
              </button>
            </div>
          </div>

          <!-- --------------------------------- -->

        </div> <!-- <div class="ui segment"> -->
      </div> <!-- <div class="column"> -->
      <!-- -------------------------------------- -->

      <div class="column">
        <div class="ui segment display-result" style="">
          <!-- <div class="display-result"> -->

          <h2 class="ui horizontal divider header">
            萌典
          </h2>
          <div id="moe_dicts">
            <iframe v-for="q in query"
                    v-bind:src="queryMoeURL(q)" 
                    class="query-moe-iframe"
                    v-on:load="focusPinyin"></iframe>
          </div>
        </div>
      </div> <!-- <div class="column"> -->
    </div> <!-- <div class="ui two column doubling grid"> -->
    
    <div class="loading-cover"><div class="loading-image"></div></div>
  </form>

</template>

<script>
module.exports = {
  data () {
    return {
      query: [],
      queryIndex: -1,
      focusTimer: null,
    }
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
      
      if (forceRemove || window.confirm(`確定刪除${term}？`)) {
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
    focusPinyin () {
      clearTimeout(this.focusTimer)
      this.focusTimer = setTimeout(() => {
        $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).focus()
        console.log(this.queryIndex, `[data-dict-index="${this.queryIndex}"]`, $(this.$el).find(`[data-dict-index="${this.queryIndex}"]`).length)
      }, 300)
      
    }
  }
}
</script>

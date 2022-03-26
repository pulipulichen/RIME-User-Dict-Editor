# RIME-User-Dict-Editor
A friendly user interface to edit RIME user dictionary.

Please use "bopomofo.custom.yaml" or "bopomofo_tw.custom.yaml"

Private document:
https://docs.google.com/document/d/1t5OBuD0pfqknAf5dGizsflcjw82YfJNeUsr37s1C-K0/edit#heading=h.wgko8t31hrw

# Installation

## 1. Setup customized dictionary

1. Locate the configuration path ( `/path/to/rime/` ): 
  - /home/[USER]/.local/share/fcitx5/rime/ (For Ubuntu 21.10)
2. Put customized dictionary in to the folder: `/path/to/rime/terra_pinyin.mine.dict.yaml` .
3. Setup `/path/to/rime/build/bopomofo_tw.schema.yaml`:

Before: 
````
translator:
  dictionary: terra_pinyin
````

After:

````
translator:
  dictionary: terra_pinyin.mine
````

4. Restart Fcitx5
5. Try to typing the customized phase.

## 2. Setup the RIME editor

1. Copy `config.example.js` into `config.js` .
2. Edit `dictPath`, `backupDictPath`, `deployCommand` .
3. Setup Application: `/path/to/RIME-User-Dict-Editor/RIME-User-Dict-Editor.sh`

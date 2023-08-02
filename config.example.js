module.exports = {
  dictPath: '/home/pudding/.local/share/fcitx5/rime/build/terra_pinyin.mine.dict.yaml',
  // For Windows: dictPath: 'C:\\Users\\USER\\AppData\\Roaming\\Rime\\terra_pinyin.mine.dict.yaml',
  // For Ubuntu 21.10: '/home/[USER]/.local/share/fcitx5/rime/build/terra_pinyin.mine.dict.yaml',
  
  backupDictPath: null,
  // /Apps/RIME/terra_pinyin.mine.dict.yaml
  
  deployCommand: false,
  //deployCommand: "kill `ps -A | grep fcitx5 | awk '{print $1}'` && fcitx5 &",
  // For Windows: deployCommand: '"C:\\Program Files (x86)\\Rime\\weasel-0.14.3\\WeaselDeployer.exe" /deploy',
  // For Ubuntu 21.10: deployCommand: "kill `ps -A | grep fcitx5 | awk '{print $1}'` && fcitx5 &",
  
  deployWait: false,
  // For Windows: deployWait: true,
  // For Ubuntu 21.10: deployWait: false,
  
  //deployCommand: 'sh /home/user/Documents/NetBeansProjects/[electron]/RIME-User-Dict-Editor/bin/rime-redeploy.sh',
  debug: {
    openDevTools: false
  }
}

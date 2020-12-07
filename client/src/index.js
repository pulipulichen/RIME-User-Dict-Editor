//window.alert('AAAsssssssA')

electron = require('electron');
ipcRenderer = electron.ipcRenderer;

//asaa
document.getElementById('b').addEventListener('click', () => {
  ipcRenderer.send('save_dict_file', (new Date()).getTime());
})
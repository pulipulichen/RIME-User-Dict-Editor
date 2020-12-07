/* global __dirname */

const {app, BrowserWindow, dialog, Menu, Tray, globalShortcut, ipcMain, session, shell} = require('electron');
let fs = require('fs');
var path = require('path');
let config = require('../config.js')
const { exec } = require("child_process");

module.exports = {
  setup: function () {
    ipcMain.on('load_dict_file', (event, _callback_id) => {
      let _file = config.dictPath
      //var _file_name = __dirname + "/cache/local_storage_" + _key + ".json";
      fs.exists(_file, function (_is_exists) {
        if (_is_exists === true) {
          fs.readFile(_file, "UTF8", function (_err, _content) {
            //_content = new Buffer(_content, 'binary').toString('base64');
            //_content = new Buffer(_content, 'binary').toString('base64');
            //_content = _content.toString('base64');
            event.sender.send(_callback_id, _content);
          });
        } else {
          event.sender.send(_callback_id, null);
        }
      });
    });

    ipcMain.on('save_dict_file', (event, _content, _callback_id) => {
      let _file = config.dictPath
      fs.writeFileSync(_file, _content, 'UTF8');
      
      if (config.backupDictPath) {
        fs.writeFileSync(config.backupDictPath, _content, 'UTF8');
      }
      
      // 這邊還要執行命令
      exec(config.deployCommand, (error, stdout, stderr) => {
        if (error) {
          console.log(`error: ${error.message}`);
          return;
        }
        if (stderr) {
          console.log(`stderr: ${stderr}`);
          return;
        }
        //console.log(`stdout: ${stdout}`);
        event.sender.send(_callback_id);
      });
    });
  }
};
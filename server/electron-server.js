/* global __dirname */

const {app, BrowserWindow, dialog, Menu, Tray, globalShortcut, ipcMain, session, shell, clipboard} = require('electron');
let fs = require('fs');
var path = require('path');
let config = require('../config.js')
const { exec } = require("child_process");
const open = require('open');

module.exports = {
  setup: function () {
    ipcMain.on('load_dict_file', (event, _callback_id) => {
      let _file = config.dictPath
      if (config.backupDictPath && fs.existsSync(config.backupDictPath)) {
        _file = config.backupDictPath
        
        // 比較一下現在和備份的檔案大小，如果某個檔案比較大，那就拿到另一邊去
        if (fs.existsSync(config.dictPath)) {
          if (fs.statSync(config.backupDictPath).size > fs.statSync(config.dictPath).size) {
            fs.copyFileSync(config.backupDictPath, config.dictPath)
            execDeploy()
          }
          else {
            // 本地端比較大
            _file = config.dictPath
          }
        }
        else {
          fs.copyFileSync(config.backupDictPath, config.dictPath)
          execDeploy()
        }
      }
      
      //console.log(_file, fs.existsSync(_file))
      
      //var _file_name = __dirname + "/cache/local_storage_" + _key + ".json";
      fs.exists(_file, function (_is_exists) {
        if (_is_exists === true) {
          fs.readFile(_file, "UTF8", function (_err, _content) {
            //_content = new Buffer(_content, 'binary').toString('base64');
            //_content = new Buffer(_content, 'binary').toString('base64');
            //_content = _content.toString('base64');
            //console.log(_content)
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
      
      if (config.backupDictPath 
              && fs.existsSync(config.backupDictPath)) {
        fs.writeFileSync(config.backupDictPath, _content, 'UTF8');
      }
      
      execDeploy(event, _callback_id)
    });
    
    function execDeploy (event, _callback_id) {
      
      if (!config.deployCommand) {
        return false
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
        if (config.deployWait === true && event) {
          event.sender.send(_callback_id);
        }
      });
      
      if (config.deployWait === false && event) {
        setTimeout(() => {
          event.sender.send(_callback_id)
        }, 6000)
      }
    }
    
    ipcMain.on('open_dict_file', (event, _content, _callback_id) => {
      let _file = config.dictPath
      open(_file)
    });
    
    ipcMain.on('load_dict_file', (event, _callback_id) => {
      let _file = config.dictPath
      if (config.backupDictPath) {
        _file = config.backupDictPath
      }
      
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

    ipcMain.on('get_text_from_clipboard', (event, _callback_id) => {
      let text = clipboard.readText()
      event.sender.send(_callback_id, text);
    })
  }
};
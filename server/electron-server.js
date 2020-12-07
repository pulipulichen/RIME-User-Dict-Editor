/* global __dirname */

const {app, BrowserWindow, dialog, Menu, Tray, globalShortcut, ipcMain, session, shell} = require('electron');
let fs = require('fs');
var path = require('path');
let config = require('../config.js')

module.exports = {
  setup: function () {
    ipcMain.on('load_dict_file', (event, _callback_id) => {
      let _file = config.dict_path
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

    ipcMain.on('save_dict_file', (event, _content) => {
      let _file = config.dict_path
      fs.writeFileSync(_file, _content, 'UTF8');
    });
  }
};
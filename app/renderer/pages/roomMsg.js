import React, { Component } from 'react';
import 'renderer/css/roomMsg.scss';

class roomMsg extends Component {
  constructor() {
    super();
    this.state = {
      welcomeText: '欢迎使用口袋房间提醒',
      msgList: []
    };
  }
  componentDidMount() {
    const lastTime = localStorage.getItem('lastTime') || 0;
    const msgData = [];
    this.socket = require('socket.io-client')('http://localhost:7001/kd');
    this.socket.on('connect', () => {
      console.log('连接成功');
      this.socket.emit('kd', lastTime);
    });
    this.socket.on('lastestMsg', msgs => {
      if (msgs.length > 0) {
        localStorage.setItem('lastTime', msgs[0].msgTime);
      }
      msgData.push(...msgs.reverse());
      // var html = template('msg-list', msgData);
      // var msgDom = document.getElementsByClassName('msg-list');
      // msgDom[0].innerHTML = html;
      msgs.reverse().forEach(msg => {
        console.log('get new msg: %s!', msg.msgText);
      });
      this.setState({
        msgList: msgData
      });
    });
    this.socket.on('newMsg', msgs => {
      if (msgs.length > 0) {
        localStorage.setItem('lastTime', msgs[0].msgTime);
      }
      msgData.push(...msgs.reverse());
      // var html = template('msg-list', msgData);
      // var msgDom = document.getElementsByClassName('msg-list');
      // msgDom[0].innerHTML = html;
      msgs.reverse().forEach(msg => {
        console.log('get new msg: %s!', msg.msgText);
      });
      this.setState({
        msgList: msgData
      });
    });
  }

  render() {
    return (
      <div className="app-wrap">
        <p className="welcome-tip">{this.state.welcomeText}</p>
        <ul className="msg-list">
          {this.state.msgList.map(msg => (
            <li className="msg-item" key={msg.msgTime}>
              <img
                src={require('renderer/images/avatar.jpg')}
                alt=""
                className="msg-avatar"
              />
              {msg.msgType === 'text' ? (
                <div className="msg-content">
                  <p>{msg.msgText}</p>
                </div>
              ) : msg.msgType === 'faipaiText' ? (
                <div className="msg-content">
                  <p>{msg.msgText}</p>
                  <p className="msg-fanpai">{msg.faiPaiText}</p>
                </div>
              ) : msg.msgType === 'image' ? (
                <div className="msg-content">
                  <a href="{msg.msgText}" class="msg-link" target="_blank">
                    <img src="{msg.msgText}" alt="" class="msg-image" />
                  </a>
                </div>
              ) : msg.msgType === 'live' ? (
                <div className="msg-content">
                  <a href="{msg.msgText}" class="msg-link" target="_blank">
                    <img src="{msg.coverImage}" alt="" class="msg-image" />
                  </a>
                </div>
              ) : msg.msgType === 'diantai' ? (
                <div className="msg-content">
                  <a href="{msg.msgText}" class="msg-link" target="_blank">
                    <img src="{msg.coverImage}" alt="" class="msg-image" />
                  </a>
                </div>
              ) : (
                ''
              )}
            </li>
          ))}
        </ul>
      </div>
    );
  }
}

export default roomMsg;

import React, { Component } from 'react';
import './App.css';
import ChannelSection from "./components/channels/ChannelSection";
import UserSection from './components/users/UserSection';
import MessageSection from './components/messages/MessageSection';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      channels: [],
      activeChannel: {},
      users: [],
      messages: [],
      connected: false,
    }
  }

  componentDidMount = () => {
    const ws = this.ws = new WebSocket('ws://echo.websocket.org');
    ws.onmessage = this.message;
    ws.onopen = this.open;
    ws.onclose = this.close;
  }
  
  message = e => {
    const event = JSON.parse(e.data);
    if(event.name === 'channel add') {
      this.newChannel(event.data);
    }
  }

  open = e => {
    this.setState({ connected: true });
  }

  close = e => {
    this.setState({ connected: false });
  }

  newChannel = channel => {
    const channels = [...this.state.channels, channel];
    this.setState({ channels });
  }

  addChannel = name => {
    // const channels = [...this.state.channels, {id: this.state.channels.length + 1, name }];
    // this.setState({ channels });
    // TODO: Send to server
    this.ws.send(JSON.stringify({
      name: 'channel add',
      data: {
        id: this.state.channels.length + 1,
        name,
      }
    }));
  }

  setChannel = activeChannel => {
    this.setState({ activeChannel });
  }

  setUserName = name => {
    const users = [...this.state.users, { id: this.state.users.length + 1, name }];
    this.setState({ users });
    // TODO: Send to server
  }

  addMessage = body => {
    const { messages, users } = this.state;
    const createdAt = new Date;
    const author = users.length > 0 ? users[0].name : 'anonymous';
    const newMessages = [...messages, { id: messages.length + 1, body, createdAt, author }]
    this.setState({ messages: newMessages });
    // TODO: Send to server
  }

  render() {
    return (
      <div className='app'>
        <div className='nav'>
          <ChannelSection
            {...this.state}
            addChannel={this.addChannel}
            setChannel={this.setChannel}
            />
          <UserSection
            {...this.state}
            setUserName={this.setUserName}
            />
        </div>
        <MessageSection 
          {...this.state}
          addMessage={this.addMessage}
        />
      </div>
    );
  }
}

export default App;

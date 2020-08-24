import SocketClient from 'socket.io-client';
const endpoint = 'http://localhost:5039';
const socket = SocketClient(endpoint);

export default socket;
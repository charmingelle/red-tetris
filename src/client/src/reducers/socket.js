import socketIOClient from 'socket.io-client';
import { store } from '../index';
import { loadRooms } from '../actions/loadRooms';
import { loadRoom } from '../actions/loadRoom';
import { updateMyData } from '../actions/updateMyData';
import { setTetro } from '../actions/setTetro';

const login = 'user';

export const io = socketIOClient({
  query: `login=${login}`,
});

io.on('update-rooms', ({ rooms }) => store.dispatch(loadRooms(rooms)));

io.on('send-room', ({ room }) => {
  console.log('room I joined', room);
  store.dispatch(loadRoom(room));
});

io.on('send-id', ({ id }) => store.dispatch(updateMyData({ id })));

io.on('update-room', ({ room }) => {
  console.log('update room happened');
  store.dispatch(loadRoom(room));
});

io.on('set-tetro', ({ tetro }) => store.dispatch(setTetro(tetro)));

export const socket = () => io;

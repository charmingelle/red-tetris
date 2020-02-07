import React from 'react';
import { connect } from 'react-redux';
import { Lobby } from '../Lobby';
import { Room } from '../Room';

const AppInner = ({ myRoomId }) => (myRoomId ? <Room /> : <Lobby />);

const mapStateToProps = ({ myRoomId }) => ({ myRoomId });

export const App = connect(mapStateToProps)(AppInner);

import React from 'react';
import { connect } from 'react-redux';
import { Lobby } from '../Lobby';
import { Room } from '../Room';

const AppInner = ({ showRoom }) => (showRoom ? <Room /> : <Lobby />);

const mapStateToProps = ({ myRoomId }) => ({ showRoom: myRoomId !== null });

export const App = connect(mapStateToProps)(AppInner);

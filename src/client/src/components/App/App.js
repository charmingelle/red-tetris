import React from 'react';
import { connect } from 'react-redux';
import { Lobby } from '../Lobby';
import { Game } from '../Game';

const AppInner = ({ showLobby }) => (showLobby ? <Lobby /> : <Game />);

const mapStateToProps = ({ showLobby }) => ({ showLobby });

export const App = connect(mapStateToProps)(AppInner);

import React from 'react';
import { connect } from 'react-redux';
import { Lobby } from '../Lobby';
import { Room } from '../Room';

const AppInner = ({ myRoom }) => (myRoom ? <Room /> : <Lobby />);

const mapStateToProps = ({ myRoom }) => ({ myRoom });

export const App = connect(mapStateToProps)(AppInner);

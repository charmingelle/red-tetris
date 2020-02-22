import React from 'react';
import { connect } from 'react-redux';
import './LobbyPeople.css';

const getRandomColor = () => {
  const colors = [
    '#c00',
    '#f77700',
    '#cccc00',
    '#129c0a',
    '#06cccc',
    '#0d05f3',
    '#9901cc',
  ];

  return colors[Math.floor(Math.random() * colors.length)];
};

const LobbyPeopleInner = ({ people }) => (
  <div className="lobby-people">
    <div className="lobby-people-label">Players</div>
    <div className="lobby-people-list">
      {Object.keys(people)
        .sort((id1, id2) => people[id2].score - people[id1].score)
        .map(id => (
          <div
            key={id}
            className="lobby-person-name"
            style={{ color: getRandomColor() }}
          >{`${people[id].name} - ${people[id].score}`}</div>
        ))}
    </div>
  </div>
);

const mapStateToProps = ({ people }) => ({ people });

export const LobbyPeople = connect(mapStateToProps)(LobbyPeopleInner);

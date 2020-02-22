import React from 'react';
import { connect } from 'react-redux';
import './People.css';

const getColor = (personId, myId) => (personId === myId ? '#c00' : '#f9f9f9');

const PeopleInner = ({ people, myId }) => (
  <div className="lobby-people">
    <div className="lobby-people-label">Players</div>
    <div className="lobby-people-list">
      {Object.keys(people)
        .sort((id1, id2) => people[id2].score - people[id1].score)
        .map(id => (
          <div
            key={id}
            className="lobby-person-name"
            style={{ color: getColor(id, myId) }}
          >{`${people[id].name} - ${people[id].score}`}</div>
        ))}
    </div>
  </div>
);

const mapStateToProps = ({ people, myId }) => ({ people, myId });

export const People = connect(mapStateToProps)(PeopleInner);

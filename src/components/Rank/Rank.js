import React from 'react';

function getEmoji(entries) {
  const emojis = ['🥺', '😜', '😃', '😄', '😉', '😊', '😍', '😵', '🔶', '🎖️', '🚀', '🏆'];
  const rankEmoji = emojis[entries >= emojis.length ? emojis.length - 1 : entries];
  return rankEmoji
}

function Rank({ user }) {
  const { name, entries } = user;
  return (
      <div>
          <div className='white f3'>
              {`${name}, your current rank is...`}
          </div>
          <div className='white f1'>
              {`${entries}`}
          </div>
          <div className='white f3'>
              {`Rank Badge: ${getEmoji(entries)}`}
          </div>
      </div>
  )
}

export default Rank;
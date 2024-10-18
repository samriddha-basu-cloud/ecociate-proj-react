import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const NUM_PLAYERS = 6;
const BOARD_SIZE = 50;

const PLAYER_COLORS = [
  'bg-red-500',
  'bg-blue-500',
  'bg-green-500',
  'bg-yellow-500',
  'bg-purple-500',
  'bg-pink-500'
];

const SNAKES_AND_LADDERS = {
  14: 7,
  22: 35,
  38: 20,
  49: 33,
  4: 16,
  9: 31,
  28: 42,
  36: 44
};

const DiceIcon = ({ value }) => {
  const dots = {
    1: [<circle key="1" cx="50%" cy="50%" r="6" fill="black" />],
    2: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="black" />,
      <circle key="2" cx="70%" cy="70%" r="6" fill="black" />
    ],
    3: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="black" />,
      <circle key="2" cx="50%" cy="50%" r="6" fill="black" />,
      <circle key="3" cx="70%" cy="70%" r="6" fill="black" />
    ],
    4: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="black" />,
      <circle key="2" cx="30%" cy="70%" r="6" fill="black" />,
      <circle key="3" cx="70%" cy="30%" r="6" fill="black" />,
      <circle key="4" cx="70%" cy="70%" r="6" fill="black" />
    ],
    5: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="black" />,
      <circle key="2" cx="30%" cy="70%" r="6" fill="black" />,
      <circle key="3" cx="50%" cy="50%" r="6" fill="black" />,
      <circle key="4" cx="70%" cy="30%" r="6" fill="black" />,
      <circle key="5" cx="70%" cy="70%" r="6" fill="black" />
    ],
    6: [
      <circle key="1" cx="30%" cy="25%" r="6" fill="black" />,
      <circle key="2" cx="30%" cy="50%" r="6" fill="black" />,
      <circle key="3" cx="30%" cy="75%" r="6" fill="black" />,
      <circle key="4" cx="70%" cy="25%" r="6" fill="black" />,
      <circle key="5" cx="70%" cy="50%" r="6" fill="black" />,
      <circle key="6" cx="70%" cy="75%" r="6" fill="black" />
    ]
  };

  return (
    <div className="w-16 h-16 border-2 border-gray-800 rounded-lg flex items-center justify-center bg-white shadow-inner">
      <svg width="100%" height="100%" viewBox="0 0 100 100">
        {dots[value] || []}
      </svg>
    </div>
  );
};

const Game = () => {
  const [players, setPlayers] = useState(Array(NUM_PLAYERS).fill(1));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);

  const rollDice = () => {
    setIsRolling(true);
    const roll = Math.floor(Math.random() * 6) + 1;
    setTimeout(() => {
      setDiceRoll(roll);
      setIsRolling(false);
      movePlayer(roll);
    }, 1000);
  };

  const movePlayer = (steps) => {
    setPlayers((prevPlayers) => {
      const newPlayers = [...prevPlayers];
      let newPosition = newPlayers[currentPlayer] + steps;

      if (SNAKES_AND_LADDERS[newPosition]) {
        newPosition = SNAKES_AND_LADDERS[newPosition];
      }

      newPlayers[currentPlayer] = Math.min(newPosition, BOARD_SIZE);
      return newPlayers;
    });

    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % NUM_PLAYERS);
  };

  const renderBoard = () => {
    const board = [];
    for (let i = BOARD_SIZE; i > 0; i--) {
      const row = Math.floor((i - 1) / 10);
      const col = row % 2 === 0 ? (i - 1) % 10 : 9 - ((i - 1) % 10);
      const playersHere = players.reduce((acc, pos, index) => (pos === i ? [...acc, index] : acc), []);
      const isSnakeOrLadderStart = Object.keys(SNAKES_AND_LADDERS).includes(i.toString());
      const isSnakeOrLadderEnd = Object.values(SNAKES_AND_LADDERS).includes(i);
      
      board.push(
        <div
          key={i}
          className={`w-16 h-16 border border-gray-300 flex items-center justify-center rounded-lg ${
            i % 2 === 0 ? 'bg-amber-100' : 'bg-amber-200'
          } shadow-md relative`}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
        >
          <span className="text-2xl font-bold text-gray-700">{i}</span>
          {isSnakeOrLadderStart && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={SNAKES_AND_LADDERS[i] > i ? '/ladder.png' : '/snake.png'}
                alt={SNAKES_AND_LADDERS[i] > i ? 'Ladder' : 'Snake'}
                className="w-12 h-12 object-contain opacity-50"
              />
            </div>
          )}
          {playersHere.length > 0 && (
            <div className="absolute top-0 right-0 flex flex-wrap max-w-[32px]">
              {playersHere.map(playerIndex => (
                <motion.div
                  key={playerIndex}
                  className={`w-4 h-4 ${PLAYER_COLORS[playerIndex]} rounded-full border border-white shadow-sm`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              ))}
            </div>
          )}
        </div>
      );
    }
    return board;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen">
      <h1 className="text-6xl font-bold mb-8 text-center text-amber-800 font-serif">Snake and Ladder</h1>
      <div className="grid grid-cols-10 grid-rows-5 gap-1 mb-8 p-4 bg-amber-300 rounded-lg shadow-lg max-w-4xl mx-auto">
        {renderBoard()}
      </div>
      <div className="flex justify-center items-center mb-6">
        <motion.button
          onClick={rollDice}
          className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full flex items-center text-xl font-bold transition duration-300 ease-in-out shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isRolling}
        >
          <motion.div
            animate={isRolling ? { rotateX: 360 } : { rotateX: 0 }}
            transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
          >
            <DiceIcon value={diceRoll || 1} className="mr-3" />
          </motion.div>
          <span className="ml-3">{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
        </motion.button>
      </div>
      {diceRoll && (
        <motion.p
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-2xl mb-6 font-serif text-amber-800"
        >
          You rolled a {diceRoll}
        </motion.p>
      )}
      <div className="grid grid-cols-3 gap-4 max-w-4xl mx-auto">
        {players.map((position, index) => (
          <motion.div
            key={index}
            className={`p-4 rounded-lg ${
              index === currentPlayer ? 'bg-amber-400 shadow-lg' : 'bg-amber-200'
            } transition-all duration-300 ease-in-out`}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <div className={`w-6 h-6 ${PLAYER_COLORS[index]} rounded-full mx-auto mb-2`}></div>
            <p className="text-center font-serif">
              <span className="font-bold">Player {index + 1}</span>
              <br />
              Position: {position}
            </p>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Game;
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRedo } from '@fortawesome/free-solid-svg-icons';


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

const PLAYER_GRADIENTS = [
  'from-red-500 to-red-600',
  'from-blue-500 to-blue-600',
  'from-green-500 to-green-600',
  'from-yellow-500 to-yellow-600',
  'from-purple-500 to-purple-600',
  'from-pink-500 to-pink-600'
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
    1: [<circle key="1" cx="50%" cy="50%" r="6" fill="#2c3e50" />],
    2: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="#2c3e50" />,
      <circle key="2" cx="70%" cy="70%" r="6" fill="#2c3e50" />
    ],
    3: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="#2c3e50" />,
      <circle key="2" cx="50%" cy="50%" r="6" fill="#2c3e50" />,
      <circle key="3" cx="70%" cy="70%" r="6" fill="#2c3e50" />
    ],
    4: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="#2c3e50" />,
      <circle key="2" cx="30%" cy="70%" r="6" fill="#2c3e50" />,
      <circle key="3" cx="70%" cy="30%" r="6" fill="#2c3e50" />,
      <circle key="4" cx="70%" cy="70%" r="6" fill="#2c3e50" />
    ],
    5: [
      <circle key="1" cx="30%" cy="30%" r="6" fill="#2c3e50" />,
      <circle key="2" cx="30%" cy="70%" r="6" fill="#2c3e50" />,
      <circle key="3" cx="50%" cy="50%" r="6" fill="#2c3e50" />,
      <circle key="4" cx="70%" cy="30%" r="6" fill="#2c3e50" />,
      <circle key="5" cx="70%" cy="70%" r="6" fill="#2c3e50" />
    ],
    6: [
      <circle key="1" cx="30%" cy="25%" r="6" fill="#2c3e50" />,
      <circle key="2" cx="30%" cy="50%" r="6" fill="#2c3e50" />,
      <circle key="3" cx="30%" cy="75%" r="6" fill="#2c3e50" />,
      <circle key="4" cx="70%" cy="25%" r="6" fill="#2c3e50" />,
      <circle key="5" cx="70%" cy="50%" r="6" fill="#2c3e50" />,
      <circle key="6" cx="70%" cy="75%" r="6" fill="#2c3e50" />
    ]
  };

  return (
    <div className="w-8 h-8 rounded-lg flex items-center justify-center bg-gradient-to-br from-white to-gray-400 shadow-inner">
      <svg width="80%" height="80%" viewBox="0 0 100 100">
        {dots[value] || []}
      </svg>
    </div>
  );
};

const PlayerCard = ({ player, index, isCurrentPlayer, isWinner }) => {
  return (
    <motion.div
      className={`p-4 rounded-xl ${
        isCurrentPlayer && !isWinner ? 'ring-2 ring-amber-400 shadow-lg' : 'shadow'
      } bg-gradient-to-br from-white to-gray-100 transition-all duration-300 ease-in-out hover:shadow-xl`}
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.1 }}
      whileHover={{ scale: 1.05 }}
    >
      <div className="flex items-center space-x-4">
        <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${PLAYER_GRADIENTS[index]} shadow-inner flex items-center justify-center text-white font-bold text-lg`}>
          {index + 1}
        </div>
        <div className="flex-grow">
          <h3 className={`text-xl font-bold bg-gradient-to-r ${PLAYER_GRADIENTS[index]} bg-clip-text text-transparent`}>Player {index + 1}</h3>
          <p className="text-gray-600 font-medium">Position: {player}</p>
        </div>
        {isCurrentPlayer && !isWinner && (
          <div className="w-4 h-4 bg-amber-400 rounded-full animate-pulse"></div>
        )}
        {isWinner && (
          <div className="text-3xl">👑</div>
        )}
      </div>
    </motion.div>
  );
};

const Game = () => {
  const [players, setPlayers] = useState(Array(NUM_PLAYERS).fill(1));
  const [currentPlayer, setCurrentPlayer] = useState(0);
  const [diceRoll, setDiceRoll] = useState(null);
  const [isRolling, setIsRolling] = useState(false);
  const [winner, setWinner] = useState(null);
  const [message, setMessage] = useState('');

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

      if (newPosition > BOARD_SIZE) {
        setMessage(`Player ${currentPlayer + 1} rolled too high. Turn skipped.`);
        return newPlayers;
      }

      if (newPosition === BOARD_SIZE) {
        setWinner(currentPlayer);
        triggerConfetti();
        setMessage(`Player ${currentPlayer + 1} wins!`);
      } else if (SNAKES_AND_LADDERS[newPosition]) {
        newPosition = SNAKES_AND_LADDERS[newPosition];
        setMessage(`Player ${currentPlayer + 1} ${newPosition > newPlayers[currentPlayer] ? 'climbed a ladder' : 'slid down a snake'} to ${newPosition}!`);
      } else {
        setMessage(`Player ${currentPlayer + 1} moved to ${newPosition}.`);
      }

      newPlayers[currentPlayer] = newPosition;
      return newPlayers;
    });

    setCurrentPlayer((prevPlayer) => (prevPlayer + 1) % NUM_PLAYERS);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
  };

  const restartGame = () => {
    setPlayers(Array(NUM_PLAYERS).fill(1));
    setCurrentPlayer(0);
    setDiceRoll(null);
    setIsRolling(false);
    setWinner(null);
    setMessage('');
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
        <motion.div
          key={i}
          className={`w-full h-full border border-amber-300 flex items-center justify-center rounded-lg ${
            i % 2 === 0 ? 'bg-amber-100' : 'bg-amber-200'
          } shadow-md relative overflow-hidden`}
          style={{
            gridRow: row + 1,
            gridColumn: col + 1,
          }}
          whileHover={{ scale: 1.05, zIndex: 10 }}
        >
          <span className="text-2xl font-bold text-amber-800">{i}</span>
          {isSnakeOrLadderStart && (
            <div className="absolute inset-0 flex items-center justify-center">
              <img
                src={SNAKES_AND_LADDERS[i] > i ? '/ladder.png' : '/snake.png'}
                alt={SNAKES_AND_LADDERS[i] > i ? 'Ladder' : 'Snake'}
                className="w-3/4 h-3/4 object-contain opacity-30"
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
        </motion.div>
      );
    }
    return board;
  };

  return (
    <div className="container mx-auto px-4 py-8 bg-gradient-to-br from-amber-50 to-orange-100 min-h-screen">
      <h1 className="text-6xl font-bold mb-8 text-center text-amber-800 font-serif">Snakes and Ladders</h1>
      <div className="grid grid-cols-10 grid-rows-5 gap-1 mb-8 p-4 bg-gradient-to-br from-amber-300 to-amber-400 rounded-2xl shadow-2xl max-w-4xl mx-auto aspect-[2/1]">
        {renderBoard()}
      </div>
      <div className="flex flex-col sm:flex-row justify-center items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">
        <motion.button
          onClick={rollDice}
          className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-6 py-3 rounded-full flex items-center text-xl font-bold transition duration-300 ease-in-out shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={isRolling || winner !== null}
        >
          <motion.div
            animate={isRolling ? { rotateX: 360 } : { rotateX: 0 }}
            transition={{ duration: 0.5, repeat: isRolling ? Infinity : 0 }}
          >
            <DiceIcon value={diceRoll || 1} />
          </motion.div>
          <span className="ml-3">{isRolling ? 'Rolling...' : 'Roll Dice'}</span>
        </motion.button>
        <motion.button
            onClick={restartGame}
            className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-6 py-3 rounded-full text-xl font-bold transition duration-300 ease-in-out shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            >
            <FontAwesomeIcon icon={faRedo} className="mr-2" />
            Restart Game
            </motion.button>
      </div>
      {diceRoll && (
        <motion.p
          key={diceRoll}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-3xl mb-2 font-serif text-amber-800"
        >
          You rolled a {diceRoll}
        </motion.p>
      )}
      {message && (
        <motion.p
          key={message}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-2xl mb-6 font-serif text-amber-700"
        >
          {message}
        </motion.p>
      )}
      {winner !== null && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center text-5xl mb-6 font-serif text-amber-800"
        >
          🎉 Congratulations Player {winner + 1}! You've won! 🎉
        </motion.div>
      )}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
        {players.map((position, index) => (
          <PlayerCard
            key={index}
            player={position}
            index={index}
            isCurrentPlayer={index === currentPlayer}
            isWinner={winner === index}
          />
        ))}
      </div>
    </div>
  );
};

export default Game;
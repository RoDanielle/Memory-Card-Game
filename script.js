const cards = [
  '🍏', '🍏',
  '🍊', '🍊',
  '🍌', '🍌',
  '🍓', '🍓',
  '🍉', '🍉',
  '🍇', '🍇',
  '🍍', '🍍',
  '🍑', '🍑',
  '🥝', '🥝',
  '🍒', '🍒'
];

let selectedCards = [];
let matchedCards = [];
let playerName = '';
let totalPairs = 0;
let timerInterval;
let timeRemaining = 60; // Default time in seconds

// Start the game
document.getElementById('start-game').addEventListener('click', () => {
  playerName = document.getElementById('player-name').value;
  totalPairs = parseInt(document.getElementById('card-pairs').value);

  // Clear previous error messages
  const nameErrorMessage = document.getElementById('name-error-message');
  const cardErrorMessage = document.getElementById('card-error-message');
  if (nameErrorMessage) {
      nameErrorMessage.remove();
  }
  if (cardErrorMessage) {
      cardErrorMessage.remove();
  }

  // Validation for player name
  if (!playerName) {
      const error = document.createElement('div');
      error.id = 'name-error-message';
      error.classList.add('error');
      error.innerText = 'Please fill in your name.';
      document.getElementById('input-screen').appendChild(error);
      return;
  }

  // Validation for total pairs
  if (isNaN(totalPairs) || totalPairs < 2 || totalPairs > 10) {
      const error = document.createElement('div');
      error.id = 'card-error-message';
      error.classList.add('error');
      error.innerText = 'Please enter a valid number of card pairs (2-10).';
      document.getElementById('input-screen').appendChild(error);
      return;
  }

  setupGame(totalPairs);
  document.getElementById('input-screen').classList.add('hidden');
  document.getElementById('game-screen').classList.remove('hidden');
  document.getElementById('welcome-message').innerText = `Welcome, ${playerName}!`;

  startTimer(); // Start the timer
});

function setupGame(pairs) {
  const gameBoard = document.getElementById('game-board');
  gameBoard.innerHTML = ''; // Clear the board
  matchedCards = []; // Reset matched cards
  selectedCards = []; // Reset selected cards

  const shuffledCards = cards.slice(0, pairs * 2).sort(() => Math.random() - 0.5);
  shuffledCards.forEach((card) => {
      const cardElement = document.createElement('div');
      cardElement.classList.add('card');
      cardElement.dataset.cardValue = card;

      cardElement.addEventListener('click', () => flipCard(cardElement));

      gameBoard.appendChild(cardElement);
  });
}

function flipCard(card) {
  if (selectedCards.length < 2 && !card.classList.contains('flipped') && !matchedCards.includes(card)) {
      card.classList.add('flipped');
      card.innerText = card.dataset.cardValue;
      selectedCards.push(card);

      if (selectedCards.length === 2) {
          checkMatch();
      }
  }
}

function checkMatch() {
  setTimeout(() => {
      const [firstCard, secondCard] = selectedCards;

      if (firstCard.dataset.cardValue === secondCard.dataset.cardValue) {
          // Match found, add to matched cards
          matchedCards.push(firstCard, secondCard);
          console.log(`Matched cards: ${matchedCards.length}`); // Debugging

          selectedCards = [];

          // Check if all pairs are matched
          if (matchedCards.length === totalPairs * 2) {
              clearInterval(timerInterval); // Stop the timer
              console.log('All pairs matched'); // Debugging
              setTimeout(() => {
                  alert(`Congratulations, ${playerName}! You found all pairs!`);
                  document.getElementById('restart-game').classList.remove('hidden');
              }, 500);
          }
      } else {
          // No match, flip cards back
          selectedCards.forEach((card) => {
              card.classList.remove('flipped');
              card.innerText = '';
          });
          selectedCards = [];
      }
  }, 1000);
}

// Timer function
function startTimer() {
  timeRemaining = 60; // Reset timer to 60 seconds
  document.getElementById('timer-value').innerText = timeRemaining;

  timerInterval = setInterval(() => {
      timeRemaining--;
      document.getElementById('timer-value').innerText = timeRemaining;

      if (timeRemaining <= 0) {
          clearInterval(timerInterval);
          alert(`Time's up! ${playerName}, you didn't find all pairs.`);
          document.getElementById('restart-game').classList.remove('hidden');
      }
  }, 1000);
}

// Restart game functionality
document.getElementById('restart-game').addEventListener('click', () => {
  matchedCards = [];
  selectedCards = [];
  document.getElementById('restart-game').classList.add('hidden');
  document.getElementById('input-screen').classList.remove('hidden'); // Show input screen again for new game
  document.getElementById('game-screen').classList.add('hidden'); // Hide game screen
  clearInterval(timerInterval); // Clear timer
});
// Array of colors for the flashcards
const colors = [
  '#3498db', // Blue
  '#e74c3c', // Red
  '#2ecc71', // Green
  '#f39c12', // Orange
  '#9b59b6', // Purple
  '#1abc9c', // Turquoise
  '#d35400', // Dark Orange
  '#27ae60', // Emerald
  '#c0392b', // Dark Red
  '#8e44ad', // Dark Purple
  '#16a085', // Green Sea
  '#2980b9', // Belize Hole
  '#7f8c8d', // Asbestos
  '#f1c40f'  // Sunflower
];

// Shuffle the colors array to randomize
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

// Initialize flashcards when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  const shuffledColors = shuffleArray([...colors]);
  let currentlyFlipped = null;
  
  // Apply colors to flashcards
  document.querySelectorAll('.flashcard').forEach((card, index) => {
    // Check if this is the phrasal verb card
    if (card.id === 'phrasal-verb-card') {
      // For the phrasal verb card, use a fixed color
      const frontCard = card.querySelector('.flashcard-front');
      const backCard = card.querySelector('.flashcard-back');
      frontCard.style.backgroundColor = '#fff1f0';
      backCard.style.borderLeftColor = '#e74c3c';
    } else {
      // For regular cards, apply random color to front and border of back
      const colorIndex = index % shuffledColors.length;
      const color = shuffledColors[colorIndex];
      const frontCard = card.querySelector('.flashcard-front');
      const backCard = card.querySelector('.flashcard-back');
      frontCard.style.backgroundColor = color;
      backCard.style.borderLeftColor = color;
    }
    
    // Add click event for flipping
    card.addEventListener('click', () => {
      // If this card is already flipped, just flip it back
      if (card.classList.contains('flipped')) {
        card.classList.remove('flipped');
        currentlyFlipped = null;
        return;
      }
      
      // If another card is currently flipped, flip it back first
      if (currentlyFlipped) {
        currentlyFlipped.classList.remove('flipped');
      }
      
      // Flip this card and set it as the currently flipped card
      card.classList.add('flipped');
      currentlyFlipped = card;
    });
  });
});

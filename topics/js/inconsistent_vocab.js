/**
 * Inconsistent Vocabulary JavaScript
 * This file handles the functionality for all inconsistent vocabulary pages
 */

// Function to populate the vocabulary table
function populateVocabTable(dayOfWeek, vocabularyData) {
  const tableBody = document.getElementById('vocabTableBody');
  
  // Load saved progress from localStorage
  const storageKey = `${dayOfWeek.toLowerCase()}VocabProgress`;
  const savedProgress = JSON.parse(localStorage.getItem(storageKey)) || {};
  
  // Clear existing content
  tableBody.innerHTML = '';
  
  if (!vocabularyData || vocabularyData.length === 0) {
    // Display placeholder message if no vocabulary data
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.className = 'empty-message';
    cell.textContent = `${dayOfWeek} vocabulary content will be added soon.`;
    row.appendChild(cell);
    tableBody.appendChild(row);
    return;
  }
  
  vocabularyData.forEach((item, index) => {
    const row = document.createElement('tr');
    
    // First column: Word/Phrase with type
    const wordCell = document.createElement('td');
    const wordText = document.createElement('div');
    wordText.textContent = item.front;
    wordText.style.fontWeight = 'bold';
    
    const typeText = document.createElement('div');
    typeText.className = 'word-type';
    typeText.textContent = `(${item.type})`;
    
    wordCell.appendChild(wordText);
    wordCell.appendChild(typeText);
    
    // Second column: B2 Level (empty for now)
    const b2Cell = document.createElement('td');
    
    // Third column: Progress checkbox
    const progressCell = document.createElement('td');
    const checkboxContainer = document.createElement('div');
    checkboxContainer.className = 'checkbox-container';
    
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.className = 'progress-checkbox';
    checkbox.dataset.index = index;
    checkbox.checked = savedProgress[index] === true;
    
    checkbox.addEventListener('change', function() {
      // Save progress to localStorage
      const progress = JSON.parse(localStorage.getItem(storageKey)) || {};
      progress[this.dataset.index] = this.checked;
      localStorage.setItem(storageKey, JSON.stringify(progress));
    });
    
    checkboxContainer.appendChild(checkbox);
    progressCell.appendChild(checkboxContainer);
    
    // Add cells to row
    row.appendChild(wordCell);
    row.appendChild(b2Cell);
    row.appendChild(progressCell);
    
    // Add row to table
    tableBody.appendChild(row);
  });
}

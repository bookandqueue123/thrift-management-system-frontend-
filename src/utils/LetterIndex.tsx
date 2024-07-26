export function getLetterFromIndex(index: number) {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J']; // Extend this array as needed
    return letters[index] || ''; // Returns an empty string if the index is out of bounds
  }
function processInput() {
  let inputElement = document.getElementById('input');
  let input = inputElement.value;

  // Remove existing bold tags from the input
  input = input.replace(/<\/?b>/g, '');

  inputElement.value = input;
  boldLetters();
}
function boldLetters() {
  let input = document.getElementById('input').value;
  let words = input.split(' ');
  let boldedWords = [];

  for (let i = 0; i < words.length; i++) {
    let word = words[i];
    if (word === '') {
      boldedWords.push('');
    } else if (word.length <= 3) {
      boldedWords.push('<b>' + word + '</b>');
    } else if (word.length === 4) {
      boldedWords.push('<b>' + word.substr(0, 2) + '</b>' + word.substr(2));
    } else if (word.length >= 5 && word.length <= 6) {
      boldedWords.push('<b>' + word.substr(0, 3) + '</b>' + word.substr(3));
    } else {
      boldedWords.push('<b>' + word.substr(0, 4) + '</b>' + word.substr(4));
    }
  }

  document.getElementById('output').innerHTML = boldedWords.join(' ');
}

function convertToNormalText() {
  let wrapper = document.getElementById('output');
  let content = wrapper.innerHTML;

  // Replace opening and closing angle brackets with their entity equivalents
  content = content.replace(/</g, '&lt;').replace(/>/g, '&gt;');

  wrapper.innerHTML = content;
}

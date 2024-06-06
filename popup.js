document.getElementById('addBadWord').addEventListener('click', () => {
  const badWordInput = document.getElementById('badWordInput');
  const badWord = badWordInput.value.trim();
  if (badWord) {
    addBadWordToList(badWord);
    badWordInput.value = '';
  }
});

function addBadWordToList(badWord) {
  const li = document.createElement('li');
  const span = document.createElement('span');
  span.textContent = badWord;
  const button = document.createElement('button');
  button.textContent = 'Remove';
  button.addEventListener('click', () => {
    li.remove();
  });

  li.appendChild(span);
  li.appendChild(button);
  document.getElementById('badWordsList').appendChild(li);
}

document.getElementById('save').addEventListener('click', () => {
  const hashtagLimit = document.getElementById('hashtagLimit').value;
  const badWords = Array.from(document.querySelectorAll('#badWordsList li span')).map(span => span.textContent);
  chrome.storage.sync.set({
    hashtagLimit: parseInt(hashtagLimit),
    badWords: badWords
  }, () => {
    alert('Settings saved');
  });
});

document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.sync.get(['hashtagLimit', 'badWords'], (result) => {
    if (result.hashtagLimit) {
      document.getElementById('hashtagLimit').value = result.hashtagLimit;
    }
    if (result.badWords) {
      result.badWords.forEach(addBadWordToList);
    }
  });
});

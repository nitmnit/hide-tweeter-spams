function hideTweets(hashtagLimit, badWords) {
  let counter = 0;
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach(tweet => {
    const hashtags = tweet.querySelectorAll('a[href*="/hashtag/"]');
    const tweetText = tweet.innerText.toLowerCase();

    const containsBadWord = badWords.some(word => tweetText.includes(word.toLowerCase()));
    if (hashtags.length >= hashtagLimit || containsBadWord) {
      tweet.closest('article').style.display = 'none';
      counter += 1;
      console.log("hid " + counter + " tweets.");
    }
  });
}

function applySettings() {
  chrome.storage.sync.get(['hashtagLimit', 'badWords'], (result) => {
    const hashtagLimit = result.hashtagLimit || 3;  // Default to 4 if not set
    const badWords = result.badWords || [];  // Default to empty array if not set
    
    console.log(`Applying settings: hashtagLimit=${hashtagLimit}, badWords=${badWords}`);
    hideTweets(hashtagLimit, badWords);
  });
}

window.addEventListener('load', applySettings);
const observer = new MutationObserver(applySettings);
observer.observe(document, { childList: true, subtree: true });

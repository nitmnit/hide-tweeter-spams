// const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{1FB00}-\u{1FBFF}\u{1FC00}-\u{1FCFF}\u{1FD00}-\u{1FDFF}\u{1FE00}-\u{1FEFF}\u{1FF00}-\u{1FFFF}]/u;
// const emojiRegex = /(u00a9|u00ae|[u2000-u3300]|ud83c[ud000-udfff]|ud83d[ud000-udfff]|ud83e[ud000-udfff])/gi;
// const emojiRegex = /(p{Emoji_Presentation}|p{Extended_Pictographic})/gu; 
const emojiRegex = /\p{EPres}|\p{ExtPict}/gu;
function hideTweets(hashtagLimit, badWords) {
  let counter = 0;
  const tweets = document.querySelectorAll('article[data-testid="tweet"]');
  tweets.forEach(tweet => {
    const hashtags = tweet.querySelectorAll('a[href*="/hashtag/"]');
    const tweetText = tweet.innerText.toLowerCase();

    const containsBadWord = badWords.some(word => tweetText.includes(word.toLowerCase()));
    const handle = tweet.querySelector('div[data-testid="User-Name"] a[role="link"]');
    const username = handle && handle.innerText;
    const startsWithUnderscore = username && username.startsWith('_');
    const endsWithUnderscore = username && username.endsWith('_');
    let hasEmoji = handle && handle.querySelector('img');
    // const hasEmoji = handle && emojiRegex.test(handle.innerText);
    // if (hashtags.length >= hashtagLimit || containsBadWord || hasEmoji) {
    if (hashtags.length >= hashtagLimit || containsBadWord || hasEmoji || startsWithUnderscore || endsWithUnderscore) {
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

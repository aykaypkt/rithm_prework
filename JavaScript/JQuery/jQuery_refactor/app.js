document.addEventListener('DOMContentLoaded', function() {
  var wordCount = 15;
  var guessCount = 4;
  var password = '';

  $('#start').on('click', function() {
    $('#start-screen').toggleClass('hide show');
    $('#game-screen').toggleClass('hide show');
    startGame();
  });

  function startGame() {
    // get random words and append them to the DOM
    $wordList = $("#word-list");
    var randomWords = getRandomValues(words, wordCount);
    randomWords.forEach(function(word) {
      var $li = $("<li>");
      $li.text(word);
      $wordList.append($li);
    });

    // set a secret password and the guess count display
    password = getRandomValues(randomWords, 1)[0];
    setGuessCount(guessCount);

    // add update listener for clicking on a word
    $wordList.on('click', updateGame);
  }

  function updateGame(e) {
    if ($(e.target).prop('tagName') === "LI" && !$(e.target).hasClass("disabled")) {
      // grab guessed word, check it against password, update view
      var $guess = $(e.target).text();
      var similarityScore = compareWords($guess, password);
      $(e.target).addClass("disabled");
      $(e.target).text($(e.target).text() + " --> Matching Letters: " + similarityScore);
      setGuessCount(guessCount - 1);

      // check whether the game is over
      if (similarityScore === password.length) {
        $('#winner').toggleClass('hide show');
        $wordList.off('click', updateGame);
      } else if (guessCount === 0) {
        $('#loser').toggleClass('hide show');
        $wordList.off('click', updateGame);
      }
    }
  }

  function setGuessCount(newCount) {
    guessCount = newCount;
    document.getElementById("guesses-remaining").innerText = "Guesses remaining: " + guessCount + ".";
  }

  function compareWords(word1, word2) {
    if (word1.length !== word2.length) throw "Words must have the same length";
    var count = 0;
    for (var i = 0; i < word1.length; i++) {
      if (word1[i] === word2[i]) count++;
    }
    return count;
  }

  function shuffle(array) {
    var arrayCopy = array.slice();
    for (var idx1 = arrayCopy.length - 1; idx1 > 0; idx1--) {
      // generate a random index between 0 and idx1 (inclusive)
      var idx2 = Math.floor(Math.random() * (idx1 + 1));

      // swap elements at idx1 and idx2
      var temp = arrayCopy[idx1];
      arrayCopy[idx1] = arrayCopy[idx2];
      arrayCopy[idx2] = temp;
    }
    return arrayCopy;
  }

  function getRandomValues(array, numberOfVals) {
    return shuffle(array).slice(0, numberOfVals);
  }
});
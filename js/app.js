/********************************************************/
/*       Node Selection & Variable Initialization       */
/********************************************************/

// Get the element with the ID of qwerty.
const qwertyDiv = document.getElementById("qwerty");

// Get the element with the ID of phrase.
const phraseDiv = document.getElementById("phrase");

// Get an array of hearts.
const hearts = (Array.from(document.getElementById("scoreboard").firstElementChild.children));
hearts.forEach(function (li, index) {
    hearts[index] = li.firstElementChild;
});

// Get an array of 3 key rows.
const keyRows = Array.from(qwertyDiv.children);

// Get an array of Key objects. 

const keyElements = [];
keyRows.forEach(keyRow => {
    const keysOfRow = Array.from(keyRow.children);
    keyElements.push(...keysOfRow);

});

// Get reset button.
const btnReset = document.getElementsByClassName('btn__reset')[0];

// Get start overlay.
const overlay = document.getElementById('overlay');

// Initialize a phrase array.
const phrases = [
    "hello world",
    "happy coding",
    "good morning",
    "yes ok",
    "are you sure",
]

// Initialize a counter of missed times.
let missed = 0;

// Number of letters in phrase.
let numLetter = 0;

// Number of guessed letters.
let numLetterShown = 0;

// Initialize messagen elements on win and lose overlay.
const winMsg = document.createElement('p');
winMsg.textContent = 'You Win!'
winMsg.id = 'msg';

const loseMsg = document.createElement('p');
loseMsg.textContent = 'You Lose!'
loseMsg.id = 'msg';


// /***************************************/
// /*             Game  Logic             */
// /***************************************/

// Start game and hide the overlay
btnReset.addEventListener('click', (e) => {
    if (e.target.textContent === 'Start Game') {
        const phraseArray = getRandomPhraseAsArray(phrases);
        addPhraseToDisplay(phraseArray);
    } else if (e.target.textContent === 'Try Again') {
        restart();
    }
    overlay.style.display = 'none';

})

// Add an event listener to the keyboard.
qwertyDiv.addEventListener('click', e => {
    if (e.target.tagName === 'BUTTON') {
        const thisKeyElement = e.target;
        const letter = thisKeyElement.textContent;

        // Clicked keys are already disabled, so no need to check
        thisKeyElement.className += ' chosen';
        thisKeyElement.disabled = true;

        // Get guessing result
        const letterFound = checkLetter(thisKeyElement);

        if (letterFound) {
            // If there's a match:
            checkWin();
        } else {
            // If there's no match:
            missed += 1;
            thisKeyElement.className += ' wrong';
            removeTry();
            checkWin();
        }
    }
});




/*******************************************/
/*             Helper  Methods             */
/*******************************************/

/**
 * Parse a random string from the input string array.
 * @param {*} arr - an array of strings.
 * @returns an array of character of the randomly selected string.
 */
function getRandomPhraseAsArray(arr) {
    var phrase = arr[Math.floor(Math.random() * arr.length)];
    return [...phrase];
}

/**
 * Take any array of letters and add it to the display. 
 * @param {*} arr An array ot letters.
 */
function addPhraseToDisplay(arr) {
    // do stuff any arr that is passed in, and add to `#phrase ul`
    const letterList = phraseDiv.firstElementChild;
    arr.forEach(letter => {
        const li = document.createElement('li');
        if (letter === ' ') {
            li.className = 'space';
        } else {
            li.className = 'letter';
            numLetter += 1;
        }
        li.textContent = letter;
        letterList.appendChild(li);
    });
}

/**
 * Check if the clicked key matches any letter in the phrase:
 * If there’s a match, the function should add the “show” class to the list item 
 * containing that letter, store the matching letter inside of a variable, and return 
 * that letter.
 * If a match wasn’t found, the function should return null.
 * @param {*} key - Key object  
 */
function checkLetter(keyElement) {
    const letters = Array.from(phraseDiv.firstElementChild.children);
    let letterFound = null;
    letters.forEach(letter => {
        if (letter.textContent.toUpperCase() === keyElement.textContent.toUpperCase()) {
            // If the right letter is found, show it.
            letter.classList += ' show';
            letterFound = letter.textContent;
            numLetterShown += 1;
        }
    });
    return letterFound;
}


function checkWin() {
    if (missed >= 5) {
        // lose
        removeOverlayMsg();
        overlay.className = 'lose';
        btnReset.textContent = 'Try Again';
        overlay.insertBefore(loseMsg, overlay.children[1]);
        overlay.style.display = '';
    }

    if (numLetter === numLetterShown) {
        // win
        removeOverlayMsg();
        overlay.className = 'win';
        btnReset.textContent = 'Try Again';
        overlay.insertBefore(winMsg, overlay.children[1]);
        overlay.style.display = '';
    }


}

/**
 *  Removes a try in scoreboard.
 */
function removeTry() {
    for (let i = 0; i < missed; i++) {
        const heart = hearts[i];
        heart.src = 'images/lostHeart.png';
    }
}

/**
 * Remove existing messages before showing a new overlay.
 */
function removeOverlayMsg() {
    const msg = overlay.getElementsByTagName('p')[0];
    if (msg) {
        overlay.removeChild(msg);
    }

}


function restart() {
    // Reset counters
    missed = 0;
    numLetterShown = 0;
    numLetter = 0;

    // Reset scoreboard
    for (let i = 0; i < hearts.length; i++) {
        const heart = hearts[i];
        heart.src = 'images/liveHeart.png';
    }

    // Reset keys
    keyElements.forEach(key => {
        key.className = '';
        key.disabled = false;
    });

    // Remove previous phrase
    const currentLetterList = phraseDiv.children[0];
    const currentLetters = Array.from(phraseDiv.children[0].children);
    currentLetters.forEach(letter => {
        currentLetterList.removeChild(letter);
    });

    // Get random phrase
    const phraseArray = getRandomPhraseAsArray(phrases);
    addPhraseToDisplay(phraseArray);
}

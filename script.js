let hasBook = false;
let readBook = false;
let hasKey = false;
let sawMessage = false;

function startGame() {
  show("You stand in the main hallway of the haunted mansion. Where will you go?", [
    { text: "Explore Left Hallway", action: leftHallway },
    { text: "Explore Right Hallway", action: rightHallway },
    { text: "Go Upstairs", action: upstairs }
  ]);
}

function leftHallway() {
  show("You encounter a ghost! What will you do?", [
    { text: "Run!", action: () => lose("The ghost grabs you as you flee. You lose.") },
    {
      text: "Talk to the ghost", action: () => {
        hasBook = true;
        show("The ghost vanishes, leaving behind a mysterious book. Will you read it?", [
          {
            text: "Read the book", action: () => {
              readBook = true;
              show("The book reveals a hidden passage to the basement.", [
                { text: "Return to Hallway", action: startGame }
              ]);
            }
          },
          {
            text: "Ignore it", action: () => {
              show("You ignore the book and return to the hallway.", [
                { text: "Return to Hallway", action: startGame }
              ]);
            }
          }
        ]);
      }
    }
  ]);
}

function rightHallway() {
  hasKey = true;
  sawMessage = true;
  show("You found a rusty key and entered a secret room. On the wall, a message reads: 'The password lies in the word that opens everything.'", [
    { text: "Return to Hallway", action: startGame }
  ]);
}

function upstairs() {
  if (readBook) {
    show("As you reach the top of the stairs, the book glows and reveals a hidden path to the basement.", [
      { text: "Enter Basement", action: basement }
    ]);
  } else {
    show("You encounter another ghost at the top of the stairs.", [
      { text: "Run!", action: () => lose("The ghost strikes you down.") },
      { text: "Confront the ghost", action: upstairsGhost }
    ]);
  }
}

function upstairsGhost() {
  show("The ghost whispers: 'Follow the candles to find the truth...'. You discover a secret passage to the basement.", [
    { text: "Enter Basement", action: basement }
  ]);
}

function basement() {
  if (!sawMessage) {
    show("You see a locked door with a keypad. You don't know the code.", [
      { text: "Return to Hallway", action: startGame }
    ]);
  } else {
    show("A locked door with a keypad appears. The hidden message you saw might help. What is the code?", [], true);
  }
}

function lose(message) {
  show(message, [
    { text: "Restart", action: () => location.reload() }
  ]);
}

function win() {
  show("The code works! The door opens and you escape the mansion safely!", [
    { text: "Play Again", action: () => location.reload() }
  ]);
}

function show(text, options = [], isInput = false) {
  const gameText = document.getElementById("game-text");
  const choices = document.getElementById("choices");
  gameText.innerHTML = `<p>${text}</p>`;
  choices.innerHTML = "";

  if (isInput) {
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "Enter the code...";
    input.style.marginRight = "10px";
    choices.appendChild(input);

    const submit = document.createElement("button");
    submit.innerText = "Submit";
    submit.onclick = () => {
      if (input.value.trim().toUpperCase() === "OPEN") {
        win();
      } else {
        lose("Wrong code! The mansion traps you forever.");
      }
    };
    choices.appendChild(submit);
  } else {
    options.forEach(option => {
      const btn = document.createElement("button");
      btn.innerText = option.text;
      btn.onclick = option.action;
      choices.appendChild(btn);
    });
  }
}

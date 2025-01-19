document.addEventListener("DOMContentLoaded", onLoad);
const alreadyPlayedWords = [];
let chosenWord;
setWord();

function onLoad()
{
    loadWordList("wordsFull").then(wordList => {

    window.addEventListener("keydown", (event) => onEnter(event,wordList,chosenWord));
    //Desabilitando as caixas de texto das divs não ativas.
    const inputBoxesToDisable = document.querySelectorAll(".inputsContainer:not(.active) .termoInput");
    inputBoxesToDisable.forEach((inputBox)=>inputBox.disabled=true)

    const playAgainBtn = document.querySelector("#playAgain-btn");
    playAgainBtn.addEventListener("click",resetGame)

    });
}

function onEnter(event,wordList,correctWord)
{
    const inputBoxes = document.querySelectorAll(".inputsContainer.active .termoInput ");

    const typedWord = Array.from(inputBoxes).map(input => input.value.toLowerCase()).join("");

    const typedWordCorrected = wordCorrector(typedWord,wordList);

    const matchArray = verifyWord(inputBoxes,correctWord)
    

    if (event.key === "Enter" && isAllFilled(inputBoxes) && wordList.includes(typedWordCorrected))
    {
        changeStyles(inputBoxes,matchArray);
        changeDisplayedCharacters(inputBoxes,typedWord,wordList);
    }
    else if(event.key === "Enter" && !isAllFilled(inputBoxes)){
        showMessage("Só palavras de 5 letras!",false);
    }
    else if(event.key === "Enter" && !wordList.includes(typedWordCorrected) && document.querySelector("#playAgain-btn").style.visibility==="hidden"){
        showMessage("Palavra inválida.",false);
    }
}

function isAllFilled(inputBoxes)
{
    const filtered = Array.from(inputBoxes).filter((inputBox)=>inputBox.value.length === 0)

    if(filtered.length === 0)
        return true;

    return false;
}

function verifyWord(inputBoxes, correctWord)
{

    const inputLetters = Array.from(inputBoxes).map(input => input.value.toLowerCase());
    const correctLetters = normalizeWord(correctWord).toLowerCase().split("");

    // Rastreio de letras já usadas.
    const usedCorrect = Array(correctWord.length).fill(false);

    // Processa os corretos.
    const halfMatchArray = inputLetters.map((letter, index) => 
    {
        if (letter === correctLetters[index]) 
        {
            usedCorrect[index] = true; 
            return "correct";
        }
        return null; // Apenas preenche espaço para posterior aplicação do segundo map.
    });

    // Processa os misplaced e absent
    const matchArray = halfMatchArray.map((status, index) => 
    {
        if (status === "correct")
            return status; 

        const letter = inputLetters[index];
        for (let i = 0; i < correctLetters.length; i++) 
        {
            // Procura por uma correspondência "misplaced" válida
            if (correctLetters[i] === letter && !usedCorrect[i])
            {
                usedCorrect[i] = true;
                return "misplaced";
            }
        }
        return "absent";
    });

    return matchArray
}

function changeStyles(inputBoxes, matchArray) 
{
    const inputWrappers = document.querySelectorAll(".inputsContainer.active .inputWrapper");
    const parentDiv = inputWrappers[0].parentElement;
    const nextDiv = parentDiv.nextElementSibling;

    // Mudando as classes dos elementos dos inputs/wrappers.
    inputBoxes.forEach((inputBox, index) => 
    {
        const status = matchArray[index];
        inputWrappers[index].classList.add(status);
        inputBox.disabled = true;
    });

    // Mudando as classes da div pai dos inputs/wrappers.
    parentDiv.classList.replace("active", "used");

    if (didWin(inputWrappers)) 
    {
        showMessage("Você ganhou. Parabéns!")
        showPlayAgain();
    } 
    else if (nextDiv) // Verifica se a próxima div existe.
    { 
        nextDiv.classList.replace("waiting", "active");

        const nextDivInputBoxes = nextDiv.querySelectorAll(".termoInput");

        nextDivInputBoxes.forEach((inputBox) => inputBox.disabled = false);
        nextDivInputBoxes[0].focus();
    } 
    else 
    {
        showMessage("Não foi dessa vez =(")
        showPlayAgain();
    }

}

function didWin(inputWrappers) 
{
    const filteredInputs = Array.from(inputWrappers).filter(inputWrapper => inputWrapper.classList.contains("correct"))
    return filteredInputs.length === 5;
}

function showMessage(message,permanent=true)
{
    const h1 = document.querySelector("h1");

    h1.classList.add("sla");
    h1.style.setProperty("--before-content", `"${message}"`);

    if(!permanent)
        setTimeout(()=>
        {
            h1.classList.remove("sla");
        },2000)
}

function showPlayAgain()
{
    const playAgainBtn = document.querySelector("#playAgain-btn");
    playAgainBtn.style.visibility="visible"
    playAgainBtn.style.opacity="1";
}

function resetGame() 
{
    // Limpando os valores dos inputs.
    const allInputs = document.querySelectorAll(".termoInput");
    allInputs.forEach(input => {
        input.value = "";
    });

    // Removendo as classes das divs e dos input wrappers.
    const allInputWrappers = document.querySelectorAll(".inputWrapper");
    allInputWrappers.forEach(wrapper => {
        wrapper.classList.remove("correct", "misplaced", "absent");
    });

    const allContainers = document.querySelectorAll(".inputsContainer");
    allContainers.forEach(container => {
        container.classList.remove("active", "used"); // Botando todos como waiting.
        container.classList.add("waiting");
        
        // Desabilitando inputs marcados com waiting.
        if (container.classList.contains("waiting")) {
            const inputsInContainer = container.querySelectorAll(".termoInput");
            inputsInContainer.forEach(input => input.disabled = true);
        }
    });

    // Colocando a primeira div como ativa e reabilitando seus inputs.
    const firstContainer = document.querySelector(".inputsContainer");
    firstContainer.classList.replace("waiting","active");

    const inputsInFirstContainer = firstContainer.querySelectorAll(".termoInput");
    inputsInFirstContainer.forEach(input => input.disabled = false);

    firstContainer.querySelector(".termoInput").focus();

    // Tirando a mensagem de vitória.
    const h1 = document.querySelector("h1");
    h1.classList.remove("sla");
    h1.style.setProperty("--before-content", '""');

    // Tirando o botão de play again.
    const playAgainBtn = document.querySelector("#playAgain-btn");
    playAgainBtn.style.visibility = "hidden";
    playAgainBtn.style.opacity = "0";

    setWord();
}

function normalizeWord(word) {
    return word
      .replace(/ç/g, "c") // Troca ç por c.
      .normalize("NFD") // Decompõe caracteres compostos.
      .replace(/[\u0300-\u036f]/g, ""); // Remove os acentos.
}

function wordCorrector(misspelledWord, wordList) 
{
    const normalizedWord = normalizeWord(misspelledWord.toLowerCase());
  
    // Checa corrrespondências com cada palavra da wordlist também normalizada.
    for (let i = 0; i < wordList.length; i++) {
      const correctedWord = normalizeWord(wordList[i].toLowerCase());
      if (normalizedWord === correctedWord) {
        return wordList[i];
      }
    }
    return null;
}

async function loadWordList(wordListFileName) 
{
    const response = await fetch(`./assets/wordlists/${wordListFileName}.txt`);
    const responseText = await response.text();  // Aguarde a resolução da Promise
    const wordList = responseText.split("\n").map(word => word.trim()).filter(word => word.length > 0);
  
    return wordList;
}

function changeDisplayedCharacters(inputBoxes,typedWord,wordList)
{
    const correctWordWithAccentuation = wordCorrector(typedWord,wordList);
    const accentuatedArray = correctWordWithAccentuation ? correctWordWithAccentuation.split("") : [];

    if(accentuatedArray.length!==0)
        inputBoxes.forEach((inputBox,index)=> inputBox.value=accentuatedArray[index]);
}

async function pickRandomWord()
{
    wordList = await loadWordList("wordToGuess");
    const availableWords = arrayDifference(wordList,alreadyPlayedWords);
    const numberOfAvailableWords = availableWords.length;

    if(numberOfAvailableWords)
    {
        const pickedWord = availableWords[getRandomInteger(0,numberOfAvailableWords-1)];
        alreadyPlayedWords.push(pickedWord);
        return pickedWord;
    }
    else // Lidando com o caso em não há mais palavras disponíveis.  
    {
        alreadyPlayedWords.length=0; // Reseta o array, ou seja, começa a contar todas as palavras como não jogadas.
        return "trote"; // Designa uma palavra aleatória para não dar erro.
    }
}

function arrayDifference(array1, array2) {
    const onlyInArray1 = array1.filter(element => !array2.includes(element));

    const onlyInArray2 = array2.filter(element => !array1.includes(element));
    
    return onlyInArray1.concat(onlyInArray2);
}

function getRandomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function setWord()
{
    pickRandomWord(alreadyPlayedWords).then(pickedWord => {
        chosenWord=pickedWord;
        console.log(pickedWord);
    })
}
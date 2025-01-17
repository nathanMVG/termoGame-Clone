document.addEventListener("DOMContentLoaded", onLoad);
const mockWord = "feita";

function onLoad()
{
    window.addEventListener("keydown", onEnter);
    //Desabilitando as caixas de texto das divs não ativas.
    const inputBoxesToDisable = document.querySelectorAll(".inputsContainer:not(.active) .termoInput");
    inputBoxesToDisable.forEach((inputBox)=>inputBox.disabled=true)
}

function onEnter(event)
{
    const inputBoxes = document.querySelectorAll(".inputsContainer.active .termoInput ");

    const matchArray = verifyWord(inputBoxes,mockWord)

    if (event.key === "Enter" && isAllFilled(inputBoxes))
    {
        changeStyles(inputBoxes,matchArray);
    }
}

function isAllFilled(inputBoxes)
{
    const filtered = Array.from(inputBoxes).filter((inputBox)=>inputBox.value.length === 0)

    if(filtered.length === 0)
        return true;

    return false;
}

function verifyWord(inputBoxes, correctWord) {

    const inputLetters = Array.from(inputBoxes).map(input => input.value.toLowerCase());
    const correctLetters = correctWord.toLowerCase().split("");

    const usedIndexes = [];

    const matchArray = inputLetters.map((letter, index) => 
        {
            if (letter === correctLetters[index]) 
            {
                usedIndexes.push(index); // Marca índice como usado.
                return "correct";
            }
    
            const misplacedIndex = correctLetters.findIndex((l, i) => l === letter && !usedIndexes.includes(i));
    
            if (misplacedIndex !== -1)
            {
                usedIndexes.push(misplacedIndex); // Marca índice como usado.
                return "misplaced";
            }
            return "absent";
        });

    return matchArray;
}

function changeStyles(inputBoxes, matchArray) {
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

    // Mudando as classes da div pai dos inputs/wrappers
    parentDiv.classList.replace("active", "used");

    if (didWin(inputWrappers)) 
    {
        // WIN LOGIC
    } 
    else if (nextDiv) // Verifique se a próxima div existe.
    { 
        nextDiv.classList.replace("waiting", "active");

        const nextDivInputBoxes = nextDiv.querySelectorAll(".termoInput");

        nextDivInputBoxes.forEach((inputBox) => inputBox.disabled = false);
        nextDivInputBoxes[0].focus();
    } 
    else 
    {
        // LOSE LOGIC
    }
}

function didWin(inputWrappers) {
    const filteredInputs = Array.from(inputWrappers).filter(inputWrapper => inputWrapper.classList.contains("correct"))
    return filteredInputs.length === 5;
}
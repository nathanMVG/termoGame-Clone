document.addEventListener("DOMContentLoaded", onLoad);
let contador = 0;
const mockWord = "mutar";

function onLoad()
{
    window.addEventListener("keydown", onEnter);
}

function onEnter(event)
{
    const main = document.querySelector("main");
    const divs = main.querySelectorAll(".inputsContainer");
    const inputBoxes = divs[contador].querySelectorAll(".termoInput"); //Inputs da div de índice=contador.

    const matchArray = verifyWord(inputBoxes,mockWord)
    
    if (event.key === "Enter" && isAllFilled(inputBoxes))
    {
        changeStyles(inputBoxes,matchArray);
        contador++;  
        divs[contador].querySelectorAll('.termoInput')[0].focus(); // Bota foco no primeiro input da próxima linha.
    }
}

function isAllFilled(inputBoxes)
{
    const filtered = Array.from(inputBoxes).filter((inputBox)=>inputBox.value.length === 0)

    if(filtered.length === 0)
        return true;

    return false;
}

function verifyWord(inputBoxes,correctWord)
{
    const inputBoxesLettersArray = Array.from(inputBoxes).map(inputBox => inputBox.value.toLowerCase());
    const correctWordLettersArray = correctWord.toLowerCase().split("");
    
    const matchArray = inputBoxesLettersArray.map((letter, index) => 
        {
            if (letter === correctWordLettersArray[index]) 
                return "correct";
            else if (correctWordLettersArray.includes(letter)) 
                return "misplaced";
            else 
                return "absent";
        })

    return matchArray;
}

function changeStyles(inputBoxes, matchArray) 
{
    const main = document.querySelector("main");
    const divs = main.querySelectorAll(".inputsContainer");
    const inputWrappers = divs[contador].querySelectorAll(".inputWrapper");

    const statusStyles = {
        correct: "correctStyle",
        misplaced: "misplacedStyle",
        absent: "absentStyle"
    };

    inputBoxes.forEach((inputBox, index) => 
    {
        const status = matchArray[index];
        inputWrappers[index].classList.add(statusStyles[status]);
        inputBox.style.backgroundColor = "transparent";
        inputBox.disabled = true;
    });
}

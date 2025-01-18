document.addEventListener("DOMContentLoaded", onLoad);
const mockWord = "ondas";

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

function verifyWord(inputBoxes, correctWord)
{

    const inputLetters = Array.from(inputBoxes).map(input => input.value.toLowerCase());
    const correctLetters = correctWord.toLowerCase().split("");

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
        showMessage("Você ganhou. Parabéns!")
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
        showMessage("Não foi dessa vez =(")
    }
}

function didWin(inputWrappers) {
    const filteredInputs = Array.from(inputWrappers).filter(inputWrapper => inputWrapper.classList.contains("correct"))
    return filteredInputs.length === 5;
}

function showMessage(message,permanent=true)
{
    const h1 = document.querySelector("h1");

    h1.classList.add("sla");
    h1.style.setProperty('--before-content', `"${message}"`);

    if(!permanent)
        setTimeout(()=>
        {
            h1.classList.remove("sla");
        },2000)
}
document.addEventListener("DOMContentLoaded", onLoad);
const mockWord = "ondas";

function onLoad()
{
    window.addEventListener("keydown", onEnter);
    //Desabilitando as caixas de texto das divs não ativas.
    const inputBoxesToDisable = document.querySelectorAll(".inputsContainer:not(.active) .termoInput");
    inputBoxesToDisable.forEach((inputBox)=>inputBox.disabled=true)

    const playAgainBtn = document.querySelector("#playAgain-btn");
    playAgainBtn.addEventListener("click",resetGame)
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

    // Mudando as classes da div pai dos inputs/wrappers
    parentDiv.classList.replace("active", "used");

    if (didWin(inputWrappers)) 
    {
        showMessage("Você ganhou. Parabéns!")
        showPlayAgain();
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
    h1.style.setProperty('--before-content', `"${message}"`);

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
        input.value = '';
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
    h1.style.setProperty('--before-content', '""');

    // Tirando o botão de play again.
    const playAgainBtn = document.querySelector("#playAgain-btn");
    playAgainBtn.style.visibility = "hidden";
    playAgainBtn.style.opacity = "0";
}
document.addEventListener("DOMContentLoaded", onLoad);
const mockWord = "mutar";

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
    const inputWrappers = document.querySelectorAll(".inputsContainer.active .inputWrapper")
    const parentDiv = inputWrappers[0].parentElement;
    const nextDiv = parentDiv.nextElementSibling;
    const nextDivInputBoxes = nextDiv.querySelectorAll(".termoInput");

    parentDiv.classList.replace("active","used");
    nextDiv.classList.replace("waiting","active")
    nextDivInputBoxes.forEach((inputBox) => inputBox.disabled=false);
    nextDivInputBoxes[0].focus();

    inputBoxes.forEach((inputBox, index) => 
    {
        const status = matchArray[index];

        inputWrappers[index].classList.add(status);
        inputBox.disabled = true;
    });
}

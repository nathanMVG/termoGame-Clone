document.addEventListener("DOMContentLoaded", onLoad);
const mockWord = "lince";

function onLoad(event)
{
    const inputBoxes = document.querySelectorAll(".termoInput");
    window.addEventListener("keydown", (event) => onEnter(event,inputBoxes));
}

function onEnter(event,inputBoxes)
{
    if (event.key === "Enter" && isAllFilled(inputBoxes))
        console.log(verifyWord(inputBoxes,mockWord));
}

function isAllFilled(inputBoxes){
    const filtered = Array.from(inputBoxes).filter((inputBox)=>inputBox.value.length === 0)

    if(filtered.length === 0)
        return true;

    return false;
}

function verifyWord(inputBoxes,correctWord)
{
    const inputBoxesLettersArray = Array.from(inputBoxes).map(inputBox => inputBox.value.toLowerCase());
    const correctWordLettersArray = correctWord.toLowerCase().split("");
    
    const matchArray = inputBoxesLettersArray.map((letter,index) => letter === correctWordLettersArray[index])

    return matchArray;
}
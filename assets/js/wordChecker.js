document.addEventListener("DOMContentLoaded", onLoad);
const mockWord = "lince";

function onLoad()
{
    const inputBoxes = document.querySelectorAll("#a .termoInput");
    window.addEventListener("keydown", (event) => onEnter(event,inputBoxes));
}

function onEnter(event,inputBoxes)
{
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

function changeStyles(inputBoxes, matchArray) {
    const inputWrappers = document.querySelectorAll(".inputWrapper");

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

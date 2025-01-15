document.addEventListener("DOMContentLoaded", onLoad);

function onLoad(event) {
    const inputBoxes = document.querySelectorAll(".termoInput");

    inputBoxes.forEach((inputBox, index) => 
    {
        inputBox.addEventListener("input", (event) => goToNextInput(event, inputBoxes));
        inputBox.addEventListener("input", onLetterSubstitution)
        inputBox.addEventListener("focus", moveCursorToEnd)
        inputBox.addEventListener("keydown", (event) => onBackspace(event, inputBoxes, index));
        inputBox.addEventListener("keydown", pressedKeyValidator);
    });
}
// Move o foco para um input LIVRE ao digitar uma letra.
function goToNextInput(event, inputBoxes) 
{
    const currentInput = event.target;

    if (currentInput.value.length === 1) {
        const nextInput = Array.from(inputBoxes).find((inputBoxes) => inputBoxes.value === "");

        if (nextInput)
            nextInput.focus();
        else // Se for undefined está na última caixa e tira o foco dela.
            currentInput.blur();
    }
}

// Lida com a entrada de uma nova letra em um input já preenchido (SUBSTITUINDO A ANTIGA PELA DIGITADA).
function onLetterSubstitution(event) 
{
    const emitter = event.target;
    
    if (emitter.value.length > 1) 
    {
        emitter.value = emitter.value.charAt(emitter.value.length - 1);
        emitter.blur();
    }
}

/* Garante que independente da posição do clique do usuário no input a posição do cursor 
de digitação vá pro final (DEPOIS DA LETRA). Serve para garantir o uso adequado do backspace */
function moveCursorToEnd(event) 
{
    const emitter = event.target;

    // Delay para garantir o posicionamento correto do cursor.
    setTimeout(() => 
    {
        emitter.setSelectionRange(1,1);
    }, 0);
}

// Move o foco para o input anterior ao apertar backspace.
function onBackspace(event, inputBoxes, index) 
{
    const currentInput = inputBoxes[index];

    if (event.key === "Backspace" && currentInput.value === "")
    {
        if (index > 0) 
            inputBoxes[index - 1].focus();
    }
}

// Permite apenas LETRAS maiúsculas e minúsculas e teclas de funcionalidade.
function pressedKeyValidator(event)
{
    const key = event.key;
    //Se não corresponder ao padrão (letras maiúscula e minúscula) E não for tecla de funcionalidade ele não digita.
    if (!/^[a-zA-Z]$/.test(key) && !['Backspace', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(key))
      event.preventDefault();
}
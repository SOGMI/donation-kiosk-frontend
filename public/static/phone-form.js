let phoneInput = document.getElementById("customerPhoneNumber");
// let numberPadInputs = document.querySelectorAll(".numberKeypad .kNumber")
// let deleteIcon = document.querySelector("#deleteIcon")

phoneInput.addEventListener("keyup", function(){
    checkKeypad(phoneInput.value.length)
})

window.addEventListener("touchstart", function(){
    checkKeypad(phoneInput.value.length)
})

function checkKeypad(inputLength){
    let keypadFakeBtn = document.querySelector("#keypadFake")
    let keypadSubmitBtn = document.querySelector("#keypadSubmit")
    
    if(inputLength === 10){
        keypadFakeBtn.classList.add("is-hidden");
        keypadSubmitBtn.classList.remove("is-hidden");    
    } else {
        keypadFakeBtn.classList.remove("is-hidden");
        keypadSubmitBtn.classList.add("is-hidden");    
    }
}

// deleteIcon.addEventListener("click", function(){
//     deleteNumber();
// })

// for(let i = 0; i < numberPadInputs.length; i++){
//     numberPadInputs[i].addEventListener("click", function(){
//         numberPadInput(this);
//     })
// }

// function numberPadInput(container){
//     let digit = Number(container.innerHTML)
//     if(phoneInput.value.length < 10){
//         phoneInput.value += digit;
//     }
//     checkKeypad(phoneInput.value.length);
//     displayNumber();
// }



// function deleteNumber(){
//     let number = phoneInput.value;
//     number = number.slice(0, -1)
//     phoneInput.value = number;
//     checkKeypad(phoneInput.value.length);
//     displayNumber();
// }

// function displayNumber(){
//     let display = document.getElementById("displayPhoneNumber")
//     display.innerHTML = phoneInput.value
// }
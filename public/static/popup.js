let popups = document.querySelectorAll(".popupContainer")
let closePopups = document.querySelectorAll(".popupContainer .closePopup")

for(let i = 0; i < closePopups.length; i++){
    closePopups[i].addEventListener("click", function(){
        closeAllPopups();
    })
}

function closeAllPopups(){
    for(let i = 0; i < popups.length; i++){
        popups[i].classList.remove("active")
    }
}

function openPopup(id){
    document.getElementById(id).classList.add("active")
}
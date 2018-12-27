// let request = require("request")

// let customer = {};

// function Customer(squareId, stripeId, firstName, lastName, emailAddress, phoneNumber) {
//     this.squareId = squareId;
//     this.stripeId = stripeId;
//     this.firstName = firstName;
//     this.lastName = lastName;
//     this.emailAddress = emailAddress;
//     this.phoneNumber = phoneNumber;
// };

// // declare all app screens
// let allScreens = document.querySelectorAll(".appScreen");
// let welcomeScreen = document.querySelector("#welcomeScreen");
// let phoneScreen = document.querySelector("#phoneScreen")

// // prevent defaults for all form submissions
// let forms = document.querySelectorAll("form")
// for(let i = 0; i < forms.length; i++){
//     forms[i].addEventListener("submit", function(event){
//         event.preventDefault();
//     })
// }

// welcomeScreen.addEventListener("click", function(){
//     getPhone();
// });


// function hideScreens(){
//     for(let i = 0; i < allScreens.length; i++){
//         // the class "currentScreen is used to show the current screen"
//         allScreens[i].classList.remove("currentScreen")
//     };
// };

// function getPhone(){
//     hideScreens();
//     phoneScreen.classList.add("currentScreen")
// }

// let phoneForm = document.getElementById("phoneNumberForm")

// phoneForm.addEventListener("submit", function(){
//     let customerPhoneNumber = document.querySelector("#customerPhoneNumber").value;
//     customer.phoneNumber = customerPhoneNumber;
//     request('http://localhost:8000/customers/search', {json: true}, (err, res, body) => {
//         if (err) {return console.log(err); }
//         console.log(body)
//     });
// });


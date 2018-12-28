
const request = require("request");
const serverBaseUrl = 'https://kiosk-app-v1.sogmi.net'
const appid = 'sq0idp-V9fXKuFNDTqGuiN4rAcThQ'

// cuurent customer object
let currentCust = {}
// index of current customer in customerList used for updating a customers info
let currentCustIndex;
// local customer list
let customerList = [];
let customerExists = false
let recurringDonation = false

// declare all app screens
let allScreens = document.querySelectorAll(".appScreen");
let welcomeScreen = document.querySelector("#welcomeScreen");
let phoneScreen = document.querySelector("#phoneScreen");
let newCustomerScreen = document.querySelector("#newCustomerScreen");
let updateInfoScreen = document.querySelector("#updateCustomerScreen")
let confirmIndentityScreen = document.querySelector("#confirmIdentityScreen")
let errorScreen = document.querySelector("#errorScreen")
let chooseDonationType = document.querySelector("#chooseDonationType")
let chooseDonationAmount = document.querySelector("#chooseDonationAmount")

/////// General Buttons ////////
let resetButtons = document.querySelectorAll(".appResetButton")
let updateInfoButtons = document.querySelectorAll(".updateInfoButton");

// refresh page whenever clicking a "reset button"
for(let i = 0; i < resetButtons.length; i++){
    resetButtons[i].addEventListener("click", function(){
        reset();
    })
}

// show update info screen whenever clicking an "update info button"
for(let i=0; i < updateInfoButtons.length[i]; i++){
    updateInfoButtons[i].addEventListener("click", function(){
        showUpdateInfo();
    })
}


// prevent defaults for all form submissions
let forms = document.querySelectorAll("form")
for(let i = 0; i < forms.length; i++){
    forms[i].addEventListener("submit", function(event){
        event.preventDefault();
    })
}

///// SCREEN SWITCHING ///////

// general hide screen / show screen function
function hideScreens(classToShow){
    for(let i = 0; i < allScreens.length; i++){
        // the class "currentScreen is used to show the current screen"
        allScreens[i].classList.add("transitioning");
        setTimeout(function(){
            allScreens[i].classList.remove("currentScreen");
            if(classToShow){
                classToShow.classList.add("currentScreen")
            }
            setTimeout(function(){
                allScreens[i].classList.remove("transitioning")
            }, 50)
        }, 300);
    };
};

welcomeScreen.addEventListener("click", function(){
    showPhoneScreen();
});

function showWelcomeScreen(){
    hideScreens(welcomeScreen);
}

function loadingAnimation() {
    hideScreens(document.getElementById("loadingScreen"));
}

function showPhoneScreen(){
    hideScreens(phoneScreen);
}

function showNewCustomerScreen(phone){
    hideScreens(newCustomerScreen);
    document.querySelector("#newCustomerPhoneNumber").innerHTML = phone
}

function showConfirmInformation(person){
    hideScreens(confirmIndentityScreen);
    document.querySelector("#customerInfo").innerHTML = person.firstName + " " + person.lastName;
    let confirmIdentityButton = document.querySelector("#confirmIdentityButton");
    let updateInfoButton = document.querySelector(".updateInfoButton")
    
    //remove event listeners
    confirmIdentityButton.removeEventListener("click", function(){
        currentCust = person
        showChooseDonationType()
    })
    updateInfoButton.removeEventListener("click", function(){
        showUpdateInfo(person)
    })

    //add event listeners
    confirmIdentityButton.addEventListener("click", function(){
        currentCust = person
        showChooseDonationType()
    })
    updateInfoButton.addEventListener("click", function(){
        showUpdateInfo(person)
    })
}

function showUpdateInfo(person){
    hideScreens(updateInfoScreen);
    let custPhone
    if(person.phoneNumber){
        custPhone = person.phoneNumber.replace(" ", "");
        custPhone = custPhone.replace("-", "");
        custPhone = custPhone.replace("(", "");
        custPhone = custPhone.replace(")", "");
    }

    let firstName = document.getElementById("updateFirstName")
    let lastName = document.getElementById("updateLastName")
    let email = document.getElementById("updateEmailAddress")
    let phone = document.getElementById("updatePhoneNumber")

    firstName.value = person.firstName;
    lastName.value = person.lastName;
    email.value = person.emailAddress;
    phone.value = Number(custPhone);

    let updateCustomerForm = document.querySelector("#updateCustomerForm");
    updateCustomerForm.addEventListener("submit", function(){
        console.log(`updating customer: ${person.squareId}\nname: ${firstName.value} ${lastName.value}`)
        updateCustomer(person.squareId, firstName.value, lastName.value, email.value, phone.value)
    })
}

function showErrorScreen(error){
    hideScreens(errorScreen);
    if(error){
        document.getElementById("errorMessage").innerHTML = error
    }
}

// donation option screen
let donationOptions = document.querySelectorAll(".donationOptions .card")
for(let i = 0; i < donationOptions.length; i++){
    let option = donationOptions[i].getAttribute("data-option")
    donationOptions[i].addEventListener("click", function(){
        showChooseDonationAmount(option)
    })
}

function showChooseDonationType(){
    hideScreens(chooseDonationType);
    console.log(currentCust)
    displayCustInformation()
}

let amountButtons = document.querySelectorAll(".donationAmountRadio input")
console.log(amountButtons)
for(let i = 0; i < amountButtons.length; i++){
    amountButtons[i].addEventListener("click", function(){
        setDonationAmount(amountButtons[i].value)
    })
}

function showChooseDonationAmount(type) {
    hideScreens(chooseDonationAmount);
    switch(type) {
        case 'one-time':
            console.log(type)
            break;
        case 'recurring':
            console.log(type)
            break;
    }
}

function displayCustInformation(){
    let custName = document.querySelectorAll(".currentCustomerInformation .custName");
    let custEmail = document.querySelectorAll(".currentCustomerInformation .custEmail");
    let custPhone = document.querySelectorAll(".currentCustomerInformation .custPhone")

    for(let i = 0; i < custName.length; i++) {
        custName[i].innerHTML = `${currentCust.firstName} ${currentCust.lastName}`
    }
    for(let i = 0; i < custEmail.length; i++) {
        custEmail[i].innerHTML = `${currentCust.emailAddress}`
    }
    for(let i = 0; i < custPhone.length; i++) {
        custPhone[i].innerHTML = `${currentCust.phoneNumber}`;
    }
}

function reset(){
    location.reload();
}


////// FORMS ///////

// phone search
let phoneForm = document.getElementById("phoneNumberForm")

phoneForm.addEventListener("submit", function(){
    let customerPhoneNumber = document.querySelector("#customerPhoneNumber").value;
    loadingAnimation();
    return new Promise(function(resolve, reject){
        resolve(searchByPhone(customerPhoneNumber));
    }).then(function(){
        if(customerExists){
            showConfirmInformation(currentCust);
        }
        else {
            showNewCustomerScreen(customerPhoneNumber)
        }
    })
});

function searchByPhone(phone) {
    for(let i = 0; i < customerList.length; i++){
        if(customerList[i].phoneNumber){
            cPhone = customerList[i].phoneNumber
            cPhone = cPhone.replace("(", "");
            cPhone = cPhone.replace(")", "");
            cPhone = cPhone.replace("-", "");
            cPhone = cPhone.replace(" ", "");
            if(Number(cPhone) === Number(phone)){
                customerExists = true
                currentCust = customerList[i]
                currentCustIndex = i
                break;
            }    
        }
    }
    if (customerExists){
        return currentCust
    } else {
        return false
    }
}

// confirm identity

// set donation form
let oneTimeForm = document.querySelector("#oneTimePaymentForm")
let customAmountInput = document.querySelector("#customAmountInput")

let customAmount = document.querySelector("#customAmount");
let customDonation = false


customAmountInput.addEventListener("keyup", function(){
    donationAmount.value = customAmountInput.value
})
customAmountInput.addEventListener("keydown", function(){
    donationAmount.value = customAmountInput.value
})

oneTimeForm.addEventListener("submit", function(){
    oneTimePayment(donationAmount.value, currentCust.squareId)
})

function setDonationAmount(amount){
    let donationAmount = document.querySelector("#donationAmount")
    switch(amount) {
        case 'custom':
            customAmount.classList.remove("is-hidden")
            customDonation = true
            break;
        default:
            customAmount.classList.add("is-hidden")
            donationAmount.value = Number(amount)
            customDonation = false
            break;
    }

}

// process one time payment
function oneTimePayment(donation, squareId){
    
    let callbackUrl = 'https://kiosk.sogmi.org'
    let applicationId = appid
    let currencyCode = "USD"
    let sdkVersion = "v2.0"
    let transactionTotal
    if (customDonation){
        transactionTotal = Number(customAmountInput.value) * 100
    }
    else {
        transactionTotal = donation * 100
    }
    let tenderTypes = `com.squareup.pos.TENDER_CARD, com.squareup.pos.TENDER_CARD_ON_FILE`

    var posUrl =
    "intent://squareCheckout/#Intent;" +
    "action=com.squareup.pos.action.CHARGE;" +
    "package=com.squareup;" +
    "S.com.squareup.pos.WEB_CALLBACK_URI=" + callbackUrl + ";" +
    "S.com.squareup.pos.CLIENT_ID=" + applicationId + ";" +
    "S.com.squareup.pos.API_VERSION=" + sdkVersion + ";" +
    "i.com.squareup.pos.TOTAL_AMOUNT=" + transactionTotal + ";" +
    "S.com.squareup.pos.CURRENCY_CODE=" + currencyCode + ";" +
    "S.com.squareup.pos.TENDER_TYPES=" + tenderTypes + ";" +
    "end";

    console.log(posUrl)
    window.open(posUrl)
}

// new customer
let newCustForm = document.querySelector("#newCustomerForm")
newCustForm.addEventListener("submit", function(){
    let cust = {}
    let isPassing = false

    cust.phoneNumber = document.querySelector("#newCustomerPhoneNumber").innerHTML
    cust.emailAddress = document.querySelector("#customerEmailAddress").value;
    cust.firstName = document.querySelector("#customerFirstName").value;
    cust.lastName = document.querySelector("#customerLastName").value;
    
    new Promise(function(resolve, reject){
        loadingAnimation();
        request.post(`${serverBaseUrl}/customers/create`, {form: 
            {
                firstName: cust.firstName,
                lastName: cust.lastName,
                email: cust.emailAddress,
                phone: cust.phoneNumber
            }
        }, function (err, res, body) {
                if (err) {
                    reject(err)
                }
                else {
                    isPassing = true
                    resolve(body)
                }
            }
        )
    }).then(function(response){
        if(isPassing) {
            data = JSON.parse(response);
            currentCust = {
                squareId: data.customer.id,
                firstName: data.customer.given_name,
                lastName: data.customer.family_name,
                emailAddress: data.customer.email_address,
                phoneNumber: data.customer.phone_number
            }
            showChooseDonationType()
        }
        else {
            showErrorScreen(response)
        }
    })
})

//update customer
function updateCustomer(id, firstName, lastName, email, phone) {
    let isPassing = false
    return new Promise(function(resolve, reject){
        loadingAnimation();
        request.post(`${serverBaseUrl}/customers/update/`, {form:{
            squareId: id,
            firstName: firstName,
            lastName: lastName,
            emailAddress: email,
            phoneNumber: phone
        }},
        function(err, res, body){
            if(err){
                reject(err)
            }
            else{
                isPassing = true;
                resolve(body);
            }
        })
    }).then(function(response){
        if(isPassing){
            data = JSON.parse(response);
            let cust = {
                squareId: data.customer.id,
                firstName: data.customer.given_name,
                lastName: data.customer.family_name,
                emailAddress: data.customer.email_address,
                phoneNumber: data.customer.phone_number
            }
            currentCust = {}
            showConfirmInformation(cust)
        }
        else {
            showErrorScreen(response)
        }
    })
}


/////// INITIALIZE APP /////////
function init(){
    getCustomerList();
    setTimeout(function(){
        showWelcomeScreen();
        console.log(customerList)
    }, 1000)
}
// fetches customers from Square API //
function getCustomerList(cursor) {
    if(cursor){
        request(`${serverBaseUrl}/customers/search?cursor=${cursor}`, {json: true}, function(error, response, body){
            if(error) {
                showErrorScreen(error)
            }
            else {
                pushCustomers(body.customers, body.cursor);
            }
        })
    }
    else {
        request(`${serverBaseUrl}/customers/search`, {json: true}, function(error, response, body){
            if(error) {
                showErrorScreen(error)
            }
            else {
                pushCustomers(body.customers, body.cursor);
            }
        })
    }
}
// adds customer to local list
function pushCustomers(bodyCust, bodyCursor) {
    new Promise(function(resolve, reject) {
        if(bodyCust) {
            let customers = bodyCust
            for(let i = 0; i < customers.length; i++) {
                cust = {
                    firstName: customers[i].given_name,
                    lastName: customers[i].family_name,
                    phoneNumber: customers[i].phone_number,
                    emailAddress: customers[i].email_address,
                    squareId: customers[i].id
                }
                customerList.push(cust)
                resolve(cust)
            }
        }
    }).then(function(x){
        if(bodyCursor) {
            getCustomerList(bodyCursor)
        }
        else {
            return
        }    
    })
}

init();
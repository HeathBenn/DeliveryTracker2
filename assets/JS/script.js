
const address = document.getElementById('address');
const deliveryFee = document.getElementById('deliveryFee');
const orderType = document.getElementById('orderType');
const cashTip = document.getElementById('cashTip');
const gratuity = document.getElementById('gratuity');
const orderTotal = document.getElementById('orderTotal');
const submitButton = document.getElementById('submit');
const deleteButton = document.getElementById('deleteEntry');
const editButton = document.getElementById('editEntry');
const endButton = document.getElementById('endNight');
const table = document.getElementById('deliveries');
const partialCash = document.getElementById('partialCash');
const numberPad = document.getElementById('numberPad');
const cashBox = document.getElementById('cashTip');
const partCashBox = document.getElementById('partialCash');

//Holds all of the delivery objects
const deliveries = [];
//signifies the delivery stop.  Increments with each delivery object
let stopNumber = 1;
//This stores the "value" from the sweet alert allowing it to be used in the result
let inputValue = '';
//This is a switch to allow the number pad to work with gratuity input and order input.
// 1 is gratuity, 2 is orderTotal, and 0 is off
let isNumberInput = 0;

//This stores the delivery object and populates the list of deliveries
submitButton.onclick = function() {submitDelivery()};

//Currently only resets table
endButton.onclick  = function() {endNight()};

//calls the function that edits an entry
editButton.onclick = function() {editEntry()};

//calls the function that deletes an entry
deleteButton.onclick = function() {deleteEntry()};

//Event listener for the order total text input.  Will display numberPad for easy input
orderTotal.addEventListener("focus", () => {
    numberPad.style.display = "block";
    isNumberInput = 2;
});

//Event listener for the gratuity text input.  Will display numberPad for easy input
gratuity.addEventListener("focus", () => {
    numberPad.style.display = "block";
    isNumberInput = 1;
});

//Event listener for numberPad. It listens for the buttons to be pushed and populates the correct input.
numberPad.addEventListener("click", (event) => {
    if (event.target.tagName === "BUTTON"){
        if (event.target.value === "done"){
            isNumberInput = 0;
        }

        if (isNumberInput === 1){
            if (event.target.value === 'delete'){
                gratuity.value = gratuity.value.substr(0, gratuity.value.length -1);
            }
            else {
                gratuity.value += event.target.textContent;
            }
        }
        else if (isNumberInput === 2){
            if(event.target.value === 'delete'){
                orderTotal.value = orderTotal.value.substr(0, orderTotal.value.length -1);
            }
            else {
                orderTotal.value += event.target.textContent;
            }
        }
    }
});

//Event listener for when the cash tip checkbox is checked
cashBox.addEventListener('change', function(){
    if (this.checked){
        console.log("cashBox is checked");
    }
    else{
        console.log('cashbox is not checked');
    }
});

//Event listener for when the partial cash tip checkbox is checked
partCashBox.addEventListener('change', function(){
    if (this.checked){
        console.log("partialCashBox is checked");
    }
    else{
        console.log('partialCashbox is not checked');
    }
});

//This function is called whenever the table needs to be repopulated
function populate() {
    stopNumber = 1;
    resetTable();
    for (let i = 0; i < deliveries.length; i++){
        let template = `
        <tr>
        <td>${stopNumber}</td>
        <td>${deliveries[i].address}</td>
        <td>${deliveries[i].orderType}</td>
        <td>${deliveries[i].orderTotal}</td>
        <td>${deliveries[i].gratuity}</td>
        <td>${deliveries[i].deliveryFee}</td>
        </tr>
        `
        table.innerHTML += template;
        stopNumber ++;
        console.log('deliveries length: ' + deliveries.length);
    }
}

//Gets Hour Minute and AM/PM Not used at moment, 
//other than to store in array object
function timeStamp() {
    const time = new Date();
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const meridiem = hours >= 12 ? 'PM' : 'AM';
    const formatHours = hours % 12 || 12;
    return `${formatHours}:${minutes.toString().padStart(2,'0')} ${meridiem}`;
}


//Ensures correct format for dollar amounts.  Not used at the moment
const formatter = new Intl.NumberFormat('en-US',{
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

//Resets the table of deliveries
function resetTable(){
    table.innerHTML = `
        <tr>
            <th>No.</th>
            <th>Street</th>
            <th>Type</th>
            <th>Total</th>
            <th>Tip</th>
            <th>Fee</th>
        </tr>
    `
}


//Delivery Object Constructor
function ConstructDelivery(address, type, total, tip, fee) {
    this.stopNumber = stopNumber;
    this.timeLog = timeStamp();
    this.address = address;
    this.orderType = type;
    this.orderTotal = total;
    this.gratuity = tip;
    this.deliveryFee = fee;
    this.delivery = function(){
        deliveries.push(this);
    };
    /*this.populate = function(){
        let template = `
        <tr>
        <td>${stopNumber}</td>
        <td>${this.address}</td>
        <td>${this.orderType}</td>
        <td>${this.orderTotal}</td>
        <td>${this.gratuity}</td>
        <td>${this.deliveryFee}</td>
        </tr>
        `
        table.innerHTML += template;
        stopNumber += 1;
    };*/
}

//Submits the delivery info
function submitDelivery(){
    const newDelivery = new ConstructDelivery(address.value, orderType.value, orderTotal.value, gratuity.value, deliveryFee.value);
    newDelivery.delivery();
    /*resetTable();
    stopNumber = 1;
    for (let i = 0; i < deliveries.length; i++){
        deliveries[i].populate();
    }*/
    populate();
    console.log(deliveries);
    document.getElementById('deliveryForm').reset(); 
}

//currently only resets table
function endNight(){
    resetTable();
}

//currently only gives notification of the delivery you selected to edit
function editEntry(){
    if (deliveries.length > 0){
        Swal.fire({
            title: 'Please enter the number of the delivery to be edited.',
            input: 'text',
            inputLabel: 'Entry Number',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You forgot to enter the delivery Number';
                }
            }
        }).then((result) =>{
            if (result.isConfirmed){
                for (let i = 0; i < deliveries.length; i++){
                    if (deliveries[i].stopNumber == result.value){
                        Swal.fire({
                            title:'Is this the correct Delivery?',
                            icon: 'question',
                            showCancelButton: true,
                            html: `<p class="editAlert">
                                No: ${deliveries[i].stopNumber} 
                                Street: ${deliveries[i].address} 
                                Total: ${deliveries[i].orderTotal} 
                                Tip: ${deliveries[i].gratuity} 
                            </p>`
                        }).then((result) => {
                            if (!result.dismiss){
                                let editOption = "";
                                Swal.fire({
                                    title:'Which field would you like to edit?',
                                    input: 'select',
                                    inputOptions: {
                                        street: `Street Name: ${deliveries[i].address}`,
                                        type: `Order Type: ${deliveries[i].orderType}`,
                                        total: `Order Total: ${deliveries[i].orderTotal}`,
                                        tip: `Tip Amount: ${deliveries[i].gratuity}`,
                                        fee: `Fee Amount: ${deliveries[i].deliveryFee}`
                                    },
                                    inputPlaceholder: 'Select a field to edit',
                                    showCancelButton: true, 
                                }).then((result) => {
                                    switch (result.value){
                                        case 'street':

                                            Swal.fire ({
                                                title: 'Please enter the new address.',
                                                input: 'text', 
                                                inputLabel: 'Enter the changes to be made',
                                                showCancelButton: true,
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'Your forgot to enter your changes!';
                                                    }
                                                }
        
                                            }).then((result) => {
                                                deliveries[i].address = result.value;
                                                Swal.fire ({
                                                    title: 'Your changes have been made!'
                                                });
                                                populate();
                                            });
                                            break;

                                        case 'type':

                                            Swal.fire ({
                                                title: 'Please select the new delivery type.',
                                                input: 'select', 
                                                inputOptions: {
                                                    Cash: 'Cash',
                                                    CC: 'Phone CC',
                                                    Web: 'Online CC',
                                                },
                                                showCancelButton: true,
                                                inputPlaceholder: 'Delivery Types',
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'Your forgot to enter your changes!';
                                                    }
                                                }
                                            }).then((result) => {
                                                deliveries[i].orderType = result.value;
                                                Swal.fire ({
                                                    title: 'Your changes have been made!'
                                                });
                                                populate();
                                            });
                                            break;

                                        case 'total':
                                            
                                            Swal.fire ({
                                                title: 'Please enter the new total.',
                                                input: 'text', 
                                                inputLabel: 'Enter the changes to be made',
                                                showCancelButton: true,
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'Your forgot to enter your changes!';
                                                    }
                                                }
        
                                            }).then((result) => {
                                                deliveries[i].orderTotal = result.value;
                                                Swal.fire ({
                                                    title: 'Your changes have been made!'
                                                });
                                                populate();
                                            });
                                            break;
                                        case 'tip':
                                            Swal.fire ({
                                                title: 'Please enter the new tip amount.',
                                                input: 'text', 
                                                inputLabel: 'Enter the changes to be made',
                                                showCancelButton: true,
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'Your forgot to enter your changes!';
                                                    }
                                                }
        
                                            }).then((result) => {
                                                deliveries[i].gratuity = result.value;
                                                Swal.fire ({
                                                    title: 'Your changes have been made!'
                                                });
                                                populate();
                                            });
                                            break;
                                        case 'fee':
                                            Swal.fire ({
                                                title: 'Please select the new delivery fee.',
                                                input: 'select', 
                                                inputOptions: {
                                                    twoTwentyFive: '$2.25',
                                                    four: '$4.00',
                                                    five: '$5.00',
                                                    six: '$6.00',
                                                    seven: '$7.00',
                                                },
                                                showCancelButton: true,
                                                inputPlaceholder: 'Delivery Fees',
                                                inputValidator: (value) => {
                                                    if (!value) {
                                                        return 'Your forgot to enter your changes!';
                                                    }
                                                }
                                            }).then((result) => {

                                                if (result.value === 'twoTwentyFive'){
                                                    deliveries[i].deliveryFee = '2.25';
                                                }
                                                else if (result.value === 'four'){
                                                    deliveries[i].deliveryFee = '4.00';
                                                }
                                                else if (result.value === 'five'){
                                                    deliveries[i].deliveryFee = '5.00';
                                                }
                                                else if (result.value === 'six'){
                                                    deliveries[i].deliveryFee = '6.00';
                                                }
                                                else {
                                                    deliveries[i].deliveryFee = '7.00';
                                                }
                                                Swal.fire ({
                                                    title: 'Your changes have been made!'
                                                });
                                                populate();
                                            });
                                            break;
                                    }
                                });
                                
                            }
                        });
                    }
                }    
            }
        });
    }
    else {
        Swal.fire({
            title: '<p class="emptyNotification">You do not have any deliveries to edit!</p>'
        });
    }
    
}

function deleteEntry(){
    if (deliveries.length > 0){
        Swal.fire({
            title: 'Please enter the number of the delivery to be deleted.',
            input: 'text',
            inputLabel: 'Entry Number',
            showCancelButton: true,
            inputValidator: (value) => {
                if (!value) {
                    return 'You forgot to enter the delivery Number';
                }
                else {
                    inputValue = value;
                }
            }
        }).then((result) => {
            if(result.isConfirmed){
                if(inputValue > deliveries.length){
                    Swal.fire({
                        title: '<p class="emptyNotification">You do not have that many deliveries!</p>'
                    });
                }
                else {
                    for (let i = 0; i < deliveries.length; i++){
                        if (deliveries[i].stopNumber == result.value){
                            Swal.fire({
                                title:'Is this the correct Delivery?',
                                showCancelButton: true, 
                                confirmButtonText: 'Delete',
                                icon: 'question',
                                html: `<p class="editAlert">
                                    No: ${deliveries[i].stopNumber} 
                                    Street: ${deliveries[i].address} 
                                    Total: ${deliveries[i].orderTotal} 
                                    Tip: ${deliveries[i].gratuity} 
                                </p>`
                            }).then((result) => {
                                if (result.isConfirmed){
                                    deliveries.splice(deliveries[i], 1);
                                    stopNumber = 1;
                                    for(let i = 0; i < deliveries.length; i++){
                                        deliveries[i].stopNumber = stopNumber;
                                        i++;
                                    }
                                    populate();
                                }
                            });
                        }
                    }
                }
                inputValue = '';
            }
        });
    }
    else{
        Swal.fire({
            title: '<p class="emptyNotification">You do not have any deliveries to delete!</p>'
        });
    }
}


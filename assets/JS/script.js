
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


const deliveries = [];
let stopNumber = 1;
let inputValue = '';

//This stores the delivery object and populates the list of deliveries
submitButton.onclick = function() {submitDelivery()};

//Currently only resets table
endButton.onclick  = function() {endNight()};

//calls the function that edits an entry
editButton.onclick = function() {editEntry()};

//calls the function that deletes an entry
deleteButton.onclick = function() {deleteEntry()};

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


//Ensures correct format for dollar amounts
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
    this.populate = function(){
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
    };
}

//Submits the delivery info
function submitDelivery(){
    const newDelivery = new ConstructDelivery(address.value, orderType.value, orderTotal.value, gratuity.value, deliveryFee.value);
    newDelivery.delivery();
    resetTable();
    stopNumber = 1;
    for (let i = 0; i < deliveries.length; i++){
        deliveries[i].populate();
    }
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
                            html: `<p class="editAlert">
                                No: ${deliveries[i].stopNumber} 
                                Street: ${deliveries[i].address} 
                                Total: ${deliveries[i].orderTotal} 
                                Tip: ${deliveries[i].gratuity} 
                            </p>`
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
                                    resetTable();
                                    for (let i = 0; i < deliveries.length; i++){
                                        deliveries[i].populate();
                                    }
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
const orderItemArray = []
const orderarray = [];
const orderPriceArray = []

function orderBasket(itemName, itemPrice) {
  const item = {
    item: itemName,
    price: itemPrice
  }

  orderItemArray.push(item);
  console.log(orderItemArray)
  orderPriceArray.push(itemPrice);

  orderarray.push(itemName, itemPrice);
  console.log(orderarray)
  console.log(orderarray.length)

  let orderList = document.getElementById('orderList')


  const orderItem = document.createElement('li')
  orderItem.className = 'd-flex justify-content-between align-items-center'

  const orderItemPriceSpan = document.createElement('span')

  const orderItemName = document.createTextNode(itemName)

  const orderItemPrice = document.createTextNode(' $ ' + itemPrice)

  orderItemPriceSpan.className = 'text-danger'

  orderItemPriceSpan.appendChild(orderItemPrice)
  //  const orderItemPrice = document.createTextNode(itemPrice)


  orderItem.appendChild(orderItemName)
  //  orderItem.appendChild(orderItemPrice)

  orderItem.appendChild(orderItemPriceSpan)

  orderList.appendChild(orderItem)

  totalItems();
  totalCost();


}

function totalItems() {
  document.getElementById('totalItems').innerText = orderItemArray.length;



}
function sumOfArray(total, num) {
  return total + num;



}

function totalCost() {

  if (orderPriceArray.length === 0) {
    document.getElementById('totalCost').innerText = 0;
  } else {
    document.getElementById('totalCost').innerText = orderPriceArray.reduce(sumOfArray).toFixed(2)

  }
}


function clearOrderBasket() {
  let orderList = document.getElementById('orderList')
  orderList.innerHTML = '';
  orderItemArray.length = 0;
  orderPriceArray.length = 0;
  orderarray.length = 0;
  totalItems();
  totalCost();



}

document.getElementById('checkOutButton').addEventListener('click', checkOutListener)



function checkOutListener(e) {
  const customerName = document.getElementById('customerName').value

  fetch('barista', {
    method: 'post',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      'customer': customerName,
      'beverages': orderItemArray,
      'totalCost': orderPriceArray.reduce(sumOfArray).toFixed(2),
      'completed': "false"
    })
  })
    .then(response => {
      if (response.ok) return response.json()
    })
    .then(data => {
      console.log(data)
      window.location.reload(true)
    })

}
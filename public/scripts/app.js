// const { user_id } = require('../../server.js');
// const cookieParser = require('cookie-parser');

$(document).ready(function () {
  // console.log(user_id);
// console.log(req.session.user_id);
// $(() => {
//   $.ajax({
//     method: "GET",
//     url: "/api/users"
//   }).done((users) => {
//     for(user of users) {
//       $("<div>").text(user.name).appendTo($("body"));
//     }
//   });
// });
let checkoutSum = 0;
let userLoggedIn = false;
$('div.userError').hide();
$('div#checkoutTime').hide();




//returns full HTML structure a single menu item box
function createMenuElement(menuData) {
  // console.log(menuData.thumbnail_picture_url)
  return $(`
    <section id="menu${menuData.id}" class="menu_item ${menuData.category}">
      <div class="menu_item_img">
        <img class="menu_item_pictures" src="${menuData.thumbnail_picture_url}">
      </div>
      <div class="nameDescription">
        <h3 class="menu-item-name">${menuData.name}</h3>
        <p class="menu_item_description">
        ${menuData.description}
        </p>
      </div>
      <div class="menu-item-add">
      <form id="menuData${menuData.id}" class="menu-item-form">
      <h3 class="menu-item-price">$${menuData.price}</h3>
        <select name="${menuData.id}" placeholder="quantity" type="number" min="1" max="10">
          <option value="1">1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="4">4</option>
          <option value="5">5</option>
        </select>
        <button class="box-1" type="submit">
         <div class="btn btn-one">
           <span>Add To Order</span>
         </div>
        </button>
      </form>
      </div>
   </section>
    `)
  };

  //loop through each obj element in the array and add the returned HTML structure to the main container
  function renderMenu(menuData) {

    for (let i = 0; i < menuData.length; i++) {
      const element = menuData[i];

      const $item = createMenuElement(element);
      if ((i>0) && (menuData[i].category !== menuData[i-1].category)){
        if (menuData[i].category === 'Whites') {
          $('div.menu').append(`<h1 class="Drinks menuType">Drinks</h1>`);
        }
        $('div.menu').append(`<h1 class="${menuData[i].category} menuType">${menuData[i].category}</h1>`);
      }
      if (i === 0) {
        $('div.menu').append(`<h1 class="${menuData[i].category} menuType">${menuData[i].category}</h1>`);
      }

      $('div.menu').append($item);
    }

  }


  //ajax get request to server returns menu_items data and call rendermenu functiong with it
  function loadData() {
    $.ajax({
      url: "/api/menu",
      method: "GET",
    }).then((result) => {
      renderMenu(result.menu);
    }).catch((err) => {
      console.log(err);
    })
  };

  //initiates menu_items data loading on page load
  loadData();
  // console.log(isStarted);

  const startOrder = () => {
    // let isStarted = false;
    // if (isStarted === false) {
      console.log('startOrderAtLeastStarted:')
      $.ajax({
        url: "/api/orders",
        method: "POST",
      }).then((result) => {

        console.log('Order started, ID: ',result);
        return result;
      }).catch((err) => {
        console.log('startOrderERR:', err);
      })

    // }
    // isStarted = true;
  }

  // Object.keys(req.body)[0], req.body[Object.keys(req.body)[0]]

    const addToOrderElement = (quantity, itemDetails) => {
    return $(`
    <div class="menuItemsOrder" id="checkout${itemDetails.id}">
      <div>
      <h6 class="quantity">${quantity}</h6>
      <h6 class="nameOfFoodItem">${itemDetails.name}</h6>
      </div>
      <div>
      <h6 class="price">$${itemDetails.price}</h6>
      <form class="delete-checkout-form">
        <button class="deleteItem" id='delete${itemDetails.id}' type="submit"><i class="fas fa-backspace"></i></button>
      </form>
      </div>
    </div>
    `)
  }

  const addToOrder = (element) => {
    console.log('addtoOrder is called!')
    $('#checkoutAppendage').append(element);
  };
    // let forms = document.getElementsBy('.menu-item-form');




  $(document).on('submit', 'form.menu-item-form', function(event) {

    event.preventDefault();
    let data = $(this).serialize("");
    const text = decodeURIComponent(data);
    console.log("data", text)
    $.ajax({
      url: "/api/order",
      method: "POST",
      data: text
    }).then((quantity) => {
      console.log("YEAY:", quantity.addToOrder[0].menu_item_id);
      $.ajax({
        url: `/api/menu/${quantity.addToOrder[0].menu_item_id}`,
        method: 'GET'
      }).then((itemDetail) => {
        let quan = quantity.addToOrder[0].quantity;
        let itemDetails = itemDetail.menu[0];

        console.log('itemDetail:', itemDetails,'quantity:', quan);
        checkoutSum += (itemDetails.price * quan);
        console.log("checkoutSum", checkoutSum);
        addToOrder(addToOrderElement(quan, itemDetails));
        $('#checkoutSum').html(`Subtotal: $${checkoutSum}.00`);
      }).catch((err) => {
      console.log(err.message);
      })
    })
  })

  function removeFromCheckout(id) {
    $(`#checkout${id}`).remove();
  }
  $(document).on('submit', 'form.delete-checkout-form', function(event) {
      event.preventDefault();
      console.log("event", event);
      let itemToDelete = (event.target.parentElement.parentElement.id).substring(8);
      console.log("itemtodelete:",itemToDelete);
      removeFromCheckout(itemToDelete);
      console.log(event);
      let price = Number((event.target.parentNode.firstElementChild.innerText).substring(1));
      let quantity = Number((event.target.parentNode.parentElement.firstElementChild.children[0].innerText));
      console.log(price);
      $.ajax({
        url: `api/order/delete/${itemToDelete}`,
        method: "DELETE",
      }).then((res) => {
        console.log("itemtodelete:", res);
        checkoutSum -= (price * quantity);
       $('#checkoutSum').html(`Subtotal: $${checkoutSum}.00`);
      })
    })


//   $(document).on('submit','form.menu-item-form', function(event) {
//     console.log('STARTED AJAX',event);
//   event.preventDefault();
//   let data = $(this).Val();
//   $.ajax({
//     url: "/api/order",
//     method: "POST",
//   }).then((result) => {
//     console.log("YEAY:", result);
//   }).catch((err) => {
//     err
//   })
// })

  // const addToOrder = () => {

    // }

    //ajax request onClick for login button at top of page

    $(document).on('submit', 'form.login', function(event) {
      const data = $(this).serialize();//creates a text string in standard URL-encoded notation
      const text = decodeURIComponent(data.substring(7)); //decoded the urlencoded string
      console.log(text);
      if (text !== "1") {
        event.preventDefault();
      }
      // let user_id = req.session.user_id;


      console.log(text);
      $.ajax({
        url: `/login/${text}`,
        method: "GET"
      }).then(() => {
        $('div.userError').hide();
        $('.login').html(`<button class="logout" type="submit">Welcome User! ${text} Logout</button>`).removeClass('login').addClass('logout');
        userLoggedIn = true;
      }).then(() => {

        startOrder();

      }).then((result) => {
        console.log("start order", result);
      })
      .catch((err) => {
        console.log(err);
      })

    })

   $(document).on('submit', 'form.logout', function(event) {
    event.preventDefault();
    $.ajax({
    url: `/logout`,
    method: "GET"
    }).then(() =>{

    $('.logout').html('<input type="text" name="userId" id="userIdInput" placeholder="User ID"></input><button class="login" type="submit">Login</button>').removeClass('logout').addClass('login');
      userLoggedIn = false;
    })
   })


     const checkoutElement = (order, items) => {
      let orderedItems = ``;
      for (item of items) {
      orderedItems += `
      <div class="eachOrder">
      <h3>${item.quantity}&nbsp&nbsp</h3>
      <h3 class="name">${item.name}&nbsp&nbsp</h3>
      <h3>$${item.price}</h3>
      </div>
      `;
    }
    return $(`
    <section id="checkout">
      <h1>Checkout</h1>

      ${orderedItems}
      <div class="subtotal">
      <h3>Subtotal</h3>
      <h3 id="checkoutSum">$${checkoutSum}</h3>
      </div>
      <div class="tax">
      <h3>Local Tax (12%)</h3>
      <h3 id="checkoutSum">$${Math.floor(checkoutSum * 0.12 * 100) / 100}</h3>
      </div>
      <div class="total">
      <h3>Total</h3>
      <h3 id="checkoutSum">$${Math.floor(checkoutSum * 1.12 * 100) / 100}</h3>
      </div>
        <form class="payForOrder">
        <button class="pay" id='payForFood' type="submit">Pay</button>
        </form>
      <div class="success-checkmark">
        <div class="check-icon">
            <span class="icon-line line-tip"></span>
            <span class="icon-line line-long"></span>
            <div class="icon-circle"></div>
            <div class="icon-fix"></div>
        </div>
      </div>
    </section>
    `)
  }

  const renderCheckoutElement = (element) => {
    $('div#checkoutTime').append(element);
    $(".success-checkmark").hide();
  }

    $('#checkoutButton').on('click', (event) => {
      event.preventDefault();
      if ($('button.logout') && userLoggedIn) {
        $('div.userError').hide();
        const data = 'checkout';
      $.ajax({
        url: '/api/orders',
        method: 'PUT',
        data: {
          paid: false
        }
      }).then((result) => {
        $('div.userError').hide();

        $('.notOwner').css('display', 'none');
        $('.search').css('display', 'none');
        $('.isOwner').css('display', 'none');
        $('.checkoutTime').css('background', '#002E45');
        $('body').css('background', '#002E45');
        $('div.container-scroll').css('display', 'none');
        $('div#checkoutTime').slideDown("slow");
        // $('div#checkoutTime').css('display', 'flex');

        $('.login').css('display', 'none');
        $('.logout').css('display', 'none');


          var position = $(".checkoutTime").offset().top;
          $("HTML, BODY").animate({
              scrollTop: position
          }, 1000);



        console.log('result:', result);
        let user = result.order[0];
        $.ajax({
          url: `/api/order/${user.id}`,
          method: 'GET'
        }).then((result2) => {
          console.log('result2:', result2)
          $('div.userError').hide();
          renderCheckoutElement(checkoutElement(user, result2.order));

        })
      }).catch((err) => {
        console.log(err);
      })
      }
      if (!userLoggedIn) {
        $('div.userError').hide();
        $('div.userError').slideDown("slow");
      }


    })

    $(document).on('click', '#payForFood', function(event) {
      event.preventDefault();
      const data = 'pay';
      $.ajax({
        url: '/api/orders',
        method: 'PUT',
        data: {
          paid: true
        }
      }).then((result) => {
        console.log(result);
        let userNumber = '';
        let orderId = result.order[0].id;

        $.ajax({
          url: '/api/users',
          method: 'GET',
        }).then((result) => {
          userNumber = result.users[0].phone_number;
          $.ajax({
          url:'/sendSMS/',
          method: 'POST',
          data: {
            number: userNumber,
            message: `Your Order #${orderId} is being confirmed by the kitchen!`
          }
        }).then((result) => {
          $.ajax({
            url:'/sendSMS/',
            method: 'POST',
            data: {
              number: '+17805170260',
              message: `An order has been placed, ORDER: ${orderId}`
            }
          })
        }).then(() => {
          $('#payForFood').hide();
          $('.success-checkmark').show();
          $(".check-icon").hide();
          setTimeout(function () {
            $(".check-icon").show();
          }, 10);
        })
      }).catch(err => console.log(err))



      })
    })





})

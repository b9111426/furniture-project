import { toThousands } from '../libs/util.js'

export const getCartList = (instance,api_path,cartList) => {
    instance.get(`/${api_path}/carts`)
      .then( res => {
          return res.data.carts
          
      //    document.querySelector(".js-total").textContent = res.data.finalTotal;
      //    data.cartData = res.data.carts;
      //    let str = "";
      //    if (res.data.carts == 0) {
      //        str = `<tr>
      //            <td colspan="5">
      //                        <span class="material-icons empty-icon">production_quantity_limits</span>
      //                    </td>
      //            </tr>`
      //    };
      //    data.cartData.forEach(function (item) {
      //        str += `<tr>
      //    <td>
      //        <div class="cardItem-title">
      //            <img src="${item.product.images}" alt="">
      //            <p>${item.product.title}</p>
      //        </div>
      //    </td>
      //    <td>NT$${toThousands(item.product.price)}</td>
      //    <td>${item.quantity}</td>
      //    <td>NT$${toThousands(item.product.price * item.quantity)}</td>
      //    <td class="discardBtn">
      //        <a href="#" class="material-icons" data-id="${item.id}">
      //            clear
      //        </a>
      //    </td>
      //</tr>`
      //    });
      //    cartList.innerHTML = str;
      })
}
export const totalProductsNum = (productObject) => {
  const numObject = {}
  const priceObject = {}
  let totalNum = 0
  productObject.forEach(i => {
    const itemName = i.title
    const itemNum = i.quantity
    const itemPrice = i.price
    totalNum += itemNum
    setNumObject(itemName, itemNum)
    setPriceObject(itemName, itemPrice, itemNum)
  })

  function setNumObject (itemName, itemNum) {
    if (numObject[itemName] === undefined) {
      numObject[itemName] = itemNum
    } else {
      numObject[itemName] += itemNum
    }
  }

  function setPriceObject (itemName, itemPrice, itemNum) {
    if (priceObject[itemName] === undefined) {
      priceObject[itemName] = itemPrice * itemNum
    } else {
      priceObject[itemName] += itemPrice * itemNum
    }
  }

  return { numObject, priceObject, totalNum }
}

let itemsData = require('../dbConfig/itemsData.json');
let cartData = require('../dbConfig/cartData.json');
let fs = require("fs")
let resMsg = require('../messages.json');

/*
    Function Nanm: filterItem
    Function description: This function a helper function which is used to update the specific item from the list of available items
    No Of Parameters: 3
    Parameters: id, item, itemsDataToUpdate
*/
const calculateCartItemsTotal = (req, cartData) => {
    try{
        let user = req.user;
        let total = 0;
        for(let i = 0 ; i < cartData.length ; i++){
            if(cartData[i].user == user){
                total = total + (cartData[i].qty * cartData[i].itemPrice);
            }
        }
        return total;
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}


/*
    Function Nanm: showCart
    Function description: This function is used to list the items added in the cart
    method: GET
    No of Arguments: 0
*/

const showCart = (req, res, next) => {
    try{
        let total = calculateCartItemsTotal(req, cartData);
        return res.send({status: 200, data: {Items: cartData, total: cartData.length, itemPriceTotal: total}});
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Nanm: addToCart
    Function description: This function is used to add the items added in the cart
    method: POST
*/

const addToCart = (req, res, next) => {
    try{
        req.body['user'] = req.user;
        cartData.push(req.body);

        fs.writeFileSync('./dbConfig/cartData.json', JSON.stringify(cartData));

        return res.send({status: 200, msg: resMsg.ITEM_ADDED_TO_CART});
    }catch(e){
        return res.send({status: 500, error: e});
    }
}


/*
    Function Nanm: deleteItemHelper
    Function description: This function is a helper function which is used to delete the specific item from the list of available cart items
    No Of Parameters: 2
    Parameters: id, itemsData
*/
const deleteItemHelper = (req, id, cartData) => { 
    try{
        let user = req.user;
        for(let i = 0 ; i < cartData.length ; i++){
            if(cartData[i].user == user){
                if(cartData[i].itemId == id){
                    cartData.splice(i, 1);
                }
            }    
        }
        return cartData;
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Nanm: removeFromCart
    Function description: This function is used to remove the specific item from the list of available cart items
    Method: DELETE
*/
const removeFromCart = (req, res, next) => {
    try{
        if(!req.params.id || req.params.id == " ") return res.send({status: 200, msg: resMsg.PASS_ITEMID_MSG});
        let id = parseInt(req.params.id);

        let result = deleteItemHelper(req, id, cartData);
        fs.writeFileSync('./dbConfig/cartData.json', JSON.stringify(result));
        return res.send({status: 200, msg: resMsg.REMOVE_CART_ITEM_SUCCESS_MSG});
    }catch(e){
        return res.send({status: 500, error: e});
    }
}


/*
    Function Nanm: updateCartHelper
    Function description: This function a helper function which is used to update the specific item from the cart
    No Of Parameters: 4
    Parameters: req, id, cartData, cartDataToUpdate
*/
const updateCartHelper = (req, id, cartData, cartDataToUpdate) => { 
    try{   
        let user = req.user;
        for(let i = 0 ; i < cartData.length ; i++){
            if(cartData[i].user == user){
                if(cartData[i].itemId == id){
                    cartData[i].qty = cartDataToUpdate.qty;
                }
            }    
        }
        return cartData;
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Nanm: updateCart
    Function description: This function is used to update the specific item from the cart
    Method: PUT
    No Of Parameters: 2
    Parameters: ItemId, qty
*/
const updateCart = async (req, res) => {
    try{
        let cart = req.body; 
        let id = cart.itemId;

        if(!(cart && cart.itemId)) return res.send({status: 200, msg: resMsg.PASS_ITEMID_MSG});
        let updatedData = await updateCartHelper(req, id, cartData, req.body);
        fs.writeFileSync('./dbConfig/cartData.json', JSON.stringify(updatedData));
        return res.send({status: 200, msg: resMsg.CART_UPDATED_SUCCESSFULLY_MSG});
    }catch(e){
        return res.send({status: 500, error: e});
    }
}

module.exports = {
    showCart: showCart,
    addToCart: addToCart,
    removeFromCart: removeFromCart,
    updateCart: updateCart
}
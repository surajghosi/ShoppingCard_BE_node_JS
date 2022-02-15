let itemsData = require('../dbConfig/itemsData.json');
let fs = require("fs")
let resMsg = require('../messages.json');

/*
    Function Name: getAllItems
    Function description: This function is used to get the list of all the items currently available
    method: GET
    No of Arguments: 0
*/

const getAllItems = (req, res, next) => {
    try{
        return res.send({status: 200, data: {Items: itemsData, total: itemsData.length}});
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Name: filterItem
    Function description: This function a helper function which is used to get the specific item from the list of available items
    No Of Parameters: 2
    Parameters: itemNameToSearch, item
*/
const filterItem = (itemNameToSearch, item) => { 
    try{  
        let data = item.filter(function(itemObj, i){
            if(itemObj.itemName.toLowerCase().indexOf(itemNameToSearch) > -1){
                return itemObj; 
            }
        });
        return data;
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Name: filterItem
    Function description: This function a helper function which is used to update the specific item from the list of available items
    No Of Parameters: 3
    Parameters: id, item, itemsDataToUpdate
*/
const updateItemHelper = (id, item, itemsDataToUpdate) => {
    try{   
        for(let i = 0 ; i < item.length ; i++){
            if(item[i].itemId == id){
                item[i] = itemsDataToUpdate;
            }
        }
        return item;
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Name: getItemByName
    Function description: This function is used to get the item by its name
    method: GET
    query string: Item name will passed in query string  
*/
const getItemByName = async (req, res, next) => {
    try{
        if(!req.params.name || req.params.name == " ") return res.send({status: 200, msg: resMsg.PASS_ITEMNAME_MSG});
        
        let itemNameToSearch = req.params.name.toLowerCase(); 

        let requiredItem = await filterItem(itemNameToSearch, itemsData);
        
        return res.send({status: 200, data: {Items: requiredItem, total: requiredItem.length}});
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}
  
/*
    Function Name: insertItem
    Function description: This function is used to insert an item
    method: POST
    No of Parameter: 1
    Parameter: Item Object  
*/
const insertItem = async (req, res, next) => {
    try{
        let item = req.body; 
        
        if(!(item && item.itemName)) return res.send({status: 200, msg: resMsg.PASS_ITEMNAME_MSG});
        if(!(item && item.itemPrice)) return res.send({status: 200, msg: resMsg.PASS_ITEMPRICE_MSG});
        if(!(item && item.itemImage)) return res.send({status: 200, msg: resMsg.PASS_ITEMIMG_MSG});

        if(item.itemName.length > 50) return res.send({status: 200, msg: resMsg.ITEM_NAME_LENGTH_EXCDEED_MSG});
        if(isNaN(item.itemPrice)) return res.send({status: 200, msg: resMsg.ITEM_PRICE_SHOULD_BE_NUMBER_MSG});
        if(item.itemPrice.toString().length > 5) return res.send({status: 200, msg: resMsg.ITEM_PRICE_LENGTH_EXCDEED_MSG});

        let itemName = item.itemName.toLowerCase();

        let isItemExist = await filterItem(itemName, itemsData);

        if(isItemExist.length) return res.send({status: 200, msg: resMsg.ITEM_ALREADY_EXIST_MSG});

        req.body['itemId'] = itemsData[itemsData.length - 1].itemId + 1;
        itemsData.push(req.body);

        fs.writeFileSync('./dbConfig/itemsData.json', JSON.stringify(itemsData));

        return res.send({status: 200, msg: resMsg.ITEM_ADDED_SUCCESSFULLY_MSG});
    }catch(e){
        return res.send({status: 500, error: e});
    }
}

/*
    Function Name: updateItem
    Function description: This function is used to update an existing item
    method: PUT
    No of Parameter: 1
    Parameter: Item Object  
*/
const updateItem = async (req, res, next) => { 
    try{
        let item = req.body; 
        let id = item.itemId;

        if(!(item && item.itemId)) return res.send({status: 200, msg: resMsg.PASS_ITEMID_MSG});
        if(!(item && item.itemName)) return res.send({status: 200, msg: resMsg.PASS_ITEMNAME_MSG});
        if(!(item && item.itemPrice)) return res.send({status: 200, msg: resMsg.PASS_ITEMPRICE_MSG});
        if(!(item && item.itemImage)) return res.send({status: 200, msg: resMsg.PASS_ITEMIMG_MSG});

        if(item.itemName.length > 50) return res.send({status: 200, msg: resMsg.ITEM_NAME_LENGTH_EXCDEED_MSG});
        if(isNaN(item.itemPrice)) return res.send({status: 200, msg: resMsg.ITEM_PRICE_SHOULD_BE_NUMBER_MSG});
        if(item.itemPrice.toString().length > 5) return res.send({status: 200, msg: resMsg.ITEM_PRICE_LENGTH_EXCDEED_MSG});
        
        let updatedData = await updateItemHelper(id, itemsData, req.body);
        fs.writeFileSync('./dbConfig/itemsData.json', JSON.stringify(updatedData));
        return res.send({status: 200, msg: resMsg.ITEM_UPDATED_SUCCESSFULLY_MSG});
    }catch(e){
        return res.send({status: 500, error: e});
    }
}

/*
    Function Name: deleteItemHelper
    Function description: This function is a helper function which is used to delete the specific item from the list of available items
    No Of Parameters: 2
    Parameters: id, itemsData
*/
const deleteItemHelper = (id, item) => {
    try{
        for(let i = 0 ; i < item.length ; i++){
            if(item[i].itemId == id){
                item.splice(i, 1);
            }
        }
        return item;
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

/*
    Function Name: deleteItem
    Function description: This function is used to delete an existing item
    method: DELETE
    No of Parameter: 1
    Parameter: Item Object  
*/
const deleteItem = async (req, res) => {
    try{
        if(!req.params.id || req.params.id == " ") return res.send({status: 200, msg: resMsg.PASS_ITEMID_MSG});
        let id = parseInt(req.params.id);

        let result = deleteItemHelper(id, itemsData);
        fs.writeFileSync('./dbConfig/itemsData.json', JSON.stringify(result));
        return res.send({status: 200, msg: resMsg.DELETE_ITEM_MSG});
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}

module.exports = {
    getAllItems: getAllItems,
    getItemByName: getItemByName,
    insertItem: insertItem,
    updateItem: updateItem,
    deleteItem: deleteItem
}
let jwt = require('jsonwebtoken');
let resMsg = require('../messages.json');

/*
    Function Nanm: login
    Function description: This function is used to perform login
    method: POST
    No of Arguments: 2
    Arguments: username, password
*/
const login = (req, res) => {
    try{
        const username = req.body.username;
        const password = req.body.password;
        const user = {name: username};
         console.log(process.env.USERNAME);
         console.log(process.env.PASSWORD);
        if(username == process.env.USERNAME && password ==  process.env.PASSWORD){
            let accessToken = jwt.sign(user, process.env.SECRET, { expiresIn: '1h' });
            accessToken="Bearer "+accessToken;
            return res.send({status: 200, msg: resMsg.LOGIN_SUCCESS_MSG, accessToken: accessToken});
        } else {
            return res.send({status: 401, msg: resMsg.UNAUTHORIZED_MSG});
        }
    }catch(e){
        return res.send({status: 500, error: e});
    }    
}


/*
    Function Nanm: auth
    Function description: This function is used to verify accesstoken passed in every request
    method: POST
    No of Arguments: 0
    Arguments: Token has been passed in Authorization parameter in header
*/
const auth = async (req, res, next) => {
    try{
        const authHeader = req.headers['authorization'];
        
        //We tried to split token using white space(" ") as we'll get "Bearer" in front of token
        let token = authHeader && authHeader.split(" ")[1];
        if(!token) return res.send({status: 401, msg: resMsg.UNAUTHORIZED_MSG});  

        jwt.verify(token, process.env.SECRET, function(err, decoded){
            if(err) return res.send({status: 403, msg: resMsg.FORBIDDEN_MSG});
            req.user = decoded.name;
            next();
        });
    }catch(e){
        return res.send({status: 500, error: e});
    }
}



module.exports = {
    login: login,
    auth: auth
}
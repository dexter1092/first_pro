var db=require('../dbconnection');

var Authentication_model ={
    getUserByEmail : function(email,callback){
        return db.query("SELECT * FROM users_master where email=?",[email],callback);
    }
}

module.exports=Authentication_model;
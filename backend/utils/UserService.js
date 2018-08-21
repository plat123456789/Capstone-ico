
var jwt = require('jwt-simple');

class UserService {
    constructor(knex){
        this.knex = knex;
    }

    localLogin(email,password){
        return this.knex.select('id').from('users')
            .where({email: email,pw:password});
    }

    localSignUp(email,password){
        return this.knex('users').insert({email,pw:password,login_type:'local'}).returning('id');
    }

    facebookSignUp(username,oauthId){
        return this.knex('users').insert({login_type:'facebook',oauthid:oauthId,alias:username,is_admin:false}).returning('id');
    }

    findUserByOAuthId(strategy,oauthId){
        return this.knex.select('id').from('users').where({
            login_type:strategy,
            oauthid:oauthId
        });
    }

    verifyUser(id){
        return this.knex.select('id').from('users')
            .where('id',id);
    }

    verifyUserByEmail(email){
        return this.knex.select().from('users')
            .where('email',email)
    }

    // fetchProfilePic(id){
    //     return this.knex.select('profilePic').from('users').where("id",id);
    // }

    // uploadProfilePic(id,url){
    //     return this.knex('users').where('id',id).update('profilePic',url);
    // }
}

module.exports = UserService;
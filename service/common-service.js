const axios = require("axios");

class CommonService{
    async testMessage(){
        return "test Successfully passed!"
    }

    async getUsers(){
        return await axios.get("https://jsonplaceholder.typicode.com/users")
    }

    async login(){
        return await axios.post("https://portal.cloudbear.ru/django-rest/api-token-auth/", {
            "username": "iuliantcev",
            "password": "23Plotva9!"
        })
    }

}

module.exports = new CommonService();

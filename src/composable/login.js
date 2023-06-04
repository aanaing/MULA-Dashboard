import * as jose from "jose";

const decodeUserToken = () => {
    let userToken = window.localStorage.getItem("mulaloggeduser");

    if(userToken){
        let userData = JSON.parse(userToken);
        let rowDecodeToken = jose.decodeJwt(userData.token);
        userData = {...userData, "row": rowDecodeToken["https://hasura.io/jwt/claims"]["x-hasura-default-role"]};
        return userData;
    }
};

export {decodeUserToken};
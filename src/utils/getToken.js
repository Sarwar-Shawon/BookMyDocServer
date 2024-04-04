/*
 * @copyRight by md sarwar hoshen.
 */
//
const getToken = (authorization) => {

    const authorizationHeader = authorization;
    let token;
    if (authorizationHeader && authorizationHeader.startsWith("Bearer ")) {
      token = authorizationHeader.substring(7);
    }
    return token;
};
//
export{
    getToken,
};

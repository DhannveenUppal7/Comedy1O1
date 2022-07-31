import isEmpty from "./isEmpty";

const emailCheck = (str) => {
    var email = str.toLowerCase()
    var emptyOrNot = isEmpty(email);
    if (emptyOrNot === true) {
        return false;
    }
    else {
        if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            return (true)
        }
        else{
            return false
        }
    }
}

export default emailCheck
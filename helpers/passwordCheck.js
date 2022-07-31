const passwordCheck = (str) => {
    if(str.length >= 6){
        return true
    }
    else{
        return false
    }
}

export default passwordCheck
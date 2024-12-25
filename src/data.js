export const API_KEY = 'AIzaSyAEq6-N7d6O-45jpMt3bV4WS7Ez5xTUq1M';

export const value_converter = (value) => {
    if(value >= 1000000){
        return Math.floor(value/1000000) + "M";
    }else if(value >= 1000){
        return Math.floor(value/1000) + "K";
    }else{
        return value;
    }
}
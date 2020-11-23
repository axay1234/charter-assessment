import CommonLib from '../common/CommonLib';

const getAllRestaurants = () => {
    return CommonLib.getRequest('restaurants');
}

export {
    getAllRestaurants
}
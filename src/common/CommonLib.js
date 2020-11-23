import axios from "axios";
const BASE_URL = 'https://code-challenge.spectrumtoolbox.com/api/';
//restaurants

function getHeaders() {
    return {
        Authorization: "Api-Key q3MNxtfep8Gt",
        "Content-Type": "application/json",
    };
}

function getRequest(suburl) {
    return new Promise(async (resolve, reject) => {
        return await axios(BASE_URL + suburl, {headers: getHeaders()})
            .then(response => {
                resolve(response);
            }).catch(err => {
                reject(err);
            });
    });
}
const CommonLib = {
    getRequest: getRequest
};

export default CommonLib;
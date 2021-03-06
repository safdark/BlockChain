/**
 * See: https://www.npmjs.com/package/string-format
 */
const format = require('string-format');
format.extend(String.prototype, {})

const StarRecord = require('./star.js').StarRecord;
const Star = require('./star.js').Star;

class SingleStarResponse {
    /**
     * Returns a JSON for a star block
     * For example:
     *   {
     *       "hash": "a59e9e399bc17c2db32a7a87379a8012f2c8e08dd661d7c0a6a4845d4f3ffb9f",
     *       "height": 1,
     *       "body": {
     *           "address": "142BDCeSGbXjWKaAnYXbMpZ6sbrSAo3DpZ",
     *           "star": {
     *                   "ra": "16h 29m 1.0s",
     *                   "dec": "-26° 29' 24.9",
     *                   "story": 
     *           "466f756e642073746172207573696e672068747470733a2f2f7777772e676f6f676c652e636f6d2f736b792f",
     *                   "storyDecoded": "Found star using https://www.google.com/sky/"
     *               }
     *       },
     *       "time": "1532296234",
     *       "previousBlockHash": "49cce61ec3e6ae664514d5fa5722d86069cf981318fc303750ce66032d0acff3"
     *   }
     */

    getPayload() {
        return this.starBlock;
    }

    /**
     * Constructor
     */
    constructor(block) {
        if (block.isGenesisBlock()) {
            this.starBlock = block;
        } else {
            this.starBlock = StarRecord.decodeStarBlock(block);
        }
    }
}

class MultiStarResponse {
    /**
     * Returns a JSON for the current instance
     * For example:
     * {
     *  [
     *      <Block1>,
     *      <Block2>,
     *      ...
     *  ]
     * }
     */

    getPayload() {
        return this.stars;
    }

    /**
     * Constructor
     */
    constructor() {
        this.stars = [];
    }

    /**
     * Collects the stars to be returned to the client
     * @param {Block} block 
     */
    addStar(block) {
        block = StarRecord.decodeStarBlock(block);
        this.stars.push(block);
    }
}

class SessionRequest {

    /**
     * Returns a validation request from the provided json
     * For example:
     * {
     *    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL"
     * }
     * @param {string} json
     */
    static fromJSON(json) {
        let obj = json;
        if (typeof(obj) == "string") {
            obj = JSON.parse(obj);
        }

        var request = new SessionRequest();
        request.address = obj.address;
        return request;
    }

    getPayload() {
        return this;
    }

    /**
     * 
     * @param {string} address (null)
     */
    constructor(address=null) {
        this.address = address;
    }
}

class SessionResponse {
    /**
     * Returns a JSON for the current instance
     * For example:
     * {
     *     "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
     *     "requestTimeStamp": "1541605128",
     *     "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
     *     "validationWindow": 300
     * }
     */
    static fromJSON(json) {
        let obj = json;
        if (typeof(obj) == "string") {
            obj = JSON.parse(obj);
        }
        var response = new SessionResponse();
        response.address = obj.address;
        response.requestTimeStamp = obj.requestTimeStamp;
        response.message = obj.message;
        response.validationWindow = obj.validationWindow;
        return response;
    }

    getPayload() {
        return this;
    }

    /**
     * Constructor
     * @param {string} address 
     * @param {string} requestTimeStamp 
     * @param {string} message 
     * @param {string} validationWindow 
     */
    constructor(address, requestTimeStamp, message, validationWindow) {
        this.address = address;
        this.requestTimeStamp = requestTimeStamp;
        this.message = message;
        this.validationWindow = validationWindow;
    }
}

class AuthenticationRequest {
    /**
     * Builds a validate request from the provided json
     * For example:
     * {
     *    "address":"19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
     *    "signature":"H8K4+1MvyJo9tcr2YN2KejwvX1oqneyCH+fsUL1z1WBdWmswB9bijeFfOfMqK68kQ5RO6ZxhomoXQG3fkLaBl+Q="
     * }
     * @param {string} json
     */
    static fromJSON(json) {
        let obj = json;
        if (typeof(obj) == "string") {
            obj = JSON.parse(obj);
        }
        var request = new AuthenticationRequest();
        request.address = obj.address;
        request.signature = obj.signature;
        return request;
    }

    getPayload() {
        return this;
    }

    /**
     * 
     * @param {string} address (null)
     */
    constructor(address=null, signature=null) {
        this.address = address;
        this.signature = signature;
    }

}

class AuthenticationResponse {
    /**
     * Returns a JSON for the current instance
     * For example:
     * {
     *     registerStar": true, 
     *    "status": {
     *         "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
     *         "requestTimeStamp": "1541605128",
     *         "message": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL:1541605128:starRegistry",
     *         "validationWindow": 200,
     *         "messageSignature": true
     *     }
     * }
     */
    static fromJSON(json) {
        let obj = json;
        if (typeof(obj) == "string") {
            obj = JSON.parse(obj);
        }
        var response = new AuthenticationResponse();
        response.registerStar = obj.registerStar;
        response.status = obj.status;
        response.status.address = obj.status.address;
        response.status.requestTimeStamp = obj.status.requestTimeStamp;
        response.status.message = obj.status.message;
        response.status.validationWindow = obj.status.validationWindow;
        response.status.messageSignature = obj.status.messageSignature;
        return response;
    }

    getPayload() {
        return this;
    }

    /**
     * Constructor
     * @param {boolean} isAuthenticated 
     * @param {string} address 
     * @param {long} timestamp 
     * @param {string} message 
     * @param {int} window 
     */
    constructor(isAuthenticated, address, timestamp, message, window) {
        this.registerStar = isAuthenticated;
        this.status = {
            address: address,
            requestTimeStamp: timestamp,
            message: message,
            validationWindow: window,
            messageSignature: isAuthenticated
        }
    }
}

class RegisterStarRequest {
    /**
     * Returns a star registration request from the provided json
     * For example:
     * {
     *      "address": "19xaiMqayaNrn3x7AjV5cU4Mk5f5prRVpL",
     *      "star": {
     *             "dec": "68° 52' 56.9",
     *             "ra": "16h 29m 1.0s",
     *             "story": "Found star using https://www.google.com/sky/"
     *         }
     * }
     * @param {string} json
     */
    static fromJSON(json) {
        let starRecord = StarRecord.fromJSON(json);
        return new RegisterStarRequest(starRecord);
    }

    constructor(starRecord) {
        this.starRecord = StarRecord.encodeStarRecord(starRecord);
    }
}

module.exports = {
    SingleStarResponse : SingleStarResponse,
    MultiStarResponse : MultiStarResponse,
    SessionRequest : SessionRequest,
    SessionResponse : SessionResponse,
    AuthenticationRequest : AuthenticationRequest,
    AuthenticationResponse : AuthenticationResponse,
    RegisterStarRequest : RegisterStarRequest
}
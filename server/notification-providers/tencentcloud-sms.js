const NotificationProvider = require("./notification-provider");
const { DOWN, UP } = require("../../src/util");
const { default: axios } = require("axios");
const Crypto = require("crypto");
const qs = require("qs");

class TencentCloudSMS extends NotificationProvider {
    name = "TencentCloudSMS";

    /**
     * @inheritdoc
     */
    async send(notification, msg, monitorJSON = null, heartbeatJSON = null) {
        const okMsg = "Sent Successfully.";

        try {
            if (heartbeatJSON != null) {
                let msgBody = JSON.stringify({
                    name: monitorJSON["name"],
                    time: heartbeatJSON["localDateTime"],
                    status: this.statusToString(heartbeatJSON["status"]),
                    msg: heartbeatJSON["msg"],
                });
                if (await this.sendSms(notification, msgBody)) {
                    return okMsg;
                }
            } else {
                let msgBody = JSON.stringify({
                    name: "",
                    time: "",
                    status: "",
                    msg: msg,
                });
                if (await this.sendSms(notification, msgBody)) {
                    return okMsg;
                }
            }
        } catch (error) {
            this.throwGeneralAxiosError(error);
        }
    }

    /**
     * Send the SMS notification
     * @param {BeanModel} notification Notification details
     * @param {string} msgbody Message template
     * @returns {Promise<boolean>} True if successful else false
     */
    async sendSms(notification, msgbody) {
        let params = {
            PhoneNumberSet: [notification.phonenumber],
            TemplateID: notification.templateCode,
            SignName: notification.signName,
            TemplateParamSet: [msgbody],
            SmsSdkAppId: notification.smsSdkAppId,
            Action: "SendSms",
            Version: "2021-01-11",
            Region: notification.region || "ap-guangzhou",
            Timestamp: Math.floor(Date.now() / 1000),
            Nonce: Math.floor(Math.random() * 1000000),
            SecretId: notification.secretId,
            SignatureMethod: "TC3-HMAC-SHA256",
        };

        params.Signature = this.sign(params, notification.secretKey);
        let config = {
            method: "POST",
            url: "https://sms.tencentcloudapi.com/",
            headers: {
                "Content-Type": "application/json",
                "X-TC-Action": "SendSms",
                "X-TC-Version": "2021-01-11",
                "X-TC-Region": params.Region,
                "X-TC-Timestamp": params.Timestamp,
                "X-TC-Nonce": params.Nonce,
            },
            data: JSON.stringify(params),
        };

        let result = await axios(config);
        if (result.data.Response.SendStatusSet[0].Code === "Ok") {
            return true;
        }

        throw new Error(result.data.Response.SendStatusSet[0].Message);
    }

    /**
     * Tencent Cloud request sign
     * @param {object} param Parameters object to sign
     * @param {string} secretKey Secret key to sign parameters with
     * @returns {string} Base64 encoded request
     */
    sign(param, secretKey) {
        const service = "sms";
        const algorithm = "TC3-HMAC-SHA256";
        const timestamp = param.Timestamp;
        const date = new Date(timestamp * 1000).toISOString().substr(0, 10);

        // Canonical request
        const signedHeaders = "content-type;host";
        const canonicalHeaders = `content-type:application/json\nhost:sms.tencentcloudapi.com\n`;
        const payloadHash = Crypto.createHash("sha256").update(JSON.stringify(param)).digest("hex");
        const canonicalRequest = `POST\n/\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

        // String to sign
        const credentialScope = `${date}/${service}/tc3_request`;
        const hashedRequest = Crypto.createHash("sha256").update(canonicalRequest).digest("hex");
        const stringToSign = `${algorithm}\n${timestamp}\n${credentialScope}\n${hashedRequest}`;

        // Calculate signature
        const secretDate = Crypto.createHmac("sha256", "TC3" + secretKey).update(date).digest();
        const secretService = Crypto.createHmac("sha256", secretDate).update(service).digest();
        const secretSigning = Crypto.createHmac("sha256", secretService).update("tc3_request").digest();
        const signature = Crypto.createHmac("sha256", secretSigning).update(stringToSign).digest("hex");

        return `${algorithm} Credential=${param.SecretId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;
    }

    /**
     * Convert status constant to string
     * @param {const} status The status constant
     * @returns {string} Status
     */
    statusToString(status) {
        switch (status) {
            case DOWN:
                return "DOWN";
            case UP:
                return "UP";
            default:
                return status;
        }
    }
}

module.exports = TencentCloudSMS;
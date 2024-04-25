import { ethers } from "ethers";
import { Buffer } from "buffer";
const qs = require('qs');
import { getDeviceId,getRandomString } from './utils';
import { LogUtil } from './logUtil';
import { httpUtil } from './httpUtil';
import axios, { AxiosInstance, AxiosError } from "axios";


export class ShellApi {
    address: string;
    deviceid: string;
    axiosInstance: AxiosInstance;
    access_token: null;
    id_token: string;
    devices: string;
    identities: string;
    constructor(address:string, id_token:string) {
        this.address = address;
        this.deviceid = getDeviceId();
        this.axiosInstance = httpUtil.getProxy();
        this.access_token = null;
        this.id_token = id_token;
        // 项目函数可调整
        this.devices = `18e9d${getRandomString(10)}-${getRandomString(15)}-26001b51-2073600-18e9d${getRandomString(10)}`
        this.identities = Buffer.from(this.devices).toString('base64');
    }

    async post(url: string, body: any) {
        LogUtil.info(`${this.address} POST: ${url} - ${JSON.stringify(body)}`);
        try {
            const resp = await this.axiosInstance.post(url, body, {
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "authorization": this.id_token,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    "Sc-Cookie-Id": `${this.devices}`,
                    "Visitor-Id": "",
                    "Referer": "https://app.myshell.ai/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                }
            });
            const respData = resp.data;
            LogUtil.info(`${this.address} POST Return: ${JSON.stringify(respData)}`);
            if (respData.err_code !== 0) {
                throw new Error(`${this.address} Request:POST ${url}-${JSON.stringify(body)} Error: ${JSON.stringify(respData)}`);
            }
            return respData.data;
        } catch (error) {
            throw new Error(`${this.address} Request:POST ${url}-${JSON.stringify(body)} Error: ${error.message}`);
        }
    }

    async get(url: string, params = {}) {
        try {
            const queryParams = new URLSearchParams(params).toString();
            const fullUrl = queryParams ? `${url}?${queryParams}` : url;
            LogUtil.info(`${this.address} GET: ${fullUrl} - ${JSON.stringify(params)}`);
            const resp = await this.axiosInstance.get(fullUrl, {
                headers: {
                    "accept": "*/*",
                    "accept-language": "zh-CN,zh;q=0.9,en;q=0.8",
                    "authorization": this.id_token,
                    "content-type": "application/json",
                    "sec-ch-ua": "\"Google Chrome\";v=\"123\", \"Not:A-Brand\";v=\"8\", \"Chromium\";v=\"123\"",
                    "sec-ch-ua-mobile": "?0",
                    "sec-ch-ua-platform": "\"macOS\"",
                    "sec-fetch-dest": "empty",
                    "sec-fetch-mode": "cors",
                    "sec-fetch-site": "same-site",
                    // "sensorsdatajssdkcross": this.getSensorsdata(),
                    "Referer": "https://xter.io/",
                    "Referrer-Policy": "strict-origin-when-cross-origin"
                }
            });
            const respData = resp.data;
            LogUtil.info(`${this.address} GET Return: ${JSON.stringify(respData)}`);
            if (respData.err_code !== 0) {
                throw new Error(`${this.address} Request:GET ${fullUrl} Error: ${JSON.stringify(respData)}`);
            }
            return respData.data;
        } catch (error) {
            throw new Error(`${this.address} Request:GET ${url}-${JSON.stringify(params)} Error: ${error.message}`);
        }
    }


    async generate_nonce(address : string) {
        const url = `https://api.myshell.ai/v1/user/auth/generate_nonce`;
        const body = {"publicAddress":address};
        return await this.post(url, body);
    }
    

}

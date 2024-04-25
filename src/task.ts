//道具
import Axios, { AxiosError } from "axios";
import  { HttpsProxyAgent }  from "https-proxy-agent/dist";
import { Buffer } from "buffer";
import { ethers } from "ethers";
import config from '../config/config.json';
import {getInviteCode, getPrivateKeys, getToken, saveToken } from './libs/utils';
import { getDeviceId, getChatAnswer } from './libs/utils';
import {ShellApi} from './libs/api'
import { ChainAbi } from './libs/chainAbi';
import {LogUtil} from './libs/logUtil'

//私钥
let keyPairs: string | any[];

class task {
    address: string;
    privateKey: string;
    id_token: string;
    api: ShellApi;
    chainAbi: ChainAbi;
    //构造函数 创建对象初始化对象属性
    constructor(address:string, privateKey:string, id_token:string) {
        this.address = address;
        this.privateKey = privateKey;
        this.api = new ShellApi(this.address, id_token);
        this.chainAbi = new ChainAbi(this.privateKey, this.address);
    }

    login() {
        const nonce = this.api.generate_nonce(this.address);
        console.log("nonce:", nonce)
    }

    Run(){
        this.login();
    }

}

function Run() {
    console.log('执行每日任务...');
    keyPairs = getPrivateKeys();
    for (let i = 0; i < keyPairs.length; i++) {
        const address = keyPairs[i].address;
        const privateKey = keyPairs[i].privateKey;
        console.log(`第${i}个，地址：${address}:Run...`);
        const myTask = new task(address, privateKey, null);
         myTask.Run();
    }
}


Run();

import {LOW_SECURITY, MIDDLE_SECURITY, HIGH_SECURITY} from './config.js'
import {FileSystem} from './filesystem.js'
import {Commander} from './commander.js'

/**
 * 명령어 실행 및 컴퓨터 환경 구성
 */
export class Computer{
    constructor(){
        this.ip
        this.services = [] 
        this.fileSystem = new FileSystem(true) 
        this.ports = []  //Ports
        this.securityLevel = LOW_SECURITY
        this.commander = new Commander(this)
    }

    init(){

    }

    /**
     * @param {string} command 명령어 스트링
     */
    execute(command){
        if(command === "ls"){
            this.commander.ls()
        }
    }

    update(){
        /*
        this.services.forEach(service => {
            service.update()
        })
        */
    }
}

class Port{
    constructor(){
        this.isOpen 
        this.number 
    }
    openPort(){
        this.isOpen = true
    }

    closePort(){
        this.isOpen = false 
    }
}
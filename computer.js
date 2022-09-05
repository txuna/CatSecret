import {LOW_SECURITY, MIDDLE_SECURITY, HIGH_SECURITY} from './config.js'
import {FileSystem} from './filesystem.js'
import {Commander} from './commander.js'
import {MailService, MissionService} from './service.js'

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
        this.currentPath = this.fileSystem.root
        this.currentPathString = ''
        this.init()
    }

    init(){
        this.services.push(
            new MailService(this, "mail")
        )
        this.services.push(
            new MissionService(this, "mission")
        )
    }

    /**
     * currentPath를 실제 Folder 객체로 반환
     */
    getPathFolder(){
        if(this.currentPath === "/"){
            return this.fileSystem.root
        }
        let pathList = this.currentPath.split('/').splice(1)
        let tmpFolder = this.fileSystem.root
        for(let i=0;i<pathList.length;i++){
            if(tmpFolder.hasFolder(pathList[i])){
                tmpFolder = tmpFolder.searchFolder(pathList[i])
            }else{
                return null
            }
        }
    }

    /**
     * @param {string} command 명령어 문자열
     * @returns 명령어의 수행 결과 반환
     * 추후 명령어의 argument 처리 시스템 도입 예정
     */
    execute(command){
        let commandParse = command.trim().split(' ')
        let com = commandParse[0]
        let argv = commandParse.slice(1)
        switch(com){
            case "ls":
                return this.commander.ls()
            
            case "pwd":
                return this.commander.pwd()

            case "help":
                return this.commander.help()

            case "cd":
                if(commandParse.length == 2){
                    return this.commander.cd(argv[0])
                }else{
                    return `cd:\u2003needs two argument(cd [path])`
                }

            case "cat":
                if(commandParse.length == 2){
                    return this.commander.cat(argv[0])
                }else{
                    return `cat:\u2003needs two argument(cat [file name])`
                }

            default:
                return `Invalid Command '${command}'`
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
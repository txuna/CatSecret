import {LOW_SECURITY, MIDDLE_SECURITY, HIGH_SECURITY} from './config.js'
import {FileSystem} from './filesystem.js'
import {Commander} from './commander.js'
import {MailService, MissionService} from './service.js'

/**
 * 명령어 실행 및 컴퓨터 환경 구성
 */
export class Computer{
    constructor(){
        this.interface = {
            ip : '127.0.0.1',
            mac : 'AF:13:BF:38:37:C7'
        }
        this.services = [] 
        this.fileSystem = new FileSystem(true) 
        this.ports = []  //Ports
        this.securityLevel = LOW_SECURITY
        this.commander = new Commander(this)
        this.currentPath = this.fileSystem.root
        this.navigationPath = [] // Folder 이동 경로 집어넣음
        this.init()
    }

    init(){
        // Service init 
        this.services.push(
            new MailService(this, "mail")
        )
        this.services.push(
            new MissionService(this, "mission")
        )
        
        // network interface init

    }

    /**
     * 경로까지의 권한 체크
     * @param {Array} navigation currentPath에서 부터의 경로 인덱스 배열 
     */
    checkPermission(navigation){

    }

    getFullPathAtDepth(){
        let path = '' 
        let folder = this.fileSystem.root
        for(const element of this.navigationPath){
            path += `/${folder.folders[element].name}`
            folder = folder.folders[element]
        }
        return path
    }

    /**
     * 현재 currentPath를 기반으로 인덱스 배열로 반환 - 단 파일
     * @param {String} path 입력받은 경로
     * @returns list
     */
    getFileNavigationFromPath(path){

    }

    /**
     * path를 현재 currentPath를 기반으로 인덱스 배열로 반환 - 단 폴더 
     * @param {String} path 입력받은 경로 
     * @returns list
     */
    getFolderNavigationFromPath(path){
        let tmpNavigation = this.navigationPath
        if(path == '/'){
            tmpNavigation = [] 
        }
        else if(path == '..'){
            tmpNavigation.pop() 
        }
        else{
            let folder 
            // 절대경로라면 초기화
            if(path.startsWith('/')){
                tmpNavigation = [] 
                folder = this.fileSystem.root // 최상위 경로로 설정
            }else{  
                folder = this.currentPath
            }

            let pathList = path.split('/')
            let flag = false
            for(const element of pathList){
                if(element == '' || element == ' ') continue 
                else if(element == '..'){
                    tmpNavigation.pop()
                    folder = this.getFolderAtDepth() // 상위 폴더 반환
                }else{
                    // element에 맞는 문자열(폴더)이 현 폴더에 존재하는지 확인
                    for(let index=0; index < folder.folders.length; index++){
                        if(element == folder.folders[index].name){
                            folder = folder.folders[index]
                            tmpNavigation.push(index)
                            flag = true
                            break
                        }
                    }
                    if(!flag){
                        return null
                    }else{
                        flag = false
                    }
                }
            }
        }
        return tmpNavigation
    }

    /**
     * this.navigationPath을 기반으로 해당 폴더 반환
     * @returns navigationPath에 의한 Folder 반환
     */
    getFolderAtDepth(){
        let folder = this.fileSystem.root
        for(const element of this.navigationPath){
            folder = folder.folders[element]
        }
        return folder
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
                    return `cd:\u2003[Usage] cd FolderPath`
                }

            case "cat":
                if(commandParse.length == 2){
                    return this.commander.cat(argv[0])
                }else{
                    return `cat:\u2003[Usage]cat FilePath`
                }

            case "ifconfig":
                return this.commander.ifconfig()
            
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
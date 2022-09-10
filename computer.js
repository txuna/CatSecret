import {LOW_SECURITY, MIDDLE_SECURITY, HIGH_SECURITY} from './config.js'
import {FileSystem} from './filesystem.js'
import {Commander} from './commander.js'
import {MailService, MissionService} from './service.js'
import {User} from './user.js'

/**
 * 명령어 실행 및 컴퓨터 환경 구성
 */
export class Computer{
    constructor(node, Os){
        this.os = Os
        this.interface = undefined
        this.services = [] 
        this.fileSystem = new FileSystem(true) 
        this.ports = []  //Ports
        this.securityLevel = LOW_SECURITY
        this.commander = new Commander(this, this.os)
        this.currentPath = this.fileSystem.root
        this.navigationPath = [] // Folder 이동 경로 집어넣음
        this.users = []
        this.logOnUser = undefined  
        this.history = []
        
        this.load(node)
    }

    getUser(name){
        for(const user of this.users){
            if(user.name == name) return user
        }
        return null
    }

    loginUser(uname, upassword){
        for(const user of this.users){
            if(user.name != uname){
                continue
            }
            if(user.password == upassword){
                return true
            }else{
                return false
            }
        }
        return false
    }

    load(node){
        this.interface = node.interface 

        // load port 
        node.ports.forEach( port => {
            this.ports.push( new Port(
                port.num, port.status
            ))
        })
        // load user 
        node.users.forEach( user => {
            this.users.push( new User(
                user.name, user.uid, user.password
            ))
        })

        // Service init 
        this.services.push(
            new MailService(this, "mail")
        )
        this.services.push(
            new MissionService(this, "mission")
        )
    }

    /**
     * 해당 파일을 읽고 터미널에 출력한다. 
     * @param {File} file 열람할 파일  
     */
    readFile(file){
        return file.data
    }

    /**
     * 해당 파일에 데이터를 쓴다. 
     * @param {file} file 열람할 파일
     */
    writeFile(file, data){

    }

    removeFile(){

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
        if(this.navigationPath.length == 0){
            return '/'
        }
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

        this.history.push(command)

        switch(com){
            case "id":
                return this.commander.id()
                
            case "scan":
                return this.commander.scan()
                
            case "home":
                return this.commander.home()

            case "login":
                if(commandParse.length == 3){
                    return this.commander.login(argv[0], argv[1])
                }else{
                    return `Usage: login [USER NAME] [USER PASSWORD]`
                }

            // connect 시 guest로 자동 로그인
            case "connect":
                if(commandParse.length == 2){
                    return this.commander.connect(argv[0])
                }else{
                    return `Usage: connect [NETWORK IP]`
                }

            case "history":
                return this.commander.history()

            case "ls":
                if(commandParse.length == 2){
                    if(argv[0] == '-al') return this.commander.lsDetail(argv[0])
                    else return `Usage: ls -al`         
                }else{
                    return this.commander.ls()
                }
            
            case "pwd":
                return this.commander.pwd()

            case "help":
                return this.commander.help()

            case "cd":
                if(commandParse.length == 2){
                    return this.commander.cd(argv[0])
                }else{
                    return `Usage: cd [FOLDER PATH]`
                }

            case "cat":
                if(commandParse.length == 2){
                    return this.commander.cat(argv[0])
                }else{
                    return `Usage: cat [FILENAME]`
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
    constructor(num, s){
        this.status = s
        this.number = num
    }
    openPort(){
        this.status = true
    }

    closePort(){
        this.status = false 
    }
}
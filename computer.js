import {LOW_SECURITY, MIDDLE_SECURITY, HIGH_SECURITY} from './config.js'
import {FileSystem} from './filesystem.js'
import {Commander} from './commander.js'
import {MailService, MissionService} from './service.js'
import {User} from './user.js'
import {Log} from './log.js'
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
        this.log = undefined
        this.connectedIP = undefined
        this.status = undefined
        
        this.load(node)
    }

    /**
     * 유효한 권한비트인지 확인한다. 
     * @param {String} mode 권한비트
     * @returns 유효유무
     */
    verifyMode(mode){
        if(mode.length != 3){
            return false
        }
        if(!(mode[0] == 'r' || mode[0] == '-')
            || !(mode[1] == 'w' || mode[1] == '-')
            || !(mode[2] == 'x' || mode[2] == '-')){
                return false
            }
        return true
    }

    /**
     * 유저이름을 기반으로 유저객체를 구하는 함수 
     * @param {String} name 유저이름  
     * @returns User객체 or NULL
     */
    getUser(name){
        for(const user of this.users){
            if(user.name == name) return user
        }
        return null
    }

    /**
     * 유저네임이 존재하는 유저인지 확인
     * @param {String} name 구하려는 유저 네임  
     */
    hasUser(name){
        for(const user of this.users){
            if(user.name == name){
                return true
            }
        }
        return false
    }

    /**
     * 현재 로그인된 사용자를 변경한다. 
     * @param {String} uname        변경하려는 유저이름 
     * @param {String} upassword    변경하려는 유저의 패스워드 
     * @returns 로그인 성공 유무를 반환
     */
    loginUser(uname, upassword){
        for(const user of this.users){
            if(user.name != uname){
                continue
            }
            if(user.password == upassword){
                this.logOnUser = uname
                return true
            }else{
                return false
            }
        }
        return false
    }

    /**
     * 기본적인 컴퓨터 정보를 기반으로 각종 초기 설정을 진행한다. 
     * @param {JSON} node 초기정보가 담긴 json 파일 
     */
    load(node){
        // log init 
        let folder = this.fileSystem.root.searchFolder('var')
        folder = folder.searchFolder('log')
        this.log = new Log(folder)

        // network init
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

        // computer power on 
        this.turnOn()
    }

    /**
     * 컴퓨터의 상태를 킨다. 
     */
    turnOn(){
        this.log.writeLog('Starting Computer turn on...:\u2003[ OK ]' ,'system')
        this.status = true
        this.boot()
    }

    /**
     * 컴퓨터의 상태를 종료한다. 
     */
    turnOff(){
        this.log.writeLog('Starting Computer turn off...:\u2003[ OK ]' ,'system')
        this.status = false
    }
    /**
     * 부팅로그를 작성한다. 
     */
    boot(){
        this.log.writeLog('Starting udev:\u2003[ OK ]' ,'system')
        this.log.writeLog('Setting hostname jmote:\u2003[ OK ]', 'system')
        this.log.writeLog('Checking.... Filesystem:\u2003[ OK ]', 'system')
        this.log.writeLog('Checking Services...', 'system')
        this.log.writeLog('Service Mail...:\u2003[ OK ]', 'system')
        this.log.writeLog('Service Mission...:\u2003[ OK ]', 'system')
        this.log.writeLog('Checking System File...\u2003[ OK ]', 'system')
        this.log.writeLog('Starting up Program...\u2003[ OK ]', 'system')
    }
    /**
     * 해당 파일을 읽고 터미널에 출력한다. 
     * 폴더의 r와 x 비트 확인 
     * @param {File} file 열람할 파일  
     */
    readFile(file){
        const folder = this.currentPath
        if(!this.verifyPermissionAtFolder(folder, 'r')
            || !this.verifyPermissionAtFolder(folder, 'x')){
            return false
        }
        if(!this.verifyPermissionAtFile(file, 'r')){
            return null
        }
        return file.readData()
    }

    /**
     * 해당 파일에 데이터를 쓴다. 
     * @param {file} file 열람할 파일
     */
    writeFile(file, data){

    }

    /**
     * 해당 파일을 현재 폴더에서 삭제한다. 
     * 해당 파일의 w 권한 확인 및  x 비트 확인 
     * @param {File} file 삭제하려는 파일 
     */
    removeFile(file){
        const folder = this.currentPath
        if(!this.verifyPermissionAtFolder(folder, 'w')
            || !this.verifyPermissionAtFolder(folder, 'x')){
            return false
        }
        if(!this.verifyPermissionAtFile(file, 'w')){
            return false
        }
        
        folder.removeFile(file)
        return true
    }

    /**
     * 
     * @param {Folder} folder 삭제하려는 폴더
     */
    removeFolder(folder){
        const currentFolder = this.currentPath
        if(!this.verifyPermissionAtFolder(currentFolder, 'w')){
            return false
        }
        if(!this.verifyPermissionAtFolder(folder, 'w')){
            return false
        }
        currentFolder.removeFolder(folder)
        return true
    }

    /**
     * 경로까지의 권한 체크 - 현재 logOnUser로 확인
     * @param {Array} navigation currentPath에서 부터의 경로 인덱스 배열 
     * @param {String} type read할것인지 write할것인지
     * root의 경우(1000) 상위 권한
     * 폴더 소유주와 현재 로그인된 계정 확인 다르다면 other로 체크
     * Folder만 가능
     */
    verifyPermissionFromNavigation(navigation, type){
        let folder = this.fileSystem.root 
        let user = this.getUser(this.logOnUser) 
        if(user == null){
            return false
        }
        if(folder.owner == user.name){
            if(!folder.ownerbit.includes(type)){
                return false
            }
        }else{
            if(!folder.otherbit.includes(type)){
                return false
            }
        }
        for(const element of navigation){
            folder = folder.folders[element]
            if(folder.owner == user.name){
                if(!folder.ownerbit.includes(type)){
                    return false
                }
            }else{
                // root라면
                if(user.uid == 1000) return true 
                if(!folder.otherbit.includes(type)){
                    return false
                }
            }
        }
        return true
    }

    /**
     * 주어진 폴더객체의 권한 확인
     * @param {Folder} folder 권한 확인하려는 폴더 객체  
     * @param {String} type write or read 
     */
    verifyPermissionAtFolder(folder, type){
        let user = this.getUser(this.logOnUser)
        if(user == null){
            return false
        }
        if(folder.owner == user.name){
            if(type == '-'){
                return true
            }
            if(!folder.ownerbit.includes(type)){
                return false
            }
        }else{
            // root라면
            if(user.uid == 1000) return true 
            // root가 아닌 소유자는 자신의 소유자로만 변경 가능
            if(type == '-'){
                return false 
            }
            if(!folder.otherbit.includes(type)){
                return false
            }
        }
        return true
    }

    /**
     * 작업하려는 파일에 대해 권한을 체크한다. 
     * @param {File} file 작업하려는 File 
     * @param {String} type read or write bit, -넣을 시 소유자만 확인 비트체크 X 
     */
    verifyPermissionAtFile(file, type){
        let user = this.getUser(this.logOnUser)
        if(user == null){
            return false
        }
        if(file.owner == user.name){
            if(type == '-'){
                return true
            }
            if(!file.ownerbit.includes(type)){
                return false
            }
        }else{
            // root라면
            if(user.uid == 1000) return true 
            // root가 아닌 소유자는 자신의 소유자로만 변경 가능
            if(type == '-'){
                return false 
            }
            if(!file.otherbit.includes(type)){
                return false
            }
        }
        return true
    }

    /**
     * navigationPath를 기반으로 Full 경로를 구한다. 
     * @returns 전체경로를 반환
     */
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
            case 'vim':
                return this.commander.vim()
                
            case 'chmod':
                if(commandParse.length == 5){
                    return this.commander.chmod(argv[0], argv[1], argv[2], argv[3])
                }else{
                    return `Usage: chmod [OPTION] [OWNER MOD] [OTHER MOD] [FNAME]`
                }
            case 'chown':
                if(commandParse.length == 4){
                    return this.commander.chown(argv[0], argv[1], argv[2])
                }else{
                    return `Usage: chown [OPTION] [OWNER] [FNAME]`
                }
            case 'analysis':
                return this.commander.analysis()

            case 'passwd':
                if(commandParse.length == 3){
                    return this.commander.passwd(argv[0], argv[1])
                }else{
                    return `Usage: passwd [PASSWORD] [CONFIRM PASSWORD]`
                }
                
            case 'reboot':
                return this.commander.reboot()

            case 'rmdir':
                return this.commander.rmdir(argv[0])

            case 'rm':
                return this.commander.rm(argv[0])

            case 'mkdir':
                return this.commander.mkdir(argv[0])

            case 'touch':
                return this.commander.touch(argv[0])

            case "id":
                return this.commander.id()
                
            case "nmap":
                return this.commander.nmap()
                
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
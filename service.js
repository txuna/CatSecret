import {Folder, File} from './filesystem.js'

/**
 * 백그라운드에서 돌아가는 Daemon Service
 * @param {OS} os os class 
 * @param {Computer} comp Computer Class 
 * @param {string} fname root Folder Name
 */
class Service{
    constructor(os, comp, fname, status, terminal){
        this.os = os
        this.terminal = terminal
        this.computer = comp 
        this.serviceName = fname
        this.computer.fileSystem.root.addFolder(new Folder(this.serviceName, 'root', 'rwx', 'r-x'))
        // root는 해당 Daemon Service가 접근할 수 있는 최상위 Directory
        this.root = this.computer.fileSystem.root.searchFolder(this.serviceName)
        this.status = status
    }

    /**
     * 백그라운드로 돌아가는 서비스에 독자적인 파일시스템 생성 
     */
    initFileSystem(){

    }

    turnOff(){
        if(!this.status){
            return false
        }
        this.computer.log.writeLog(`Stop... ${this.serviceName} Service...:\u2003[ OK ]`, 'system')
        this.status = false
        return true
    }

    turnOn(){
        if(this.status){
            return false
        }
        this.computer.log.writeLog(`Starting... ${this.serviceName} Service...:\u2003[ OK ]`, 'system')
        this.status = true
        return true
    }

    getStatus(){
        let status = this.status? 'RUNNING' : 'OFF'
        let output = `Service ${this.serviceName}:\u2003[ ${status} ]\n`
        return output
    }
}

export class MailService extends Service{
    constructor(os, comp, fname, status, terminal){
        super(os, comp, fname, status, terminal)
        this.root.addFolder(new Folder('account', 'root', 'rwx', 'r-x'))
        this.accountFolder = this.root.searchFolder('account')
        this.initFileSystem()
    }

    /**
     * 존재하는 유저마다 inbox, sent 폴더 생성 
     * mail - account - user - inbox / sent 
     *                - user - inbox / sent 
     */
    initFileSystem(){
        this.computer.log.writeLog('Starting... Mail Service...:\u2003[ OK ]', 'system')
        const users = this.computer.users 
        users.forEach(user => {
            this.accountFolder.addFolder(new Folder(user.name, 'root', 'rwx', 'r-x'))
            const userFolder = this.accountFolder.searchFolder(user.name)
            userFolder.addFolder(new Folder('inbox', 'root', 'rwx', 'r-x'))
            userFolder.addFolder(new Folder('sent', 'root', 'rwx', 'r-x'))
        });
        this.computer.log.writeLog('Success Load Mail Server:\u2003[ OK ]', 'system')

        this.dumpMail()
    }

    // 덤프 형식의 메일
    dumpMail(){
        if(this.computer.interface.ip == '13.23.27.8'){
            let content = this.createMailContent('First Mail!',
            `Hey, We observed your hacking.
            we appreciate your hacking abillity!\
            can you join my team?`, 'n00dles@13.23.27.8')
            this.sendMail('n00dles', content, 'tuuna', '127.0.0.1')
        } else if(this.computer.interface.ip == '72.38.171.9'){
            let content = this.createMailContent('headHUNTING!', 
            'We Looking forward to meeting you~!', 
            'troy@72.38.171.9')
            this.sendMail('troy', content, 'tuuna', '127.0.0.1')
        }
    }

    /**
     * title date content from 형식 맞춰서 content 재작성
     * @param {*} content 
     */
    createMailContent(title, content, from){
        let msg = `
        [Title]
        ${title}
        [Date]
        ${new Date().toLocaleString()}
        [Content]
        ${content}
        [From]
        '${from}'
        `
        return msg
    }

    /**
     * from -> to 메일을 보낸다. 보내는 계정에는 sent에 있어야 하며, 받는사람은 inbox에 있어야 함
     * to의 computer를 os의 networkNodes로부터 가져와야 함
     *  
     * 제목은 어케?
     * @param {String} fromUser 
     * @param {String} fromIP 
     * @param {String} content 
     * @param {String} toUser 
     * @param {String} toIP 
     * @returns 성공여부
     */
    sendMail(from, content, toUser, toIP){
        if(!this.status){
            return false
        }
        let toComputer = undefined
        if(this.os.thisComputer.interface.ip == toIP){
            toComputer = this.os.thisComputer
        }else{
            toComputer = this.os.getComputerNodeFromIP(toIP)
            if(toComputer == null){
                return false
            }
        }
        const user = this.computer.getUser(from)
        if(user == null){
            return false
        }

        // 발신 컴퓨터 sent에 생성 
        if(!this.accountFolder.hasFolder(user.name)){
            return false
        }
        const userFolder = this.accountFolder.searchFolder(user.name)
        if(!userFolder.hasFolder('sent')){
            return false
        }
        const sentFolder = userFolder.searchFolder('sent')
        sentFolder.addFile(new File(`${sentFolder.files.length}`, content, user.name, 'rwx', 'r-x'))
        
        // 수신 컴퓨터 inbox에 생성 
        const toComputerMailService = toComputer.getServiceFromName('mail')
        if(!toComputerMailService.recieveMail(toUser, content)){
            return false
        }
        return true
    }

    /**
     * 다른 컴퓨터로부터 받은 메일을 저장한다.
     * @param {String} toUser 
     * @param {String} content 
     */
    recieveMail(toUser, content){
        if(!this.status){
            return false
        }
        //console.log(this.computer.interface.ip, 'recieved!')
        const user = this.computer.getUser(toUser)
        if(user == null){
            return false
        }
        if(!this.accountFolder.hasFolder(user.name)){
            return false
        }
        const userFolder = this.accountFolder.searchFolder(user.name)
        if(!userFolder.hasFolder('inbox')){
            return false
        }
        const inboxFolder = userFolder.searchFolder('inbox')
        inboxFolder.addFile(new File(`${inboxFolder.files.length}`, content, user.name, 'rwx', 'r-x'))
        
        // recieved한 컴퓨터 IP와 접속해 있는 IP가 일치할 때 
        // 추후 읽은 메일, 안읽은 메일로 구별
        const com = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        if(com.interface.ip == this.computer.interface.ip){
            let msg = {
                'is_command' : false, 
                'output' : `new mail recieved!`,
            }
            
            this.terminal.writeTerminal(msg)
        }
        
        return true
    }

    readMail(username){
        if(!this.status){
            return null
        }
        let output = ''

        if(!this.accountFolder.hasFolder(username)){
            return null
        }
        const userFolder = this.accountFolder.searchFolder(username)
        if(!userFolder.hasFolder('inbox')){
            return null
        }
        const inboxFolder = userFolder.searchFolder('inbox')
        inboxFolder.files.forEach(file => {
            output += `${file.readData()}\n\n`
        })
        return output
    }

    update(){

    }
}



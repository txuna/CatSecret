import {Folder, File} from './filesystem.js'

/**
 * 백그라운드에서 돌아가는 Daemon Service
 * @param {Computer} comp Computer Class 
 * @param {string} fname root Folder Name
 */
class Service{
    constructor(comp, fname){
        this.computer = comp 
        this.serviceName = fname
        this.computer.fileSystem.root.addFolder(new Folder(this.serviceName, 'root', 'rwx', 'r-x'))
        // root는 해당 Daemon Service가 접근할 수 있는 최상위 Directory
        this.root = this.computer.fileSystem.root.searchFolder(this.serviceName)
    }

    /**
     * 백그라운드로 돌아가는 서비스에 독자적인 파일시스템 생성 
     */
    initFileSystem(){

    }
}

export class MailService extends Service{
    constructor(comp, fname){
        super(comp, fname)
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
    }

    sendMail(){

    }

    readMail(){

    }

    update(){

    }
}


export class MissionService extends Service{
    constructor(comp, fname){
        super(comp, fname)
        this.initFileSystem()
    }

    initFileSystem(){

    }

    update(){

    }
}
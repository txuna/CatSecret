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
        this.computer.fileSystem.root.addFolder(new Folder(this.serviceName, 'root', 'rw', 'r-'))
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
        this.initFileSystem()

    }
    initFileSystem(){
    
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
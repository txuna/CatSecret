import {ALIGN_SIZE} from './config.js'
/**
 * 컴퓨터의 파일시스템을 구성하는 클래스 폴더와 파일로 구성
 * cd의 경우 x 비트 필수 
 * ls의 경우 r 비트 
 * touch의 경우 w 비트
 */
export class FileSystem{
    /**
     * 
     * @param {bool}} value 파일시스템의 초기 구성이 필요한지에 대한 인자 
     */
    constructor(value){
        this.root = new Folder("/", 'root', 'rwx', 'r-x')
        this.needInit = value
        
        this.init()
    }

    // 기본적인 컴퓨터 파일시스템 구축 
    init(){
        // Daemon 같은 경우 자체적인 파일시스템 구현 
        if(!this.needInit) return 

        // 일반적인 컴퓨터의 경우 
        this.root.addFolder(new Folder("var", 'root', 'rwx', 'r-x'))
        this.root.addFolder(new Folder("home", 'root', 'rwx', 'r-x'))
        this.root.addFolder(new Folder("root", 'root', 'rwx', 'r-x'))
        this.root.addFolder(new Folder("etc", 'root', 'rwx', 'r-x'))
        this.root.addFolder(new Folder("bin", 'root', 'rwx', 'r-x'))
        this.root.addFolder(new Folder("tmp", 'root', 'rwx', 'rwx'))

        if(this.root.hasFolder("root")){
            let folder = this.root.searchFolder("root")
            folder.addFile(new File("README.md", "Hello World!", 'root', 'rwx', 'r-x'))
        }

        if(this.root.hasFolder("var")){
            let folder = this.root.searchFolder("var")
            folder.addFolder(new Folder("log", 'root', 'rwx', 'r-x'))
            folder = folder.searchFolder("log")
            folder.addFile(new File("auth.log", '', 'root', 'rwx', 'r--'))
            folder.addFile(new File('history.log', '', 'root', 'rwx', 'r--'))
        }
    }    
}


class FileStat{
    constructor(fowner, fownerbit, fotherbit, fsize){
        this.owner = fowner
        this.ownerbit = fownerbit
        this.otherbit = fotherbit
        this.createAt = new Date().toLocaleString()
        this.modifyAt = this.createAt
        this.size = fsize
    }
    changeOwner(newOwner){
        this.owner = newOwner
    }
    changeOwnerMode(newMode){
        this.ownerbit = newMode
    }
    changeOtherMode(newMode){
        this.otherbit = newMode
    }
}

/**
 * Folder Class 
 * fname 생성시 특수문자, _, / 등 replace 처리 필요
 */
export class Folder extends FileStat{
    /**
     * 
     * @param {string} fname 폴더 이름 
     */
    constructor(fname, fowner, fownerbit, fotherbit){
        super(fowner, fownerbit, fotherbit, 4096)
        this.name = fname
        this.count = 0
        this.folders = []
        this.files = [] 
    }

    removeFolder(folder){
        let index = this.folders.indexOf(folder)
        this.folders.splice(index, 1)
    }

    removeFile(file){
        let index = this.files.indexOf(file)
        this.files.splice(index, 1)
    }

    addFolder(folder){
        this.folders.push(folder)
        this.count+=1
    }

    addFile(file){
        this.files.push(file)
        this.count+=1
    }

    /**
     * 
     * @param {String} fname 얻으려는 폴더이름
     */
    searchFolder(fname){
        for(let i=0; i<this.folders.length; i++){
            if(this.folders[i].name == fname) return this.folders[i]
        }
        return null
    }

    /**
     * 
     * @param {String} fname 얻으려는 파일이름 
     */
    searchFile(fname){
        for(let i=0;i<this.files.length; i++){
            if(this.files[i].name == fname) return this.files[i]
        }
        return null
    }

    /**
     * 
     * @param {String} fname 찾으려는 파일이름 
     */
    hasFile(fname){
        for(let i=0;i<this.files.length; i++){
            if(this.files[i].name == fname) return true
        }
        return false
    }

    /**
     * 
     * @param {String} fname 찾으려는 폴더이름 
     */
    hasFolder(fname){
        for(let i=0; i<this.folders.length; i++){
            if(this.folders[i].name == fname) return true
        }
        return false
    }
}

export class File extends FileStat{
    /**
     * 
     * @param {string} fname 파일 이름  
     * @param {string} fdata 파일 데이터
     */
    constructor(fname, fdata, fowner, fownerbit, fotherbit){
        super(fowner, fownerbit, fotherbit, fdata.length * ALIGN_SIZE)
        this.name = fname
        this.data = fdata
    }

    writeData(fdata){
        this.data = `${fdata}\n`
        this.size = this.data.length * ALIGN_SIZE
    }

    appendData(fdata){
        this.data += `${fdata}\n`
        this.size = this.data.length * ALIGN_SIZE
    }

    readData(){
        return this.data
    }
}

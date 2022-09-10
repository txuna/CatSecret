import {ALIGN_SIZE} from './config.js'
import {READ_BIT, WRITE_BIT} from './config.js'
/**
 * 컴퓨터의 파일시스템을 구성하는 클래스 폴더와 파일로 구성
 */
export class FileSystem{
    /**
     * 
     * @param {bool}} value 파일시스템의 초기 구성이 필요한지에 대한 인자 
     */
    constructor(value){
        this.root = new Folder("/")
        this.needInit = value
        
        this.init()
    }

    // 기본적인 컴퓨터 파일시스템 구축 
    init(){
        // Daemon 같은 경우 자체적인 파일시스템 구현 
        if(!this.needInit) return 

        // 일반적인 컴퓨터의 경우 
        this.root.addFolder(new Folder("var", 'root', 'rw', 'r-'))
        this.root.addFolder(new Folder("home", 'root', 'rw', 'r-'))
        this.root.addFolder(new Folder("root", 'root', 'rw', 'r-'))
        this.root.addFolder(new Folder("etc", 'root', 'rw', 'r-'))
        this.root.addFolder(new Folder("bin", 'root', 'rw', 'r-'))

        if(this.root.hasFolder("root")){
            let folder = this.root.searchFolder("root")
            folder.addFile(new File("README.md", "Hello World!", 'root', 'rw', 'r-'))
        }

        if(this.root.hasFolder("var")){
            let folder = this.root.searchFolder("var")
            folder.addFolder(new Folder("log", 'root', 'rw', 'r-'))
            folder = folder.searchFolder("log")
            folder.addFile(new File("auth.log", '[Encrypted!]', 'root', 'rw', 'r-'))
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

    addFolder(folder){
        this.folders.push(folder)
        this.count+=1
    }

    addFile(file){
        this.files.push(file)
        this.count+=1
    }

    searchFolder(fname){
        for(let i=0; i<this.folders.length; i++){
            if(this.folders[i].name == fname) return this.folders[i]
        }
        return null
    }

    searchFile(fname){
        for(let i=0;i<this.files.length; i++){
            if(this.files[i].name == fname) return this.files[i]
        }
        return null
    }

    hasFile(fname){
        for(let i=0;i<this.files.length; i++){
            if(this.files[i].name == fname) return true
        }
        return false
    }

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
}

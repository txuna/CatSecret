import {ALIGN_SIZE} from './config.js'

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
        this.root.addFolder(new Folder("var"))
        this.root.addFolder(new Folder("home"))
        this.root.addFolder(new Folder("root"))
        this.root.addFolder(new Folder("etc"))
        this.root.addFolder(new Folder("bin"))

        if(this.root.hasFolder("root")){
            let folder = this.root.searchFolder("root")
            folder.addFile(new File("README.md", "Hello World!"))
        }

        if(this.root.hasFolder("var")){
            let folder = this.root.searchFolder("var")
            folder.addFolder(new Folder("log"))
        }
    }    
}


class FileStat{
    constructor(){
        this.owner 
        this.other 
        this.readBit 
        this.writeBit 
        this.createAt
        this.modifyAt
    }
}

class Folder extends FileStat{
    /**
     * 
     * @param {string} fname 폴더 이름 
     */
    constructor(fname){
        super()
        this.name = fname
        this.count = 0
        this.folders = []
        this.files = [] 
    }

    addFolder(file){
        this.folders.push(file)
        this.count+=1
    }

    addFile(folder){
        this.files.push(folder)
        this.count+=1
    }

    searchFolder(fname){
        for(let i=0; i<this.folders.length; i++){
            if(this.folders[i].name == fname) return this.folders[i]
        }
    }

    searchFile(fname){
        for(let i=0;i<this.files.length; i++){
            if(this.files[i].name == fname) return this.files[i]
        }
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

class File extends FileStat{
    /**
     * 
     * @param {string} fname 파일 이름  
     * @param {string} fdata 파일 데이터
     */
    constructor(fname, fdata){
        super()
        this.name = fname
        this.date = fdata
        this.size = fdata.length * ALIGN_SIZE
    }
}

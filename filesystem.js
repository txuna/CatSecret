class FileSystem{
    constructor(value){
        this.root = new Folder()
        this.needInit = value
    }

    // 기본적인 컴퓨터 파일시스템 구축 
    init(){
        // Daemon 같은 경우 자체적인 파일시스템 구현 
        if(!this.needInit) return 

        // 일반적인 컴퓨터의 경우 
        //this.root.folders.push(new Folder())
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
    constructor(){
        super()
        this.name 
        this.count 
        this.folders = []
        this.files = [] 
    }

    searchFolder(){

    }

    searchFile(){

    }

    isFile(){

    }

    isFolder(){
        
    }
}

class File extends FileStat{
    constructor(){
        super()
        this.name 
        this.date 
        this.size
    }
}

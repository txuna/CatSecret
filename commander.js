/**
 *  컴퓨터에 존재하는 명령어를 실행하는 클래스
 */
export class Commander{
    /**
     * 
     * @param {Computer} comp 컴퓨터의 자원에 접근하기위한 인자
     */
    constructor(comp){
        this.computer = comp 
    }

    help(){
        return `ls\u2003\u2003show folders and files in current directory
            pwd\u2003show current path in this computer
            help\u2003show command information
            cd\u2003\u2003change directory to given argument directory
        `
    }
    
    ls(){
        let currentPath = this.computer.currentPath
        let fileSystem = this.computer.fileSystem 
        let folder = undefined 
        let output = ''
        /*
        if(fileSystem.root.name == currentPath.name){
            folder = fileSystem.root 
        }else{
            folder = fileSystem.root.searchFolder(currentPath)
        }
        */

        folder = this.computer.currentPath

        /**
         * argv : -al 인자가 들어가면 세부정보 출력
         */
        folder.folders.forEach( f => {
            output += `${f.name}\u2003`
        })

        folder.files.forEach( f => {
            output += `${f.name}\u2003`
        })
        return output
    }

    pwd(){
        return this.computer.currentPath.name
    }

    /**
     * 
     * @param {string} argv 변경할 디렉토리 PATH 
     * path가 존재하는 주소인지
     * path가 파일이 아닌 폴더인지 
     * path에 접근가능한 권한을 가지고 있는지 
     * argv가 상대주소인지 절대주소인지 확인
     * argv가 undefined일 경우 자신의 home path로 이동
     */
    cd(argv){
        let tmpRoot = this.computer.currentPath
        let pathList = undefined
        // 최상위 경로일 경우
        if(argv[0] === '/' && argv.length === 1){
            tmpRoot = this.computer.fileSystem.root
        }else{
            // 절대 주소 
            if(argv[0] === '/'){
                // '/' 삭제
                pathList = argv.split('/').slice(1)  
            }
            // 상대 주소
            else{
                pathList = argv.split('/')
            }
            for(let i=0;i<pathList.length;i++){
                if(tmpRoot.hasFolder(pathList[i])){
                    tmpRoot = tmpRoot.searchFolder(pathList[i])
                }else{
                    return `cd\u2003can not found path: ${argv}`
                }
            }
        }
        
        this.computer.currentPath = tmpRoot
        return ''
    }
    
    cat(argv){

    }

    ps(){

    }

    rm(){

    }

    mkdir(){

    }

    touch(){

    }

    mv(){

    }
    
    cp(){

    }

    


}
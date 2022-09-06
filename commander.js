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
        return this.computer.getFullPathAtDepth()
        //return this.computer.currentPath.name
    }

    ifconfig(){ 
        //\u2424
        return `eth0:\u2003 flags=4163<UP, BROADCAST, RUNNING, MULTICAST> mtu 1500
        inet ${this.computer.interface.ip} netmask 255.255.255.0
        ether ${this.computer.interface.mac} txqueuelen 1000 (Ethernet)`
    }

    /**
     * 
     * @param {string} path 변경할 디렉토리 PATH 
     * path가 존재하는 주소인지
     * path가 파일이 아닌 폴더인지 
     * path에 접근가능한 권한을 가지고 있는지 
     * argv가 상대주소인지 절대주소인지 확인
     * argv가 undefined일 경우 자신의 home path로 이동
     * navigationPath를 이용해서 이동경로 추적 
     * 권한 체크 필요
     */
    cd(path){
        let tmpNavigation = this.computer.getFolderNavigationFromPath(path)
        if(tmpNavigation == null){
            return `cd: not found directory '${path}'`
        }
        /*
            if(!this.computer.checkPermission(tmpNavigation)){
                return `cd: do not have permission ${path}`
            }
        */
        this.computer.navigationPath = tmpNavigation
        this.computer.currentPath = this.computer.getFolderAtDepth()
        return ''
    }
    
    cat(path){

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
import {Computer} from './computer.js'
import { User } from './user.js'

/**
 *  컴퓨터에 존재하는 명령어를 실행하는 클래스
 */
export class Commander{
    /**
     * 
     * @param {Computer} comp 컴퓨터의 자원에 접근하기위한 인자
     * @param {OS} Os 최초의 운영체제에 접근하기위한 인자(시스템 자원 관리)
     */
    constructor(comp, Os){
        this.computer = comp 
        this.os = Os
    }

    help(){
        return `ls\u2003\u2003show folders and files in current directory
            pwd\u2003show current path in this computer
            help\u2003show command information
            cd\u2003\u2003change directory to given argument directory
        `
    }

    history(){
        let output = ''
        this.computer.history.forEach( e => {
            output += `${e}\n`
        })
        return output
    }

    id(){
        let user = this.computer.getUser(this.computer.logOnUser)
        if(user == null){
            return `'${this.computer.logOnUser}' is Invalid User`
        }else{
            return `uid(${user.uid})\u2003uname(${user.name})`
        }
    }

    login(uname, upassword){
        if(this.computer.loginUser(uname, upassword)){
            this.computer.logOnUser = uname
            return `Successfully login ${uname}`
        }else{
            console.log('fail')
            return `Invalid User ${uname}`
        }
    }

    scan(){
        let output = ''
        if(this.os.isConnected){
            return `Already connected other network. Do not scan network`
        }
        output += 'network\u2003\u2003\u2003status\n'
        this.os.networkNodes.forEach( node => {
            output += `${node.interface.ip}\u2003\u2003on`
        })
        return output
    }

    // 해당 ip가 존재하는 노드인지 확인 존재하는 노드라면 해당 노드와 연결
    connect(ip){
        let flag = false
        if(this.os.isConnected){
            return `Already connect other network. Please go to the home.`
        }
        for(const node of this.os.networkNodes){
            if(node.interface.ip == ip){
                this.os.isConnected = true 
                this.os.connectedComputer = node
                node.commander.login('guest', 'guest')
                flag = true
                break 
            }
        }
        if(!flag){
            return `${ip} doesn't exist network!`
        }else{
            return `Successfully Connect! ${ip}`
        }
    }

    // remote connection close and go to home network 
    home(){
        if(!this.os.isConnected){
            return `Alreay Home Network`
        }else{
            this.os.isConnected = false
            this.os.connectedComputer = undefined
            return `Welcome to home!`
        }
    }
    
    ls(){
        let folder = this.computer.currentPath
        let output = ''

        folder.folders.forEach( f => {
            output += `${f.name}\u2003`
        })

        folder.files.forEach( f => {
            output += `${f.name}\u2003`
        })
        return output
    }

    lsDetail(){
        let folder = this.computer.currentPath 
        let output = ''
        
        folder.folders.forEach( f => {
            output += `${f.ownerbit} ${f.otherbit} ${f.owner} ${f.size} ${f.createAt} ${f.name}\n`
        })

        folder.files.forEach( f => {
            output += `${f.ownerbit} ${f.otherbit} ${f.owner} ${f.size} ${f.createAt} ${f.name}\n`
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
    
    cat(filename){
        let flag = false
        let folder = this.computer.currentPath 
        for(const file of folder.files){
            if(filename == file.name){
                console.log(file)
                return this.computer.readFile(file)
            }
        }
        if(!flag){
            return `cat: not found file '${filename}'`
        }
        return output
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
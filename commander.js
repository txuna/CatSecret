import {Computer} from './computer.js'
import { User } from './user.js'
import { File, Folder } from './filesystem.js'

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
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'help'`, 'history')
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
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'history'`, 'history')
        return output
    }

    id(){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'id'`, 'history')
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
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'login ${uname}:${upassword}' Success!`, 'history')
            return `Successfully login ${uname}`
        }else{
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'login ${uname}:${upassword}' Failed!`, 'history')
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
            output += `${node.interface.ip}\u2003\u2003on\n`
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
            return `connect: '${ip}': doesn't exist network!`
        }else{
            this.os.connectedComputer.connectedIP = this.computer.interface.ip
            this.os.connectedComputer.log.writeLog(`${this.computer.interface.ip}-${this.computer.interface.mac} connected!` ,'auth')
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
    
    //  보려는 currentPath가 로그인된 권한으로 읽을 수 있는지 확인
    ls(){
        let folder = this.computer.currentPath
        let output = ''
        if(!this.computer.verifyPermissionAtFolder(folder, 'r')){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'ls': Permission denied!`, 'history')
            return `ls: ${folder.name}: Permission denied`
        }
        folder.folders.forEach( f => {
            output += `${f.name}\u2003`
        })

        folder.files.forEach( f => {
            output += `${f.name}\u2003`
        })
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'ls'`, 'history')
        return output
    }

    lsDetail(){
        let folder = this.computer.currentPath 
        let output = ''
        
        if(!this.computer.verifyPermissionAtFolder(folder, 'r')){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'ls -al': Permission denied!`, 'history')
            return `ls: ${folder.name}: Permission denied`
        }

        folder.folders.forEach( f => {
            output += `${f.ownerbit} ${f.otherbit} ${f.owner} ${f.size} ${f.createAt} ${f.name}\n`
        })

        folder.files.forEach( f => {
            output += `${f.ownerbit} ${f.otherbit} ${f.owner} ${f.size} ${f.createAt} ${f.name}\n`
        })
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'ls -al'`, 'history')
        return output 
    }

    pwd(){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'pwd'`, 'history')
        return this.computer.getFullPathAtDepth()
    }

    ifconfig(){ 
        //\u2424
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'ifconfig'`, 'history')
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
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'cd ${path}'`, 'history')
        let tmpNavigation = this.computer.getFolderNavigationFromPath(path)
        if(tmpNavigation == null){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'cd ${path}': Cannot found directory`, 'history')
            return `cd: '${path}': Cannot found directory`
        }

        if(!this.computer.verifyPermissionFromNavigation(tmpNavigation, 'x')){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'cd ${path}': Permission denied`, 'history')
            return `cd: '${path}': Permission denied`
        }

        this.computer.navigationPath = tmpNavigation
        this.computer.currentPath = this.computer.getFolderAtDepth()
        return ''
    }
    
    cat(filename){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'cat ${filename}'`, 'history')
        let folder = this.computer.currentPath 

        if(!folder.hasFile(filename)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'cat ${filename}': Cannot found file`, 'history')
            return `cat: '${filename}': Cannot found file`
        }
        const file = folder.searchFile(filename)
        let output = this.computer.readFile(file)
        if(output == null){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'cat ${filename}': Permission denied`, 'history')
            return `cat: '${filename}': Permission denied`
        }else{
            return output
        }
    }

    ps(){

    }

    // File 삭제 
    rm(fname){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'rm ${fname}'`, 'history')
        let folder = this.computer.currentPath 

        if(!folder.hasFile(fname)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'rm ${fname}': Cannot found file`, 'history')
            return `rm: '${fname}': Cannot found file`
        }   
        const file = folder.searchFile(fname)

        if(!this.computer.removeFile(file)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'rm ${fname}': Permission denied`, 'history')
            return `rm: '${fname}': Permission denied`
        }
        return 'Successfully remove file'
    }

    // 폴더 삭제
    rmdir(fname){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'rmdir ${fname}'`, 'history')
        let currentfolder = this.computer.currentPath
        if(!currentfolder.hasFolder(fname)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'rmdir ${fname}': Cannot found file`, 'history')
            return `rm: '${fname}': Cannot found folder`
        }   
        const folder = currentfolder.searchFolder(fname)
        if(!this.computer.removeFolder(folder)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'rmdir ${fname}': Permission denied`, 'history')
            return `rmdir: '${fname}': Permission denied`
        }
        return 'Successfully remove folder'
    }

    // 현재폴더에 빈 폴더 생성 
    mkdir(fname){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'mkdir ${fname}'`, 'history')
        let currentFolder = this.computer.currentPath
        if(!this.computer.verifyPermissionAtFolder(currentFolder, 'w')){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'mkdir ${fname}': Permission denied`, 'history')
            return `mkdir: '${fname}': Permission denied`
        }

        if(currentFolder.hasFolder(fname)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'mkdir ${fname}': Already Exist`, 'history')
            return `mkdir: '${fname}': Already Exist`
        }

        const user = this.computer.logOnUser
        const folder = new Folder(fname, user, 'rw', 'r-')
        currentFolder.addFolder(folder)
        return `Successfully made new folder!`
    }

    // 현재 폴더에 빈 파일 생성 
    touch(filename){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'touch ${filename}'`, 'history')
        const folder = this.computer.currentPath 
        if(!this.computer.verifyPermissionAtFolder(folder, 'w')){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'touch ${filename}': Permission denied`, 'history')
            return `touch: '${filename}': Permission denied`
        }
        if(folder.hasFile(filename)){
            this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'touch ${filename}': Already Exist`, 'history')
            return `touch: '${filename}': Already Exist`
        }
        const user = this.computer.logOnUser
        const file = new File(filename, '', user, 'rw', 'r-')
        folder.addFile(file)
        return `Successfully made new file!`
    }

    mv(){

    }
    
    cp(){

    }
}
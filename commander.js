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


    writeLogWithIP(msg, type){
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] ${msg}`, `${type}`)
    }

    vim(fname){

    }

    // 주어진 파일의 mod를 변경한다. 
    chmod(option, ownerMode, otherMode, fname){
        const currentFolder = this.computer.currentPath
        let f = undefined
        if(option == '-File'){
            if(!currentFolder.hasFile(fname)){
                return `chmod: Cannot found ${fname}`
            }
            f = currentFolder.searchFile(fname)
            // 유저 권한 체크 
            if(!this.computer.verifyPermissionAtFile(f, '-')){
                return `chmod: Permission denied!`
            }
        }
        else if(option == '-Folder'){
            if(!currentFolder.hasFolder(fname)){
                return `chmod: Cannout found ${fname}`
            }
            f = currentFolder.searchFolder(fname)
            // 유저 권한 체크 
            if(!this.computer.verifyPermissionAtFolder(f, '-')){
                return `chmod: Permission denied!`
            }
        }else{
            return `chmod: Invalid Option!`
        }
        // 정상적인 mod인지 확인
        if(!this.computer.verifyMode(ownerMode)
            || !this.computer.verifyMode(otherMode)){
                return `chmod: Invalid mode`
        }

        // 해당 디렉토리의 권한 확인 - 실행비트의 존재 유무 
        if(!this.computer.verifyPermissionAtFolder(currentFolder, 'x')){
            return `chown: Permission denied!`
        }

        f.changeOwnerMode(ownerMode)
        f.changeOtherMode(otherMode)
        return `Successfully modified owner at '${fname}'!`

    }

    // 주어진 파일의 소유자를 변경한다. root는 모든 소유자 변경가능 일반 계정은 일반계정끼리만 가능
    chown(option, owner, fname){
        const currentFolder = this.computer.currentPath
        let f = undefined
        if(option == '-File'){
            if(!currentFolder.hasFile(fname)){
                return `chown: Cannot found ${fname}`
            }
            f = currentFolder.searchFile(fname)
            // 유저 권한 체크 
            if(!this.computer.verifyPermissionAtFile(f, '-')){
                return `chown: Permission denied!`
            }
        }
        else if(option == '-Folder'){
            if(!currentFolder.hasFolder(fname)){
                return `chown: Cannout found ${fname}`
            }
            f = currentFolder.searchFolder(fname)
            // 유저 권한 체크 
            if(!this.computer.verifyPermissionAtFolder(f, '-')){
                return `chown: Permission denied!`
            }
        }else{
            return `chown: Invalid Option!`
        }
        // 유저 확인 
        if(!this.computer.hasUser(owner)){
            return `chown: Invalid User '${owner}'`
        }
        // 해당 디렉토리의 권한 확인 - 실행비트의 존재 유무 
        if(!this.computer.verifyPermissionAtFolder(currentFolder, 'x')){
            return `chown: Permission denied!`
        }
        // owner 변경 
        f.changeOwner(owner)

        return `Successfully modified owner at '${fname}'!`
    }

    // 현재 컴퓨터를 분석한다. 
    analysis(){
        let output = ''
        output += `Computer Scanning...\n`
        output += `RAM:\u2003${this.os.totalRam}GB\n`
        output += `CPU:\u2003Intel(R) Core(TM) i7-7700K @ 4.20GHz\n`
        output += `Port Scanning...\n`
        this.computer.ports.forEach( port => {
            let status = port.status? 'OPEN' : 'CLOSE'
            output += `PORT ${port.number}:\u2003[ ${status} ]\n`
        })
        return output
    }

    // 현재 로그인된 계정의 비밀번호를 변경한다. 
    passwd(pw, pw2){
        this.writeLogWithIP(`run command 'passwd'`, 'history')
        let user = this.computer.getUser(this.computer.logOnUser)
        if(user == null){
            return `Invalid User ${this.computer.logOnUser}`
        }
        if(pw != pw2){
            this.writeLogWithIP(`run command 'passwd': Invalid Password [Fail]`, 'history')
            return `Invalid Password`
        }
        user.changePassword(pw)
        this.writeLogWithIP(`run command 'passwd': Successfuly Changed Password [OK]`, 'history')
        return `Successfully Changed Password!`
    }

    // 컴퓨터를 재부팅한다. 
    reboot(){
        this.writeLogWithIP(`run command 'reboot'`, 'history')
        this.computer.turnOff()
        // 5초뒤 설정
        // that을 지정해주어야 함 
        let that = this
        setTimeout(function(){
            that.computer.turnOn()
        }, 5000)

        this.home()
        return 'Starting... Reboot'
        
    }

    // 도움말을 출력한다. 
    help(){
        this.writeLogWithIP(`run command 'help'`, 'history')
        return `ls\u2003\u2003show folders and files in current directory
            pwd\u2003show current path in this computer
            help\u2003show command information
            cd\u2003\u2003change directory to given argument directory
        `
    }

    // 지금까지 쳤던 명령어를 보여준다. 
    history(){
        let output = ''
        this.computer.history.forEach( e => {
            output += `${e}\n`
        })
        this.writeLogWithIP(`run command 'history'`, 'history')
        return output
    }

    // 현재 로그인된 계정을 보여준다. 
    id(){
        this.writeLogWithIP(`run command 'id'`, 'history')
        let user = this.computer.getUser(this.computer.logOnUser)
        if(user == null){
            return `'${this.computer.logOnUser}' is Invalid User`
        }else{
            return `uid(${user.uid})\u2003uname(${user.name})`
        }
    }

    // 현재 로그인되어 있는 계정을 변경한다. 
    login(uname, upassword){
        if(this.computer.loginUser(uname, upassword)){
            //this.computer.logOnUser = uname
            this.writeLogWithIP(`run command 'login ${uname}:${upassword}' Success!`, 'history')
            return `Successfully login ${uname}`
        }else{
            this.writeLogWithIP(`run command 'login ${uname}:${upassword}' Failed!`, 'history')
            return `Invalid User ${uname}`
        }
    }

    // 네트워크상에서 식별된 노드를 검색한다. 
    scan(){
        let output = ''
        if(this.os.isConnected){
            return `Already connected other network. Do not scan network`
        }
        output += 'network\u2003\u2003\u2003status\n'
        this.os.networkNodes.forEach( node => {
            let status = 'OFF'
            if(node.status == true){
                status = 'ON'
            }
            output += `${node.interface.ip}\u2003\u2003${status}\n`
        })
        return output
    }

    // 해당 ip가 존재하는 노드인지 확인 존재하는 노드라면 해당 노드와 연결
    // guest의 비밀번호가 변경되었을시 설정가능하게 해야할듯 옵션을 넣듯이 -P 1234 이렇게 
    connect(ip){
        let flag = false
        if(this.os.isConnected){
            return `Already connect other network. Please go to the home.`
        }
        for(const node of this.os.networkNodes){
            if(node.interface.ip == ip){
                // 만일 해당 컴퓨터가 꺼져있다면 
                if(node.status == false){
                    return `connect: '${ip}': computer turned off!`
                }
                //node.commander.login('guest', 'guest')
                // guest의 비번 변경시 확인 체크 필요
                if(!node.loginUser('guest', 'guest')){
                    return `connect: '${ip}': Invalid 'guest' password!`
                }
                this.os.isConnected = true 
                this.os.connectedComputer = node   
                flag = true
                break 
            }
        }
        if(!flag){
            return `connect: '${ip}': doesn't exist network!`
        }else{
            this.os.connectedComputer.connectedIP = this.computer.interface.ip
            this.os.connectedComputer.log.writeLog(`${this.computer.interface.ip}-${this.computer.interface.mac} connected!`, 'auth')
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
        if(!this.computer.verifyPermissionAtFolder(folder, 'r')
            || !this.computer.verifyPermissionAtFolder(folder, 'x')){
            this.writeLogWithIP(`run command 'ls': Permission denied!`, 'history')
            return `ls: ${folder.name}: Permission denied`
        }
        folder.folders.forEach( f => {
            output += `${f.name}\u2003`
        })

        folder.files.forEach( f => {
            output += `${f.name}\u2003`
        })
        this.writeLogWithIP(`run command 'ls'`, 'history')
        return output
    }

    // ls 커맨드의 세부정보까지 출력한다. 
    lsDetail(){
        let folder = this.computer.currentPath 
        let output = ''
        
        if(!this.computer.verifyPermissionAtFolder(folder, 'r')
            || !this.computer.verifyPermissionAtFolder(folder, 'x')){
            this.writeLogWithIP(`run command 'ls -al': Permission denied!`, 'history')
            return `ls: ${folder.name}: Permission denied`
        }

        folder.folders.forEach( f => {
            output += `${f.ownerbit} ${f.otherbit} ${f.owner} ${f.size} ${f.createAt} ${f.name}\n`
        })

        folder.files.forEach( f => {
            output += `${f.ownerbit} ${f.otherbit} ${f.owner} ${f.size} ${f.createAt} ${f.name}\n`
        })
        this.writeLogWithIP(`run command 'ls -al'`, 'history')
        return output 
    }

    // 현재 있는 경로를 출력한다. 
    pwd(){
        this.writeLogWithIP(`run command 'pwd'`, 'history')
        return this.computer.getFullPathAtDepth()
    }

    // 네트워크 인터페이스를 출력한다. 
    ifconfig(){ 
        //\u2424
        this.writeLogWithIP(`run command 'ifconfig'`, 'history')
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
        this.writeLogWithIP(`run command 'cd ${path}'`, 'history')
        let tmpNavigation = this.computer.getFolderNavigationFromPath(path)
        if(tmpNavigation == null){
            this.writeLogWithIP(`run command 'cd ${path}': Cannot found directory`, 'history')
            return `cd: '${path}': Cannot found directory`
        }

        if(!this.computer.verifyPermissionFromNavigation(tmpNavigation, 'x')){
            this.writeLogWithIP(`run command 'cd ${path}': Permission denied`, 'history')
            return `cd: '${path}': Permission denied`
        }

        this.computer.navigationPath = tmpNavigation
        this.computer.currentPath = this.computer.getFolderAtDepth()
        return ''
    }
    
    // 현재 경로에 있는 파일의 내용을 확인한다. 
    cat(filename){
        this.writeLogWithIP(`run command 'cat ${filename}'`, 'history')
        let folder = this.computer.currentPath 

        if(!folder.hasFile(filename)){
            this.writeLogWithIP(`run command 'cat ${filename}': Cannot found file`, 'history')
            return `cat: '${filename}': Cannot found file`
        }
        const file = folder.searchFile(filename)
        let output = this.computer.readFile(file)
        if(output == null){
            this.writeLogWithIP(`run command 'cat ${filename}': Permission denied`, 'history')
            return `cat: '${filename}': Permission denied`
        }else{
            return output
        }
    }

    ps(){

    }

    // File 삭제 
    rm(fname){
        this.writeLogWithIP(`run command 'rm ${fname}'`, 'history')
        let folder = this.computer.currentPath 

        if(!folder.hasFile(fname)){
            this.writeLogWithIP(`run command 'rm ${fname}': Cannot found file`, 'history')
            return `rm: '${fname}': Cannot found file`
        }   
        const file = folder.searchFile(fname)

        if(!this.computer.removeFile(file)){
            this.writeLogWithIP(`run command 'rm ${fname}': Permission denied`, 'history')
            return `rm: '${fname}': Permission denied`
        }
        return 'Successfully remove file'
    }

    // 폴더 삭제 
    rmdir(fname){
        this.writeLogWithIP(`run command 'rmdir ${fname}'`, 'history')
        let currentfolder = this.computer.currentPath
        if(!currentfolder.hasFolder(fname)){
            this.writeLogWithIP(`run command 'rmdir ${fname}': Cannot found file`, 'history')
            return `rm: '${fname}': Cannot found folder`
        }   
        const folder = currentfolder.searchFolder(fname)
        if(!this.computer.removeFolder(folder)){
            this.writeLogWithIP(`run command 'rmdir ${fname}': Permission denied`, 'history')
            return `rmdir: '${fname}': Permission denied`
        }
        return 'Successfully remove folder'
    }

    // 현재폴더에 빈 폴더 생성 
    mkdir(fname){
        this.writeLogWithIP(`run command 'mkdir ${fname}'`, 'history')
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] run command 'mkdir ${fname}'`, 'history')
        let currentFolder = this.computer.currentPath
        // 해당 폴더에 쓰기비트와 실행비트 켜져있어야 함 
        if(!this.computer.verifyPermissionAtFolder(currentFolder, 'w')
            || !this.computer.verifyPermissionAtFolder(currentFolder, 'x')){
            this.writeLogWithIP(`run command 'mkdir ${fname}': Permission denied`, 'history')
            return `mkdir: '${fname}': Permission denied`
        }

        if(currentFolder.hasFolder(fname)){
            this.writeLogWithIP(`run command 'mkdir ${fname}': Already Exist`, 'history')
            return `mkdir: '${fname}': Already Exist`
        }

        const user = this.computer.logOnUser
        const folder = new Folder(fname, user, 'rwx', 'r-x')
        currentFolder.addFolder(folder)
        return `Successfully made new folder!`
    }

    // 현재 폴더에 빈 파일 생성 
    touch(filename){
        this.writeLogWithIP(`run command 'touch ${filename}'`, 'history')
        const folder = this.computer.currentPath 
        // 해당 폴더에 실행비트와 쓰기비트 켜져있어야 함 
        if(!this.computer.verifyPermissionAtFolder(folder, 'w')
            || !this.computer.verifyPermissionAtFolder(folder, 'x')){
            this.writeLogWithIP(`run command 'touch ${filename}': Permission denied`, 'history')
            return `touch: '${filename}': Permission denied`
        }
        if(folder.hasFile(filename)){
            this.writeLogWithIP(`run command 'touch ${filename}': Already Exist`, 'history')
            return `touch: '${filename}': Already Exist`
        }
        const user = this.computer.logOnUser
        const file = new File(filename, '', user, 'rw-', 'r--')
        folder.addFile(file)
        return `Successfully touch new file!`
    }

    mv(){

    }
    
    cp(){

    }
}
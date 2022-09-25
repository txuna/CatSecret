import { PROCESS_RAM } from "./config.js"

const FPS = 60

/**
 * 명령어가 아닌 프로그램을 구성 해당 프로그램은 정해진 시간만큼 update가 지속적 호출
 * 프로그램이 실행중에는 명령어 입력 비활성화
 * 컴퓨터의 securityLevel에 따라 달라짐
 * 실행 도중 다른 PC로 connect시 성공완료 되어도 네트워크환경 ERROR 뜨게 하기
 */
class Tool{
    /**
     * @param {OS} os
     * @param {Int} programTime 
     * @param {Terminal} terminal 
     * @param {String} name 
     * @param {Int} ram 
     * @param {String} command 
     * @param {User} user 
     */
    constructor(os, programTime, terminal, name, ram, command, user, canLevel){
        this.os = os
        this.programTime = programTime
        this.isRunning = false
        this.terminal = terminal
        this.toolName = name
        this.usedRam = ram
        this.user = user
        this.command = command
        this.startTime = ''
        this.thisIP = undefined
        this.runningTime = 0
        this.canLevel = canLevel
        this.computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
    }

    isRoot(){
        if(this.computer.logOnUser == 'root'){
            return true
        }else{
            let msg = {
                'is_command' : false, 
                'output' : `${this.toolName}: Permission denied`,
            }
            this.terminal.writeTerminal(msg)
            this.writeLogWithIP(`Failed run program: '${this.command}'`, 'history')
            return false
        }
    }

    verifyPermission(){
        this.isRunning = false
        if(this.computer.securityLevel > this.canLevel){
            let msg = {
                'is_command' : false, 
                'output' : `${this.toolName}: Need Higher Permission...!`,
            }
            this.terminal.writeTerminal(msg)
            this.writeLogWithIP(`Failed run program: '${this.command}'`, 'history')
            return false
        }
        if(this.computer.interface.ip != this.thisIP){
            let msg = {
                'is_command' : false, 
                'output' : `${this.toolName}: Network Error...!`,
            }
            this.terminal.writeTerminal(msg)
            this.writeLogWithIP(`Failed run program: '${this.command}'`, 'history')
            return false
        }
        return true
    }

    writeLogWithIP(msg, type){
        //const computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        this.computer.log.writeLog(`[${this.computer.connectedIP}] [${this.computer.logOnUser}] ${msg}`, `${type}`)
    }

    run(){
        //const computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        this.thisIP = this.computer.interface.ip
        this.isRunning = true
        let date = new Date()
        this.startTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
        this.writeLogWithIP(`run program: '${this.command}'`, 'history')
    }

    update(){
        if(!this.isRunning){
            return
        }
        if(this.runningTime == this.programTime){
            let msg = {
                'is_command' : false, 
                'output' : `Program: '${this.toolName}' is Finished!`,
            }
            this.terminal.writeTerminal(msg)
            this.finished()
        }else{
            this.runningTime+=1
        }
    }
    
    status(){
        const percent = (this.runningTime / this.programTime * 100).toFixed(1)
        const pid = 1
        const now = this.isRunning ? 'RUN' : 'EXIT'
        return `${this.user.name}\u2003${pid}\u2003${this.usedRam}G\u2003${this.startTime}\u2003${(this.runningTime/FPS).toFixed(1)}s(${percent}%)\u2003${now}\u2003${this.command}\n`
    }
}

/**
 * CLOSE되어있는 portNumber를 OPEN하는 클래스
 */
export class PortHack extends Tool{
    constructor(os, terminal, command, user, canLevel, number){
        super(os, 10 * FPS, terminal, 'PortHack', PROCESS_RAM.PortHack, command, user, canLevel)
        this.number = number
        this.canLevel = canLevel
        this.run()
    }

    // PORT OPEN
    finished(){
        this.isRunning = false
        //const computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        if(!this.verifyPermission()){
            return
        }
        if(!this.isRoot()){
            return
        }
        this.computer.openPort(this.number)
        let msg = {
            'is_command' : false, 
            'output' : `PortHack.exe: Successfully open Port ${this.number}`,
        }
        this.terminal.writeTerminal(msg)
    }

}

/**
 * 현재 연결된 컴퓨터의 계정을 root로 변경한다. 
 */
export class RootKit extends Tool{
    constructor(os, terminal, command, user, canLevel){
        super(os, 15 * FPS, terminal, 'RootKit', PROCESS_RAM.RootKit, command, user, canLevel)
        this.run()
    }

    // GET ROOT
    finished(){
        //const computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        this.isRunning = false
        if(!this.verifyPermission()){
            return
        }
        this.computer.loginRoot()
        //let comp_msg = `[${this.computer.logOnUser}@${this.computer.interface.ip} ${this.computer.getFullPathAtDepth()}]`
        this.terminal.computer.innerText = `[${this.computer.logOnUser}@${this.computer.interface.ip} ${this.computer.getFullPathAtDepth()}]# `
        let msg = {
            'is_command' : false, 
            'output' : `RootKit.exe: Successcfully get root!`,
        }
        this.terminal.writeTerminal(msg)
    }
}

export class MineHack extends Tool{
    constructor(os, terminal, command, user, canLevel){
        super(os, 3 * FPS, terminal, 'MineHack', PROCESS_RAM.MineHack, command, user, canLevel)
        this.run()
    }
    
    //GET BALANCE
    finished(){
        this.isRunning = false
        if(!this.verifyPermission()){
            return
        }
        if(!this.isRoot()){
            return
        }
        this.os.earnBalance(37.5)
        let msg = {
            'is_command' : false, 
            'output' : `MineHack.exe: Successcfully earn Balance 37.5$`,
        }
        this.terminal.writeTerminal(msg)
    }
}
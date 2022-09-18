
const FPS = 60

/**
 * 명령어가 아닌 프로그램을 구성 해당 프로그램은 정해진 시간만큼 update가 지속적 호출
 * 프로그램이 실행중에는 명령어 입력 비활성화
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
    constructor(os, programTime, terminal, name, ram, command, user){
        this.os = os
        this.programTime = programTime
        this.isRunning = false
        this.terminal = terminal
        this.toolName = name
        this.usedRam = ram
        this.user = user
        this.command = command
        this.startTime = ''
    }

    run(){
        this.isRunning = true
        let date = new Date()
        this.startTime = `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`
    }

    update(){

    }
    
    status(){
        const pid = 1
        const now = this.isRunning ? 'RUN' : 'EXIT'
        return `${this.user.name}\u2003${pid}\u2003${this.usedRam}G\u2003${this.startTime}\u2003${(this.runningTime/FPS).toFixed(1)}s\u2003${now}\u2003${this.command}\n`
    }
}

/**
 * CLOSE되어있는 portNumber를 OPEN하는 클래스
 */
export class PortHack extends Tool{
    constructor(os, terminal, command, user){
        super(os, 10 * FPS, terminal, 'PortHack', 2, command, user)
        this.runningTime = 0
        this.run()
    }

    update(){
        if(!this.isRunning){
            return
        }
        if(this.runningTime == this.programTime){
            let msg = {
                'is_command' : false, 
                'output' : `PORT HACKED!`,
            }
            this.terminal.writeTerminal(msg)
            this.isRunning = false
        }else{
            this.runningTime+=1
        }
    }
}

/**
 * 현재 연결된 컴퓨터의 계정을 root로 변경한다. 
 */
export class RootKit extends Tool{
    constructor(){

    }
}
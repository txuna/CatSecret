import {Computer} from './computer.js'
import {Program} from './program.js'

/**
 * 사용자의 명령 수행 및 컴퓨터 관리, 실행프로세스 관리 
 * 사용자의 명령은 isConnected에 따라 원격접속 컴퓨터인지 로컬컴퓨터인지 확인
 */
export class OS{
    constructor(){
        this.baseRam = 4
        this.additionalRam = 0
        this.totalRam = this.baseRam + this.additionalRam

        this.exeProcessList = [] 
        this.thisComputer = new Computer()
        this.connectedComputer = undefined
        this.isConncted = false
        this.program = new Program()

        this.init()
    }

    init(){
        
    }

    /**
     * 
     * @param {string} command 명령어
     */
    execute(command){
        if(this.isConncted){
            this.connectedComputer.execute(command)
        }else{
            this.thisComputer.execute(command)
        }
        return `test.c\u2003.bash_history\u2003README.md`
    }

    update(){
        /*
        this.exeProcessList.forEach( process => {
            process.update()
        })
        */
        /*
        if(this.isConncted){
            this.connectedComputer.update()
        }else{
            this.thisComputer.update()
        }
        */
    }
}
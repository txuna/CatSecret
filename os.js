import {Computer} from './computer.js'
import {Program} from './program.js'
import {myComputerNode} from './config.js'
import {computerNodeList} from './config.js'

/**
 * 사용자의 명령 수행 및 컴퓨터 관리, 실행프로세스 관리 
 * 사용자의 명령은 isConnected에 따라 원격접속 컴퓨터인지 로컬컴퓨터인지 확인
 */
export class OS{
    constructor(){
        this.networkNodes = []
        this.baseRam = 4
        this.additionalRam = 0
        this.totalRam = this.baseRam + this.additionalRam
        this.exeProcessList = [] 
        this.thisComputer = false
        this.connectedComputer = undefined
        this.isConnected = undefined
        this.program = new Program()

        this.init()
    }

    // 컴퓨터 객체 생성시 로그인 코드 ON 
    init(){
        this.thisComputer = new Computer(myComputerNode, this)
        this.thisComputer.commander.login('tuuna', 'tuuna1234')

        computerNodeList.forEach( node => {
            this.networkNodes.push(new Computer(node, this)) 
        })
    }

    /**
     * 
     * @param {string} command 명령어 문자열 
     * @returns 명령어의 수행결과 반환
     */
    execute(command){
        let result 

        if(this.isConnected){
            result = this.connectedComputer.execute(command)
        }else{
            result = this.thisComputer.execute(command)
        }
        return result
        //return `test.c\u2003.bash_history\u2003README.md`
    }

    update(){
        /*
        this.exeProcessList.forEach( process => {
            process.update()
        })
        */
        /*
        if(this.isConnected){
            this.connectedComputer.update()
        }else{
            this.thisComputer.update()
        }
        */
    }
}
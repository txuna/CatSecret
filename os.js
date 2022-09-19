import {Computer} from './computer.js'
import {myComputerNode, PROCESS_RAM} from './config.js'
import {computerNodeList} from './config.js'
import { Program } from './program.js'

/**
 * 사용자의 명령 수행 및 컴퓨터 관리, 실행프로세스 관리 
 * 사용자의 명령은 isConnected에 따라 원격접속 컴퓨터인지 로컬컴퓨터인지 확인
 */
export class OS{
    constructor(vim, terminal){
        this.networkNodes = []
        this.baseRam = 4
        this.additionalRam = 0
        this.usedRam = 0
        this.totalRam = this.baseRam + this.additionalRam
        this.exeProcessList = [] 
        this.thisComputer = false
        this.connectedComputer = undefined
        this.isConnected = undefined
        this.vim = vim
        this.terminal = terminal
        this.program = new Program(this, this.terminal)

        this.init()
    }

    // 컴퓨터 객체 생성시 로그인 코드 ON 
    init(){
        this.thisComputer = new Computer(myComputerNode, this.terminal, this)
        this.thisComputer.connectedIP = this.thisComputer.interface.ip
        this.thisComputer.commander.login('tuuna', 'tuuna1234')

        computerNodeList.forEach( node => {
            this.networkNodes.push(new Computer(node, this.terminal, this)) 
        })
    }

    /**
     * network노드들중에서 인자로 주어진 ip를 가진 컴퓨터를 반환한다. 
     * @param {String} ip 
     * @returns NULL OR Computer
     */
    getComputerNodeFromIP(ip){
        for(const computer of this.networkNodes){
            if(computer.interface.ip == ip){
                return computer
            }
        }
        return null
    }

    /**
     * 명령을 수행한다. OS에 존재하는 프로그램이냐, 컴퓨터에 존재하는 명령어에 따라 구별
     * 사용램 체크
     * @param {string} command 명령어 문자열 
     * @param {string} type    해당 명령어가 VIM명령어인지 TERM명령어인지 확인
     * @returns 명령어의 수행결과 반환
     */
    execute(command, type){
        let result 
        const user = this.thisComputer.getUser(this.thisComputer.logOnUser)
        if(user == null){
            return `Invalid User`
        }
        let flag = false 
        for(const name of ['PortHack.exe', 'RootKit.exe']){
            if(command.split(' ')[0].includes(name)){
                flag = true
            }
        }
        if(flag){
            // 프로그램 사용
            return this.program.execute(command, user)

        }else{
            // 일반 명령어 
            if(this.isConnected){
                result = this.connectedComputer.execute(command, type)
            }else{
                result = this.thisComputer.execute(command, type)
            }
            return result
        }

        
    }

    // 프로세스 상태가 종료된것들 종료
    endProcess(){
        this.exeProcessList = this.exeProcessList.filter((process) => (process.isRunning))
    }

    update(){
        let tmpRam = 0
        this.exeProcessList.forEach( process => {
            process.update()
            tmpRam += process.usedRam
        })
        this.usedRam = tmpRam

        this.endProcess()
        /*
        if(this.isConnected){
            this.connectedComputer.update()
        }else{
            this.thisComputer.update()
        }
        */
    }
}
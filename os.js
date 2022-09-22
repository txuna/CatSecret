import {Computer} from './computer.js'
import {myComputerNode, PROCESS_RAM} from './config.js'
import {computerNodeList} from './config.js'
import { Program } from './program.js'
import { MissionManager, getAdminMission, FileUploadMission, FileDeleteMission } from './mission.js'

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
        this.missionManager = new MissionManager()
        this.init()
        this.loadMission()
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

    loadMission(){
        this.missionManager.append(
            new getAdminMission(this, 
                'Robber Root!', 
                'IP : 13.23.27.8에 접속하여 root권한을 탈취하라!', 
                '13.23.27.8', 
                'root')
        )

        this.missionManager.append(
            new FileUploadMission(this, 
                'Backdoor Upload!', 
                'IP : 13.23.27.8에 접속하여 /root 폴더에 backdoor파일을 업로드하여라!', 
                'backdoor',
                '/root',
                '13.23.27.8')
        )

        this.missionManager.append(
            new FileDeleteMission(this,
                'Delete README.md!',
                'IP : 13.23.27.8에 접속하여 /root 폴더에서 README.md파일을 삭제해라!',
                'README.md',
                '/root',
                '13.23.27.8')
        )
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

        this.missionManager.update()

        /*
        if(this.isConnected){
            this.connectedComputer.update()
        }else{
            this.thisComputer.update()
        }
        */
    }
}
import {OS} from './os.js'
import {Terminal} from './terminal.js'

export class Game{
    constructor(){
        this.os = new OS() 
        this.terminal = new Terminal()

        this.terminal.command.addEventListener('keypress', ({keyCode}) => {
            if(keyCode === 13){
                this.execute()
            }
        })

        this.init()
    }

    init(){
        let computer = this.os.isConncted ? this.os.connectedComputer : this.os.thisComputer
        this.terminal.computer.innerText = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}] #`
    }

    execute(){
        if(this.terminal.command.value === ''){
            return 
        }
        if(this.terminal.command.value.trim().split(' ') == 'clear'){
            this.terminal.clear()
            return 
        }

        // 컴퓨터의 IP 및 로그인된 사용자의 계정을 불러온다.
        let computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        let comp_msg = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}]`
        
        let output = this.os.execute(this.terminal.command.value)

        let msg = {
            'is_command' : true, 
            'command' : this.terminal.command.value, 
            'output' : output,
            'computer' : comp_msg
        }
        this.terminal.writeTerminal(msg)

        // connect 명령어시 해당 컴퓨터가 연결되었는지에 따라 다시 체크
        computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        this.terminal.computer.innerText = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}] #`
    }

    update(){
        this.os.update()
    }

    draw(){

    }
}

const game = new Game()
// DEBUG!
window.game = game 

function animate(){
    requestAnimationFrame(animate)
    game.update()
}

animate()
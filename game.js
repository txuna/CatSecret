import {OS} from './os.js'
import {Terminal} from './terminal.js'
import { Vim } from './vim.js'

const NORMAL = true 
const INSERT = false

export class Game{
    constructor(){
        // VIM EDITOR
        this.vim = new Vim()
        this.vim.vimCommand.addEventListener('keypress', ({keyCode}) => {
            if(keyCode === 13){
                // 저장하고 나가기
                if(this.vim.vimCommand.value == 'wq'){
                    // 컴퓨터의 IP 및 로그인된 사용자의 계정을 불러온다.
                    let computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
                    // comp_msg : [tuuna@localhost 경로]#
                    let comp_msg = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}]`
                    let command_string = this.vim.vimCommand.value
                    let output = this.os.execute(this.vim.vimCommand.value, 'VIM')

                    let msg = {
                        'is_command' : true, 
                        'command' : `vim command: '${command_string}'`, 
                        'output' : output,
                        'computer' : comp_msg
                    }
                    this.terminal.writeTerminal(msg)
                }   
            }
        })

        this.vim.vimTextarea.addEventListener('keydown', (e) => {
            if(e.key == 'Escape' && this.vim.mode == INSERT){
                this.vim.setNormalVim()
            }
            else if(e.key == 'i' && this.vim.mode == NORMAL){
                this.vim.setInsertVim()
            }
        })

        
        this.terminal = new Terminal()
        this.os = new OS(this.vim, this.terminal) 

        this.terminal.command.addEventListener('keypress', ({keyCode}) => {
            if(keyCode === 13){
                this.execute()
            }
        })

        this.init()
    }

    init(){
        let computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        this.terminal.computer.innerText = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}]# `
    }

    // 쓰여진 값을 가지고 와서 자동완성
    autoComplete(){

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
        // comp_msg : [tuuna@localhost 경로]#
        let comp_msg = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}]`

        let output = this.os.execute(this.terminal.command.value, 'TERM')

        let msg = {
            'is_command' : true, 
            'command' : this.terminal.command.value, 
            'output' : output,
            'computer' : comp_msg
        }
        this.terminal.writeTerminal(msg)

        // connect 명령어시 해당 컴퓨터가 연결되었는지에 따라 다시 체크
        computer = this.os.isConnected ? this.os.connectedComputer : this.os.thisComputer
        this.terminal.computer.innerText = `[${computer.logOnUser}@${computer.interface.ip} ${computer.getFullPathAtDepth()}]# `
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
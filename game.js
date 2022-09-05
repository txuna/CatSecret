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
    }

    execute(){
        if(this.terminal.command.value === '') return 
        
        let output = this.os.execute(this.terminal.command.value)
        let msg = {
            'is_command' : true, 
            'command' : this.terminal.command.value, 
            'output' : output
        }
        this.terminal.writeTerminal(msg)
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
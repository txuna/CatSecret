
export class Terminal{
    constructor(){
        this.vim = document.querySelector('.vim')
        this.term = document.querySelector(".terminal") 
        this.output_list = document.querySelector(".terminal ul")
        this.command = document.querySelector(".input input")
        this.computer = document.querySelector(".input span")
    }

    clear(){
        this.output_list.innerHTML = ''
        this.command.value = ''
    }
    
    writeTerminal(msg){
        let li = document.createElement("li")
    
        let output_div = document.createElement('div')
        let output_span = document.createElement('span')
        output_span.innerText = msg['output']
        output_div.appendChild(output_span)
    
        if(msg['is_command']){
            let input_div = document.createElement('div')
            let name_span = document.createElement("span")
            name_span.innerText = `${msg['computer']}# `
            let command_span = document.createElement('span')
            command_span.innerText = msg['command']
    
            input_div.appendChild(name_span)
            input_div.appendChild(command_span)
            li.appendChild(input_div)
        }
        
        li.appendChild(output_div)
        this.output_list.appendChild(li)

        this.command.value = ''
        this.term.scrollTop = this.term.scrollHeight;
    }

}


export class Terminal{
    constructor(){
        this.term = document.querySelector(".terminal") 
        this.output_list = document.querySelector(".terminal ul")
        this.command = document.querySelector(".input input")

        
    }
    
    writeTerminal(msg){
        let li = document.createElement("li")
    
        if(msg['is_command']){
            let input_div = document.createElement('div')
            let name_span = document.createElement("span")
            name_span.innerText = '[tuuna@localhost ~]# '
            let command_span = document.createElement('span')
            command_span.innerText = msg['command']
    
            input_div.appendChild(name_span)
            input_div.appendChild(command_span)
            li.appendChild(input_div)
        }
    
        let output_div = document.createElement('div')
        let output_span = document.createElement('span')
        output_span.innerText = msg['output']
        output_div.appendChild(output_span)
    
        
        li.appendChild(output_div)
        this.output_list.appendChild(li)

        this.command.value = ''
        this.term.scrollTop = this.term.scrollHeight;
    }
}

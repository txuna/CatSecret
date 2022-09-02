
class OS{
    constructor(){
        this.baseRam = 4
        this.additionalRam = 0
        this.totalRam = this.baseRam + this.additionalRam

        this.exeProcessList = [] 
        this.thisComputer = new Computer()
        this.connectedComputer = undefined
        this.isConncted = false
        this.program = undefined

        this.init()
    }

    init(){
        
    }

    execute(){
        return `test.c\u2003.bash_history\u2003README.md`
    }

    update(){
        if(this.isConncted){
            this.connectedComputer.update()
        }else{
            this.thisComputer.update()
        }
    }
}
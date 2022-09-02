class Computer{
    constructor(){
        this.ip
        this.services = [] 
        this.fileSystem = new FileSystem() 
        this.ports = []  //Ports
        this.firewall 
    }

    init(){

    }

    update(){
        /*
        this.services.forEach(service => {
            service.update()
        })
        */
    }
}

class Port{
    constructor(){
        this.isOpen 
        this.number 
    }
    openPort(){
        this.isOpen = true
    }

    closePort(){
        this.isOpen = false 
    }
}
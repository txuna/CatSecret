export class Status{
    constructor(os){
        this.os = os
        this.name = document.querySelector('#status__name')
        this.balance = document.querySelector('#status__balance')
        this.hacking = document.querySelector('#status__hacking')
        this.cpu = document.querySelector('#status__cpuSize')
        this.cpuName = document.querySelector('#status__cpuName')

        this.ram = document.querySelector('#status__ramSize')
        this.ramName = document.querySelector('#status__ramName')
    }

    update(){
        this.name.innerText = this.os.name 
        this.balance.innerText = `${this.os.balance}$`
        this.hacking.innerText = `${this.os.hacking} Level`
        this.cpu.innerText = `${this.os.cpu.size}% Usage`
        this.cpuName.innerText = `${this.os.cpu.name}`

        this.ram.innerText = `${this.os.ram.used}G / ${this.os.ram.size}G (${this.os.ram.used / this.os.ram.size * 100}%)Usage`
        this.ramName.innerText = `${this.os.ram.name}`
    }
}
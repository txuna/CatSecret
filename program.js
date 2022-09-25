import {PortHack, RootKit, MineHack} from './tools.js'
import { PROCESS_RAM, LOW_SECURITY } from './config.js'

export class Program{
    constructor(os, terminal){
        this.os = os
        this.terminal = terminal
    }

    execute(command, user){
        let parse = command.trim().split(' ')
        let com = parse[0]
        let argv = parse.slice(1)
        switch(com){

            case 'MineHack.exe':
                if(this.os.usedRam + PROCESS_RAM.MineHack > this.os.totalRam){
                    return `Exceed RAM..! Please Upgrade RAM!`
                }
                this.os.exeProcessList.push(
                    new MineHack(this.os, this.terminal, command, user, LOW_SECURITY)
                )
                return `MineHack.exe is running`

            case 'PortHack.exe':
                if(parse.length != 2){
                    return `Usage: PortHack.exe [PORT NUMBER]`
                }
                if(this.os.usedRam + PROCESS_RAM.PortHack > this.os.totalRam){
                    return `Exceed RAM..! Please Upgrade RAM!`
                }
                this.os.exeProcessList.push(
                    new PortHack(this.os, this.terminal, command, user, LOW_SECURITY, argv[0])
                )
                return `PortHack.exe is running!`

            case 'RootKit.exe':
                if(this.os.usedRam + PROCESS_RAM.RootKit > this.os.totalRam){
                    return `Exceed RAM..! Please Upgrade RAM!`
                }
                this.os.exeProcessList.push(
                    new RootKit(this.os, this.terminal, command, user, LOW_SECURITY)
                )
                return `RootKit.exe is running!`

            default:
                return `Invalid Program`
        }
    }
}
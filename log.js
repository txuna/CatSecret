import { File } from "./filesystem.js"

/**
 * 각종 로그를 담당하는 클래스 
 */
export class Log{
    constructor(logF){
        this.logFolder = logF
        this.authLog = undefined
        this.historyLog = undefined
        this.makeLogFile()
    }

    makeLogFile(){
        // 로그인 시도 정보 및 접근 정보 
        if(!this.logFolder.hasFile('auth.log')){
            this.logFolder.addFile(new File('auth.log', '', 'root', 'rwx', 'r--'))
        }
        this.authLog = this.logFolder.searchFile('auth.log')
        // 명령어 시도 정보 
        if(!this.logFolder.hasFile('history.log')){
            this.logFolder.addFile(new File('history.log', '', 'root', 'rwx', 'r--'))
        }
        this.historyLog = this.logFolder.searchFile('history.log')
    }

    // log는 권한 체크 X 
    writeLog(msg, type){
        this.makeLogFile()
        switch(type){
            case 'auth':
                this.authLog.writeData(`[${new Date().toLocaleString()}] ${msg}`)
                break 

            case 'history':
                this.historyLog.writeData(`[${new Date().toLocaleString()}] ${msg}`)
                break
        }
    }
}
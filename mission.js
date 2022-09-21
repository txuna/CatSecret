import { FIN, NOT_START, PROGRESSING } from "./config.js"

/**
 * Mission들을 관리하는 클래스
 */
export class MissionManager{
    constructor(os, terminal){
        this.htmlMissions = document.querySelector(".mission__list")
        this.os = os
        this.terminal = terminal 
        this.missionList = [] /* Mission Class */
    }

    append(mission){
        this.missionList.push(mission)
    }

    createMissionHTML(mission){
        this.htmlMissions.innerHTML = ''
        let missionDiv = document.createElement('div')
        missionDiv.classList.add('mission')
        let div = document.createElement('div')

        let spanTitle = document.createElement('span')
        spanTitle.classList.add('mission__title')

        let spanDescription = document.createElement('span')
        spanDescription.classList.add('mission__description')

        let status = mission.status==FIN ? '[완료]' : '[진행중]'
        spanTitle.innerText = `${status}${mission.name}`
        
        spanDescription.innerText = `${mission.description}`

        if(mission.status == FIN){
            let del = document.createElement('del')
            del.appendChild(spanTitle)
            del.appendChild(spanDescription)
            div.appendChild(del)
        }else{
            div.appendChild(spanTitle)
            div.appendChild(spanDescription)
        }
        missionDiv.appendChild(div)
        this.htmlMissions.appendChild(missionDiv)
    }


    update(){
        this.missionList.forEach( mission => {
            if(mission.status == PROGRESSING){
                mission.update()
            }
        })

        this.missionList.forEach(mission => {
            this.createMissionHTML(mission)
        })
    }
}

/**
 * update함수가 매 프레임 돌면서 is_finished를 체크한다. 
 */
class Mission{
    constructor(os, name, description, status){
        this.os = os
        this.name = name
        this.description = description
        this.status = status
    }

    finish(){

    }

    isComplete(){

    }

    update(){
        if(!this.isComplete()){
            return
        }else{
            this.finish()
        }
    }
}

/**
 * targetIP로 주어진 곳에서 logOnUser가 targetID와 같을 시 성공
 */
export class getAdminMission extends Mission{
    /**
     * 
     * @param {String} name 
     * @param {Int} status 
     * @param {String} targetIP 
     * @param {String} targetID 
     */
    constructor(os, name, description, targetIP, targetID){
        super(os, name, description, PROGRESSING)
        this.targetComputer = this.os.getComputerNodeFromIP(targetIP)
        this.targetIP = targetIP 
        this.targetID = targetID
    }

    finish(){
        this.status = FIN
        console.log(`Mission:'${this.name}' is completed!`)
    }

    isComplete(){
        const user = this.targetComputer.getUser(this.targetComputer.logOnUser)
        if(user == null) return 
        if(user.name != this.targetID) return 
        
        this.finish()
    }
}

class FileUploadMission extends Mission{
    constructor(){

    }

    finish(){

    }

    isComplete(){
        
    }

}

class FileDeleteMission extends Mission{
    constructor(){

    }

    finish(){

    }

    isComplete(){
        
    }

}




class FileDownLoadMission extends Mission{
    constructor(){
        
    }

    finish(){

    }

    isComplete(){
        
    }

}
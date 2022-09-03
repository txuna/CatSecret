/**
 *  컴퓨터에 존재하는 명령어를 실행하는 클래스
 */
export class Commander{
    /**
     * 
     * @param {Computer} comp 컴퓨터의 자원에 접근하기위한 인자
     */
    constructor(comp){
        this.computer = comp 
    }
    
    ls(){
        console.log(this.computer)
    }
}
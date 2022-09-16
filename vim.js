const NORMAL = true 
const INSERT = false

export class Vim{
    constructor(comm){
        this.vimDocument = document.querySelector('.vim')
        this.termDocument = document.querySelector(".terminal") 
        this.vimTextarea = document.querySelector('.vim textarea')
        this.vimCommand = document.querySelector('.command input')
        this.vimSpan = document.querySelector('.mode span')
        this.mode = NORMAL
        this.commander = comm
        this.workingFile = undefined

        this.vimCommand.addEventListener('keypress', ({keyCode}) => {
            if(keyCode === 13){
                // 저장하고 나가기
                if(this.vimCommand.value == 'wq'){
                    this.closeVim()
                }   
                // 저장만
                else if(this.vimCommand.value == 'w'){

                }
                // 저장안하고 나가기
                else if(this.vimCommand.value == 'q'){
                    this.closeVim()
                }
            }
        })
        // 글 작성중 N 누를시 전환됨 textarea가 아닌 곳으로 해야할듯 
        this.vimTextarea.addEventListener('keypress', ({keyCode}) => {
            if(keyCode == 110 && this.mode == INSERT){
                this.setNormalVim()
                this.mode = NORMAL
            }
            else if(keyCode == 105 && this.mode == NORMAL){
                this.setInsertVim()
                this.mode = INSERT
            }
        })
    }
    
    // command 입력 가능, textarea 입력 불가능
    setNormalVim(){
        this.vimTextarea.readOnly = true
        this.vimCommand.readOnly = false
        this.vimCommand.value = ''
        this.vimSpan.innerText = 'Normal'
    }

    // command 입력 불가능, textarea 입력 가능 
    setInsertVim(){
        this.vimTextarea.readOnly = false
        this.vimCommand.readOnly = true
        this.vimCommand.value = ''
        this.vimSpan.innerText = 'Insert'
    }

    openVim(file){
        this.workingFile = file
        this.vimDocument.classList.remove('hide')
        this.termDocument.classList.add('hide')
        this.vimTextarea.focus()
        this.vimTextarea.value = this.workingFile.readData()
        this.setNormalVim()
    }

    // VIM을 닫으면서 지금까지의 내용 commander의 closeVim 호출
    closeVim(){
        this.vimDocument.classList.add('hide')
        this.termDocument.classList.remove('hide')

        const value = this.vimTextarea.value

        this.vimTextarea.value = ''
        this.vimCommand.value = ''
        this.commander.closeVim(this.workingFile, value)
    }
}
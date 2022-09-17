const NORMAL = true 
const INSERT = false

export class Vim{
    constructor(){
        this.vimDocument = document.querySelector('.vim')
        this.termDocument = document.querySelector(".terminal") 
        this.vimTextarea = document.querySelector('.vim textarea')
        this.vimCommand = document.querySelector('.command input')
        this.vimSpan = document.querySelector('.mode span')
        this.mode = NORMAL
        this.workingFile = undefined

    }
    
    // command 입력 가능, textarea 입력 불가능
    setNormalVim(){
        this.mode = NORMAL
        this.vimTextarea.readOnly = true
        this.vimCommand.readOnly = false
        this.vimCommand.value = ''
        this.vimSpan.innerText = 'Normal'
    }

    // command 입력 불가능, textarea 입력 가능 
    setInsertVim(){
        this.mode = INSERT
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

    // VIM을 닫으면서 지금까지의 내용 return
    closeVim(){
        this.vimDocument.classList.add('hide')
        this.termDocument.classList.remove('hide')

        const value = this.vimTextarea.value
        this.vimTextarea.value = ''
        this.vimCommand.value = ''
        return {
            file : this.workingFile, 
            fdata : value
        }
    }
}
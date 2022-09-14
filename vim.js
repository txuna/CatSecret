export class Vim{
    constructor(){
        this.vimDocument = document.querySelector('.vim')
        this.termDocument = document.querySelector(".terminal") 
        this.vimTextarea = document.querySelector('.vim textarea')
        this.vimCommand = document.querySelector('.command input')
        this.vimSpan = document.querySelector('.mode span')
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

    openVim(){
        this.vimDocument.classList.toggle('hide')
        this.termDocument.classList.toggle('hide')
        this.vimTextarea.focus()
        this.setNormalVim()
    }

    // VIM을 닫으면서 지금까지의 내용 return 
    closeVim(){
        this.vimDocument.classList.toggle('hide')
        this.termDocument.classList.toggle('hide')
        return this.vimTextarea.value
    }
}
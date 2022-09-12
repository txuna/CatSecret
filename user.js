export class User{
    constructor(cname, cuid, cpassword){
        this.name = cname
        this.uid = cuid
        this.password = cpassword
    }

    changePassword(newPassword){
        this.password = newPassword
    }
}
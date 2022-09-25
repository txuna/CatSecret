
export const LOW_SECURITY = 1
export const MIDDLE_SECURITY = 2
export const HIGH_SECURITY = 3

export const ALIGN_SIZE = 4

export const NONE_BIT = 0
export const WRITE_BIT = 1 
export const READ_BIT = 2

export const NOT_START = 0 
export const PROGRESSING = 1 
export const FIN = 2

export const PROCESS_RAM = {
    PortHack : 2,
    RootKit : 1.5
}

export const myComputerNode = {
    securityLevel : HIGH_SECURITY, 
    interface : {
        ip : '127.0.0.1',
        mac : 'AF:13:BF:38:37:C7', 
    },
    ports : [
        {
            num : 22, 
            status : true
        },{
            num : 3306,
            status : true
        },{
            num : 80,
            status : true
        }
    ],
    users : [
        {
            name : 'tuuna',
            password : 'tuuna1234',
            uid : 1001
        },{
            name : 'root',
            password : 'root1234', 
            uid : 1000
        },{
            name : 'guest',
            password : 'guest',
            uid : 1002
        }
    ],
    services:[
        {
            name : 'mail',
            status : true
        }
    ],
    os : {
        version : '1.3.2',
        name : 'Secure OS'
    },
    status:{
        ram : {
            name : 'Samsung DDR4 4G',
            size : 4
        },
        cpu : {
            name : 'Intel(R) Core(TM) i7-7700K @ 4.20GHz',
            size : 0
        },
        balance : 5000,
        hacking : 1,
        name : 'tuuna'
    }
}

export const computerNodeList = [
    {
        securityLevel : LOW_SECURITY, 
        interface : {
            ip : '13.23.27.8',
            mac : 'BF:18:AE:E8:27:C7', 
        },
        ports : [
            {
                num : 22, 
                status : true
            },{
                num : 3306,
                status : true
            },{
                num : 80,
                status : false
            }
        ],
        users : [
            {
                name : 'n00dles',
                password : 'n00dles',
                uid : 1001
            },{
                name : 'root',
                password : 'root1234', 
                uid : 1000
            },{
                name : 'guest',
                password : 'guest',
                uid : 1002
            }
        ],
        services:[
            {
                name : 'mail',
                status : true
            }
        ],
        os : {
            version : '1.1.7',
            name : 'Red Hat OS'
        }
    },
    {
        securityLevel : MIDDLE_SECURITY,
        interface : {
            ip : '72.38.171.9',
            mac : 'C2:F4:5E:E1:AC:F8', 
        },
        ports : [
            {
                num : 22, 
                status : false
            },{
                num : 3306,
                status : true
            },{
                num : 80,
                status : true
            }
        ],
        users : [
            {
                name : 'troy',
                password : 'troy',
                uid : 1001
            },{
                name : 'root',
                password : 'root1234', 
                uid : 1000
            },{
                name : 'guest',
                password : 'guest',
                uid : 1002
            }
        ],
        services:[
            {
                name : 'mail',
                status : false
            }
        ],
        os : {
            version : '1.1.2',
            name : 'Fedora OS'
        }
    }
]
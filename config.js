
export const LOW_SECURITY = 1
export const MIDDLE_SECURITY = 2
export const HIGH_SECURITY = 3

export const ALIGN_SIZE = 4

export const NONE_BIT = 0
export const WRITE_BIT = 1 
export const READ_BIT = 2

export const myComputerNode = {
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
    os : {
        version : '1.3.2',
        name : 'Secure OS'
    }
}

export const computerNodeList = [
    {
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
        os : {
            version : '1.1.7',
            name : 'Red Hat OS'
        }
    },
    {
        interface : {
            ip : '72.38.171.9',
            mac : 'C2:F4:5E:E1:AC:F8', 
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
        os : {
            version : '1.1.2',
            name : 'Fedora OS'
        }
    }
]
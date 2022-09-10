
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
    ]
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
        ]
    }
]
const Type = {
    TEXT: 1,
    NUMBER: 2,
    COLOR: 3,
    BOOLEAN: 4,
    LETTER: 5
}

const COMMANDS = [
    {
        example: "register item {itemName}",
        keyWords:{
            'en-US': ["register", "item", "enter", "load", "product", "select"],
            'ro-RO': ["înregistrează" , "item","itemul", "produs", "încarcă", "selectează","introdu"]
        },
        parameters: [ Type.TEXT ]
    },
    {
        example: "register item with plu {pluNumber} and Department {departmentNumber}",
        keyWords:{
            'en-US': ["register", "item", "enter", "load", "product", "select","ID","ID","department","department"],
            'ro-RO' : ["înregistrează" , "itemul","item", "produs","produsul", "încarcă", "selectează","introdu","ID","ID","departament","departament","departamentul"]
        },
        parameters: [ Type.NUMBER , Type.NUMBER ]
    },
    {
        example:"end of day report",
        keyWords:{
            'en-US':  ["report", "make", "calculate", "create", "end", "of", "day", "balance"],
            'ro-RO' : ["fă","raport","raportul","Z","sfârșit","sfârșitul","zi","final"]
        },
        parameters: []
    },
    {
        example:"refund transaction {transactionId}",
        keyWords:{
            'en-US':  ["refund", "void", "cancel", "transaction","transaction", "payment","ID"],
            'ro-RO' : [ "închide","închideți","înapoiază","înapoi", "banii", "rambursează","restituie","restituie","tranzacția","plata","ID"]
        },
        parameters: [ Type.NUMBER ]
    }
]
import DB from "./db.js"
import  {addMessagesinAllChannels} from "./dataInsertionHelper.js"

const noOfMessagesPerChannel = 1000


function timeMyScriptForInsertion(  ){

    const startTime =   Date.now()

    addMessagesinAllChannels()

    const endTime = Date.now()

    console.log(`Took ${ (endTime - startTime)/1000 } seconds` )



}

timeMyScriptForInsertion()
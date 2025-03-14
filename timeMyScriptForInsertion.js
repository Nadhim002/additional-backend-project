import DB from "./db.js"
import { addMessagesinAllChannels } from "./index.js"

function timeMyScriptForInsertion(){

    addMessagesinAllChannels(10000)

}

timeMyScriptForInsertion()
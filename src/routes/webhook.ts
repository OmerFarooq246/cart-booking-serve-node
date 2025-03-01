import express, {Request, Response} from  "express"
import { mongoConnect } from "../libs/mongodb"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

router.get("/", (req: Request, res: Response) => {
    try{
        if (req.query['hub.mode'] == 'subscribe' && req.query['hub.verify_token'] == process.env.VERIFY_TOKEN)
            res.status(200).send(req.query['hub.challenge'])
        else
            res.status(400).json({ name: "Invalid request" })
    }
    catch (error){
        console.log("error in webook GET: ", error)
        res.status(500).json({error: `error in webook GET: ${error}`})
    }
})

router.post("/", async (req: Request, res: Response) => {
    try {
        const client = await mongoConnect()
        const Messages = client?.db("Cart_Booking").collection("Messages")
        console.log("req.body: ", JSON.stringify(req.body))

        if (req?.body?.entry[0]?.changes[0]?.value?.messages){
            const body = req?.body?.entry[0]?.changes[0]?.value?.messages[0]
            let msg = ""
            const from_user = body?.from
            const type = body?.type

            if (type === "text")
                msg = body?.text?.body
            else if (type === "location")
                msg = body?.location
            else if (type === "interactive"){
                if (body?.interactive.type === "list_reply")
                    msg = body?.interactive?.list_reply?.id
                else
                    msg = body?.interactive?.button_reply?.id
            }   
            
            const msg_entry = {
                "from": from_user,
                "type": type,
                "msg": msg,
                "read": false,
                "timestamp": new Date()
            }
            console.log("msg_entry: ", msg_entry)
            const result = Messages?.insertOne(msg_entry)
            console.log("db result: ", result)
            await client?.close()
            res.status(200).json({ "message": "flow success" })
        }
        else{
            await client?.close()
            console.log("req of sent")
            res.status(200).json({ "message": "res of sent req" })
        }
    }
    catch (error){
        console.log("error in webook POST: ", error)
        res.status(500).json({error: `error in webook POST: ${error}`})
    }
})

export default router
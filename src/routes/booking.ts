import express, {Request, Response} from  "express"
import { mongoConnect } from "../libs/mongodb"
import { ObjectId } from "mongodb"

const router = express.Router()

router.get("/", async (req: Request, res: Response) => {
    try {
        const client = await mongoConnect()
        const Bookings = client?.db("Cart_Booking").collection("Bookings")
        const { booking_id } = req.query
        const id = typeof booking_id === "string" ? booking_id : undefined
        console.log("booking_id: ", booking_id)
        
        const booking = await Bookings?.findOne({ _id : new ObjectId(id) })
        if (booking){
            console.log("booking:", booking)
            if (booking.status === "used")
                res.status(409).json({error: "الحجز مستخدم مسبقًا."})
            else if (booking.status === "active"){
                const result = await Bookings?.updateOne({ _id: new ObjectId(id) }, { $set: { status: "used" } })
                console.log("result:", result)
                const res_json = {
                    "message": "تم تغيير حالة الحجز إلى مستخدم.",
                }
                await client?.close()
                res.status(200).json(res_json)
            }
            else
                await client?.close()
                res.status(409).json({"error": "Booking has an unknown status"})
        }
        else
            await client?.close()
            res.status(404).json({"error": "No booking found for the requested id"})
    }
    catch (error){
        console.log("error in booking endpoint: ", error)
        res.status(500).json({error: `error booking endpoint: ${error}`})
    }
})

export default router
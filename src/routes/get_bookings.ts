import express, {Request, Response} from  "express"
import { mongoConnect } from "../libs/mongodb"

const router = express.Router()

router.get("/", async (req: Request, res: Response) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        const client = await mongoConnect()
        const Bookings = client?.db("Cart_Booking").collection("Bookings")
        
        const bookings = await Bookings?.find({
            status: "used",
            timestamp: { $gte: sevenDaysAgo }, // Fetch only bookings from the last 7 days
        }).sort({ timestamp: -1 }).toArray()
        
        if (bookings){
            console.log("bookings:", bookings)
            await client?.close()
            res.status(200).json({ success: true, data: bookings })
        }
        else
            await client?.close()
            res.status(404).json({"error": "No booking found in the last 7 days"})
    }
    catch (error){
        console.log("error in get_booking endpoint: ", error)
        res.status(500).json({error: `error get_booking endpoint: ${error}`})
    }
})

export default router
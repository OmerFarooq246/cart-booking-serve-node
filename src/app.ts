import express, {Request, Response} from  "express"
import webhookRouter from "./routes/webhook"
import bookingRouter from "./routes/booking"
import getBookingsRouter from "./routes/get_bookings"
import qrRouter from "./routes/generate_qr"
import dotenv from "dotenv"

dotenv.config()

const app = express()
const port = 3000

app.use(express.json()) // Enable JSON body parsing

app.get("/", (req: Request, res: Response) => {
    res.status(200).json({root: "Jawla Cart Booking Node Server"})
})

app.use("/qr_codes", express.static("public/qr_codes"))
app.use("/webhook", webhookRouter)
app.use("/booking", bookingRouter)
app.use("/get_bookings", getBookingsRouter)
app.use("/generate_qr", qrRouter)

app.listen(port, () => {
    console.log(`Jawla node server running at port: ${port}`)
})
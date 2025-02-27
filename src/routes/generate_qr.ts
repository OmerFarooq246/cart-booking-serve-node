import express, {Request, Response} from  "express"
import QRCode from 'qrcode';
import fs from 'fs';
import path from 'path';
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

router.post("/", async (req: Request, res: Response) => {
    try {
        const booking_id = req.body.booking_id
        if (booking_id){
            try{
                const fileName = `${booking_id}.png`
                const img_path = path.join(process.cwd(), 'public/qr_codes', fileName);
                const data = `${process.env.SERVE}/api/booking?booking_id=${booking_id}`

                 // Check if the folder exists, if not, create it
                if (!fs.existsSync(path.join(process.cwd(), 'public/qr_codes'))) {
                    fs.mkdirSync(path.join(process.cwd(), 'public/qr_codes'), { recursive: true });
                }

                await QRCode.toFile(img_path, data, {
                    width: 300,
                    errorCorrectionLevel: 'H',
                });
                const qrUrl = `qr_codes/` + fileName;
                res.status(200).json({ qrUrl });
            }
            catch (error){
                console.log("error in generate_qr endpoint: ", error)
                res.status(500).json({error: `error in generating qr: ${error}`})
            }
        }
        else {
            console.log("error in generate_qr: booking id not recieved")
            res.status(500).json({error: `error generate_qr endpoint: booking id not recieved`})
        }
    }
    catch (error){
        console.log("error in generate_qr endpoint: ", error)
        res.status(500).json({error: `error generate_qr endpoint: ${error}`})
    }
})

export default router
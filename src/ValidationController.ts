import express from "express"
import dotenv from "dotenv"
import { sendValidationCode } from "./lib/EmailSender.js"
import prisma from "./lib/client.js"

dotenv.config()

const router = express.Router()

// POST request handler
router.post("/", async (req, res) => {
  const { email } = req.body
  // send validation code
  const generatedCode = sendValidationCode({
    to: email,
    subject: "Your verification code"
  })
  // If successfully sent, insert a record in table user_validation:bookkeeper through Prisma
  if (generatedCode) {
    // insert a record in table user_validation:bookkeeper through Prisma
    async function main() {
      const user = await prisma.user_validation.create({
        data: {
          user_email: email,
          validation_code: generatedCode
        }
      })
      console.log(user)
    }

    main()
      .then(async () => {
        await prisma.$disconnect()
      })
      .catch(async (e) => {
        console.error(e)
        await prisma.$disconnect()
        process.exit(1)
      })
    res.status(200).json({ success: true })
  } else {
    res.status(500).json({ error: "Failed to send verification code" })
  }
})

export default router

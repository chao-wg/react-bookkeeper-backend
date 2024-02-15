import prisma from "./client.js"

type User = {
  email: string
}
// no resister function implemented yet in this project yet,
// unknown email sign in will be inserted directly into table: user_info
// export a function to be called outside to insert user into table: user_info if email not existed in table
export async function insertUser(user: User) {
  const { email } = user
  try {
    const userExist = await prisma.user_info.findFirst({
      where: {
        email: email
      }
    })
    if (!userExist) {
      await prisma.user_info.create({
        data: {
          email: email
        }
      })
    }
  } catch (error) {
    throw new Error("An error occurred while signing in user")
  }
}

import { User } from "../modals/user.modal.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asynchandler.js";




const generateAccessAndRefreshToken = async(userId)=>
{
   try {
    const user = await User.findById(userId)
    const accessToken = user.generateAccessToken()
    const refreshToken = user.generateRefreshToken()

    user.refreshToken = refreshToken;
    await user.save({validateBeforeSave:false})
    return {accessToken,refreshToken}

   } catch (error) {
    throw new ApiError(500,"something went wrong while generating access and refresh token")
   }
}

const registerUser = asyncHandler(async (req,res) => {

const {username,fullName,password,eamil}= req.body;

if([username,fullName,eamil,password].some((opt)=>opt?.trim()===""))
    {
        throw new ApiError(400,"All field are required")
    }
const existedUser = await User.findOne({
    $or:[{username}, {eamil}]
})

if(existedUser)
    {
        throw new ApiError(400,"user already exist")
    }

    const user = await User.create({
        username,
        password,
        eamil,
        fullName
    })

    const createdUser = await User.findById(user._id).select("-password")

    return res.status(200).json(
        new ApiResponse(200,createdUser,"user registerd successfully")
    )

})

const loginUser = asyncHandler(async(req,res) => {
    const {username , eamil , password}= req.body;

    if(!username && !eamil)
        {
            throw new ApiError(400 , "username or email is required")
        }
    
      const user = await  User.findOne({
            $or:[{username},{eamil}]
        })

        if(!user)
            {
                throw new ApiError(404 , "user does not exist")
            }

      const isPasswordValid = user.isPasswordCorrect(password)
      if(!isPasswordValid)
        {
            throw new ApiError(404 , "password is required")
        }

        const {accessToken,refreshToken} =await generateAccessAndRefreshToken(user._id);

      const loggedIn = await User.findById(user._id).select("-password -refreshToken")


      const options = {
        httpOnly:true,
        secure:true
      }

      return res.
      status(200)
      .cookie("accessToken",accessToken,options)
      .cookie("refreshToken",refreshToken,options)
      .json(
        new ApiResponse(200,{user: loggedIn,accessToken,refreshToken},"user logged in successfully")
      )

})

const logoutUser = asyncHandler(async(req,res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    {
        $set:{refreshToken:undefined}
    },
    {new:true})

const options={
    httpOnly:true,
    secure:true
}

return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(new ApiResponse(200 , {} , "user logout successfully"))
});

const refreshAccessToken=asyncHandler(async (req,res) => {
   const incomingRefreshToken =  req.cookies.refreshToken || req.body.refreshToken
})
export {registerUser,loginUser,logoutUser}
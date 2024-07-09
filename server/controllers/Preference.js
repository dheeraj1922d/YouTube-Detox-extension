const User = require("../database/User");

exports.getPreferences = async (req, res) => {
  try{
    const email = req.params.email;

  const user = await User.findOne({ email: email });

  if (!user) {
    console.log("User not found");
    return res.json({
      message: "User not found",
      success: false,
    });
  }

  console.log("User found: ", user);

  return res.status(200).json({
    success: true,
    email: user.email,
    topics: user.topics
  });
  }catch(err){
    console.log(err);
    res.json({
      message: err.message,
      success: false,
    })
  }
};


exports.savePreferences = async (req, res) => {
  const { email, topics } = req.body;
  
  try{
    const user = await User.findOneAndUpdate(
        { email: email },
        { $push: { topics: { $each: topics } } }, // Use $each to push multiple items
        { upsert: true, new: true }, // this will create new entry if user is not found
      );

      if(!user){
        console.log("User not found");
        return res.json({
          message: err.message,
          success: false,
        });
      }

      console.log("User found: ", user);

      return res.status(200).send(user);
    
  }catch(err){
    console.log(err);
    res.json({
      message: err.message,
      success: false,
    })
  }
  
};


exports.deletePreferences= async(req , res)=>{
  try{
    const {email} = req.params;
    const {topic} = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }

    if (!topic) {
      return res.status(400).json({
        message: "Topic is required",
        success: false,
      });
    }

    const user = await User.findOneAndUpdate(
      { email: email },
      { $pull: { topics: topic } },
      { new: true }
    )

    if(!user){
      return res.json({
        message: "User not found",
        success: false,
      })
    }

    console.log("User found in delete: ", user);

    return res.status(200).json({
      message: "Topic deleted successfully",
      topics: user.topics,
      success: true,
    });
  }catch(err){
    console.log(err);
    res.json({
      message: err.message,
      success: false,
    })
  }
}

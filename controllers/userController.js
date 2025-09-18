import Task from "../models/Task.js";
import User from "../models/User.js";



const getUsers = async (req, res) => {
  try {
    const users = await User.find({role: "member"}).select("-password");

    //Add task count to each user
    const userWithTaskCount = await Promise.all(users.map(async (user) => {
    const pendingTasks = await Task.countDocuments({ assignedTo: user._id, status: "Pending" });
    const inProgressTasks = await Task.countDocuments({ assignedTo: user._id, status: "In Progress" });
    const completedTasks = await Task.countDocuments({ assignedTo: user._id, status: "Completed" });


    return {
          ...user._doc, // Include all existing user data
          taskCount: {
            pending: pendingTasks,
            inProgress: inProgressTasks,
            completed: completedTasks
          }
        };
    }));

    res.json(userWithTaskCount);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


const getUserById = async (req, res) => {
  try {
   const user = await User.findById(req.params.id).select("-password");

   if (!user) {
      return res.status(404).json({ message: "User not found", error: error.message });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteUser = async (req, res) =>{
  try{
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    await user.remove();
    res.json({ message: "User deleted successfully" });
  }catch(error){
    res.status(500).json({message: "Server Error", Error: error})
  }
}


export  {
  getUsers,
  getUserById,
  deleteUser
};

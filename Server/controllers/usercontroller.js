import sql from "../config/db.js";

export const getUserCreations = async (req, res) => {
  try {
    const { userId } = req.auth();

    const creations = await sql`
      SELECT * FROM creations
      WHERE user_id = ${userId}
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching user creations:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const getPublicCreations = async (req, res) => {
  try {
    const creations = await sql`
      SELECT * FROM creations
      WHERE publish = true
      ORDER BY created_at DESC
    `;

    res.json({ success: true, creations });
  } catch (error) {
    console.error("Error fetching public creations:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};




export const Togglecreation = async (req, res) => {
  try {
    const { userId } = req.auth();
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ success: false, message: "Missing creation ID" });
    }

    const [creation] = await sql`
      SELECT * FROM creations
      WHERE id = ${id}
    `;

    if (!creation) {
      return res.status(404).json({ success: false, message: "Creation not found" });
    }

    const currentLikes = creation.likes || [];
    const userIdStr = userId.toString();

    let updatedLikes;
    let message;

    if (currentLikes.includes(userIdStr)) {
      updatedLikes = currentLikes.filter((uid) => uid !== userIdStr);
      message = "Creation unliked";
    } else {
      updatedLikes = [...currentLikes, userIdStr];
      message = "Creation liked";
    }

    // Format array for PostgreSQL text[]
    const formattedArray = `{${updatedLikes.join(',')}}`;

    await sql`
      UPDATE creations
      SET likes = ${formattedArray}::text[]
      WHERE id = ${id}
    `;

    res.json({ success: true, message, likes: updatedLikes });
  } catch (error) {
    console.error("Error toggling like on creation:", error.message);
    res.status(500).json({ success: false, message: error.message });
  }
};


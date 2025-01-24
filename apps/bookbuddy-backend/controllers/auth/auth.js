const bcrypt = require('bcrypt');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const jwt = require('jsonwebtoken');

const createUser = async (req, res) => {
    try {
      console.log("createUser called");
      console.log(req.body);

        const {email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: "Please provide an email and password" });
        }

        // Check if the user already exists
        const existingUser = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // Hash the password
  
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create the new user
        const newUser = await prisma.user.create({
            data: {
                email: email,
                password: hashedPassword
            },
            select: {
              id: true,
              email: true,
          }
      });

  
      
      // Generate JWT token
      const token = jwt.sign({ UserId: newUser.id, email: newUser.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
      console.log("signed up successfully!");
      res.json({ 
        result: newUser,
        token: token,
        message: "signed up successfully!" 
      
      });

    } catch (err) {
      console.error("Error creating new user:", err);
      res.status(500).json({ message: "Error adding new user", error: err.message });
    }
  };
  
    
  const login = async (req, res) => {
    try {
        const { email, password } = req.body; 
        console.log("Login called");
  
        if (!email || !password) {
            return res.status(400).json({ message: "Please provide either an email or a phone number and password" });
        }
  
        // Check if the user exists
        const user = await prisma.user.findUnique({
            where: {
                email: email
            }
        });

        if (!user) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Check if the password is correct
        const passwordValid = await bcrypt.compare(password, user.password);
        if (!passwordValid) {
            return res.status(401).json({ message: "Invalid email or password" });
        }

        // Generate JWT token
        const token = jwt.sign({ UserId: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
        console.log("Logged in successfully!");
        res.json({ 
          result: user,
          token: token,
          message: "Logged in successfully!" 
        
        });


    } catch (err) {
        console.error("Error logging in:", err);
        res.status(500).json({ message: "Error logging in" });
    }
  };

  
  

module.exports = {
    createUser,
    login,
};

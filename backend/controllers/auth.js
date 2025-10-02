const User = require('../models/user');


const crypto = require('crypto')
const cloudinary = require('cloudinary')
const sendEmail = require('../utils/sendEmail')

exports.registerUser = async (req, res, next) => {
    try {
        console.log(req.body);
        console.log(req.file);

        const { name, email, password } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide name, email, and password'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        let avatar = {
            public_id: 'default_avatar',
            url: '/images/default_avatar.jpg'
        };

        // Handle avatar upload if provided
        if (req.file) {
            try {
                const result = await cloudinary.v2.uploader.upload(req.file.path, {
                    folder: 'avatars',
                    width: 150,
                    crop: "scale"
                });
                
                avatar = {
                    public_id: result.public_id,
                    url: result.secure_url
                };
            } catch (uploadError) {
                console.log('Cloudinary upload error:', uploadError);
                // Continue with default avatar if upload fails
            }
        } else if (req.body.avatar && req.body.avatar !== '') {
            try {
                const result = await cloudinary.v2.uploader.upload(req.body.avatar, {
                    folder: 'avatars',
                    width: 150,
                    crop: "scale"
                });
                
                avatar = {
                    public_id: result.public_id,
                    url: result.secure_url
                };
            } catch (uploadError) {
                console.log('Cloudinary upload error:', uploadError);
                // Continue with default avatar if upload fails
            }
        }

        const user = await User.create({
            name,
            email,
            password,
            avatar
        });

        const token = user.getJwtToken();

        return res.status(201).json({
            success: true,
            user,
            token
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
}

exports.loginUser = async (req, res, next) => {
    try {
        console.log('Login request received:', req.body);
        const { email, password } = req.body;

        // Checks if email and password is entered by user
        if (!email || !password) {
            console.log('Missing email or password');
            return res.status(400).json({ 
                success: false,
                message: 'Please enter email & password' 
            });
        }

        // Finding user in database
        console.log('Looking for user with email:', email);
        let user = await User.findOne({ email }).select('+password');
        if (!user) {
            console.log('User not found');
            return res.status(401).json({ 
                success: false,
                message: 'Invalid Email or Password' 
            });
        }

        console.log('User found, checking password');
        // Checks if password is correct or not
        const isPasswordMatched = await user.comparePassword(password);

        if (!isPasswordMatched) {
            console.log('Password does not match');
            return res.status(401).json({ 
                success: false,
                message: 'Invalid Email or Password' 
            });
        }

        console.log('Password matched, generating token');
        const token = user.getJwtToken();

        console.log('Login successful');
        res.status(200).json({
            success: true,
            token,
            user
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: error.message || 'Server Error'
        });
    }
}

exports.forgotPassword = async (req, res, next) => {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return res.status(404).json({ error: 'User not found with this email' })

    }
    // Get reset token
    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });
    // Create reset password url
    const resetUrl = `${req.protocol}://localhost:5173/password/reset/${resetToken}`;
    const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`
    try {
        await sendEmail({
            email: user.email,
            subject: 'ShopIT Password Recovery',
            message
        })

        res.status(200).json({
            success: true,
            message: `Email sent to: ${user.email}`
        })

    } catch (error) {
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save({ validateBeforeSave: false });
        return res.status(500).json({ error: error.message })
      
    }
}
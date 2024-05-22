const jwt = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET;

const accessToken = [
    (req, res, next) => {
        const token = req.cookies.accessToken;

        try {
            jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (error, user) => {
                if (error.name === 'JsonWebTokenError') {
                    console.log("Token Undefined!");

                    return res.status(401).json({ 
                        status: 401,
                        message: 'Invalid access token! Login into your account!', 
                        error });
                }
                
                if (error.name === 'TokenExpiredError') {
                    console.log("Token Expired!");

                    return refreshToken(req, res, () => {
                        if (!req.user) {
                            return res.status(500).json({ 
                                status: 500,
                                message: 'Unable to refresh access token!' });
                        }
                        next();
                    });
                }

                req.user = user;
                next();
            });
        } catch (error) {
            res.clearCookie("accessToken");
            return res.status(500).json({ 
                status: 500,
                message: 'Unable to get the access token!', 
                error });
        }
    }
];

const refreshToken = (req, res, next) => {
    try {
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) {
            return res.status(401).json({ 
                status: 401,
                message: 'Refresh token not provided! Login into your account!' });
        }

        jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (error, user) => {
            if (error) {
                return res.status(403).json({ 
                    status: 403,
                    message: 'Invalid refresh token!', error });
            }

            const accessToken = jwt.sign({ id: user.id, email: user.email }, ACCESS_TOKEN_SECRET, { expiresIn: '1s' });
            res.cookie('accessToken', accessToken, {
                httpOnly: true,
            });

            console.log("Token Refreshed!");
            req.user = user;
            next();
        });
    } catch (error) {
        res.status(500).json({ 
            status: 500,
            message: 'Unable to refresh access token!', error });
    }
};

module.exports = {
    accessToken,
}
const handleError = (err, req, res, next) => {
    res.status(500).send('Something went wrong');
    next();
};

export default handleError;

import { body, param, validationResult } from "express-validator";

// @route  : /api/user/register
function signUpValidator() {
    return [
        body('fname')
            .isLength({ min: 3 }).withMessage('fname must be a string with at least 3 characters.'),

        body('email')
            .isEmail().withMessage('Invalid email.'),

        body('password')
            .isAlphanumeric().withMessage('password must be alphanumeric.')
            .isLength({ min: 8, max: 16 }).withMessage('password must be a string with 8 to 16 characters.'),

        body('phone')
            .isMobilePhone('en-IN', { strictMode: true })
            .withMessage('The phone number must have 10 digits following +91 country code.')
    ];
}

// @route  : /api/user/login
function logInValidator() {
    return [
        body('email')
            .isEmail().withMessage('Invalid email.'),

        body('password')
            .notEmpty().withMessage('Enter your password.')
    ];
}

// Re-used in addTaskValidator and editTaskValidator
function taskValidator() {
    return [
        body('task')
            .isLength({ min: 5 }).withMessage('task must be a string with at least 5 characters.'),

        body('deadline')
            .custom((dateString, { req }) => {

                // Verify Deadline String
                if (isNaN(Date.parse(dateString))) {
                    return false;
                }
                const
                    deadline = new Date(dateString),
                    currDate = new Date(),
                    diffInMs = deadline - currDate,
                    diffInMins = diffInMs / (1000 * 60),
                    diffInDays = diffInMins / (60 * 24);

                if (diffInMins > 2 && diffInDays <= 30) return true;
                else return false;
            })
            .withMessage('Deadline cannot be backdated, within the next 15 mins, or beyond 30 days.')
    ];
}

// @route : /api/tasks/add
function addTaskValidator() {
    return taskValidator();
}

// @route : /api/tasks/edit/:taskid
function editTaskValidator() {
    return [
        ...taskValidator(),

        body('status')
            .isBoolean().withMessage('status must be true or false.')
    ];
}

// @route : /api/tasks/edit/:taskid
function taskIdValidator() {
    return param('taskid')
        .isLength({ min: 24, max: 24 }).withMessage('taskid must be a 24-character hex string.');
}

// Validation Error Middleware
function validationErrorHandler(req, res, next) {
    const reqErrors = validationResult(req);

    if (!reqErrors.isEmpty()) {
        return res.status(400).json(reqErrors);
    }
    next();
}

export { signUpValidator, logInValidator, addTaskValidator, editTaskValidator, taskIdValidator, validationErrorHandler };
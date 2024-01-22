export const createUserSchema = {
    id: '/createUserSchema',
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        },
        role: {
            type: 'string'
        },
    },
    additionalProperties: false,
    required: ['name', 'email', 'password', 'role'],
};

export const loginUserSchema = {
    id: '/loginUserSchema',
    type: 'object',
    properties: {
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        },
    },
    additionalProperties: false,
    required: ['email', 'password'],
};

export const updateUserSchema = {
    id: '/updateUserSchema',
    type: 'object',
    properties: {
        name: {
            type: 'string',
        },
        email: {
            type: 'string',
            format: 'email'
        },
        password: {
            type: 'string'
        },
        role: {
            type: 'string'
        },
    },
    additionalProperties: false,
    validateRequired: {
        type: 'any',
        required: true,
    },
};
